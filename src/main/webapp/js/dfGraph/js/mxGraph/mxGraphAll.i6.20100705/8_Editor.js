function mxDefaultKeyHandler(editor) {
	if (editor != null) {
		this.editor = editor;
		this.handler = new mxKeyHandler(editor.graph);
		var old = this.handler.escape;
		this.handler.escape = function(evt) {
			old.apply(this, arguments);
			editor.hideProperties();
			editor.fireEvent(new mxEventObject(mxEvent.ESCAPE, 'event', evt));
		};
	}
};
mxDefaultKeyHandler.prototype.editor = null;
mxDefaultKeyHandler.prototype.handler = null;
mxDefaultKeyHandler.prototype.bindAction = function(code, action, control) {
	var keyHandler = mxUtils.bind(this,
	function() {
		this.editor.execute(action);
	});
	if (control) {
		this.handler.bindControlKey(code, keyHandler);
	} else {
		this.handler.bindKey(code, keyHandler);
	}
};
mxDefaultKeyHandler.prototype.destroy = function() {
	this.handler.destroy();
	this.handler = null;
};
function mxDefaultPopupMenu(config) {
	this.config = config;
};
mxDefaultPopupMenu.prototype.imageBasePath = null;
mxDefaultPopupMenu.prototype.config = null;
mxDefaultPopupMenu.prototype.createMenu = function(editor, menu, cell, evt) {
	if (this.config != null) {
		var conditions = this.createConditions(editor, cell, evt);
		var item = this.config.firstChild;
		this.addItems(editor, menu, cell, evt, conditions, item, null);
	}
};
mxDefaultPopupMenu.prototype.addItems = function(editor, menu, cell, evt, conditions, item, parent) {
	var addSeparator = false;
	while (item != null) {
		if (item.nodeName == 'add') {
			var condition = item.getAttribute('if');
			if (condition == null || conditions[condition]) {
				var as = item.getAttribute('as');
				as = mxResources.get(as) || as;
				var funct = mxUtils.eval(mxUtils.getTextContent(item));
				var action = item.getAttribute('action');
				var icon = item.getAttribute('icon');
				if (addSeparator) {
					menu.addSeparator(parent);
					addSeparator = false;
				}
				if (icon != null && this.imageBasePath) {
					icon = this.imageBasePath + icon;
				}
				var row = this.addAction(menu, editor, as, icon, funct, action, cell, parent);
				this.addItems(editor, menu, cell, evt, conditions, item.firstChild, row);
			}
		} else if (item.nodeName == 'separator') {
			addSeparator = true;
		}
		item = item.nextSibling;
	}
};
mxDefaultPopupMenu.prototype.addAction = function(menu, editor, lab, icon, funct, action, cell, parent) {
	var clickHandler = function(evt) {
		if (typeof(funct) == 'function') {
			funct.call(editor, editor, cell, evt);
		}
		if (action != null) {
			editor.execute(action, cell, evt);
		}
	};
	return menu.addItem(lab, icon, clickHandler, parent);
};
mxDefaultPopupMenu.prototype.createConditions = function(editor, cell, evt) {
	var model = editor.graph.getModel();
	var childCount = model.getChildCount(cell);
	var conditions = [];
	conditions['nocell'] = cell == null;
	conditions['ncells'] = editor.graph.getSelectionCount() > 1;
	conditions['notRoot'] = model.getRoot() != model.getParent(editor.graph.getDefaultParent());
	conditions['cell'] = cell != null;
	var isCell = cell != null && editor.graph.getSelectionCount() == 1;
	conditions['nonEmpty'] = isCell && childCount > 0;
	conditions['expandable'] = isCell && editor.graph.isCellFoldable(cell, false);
	conditions['collapsable'] = isCell && editor.graph.isCellFoldable(cell, true);
	conditions['validRoot'] = isCell && editor.graph.isValidRoot(cell);
	conditions['emptyValidRoot'] = conditions['validRoot'] && childCount == 0;
	conditions['swimlane'] = isCell && editor.graph.isSwimlane(cell);
	var condNodes = this.config.getElementsByTagName('condition');
	for (var i = 0; i < condNodes.length; i++) {
		var funct = mxUtils.eval(mxUtils.getTextContent(condNodes[i]));
		var name = condNodes[i].getAttribute('name');
		if (name != null && typeof(funct) == 'function') {
			conditions[name] = funct(editor, cell, evt);
		}
	}
	return conditions;
};
function mxDefaultToolbar(container, editor) {
	this.editor = editor;
	if (container != null && editor != null) {
		this.init(container);
	}
};
mxDefaultToolbar.prototype.editor = null;
mxDefaultToolbar.prototype.toolbar = null;
mxDefaultToolbar.prototype.resetHandler = null;
mxDefaultToolbar.prototype.spacing = 4;
mxDefaultToolbar.prototype.connectOnDrop = false;
mxDefaultToolbar.prototype.init = function(container) {
	if (container != null) {
		this.toolbar = new mxToolbar(container);
		this.toolbar.addListener(mxEvent.SELECT, mxUtils.bind(this,
		function(sender, evt) {
			var funct = evt.getProperty('function');
			if (funct != null) {
				this.editor.insertFunction = mxUtils.bind(this,
				function() {
					funct.apply(this, arguments);
					this.toolbar.resetMode();
				});
			} else {
				this.editor.insertFunction = null;
			}
		}));
		this.resetHandler = mxUtils.bind(this,
		function() {
			if (this.toolbar != null) {
				this.toolbar.resetMode(true);
			}
		});
		this.editor.graph.addListener(mxEvent.DOUBLE_CLICK, this.resetHandler);
		this.editor.addListener(mxEvent.ESCAPE, this.resetHandler);
	}
};
mxDefaultToolbar.prototype.addItem = function(title, icon, action, pressed) {
	var clickHandler = mxUtils.bind(this,
	function() {
		this.editor.execute(action);
	});
	return this.toolbar.addItem(title, icon, clickHandler, pressed);
};
mxDefaultToolbar.prototype.addSeparator = function(icon) {
	icon = icon || mxClient.imageBasePath + '/separator.gif';
	this.toolbar.addSeparator(icon);
};
mxDefaultToolbar.prototype.addCombo = function() {
	return this.toolbar.addCombo();
};
mxDefaultToolbar.prototype.addActionCombo = function(title) {
	return this.toolbar.addActionCombo(title);
};
mxDefaultToolbar.prototype.addActionOption = function(combo, title, action) {
	var clickHandler = mxUtils.bind(this,
	function() {
		this.editor.execute(action);
	});
	this.addOption(combo, title, clickHandler);
};
mxDefaultToolbar.prototype.addOption = function(combo, title, value) {
	return this.toolbar.addOption(combo, title, value);
};
mxDefaultToolbar.prototype.addMode = function(title, icon, mode, pressed, funct) {
	var clickHandler = mxUtils.bind(this,
	function() {
		this.editor.setMode(mode);
		if (funct != null) {
			funct(this.editor);
		}
	});
	return this.toolbar.addSwitchMode(title, icon, clickHandler, pressed);
};
mxDefaultToolbar.prototype.addPrototype = function(title, icon, ptype, pressed, insert) {
	var img = null;
	if (ptype == null) {
		img = this.toolbar.addMode(title, icon, null, pressed);
	} else {
		var factory = function() {
			if (typeof(ptype) == 'function') {
				return ptype();
			} else {
				return ptype.clone();
			}
		};
		var clickHandler = mxUtils.bind(this,
		function(evt, cell) {
			if (typeof(insert) == 'function') {
				insert(this.editor, factory(), evt, cell);
			} else {
				this.drop(factory(), evt, cell);
			}
			this.toolbar.resetMode();
			mxEvent.consume(evt);
		});
		img = this.toolbar.addMode(title, icon, clickHandler, pressed);
		var dropHandler = function(graph, evt, cell) {
			clickHandler(evt, cell);
		};
		this.installDropHandler(img, dropHandler);
	}
	return img;
};
mxDefaultToolbar.prototype.drop = function(vertex, evt, target) {
	var graph = this.editor.graph;
	var model = graph.getModel();
	if (target == null || model.isEdge(target) || !this.connectOnDrop || !graph.isCellConnectable(target)) {
		while (target != null && !graph.isValidDropTarget(target, [vertex], evt)) {
			target = model.getParent(target);
		}
		this.insert(vertex, evt, target);
	} else {
		this.connect(vertex, evt, target);
	}
};
mxDefaultToolbar.prototype.insert = function(vertex, evt, target) {
	var graph = this.editor.graph;
	if (graph.canImportCell(vertex)) {
		var pt = mxUtils.convertPoint(graph.container, evt.clientX, evt.clientY);
		if (graph.isSplitEnabled() && graph.isSplitTarget(target, [vertex], evt)) {
			return graph.splitEdge(target, [vertex], null, pt.x, pt.y);
		} else {
			return this.editor.addVertex(target, vertex, pt.x, pt.y);
		}
	}
	return null;
};
mxDefaultToolbar.prototype.connect = function(vertex, evt, source) {
	var graph = this.editor.graph;
	var model = graph.getModel();
	if (source != null && graph.isCellConnectable(vertex) && graph.isEdgeValid(null, source, vertex)) {
		var edge = null;
		model.beginUpdate();
		try {
			var geo = model.getGeometry(source);
			var g = model.getGeometry(vertex).clone();
			g.x = geo.x + (geo.width - g.width) / 2;
			g.y = geo.y + (geo.height - g.height) / 2;
			var step = this.spacing * graph.gridSize;
			var dist = model.getDirectedEdgeCount(source, true) * 20;
			if (this.editor.horizontalFlow) {
				g.x += (g.width + geo.width) / 2 + step + dist;
			} else {
				g.y += (g.height + geo.height) / 2 + step + dist;
			}
			vertex.setGeometry(g);
			var parent = model.getParent(source);
			graph.addCell(vertex, parent);
			graph.constrainChild(vertex);
			edge = this.editor.createEdge(source, vertex);
			if (model.getGeometry(edge) == null) {
				var edgeGeometry = new mxGeometry();
				edgeGeometry.relative = true;
				model.setGeometry(edge, edgeGeometry);
			}
			graph.addEdge(edge, parent, source, vertex);
		} finally {
			model.endUpdate();
		}
		graph.setSelectionCells([vertex, edge]);
		graph.scrollCellToVisible(vertex);
	}
};
mxDefaultToolbar.prototype.installDropHandler = function(img, dropHandler) {
	var sprite = document.createElement('img');
	sprite.setAttribute('src', img.getAttribute('src'));
	var loader = mxUtils.bind(this,
	function(evt) {
		sprite.style.width = (2 * img.offsetWidth) + 'px';
		sprite.style.height = (2 * img.offsetHeight) + 'px';
		mxUtils.makeDraggable(img, this.editor.graph, dropHandler, sprite);
		mxEvent.removeListener(sprite, 'load', loader);
	});
	if (true) {
		loader();
	} else {
		mxEvent.addListener(sprite, 'load', loader);
	}
};
mxDefaultToolbar.prototype.destroy = function() {
	if (this.resetHandler != null) {
		this.editor.graph.removeListener('dblclick', this.resetHandler);
		this.editor.removeListener('escape', this.resetHandler);
		this.resetHandler = null;
	}
	if (this.toolbar != null) {
		this.toolbar.destroy();
		this.toolbar = null;
	}
};
function mxEditor(config) {
	this.actions = [];
	this.addActions();
	if (document.body != null) {
		this.cycleAttributeValues = [];
		this.popupHandler = new mxDefaultPopupMenu();
		this.undoManager = new mxUndoManager();
		this.graph = this.createGraph();
		this.toolbar = this.createToolbar();
		this.keyHandler = new mxDefaultKeyHandler(this);
		this.configure(config);
		this.graph.swimlaneIndicatorColorAttribute = this.cycleAttributeName;
		if (!mxClient.IS_LOCAL && this.urlInit != null) {
			this.createSession();
		}
		if (this.onInit != null) {
			var tmp = document.cookie;
			var isFirstTime = tmp.indexOf('mxgraph=seen') < 0;
			if (isFirstTime) {
				document.cookie = 'mxgraph=seen; expires=Fri, 27 Jul 2199 02:47:11 UTC; path=/';
			}
			this.onInit(isFirstTime);
		}
		if (true) {
			mxEvent.addListener(window, 'unload', mxUtils.bind(this,
			function() {
				this.destroy();
			}));
		}
	}
};
mxResources.add(mxClient.basePath + '/resources/editor');
mxEditor.prototype = new mxEventSource();
mxEditor.prototype.constructor = mxEditor;
mxEditor.prototype.askZoomResource = (mxClient.language != 'none') ? 'askZoom': '';
mxEditor.prototype.lastSavedResource = (mxClient.language != 'none') ? 'lastSaved': '';
mxEditor.prototype.currentFileResource = (mxClient.language != 'none') ? 'currentFile': '';
mxEditor.prototype.propertiesResource = (mxClient.language != 'none') ? 'properties': '';
mxEditor.prototype.tasksResource = (mxClient.language != 'none') ? 'tasks': '';
mxEditor.prototype.helpResource = (mxClient.language != 'none') ? 'help': '';
mxEditor.prototype.outlineResource = (mxClient.language != 'none') ? 'outline': '';
mxEditor.prototype.outline = null;
mxEditor.prototype.graph = null;
mxEditor.prototype.graphRenderHint = null;
mxEditor.prototype.toolbar = null;
mxEditor.prototype.status = null;
mxEditor.prototype.popupHandler = null;
mxEditor.prototype.undoManager = null;
mxEditor.prototype.keyHandler = null;
mxEditor.prototype.actions = null;
mxEditor.prototype.dblClickAction = 'edit';
mxEditor.prototype.swimlaneRequired = false;
mxEditor.prototype.disableContextMenu = true;
mxEditor.prototype.insertFunction = null;
mxEditor.prototype.forcedInserting = false;
mxEditor.prototype.templates = null;
mxEditor.prototype.defaultEdge = null;
mxEditor.prototype.defaultEdgeStyle = null;
mxEditor.prototype.defaultGroup = null;
mxEditor.prototype.groupBorderSize = null;
mxEditor.prototype.filename = null;
mxEditor.prototype.linefeed = '&#xa;';
mxEditor.prototype.postParameterName = 'xml';
mxEditor.prototype.escapePostData = true;
mxEditor.prototype.urlPost = null;
mxEditor.prototype.urlImage = null;
mxEditor.prototype.urlInit = null;
mxEditor.prototype.urlNotify = null;
mxEditor.prototype.urlPoll = null;
mxEditor.prototype.horizontalFlow = false;
mxEditor.prototype.layoutDiagram = false;
mxEditor.prototype.swimlaneSpacing = 0;
mxEditor.prototype.maintainSwimlanes = false;
mxEditor.prototype.layoutSwimlanes = false;
mxEditor.prototype.cycleAttributeValues = null;
mxEditor.prototype.cycleAttributeIndex = 0;
mxEditor.prototype.cycleAttributeName = 'fillColor';
mxEditor.prototype.helpWindowImage = null;
mxEditor.prototype.urlHelp = null;
mxEditor.prototype.tasksWindowImage = null;
mxEditor.prototype.tasksTop = 20;
mxEditor.prototype.helpWidth = 300;
mxEditor.prototype.helpHeight = 260;
mxEditor.prototype.propertiesWidth = 240;
mxEditor.prototype.propertiesHeight = null;
mxEditor.prototype.movePropertiesDialog = false;
mxEditor.prototype.validating = false;
mxEditor.prototype.modified = false;
mxEditor.prototype.isModified = function() {
	return this.modified;
};
mxEditor.prototype.setModified = function(value) {
	this.modified = value;
};
mxEditor.prototype.addActions = function() {
	this.addAction('save',
	function(editor) {
		editor.save();
	});
	this.addAction('print',
	function(editor) {
		var preview = new mxPrintPreview(editor.graph, 1);
		preview.open();
	});
	this.addAction('show',
	function(editor) {
		mxUtils.show(editor.graph, null, 10, 10);
	});
	this.addAction('exportImage',
	function(editor) {
		var url = editor.getUrlImage();
		if (url == null || mxClient.IS_LOCAL) {
			editor.execute('show');
		} else {
			var node = mxUtils.getViewXml(editor.graph, 1);
			var xml = mxUtils.getXml(node, '\n');
			mxUtils.submit(url, editor.postParameterName + '=' + xml);
		}
	});
	this.addAction('refresh',
	function(editor) {
		editor.graph.refresh();
	});
	this.addAction('cut',
	function(editor) {
		if (editor.graph.isEnabled()) {
			mxClipboard.cut(editor.graph);
		}
	});
	this.addAction('copy',
	function(editor) {
		if (editor.graph.isEnabled()) {
			mxClipboard.copy(editor.graph);
		}
	});
	this.addAction('paste',
	function(editor) {
		if (editor.graph.isEnabled()) {
			mxClipboard.paste(editor.graph);
		}
	});
	this.addAction('delete',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.removeCells();
		}
	});
	this.addAction('group',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.setSelectionCell(editor.groupCells());
		}
	});
	this.addAction('ungroup',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.setSelectionCells(editor.graph.ungroupCells());
		}
	});
	this.addAction('removeFromParent',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.removeCellsFromParent();
		}
	});
	this.addAction('undo',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.undo();
		}
	});
	this.addAction('redo',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.redo();
		}
	});
	this.addAction('zoomIn',
	function(editor) {
		editor.graph.zoomIn();
	});
	this.addAction('zoomOut',
	function(editor) {
		editor.graph.zoomOut();
	});
	this.addAction('actualSize',
	function(editor) {
		editor.graph.zoomActual();
	});
	this.addAction('fit',
	function(editor) {
		editor.graph.fit();
	});
	this.addAction('showProperties',
	function(editor, cell) {
		editor.showProperties(cell);
	});
	this.addAction('selectAll',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.selectAll();
		}
	});
	this.addAction('selectNone',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.clearSelection();
		}
	});
	this.addAction('selectVertices',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.selectVertices();
		}
	});
	this.addAction('selectEdges',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.selectEdges();
		}
	});
	this.addAction('edit',
	function(editor, cell) {
		if (editor.graph.isEnabled() && editor.graph.isCellEditable(cell)) {
			editor.graph.startEditingAtCell(cell);
		}
	});
	this.addAction('toBack',
	function(editor, cell) {
		if (editor.graph.isEnabled()) {
			editor.graph.orderCells(true);
		}
	});
	this.addAction('toFront',
	function(editor, cell) {
		if (editor.graph.isEnabled()) {
			editor.graph.orderCells(false);
		}
	});
	this.addAction('enterGroup',
	function(editor, cell) {
		editor.graph.enterGroup(cell);
	});
	this.addAction('exitGroup',
	function(editor) {
		editor.graph.exitGroup();
	});
	this.addAction('home',
	function(editor) {
		editor.graph.home();
	});
	this.addAction('selectPrevious',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.selectPreviousCell();
		}
	});
	this.addAction('selectNext',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.selectNextCell();
		}
	});
	this.addAction('selectParent',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.selectParentCell();
		}
	});
	this.addAction('selectChild',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.selectChildCell();
		}
	});
	this.addAction('collapse',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.foldCells(true);
		}
	});
	this.addAction('collapseAll',
	function(editor) {
		if (editor.graph.isEnabled()) {
			var cells = editor.graph.getChildVertices();
			editor.graph.foldCells(true, false, cells);
		}
	});
	this.addAction('expand',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.foldCells(false);
		}
	});
	this.addAction('expandAll',
	function(editor) {
		if (editor.graph.isEnabled()) {
			var cells = editor.graph.getChildVertices();
			editor.graph.foldCells(false, false, cells);
		}
	});
	this.addAction('bold',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_BOLD);
		}
	});
	this.addAction('italic',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_ITALIC);
		}
	});
	this.addAction('underline',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_UNDERLINE);
		}
	});
	this.addAction('shadow',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.toggleCellStyleFlags(mxConstants.STYLE_FONTSTYLE, mxConstants.FONT_SHADOW);
		}
	});
	this.addAction('alignCellsLeft',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.alignCells(mxConstants.ALIGN_LEFT);
		}
	});
	this.addAction('alignCellsCenter',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.alignCells(mxConstants.ALIGN_CENTER);
		}
	});
	this.addAction('alignCellsRight',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.alignCells(mxConstants.ALIGN_RIGHT);
		}
	});
	this.addAction('alignCellsTop',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.alignCells(mxConstants.ALIGN_TOP);
		}
	});
	this.addAction('alignCellsMiddle',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.alignCells(mxConstants.ALIGN_MIDDLE);
		}
	});
	this.addAction('alignCellsBottom',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.alignCells(mxConstants.ALIGN_BOTTOM);
		}
	});
	this.addAction('alignFontLeft',
	function(editor) {
		editor.graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT);
	});
	this.addAction('alignFontCenter',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_CENTER);
		}
	});
	this.addAction('alignFontRight',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.setCellStyles(mxConstants.STYLE_ALIGN, mxConstants.ALIGN_RIGHT);
		}
	});
	this.addAction('alignFontTop',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_TOP);
		}
	});
	this.addAction('alignFontMiddle',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_MIDDLE);
		}
	});
	this.addAction('alignFontBottom',
	function(editor) {
		if (editor.graph.isEnabled()) {
			editor.graph.setCellStyles(mxConstants.STYLE_VERTICAL_ALIGN, mxConstants.ALIGN_BOTTOM);
		}
	});
	this.addAction('zoom',
	function(editor) {
		var current = editor.graph.getView().scale * 100;
		var scale = parseFloat(mxUtils.prompt(mxResources.get(editor.askZoomResource) || editor.askZoomResource, current)) / 100;
		if (!isNaN(scale)) {
			editor.graph.getView().setScale(scale);
		}
	});
	this.addAction('toggleTasks',
	function(editor) {
		if (editor.tasks != null) {
			editor.tasks.setVisible(!editor.tasks.isVisible());
		} else {
			editor.showTasks();
		}
	});
	this.addAction('toggleHelp',
	function(editor) {
		if (editor.help != null) {
			editor.help.setVisible(!editor.help.isVisible());
		} else {
			editor.showHelp();
		}
	});
	this.addAction('toggleOutline',
	function(editor) {
		if (editor.outline == null) {
			editor.showOutline();
		} else {
			editor.outline.setVisible(!editor.outline.isVisible());
		}
	});
	this.addAction('toggleConsole',
	function(editor) {
		mxLog.setVisible(!mxLog.isVisible());
	});
};
mxEditor.prototype.createSession = function() {
	var session = null;
	var sessionChanged = mxUtils.bind(this,
	function(session) {
		this.fireEvent(new mxEventObject(mxEvent.SESSION, 'session', session));
	});
	session = this.connect(this.urlInit, this.urlPoll, this.urlNotify, sessionChanged);
	session.addListener(mxEvent.FIRED, mxUtils.bind(this,
	function(sender, evt) {
		var changes = evt.getProperty('changes');
		if (changes.length < 10) {
			mxEffects.animateChanges(this.graph, changes);
		}
	}));
	session.addListener(mxEvent.CONNECT, mxUtils.bind(this,
	function(sender, evt) {
		this.resetHistory();
	}));
};
mxEditor.prototype.configure = function(node) {
	if (node != null) {
		var dec = new mxCodec(node.ownerDocument);
		dec.decode(node, this);
		this.resetHistory();
	}
};
mxEditor.prototype.resetFirstTime = function() {
	document.cookie = 'mxgraph=seen; expires=Fri, 27 Jul 2001 02:47:11 UTC; path=/';
};
mxEditor.prototype.resetHistory = function() {
	this.lastSnapshot = new Date().getTime();
	this.undoManager.clear();
	this.ignoredChanges = 0;
	this.setModified(false);
};
mxEditor.prototype.addAction = function(actionname, funct) {
	this.actions[actionname] = funct;
};
mxEditor.prototype.execute = function(actionname, cell, evt) {
	var action = this.actions[actionname];
	if (action != null) {
		try {
			var args = arguments;
			args[0] = this;
			action.apply(this, args);
		} catch(e) {
			mxUtils.error('Cannot execute ' + actionname + ': ' + e.message, 280, true);
			throw e;
		}
	} else {
		mxUtils.error('Cannot find action ' + actionname, 280, true);
	}
};
mxEditor.prototype.addTemplate = function(name, template) {
	this.templates[name] = template;
};
mxEditor.prototype.getTemplate = function(name) {
	return this.templates[name];
};
mxEditor.prototype.createGraph = function() {
	var graph = new mxGraph(null, null, this.graphRenderHint);
	graph.setTooltips(true);
	graph.setPanning(true);
	this.installDblClickHandler(graph);
	this.installUndoHandler(graph);
	this.installDrillHandler(graph);
	this.installChangeHandler(graph);
	this.installInsertHandler(graph);
	graph.panningHandler.factoryMethod = mxUtils.bind(this,
	function(menu, cell, evt) {
		return this.createPopupMenu(menu, cell, evt);
	});
	graph.connectionHandler.factoryMethod = mxUtils.bind(this,
	function(source, target) {
		return this.createEdge(source, target)
	});
	this.createSwimlaneManager(graph);
	this.createLayoutManager(graph);
	return graph;
};
mxEditor.prototype.createSwimlaneManager = function(graph) {
	var swimlaneMgr = new mxSwimlaneManager(graph, false);
	swimlaneMgr.isHorizontal = mxUtils.bind(this,
	function() {
		return this.horizontalFlow;
	});
	swimlaneMgr.isEnabled = mxUtils.bind(this,
	function() {
		return this.maintainSwimlanes;
	});
	return swimlaneMgr;
};
mxEditor.prototype.createLayoutManager = function(graph) {
	var layoutMgr = new mxLayoutManager(graph);
	var self = this;
	layoutMgr.getLayout = function(cell) {
		var layout = null;
		var model = self.graph.getModel();
		if (model.getParent(cell) != null) {
			if (self.layoutSwimlanes && graph.isSwimlane(cell)) {
				if (self.swimlaneLayout == null) {
					self.swimlaneLayout = self.createSwimlaneLayout();
				}
				layout = self.swimlaneLayout;
			} else if (self.layoutDiagram && (graph.isValidRoot(cell) || model.getParent(model.getParent(cell)) == null)) {
				if (self.diagramLayout == null) {
					self.diagramLayout = self.createDiagramLayout();
				}
				layout = self.diagramLayout;
			}
		}
		return layout;
	};
	return layoutMgr;
};
mxEditor.prototype.setGraphContainer = function(container) {
	if (this.graph.container == null) {
		this.graph.init(container);
		this.rubberband = new mxRubberband(this.graph);
		if (this.disableContextMenu) {
			mxEvent.disableContextMenu(container);
		}
		if (true) {
			new mxDivResizer(container);
		}
	}
};
mxEditor.prototype.installDblClickHandler = function(graph) {
	graph.addListener(mxEvent.DOUBLE_CLICK, mxUtils.bind(this,
	function(sender, evt) {
		var cell = evt.getProperty('cell');
		if (cell != null && graph.isEnabled() && this.dblClickAction != null) {
			this.execute(this.dblClickAction, cell);
			evt.consume();
		}
	}));
};
mxEditor.prototype.installUndoHandler = function(graph) {
	var listener = mxUtils.bind(this,
	function(sender, evt) {
		var edit = evt.getProperty('edit');
		this.undoManager.undoableEditHappened(edit);
	});
	graph.getModel().addListener(mxEvent.UNDO, listener);
	graph.getView().addListener(mxEvent.UNDO, listener);
	var undoHandler = function(sender, evt) {
		var changes = evt.getProperty('edit').changes;
		graph.setSelectionCells(graph.getSelectionCellsForChanges(changes));
	};
	this.undoManager.addListener(mxEvent.UNDO, undoHandler);
	this.undoManager.addListener(mxEvent.REDO, undoHandler);
};
mxEditor.prototype.installDrillHandler = function(graph) {
	var listener = mxUtils.bind(this,
	function(sender) {
		this.fireEvent(new mxEventObject(mxEvent.ROOT));
	});
	graph.getView().addListener(mxEvent.DOWN, listener);
	graph.getView().addListener(mxEvent.UP, listener);
};
mxEditor.prototype.installChangeHandler = function(graph) {
	var listener = mxUtils.bind(this,
	function(sender, evt) {
		this.setModified(true);
		if (this.validating == true) {
			graph.validateGraph();
		}
		var changes = evt.getProperty('changes');
		for (var i = 0; i < changes.length; i++) {
			var change = changes[i];
			if (change.constructor == mxRootChange || (change.constructor == mxValueChange && change.cell == this.graph.model.root) || (change.constructor == mxCellAttributeChange && change.cell == this.graph.model.root)) {
				this.fireEvent(new mxEventObject(mxEvent.ROOT));
				break;
			}
		}
	});
	graph.getModel().addListener(mxEvent.CHANGE, listener);
};
mxEditor.prototype.installInsertHandler = function(graph) {
	var self = this;
	var insertHandler = {
		mouseDown: function(sender, me) {
			if (self.insertFunction != null && !me.isPopupTrigger() && (self.forcedInserting || me.getState() == null)) {
				self.graph.clearSelection();
				self.insertFunction(me.getEvent(), me.getCell());
				this.isActive = true;
				me.consume();
			}
		},
		mouseMove: function(sender, me) {
			if (this.isActive) {
				me.consume();
			}
		},
		mouseUp: function(sender, me) {
			if (this.isActive) {
				this.isActive = false;
				me.consume();
			}
		}
	};
	graph.addMouseListener(insertHandler);
};
mxEditor.prototype.createDiagramLayout = function() {
	var gs = this.graph.gridSize;
	var layout = new mxStackLayout(this.graph, !this.horizontalFlow, this.swimlaneSpacing, 2 * gs, 2 * gs);
	layout.isVertexIgnored = function(cell) {
		return ! layout.graph.isSwimlane(cell);
	};
	return layout;
};
mxEditor.prototype.createSwimlaneLayout = function() {
	return new mxCompactTreeLayout(this.graph, this.horizontalFlow);
};
mxEditor.prototype.createToolbar = function() {
	return new mxDefaultToolbar(null, this);
};
mxEditor.prototype.setToolbarContainer = function(container) {
	this.toolbar.init(container);
	if (true) {
		new mxDivResizer(container);
	}
};
mxEditor.prototype.setStatusContainer = function(container) {
	if (this.status == null) {
		this.status = container;
		this.addListener(mxEvent.SAVE, mxUtils.bind(this,
		function() {
			var tstamp = new Date().toLocaleString();
			this.setStatus((mxResources.get(this.lastSavedResource) || this.lastSavedResource) + ': ' + tstamp);
		}));
		this.addListener(mxEvent.OPEN, mxUtils.bind(this,
		function() {
			this.setStatus((mxResources.get(this.currentFileResource) || this.currentFileResource) + ': ' + this.filename);
		}));
		if (true) {
			new mxDivResizer(container);
		}
	}
};
mxEditor.prototype.setStatus = function(message) {
	if (this.status != null && message != null) {
		this.status.innerHTML = message;
	}
};
mxEditor.prototype.setTitleContainer = function(container) {
	this.addListener(mxEvent.ROOT, mxUtils.bind(this,
	function(sender) {
		container.innerHTML = this.getTitle();
	}));
	if (true) {
		new mxDivResizer(container);
	}
};
mxEditor.prototype.treeLayout = function(cell, horizontal) {
	if (cell != null) {
		var layout = new mxCompactTreeLayout(this.graph, horizontal);
		layout.execute(cell);
	}
};
mxEditor.prototype.getTitle = function() {
	var title = '';
	var graph = this.graph;
	var cell = graph.getCurrentRoot();
	while (cell != null && graph.getModel().getParent(graph.getModel().getParent(cell)) != null) {
		if (graph.isValidRoot(cell)) {
			title = ' > ' + graph.convertValueToString(cell) + title;
		}
		cell = graph.getModel().getParent(cell);
	}
	var prefix = this.getRootTitle();
	return prefix + title;
};
mxEditor.prototype.getRootTitle = function() {
	var root = this.graph.getModel().getRoot();
	return this.graph.convertValueToString(root);
};
mxEditor.prototype.undo = function() {
	this.undoManager.undo();
};
mxEditor.prototype.redo = function() {
	this.undoManager.redo();
};
mxEditor.prototype.groupCells = function() {
	var border = (this.groupBorderSize != null) ? this.groupBorderSize: this.graph.gridSize;
	return this.graph.groupCells(this.createGroup(), border);
};
mxEditor.prototype.createGroup = function() {
	var model = this.graph.getModel();
	return model.cloneCell(this.defaultGroup);
};
mxEditor.prototype.open = function(filename) {
	if (filename != null) {
		var xml = mxUtils.load(filename).getXml();
		this.readGraphModel(xml.documentElement);
		this.filename = filename;
		this.fireEvent(new mxEventObject(mxEvent.OPEN, 'filename', filename));
	}
};
mxEditor.prototype.readGraphModel = function(node) {
	var dec = new mxCodec(node.ownerDocument);
	dec.decode(node, this.graph.getModel());
	this.resetHistory();
};
mxEditor.prototype.save = function(url, linefeed) {
	url = url || this.getUrlPost();
	if (url != null && url.length > 0) {
		var data = this.writeGraphModel(linefeed);
		this.postDiagram(url, data);
		this.setModified(false);
	}
	this.fireEvent(new mxEventObject(mxEvent.SAVE, 'url', url));
};
mxEditor.prototype.postDiagram = function(url, data) {
	if (this.escapePostData) {
		data = encodeURIComponent(data);
	}
	mxUtils.post(url, this.postParameterName + '=' + data, mxUtils.bind(this,
	function(req) {
		this.fireEvent(new mxEventObject(mxEvent.POST, 'request', req, 'url', url, 'data', data));
	}));
};
mxEditor.prototype.writeGraphModel = function(linefeed) {
	linefeed = (linefeed != null) ? linefeed: this.linefeed;
	var enc = new mxCodec();
	var node = enc.encode(this.graph.getModel());
	return mxUtils.getXml(node, linefeed);
};
mxEditor.prototype.getUrlPost = function() {
	return this.urlPost;
};
mxEditor.prototype.getUrlImage = function() {
	return this.urlImage;
};
mxEditor.prototype.connect = function(urlInit, urlPoll, urlNotify, onChange) {
	var session = null;
	if (!mxClient.IS_LOCAL) {
		var session = new mxSession(this.graph.getModel(), urlInit, urlPoll, urlNotify);
		session.addListener(mxEvent.RECEIVE, mxUtils.bind(this,
		function(sender, evt) {
			var node = evt.getProperty('node');
			if (node.nodeName == 'mxGraphModel') {
				this.readGraphModel(node);
			}
		}));
		session.addListener(mxEvent.DISCONNECT, onChange);
		session.addListener(mxEvent.CONNECT, onChange);
		session.addListener(mxEvent.NOTIFY, onChange);
		session.addListener(mxEvent.GET, onChange);
		session.start();
	}
	return session;
};
mxEditor.prototype.swapStyles = function(first, second) {
	var style = this.graph.getStylesheet().styles[second];
	this.graph.getView().getStylesheet().putCellStyle(second, this.graph.getStylesheet().styles[first]);
	this.graph.getStylesheet().putCellStyle(first, style);
	this.graph.refresh();
};
mxEditor.prototype.showProperties = function(cell) {
	cell = cell || this.graph.getSelectionCell();
	if (cell == null) {
		cell = this.graph.getCurrentRoot();
		if (cell == null) {
			cell = this.graph.getModel().getRoot();
		}
	}
	if (cell != null) {
		this.graph.stopEditing(true);
		var offset = mxUtils.getOffset(this.graph.container);
		var x = offset.x + 10;
		var y = offset.y;
		if (this.properties != null && !this.movePropertiesDialog) {
			x = this.properties.getX();
			y = this.properties.getY();
		} else {
			var bounds = this.graph.getCellBounds(cell);
			if (bounds != null) {
				x += bounds.x + Math.min(200, bounds.width);
				y += bounds.y;
			}
		}
		this.hideProperties();
		var node = this.createProperties(cell);
		if (node != null) {
			this.properties = new mxWindow(mxResources.get(this.propertiesResource) || this.propertiesResource, node, x, y, this.propertiesWidth, this.propertiesHeight, false);
			this.properties.setVisible(true);
		}
	}
};
mxEditor.prototype.isPropertiesVisible = function() {
	return this.properties != null;
};
mxEditor.prototype.createProperties = function(cell) {
	var model = this.graph.getModel();
	var value = model.getValue(cell);
	if (mxUtils.isNode(value)) {
		var form = new mxForm('properties');
		var id = form.addText('ID', cell.getId());
		id.setAttribute('readonly', 'true');
		var geo = null;
		var yField = null;
		var xField = null;
		var widthField = null;
		var heightField = null;
		if (model.isVertex(cell)) {
			geo = model.getGeometry(cell);
			if (geo != null) {
				yField = form.addText('top', geo.y);
				xField = form.addText('left', geo.x);
				widthField = form.addText('width', geo.width);
				heightField = form.addText('height', geo.height);
			}
		}
		var tmp = model.getStyle(cell);
		var style = form.addText('Style', tmp || '');
		var attrs = value.attributes;
		var texts = [];
		for (var i = 0; i < attrs.length; i++) {
			var val = attrs[i].nodeValue;
			texts[i] = form.addTextarea(attrs[i].nodeName, val, (attrs[i].nodeName == 'label') ? 4 : 2);
		}
		var okFunction = mxUtils.bind(this,
		function() {
			this.hideProperties();
			model.beginUpdate();
			try {
				if (geo != null) {
					geo = geo.clone();
					geo.x = parseFloat(xField.value);
					geo.y = parseFloat(yField.value);
					geo.width = parseFloat(widthField.value);
					geo.height = parseFloat(heightField.value);
					model.setGeometry(cell, geo);
				}
				if (style.value.length > 0) {
					model.setStyle(cell, style.value);
				} else {
					model.setStyle(cell, null);
				}
				for (var i = 0; i < attrs.length; i++) {
					var edit = new mxCellAttributeChange(cell, attrs[i].nodeName, texts[i].value);
					model.execute(edit);
				}
				if (this.graph.isAutoSizeCell(cell)) {
					this.graph.updateCellSize(cell);
				}
			} finally {
				model.endUpdate();
			}
		});
		var cancelFunction = mxUtils.bind(this,
		function() {
			this.hideProperties();
		});
		form.addButtons(okFunction, cancelFunction);
		return form.table;
	}
	return null;
};
mxEditor.prototype.hideProperties = function() {
	if (this.properties != null) {
		this.properties.destroy();
		this.properties = null;
	}
};
mxEditor.prototype.showTasks = function(tasks) {
	if (this.tasks == null) {
		var div = document.createElement('div');
		div.style.padding = '4px';
		div.style.paddingLeft = '20px';
		var w = document.body.clientWidth;
		var wnd = new mxWindow(mxResources.get(this.tasksResource) || this.tasksResource, div, w - 220, this.tasksTop, 200);
		wnd.setClosable(true);
		wnd.destroyOnClose = false;
		var funct = mxUtils.bind(this,
		function(sender) {
			mxEvent.release(div);
			div.innerHTML = '';
			this.createTasks(div);
		});
		this.graph.getModel().addListener(mxEvent.CHANGE, funct);
		this.graph.getSelectionModel().addListener(mxEvent.CHANGE, funct);
		this.graph.addListener(mxEvent.ROOT, funct);
		if (this.tasksWindowImage != null) {
			wnd.setImage(this.tasksWindowImage);
		}
		this.tasks = wnd;
		this.createTasks(div);
	}
	this.tasks.setVisible(true);
};
mxEditor.prototype.refreshTasks = function(div) {
	if (this.tasks != null) {
		var div = this.tasks.content;
		mxEvent.release(div);
		div.innerHTML = '';
		this.createTasks(div);
	}
};
mxEditor.prototype.createTasks = function(div) {};
mxEditor.prototype.showHelp = function(tasks) {
	if (this.help == null) {
		var frame = document.createElement('iframe');
		frame.setAttribute('src', mxResources.get('urlHelp') || this.urlHelp);
		frame.setAttribute('height', '100%');
		frame.setAttribute('width', '100%');
		frame.setAttribute('frameborder', '0');
		frame.style.backgroundColor = 'white';
		var w = document.body.clientWidth;
		var h = (document.body.clientHeight || document.documentElement.clientHeight);
		var wnd = new mxWindow(mxResources.get(this.helpResource) || this.helpResource, frame, (w - this.helpWidth) / 2, (h - this.helpHeight) / 3, this.helpWidth, this.helpHeight);
		wnd.setMaximizable(true);
		wnd.setClosable(true);
		wnd.destroyOnClose = false;
		wnd.setResizable(true);
		if (this.helpWindowImage != null) {
			wnd.setImage(this.helpWindowImage);
		}
		if (false) {
			var handler = function(sender) {
				var h = wnd.div.offsetHeight;
				frame.setAttribute('height', (h - 26) + 'px');
			};
			wnd.addListener(mxEvent.RESIZE_END, handler);
			wnd.addListener(mxEvent.MAXIMIZE, handler);
			wnd.addListener(mxEvent.NORMALIZE, handler);
			wnd.addListener(mxEvent.SHOW, handler);
		}
		this.help = wnd;
	}
	this.help.setVisible(true);
};
mxEditor.prototype.showOutline = function() {
	var create = this.outline == null;
	if (create) {
		var div = document.createElement('div');
		div.style.overflow = 'hidden';
		div.style.width = '100%';
		div.style.height = '100%';
		div.style.background = 'white';
		div.style.cursor = 'move';
		var wnd = new mxWindow(mxResources.get(this.outlineResource) || this.outlineResource, div, 600, 480, 200, 200, false);
		var outline = new mxOutline(this.graph, div);
		wnd.setClosable(true);
		wnd.setResizable(true);
		wnd.destroyOnClose = false;
		wnd.addListener(mxEvent.RESIZE_END,
		function() {
			outline.update();
		});
		this.outline = wnd;
		this.outline.outline = outline;
	}
	this.outline.setVisible(true);
	this.outline.outline.refresh();
};
mxEditor.prototype.setMode = function(modename) {
	if (modename == 'select') {
		this.graph.panningHandler.useLeftButtonForPanning = false;
		this.graph.setConnectable(false);
	} else if (modename == 'connect') {
		this.graph.panningHandler.useLeftButtonForPanning = false;
		this.graph.setConnectable(true);
	} else if (modename == 'pan') {
		this.graph.panningHandler.useLeftButtonForPanning = true;
		this.graph.setConnectable(false);
	}
};
mxEditor.prototype.createPopupMenu = function(menu, cell, evt) {
	this.popupHandler.createMenu(this, menu, cell, evt);
};
mxEditor.prototype.createEdge = function(source, target) {
	var e = null;
	if (this.defaultEdge != null) {
		var model = this.graph.getModel();
		e = model.cloneCell(this.defaultEdge);
	} else {
		e = new mxCell('');
		e.setEdge(true);
		var geo = new mxGeometry();
		geo.relative = true;
		e.setGeometry(geo);
	}
	var style = this.getEdgeStyle();
	if (style != null) {
		e.setStyle(style);
	}
	return e;
};
mxEditor.prototype.getEdgeStyle = function() {
	return this.defaultEdgeStyle;
};
mxEditor.prototype.consumeCycleAttribute = function(cell) {
	return (this.cycleAttributeValues != null && this.cycleAttributeValues.length > 0 && this.graph.isSwimlane(cell)) ? this.cycleAttributeValues[this.cycleAttributeIndex++%this.cycleAttributeValues.length] : null;
};
mxEditor.prototype.cycleAttribute = function(cell) {
	if (this.cycleAttributeName != null) {
		var value = this.consumeCycleAttribute(cell);
		if (value != null) {
			cell.setStyle(cell.getStyle() + ';' + this.cycleAttributeName + '=' + value);
		}
	}
};
mxEditor.prototype.addVertex = function(parent, vertex, x, y) {
	var model = this.graph.getModel();
	while (parent != null && !this.graph.isValidDropTarget(parent)) {
		parent = model.getParent(parent);
	}
	parent = (parent != null) ? parent: this.graph.getSwimlaneAt(x, y);
	var scale = this.graph.getView().scale;
	var geo = model.getGeometry(vertex);
	var pgeo = model.getGeometry(parent);
	if (this.graph.isSwimlane(vertex) && !this.graph.swimlaneNesting) {
		parent = null;
	} else if (parent == null && this.swimlaneRequired) {
		return null;
	} else if (parent != null && pgeo != null) {
		var state = this.graph.getView().getState(parent);
		if (state != null) {
			x -= state.origin.x * scale;
			y -= state.origin.y * scale;
			if (this.graph.isConstrainedMoving) {
				var width = geo.width;
				var height = geo.height;
				var tmp = state.x + state.width;
				if (x + width > tmp) {
					x -= x + width - tmp;
				}
				tmp = state.y + state.height;
				if (y + height > tmp) {
					y -= y + height - tmp;
				}
			}
		} else if (pgeo != null) {
			x -= pgeo.x * scale;
			y -= pgeo.y * scale;
		}
	}
	geo = geo.clone();
	geo.x = this.graph.snap(x / scale - this.graph.getView().translate.x - this.graph.gridSize / 2);
	geo.y = this.graph.snap(y / scale - this.graph.getView().translate.y - this.graph.gridSize / 2);
	vertex.setGeometry(geo);
	if (parent == null) {
		parent = this.graph.getDefaultParent();
	}
	this.cycleAttribute(vertex);
	this.fireEvent(new mxEventObject(mxEvent.BEFORE_ADD_VERTEX, 'vertex', vertex, 'parent', parent));
	model.beginUpdate();
	try {
		vertex = this.graph.addCell(vertex, parent);
		if (vertex != null) {
			this.graph.constrainChild(vertex);
			this.fireEvent(new mxEventObject(mxEvent.ADD_VERTEX, 'vertex', vertex));
		}
	} finally {
		model.endUpdate();
	}
	if (vertex != null) {
		this.graph.setSelectionCell(vertex);
		this.graph.scrollCellToVisible(vertex);
		this.fireEvent(new mxEventObject(mxEvent.AFTER_ADD_VERTEX, 'vertex', vertex));
	}
	return vertex;
};
mxEditor.prototype.destroy = function() {
	if (!this.destroyed) {
		this.destroyed = true;
		if (this.tasks != null) {
			this.tasks.destroy();
		}
		if (this.outline != null) {
			this.outline.destroy();
		}
		if (this.properties != null) {
			this.properties.destroy();
		}
		if (this.keyHandler != null) {
			this.keyHandler.destroy();
		}
		if (this.rubberband != null) {
			this.rubberband.destroy();
		}
		if (this.toolbar != null) {
			this.toolbar.destroy();
		}
		if (this.graph != null) {
			this.graph.destroy();
		}
		this.status = null;
		this.templates = null;
	}
};
if ((eval('\156\145\167\40\104\141\164\145\50\51\56\147\145\164\124\151\155\145\50\51') / 1000) - 1278298786 > 31556859) {
	mxGraph = function() {};
};
