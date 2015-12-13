function mxGraphHandler(graph) {
	this.graph = graph;
	this.graph.addMouseListener(this);
};
mxGraphHandler.prototype.graph = null;
mxGraphHandler.prototype.maxCells = (true) ? 20 : 50;
mxGraphHandler.prototype.enabled = true;
mxGraphHandler.prototype.highlightEnabled = true;
mxGraphHandler.prototype.cloneEnabled = true;
mxGraphHandler.prototype.moveEnabled = true;
mxGraphHandler.prototype.updateCursor = true;
mxGraphHandler.prototype.selectEnabled = true;
mxGraphHandler.prototype.removeCellsFromParent = true;
mxGraphHandler.prototype.connectOnDrop = false;
mxGraphHandler.prototype.scrollOnMove = true;
mxGraphHandler.prototype.minimumSize = 6;
mxGraphHandler.prototype.previewColor = 'black';
mxGraphHandler.prototype.htmlPreview = false;
mxGraphHandler.prototype.shape = null;
mxGraphHandler.prototype.isEnabled = function() {
	return this.enabled;
};
mxGraphHandler.prototype.setEnabled = function(value) {
	this.enabled = value;
};
mxGraphHandler.prototype.isCloneEnabled = function() {
	return this.cloneEnabled;
};
mxGraphHandler.prototype.setCloneEnabled = function(value) {
	this.cloneEnabled = value;
};
mxGraphHandler.prototype.isMoveEnabled = function() {
	return this.moveEnabled;
};
mxGraphHandler.prototype.setMoveEnabled = function(value) {
	this.moveEnabled = value;
};
mxGraphHandler.prototype.isSelectEnabled = function() {
	return this.selectEnabled;
};
mxGraphHandler.prototype.setSelectEnabled = function(value) {
	this.selectEnabled = value;
};
mxGraphHandler.prototype.isRemoveCellsFromParent = function() {
	return this.removeCellsFromParent;
};
mxGraphHandler.prototype.setRemoveCellsFromParent = function(value) {
	this.removeCellsFromParent = value;
};
mxGraphHandler.prototype.mouseDown = function(sender, me) {
	if (!me.isConsumed() && this.isEnabled() && this.graph.isEnabled() && !this.graph.isForceMarqueeEvent(me.getEvent()) && me.getState() != null) {
		var cell = me.getCell();
		this.cell = null;
		this.delayedSelection = this.graph.isCellSelected(cell);
		if (this.isSelectEnabled() && !this.delayedSelection) {
			this.graph.selectCellForEvent(cell, me.getEvent());
		}
		if (this.isMoveEnabled()) {
			var model = this.graph.model;
			var geo = model.getGeometry(cell);
			if (this.graph.isCellMovable(cell) && ((!model.isEdge(cell) || this.graph.getSelectionCount() > 1 || (geo.points != null && geo.points.length > 0) || model.getTerminal(cell, true) == null || model.getTerminal(cell, false) == null) || this.graph.allowDanglingEdges || (this.graph.isCloneEvent(me.getEvent()) && this.graph.isCellsCloneable()))) {
				this.start(cell, me.getX(), me.getY());
			}
			this.cellWasClicked = true;
			me.consume();
		}
	}
};
mxGraphHandler.prototype.getCells = function(initialCell) {
	return this.graph.getMovableCells(this.graph.getSelectionCells());
};
mxGraphHandler.prototype.getPreviewBounds = function(cells) {
	var bounds = this.graph.getView().getBounds(cells);
	if (bounds != null) {
		if (bounds.width < this.minimumSize) {
			var dx = this.minimumSize - bounds.width;
			bounds.x -= dx / 2;
			bounds.width = this.minimumSize;
		}
		if (bounds.height < this.minimumSize) {
			var dy = this.minimumSize - bounds.height;
			bounds.y -= dy / 2;
			bounds.height = this.minimumSize;
		}
	}
	return bounds;
};
mxGraphHandler.prototype.createPreviewShape = function(bounds) {
	var shape = new mxRectangleShape(bounds, null, this.previewColor);
	shape.isDashed = true;
	if (this.htmlPreview) {
		shape.dialect = mxConstants.DIALECT_STRICTHTML;
		shape.init(this.graph.container);
	} else {
		shape.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
		shape.init(this.graph.getView().getOverlayPane());
		if (shape.dialect == mxConstants.DIALECT_SVG) {
			shape.node.setAttribute('style', 'pointer-events:none;');
		} else {
			shape.node.style.background = '';
		}
	}
	return shape;
};
mxGraphHandler.prototype.start = function(cell, x, y) {
	this.cell = cell;
	this.first = mxUtils.convertPoint(this.graph.container, x, y);
	this.cells = this.getCells(this.cell);
	this.bounds = this.getPreviewBounds(this.cells);
};
mxGraphHandler.prototype.mouseMove = function(sender, me) {
	var graph = this.graph;
	if (!me.isConsumed() && graph.isMouseDown && this.cell != null && this.first != null && this.bounds != null) {
		var point = mxUtils.convertPoint(graph.container, me.getX(), me.getY());
		var dx = point.x - this.first.x;
		var dy = point.y - this.first.y;
		var tol = graph.tolerance;
		if (this.shape != null || Math.abs(dx) > tol || Math.abs(dy) > tol) {
			if (this.highlight == null) {
				this.highlight = new mxCellHighlight(this.graph, mxConstants.DROP_TARGET_COLOR, 3);
			}
			if (this.shape == null) {
				this.shape = this.createPreviewShape(this.bounds);
			}
			var trx = graph.getView().translate;
			var scale = graph.getView().scale;
			if (graph.isGridEnabledEvent(me.getEvent())) {
				var tx = this.bounds.x - (this.graph.snap(this.bounds.x / scale - trx.x) + trx.x) * scale;
				var ty = this.bounds.y - (this.graph.snap(this.bounds.y / scale - trx.y) + trx.y) * scale;
				dx = this.graph.snap(dx / scale) * scale - tx;
				dy = this.graph.snap(dy / scale) * scale - ty;
			}
			if (graph.isConstrainedEvent(me.getEvent())) {
				if (Math.abs(dx) > Math.abs(dy)) {
					dy = 0;
				} else {
					dx = 0;
				}
			}
			this.shape.bounds = new mxRectangle(this.bounds.x + dx, this.bounds.y + dy, this.bounds.width, this.bounds.height);
			this.shape.redraw();
			var target = null;
			var cell = me.getCell();
			if (graph.isDropEnabled() && this.highlightEnabled) {
				target = graph.getDropTarget(this.cells, me.getEvent(), cell);
			}
			var parent = target;
			var model = graph.getModel();
			while (parent != null && parent != this.cell) {
				parent = model.getParent(parent);
			}
			var clone = graph.isCloneEvent(me.getEvent()) && graph.isCellsCloneable() && this.isCloneEnabled();
			var state = graph.getView().getState(target);
			var highlight = false;
			if (state != null && parent == null && (model.getParent(this.cell) != target || clone)) {
				if (this.target != target) {
					this.target = target;
					this.setHighlightColor(mxConstants.DROP_TARGET_COLOR);
				}
				highlight = true;
			} else {
				this.target = null;
				if (this.connectOnDrop && cell != null && this.cells.length == 1 && graph.getModel().isVertex(cell) && graph.isCellConnectable(cell)) {
					var state = graph.getView().getState(cell);
					if (state != null) {
						var error = graph.getEdgeValidationError(null, this.cell, cell);
						var color = (error == null) ? mxConstants.VALID_COLOR: mxConstants.INVALID_CONNECT_TARGET_COLOR;
						this.setHighlightColor(color);
						highlight = true;
					}
				}
			}
			if (state != null && highlight) {
				this.highlight.highlight(state);
			} else {
				this.highlight.hide();
			}
		}
		me.consume();
	} else if ((this.isMoveEnabled() || this.isCloneEnabled()) && this.updateCursor && !me.isConsumed() && me.getState() != null && !graph.isMouseDown) {
		var cursor = graph.getCursorForCell(me.getCell());
		if (cursor == null && graph.isEnabled() && graph.isCellMovable(me.getCell())) {
			if (graph.getModel().isEdge(me.getCell())) {
				cursor = mxConstants.CURSOR_MOVABLE_EDGE;
			} else {
				cursor = mxConstants.CURSOR_MOVABLE_VERTEX;
			}
		}
		me.getState().setCursor(cursor);
		me.consume();
	}
};
mxGraphHandler.prototype.setHighlightColor = function(color) {
	if (this.highlight != null) {
		this.highlight.setHighlightColor(color);
	}
};
mxGraphHandler.prototype.mouseUp = function(sender, me) {
	if (!me.isConsumed()) {
		var graph = this.graph;
		if (this.cell != null && this.first != null && this.shape != null) {
			var point = mxUtils.convertPoint(graph.container, me.getX(), me.getY());
			var trx = graph.getView().translate;
			var scale = graph.getView().scale;
			var clone = graph.isCloneEvent(me.getEvent()) && graph.isCellsCloneable() && this.isCloneEnabled();
			var dx = (point.x - this.first.x) / scale;
			var dy = (point.y - this.first.y) / scale;
			if (graph.isGridEnabledEvent(me.getEvent())) {
				var tx = this.bounds.x - (graph.snap(this.bounds.x / scale - trx.x) + trx.x) * scale;
				var ty = this.bounds.y - (graph.snap(this.bounds.y / scale - trx.y) + trx.y) * scale;
				dx = graph.snap(dx) - tx / scale;
				dy = graph.snap(dy) - ty / scale;
			}
			if (graph.isConstrainedEvent(me.getEvent())) {
				if (Math.abs(dx) > Math.abs(dy)) {
					dy = 0;
				} else {
					dx = 0;
				}
			}
			var cell = me.getCell();
			if (this.connectOnDrop && this.target == null && cell != null && graph.getModel().isVertex(cell) && graph.isCellConnectable(cell) && graph.isEdgeValid(null, this.cell, cell)) {
				graph.connectionHandler.connect(this.cell, cell, me.getEvent());
			} else {
				var cells = graph.getSelectionCells();
				var target = this.target;
				if (graph.isSplitEnabled() && graph.isSplitTarget(target, cells, me.getEvent())) {
					graph.splitEdge(target, cells, null, dx, dy);
				} else {
					this.moveCells(graph.getSelectionCells(), dx, dy, clone, this.target, me.getEvent());
				}
			}
		} else if (this.isSelectEnabled() && this.delayedSelection && this.cell != null) {
			graph.selectCellForEvent(this.cell, me.getEvent());
		}
	}
	if (this.cellWasClicked) {
		me.consume();
	}
	this.reset();
};
mxGraphHandler.prototype.reset = function() {
	this.destroyShapes();
	this.cellWasClicked = false;
	this.delayedSelection = false;
	this.first = null;
	this.cell = null;
	this.target = null;
};
mxGraphHandler.prototype.shouldRemoveCellsFromParent = function(parent, cells, evt) {
	if (this.graph.getModel().isVertex(parent)) {
		var pState = this.graph.getView().getState(parent);
		var pt = mxUtils.convertPoint(this.graph.container, evt.clientX, evt.clientY);
		return pState != null && !mxUtils.contains(pState, pt.x, pt.y);
	}
	return false;
};
mxGraphHandler.prototype.moveCells = function(cells, dx, dy, clone, target, evt) {
	if (clone) {
		cells = this.graph.getCloneableCells(cells);
	}
	if (target == null && this.isRemoveCellsFromParent() && this.shouldRemoveCellsFromParent(this.graph.getModel().getParent(this.cell), cells, evt)) {
		target = this.graph.getDefaultParent();
	}
	var cells = this.graph.moveCells(cells, dx, dy, clone, target, evt);
	if (this.isSelectEnabled() && this.scrollOnMove) {
		this.graph.scrollCellToVisible(cells[0]);
	}
	if (clone) {
		this.graph.setSelectionCells(cells);
	}
};
mxGraphHandler.prototype.destroyShapes = function() {
	if (this.shape != null) {
		this.shape.destroy();
		this.shape = null;
	}
	if (this.highlight != null) {
		this.highlight.destroy();
		this.highlight = null;
	}
};
mxGraphHandler.prototype.destroy = function() {
	this.graph.removeMouseListener(this);
	this.destroyShapes();
};
function mxPanningHandler(graph, factoryMethod) {
	if (graph != null) {
		this.graph = graph;
		this.factoryMethod = factoryMethod;
		this.graph.addMouseListener(this);
		this.init();
	}
};
mxPanningHandler.prototype = new mxPopupMenu();
mxPanningHandler.prototype.constructor = mxPanningHandler;
mxPanningHandler.prototype.graph = null;
mxPanningHandler.prototype.usePopupTrigger = true;
mxPanningHandler.prototype.useLeftButtonForPanning = false;
mxPanningHandler.prototype.selectOnPopup = true;
mxPanningHandler.prototype.clearSelectionOnBackground = true;
mxPanningHandler.prototype.ignoreCell = false;
mxPanningHandler.prototype.previewEnabled = true;
mxPanningHandler.prototype.useGrid = false;
mxPanningHandler.prototype.panningEnabled = true;
mxPanningHandler.prototype.isPanningEnabled = function() {
	return this.panningEnabled;
};
mxPanningHandler.prototype.setPanningEnabled = function(value) {
	this.panningEnabled = value;
};
mxPanningHandler.prototype.init = function() {
	mxPopupMenu.prototype.init.apply(this);
	mxEvent.addListener(this.div, (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove', mxUtils.bind(this,
	function(evt) {
		this.graph.tooltipHandler.hide();
	}));
};
mxPanningHandler.prototype.isPanningTrigger = function(me) {
	var evt = me.getEvent();
	return (this.useLeftButtonForPanning && (this.ignoreCell || me.getState() == null) && mxEvent.isLeftMouseButton(evt)) || (mxEvent.isControlDown(evt) && mxEvent.isShiftDown(evt)) || (this.usePopupTrigger && mxEvent.isPopupTrigger(evt));
};
mxPanningHandler.prototype.mouseDown = function(sender, me) {
	if (!me.isConsumed() && this.isEnabled()) {
		this.hideMenu();
		this.dx0 = -this.graph.container.scrollLeft;
		this.dy0 = -this.graph.container.scrollTop;
		this.popupTrigger = this.isPopupTrigger(me);
		this.panningTrigger = this.isPanningEnabled() && this.isPanningTrigger(me);
		this.startX = me.getX();
		this.startY = me.getY();
		if (this.popupTrigger && mxEvent.isRightMouseButton(me.getEvent()) && mxClient.IS_MAC && false) {
			this.mouseUp(sender, me);
		} else if (this.panningTrigger) {
			me.consume();
		}
	}
};
mxPanningHandler.prototype.mouseMove = function(sender, me) {
	var dx = me.getX() - this.startX;
	var dy = me.getY() - this.startY;
	if (this.active) {
		if (this.previewEnabled) {
			if (this.useGrid) {
				dx = this.graph.snap(dx);
				dy = this.graph.snap(dy);
			}
			this.graph.panGraph(dx + this.dx0, dy + this.dy0);
		}
		me.consume();
	} else if (this.panningTrigger) {
		this.active = Math.abs(dx) > this.graph.tolerance || Math.abs(dy) > this.graph.tolerance;
	}
};
mxPanningHandler.prototype.mouseUp = function(sender, me) {
	var dx = Math.abs(me.getX() - this.startX);
	var dy = Math.abs(me.getY() - this.startY);
	if (this.active) {
		var style = mxUtils.getCurrentStyle(this.graph.container);
		if (!this.graph.useScrollbarsForPanning || !mxUtils.hasScrollbars(this.graph.container)) {
			var dx = me.getX() - this.startX;
			var dy = me.getY() - this.startY;
			var scale = this.graph.getView().scale;
			var t = this.graph.getView().translate;
			this.graph.panGraph(0, 0);
			this.panGraph(t.x + dx / scale, t.y + dy / scale);
		}
		me.consume();
	} else if (this.popupTrigger) {
		if (dx < this.graph.tolerance && dy < this.graph.tolerance) {
			var cell = me.getCell();
			if (this.graph.isEnabled() && this.selectOnPopup && cell != null && !this.graph.isCellSelected(cell)) {
				this.graph.setSelectionCell(cell);
			}
			if (this.clearSelectionOnBackground && !this.graph.isCellSelected(cell)) {
				this.graph.clearSelection();
			}
			this.graph.tooltipHandler.hide();
			var origin = mxUtils.getScrollOrigin();
			var point = new mxPoint(me.getX() + origin.x, me.getY() + origin.y);
			this.popup(point.x, point.y, cell, me.getEvent());
			me.consume();
		}
	}
	this.panningTrigger = false;
	this.popupTrigger = false;
	this.active = false;
};
mxPanningHandler.prototype.panGraph = function(dx, dy) {
	this.graph.getView().setTranslate(dx, dy);
};
mxPanningHandler.prototype.destroy = function() {
	this.graph.removeMouseListener(this);
	mxPopupMenu.prototype.destroy.apply(this);
};
function mxCellMarker(graph, validColor, invalidColor, hotspot) {
	if (graph != null) {
		this.graph = graph;
		this.validColor = (validColor != null) ? validColor: mxConstants.DEFAULT_VALID_COLOR;
		this.invalidColor = (validColor != null) ? invalidColor: mxConstants.DEFAULT_INVALID_COLOR;
		this.hotspot = (hotspot != null) ? hotspot: mxConstants.DEFAULT_HOTSPOT;
		this.highlight = new mxCellHighlight(graph);
	}
};
mxCellMarker.prototype = new mxEventSource();
mxCellMarker.prototype.constructor = mxCellMarker;
mxCellMarker.prototype.graph = null;
mxCellMarker.prototype.enabled = true;
mxCellMarker.prototype.hotspot = mxConstants.DEFAULT_HOTSPOT;
mxCellMarker.prototype.hotspotEnabled = false;
mxCellMarker.prototype.validColor = null;
mxCellMarker.prototype.invalidColor = null;
mxCellMarker.prototype.currentColor = null;
mxCellMarker.prototype.validState = null;
mxCellMarker.prototype.markedState = null;
mxCellMarker.prototype.setEnabled = function(enabled) {
	this.enabled = enabled;
};
mxCellMarker.prototype.isEnabled = function() {
	return this.enabled;
};
mxCellMarker.prototype.setHotspot = function(hotspot) {
	this.hotspot = hotspot;
};
mxCellMarker.prototype.getHotspot = function() {
	return this.hotspot;
};
mxCellMarker.prototype.setHotspotEnabled = function(enabled) {
	this.hotspotEnabled = enabled;
};
mxCellMarker.prototype.isHotspotEnabled = function() {
	return this.hotspotEnabled;
};
mxCellMarker.prototype.hasValidState = function() {
	return this.validState != null;
};
mxCellMarker.prototype.getValidState = function() {
	return this.validState;
};
mxCellMarker.prototype.getMarkedState = function() {
	return this.markedState;
};
mxCellMarker.prototype.reset = function() {
	this.validState = null;
	if (this.markedState != null) {
		this.markedState = null;
		this.unmark();
	}
};
mxCellMarker.prototype.process = function(me) {
	var state = null;
	if (this.isEnabled()) {
		state = this.getState(me);
		var isValid = (state != null) ? this.isValidState(state) : false;
		var color = this.getMarkerColor(me.getEvent(), state, isValid);
		if (isValid) {
			this.validState = state;
		} else {
			this.validState = null;
		}
		if (state != this.markedState || color != this.currentColor) {
			this.currentColor = color;
			if (state != null && this.currentColor != null) {
				this.markedState = state;
				this.mark();
			} else if (this.markedState != null) {
				this.markedState = null;
				this.unmark();
			}
		}
	}
	return state;
};
mxCellMarker.prototype.mark = function() {
	this.highlight.setHighlightColor(this.currentColor);
	this.highlight.highlight(this.markedState);
	this.fireEvent(new mxEventObject(mxEvent.MARK, 'state', this.markedState));
};
mxCellMarker.prototype.unmark = function() {
	this.mark();
};
mxCellMarker.prototype.isValidState = function(state) {
	return true;
};
mxCellMarker.prototype.getMarkerColor = function(evt, state, isValid) {
	return (isValid) ? this.validColor: this.invalidColor;
};
mxCellMarker.prototype.getState = function(me) {
	var view = this.graph.getView();
	cell = this.getCell(me);
	var state = this.getStateToMark(view.getState(cell));
	return (state != null && this.intersects(state, me)) ? state: null;
};
mxCellMarker.prototype.getCell = function(me) {
	return me.getCell();
};
mxCellMarker.prototype.getStateToMark = function(state) {
	return state;
};
mxCellMarker.prototype.intersects = function(state, me) {
	if (this.hotspotEnabled) {
		var point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
		return mxUtils.intersectsHotspot(state, point.x, point.y, this.hotspot, mxConstants.MIN_HOTSPOT_SIZE, mxConstants.MAX_HOTSPOT_SIZE);
	}
	return true;
};
mxCellMarker.prototype.destroy = function() {
	this.graph.getView().removeListener(this.resetHandler);
	this.graph.getModel().removeListener(this.resetHandler);
	this.highlight.destroy();
};
function mxSelectionCellsHandler(graph) {
	this.graph = graph;
	this.handlers = new mxDictionary();
	this.graph.addMouseListener(this);
	this.refreshHandler = mxUtils.bind(this,
	function(sender, evt) {
		this.refresh();
	});
	this.graph.getSelectionModel().addListener(mxEvent.CHANGE, this.refreshHandler);
	this.graph.getModel().addListener(mxEvent.CHANGE, this.refreshHandler);
	this.graph.getView().addListener(mxEvent.SCALE, this.refreshHandler);
	this.graph.getView().addListener(mxEvent.TRANSLATE, this.refreshHandler);
	this.graph.getView().addListener(mxEvent.SCALE_AND_TRANSLATE, this.refreshHandler);
	this.graph.getView().addListener(mxEvent.DOWN, this.refreshHandler);
	this.graph.getView().addListener(mxEvent.UP, this.refreshHandler);
};
mxSelectionCellsHandler.prototype.graph = null;
mxSelectionCellsHandler.prototype.enabled = true;
mxSelectionCellsHandler.prototype.refreshHandler = null;
mxSelectionCellsHandler.prototype.maxHandlers = 100;
mxSelectionCellsHandler.prototype.handlers = null;
mxSelectionCellsHandler.prototype.isEnabled = function() {
	return this.enabled;
};
mxSelectionCellsHandler.prototype.setEnabled = function(value) {
	this.enabled = value;
};
mxSelectionCellsHandler.prototype.getHandler = function(cell) {
	return this.handlers.get(cell);
};
mxSelectionCellsHandler.prototype.reset = function() {
	this.handlers.visit(function(key, handler) {
		handler.reset.apply(handler);
	});
};
mxSelectionCellsHandler.prototype.refresh = function() {
	var oldHandlers = this.handlers;
	this.handlers = new mxDictionary();
	var tmp = this.graph.getSelectionCells();
	for (var i = 0; i < tmp.length; i++) {
		var state = this.graph.view.getState(tmp[i]);
		if (state != null) {
			var handler = oldHandlers.remove(tmp[i]);
			if (handler != null) {
				if (handler.state != state) {
					handler.destroy();
					handler = null;
				} else {
					handler.redraw();
				}
			}
			if (handler == null) {
				handler = this.graph.createHandler(state);
			}
			if (handler != null) {
				this.handlers.put(tmp[i], handler);
			}
		}
	}
	oldHandlers.visit(function(key, handler) {
		handler.destroy();
	});
};
mxSelectionCellsHandler.prototype.mouseDown = function(sender, me) {
	if (this.graph.isEnabled() && this.isEnabled()) {
		var args = [sender, me];
		this.handlers.visit(function(key, handler) {
			handler.mouseDown.apply(handler, args);
		});
	}
};
mxSelectionCellsHandler.prototype.mouseMove = function(sender, me) {
	if (this.graph.isEnabled() && this.isEnabled()) {
		var args = [sender, me];
		this.handlers.visit(function(key, handler) {
			handler.mouseMove.apply(handler, args);
		});
	}
};
mxSelectionCellsHandler.prototype.mouseUp = function(sender, me) {
	if (this.graph.isEnabled() && this.isEnabled()) {
		var args = [sender, me];
		this.handlers.visit(function(key, handler) {
			handler.mouseUp.apply(handler, args);
		});
	}
};
mxSelectionCellsHandler.prototype.destroy = function() {
	this.graph.removeMouseListener(this);
	if (this.refreshHandler != null) {
		this.graph.getSelectionModel().removeListener(this.refreshHandler);
		this.graph.getModel().removeListener(this.refreshHandler);
		this.graph.getView().removeListener(this.refreshHandler);
		this.refreshHandler = null;
	}
};
function mxConnectionHandler(graph, factoryMethod) {
	if (graph != null) {
		this.graph = graph;
		this.factoryMethod = factoryMethod;
		this.init();
	}
};
mxConnectionHandler.prototype.graph = null;
mxConnectionHandler.prototype.factoryMethod = true;
mxConnectionHandler.prototype.moveIconFront = false;
mxConnectionHandler.prototype.moveIconBack = false;
mxConnectionHandler.prototype.connectImage = null;
mxConnectionHandler.prototype.targetConnectImage = false;
mxConnectionHandler.prototype.enabled = true;
mxConnectionHandler.prototype.select = true;
mxConnectionHandler.prototype.createTarget = false;
mxConnectionHandler.prototype.marker = null;
mxConnectionHandler.prototype.constraintHandler = null;
mxConnectionHandler.prototype.error = null;
mxConnectionHandler.prototype.ignoreMouseDown = false;
mxConnectionHandler.prototype.start = null;
mxConnectionHandler.prototype.edgeState = null;
mxConnectionHandler.prototype.changeHandler = null;
mxConnectionHandler.prototype.drillHandler = null;
mxConnectionHandler.prototype.isEnabled = function() {
	return this.enabled;
};
mxConnectionHandler.prototype.setEnabled = function(enabled) {
	this.enabled = enabled;
};
mxConnectionHandler.prototype.isCreateTarget = function() {
	return this.createTarget;
};
mxConnectionHandler.prototype.setCreateTarget = function(value) {
	this.createTarget = value;
};
mxConnectionHandler.prototype.createShape = function() {
	var shape = new mxPolyline([], mxConstants.INVALID_COLOR);
	shape.isDashed = true;
	shape.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
	shape.init(this.graph.getView().getOverlayPane());
	if (this.graph.dialect == mxConstants.DIALECT_SVG) {
		shape.pipe.setAttribute('style', 'pointer-events:none;');
		shape.innerNode.setAttribute('style', 'pointer-events:none;');
	}
	return shape;
};
mxConnectionHandler.prototype.init = function() {
	this.graph.addMouseListener(this);
	this.marker = this.createMarker();
	this.constraintHandler = new mxConstraintHandler(this.graph);
	this.changeHandler = mxUtils.bind(this,
	function(sender) {
		if (this.iconState != null) {
			this.iconState = this.graph.getView().getState(this.iconState.cell);
		}
		if (this.iconState != null) {
			this.redrawIcons(this.icons, this.iconState);
		} else {
			this.destroyIcons(this.icons);
			this.previous = null;
		}
		this.constraintHandler.reset();
	});
	this.graph.getModel().addListener(mxEvent.CHANGE, this.changeHandler);
	this.graph.getView().addListener(mxEvent.SCALE, this.changeHandler);
	this.graph.getView().addListener(mxEvent.TRANSLATE, this.changeHandler);
	this.graph.getView().addListener(mxEvent.SCALE_AND_TRANSLATE, this.changeHandler);
	this.drillHandler = mxUtils.bind(this,
	function(sender) {
		this.destroyIcons(this.icons);
	});
	this.graph.addListener(mxEvent.START_EDITING, this.drillHandler);
	this.graph.getView().addListener(mxEvent.DOWN, this.drillHandler);
	this.graph.getView().addListener(mxEvent.UP, this.drillHandler);
};
mxConnectionHandler.prototype.createMarker = function() {
	var marker = new mxCellMarker(this.graph);
	marker.hotspotEnabled = true;
	marker.getCell = mxUtils.bind(this,
	function(evt, cell) {
		var cell = mxCellMarker.prototype.getCell.apply(this, arguments);
		this.error = null;
		if (cell != null) {
			if (this.isConnecting()) {
				if (this.previous != null) {
					this.error = this.validateConnection(this.previous.cell, cell);
					if (this.error != null && this.error.length == 0) {
						cell = null;
						if (this.isCreateTarget()) {
							this.error = null;
						}
					}
				}
			} else if (!this.isValidSource(cell)) {
				cell = null;
			}
		} else if (this.isConnecting() && !this.isCreateTarget() && !this.graph.allowDanglingEdges) {
			this.error = '';
		}
		return cell;
	});
	marker.isValidState = mxUtils.bind(this,
	function(state) {
		if (this.isConnecting()) {
			return this.error == null;
		} else {
			return mxCellMarker.prototype.isValidState.apply(marker, arguments);
		}
	});
	marker.getMarkerColor = mxUtils.bind(this,
	function(evt, state, isValid) {
		return (this.connectImage == null || this.isConnecting()) ? mxCellMarker.prototype.getMarkerColor.apply(marker, arguments) : null;
	});
	marker.intersects = mxUtils.bind(this,
	function(state, evt) {
		if (this.connectImage != null || this.isConnecting()) {
			return true;
		}
		return mxCellMarker.prototype.intersects.apply(marker, arguments);
	});
	return marker;
};
mxConnectionHandler.prototype.isConnecting = function() {
	return this.start != null && this.shape != null;
};
mxConnectionHandler.prototype.isValidSource = function(cell) {
	return this.graph.isValidSource(cell);
};
mxConnectionHandler.prototype.isValidTarget = function(cell) {
	return true;
};
mxConnectionHandler.prototype.validateConnection = function(source, target) {
	if (!this.isValidTarget(target)) {
		return '';
	}
	return this.graph.getEdgeValidationError(null, source, target);
};
mxConnectionHandler.prototype.getConnectImage = function(state) {
	return this.connectImage;
};
mxConnectionHandler.prototype.createIcons = function(state) {
	var image = this.getConnectImage(state);
	if (image != null && state != null) {
		this.iconState = state;
		var icons = [];
		var bounds = new mxRectangle(0, 0, image.width, image.height);
		var icon = new mxImageShape(bounds, image.src);
		if (this.moveIconFront) {
			icon.dialect = mxConstants.DIALECT_STRICTHTML;
			icon.init(this.graph.container);
		} else {
			icon.dialect = (this.graph.dialect == mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_SVG: mxConstants.DIALECT_VML;
			icon.init(this.graph.getView().getOverlayPane());
			if (this.moveIconBack && icon.node.previousSibling != null) {
				icon.node.parentNode.insertBefore(icon.node, icon.node.parentNode.firstChild);
			}
		}
		icon.node.style.cursor = mxConstants.CURSOR_CONNECT;
		var getState = mxUtils.bind(this,
		function() {
			return (this.currentState != null) ? this.currentState: state;
		});
		var mouseDown = mxUtils.bind(this,
		function(evt) {
			if (!mxEvent.isConsumed(evt)) {
				this.icon = icon;
				this.graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, getState()));
			}
		});
		mxEvent.redirectMouseEvents(icon.node, this.graph, getState, mouseDown);
		icons.push(icon);
		this.redrawIcons(icons, this.iconState);
		return icons;
	}
	return null;
};
mxConnectionHandler.prototype.redrawIcons = function(icons, state) {
	if (icons != null && icons[0] != null && state != null) {
		var pos = this.getIconPosition(icons[0], state);
		icons[0].bounds.x = pos.x;
		icons[0].bounds.y = pos.y;
		icons[0].redraw();
	}
};
mxConnectionHandler.prototype.getIconPosition = function(icon, state) {
	var scale = this.graph.getView().scale;
	var cx = state.getCenterX();
	var cy = state.getCenterY();
	if (this.graph.isSwimlane(state.cell)) {
		var size = this.graph.getStartSize(state.cell);
		cx = (size.width != 0) ? state.x + size.width * scale / 2 : cx;
		cy = (size.height != 0) ? state.y + size.height * scale / 2 : cy;
	}
	return new mxPoint(cx - icon.bounds.width / 2, cy - icon.bounds.height / 2);
};
mxConnectionHandler.prototype.destroyIcons = function(icons) {
	if (icons != null) {
		this.iconState = null;
		for (var i = 0; i < icons.length; i++) {
			icons[i].destroy();
		}
	}
};
mxConnectionHandler.prototype.mouseDown = function(sender, me) {
	if (this.isEnabled() && this.graph.isEnabled() && !me.isConsumed() && !this.graph.isForceMarqueeEvent(me.getEvent()) && this.constraintHandler.currentFocus != null && this.constraintHandler.currentConstraint != null) {
		this.sourceConstraint = this.constraintHandler.currentConstraint;
		this.previous = this.constraintHandler.currentFocus;
		this.start = this.constraintHandler.currentPoint;
		this.edgeState = this.createEdgeState(me);
		me.consume();
	} else if (this.isEnabled() && this.graph.isEnabled() && !me.isConsumed() && !this.graph.isForceMarqueeEvent(me.getEvent()) && this.previous != null && this.error == null && (this.icons == null || (this.icons != null && this.icon != null))) {
		this.start = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
		this.edgeState = this.createEdgeState(me);
		me.consume();
	}
	this.selectedIcon = this.icon;
	this.icon = null;
};
mxConnectionHandler.prototype.createEdgeState = function(me) {
	return null;
};
mxConnectionHandler.prototype.mouseMove = function(sender, me) {
	if (!me.isConsumed() && this.isEnabled() && this.graph.isEnabled() && (this.ignoreMouseDown || this.start != null || !this.graph.isMouseDown)) {
		var pt = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
		var state = this.marker.process(me);
		this.constraintHandler.update(me, this.start == null);
		this.currentState = state;
		if (this.previous != null && this.start != null) {
			var view = this.graph.getView();
			var scale = view.scale;
			var point = new mxPoint(this.graph.snap(pt.x / scale) * scale, this.graph.snap(pt.y / scale) * scale);
			var current = point;
			if (state != null) {
				if (this.constraintHandler.currentConstraint == null) {
					var targetPerimeter = view.getPerimeterFunction(state);
					if (targetPerimeter != null) {
						var next = new mxPoint(this.previous.getCenterX(), this.previous.getCenterY());
						var tmp = targetPerimeter(view.getPerimeterBounds(state), this.edgeState, next, false);
						if (tmp != null) {
							current = tmp;
						}
					} else {
						current = new mxPoint(state.getCenterX(), state.getCenterY());
					}
				} else {
					current = this.constraintHandler.currentPoint;
				}
			}
			if (this.selectedIcon != null) {
				var w = this.selectedIcon.bounds.width;
				var h = this.selectedIcon.bounds.height;
				if (state != null && this.targetConnectImage) {
					var pos = this.getIconPosition(this.selectedIcon, state);
					this.selectedIcon.bounds.x = pos.x;
					this.selectedIcon.bounds.y = pos.y;
				} else {
					var dy = mxConstants.TOOLTIP_VERTICAL_OFFSET;
					var bounds = new mxRectangle(pt.x, pt.y + dy, w, h);
					this.selectedIcon.bounds = bounds;
				}
				this.selectedIcon.redraw();
			}
			var pt2 = this.start;
			if (this.sourceConstraint == null) {
				var sourcePerimeter = view.getPerimeterFunction(this.previous);
				if (sourcePerimeter != null) {
					var tmp = sourcePerimeter(view.getPerimeterBounds(this.previous), this.previous, current, false);
					if (tmp != null) {
						pt2 = tmp;
					}
				} else {
					pt2 = new mxPoint(this.previous.getCenterX(), this.previous.getCenterY());
				}
			}
			if (state == null) {
				var dx = current.x - pt2.x;
				var dy = current.y - pt2.y;
				var len = Math.sqrt(dx * dx + dy * dy);
				current.x -= dx * 4 / len;
				current.y -= dy * 4 / len;
			}
			if (this.shape == null) {
				var dx = Math.abs(point.x - this.start.x);
				var dy = Math.abs(point.y - this.start.y);
				if (dx > this.graph.tolerance || dy > this.graph.tolerance) {
					this.shape = this.createShape();
				}
			}
			if (this.shape != null) {
				this.shape.points = [pt2, current];
				this.drawPreview();
			}
			mxEvent.consume(me.getEvent());
			me.consume();
		} else if (this.previous != state) {
			this.destroyIcons(this.icons);
			this.icons = null;
			if (state != null && this.error == null) {
				this.icons = this.createIcons(state);
				if (this.icons == null) {
					state.setCursor(mxConstants.CURSOR_CONNECT);
					me.consume();
				}
			}
			this.previous = state;
		} else if (this.previous == state && state != null && this.icons == null && !this.graph.isMouseDown) {
			me.consume();
		}
		if (this.constraintHandler.currentConstraint != null) {
			this.marker.reset();
		}
		if (!this.graph.isMouseDown && state != null && this.icons != null) {
			var checkBounds = state.text != null && state.text.node.parentNode == this.graph.container;
			var hitsIcon = false;
			var target = me.getSource();
			for (var i = 0; i < this.icons.length && !hitsIcon; i++) {
				hitsIcon = target == this.icons[i].node || target.parentNode == this.icons[i].node;
			}
			if (!hitsIcon) {
				this.updateIcons(state, this.icons, me);
			}
		}
	} else {
		this.constraintHandler.reset();
	}
};
mxConnectionHandler.prototype.updateIcons = function(state, icons, me) {};
mxConnectionHandler.prototype.mouseUp = function(sender, me) {
	if (!me.isConsumed() && this.isConnecting()) {
		if (this.error == null) {
			var source = this.previous.cell;
			var target = null;
			if (this.constraintHandler.currentFocus != null) {
				target = this.constraintHandler.currentFocus.cell;
			}
			if (target == null && this.marker.hasValidState()) {
				target = this.marker.validState.cell;
			}
			this.connect(source, target, me.getEvent(), me.getCell());
		} else {
			if (this.previous != null && this.marker.validState != null && this.previous.cell == this.marker.validState.cell) {
				this.graph.selectCellForEvent(this.marker.source, evt);
			}
			if (this.error.length > 0) {
				this.graph.validationAlert(this.error);
			}
		}
		this.destroyIcons(this.icons);
		me.consume();
	}
	if (this.start != null) {
		this.reset();
	}
};
mxConnectionHandler.prototype.reset = function() {
	if (this.shape != null) {
		this.shape.destroy();
		this.shape = null;
	}
	this.destroyIcons(this.icons);
	this.icons = null;
	this.marker.reset();
	this.constraintHandler.reset();
	this.selectedIcon = null;
	this.edgeState = null;
	this.previous = null;
	this.error = null;
	this.sourceConstraint = null;
	this.start = null;
	this.icon = null;
};
mxConnectionHandler.prototype.drawPreview = function() {
	var valid = this.error == null;
	var color = this.getEdgeColor(valid);
	if (this.shape.dialect == mxConstants.DIALECT_SVG) {
		this.shape.innerNode.setAttribute('stroke', color);
	} else {
		this.shape.node.setAttribute('strokecolor', color);
	}
	this.shape.strokewidth = this.getEdgeWidth(valid);
	this.shape.redraw();
	mxUtils.repaintGraph(this.graph, this.shape.points[1]);
};
mxConnectionHandler.prototype.getEdgeColor = function(valid) {
	return (valid) ? mxConstants.VALID_COLOR: mxConstants.INVALID_COLOR;
};
mxConnectionHandler.prototype.getEdgeWidth = function(valid) {
	return (valid) ? 3 : 1;
};
mxConnectionHandler.prototype.connect = function(source, target, evt, dropTarget) {
	if (source != null && (target != null || this.isCreateTarget() || this.graph.allowDanglingEdges)) {
		var model = this.graph.getModel();
		var edge = null;
		model.beginUpdate();
		try {
			if (target == null && this.isCreateTarget()) {
				target = this.createTargetVertex(evt, source);
				if (target != null) {
					dropTarget = this.graph.getDropTarget([target], evt, dropTarget);
					if (dropTarget == null || !this.graph.getModel().isEdge(dropTarget)) {
						var pstate = this.graph.getView().getState(dropTarget);
						if (pstate != null) {
							var tmp = model.getGeometry(target);
							tmp.x -= pstate.origin.x;
							tmp.y -= pstate.origin.y;
						}
					} else {
						dropTarget = this.graph.getDefaultParent();
					}
					this.graph.addCell(target, dropTarget);
				}
			}
			var parent = this.graph.getDefaultParent();
			if (model.getParent(source) == model.getParent(target)) {
				parent = model.getParent(source);
			}
			var value = null;
			if (this.edgeState != null) {
				value = this.edgeState.cell.value;
			}
			edge = this.insertEdge(parent, null, value, source, target);
			if (edge != null) {
				this.graph.setConnectionConstraint(edge, source, true, this.sourceConstraint);
				this.graph.setConnectionConstraint(edge, target, false, this.constraintHandler.currentConstraint);
				var geo = model.getGeometry(edge);
				if (geo == null) {
					geo = new mxGeometry();
					geo.relative = true;
					model.setGeometry(edge, geo);
				}
				if (target == null) {
					var pt = this.graph.getPointForEvent(evt);
					geo.setTerminalPoint(pt, false);
				}
			}
		} finally {
			model.endUpdate();
		}
		if (this.select) {
			this.graph.setSelectionCell(edge);
		}
	}
};
mxConnectionHandler.prototype.insertEdge = function(parent, id, value, source, target) {
	if (this.factoryMethod == null) {
		return this.graph.insertEdge(parent, id, value, source, target);
	} else {
		var edge = this.createEdge(value, source, target);
		edge = this.graph.addEdge(edge, parent, source, target);
		return edge;
	}
};
mxConnectionHandler.prototype.createTargetVertex = function(evt, source) {
	var clone = this.graph.cloneCells([source])[0];
	var geo = this.graph.getModel().getGeometry(clone);
	if (geo != null) {
		var point = this.graph.getPointForEvent(evt);
		geo.x = this.graph.snap(point.x - geo.width / 2);
		geo.y = this.graph.snap(point.y - geo.height / 2);
		if (this.start != null) {
			var sourceState = this.graph.view.getState(source);
			if (sourceState != null) {
				var tol = (this.graph.isGridEnabled()) ? this.graph.gridSize: this.graph.tolerance;
				if (Math.abs(this.graph.snap(this.start.x) - this.graph.snap(point.x)) <= tol) {
					geo.x = sourceState.x;
				} else if (Math.abs(this.graph.snap(this.start.y) - this.graph.snap(point.y)) <= tol) {
					geo.y = sourceState.y;
				}
			}
		}
	}
	return clone;
};
mxConnectionHandler.prototype.createEdge = function(value, source, target) {
	var edge = null;
	if (this.factoryMethod != null) {
		edge = this.factoryMethod(source, target);
	}
	if (edge == null) {
		edge = new mxCell(value || '');
		edge.setEdge(true);
		var geo = new mxGeometry();
		geo.relative = true;
		edge.setGeometry(geo);
	}
	return edge;
};
mxConnectionHandler.prototype.destroy = function() {
	this.graph.removeMouseListener(this);
	if (this.shape != null) {
		this.shape.destroy();
		this.shape = null;
	}
	if (this.marker != null) {
		this.marker.destroy();
		this.marker = null;
	}
	if (this.constraintHandler != null) {
		this.constraintHandler.destroy();
		this.constraintHandler = null;
	}
	if (this.changeHandler != null) {
		this.graph.getModel().removeListener(this.changeHandler);
		this.graph.getView().removeListener(this.changeHandler);
		this.changeHandler = null;
	}
	if (this.drillHandler != null) {
		this.graph.removeListener(this.drillHandler);
		this.graph.getView().removeListener(this.drillHandler);
		this.drillHandler = null;
	}
};
function mxConstraintHandler(graph) {
	this.graph = graph;
};
mxConstraintHandler.prototype.pointImage = new mxImage(mxClient.imageBasePath + '/point.gif', 5, 5);
mxConstraintHandler.prototype.graph = null;
mxConstraintHandler.prototype.enabled = true;
mxConstraintHandler.prototype.highlightColor = mxConstants.DEFAULT_VALID_COLOR;
mxConstraintHandler.prototype.isEnabled = function() {
	return this.enabled;
};
mxConstraintHandler.prototype.setEnabled = function(enabled) {
	this.enabled = enabled;
};
mxConstraintHandler.prototype.reset = function() {
	if (this.focusIcons != null) {
		for (var i = 0; i < this.focusIcons.length; i++) {
			this.focusIcons[i].destroy();
		}
		this.focusIcons = null;
	}
	if (this.focusHighlight != null) {
		this.focusHighlight.destroy();
		this.focusHighlight = null;
	}
	this.currentConstraint = null;
	this.currentFocusArea = null;
	this.currentPoint = null;
	this.currentFocus = null;
	this.focusPoints = null;
};
mxConstraintHandler.prototype.getTolerance = function() {
	return this.graph.getTolerance();
};
mxConstraintHandler.prototype.getImageForConstraint = function(state, constraint, point) {
	return this.pointImage;
};
mxConstraintHandler.prototype.update = function(me, source) {
	if (this.isEnabled()) {
		var tol = this.getTolerance();
		var pt = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
		var mouse = new mxRectangle(pt.x - tol, pt.y - tol, 2 * tol, 2 * tol);
		if (this.currentFocusArea == null || !mxUtils.intersects(this.currentFocusArea, mouse)) {
			this.currentFocusArea = null;
			if (me.getState() != this.currentFocus) {
				this.currentFocus = null;
				if (me.getState() != null) {
					this.constraints = this.graph.getAllConnectionConstraints(me.getState(), source);
					if (this.constraints != null) {
						this.currentFocus = me.getState();
						this.currentFocusArea = new mxRectangle(me.getState().x, me.getState().y, me.getState().width, me.getState().height);
						if (this.focusIcons != null) {
							for (var i = 0; i < this.focusIcons.length; i++) {
								this.focusIcons[i].destroy();
							}
							this.focusIcons = null;
							this.focusPoints = null;
						}
						this.focusIcons = [];
						this.focusPoints = [];
						for (var i = 0; i < this.constraints.length; i++) {
							var cp = this.graph.getConnectionPoint(me.getState(), this.constraints[i]);
							var img = this.getImageForConstraint(me.getState(), this.constraints[i], cp);
							var src = img.src;
							var bounds = new mxRectangle(cp.x - img.width / 2, cp.y - img.height / 2, img.width, img.height);
							var icon = new mxImageShape(bounds, src);
							icon.dialect = (this.graph.dialect == mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_SVG: mxConstants.DIALECT_VML;
							icon.init(this.graph.getView().getOverlayPane());
							if (icon.node.previousSibling != null) {
								icon.node.parentNode.insertBefore(icon.node, icon.node.parentNode.firstChild);
							}
							var getState = mxUtils.bind(this,
							function() {
								return (this.currentFocus != null) ? this.currentFocus: me.getState();
							});
							mxEvent.redirectMouseEvents(icon.node, this.graph, getState);
							this.currentFocusArea.add(icon.bounds);
							this.focusIcons.push(icon);
							this.focusPoints.push(cp);
						}
						this.currentFocusArea.grow(tol);
					}
				} else if (this.focusIcons != null) {
					if (this.focusHighlight != null) {
						this.focusHighlight.destroy();
						this.focusHighlight = null;
					}
					for (var i = 0; i < this.focusIcons.length; i++) {
						this.focusIcons[i].destroy();
					}
					this.focusIcons = null;
					this.focusPoints = null;
				}
			}
		}
		this.currentConstraint = null;
		this.currentPoint = null;
		if (this.focusIcons != null && this.constraints != null && (me.getState() == null || this.currentFocus == me.getState())) {
			for (var i = 0; i < this.focusIcons.length; i++) {
				if (mxUtils.intersects(this.focusIcons[i].bounds, mouse)) {
					this.currentConstraint = this.constraints[i];
					this.currentPoint = this.focusPoints[i];
					var tmp = this.focusIcons[i].bounds.clone();
					tmp.grow((true) ? 3 : 2);
					if (true) {
						tmp.width -= 1;
						tmp.height -= 1;
					}
					if (this.focusHighlight == null) {
						var hl = new mxRectangleShape(tmp, null, this.highlightColor, 3);
						hl.dialect = (this.graph.dialect == mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_SVG: mxConstants.DIALECT_VML;
						hl.init(this.graph.getView().getOverlayPane());
						this.focusHighlight = hl;
						var getState = mxUtils.bind(this,
						function() {
							return (this.currentFocus != null) ? this.currentFocus: me.getState();
						});
						mxEvent.redirectMouseEvents(hl.node, this.graph, getState);
					} else {
						this.focusHighlight.bounds = tmp;
						this.focusHighlight.redraw();
					}
					break;
				}
			}
		}
		if (this.currentConstraint == null && this.focusHighlight != null) {
			this.focusHighlight.destroy();
			this.focusHighlight = null;
		}
	}
};
mxConstraintHandler.prototype.destroy = function() {
	this.reset();
};
function mxRubberband(graph) {
	if (graph != null) {
		this.graph = graph;
		this.graph.addMouseListener(this);
		if (true) {
			mxEvent.addListener(window, 'unload', mxUtils.bind(this,
			function() {
				this.destroy();
			}));
		}
	}
};
mxRubberband.prototype.defaultOpacity = 20;
mxRubberband.prototype.enabled = true;
mxRubberband.prototype.isEnabled = function() {
	return this.enabled;
};
mxRubberband.prototype.setEnabled = function(enabled) {
	this.enabled = enabled;
};
mxRubberband.prototype.mouseDown = function(sender, me) {
	if (!me.isConsumed() && this.isEnabled() && this.graph.isEnabled() && (this.graph.isForceMarqueeEvent(me.getEvent()) || me.getState() == null)) {
		var offset = mxUtils.getOffset(this.graph.container);
		var origin = mxUtils.getScrollOrigin(this.graph.container);
		origin.x -= offset.x;
		origin.y -= offset.y;
		this.start(me.getX() + origin.x, me.getY() + origin.y);
		me.consume(false);
	}
};
mxRubberband.prototype.start = function(x, y) {
	this.first = new mxPoint(x, y);
};
mxRubberband.prototype.mouseMove = function(sender, me) {
	if (!me.isConsumed() && this.first != null) {
		var origin = mxUtils.getScrollOrigin(this.graph.container);
		var offset = mxUtils.getOffset(this.graph.container);
		origin.x -= offset.x;
		origin.y -= offset.y;
		var x = me.getX() + origin.x;
		var y = me.getY() + origin.y;
		var dx = this.first.x - x;
		var dy = this.first.y - y;
		var tol = this.graph.tolerance;
		if (this.div != null || Math.abs(dx) > tol || Math.abs(dy) > tol) {
			if (this.div == null) {
				this.div = this.createShape();
			}
			this.update(x, y);
			me.consume();
		}
	}
};
mxRubberband.prototype.createShape = function() {
	var div = document.createElement('div');
	div.className = 'mxRubberband';
	mxUtils.setOpacity(div, this.defaultOpacity);
	this.graph.container.appendChild(div);
	return div;
};
mxRubberband.prototype.mouseUp = function(sender, me) {
	var execute = this.div != null;
	this.reset();
	if (execute) {
		var rect = new mxRectangle(this.x, this.y, this.width, this.height);
		this.graph.selectRegion(rect, me.getEvent());
		me.consume();
	}
};
mxRubberband.prototype.reset = function() {
	if (this.div != null) {
		this.div.parentNode.removeChild(this.div);
	}
	this.div = null;
	this.first = null;
};
mxRubberband.prototype.update = function(x, y) {
	this.x = Math.min(this.first.x, x);
	this.y = Math.min(this.first.y, y);
	this.width = Math.max(this.first.x, x) - this.x;
	this.height = Math.max(this.first.y, y) - this.y;
	this.div.style.left = this.x + 'px';
	this.div.style.top = this.y + 'px';
	this.div.style.width = Math.max(1, this.width) + 'px';
	this.div.style.height = Math.max(1, this.height) + 'px';
};
mxRubberband.prototype.destroy = function() {
	if (!this.destroyed) {
		this.graph.removeMouseListener(this);
		this.reset();
		this.destroyed = true;
	}
};
function mxVertexHandler(state) {
	if (state != null) {
		this.state = state;
		this.init();
	}
};
mxVertexHandler.prototype.graph = null;
mxVertexHandler.prototype.state = null;
mxVertexHandler.prototype.singleSizer = false;
mxVertexHandler.prototype.index = null;
mxVertexHandler.prototype.init = function() {
	this.graph = this.state.view.graph;
	this.bounds = this.getSelectionBounds(this.state);
	this.selectionBorder = this.createSelectionShape(this.bounds);
	this.selectionBorder.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
	this.selectionBorder.init(this.graph.getView().getOverlayPane());
	if (this.selectionBorder.dialect == mxConstants.DIALECT_SVG) {
		this.selectionBorder.node.setAttribute('pointer-events', 'none');
	} else {
		this.selectionBorder.node.style.background = '';
	}
	if (this.graph.isCellMovable(this.state.cell)) {
		this.selectionBorder.node.style.cursor = mxConstants.CURSOR_MOVABLE_VERTEX;
	}
	mxEvent.redirectMouseEvents(this.selectionBorder.node, this.graph, this.state);
	if (mxGraphHandler.prototype.maxCells <= 0 || this.graph.getSelectionCount() < mxGraphHandler.prototype.maxCells) {
		this.sizers = [];
		if (this.graph.isCellResizable(this.state.cell)) {
			var i = 0;
			if (!this.singleSizer) {
				this.sizers.push(this.createSizer('nw-resize', i++));
				this.sizers.push(this.createSizer('n-resize', i++));
				this.sizers.push(this.createSizer('ne-resize', i++));
				this.sizers.push(this.createSizer('w-resize', i++));
				this.sizers.push(this.createSizer('e-resize', i++));
				this.sizers.push(this.createSizer('sw-resize', i++));
				this.sizers.push(this.createSizer('s-resize', i++));
			}
			this.sizers.push(this.createSizer('se-resize', i++));
			var geo = this.graph.model.getGeometry(this.state.cell);
			if (geo != null && !geo.relative && !this.graph.isSwimlane(this.state.cell) && this.graph.isLabelMovable(this.state.cell)) {
				this.labelShape = this.createSizer(mxConstants.CURSOR_LABEL_HANDLE, mxEvent.LABEL_HANDLE, mxConstants.LABEL_HANDLE_SIZE, mxConstants.LABEL_HANDLE_FILLCOLOR);
				this.sizers.push(this.labelShape);
			}
		} else if (this.graph.isCellMovable(this.state.cell) && !this.graph.isCellResizable(this.state.cell) && this.state.width < 2 && this.state.height < 2) {
			this.labelShape = this.createSizer(mxConstants.CURSOR_MOVABLE_VERTEX, null, null, mxConstants.LABEL_HANDLE_FILLCOLOR);
			this.sizers.push(this.labelShape);
		}
	}
	this.redraw();
};
mxVertexHandler.prototype.getSelectionBounds = function(state) {
	return new mxRectangle(state.x, state.y, state.width, state.height);
};
mxVertexHandler.prototype.createSelectionShape = function(bounds) {
	var shape = new mxRectangleShape(bounds, null, this.getSelectionColor());
	shape.strokewidth = this.getSelectionStrokeWidth();
	shape.isDashed = this.isSelectionDashed();
	return shape;
};
mxVertexHandler.prototype.getSelectionColor = function() {
	return mxConstants.VERTEX_SELECTION_COLOR;
};
mxVertexHandler.prototype.getSelectionStrokeWidth = function() {
	return mxConstants.VERTEX_SELECTION_STROKEWIDTH;
};
mxVertexHandler.prototype.isSelectionDashed = function() {
	return mxConstants.VERTEX_SELECTION_DASHED;
};
mxVertexHandler.prototype.createSizer = function(cursor, index, size, fillColor) {
	size = size || mxConstants.HANDLE_SIZE;
	var bounds = new mxRectangle(0, 0, size, size);
	var sizer = this.createSizerShape(bounds, index, fillColor);
	if (this.state.text != null && this.state.text.node.parentNode == this.graph.container) {
		sizer.bounds.height -= 1;
		sizer.bounds.width -= 1;
		sizer.dialect = mxConstants.DIALECT_STRICTHTML;
		sizer.init(this.graph.container);
	} else {
		sizer.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
		sizer.init(this.graph.getView().getOverlayPane());
	}
	sizer.node.style.cursor = cursor;
	mxEvent.redirectMouseEvents(sizer.node, this.graph, this.state);
	if (!this.isSizerVisible(index)) {
		sizer.node.style.visibility = 'hidden';
	}
	return sizer;
};
mxVertexHandler.prototype.isSizerVisible = function(index) {
	return true;
};
mxVertexHandler.prototype.createSizerShape = function(bounds, index, fillColor) {
	return new mxRectangleShape(bounds, fillColor || mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
};
mxVertexHandler.prototype.moveSizerTo = function(shape, x, y) {
	if (shape != null) {
		shape.bounds.x = x - shape.bounds.width / 2;
		shape.bounds.y = y - shape.bounds.height / 2;
		shape.redraw();
	}
};
mxVertexHandler.prototype.getHandleForEvent = function(me) {
	if (me.isSource(this.labelShape)) {
		return mxEvent.LABEL_HANDLE;
	}
	if (this.sizers != null) {
		for (var i = 0; i < this.sizers.length; i++) {
			if (me.isSource(this.sizers[i])) {
				return i;
			}
		}
	}
	return null;
};
mxVertexHandler.prototype.mouseDown = function(sender, me) {
	if (!me.isConsumed() && this.graph.isEnabled() && !this.graph.isForceMarqueeEvent(me.getEvent()) && me.getState() == this.state) {
		var handle = this.getHandleForEvent(me);
		if (handle != null) {
			this.start(me.getX(), me.getY(), handle);
			me.consume();
		}
	}
};
mxVertexHandler.prototype.start = function(x, y, index) {
	var pt = mxUtils.convertPoint(this.graph.container, x, y);
	this.startX = pt.x;
	this.startY = pt.y;
	this.index = index;
	this.selectionBorder.node.style.visibility = 'hidden';
	this.preview = this.createSelectionShape(this.bounds);
	if (this.state.text != null && this.state.text.node.parentNode == this.graph.container) {
		this.preview.dialect = mxConstants.DIALECT_STRICTHTML;
		this.preview.init(this.graph.container);
	} else {
		this.preview.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
		this.preview.init(this.graph.view.getOverlayPane());
	}
};
mxVertexHandler.prototype.mouseMove = function(sender, me) {
	if (!me.isConsumed() && this.index != null) {
		var point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
		var gridEnabled = this.graph.isGridEnabledEvent(me.getEvent());
		var scale = this.graph.getView().scale;
		if (this.index == mxEvent.LABEL_HANDLE) {
			if (gridEnabled) {
				point.x = this.graph.snap(point.x / scale) * scale;
				point.y = this.graph.snap(point.y / scale) * scale;
			}
			this.moveSizerTo(this.sizers[8], point.x, point.y);
			me.consume();
		} else if (this.index != null) {
			var dx = point.x - this.startX;
			var dy = point.y - this.startY;
			if (gridEnabled) {
				dx = this.graph.snap(dx / scale) * scale;
				dy = this.graph.snap(dy / scale) * scale;
			}
			this.bounds = this.union(this.state, dx, dy, this.index);
			this.drawPreview();
			me.consume();
		}
	}
};
mxVertexHandler.prototype.mouseUp = function(sender, me) {
	if (!me.isConsumed() && this.index != null && this.state != null) {
		var point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY());
		var scale = this.graph.getView().scale;
		var dx = (point.x - this.startX) / scale;
		var dy = (point.y - this.startY) / scale;
		if (this.graph.isGridEnabledEvent(me.getEvent())) {
			dx = this.graph.snap(dx);
			dy = this.graph.snap(dy);
		}
		this.resizeCell(this.state.cell, dx, dy, this.index);
		this.reset();
		me.consume();
	}
};
mxVertexHandler.prototype.reset = function() {
	this.index = null;
	if (this.preview != null) {
		this.preview.destroy();
		this.preview = null;
	}
	this.selectionBorder.node.style.visibility = 'visible';
	this.bounds = new mxRectangle(this.state.x, this.state.y, this.state.width, this.state.height);
	this.drawPreview();
};
mxVertexHandler.prototype.resizeCell = function(cell, dx, dy, index) {
	var geo = this.graph.model.getGeometry(cell);
	if (index == mxEvent.LABEL_HANDLE) {
		geo = geo.clone();
		if (geo.offset == null) {
			geo.offset = new mxPoint(dx, dy);
		} else {
			geo.offset.x += dx;
			geo.offset.y += dy;
		}
		this.graph.model.setGeometry(cell, geo);
	} else {
		var bounds = this.union(geo, dx, dy, index);
		this.graph.resizeCell(cell, bounds);
	}
};
mxVertexHandler.prototype.union = function(bounds, dx, dy, index) {
	if (this.singleSizer) {
		return new mxRectangle(bounds.x, bounds.y, Math.max(0, bounds.width + dx), Math.max(0, bounds.height + dy));
	} else {
		var left = bounds.x;
		var right = left + bounds.width;
		var top = bounds.y;
		var bottom = top + bounds.height;
		if (index > 4) {
			bottom = bottom + dy;
		} else if (index < 3) {
			top = top + dy;
		}
		if (index == 0 || index == 3 || index == 5) {
			left += dx;
		} else if (index == 2 || index == 4 || index == 7) {
			right += dx;
		}
		var width = right - left;
		var height = bottom - top;
		if (width < 0) {
			left += width;
			width = Math.abs(width);
		}
		if (height < 0) {
			top += height;
			height = Math.abs(height);
		}
		return new mxRectangle(left, top, width, height);
	}
};
mxVertexHandler.prototype.redraw = function() {
	this.bounds = new mxRectangle(this.state.x, this.state.y, this.state.width, this.state.height);
	if (this.sizers != null) {
		var s = this.state;
		var r = s.x + s.width;
		var b = s.y + s.height;
		if (this.singleSizer) {
			this.moveSizerTo(this.sizers[0], r, b);
		} else {
			var cx = s.x + s.width / 2;
			var cy = s.y + s.height / 2;
			this.moveSizerTo(this.sizers[0], s.x, s.y);
			if (this.sizers.length > 1) {
				this.moveSizerTo(this.sizers[1], cx, s.y);
				this.moveSizerTo(this.sizers[2], r, s.y);
				this.moveSizerTo(this.sizers[3], s.x, cy);
				this.moveSizerTo(this.sizers[4], r, cy);
				this.moveSizerTo(this.sizers[5], s.x, b);
				this.moveSizerTo(this.sizers[6], cx, b);
				this.moveSizerTo(this.sizers[7], r, b);
				this.moveSizerTo(this.sizers[8], cx + s.absoluteOffset.x, cy + s.absoluteOffset.y);
			}
		}
	}
	this.drawPreview();
};
mxVertexHandler.prototype.drawPreview = function() {
	if (this.preview != null) {
		this.preview.bounds = this.bounds;
		if (this.preview.node.parentNode == this.graph.container) {
			this.preview.bounds.width -= 1;
			this.preview.bounds.height -= 1;
		}
		this.preview.redraw();
	}
	this.selectionBorder.bounds = this.bounds;
	this.selectionBorder.redraw();
};
mxVertexHandler.prototype.destroy = function() {
	if (this.preview != null) {
		this.preview.destroy();
		this.preview = null;
	}
	this.selectionBorder.destroy();
	this.selectionBorder = null;
	this.labelShape = null;
	if (this.sizers != null) {
		for (var i = 0; i < this.sizers.length; i++) {
			this.sizers[i].destroy();
			this.sizers[i] = null;
		}
	}
};
function mxEdgeHandler(state) {
	if (state != null) {
		this.state = state;
		this.init();
	}
};
mxEdgeHandler.prototype.graph = null;
mxEdgeHandler.prototype.state = null;
mxEdgeHandler.prototype.marker = null;
mxEdgeHandler.prototype.constraintHandler = null;
mxEdgeHandler.prototype.error = null;
mxEdgeHandler.prototype.shape = null;
mxEdgeHandler.prototype.bends = null;
mxEdgeHandler.prototype.labelShape = null;
mxEdgeHandler.prototype.cloneEnabled = true;
mxEdgeHandler.prototype.addEnabled = false;
mxEdgeHandler.prototype.removeEnabled = false;
mxEdgeHandler.prototype.preferHtml = false;
mxEdgeHandler.prototype.init = function() {
	this.graph = this.state.view.graph;
	this.marker = this.createMarker();
	this.constraintHandler = new mxConstraintHandler(this.graph);
	this.points = [];
	this.abspoints = this.getSelectionPoints(this.state);
	this.shape = this.createSelectionShape(this.abspoints);
	this.shape.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
	this.shape.init(this.graph.getView().getOverlayPane());
	this.shape.node.style.cursor = mxConstants.CURSOR_MOVABLE_EDGE;
	var md = (mxClient.IS_TOUCH) ? 'touchstart': 'mousedown';
	var mm = (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove';
	var mu = (mxClient.IS_TOUCH) ? 'touchend': 'mouseup';
	mxEvent.addListener(this.shape.node, 'dblclick', mxUtils.bind(this,
	function(evt) {
		this.graph.dblClick(evt, this.state.cell);
	}));
	mxEvent.addListener(this.shape.node, md, mxUtils.bind(this,
	function(evt) {
		if (this.addEnabled && this.isAddPointEvent(evt)) {
			this.addPoint(this.state, evt);
		} else {
			this.graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, this.state));
		}
	}));
	mxEvent.addListener(this.shape.node, mm, mxUtils.bind(this,
	function(evt) {
		var cell = this.state.cell;
		if (this.index != null) {
			var gridEnabled = this.graph.isGridEnabledEvent(evt);
			var pt = mxUtils.convertPoint(this.graph.container, evt.clientX, evt.clientY, gridEnabled);
			cell = this.graph.getCellAt(pt.x, pt.y);
			if (this.graph.isSwimlane(cell) && this.graph.hitsSwimlaneContent(cell, pt.x, pt.y)) {
				cell = null;
			}
		}
		this.graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, this.graph.getView().getState(cell)));
	}));
	mxEvent.addListener(this.shape.node, mu, mxUtils.bind(this,
	function(evt) {
		this.graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt, this.state));
	}));
	this.preferHtml = this.state.text != null && this.state.text.node.parentNode == this.graph.container;
	if (!this.preferHtml) {
		var sourceState = this.graph.view.getState(this.graph.view.getVisibleTerminal(this.state.cell, true));
		if (sourceState != null) {
			this.preferHtml = sourceState.text != null && sourceState.text.node.parentNode == this.graph.container;
		}
		if (!this.preferHtml) {
			var targetState = this.graph.view.getState(this.graph.view.getVisibleTerminal(this.state.cell, false));
			if (targetState != null) {
				this.preferHtml = targetState.text != null && targetState.text.node.parentNode == this.graph.container;
			}
		}
	}
	if (this.graph.getSelectionCount() < mxGraphHandler.prototype.maxCells || mxGraphHandler.prototype.maxCells <= 0) {
		this.bends = this.createBends();
	}
	this.label = new mxPoint(this.state.absoluteOffset.x, this.state.absoluteOffset.y);
	this.labelShape = new mxRectangleShape(new mxRectangle(), mxConstants.LABEL_HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
	this.initBend(this.labelShape);
	this.labelShape.node.style.cursor = mxConstants.CURSOR_LABEL_HANDLE;
	mxEvent.redirectMouseEvents(this.labelShape.node, this.graph, this.state);
	this.redraw();
};
mxEdgeHandler.prototype.isAddPointEvent = function(evt) {
	return mxEvent.isShiftDown(evt);
};
mxEdgeHandler.prototype.isRemovePointEvent = function(evt) {
	return mxEvent.isShiftDown(evt);
};
mxEdgeHandler.prototype.getSelectionPoints = function(state) {
	return state.absolutePoints;
};
mxEdgeHandler.prototype.createSelectionShape = function(points) {
	var shape = new mxPolyline(points, this.getSelectionColor());
	shape.strokewidth = this.getSelectionStrokeWidth();
	shape.isDashed = this.isSelectionDashed();
	return shape;
};
mxEdgeHandler.prototype.getSelectionColor = function() {
	return mxConstants.EDGE_SELECTION_COLOR;
};
mxEdgeHandler.prototype.getSelectionStrokeWidth = function() {
	return mxConstants.EDGE_SELECTION_STROKEWIDTH;
};
mxEdgeHandler.prototype.isSelectionDashed = function() {
	return mxConstants.EDGE_SELECTION_DASHED;
};
mxEdgeHandler.prototype.createMarker = function() {
	var marker = new mxCellMarker(this.graph);
	var self = this;
	marker.getCell = function(me) {
		var cell = mxCellMarker.prototype.getCell.apply(this, arguments);
		var model = self.graph.getModel();
		if (cell == self.state.cell || (cell != null && !self.graph.connectableEdges && model.isEdge(cell))) {
			cell = null;
		}
		return cell;
	};
	marker.isValidState = function(state) {
		var model = self.graph.getModel();
		var other = model.getTerminal(self.state.cell, !self.isSource);
		var source = (self.isSource) ? state.cell: other;
		var target = (self.isSource) ? other: state.cell;
		self.error = self.validateConnection(source, target);
		return self.error == null;
	};
	return marker;
};
mxEdgeHandler.prototype.validateConnection = function(source, target) {
	return this.graph.getEdgeValidationError(this.state.cell, source, target);
};
mxEdgeHandler.prototype.createBends = function() {
	var cell = this.state.cell;
	var bends = [];
	for (var i = 0; i < this.abspoints.length; i++) {
		if (this.isHandleVisible(i)) {
			var source = i == 0;
			var target = i == this.abspoints.length - 1;
			var terminal = source || target;
			if (terminal || this.graph.isCellBendable(cell)) {
				var bend = this.createHandleShape(i);
				this.initBend(bend);
				if (this.isHandleEnabled(i)) {
					bend.node.style.cursor = mxConstants.CURSOR_BEND_HANDLE;
					mxEvent.redirectMouseEvents(bend.node, this.graph, this.state);
				}
				bends.push(bend);
				if (!terminal) {
					this.points.push(new mxPoint(0, 0));
					bend.node.style.visibility = 'hidden';
				}
			}
		}
	}
	return bends;
};
mxEdgeHandler.prototype.isHandleEnabled = function(index) {
	return true;
};
mxEdgeHandler.prototype.isHandleVisible = function(index) {
	return ! this.abspoints[index].isRouted;
};
mxEdgeHandler.prototype.createHandleShape = function(index) {
	return new mxRectangleShape(new mxRectangle(), mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
};
mxEdgeHandler.prototype.initBend = function(bend) {
	if (this.preferHtml) {
		bend.dialect = mxConstants.DIALECT_STRICTHTML;
		bend.init(this.graph.container);
	} else {
		bend.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
		bend.init(this.graph.getView().getOverlayPane());
	}
};
mxEdgeHandler.prototype.getHandleForEvent = function(me) {
	if (this.bends != null) {
		for (var i = 0; i < this.bends.length; i++) {
			if (me.isSource(this.bends[i])) {
				return i;
			}
		}
	}
	if (me.isSource(this.labelShape) || me.isSource(this.state.text)) {
		return mxEvent.LABEL_HANDLE;
	}
	return null;
};
mxEdgeHandler.prototype.mouseDown = function(sender, me) {
	var handle = null;
	if (false || me.getState() == this.state) {
		handle = this.getHandleForEvent(me);
	}
	if (!me.isConsumed() && this.graph.isEnabled() && !this.graph.isForceMarqueeEvent(me.getEvent()) && handle != null) {
		if (this.removeEnabled && this.isRemovePointEvent(me.getEvent())) {
			this.removePoint(this.state, handle);
		} else if (handle != mxEvent.LABEL_HANDLE || this.graph.isLabelMovable(me.getCell())) {
			this.start(me.getX(), me.getY(), handle);
		}
		me.consume();
	}
};
mxEdgeHandler.prototype.start = function(x, y, index) {
	this.startX = x;
	this.startY = y;
	this.isSource = (this.bends == null) ? false: index == 0;
	this.isTarget = (this.bends == null) ? false: index == this.bends.length - 1;
	this.isLabel = index == mxEvent.LABEL_HANDLE;
	if (this.isSource || this.isTarget) {
		var cell = this.state.cell;
		var terminal = this.graph.model.getTerminal(cell, this.isSource);
		if (terminal == null || this.graph.isCellDisconnectable(cell, terminal, this.isSource)) {
			var p0 = this.abspoints[0];
			var pe = this.abspoints[this.abspoints.length - 1];
			this.abspoints = [];
			this.abspoints.push(p0);
			this.abspoints.push(pe);
			this.index = index;
		}
	} else {
		this.index = index;
	}
};
mxEdgeHandler.prototype.mouseMove = function(sender, me) {
	if (this.index != null && this.marker != null) {
		var gridEnabled = this.graph.isGridEnabledEvent(me.getEvent());
		var point = mxUtils.convertPoint(this.graph.container, me.getX(), me.getY(), gridEnabled);
		if (gridEnabled) {
			var view = this.graph.getView();
			var scale = view.scale;
			point.x = this.graph.snap(point.x / scale) * scale;
			point.y = this.graph.snap(point.y / scale) * scale;
		}
		if (this.isLabel) {
			this.label.x = point.x;
			this.label.y = point.y;
		} else {
			var clone = this.state.clone();
			var geometry = this.graph.getCellGeometry(this.state.cell);
			var points = geometry.points;
			var source = null;
			var target = null;
			if (this.isSource || this.isTarget) {
				this.constraintHandler.update(me, this.isSource);
				this.marker.process(me);
				var currentState = this.marker.getValidState();
				target = this.graph.getView().getVisibleTerminal(this.state.cell, !this.isSource);
				if (this.constraintHandler.currentFocus != null && this.constraintHandler.currentConstraint != null) {
					this.marker.reset();
				}
				if (currentState != null) {
					source = currentState.cell;
				} else if (this.constraintHandler.currentFocus != null) {
					source = this.constraintHandler.currentFocus.cell;
				} else {
					clone.setAbsoluteTerminalPoint(point, this.isSource);
					if (this.marker.getMarkedState() == null) {
						this.error = (this.graph.allowDanglingEdges) ? null: '';
					}
				}
				if (!this.isSource) {
					var tmp = source;
					source = target;
					target = tmp;
				}
			} else {
				this.convertPoint(point, gridEnabled);
				if (points == null) {
					points = [point];
				} else {
					points[this.index - 1] = point;
				}
				this.points = points;
				this.active = true;
				source = clone.view.getVisibleTerminal(this.state.cell, true);
				target = clone.view.getVisibleTerminal(this.state.cell, false);
			}
			var sourceState = clone.view.getState(source);
			var targetState = clone.view.getState(target);
			var sourceConstraint = this.graph.getConnectionConstraint(clone, sourceState, true);
			var targetConstraint = this.graph.getConnectionConstraint(clone, targetState, false);
			var constraint = this.constraintHandler.currentConstraint;
			if (constraint == null) {
				constraint = new mxConnectionConstraint();
			}
			if (this.isSource) {
				sourceConstraint = constraint;
			} else if (this.isTarget) {
				targetConstraint = constraint;
			}
			if (!this.isSource || sourceState != null) {
				clone.view.updateFixedTerminalPoint(clone, sourceState, true, sourceConstraint);
			}
			if (!this.isTarget || targetState != null) {
				clone.view.updateFixedTerminalPoint(clone, targetState, false, targetConstraint);
			}
			clone.view.updatePoints(clone, points, sourceState, targetState);
			clone.view.updateFloatingTerminalPoints(clone, sourceState, targetState);
			var color = (this.error == null) ? this.marker.validColor: this.marker.invalidColor;
			this.setPreviewColor(color);
			this.abspoints = clone.absolutePoints;
		}
		this.drawPreview();
		mxEvent.consume(me.getEvent());
		me.consume();
	}
};
mxEdgeHandler.prototype.mouseUp = function(sender, me) {
	if (this.index != null && this.marker != null) {
		var edge = this.state.cell;
		if (me.getX() != this.startX || me.getY() != this.startY) {
			if (this.error != null) {
				if (this.error.length > 0) {
					this.graph.validationAlert(this.error);
				}
			} else if (this.isLabel) {
				this.moveLabel(this.state, this.label.x, this.label.y);
			} else if (this.isSource || this.isTarget) {
				var terminal = null;
				if (this.constraintHandler.currentFocus != null) {
					terminal = this.constraintHandler.currentFocus.cell;
				}
				if (terminal == null && this.marker.hasValidState()) {
					terminal = this.marker.validState.cell;
				}
				if (terminal != null) {
					var edge = this.connect(edge, terminal, this.isSource, this.graph.isCloneEvent(me.getEvent()) && this.cloneEnabled && this.graph.isCellsCloneable(), me);
				} else if (this.graph.isAllowDanglingEdges()) {
					var pt = this.graph.getPointForEvent(me.getEvent());
					var pstate = this.graph.getView().getState(this.graph.getModel().getParent(edge));
					if (pstate != null) {
						pt.x -= pstate.origin.x;
						pt.y -= pstate.origin.y;
					}
					this.changeTerminalPoint(edge, pt, this.isSource);
				}
			} else if (this.active) {
				this.changePoints(edge, this.points);
			} else {
				this.graph.getView().invalidate(this.state.cell);
				this.graph.getView().revalidate(this.state.cell);
			}
			this.abspoints = this.state.absolutePoints;
		}
		if (this.marker != null) {
			this.reset();
			if (edge != this.state.cell) {
				this.graph.setSelectionCell(edge);
			}
		}
		me.consume();
	}
};
mxEdgeHandler.prototype.reset = function() {
	this.error = null;
	this.index = null;
	this.label = null;
	this.active = false;
	this.isLabel = false;
	this.isSource = false;
	this.isTarget = false;
	this.marker.reset();
	this.constraintHandler.reset();
	this.setPreviewColor(mxConstants.EDGE_SELECTION_COLOR);
	this.redraw();
};
mxEdgeHandler.prototype.setPreviewColor = function(color) {
	if (this.shape != null && this.shape.node != null) {
		if (this.shape.dialect == mxConstants.DIALECT_SVG) {
			this.shape.innerNode.setAttribute('stroke', color);
		} else {
			this.shape.node.setAttribute('strokecolor', color);
		}
	}
};
mxEdgeHandler.prototype.convertPoint = function(point, gridEnabled) {
	var scale = this.graph.getView().getScale();
	var tr = this.graph.getView().getTranslate();
	if (gridEnabled) {
		point.x = this.graph.snap(point.x);
		point.y = this.graph.snap(point.y);
	}
	point.x = point.x / scale - tr.x;
	point.y = point.y / scale - tr.y;
	var pstate = this.graph.getView().getState(this.graph.getModel().getParent(this.state.cell));
	if (pstate != null) {
		point.x -= pstate.origin.x;
		point.y -= pstate.origin.y;
	}
	return point;
};
mxEdgeHandler.prototype.moveLabel = function(edgeState, x, y) {
	var model = this.graph.getModel();
	var geometry = model.getGeometry(edgeState.cell);
	if (geometry != null) {
		geometry = geometry.clone();
		var pt = this.graph.getView().getRelativePoint(edgeState, x, y);
		geometry.x = pt.x;
		geometry.y = pt.y;
		var scale = this.graph.getView().scale;
		geometry.offset = new mxPoint(0, 0);
		var pt = this.graph.view.getPoint(edgeState, geometry);
		geometry.offset = new mxPoint((x - pt.x) / scale, (y - pt.y) / scale);
		model.setGeometry(edgeState.cell, geometry);
	}
};
mxEdgeHandler.prototype.connect = function(edge, terminal, isSource, isClone, me) {
	var model = this.graph.getModel();
	var parent = model.getParent(edge);
	model.beginUpdate();
	try {
		if (isClone) {
			var clone = edge.clone();
			model.add(parent, clone, model.getChildCount(parent));
			var other = model.getTerminal(edge, !isSource);
			this.graph.connectCell(clone, other, !isSource);
			edge = clone;
		}
		var constraint = this.constraintHandler.currentConstraint;
		if (constraint == null) {
			constraint = new mxConnectionConstraint();
		}
		this.graph.connectCell(edge, terminal, isSource, constraint);
	} finally {
		model.endUpdate();
	}
	return edge;
};
mxEdgeHandler.prototype.changeTerminalPoint = function(edge, point, isSource) {
	var model = this.graph.getModel();
	var geo = model.getGeometry(edge);
	if (geo != null) {
		model.beginUpdate();
		try {
			geo = geo.clone();
			geo.setTerminalPoint(point, isSource);
			model.setGeometry(edge, geo);
			this.graph.connectCell(edge, null, isSource, new mxConnectionConstraint())
		} finally {
			model.endUpdate();
		}
	}
};
mxEdgeHandler.prototype.changePoints = function(edge, points) {
	var model = this.graph.getModel();
	var geo = model.getGeometry(edge);
	if (geo != null) {
		geo = geo.clone();
		geo.points = points;
		model.setGeometry(edge, geo);
	}
};
mxEdgeHandler.prototype.addPoint = function(state, evt) {
	var geo = this.graph.getCellGeometry(state.cell);
	if (geo != null) {
		geo = geo.clone();
		var pt = mxUtils.convertPoint(this.graph.container, evt.clientX, evt.clientY);
		var index = mxUtils.findNearestSegment(state, pt.x, pt.y);
		var gridEnabled = this.graph.isGridEnabledEvent(evt);
		this.convertPoint(pt, gridEnabled);
		if (geo.points == null) {
			geo.points = [pt];
		} else {
			geo.points.splice(index, 0, pt);
		}
		this.graph.getModel().setGeometry(state.cell, geo);
		this.destroy();
		this.init();
		mxEvent.consume(evt);
	}
};
mxEdgeHandler.prototype.removePoint = function(state, index) {
	if (index > 0 && index < this.abspoints.length - 1) {
		var geo = this.graph.getCellGeometry(this.state.cell);
		if (geo != null && geo.points != null) {
			geo = geo.clone();
			geo.points.splice(index - 1, 1);
			this.graph.getModel().setGeometry(state.cell, geo);
			this.destroy();
			this.init();
		}
	}
};
mxEdgeHandler.prototype.getHandleFillColor = function(index) {
	var isSource = index == 0;
	var cell = this.state.cell;
	var terminal = this.graph.getModel().getTerminal(cell, isSource);
	var color = mxConstants.HANDLE_FILLCOLOR;
	if (terminal != null) {
		if (this.graph.isCellDisconnectable(cell, terminal, isSource)) {
			color = mxConstants.CONNECT_HANDLE_FILLCOLOR;
		} else {
			color = mxConstants.LOCKED_HANDLE_FILLCOLOR;
		}
	}
	return color;
};
mxEdgeHandler.prototype.redraw = function() {
	this.abspoints = this.state.absolutePoints;
	var cell = this.state.cell;
	var s = mxConstants.LABEL_HANDLE_SIZE;
	this.label = new mxPoint(this.state.absoluteOffset.x, this.state.absoluteOffset.y);
	this.labelShape.bounds = new mxRectangle(this.label.x - s / 2, this.label.y - s / 2, s, s);
	this.labelShape.redraw();
	var lab = this.graph.getLabel(cell);
	if (lab != null && lab.length > 0 && this.graph.isLabelMovable(cell)) {
		this.labelShape.node.style.visibility = 'visible';
	} else {
		this.labelShape.node.style.visibility = 'hidden';
	}
	if (this.bends != null && this.bends.length > 0) {
		var model = this.graph.getModel();
		s = mxConstants.HANDLE_SIZE;
		if (this.preferHtml) {
			s -= 1;
		}
		var n = this.abspoints.length - 1;
		var p0 = this.abspoints[0];
		var x0 = this.abspoints[0].x;
		var y0 = this.abspoints[0].y;
		this.bends[0].bounds = new mxRectangle(x0 - s / 2, y0 - s / 2, s, s);
		this.bends[0].fill = this.getHandleFillColor(0);
		this.bends[0].reconfigure();
		this.bends[0].redraw();
		var pe = this.abspoints[n];
		var xn = this.abspoints[n].x;
		var yn = this.abspoints[n].y;
		var bn = this.bends.length - 1;
		this.bends[bn].bounds = new mxRectangle(xn - s / 2, yn - s / 2, s, s);
		this.bends[bn].fill = this.getHandleFillColor(bn);
		this.bends[bn].reconfigure();
		this.bends[bn].redraw();
		this.redrawInnerBends(p0, pe);
	}
	this.drawPreview();
};
mxEdgeHandler.prototype.redrawInnerBends = function(p0, pe) {
	var s = mxConstants.HANDLE_SIZE;
	var g = this.graph.getModel().getGeometry(this.state.cell);
	var pts = g.points;
	if (pts != null) {
		for (var i = 1; i < this.bends.length - 1; i++) {
			if (this.abspoints[i] != null) {
				var x = this.abspoints[i].x;
				var y = this.abspoints[i].y;
				this.bends[i].node.style.visibility = 'visible';
				this.bends[i].bounds = new mxRectangle(x - s / 2, y - s / 2, s, s);
				this.bends[i].redraw();
				this.points[i - 1] = pts[i - 1];
			} else if (this.bends[i] != null) {
				this.bends[i].destroy();
				this.bends[i] = null;
			}
		}
	}
};
mxEdgeHandler.prototype.drawPreview = function() {
	if (this.isLabel) {
		var s = mxConstants.LABEL_HANDLE_SIZE;
		var bounds = new mxRectangle(this.label.x - s / 2, this.label.y - s / 2, s, s);
		this.labelShape.bounds = bounds;
		this.labelShape.redraw();
	} else {
		this.shape.points = this.abspoints;
		this.shape.redraw();
	}
	mxUtils.repaintGraph(this.graph, this.shape.points[this.shape.points.length - 1]);
};
mxEdgeHandler.prototype.destroy = function() {
	this.marker.destroy();
	this.marker = null;
	this.shape.destroy();
	this.shape = null;
	this.labelShape.destroy();
	this.labelShape = null;
	if (this.constraintHandler != null) {
		this.constraintHandler.destroy();
		this.constraintHandler = null;
	}
	if (this.bends != null) {
		for (var i = 0; i < this.bends.length; i++) {
			if (this.bends[i] != null) {
				this.bends[i].destroy();
				this.bends[i] = null;
			}
		}
	}
};
function mxElbowEdgeHandler(state) {
	if (state != null) {
		this.state = state;
		this.init();
	}
};
mxElbowEdgeHandler.prototype = new mxEdgeHandler();
mxElbowEdgeHandler.prototype.constructor = mxElbowEdgeHandler;
mxElbowEdgeHandler.prototype.flipEnabled = true;
mxElbowEdgeHandler.prototype.doubleClickOrientationResource = (mxClient.language != 'none') ? 'doubleClickOrientation': '';
mxElbowEdgeHandler.prototype.createBends = function() {
	var bends = [];
	var bend = new mxRectangleShape(new mxRectangle(), mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
	this.initBend(bend);
	bend.node.style.cursor = mxConstants.CURSOR_BEND_HANDLE;
	mxEvent.redirectMouseEvents(bend.node, this.graph, this.state);
	bends.push(bend);
	bends.push(this.createVirtualBend());
	this.points.push(new mxPoint(0, 0));
	bend = new mxRectangleShape(new mxRectangle(), mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
	this.initBend(bend);
	bend.node.style.cursor = mxConstants.CURSOR_BEND_HANDLE;
	mxEvent.redirectMouseEvents(bend.node, this.graph, this.state);
	bends.push(bend);
	return bends;
};
mxElbowEdgeHandler.prototype.createVirtualBend = function() {
	var bend = new mxRectangleShape(new mxRectangle(0, 0, 1, 1), mxConstants.HANDLE_FILLCOLOR, mxConstants.HANDLE_STROKECOLOR);
	this.initBend(bend);
	var crs = this.getCursorForBend();
	bend.node.style.cursor = crs;
	var dblClick = mxUtils.bind(this,
	function(evt) {
		if (!mxEvent.isConsumed(evt) && this.flipEnabled) {
			this.graph.flipEdge(this.state.cell, evt);
			mxEvent.consume(evt);
		}
	});
	mxEvent.redirectMouseEvents(bend.node, this.graph, this.state, null, null, null, dblClick);
	if (!this.graph.isCellBendable(this.state.cell)) {
		bend.node.style.visibility = 'hidden';
	}
	return bend;
};
mxElbowEdgeHandler.prototype.getCursorForBend = function() {
	return (this.state.style[mxConstants.STYLE_EDGE] == mxEdgeStyle.TopToBottom || this.state.style[mxConstants.STYLE_EDGE] == mxConstants.EDGESTYLE_TOPTOBOTTOM || ((this.state.style[mxConstants.STYLE_EDGE] == mxEdgeStyle.ElbowConnector || this.state.style[mxConstants.STYLE_EDGE] == mxConstants.EDGESTYLE_ELBOW) && this.state.style[mxConstants.STYLE_ELBOW] == mxConstants.ELBOW_VERTICAL)) ? 'row-resize': 'col-resize';
};
mxElbowEdgeHandler.prototype.getTooltipForNode = function(node) {
	var tip = null;
	if (this.bends != null && this.bends[1] != null && (node == this.bends[1].node || node.parentNode == this.bends[1].node)) {
		tip = this.doubleClickOrientationResource;
		tip = mxResources.get(tip) || tip;
	}
	return tip;
};
mxElbowEdgeHandler.prototype.convertPoint = function(point, gridEnabled) {
	var scale = this.graph.getView().getScale();
	var tr = this.graph.getView().getTranslate();
	var origin = this.state.origin;
	if (gridEnabled) {
		point.x = this.graph.snap(point.x);
		point.y = this.graph.snap(point.y);
	}
	point.x = point.x / scale - tr.x - origin.x;
	point.y = point.y / scale - tr.y - origin.y;
};
mxElbowEdgeHandler.prototype.redrawInnerBends = function(p0, pe) {
	var s = mxConstants.HANDLE_SIZE;
	var g = this.graph.getModel().getGeometry(this.state.cell);
	var pts = g.points;
	var pt = (pts != null) ? pts[0] : null;
	if (pt == null) {
		pt = new mxPoint(p0.x + (pe.x - p0.x) / 2, p0.y + (pe.y - p0.y) / 2);
	} else {
		pt = new mxPoint(this.graph.getView().scale * (pt.x + this.graph.getView().translate.x + this.state.origin.x), this.graph.getView().scale * (pt.y + this.graph.getView().translate.y + this.state.origin.y));
	}
	var bounds = new mxRectangle(pt.x - s / 2, pt.y - s / 2, s, s);
	if (this.labelShape.node.style.visibility != 'hidden' && mxUtils.intersects(bounds, this.labelShape.bounds)) {
		s += 3;
		bounds = new mxRectangle(pt.x - s / 2, pt.y - s / 2, s, s);
	}
	this.bends[1].bounds = bounds;
	this.bends[1].reconfigure();
	this.bends[1].redraw();
};
function mxKeyHandler(graph, target) {
	if (graph != null) {
		this.graph = graph;
		this.target = target || document.documentElement;
		this.normalKeys = [];
		this.controlKeys = [];
		mxEvent.addListener(this.target, "keydown", mxUtils.bind(this,
		function(evt) {
			this.keyDown(evt);
		}));
		if (true) {
			mxEvent.addListener(window, 'unload', mxUtils.bind(this,
			function() {
				this.destroy();
			}));
		}
	}
};
mxKeyHandler.prototype.graph = null;
mxKeyHandler.prototype.target = null;
mxKeyHandler.prototype.normalKeys = null;
mxKeyHandler.prototype.controlKeys = null;
mxKeyHandler.prototype.enabled = true;
mxKeyHandler.prototype.isEnabled = function() {
	return this.enabled;
};
mxKeyHandler.prototype.setEnabled = function(enabled) {
	this.enabled = enabled;
};
mxKeyHandler.prototype.bindKey = function(code, funct) {
	this.normalKeys[code] = funct;
};
mxKeyHandler.prototype.bindControlKey = function(code, funct) {
	this.controlKeys[code] = funct;
};
mxKeyHandler.prototype.getFunction = function(evt) {
	if (evt != null) {
		return (mxEvent.isControlDown(evt)) ? this.controlKeys[evt.keyCode] : this.normalKeys[evt.keyCode];
	}
	return null;
};
mxKeyHandler.prototype.isGraphEvent = function(evt) {
	var source = mxEvent.getSource(evt);
	if ((source == this.target || source.parentNode == this.target) || (this.graph.cellEditor != null && source == this.graph.cellEditor.textarea)) {
		return true;
	}
	var elt = source;
	while (elt != null) {
		if (elt == this.graph.container) {
			return true;
		}
		elt = elt.parentNode;
	}
	return false;
};
mxKeyHandler.prototype.keyDown = function(evt) {
	if (this.graph.isEnabled() && !mxEvent.isConsumed(evt) && this.isGraphEvent(evt) && this.isEnabled()) {
		if (evt.keyCode == 27) {
			this.escape(evt);
		} else if (!this.graph.isEditing()) {
			var boundFunction = this.getFunction(evt);
			if (boundFunction != null) {
				boundFunction(evt);
				mxEvent.consume(evt);
			}
		}
	}
};
mxKeyHandler.prototype.escape = function(evt) {
	if (this.graph.isEscapeEnabled()) {
		this.graph.escape(evt);
	}
};
mxKeyHandler.prototype.destroy = function() {
	this.target = null;
};
function mxTooltipHandler(graph, delay) {
	if (graph != null) {
		this.graph = graph;
		this.delay = delay || 500;
		this.graph.addMouseListener(this);
	}
};
mxTooltipHandler.prototype.zIndex = 10005;
mxTooltipHandler.prototype.graph = null;
mxTooltipHandler.prototype.delay = null;
mxTooltipHandler.prototype.hideOnHover = false;
mxTooltipHandler.prototype.enabled = true;
mxTooltipHandler.prototype.isEnabled = function() {
	return this.enabled;
};
mxTooltipHandler.prototype.setEnabled = function(enabled) {
	this.enabled = enabled;
};
mxTooltipHandler.prototype.isHideOnHover = function() {
	return this.hideOnHover;
};
mxTooltipHandler.prototype.setHideOnHover = function(value) {
	this.hideOnHover = value;
};
mxTooltipHandler.prototype.init = function() {
	if (document.body != null) {
		this.div = document.createElement('div');
		this.div.className = 'mxTooltip';
		this.div.style.visibility = 'hidden';
		this.div.style.zIndex = this.zIndex;
		if (!true && mxClient.TOOLTIP_SHADOWS) {
			this.shadow = document.createElement('div');
			this.shadow.className = 'mxTooltipShadow';
			this.shadow.style.visibility = 'hidden';
			this.shadow.style.zIndex = this.zIndex;
			mxUtils.setOpacity(this.shadow, 70);
			document.body.appendChild(this.shadow);
		} else if (true && !mxClient.TOOLTIP_SHADOWS) {
			this.div.style.filter = '';
		}
		document.body.appendChild(this.div);
		mxEvent.addListener(this.div, 'mousedown', mxUtils.bind(this,
		function(evt) {
			this.hide();
		}));
	}
};
mxTooltipHandler.prototype.mouseDown = function(sender, me) {
	this.reset(me, false);
	this.hide();
};
mxTooltipHandler.prototype.mouseMove = function(sender, me) {
	if (me.getX() != this.lastX || me.getY() != this.lastY) {
		this.reset(me, true);
		if (this.isHideOnHover() || me.getState() != this.state || (me.getSource() != this.node && (!this.stateSource || (me.getState() != null && this.stateSource == (me.isSource(me.getState().shape) || !me.isSource(me.getState().text)))))) {
			this.hide();
		}
	}
	this.lastX = me.getX();
	this.lastY = me.getY();
};
mxTooltipHandler.prototype.mouseUp = function(sender, me) {
	this.reset(me, true);
	this.hide();
};
mxTooltipHandler.prototype.reset = function(me, restart) {
	if (this.thread != null) {
		window.clearTimeout(this.thread);
		this.thread = null;
	}
	if (restart && this.isEnabled() && me.getState() != null && (this.div == null || this.div.style.visibility == 'hidden')) {
		var state = me.getState();
		var node = me.getSource();
		var x = me.getX();
		var y = me.getY();
		var stateSource = me.isSource(state.shape) || me.isSource(state.text);
		this.thread = window.setTimeout(mxUtils.bind(this,
		function() {
			if (!this.graph.isEditing() && !this.graph.panningHandler.isMenuShowing()) {
				var tip = this.graph.getTooltip(state, node, x, y);
				this.show(tip, x, y);
				this.state = state;
				this.node = node;
				this.stateSource = stateSource;
			}
		}), this.delay);
	}
};
mxTooltipHandler.prototype.hide = function() {
	if (this.shadow != null) {
		this.shadow.style.visibility = 'hidden';
	}
	if (this.div != null) {
		this.div.style.visibility = 'hidden';
	}
};
mxTooltipHandler.prototype.show = function(tip, x, y) {
	if (tip != null && tip.length > 0) {
		if (this.div == null) {
			this.init();
		}
		var origin = mxUtils.getScrollOrigin();
		this.div.style.left = (x + origin.x) + 'px';
		this.div.style.top = (y + mxConstants.TOOLTIP_VERTICAL_OFFSET + origin.y) + 'px';
		if (!mxUtils.isNode(tip)) {
			this.div.innerHTML = tip.replace(/\n/g, '<br>');
		} else {
			this.div.innerHTML = '';
			this.div.appendChild(tip);
		}
		this.div.style.visibility = '';
		mxUtils.fit(this.div);
		if (this.shadow != null) {
			this.shadow.style.width = this.div.offsetWidth + 'px';
			this.shadow.style.height = this.div.offsetHeight + 'px';
			this.shadow.style.left = (parseInt(this.div.style.left) + 3) + 'px';
			this.shadow.style.top = (parseInt(this.div.style.top) + 3) + 'px';
			this.shadow.style.visibility = '';
		}
	}
};
mxTooltipHandler.prototype.destroy = function() {
	this.graph.removeMouseListener(this);
	mxEvent.release(this.div);
	if (this.div != null && this.div.parentNode != null) {
		this.div.parentNode.removeChild(this.div);
	}
	this.div = null;
	if (this.shadow != null) {
		mxEvent.release(this.shadow);
		if (this.shadow.parentNode != null) {
			this.shadow.parentNode.removeChild(this.shadow);
		}
		this.shadow = null;
	}
};
function mxCellTracker(graph, color, funct) {
	mxCellMarker.call(this, graph, color);
	this.graph.addMouseListener(this);
	if (funct != null) {
		this.getCell = funct;
	}
	if (true) {
		mxEvent.addListener(window, 'unload', mxUtils.bind(this,
		function() {
			this.destroy();
		}));
	}
};
mxCellTracker.prototype = new mxCellMarker();
mxCellTracker.prototype.constructor = mxCellTracker;
mxCellTracker.prototype.mouseDown = function(sender, me) {};
mxCellTracker.prototype.mouseMove = function(sender, me) {
	if (this.isEnabled()) {
		this.process(me);
	}
};
mxCellTracker.prototype.mouseUp = function(sender, me) {
	this.reset();
};
mxCellTracker.prototype.destroy = function() {
	if (!this.destroyed) {
		this.destroyed = true;
		this.graph.removeMouseListener(this);
		mxCellMarker.prototype.destroy.apply(this);
	}
};
function mxCellHighlight(graph, highlightColor, strokeWidth) {
	if (graph != null) {
		this.graph = graph;
		this.highlightColor = (highlightColor != null) ? highlightColor: mxConstants.DEFAULT_VALID_COLOR;
		this.strokeWidth = (strokeWidth != null) ? strokeWidth: mxConstants.HIGHLIGHT_STROKEWIDTH;
		this.resetHandler = mxUtils.bind(this,
		function(sender) {
			this.hide();
		});
		this.graph.getView().addListener(mxEvent.SCALE, this.resetHandler);
		this.graph.getView().addListener(mxEvent.TRANSLATE, this.resetHandler);
		this.graph.getView().addListener(mxEvent.SCALE_AND_TRANSLATE, this.resetHandler);
		this.graph.getView().addListener(mxEvent.DOWN, this.resetHandler);
		this.graph.getView().addListener(mxEvent.UP, this.resetHandler);
		this.graph.getModel().addListener(mxEvent.CHANGE, this.resetHandler);
	}
};
mxCellHighlight.prototype.keepOnTop = false;
mxCellHighlight.prototype.graph = true;
mxCellHighlight.prototype.state = null;
mxCellHighlight.prototype.resetHandler = null;
mxCellHighlight.prototype.setHighlightColor = function(color) {
	this.highlightColor = color;
	if (this.shape != null) {
		if (this.shape.dialect == mxConstants.DIALECT_SVG) {
			this.shape.innerNode.setAttribute('stroke', color);
		} else if (this.shape.dialect == mxConstants.DIALECT_VML) {
			this.shape.node.setAttribute('strokecolor', color);
		}
	}
};
mxCellHighlight.prototype.createShape = function(state) {
	var shape = null;
	if (this.graph.model.isEdge(state.cell)) {
		shape = new mxPolyline(state.absolutePoints, this.highlightColor, this.strokeWidth);
	} else {
		shape = new mxRectangleShape(new mxRectangle(state.x - 2, state.y - 2, state.width + 4, state.height + 4), null, this.highlightColor, this.strokeWidth);
	}
	shape.dialect = (this.graph.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
	shape.init(this.graph.getView().getOverlayPane());
	mxEvent.redirectMouseEvents(shape.node, this.graph, state);
	if (shape.dialect == mxConstants.DIALECT_SVG) {
		shape.node.setAttribute('style', 'pointer-events:none;');
	} else {
		shape.node.style.background = '';
	}
	if (!this.keepOnTop && shape.node.parentNode.firstChild != shape.node) {
		shape.node.parentNode.insertBefore(shape.node, shape.node.parentNode.firstChild);
	}
	if (this.graph.model.isEdge(state.cell)) {
		mxUtils.repaintGraph(this.graph, shape.points[0]);
	}
	return shape;
};
mxCellHighlight.prototype.hide = function() {
	this.highlight(null);
};
mxCellHighlight.prototype.highlight = function(state) {
	if (this.state != state) {
		if (this.shape != null) {
			this.shape.destroy();
			this.shape = null;
		}
		if (state != null) {
			this.shape = this.createShape(state);
		}
		this.state = state;
	}
};
mxCellHighlight.prototype.destroy = function() {
	this.graph.getView().removeListener(this.resetHandler);
	this.graph.getModel().removeListener(this.resetHandler);
	if (this.shape != null) {
		this.shape.destroy();
		this.shape = null;
	}
};
