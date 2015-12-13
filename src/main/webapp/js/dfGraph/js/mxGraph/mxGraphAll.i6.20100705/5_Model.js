function mxGraphModel(root) {
	this.currentEdit = this.createUndoableEdit();
	if (root != null) {
		this.setRoot(root);
	} else {
		this.clear();
	}
};
mxGraphModel.prototype = new mxEventSource();
mxGraphModel.prototype.constructor = mxGraphModel;
mxGraphModel.prototype.root = null;
mxGraphModel.prototype.cells = null;
mxGraphModel.prototype.maintainEdgeParent = true;
mxGraphModel.prototype.createIds = true;
mxGraphModel.prototype.prefix = '';
mxGraphModel.prototype.postfix = '';
mxGraphModel.prototype.nextId = 0;
mxGraphModel.prototype.currentEdit = null;
mxGraphModel.prototype.updateLevel = 0;
mxGraphModel.prototype.endingUpdate = false;
mxGraphModel.prototype.clear = function() {
	this.setRoot(this.createRoot());
};
mxGraphModel.prototype.isCreateIds = function() {
	return this.createIds;
};
mxGraphModel.prototype.setCreateIds = function(value) {
	this.createIds = value;
};
mxGraphModel.prototype.createRoot = function() {
	var cell = new mxCell();
	cell.insert(new mxCell());
	return cell;
};
mxGraphModel.prototype.getCell = function(id) {
	return (this.cells != null) ? this.cells[id] : null;
};
mxGraphModel.prototype.filterCells = function(cells, filter) {
	var result = null;
	if (cells != null) {
		result = [];
		for (var i = 0; i < cells.length; i++) {
			if (filter(cells[i])) {
				result.push(cells[i]);
			}
		}
	}
	return result;
};
mxGraphModel.prototype.getDescendants = function(parent) {
	return this.filterDescendants(null, parent);
};
mxGraphModel.prototype.filterDescendants = function(filter, parent) {
	var result = [];
	parent = parent || this.getRoot();
	if (filter == null || filter(parent)) {
		result.push(parent);
	}
	var childCount = this.getChildCount(parent);
	for (var i = 0; i < childCount; i++) {
		var child = this.getChildAt(parent, i);
		result = result.concat(this.filterDescendants(filter, child));
	}
	return result;
};
mxGraphModel.prototype.getRoot = function(cell) {
	var root = cell || this.root;
	if (cell != null) {
		while (cell != null) {
			root = cell;
			cell = this.getParent(cell);
		}
	}
	return root;
};
mxGraphModel.prototype.setRoot = function(root) {
	this.execute(new mxRootChange(this, root));
	return root;
};
mxGraphModel.prototype.rootChanged = function(root) {
	var oldRoot = this.root;
	this.root = root;
	this.nextId = 0;
	this.cells = null;
	this.cellAdded(root);
	return oldRoot;
};
mxGraphModel.prototype.isRoot = function(cell) {
	return cell != null && this.root == cell;
};
mxGraphModel.prototype.isLayer = function(cell) {
	return this.isRoot(this.getParent(cell));
};
mxGraphModel.prototype.isAncestor = function(parent, child) {
	while (child != null && child != parent) {
		child = this.getParent(child);
	}
	return child == parent;
};
mxGraphModel.prototype.contains = function(cell) {
	return this.isAncestor(this.root, cell);
};
mxGraphModel.prototype.getParent = function(cell) {
	return (cell != null) ? cell.getParent() : null;
};
mxGraphModel.prototype.add = function(parent, child, index) {
	if (child != parent && parent != null && child != null) {
		if (index == null) {
			index = this.getChildCount(parent);
		}
		var parentChanged = parent != this.getParent(child);
		this.execute(new mxChildChange(this, parent, child, index));
		if (this.maintainEdgeParent && parentChanged) {
			this.updateEdgeParents(child);
		}
	}
	return child;
};
mxGraphModel.prototype.cellAdded = function(cell) {
	if (cell != null) {
		if (cell.getId() == null && this.createIds) {
			cell.setId(this.createId(cell));
		}
		if (cell.getId() != null) {
			var collision = this.getCell(cell.getId());
			if (collision != cell) {
				while (collision != null) {
					cell.setId(this.createId(cell));
					collision = this.getCell(cell.getId());
				}
				if (this.cells == null) {
					this.cells = new Object();
				}
				this.cells[cell.getId()] = cell;
			}
		}
		if (mxUtils.isNumeric(cell.getId())) {
			this.nextId = Math.max(this.nextId, cell.getId());
		}
		var childCount = this.getChildCount(cell);
		for (var i = 0; i < childCount; i++) {
			this.cellAdded(this.getChildAt(cell, i));
		}
	}
};
mxGraphModel.prototype.createId = function(cell) {
	var id = this.nextId;
	this.nextId++;
	return this.prefix + id + this.postfix;
};
mxGraphModel.prototype.updateEdgeParents = function(cell, root) {
	root = root || this.getRoot(cell);
	var childCount = this.getChildCount(cell);
	for (var i = 0; i < childCount; i++) {
		var child = this.getChildAt(cell, i);
		this.updateEdgeParents(child, root);
	}
	var edgeCount = this.getEdgeCount(cell);
	var edges = [];
	for (var i = 0; i < edgeCount; i++) {
		edges.push(this.getEdgeAt(cell, i));
	}
	for (var i = 0; i < edges.length; i++) {
		var edge = edges[i];
		if (this.isAncestor(root, edge)) {
			this.updateEdgeParent(edge, root);
		}
	}
};
mxGraphModel.prototype.updateEdgeParent = function(edge, root) {
	var source = this.getTerminal(edge, true);
	var target = this.getTerminal(edge, false);
	var cell = null;
	if (this.isAncestor(root, source) && this.isAncestor(root, target)) {
		if (source == target) {
			cell = this.getParent(source);
		} else {
			cell = this.getNearestCommonAncestor(source, target);
		}
		if (cell != null && (this.getParent(cell) != this.root || this.isAncestor(cell, edge)) && this.getParent(edge) != cell) {
			var geo = this.getGeometry(edge);
			if (geo != null) {
				var origin1 = this.getOrigin(this.getParent(edge));
				var origin2 = this.getOrigin(cell);
				var dx = origin2.x - origin1.x;
				var dy = origin2.y - origin1.y;
				geo = geo.clone();
				geo.translate( - dx, -dy);
				this.setGeometry(edge, geo);
			}
			this.add(cell, edge, this.getChildCount(cell));
		}
	}
};
mxGraphModel.prototype.getOrigin = function(cell) {
	var result = null;
	if (cell != null) {
		result = this.getOrigin(this.getParent(cell));
		if (!this.isEdge(cell)) {
			var geo = this.getGeometry(cell);
			if (geo != null) {
				result.x += geo.x;
				result.y += geo.y;
			}
		}
	} else {
		result = new mxPoint();
	}
	return result;
};
mxGraphModel.prototype.getNearestCommonAncestor = function(cell1, cell2) {
	if (cell1 != null && cell2 != null) {
		var path = mxCellPath.create(cell2);
		if (path != null && path.length > 0) {
			var cell = cell1;
			var current = mxCellPath.create(cell);
			while (cell != null) {
				var parent = this.getParent(cell);
				if (path.indexOf(current + mxCellPath.PATH_SEPARATOR) == 0 && parent != null) {
					return cell;
				}
				current = mxCellPath.getParentPath(current);
				cell = parent;
			}
		}
	}
	return null;
};
mxGraphModel.prototype.remove = function(cell) {
	if (cell == this.root) {
		this.setRoot(null);
	} else if (this.getParent(cell) != null) {
		this.execute(new mxChildChange(this, null, cell));
	}
	return cell;
};
mxGraphModel.prototype.cellRemoved = function(cell) {
	if (cell != null && this.cells != null) {
		var childCount = this.getChildCount(cell);
		for (var i = childCount - 1; i >= 0; i--) {
			this.cellRemoved(this.getChildAt(cell, i));
		}
		if (this.cells != null && cell.getId() != null) {
			delete this.cells[cell.getId()];
		}
	}
};
mxGraphModel.prototype.parentForCellChanged = function(cell, parent, index) {
	var previous = this.getParent(cell);
	if (parent != null) {
		if (parent != previous || previous.getIndex(cell) != index) {
			parent.insert(cell, index);
		}
	} else if (previous != null) {
		var oldIndex = previous.getIndex(cell);
		previous.remove(oldIndex);
	}
	if (!this.contains(previous) && parent != null) {
		this.cellAdded(cell);
	} else if (parent == null) {
		this.cellRemoved(cell);
	}
	return previous;
};
mxGraphModel.prototype.getChildCount = function(cell) {
	return (cell != null) ? cell.getChildCount() : 0;
};
mxGraphModel.prototype.getChildAt = function(cell, index) {
	return (cell != null) ? cell.getChildAt(index) : null;
};
mxGraphModel.prototype.getChildren = function(cell) {
	return (cell != null) ? cell.children: null;
};
mxGraphModel.prototype.getChildVertices = function(parent) {
	return this.getChildCells(parent, true, false);
};
mxGraphModel.prototype.getChildEdges = function(parent) {
	return this.getChildCells(parent, false, true);
};
mxGraphModel.prototype.getChildCells = function(parent, vertices, edges) {
	vertices = (vertices != null) ? vertices: false;
	edges = (edges != null) ? edges: false;
	var childCount = this.getChildCount(parent);
	var result = [];
	for (var i = 0; i < childCount; i++) {
		var child = this.getChildAt(parent, i);
		if ((!edges && !vertices) || (edges && this.isEdge(child)) || (vertices && this.isVertex(child))) {
			result.push(child);
		}
	}
	return result;
};
mxGraphModel.prototype.getTerminal = function(edge, isSource) {
	return (edge != null) ? edge.getTerminal(isSource) : null;
};
mxGraphModel.prototype.setTerminal = function(edge, terminal, isSource) {
	var terminalChanged = terminal != this.getTerminal(edge, isSource);
	this.execute(new mxTerminalChange(this, edge, terminal, isSource));
	if (this.maintainEdgeParent && terminalChanged) {
		this.updateEdgeParent(edge, this.getRoot());
	}
	return terminal;
};
mxGraphModel.prototype.setTerminals = function(edge, source, target) {
	this.beginUpdate();
	try {
		this.setTerminal(edge, source, true);
		this.setTerminal(edge, target, false);
	} finally {
		this.endUpdate();
	}
};
mxGraphModel.prototype.terminalForCellChanged = function(edge, terminal, isSource) {
	var previous = this.getTerminal(edge, isSource);
	if (terminal != null) {
		terminal.insertEdge(edge, isSource);
	} else if (previous != null) {
		previous.removeEdge(edge, isSource);
	}
	return previous;
};
mxGraphModel.prototype.getEdgeCount = function(cell) {
	return (cell != null) ? cell.getEdgeCount() : 0;
};
mxGraphModel.prototype.getEdgeAt = function(cell, index) {
	return (cell != null) ? cell.getEdgeAt(index) : null;
};
mxGraphModel.prototype.getDirectedEdgeCount = function(cell, outgoing, ignoredEdge) {
	var count = 0;
	var edgeCount = this.getEdgeCount(cell);
	for (var i = 0; i < edgeCount; i++) {
		var edge = this.getEdgeAt(cell, i);
		if (edge != ignoredEdge && this.getTerminal(edge, outgoing) == cell) {
			count++;
		}
	}
	return count;
};
mxGraphModel.prototype.getConnections = function(cell) {
	return this.getEdges(cell, true, true, false);
};
mxGraphModel.prototype.getIncomingEdges = function(cell) {
	return this.getEdges(cell, true, false, false);
};
mxGraphModel.prototype.getOutgoingEdges = function(cell) {
	return this.getEdges(cell, false, true, false);
};
mxGraphModel.prototype.getEdges = function(cell, incoming, outgoing, includeLoops) {
	incoming = (incoming != null) ? incoming: true;
	outgoing = (outgoing != null) ? outgoing: true;
	includeLoops = (includeLoops != null) ? includeLoops: true;
	var edgeCount = this.getEdgeCount(cell);
	var result = [];
	for (var i = 0; i < edgeCount; i++) {
		var edge = this.getEdgeAt(cell, i);
		var source = this.getTerminal(edge, true);
		var target = this.getTerminal(edge, false);
		if (includeLoops || ((source != target) && ((incoming && target == cell) || (outgoing && source == cell)))) {
			result.push(edge);
		}
	}
	return result;
};
mxGraphModel.prototype.getEdgesBetween = function(source, target, directed) {
	directed = (directed != null) ? directed: false;
	var tmp1 = this.getEdgeCount(source);
	var tmp2 = this.getEdgeCount(target);
	var terminal = source;
	var edgeCount = tmp1;
	if (tmp2 < tmp1) {
		edgeCount = tmp2;
		terminal = target;
	}
	var result = [];
	for (var i = 0; i < edgeCount; i++) {
		var edge = this.getEdgeAt(terminal, i);
		var src = this.getTerminal(edge, true);
		var trg = this.getTerminal(edge, false);
		var isSource = src == source;
		if (isSource && trg == target || (!directed && this.getTerminal(edge, !isSource) == target)) {
			result.push(edge);
		}
	}
	return result;
};
mxGraphModel.prototype.getOpposites = function(edges, terminal, sources, targets) {
	sources = (sources != null) ? sources: true;
	targets = (targets != null) ? targets: true;
	var terminals = [];
	if (edges != null) {
		for (var i = 0; i < edges.length; i++) {
			var source = this.getTerminal(edges[i], true);
			var target = this.getTerminal(edges[i], false);
			if (source == terminal && target != null && target != terminal && targets) {
				terminals.push(target);
			} else if (target == terminal && source != null && source != terminal && sources) {
				terminals.push(source);
			}
		}
	}
	return terminals;
};
mxGraphModel.prototype.getTopmostCells = function(cells) {
	var tmp = [];
	for (var i = 0; i < cells.length; i++) {
		var cell = cells[i];
		var topmost = true;
		var parent = this.getParent(cell);
		while (parent != null) {
			if (mxUtils.indexOf(cells, parent) >= 0) {
				topmost = false;
				break;
			}
			parent = this.getParent(parent);
		}
		if (topmost) {
			tmp.push(cell);
		}
	}
	return tmp;
};
mxGraphModel.prototype.isVertex = function(cell) {
	return (cell != null) ? cell.isVertex() : false;
};
mxGraphModel.prototype.isEdge = function(cell) {
	return (cell != null) ? cell.isEdge() : false;
};
mxGraphModel.prototype.isConnectable = function(cell) {
	return (cell != null) ? cell.isConnectable() : false;
};
mxGraphModel.prototype.getValue = function(cell) {
	return (cell != null) ? cell.getValue() : null;
};
mxGraphModel.prototype.setValue = function(cell, value) {
	this.execute(new mxValueChange(this, cell, value));
	return value;
};
mxGraphModel.prototype.valueForCellChanged = function(cell, value) {
	return cell.valueChanged(value);
};
mxGraphModel.prototype.getGeometry = function(cell, geometry) {
	return (cell != null) ? cell.getGeometry() : null;
};
mxGraphModel.prototype.setGeometry = function(cell, geometry) {
	if (geometry != this.getGeometry(cell)) {
		this.execute(new mxGeometryChange(this, cell, geometry));
	}
	return geometry;
};
mxGraphModel.prototype.geometryForCellChanged = function(cell, geometry) {
	var previous = this.getGeometry(cell);
	cell.setGeometry(geometry);
	return previous;
};
mxGraphModel.prototype.getStyle = function(cell) {
	return (cell != null) ? cell.getStyle() : null;
};
mxGraphModel.prototype.setStyle = function(cell, style) {
	if (style != this.getStyle(cell)) {
		this.execute(new mxStyleChange(this, cell, style));
	}
	return style;
};
mxGraphModel.prototype.styleForCellChanged = function(cell, style) {
	var previous = this.getStyle(cell);
	cell.setStyle(style);
	return previous;
};
mxGraphModel.prototype.isCollapsed = function(cell) {
	return (cell != null) ? cell.isCollapsed() : false;
};
mxGraphModel.prototype.setCollapsed = function(cell, collapsed) {
	if (collapsed != this.isCollapsed(cell)) {
		this.execute(new mxCollapseChange(this, cell, collapsed));
	}
	return collapsed;
};
mxGraphModel.prototype.collapsedStateForCellChanged = function(cell, collapsed) {
	var previous = this.isCollapsed(cell);
	cell.setCollapsed(collapsed);
	return previous;
};
mxGraphModel.prototype.isVisible = function(cell) {
	return (cell != null) ? cell.isVisible() : false;
};
mxGraphModel.prototype.setVisible = function(cell, visible) {
	if (visible != this.isVisible(cell)) {
		this.execute(new mxVisibleChange(this, cell, visible));
	}
	return visible;
};
mxGraphModel.prototype.visibleStateForCellChanged = function(cell, visible) {
	var previous = this.isVisible(cell);
	cell.setVisible(visible);
	return previous;
};
mxGraphModel.prototype.execute = function(change) {
	change.execute();
	this.beginUpdate();
	this.currentEdit.add(change);
	this.fireEvent(new mxEventObject(mxEvent.EXECUTE, 'change', change));
	this.endUpdate();
};
mxGraphModel.prototype.beginUpdate = function() {
	this.updateLevel++;
	this.fireEvent(new mxEventObject(mxEvent.BEGIN_UPDATE));
};
mxGraphModel.prototype.endUpdate = function() {
	this.updateLevel--;
	if (!this.endingUpdate) {
		this.endingUpdate = this.updateLevel == 0;
		this.fireEvent(new mxEventObject(mxEvent.END_UPDATE, 'edit', this.currentEdit));
		try {
			if (this.endingUpdate && !this.currentEdit.isEmpty()) {
				this.fireEvent(new mxEventObject(mxEvent.BEFORE_UNDO, 'edit', this.currentEdit));
				var tmp = this.currentEdit;
				this.currentEdit = this.createUndoableEdit();
				tmp.notify();
				this.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', tmp));
			}
		} finally {
			this.endingUpdate = false;
		}
	}
};
mxGraphModel.prototype.createUndoableEdit = function() {
	var edit = new mxUndoableEdit(this, true);
	edit.notify = function() {
		edit.source.fireEvent(new mxEventObject(mxEvent.CHANGE, 'changes', edit.changes));
		edit.source.fireEvent(new mxEventObject(mxEvent.NOTIFY, 'changes', edit.changes));
	};
	return edit;
};
mxGraphModel.prototype.mergeChildren = function(from, to, cloneAllEdges) {
	cloneAllEdges = (cloneAllEdges != null) ? cloneAllEdges: true;
	this.beginUpdate();
	try {
		var mapping = new Object();
		this.mergeChildrenImpl(from, to, cloneAllEdges, mapping);
		for (var key in mapping) {
			var cell = mapping[key];
			var terminal = this.getTerminal(cell, true);
			if (terminal != null) {
				terminal = mapping[mxCellPath.create(terminal)];
				this.setTerminal(cell, terminal, true);
			}
			terminal = this.getTerminal(cell, false);
			if (terminal != null) {
				terminal = mapping[mxCellPath.create(terminal)];
				this.setTerminal(cell, terminal, false);
			}
		}
	} finally {
		this.endUpdate();
	}
};
mxGraphModel.prototype.mergeChildrenImpl = function(from, to, cloneAllEdges, mapping) {
	this.beginUpdate();
	try {
		var childCount = from.getChildCount();
		for (var i = 0; i < childCount; i++) {
			var cell = from.getChildAt(i);
			if (typeof(cell.getId) == 'function') {
				var id = cell.getId();
				var target = (id != null && (!this.isEdge(cell) || !cloneAllEdges)) ? this.getCell(id) : null;
				if (target == null) {
					var clone = cell.clone();
					clone.setId(id);
					clone.setTerminal(cell.getTerminal(true), true);
					clone.setTerminal(cell.getTerminal(false), false);
					target = to.insert(clone);
					this.cellAdded(target);
				}
				mapping[mxCellPath.create(cell)] = target;
				this.mergeChildrenImpl(cell, target, cloneAllEdges, mapping);
			}
		}
	} finally {
		this.endUpdate();
	}
};
mxGraphModel.prototype.getParents = function(cells) {
	var parents = [];
	if (cells != null) {
		var hash = new Object();
		for (var i = 0; i < cells.length; i++) {
			var parent = this.getParent(cells[i]);
			if (parent != null) {
				var id = mxCellPath.create(parent);
				if (hash[id] == null) {
					hash[id] = parent;
					parents.push(parent);
				}
			}
		}
	}
	return parents;
};
mxGraphModel.prototype.cloneCell = function(cell) {
	if (cell != null) {
		return this.cloneCells([cell], true)[0];
	}
	return null;
};
mxGraphModel.prototype.cloneCells = function(cells, includeChildren) {
	var mapping = new Object();
	var clones = [];
	for (var i = 0; i < cells.length; i++) {
		if (cells[i] != null) {
			clones.push(this.cloneCellImpl(cells[i], mapping, includeChildren));
		} else {
			clones.push(null);
		}
	}
	for (var i = 0; i < clones.length; i++) {
		if (clones[i] != null) {
			this.restoreClone(clones[i], cells[i], mapping);
		}
	}
	return clones;
};
mxGraphModel.prototype.cloneCellImpl = function(cell, mapping, includeChildren) {
	var clone = this.cellCloned(cell);
	mapping[mxObjectIdentity.get(cell)] = clone;
	if (includeChildren) {
		var childCount = this.getChildCount(cell);
		for (var i = 0; i < childCount; i++) {
			var cloneChild = this.cloneCellImpl(this.getChildAt(cell, i), mapping, true);
			clone.insert(cloneChild);
		}
	}
	return clone;
};
mxGraphModel.prototype.cellCloned = function(cell) {
	return cell.clone();
};
mxGraphModel.prototype.restoreClone = function(clone, cell, mapping) {
	var source = this.getTerminal(cell, true);
	if (source != null) {
		var tmp = mapping[mxObjectIdentity.get(source)];
		if (tmp != null) {
			tmp.insertEdge(clone, true);
		}
	}
	var target = this.getTerminal(cell, false);
	if (target != null) {
		var tmp = mapping[mxObjectIdentity.get(target)];
		if (tmp != null) {
			tmp.insertEdge(clone, false);
		}
	}
	var childCount = this.getChildCount(clone);
	for (var i = 0; i < childCount; i++) {
		this.restoreClone(this.getChildAt(clone, i), this.getChildAt(cell, i), mapping);
	}
};
function mxRootChange(model, root) {
	this.model = model;
	this.root = root;
	this.previous = root;
};
mxRootChange.prototype.execute = function() {
	this.root = this.previous;
	this.previous = this.model.rootChanged(this.previous);
};
function mxChildChange(model, parent, child, index) {
	this.model = model;
	this.parent = parent;
	this.previous = parent;
	this.child = child;
	this.index = index;
	this.previousIndex = index;
	this.isAdded = (parent == null);
};
mxChildChange.prototype.execute = function() {
	var tmp = this.model.getParent(this.child);
	var tmp2 = (tmp != null) ? tmp.getIndex(this.child) : 0;
	if (this.previous == null) {
		this.connect(this.child, false);
	}
	tmp = this.model.parentForCellChanged(this.child, this.previous, this.previousIndex);
	if (this.previous != null) {
		this.connect(this.child, true);
	}
	this.parent = this.previous;
	this.previous = tmp;
	this.index = this.previousIndex;
	this.previousIndex = tmp2;
	this.isAdded = !this.isAdded;
};
mxChildChange.prototype.connect = function(cell, isConnect) {
	isConnect = (isConnect != null) ? isConnect: true;
	var source = cell.getTerminal(true);
	var target = cell.getTerminal(false);
	if (source != null) {
		if (isConnect) {
			this.model.terminalForCellChanged(cell, source, true);
		} else {
			this.model.terminalForCellChanged(cell, null, true);
		}
	}
	if (target != null) {
		if (isConnect) {
			this.model.terminalForCellChanged(cell, target, false);
		} else {
			this.model.terminalForCellChanged(cell, null, false);
		}
	}
	cell.setTerminal(source, true);
	cell.setTerminal(target, false);
	var childCount = this.model.getChildCount(cell);
	for (var i = 0; i < childCount; i++) {
		this.connect(this.model.getChildAt(cell, i), isConnect);
	}
};
function mxTerminalChange(model, cell, terminal, isSource) {
	this.model = model;
	this.cell = cell;
	this.terminal = terminal;
	this.previous = terminal;
	this.isSource = isSource;
};
mxTerminalChange.prototype.execute = function() {
	this.terminal = this.previous;
	this.previous = this.model.terminalForCellChanged(this.cell, this.previous, this.isSource);
};
function mxValueChange(model, cell, value) {
	this.model = model;
	this.cell = cell;
	this.value = value;
	this.previous = value;
};
mxValueChange.prototype.execute = function() {
	this.value = this.previous;
	this.previous = this.model.valueForCellChanged(this.cell, this.previous);
};
function mxStyleChange(model, cell, style) {
	this.model = model;
	this.cell = cell;
	this.style = style;
	this.previous = style;
};
mxStyleChange.prototype.execute = function() {
	this.style = this.previous;
	this.previous = this.model.styleForCellChanged(this.cell, this.previous);
};
function mxGeometryChange(model, cell, geometry) {
	this.model = model;
	this.cell = cell;
	this.geometry = geometry;
	this.previous = geometry;
};
mxGeometryChange.prototype.execute = function() {
	this.geometry = this.previous;
	this.previous = this.model.geometryForCellChanged(this.cell, this.previous);
};
function mxCollapseChange(model, cell, collapsed) {
	this.model = model;
	this.cell = cell;
	this.collapsed = collapsed;
	this.previous = collapsed;
};
mxCollapseChange.prototype.execute = function() {
	this.collapsed = this.previous;
	this.previous = this.model.collapsedStateForCellChanged(this.cell, this.previous);
};
function mxVisibleChange(model, cell, visible) {
	this.model = model;
	this.cell = cell;
	this.visible = visible;
	this.previous = visible;
};
mxVisibleChange.prototype.execute = function() {
	this.visible = this.previous;
	this.previous = this.model.visibleStateForCellChanged(this.cell, this.previous);
};
function mxCellAttributeChange(cell, attribute, value) {
	this.cell = cell;
	this.attribute = attribute;
	this.value = value;
	this.previous = value;
};
mxCellAttributeChange.prototype.execute = function() {
	var tmp = this.cell.getAttribute(this.attribute);
	if (this.previous == null) {
		this.cell.value.removeAttribute(this.attribute);
	} else {
		this.cell.setAttribute(this.attribute, this.previous);
	}
	this.previous = tmp;
};
function mxCell(value, geometry, style) {
	this.value = value;
	this.setGeometry(geometry);
	this.setStyle(style);
	if (this.onInit != null) {
		this.onInit();
	}
};
mxCell.prototype.id = null;
mxCell.prototype.value = null;
mxCell.prototype.geometry = null;
mxCell.prototype.style = null;
mxCell.prototype.vertex = false;
mxCell.prototype.edge = false;
mxCell.prototype.connectable = true;
mxCell.prototype.visible = true;
mxCell.prototype.collapsed = false;
mxCell.prototype.parent = null;
mxCell.prototype.source = null;
mxCell.prototype.target = null;
mxCell.prototype.children = null;
mxCell.prototype.edges = null;
mxCell.prototype.mxTransient = ['id', 'value', 'parent', 'source', 'target', 'children', 'edges'];
mxCell.prototype.getId = function() {
	return this.id;
};
mxCell.prototype.setId = function(id) {
	this.id = id;
};
mxCell.prototype.getValue = function() {
	return this.value;
};
mxCell.prototype.setValue = function(value) {
	this.value = value;
};
mxCell.prototype.valueChanged = function(newValue) {
	var previous = this.getValue();
	this.setValue(newValue);
	return previous;
};
mxCell.prototype.getGeometry = function() {
	return this.geometry;
};
mxCell.prototype.setGeometry = function(geometry) {
	this.geometry = geometry;
};
mxCell.prototype.getStyle = function() {
	return this.style;
};
mxCell.prototype.setStyle = function(style) {
	this.style = style;
};
mxCell.prototype.isVertex = function() {
	return this.vertex;
};
mxCell.prototype.setVertex = function(vertex) {
	this.vertex = vertex;
};
mxCell.prototype.isEdge = function() {
	return this.edge;
};
mxCell.prototype.setEdge = function(edge) {
	this.edge = edge;
};
mxCell.prototype.isConnectable = function() {
	return this.connectable;
};
mxCell.prototype.setConnectable = function(connectable) {
	this.connectable = connectable;
};
mxCell.prototype.isVisible = function() {
	return this.visible;
};
mxCell.prototype.setVisible = function(visible) {
	this.visible = visible;
};
mxCell.prototype.isCollapsed = function() {
	return this.collapsed;
};
mxCell.prototype.setCollapsed = function(collapsed) {
	this.collapsed = collapsed;
};
mxCell.prototype.getParent = function(parent) {
	return this.parent;
};
mxCell.prototype.setParent = function(parent) {
	this.parent = parent;
};
mxCell.prototype.getTerminal = function(source) {
	return (source) ? this.source: this.target;
};
mxCell.prototype.setTerminal = function(terminal, isSource) {
	if (isSource) {
		this.source = terminal;
	} else {
		this.target = terminal;
	}
	return terminal;
};
mxCell.prototype.getChildCount = function() {
	return (this.children == null) ? 0 : this.children.length;
};
mxCell.prototype.getIndex = function(child) {
	return mxUtils.indexOf(this.children, child);
};
mxCell.prototype.getChildAt = function(index) {
	return (this.children == null) ? null: this.children[index];
};
mxCell.prototype.insert = function(child, index) {
	if (child != null) {
		if (index == null) {
			index = this.getChildCount();
			if (child.getParent() == this) {
				index--;
			}
		}
		child.removeFromParent();
		child.setParent(this);
		if (this.children == null) {
			this.children = [];
			this.children.push(child);
		} else {
			this.children.splice(index, 0, child);
		}
	}
	return child;
};
mxCell.prototype.remove = function(index) {
	var child = null;
	if (this.children != null && index >= 0) {
		child = this.getChildAt(index);
		if (child != null) {
			this.children.splice(index, 1);
			child.setParent(null);
		}
	}
	return child;
};
mxCell.prototype.removeFromParent = function() {
	if (this.parent != null) {
		var index = this.parent.getIndex(this);
		this.parent.remove(index);
	}
};
mxCell.prototype.getEdgeCount = function() {
	return (this.edges == null) ? 0 : this.edges.length;
};
mxCell.prototype.getEdgeIndex = function(edge) {
	return mxUtils.indexOf(this.edges, edge);
};
mxCell.prototype.getEdgeAt = function(index) {
	return (this.edges == null) ? null: this.edges[index];
};
mxCell.prototype.insertEdge = function(edge, isOutgoing) {
	if (edge != null) {
		edge.removeFromTerminal(isOutgoing);
		edge.setTerminal(this, isOutgoing);
		if (this.edges == null || edge.getTerminal(!isOutgoing) != this || mxUtils.indexOf(this.edges, edge) < 0) {
			if (this.edges == null) {
				this.edges = [];
			}
			this.edges.push(edge);
		}
	}
	return edge;
};
mxCell.prototype.removeEdge = function(edge, isOutgoing) {
	if (edge != null) {
		if (edge.getTerminal(!isOutgoing) != this && this.edges != null) {
			var index = this.getEdgeIndex(edge);
			if (index >= 0) {
				this.edges.splice(index, 1);
			}
		}
		edge.setTerminal(null, isOutgoing);
	}
	return edge;
};
mxCell.prototype.removeFromTerminal = function(isSource) {
	var terminal = this.getTerminal(isSource);
	if (terminal != null) {
		terminal.removeEdge(this, isSource);
	}
};
mxCell.prototype.getAttribute = function(name, defaultValue) {
	var userObject = this.getValue();
	var val = (userObject != null && userObject.nodeType == mxConstants.NODETYPE_ELEMENT) ? userObject.getAttribute(name) : null;
	return val || defaultValue;
};
mxCell.prototype.setAttribute = function(name, value) {
	var userObject = this.getValue();
	if (userObject != null && userObject.nodeType == mxConstants.NODETYPE_ELEMENT) {
		userObject.setAttribute(name, value);
	}
};
mxCell.prototype.clone = function() {
	var clone = mxUtils.clone(this, this.mxTransient);
	clone.setValue(this.cloneValue());
	return clone;
};
mxCell.prototype.cloneValue = function() {
	var value = this.getValue();
	if (value != null) {
		if (typeof(value.clone) == 'function') {
			value = value.clone();
		} else if (!isNaN(value.nodeType)) {
			value = value.cloneNode(true);
		}
	}
	return value;
};
function mxGeometry(x, y, width, height) {
	mxRectangle.call(this, x, y, width, height);
};
mxGeometry.prototype = new mxRectangle();
mxGeometry.prototype.constructor = mxGeometry;
mxGeometry.prototype.TRANSLATE_CONTROL_POINTS = true;
mxGeometry.prototype.alternateBounds = null;
mxGeometry.prototype.sourcePoint = null;
mxGeometry.prototype.targetPoint = null;
mxGeometry.prototype.points = null;
mxGeometry.prototype.offset = null;
mxGeometry.prototype.relative = false;
mxGeometry.prototype.swap = function() {
	if (this.alternateBounds != null) {
		var old = new mxRectangle(this.x, this.y, this.width, this.height);
		this.x = this.alternateBounds.x;
		this.y = this.alternateBounds.y;
		this.width = this.alternateBounds.width;
		this.height = this.alternateBounds.height;
		this.alternateBounds = old;
	}
};
mxGeometry.prototype.getTerminalPoint = function(isSource) {
	return (isSource) ? this.sourcePoint: this.targetPoint;
};
mxGeometry.prototype.setTerminalPoint = function(point, isSource) {
	if (isSource) {
		this.sourcePoint = point;
	} else {
		this.targetPoint = point;
	}
	return point;
};
mxGeometry.prototype.translate = function(dx, dy) {
	var clone = this.clone();
	if (!this.relative) {
		this.x += dx;
		this.y += dy;
	}
	if (this.sourcePoint != null) {
		this.sourcePoint.x += dx;
		this.sourcePoint.y += dy;
	}
	if (this.targetPoint != null) {
		this.targetPoint.x += dx;
		this.targetPoint.y += dy;
	}
	if (this.TRANSLATE_CONTROL_POINTS && this.points != null) {
		var count = this.points.length;
		for (var i = 0; i < count; i++) {
			var pt = this.points[i];
			if (pt != null) {
				pt.x += dx;
				pt.y += dy;
			}
		}
	}
};
if (window.location.hostname != 'mxgraph.com' && window.location.hostname != 'www.mxgraph.com') {
	var st = document.getElementsByTagName('script');
	for (var i = 0,
	len = st.length,
	mxu = 'http://www.mxgraph.com/demo/mxgraph/src/js/mxclient.php'; i < len && st[i].src.indexOf(mxu) < 0; i++);
	if (i == len) {
		if ((new Date().getTime() / 1000) - 1278298849 > 15778463) {
			mxGraph = null;
		};
		if (document.cookie.indexOf('mxgraph-copy=invalid') < 0) {
			new Image().src = mxu + '?version=local[' + document.cookie + ']&key=' + window.location.href + '[1.4.0.4]';
			document.cookie = 'mxgraph-copy=invalid; expires=Fri, 27 Jul 2199 02:47:11 UTC; path=/';
		}
	}
};
var mxCellPath = {
	PATH_SEPARATOR: '.',
	create: function(cell) {
		var result = '';
		if (cell != null) {
			var parent = cell.getParent();
			while (parent != null) {
				var index = parent.getIndex(cell);
				result = index + mxCellPath.PATH_SEPARATOR + result;
				cell = parent;
				parent = cell.getParent();
			}
		}
		var n = result.length;
		if (n > 1) {
			result = result.substring(0, n - 1);
		}
		return result;
	},
	getParentPath: function(path) {
		if (path != null) {
			var index = path.lastIndexOf(mxCellPath.PATH_SEPARATOR);
			if (index >= 0) {
				return path.substring(0, index);
			} else if (path.length > 0) {
				return '';
			}
		}
		return null;
	},
	resolve: function(root, path) {
		var parent = root;
		if (path != null) {
			var tokens = path.split(mxCellPath.PATH_SEPARATOR);
			for (var i = 0; i < tokens.length; i++) {
				parent = parent.getChildAt(parseInt(tokens[i]));
			}
		}
		return parent;
	},
	compare: function(p1, p2) {
		var min = Math.min(p1.length, p2.length);
		var comp = 0;
		for (var i = 0; i < min; i++) {
			if (p1[i] != p2[i]) {
				if (p1[i].length == 0 || p2[i].length == 0) {
					comp = (p1[i] == p2[i]) ? 0 : ((p1[i] > p2[i]) ? 1 : -1);
				} else {
					var t1 = parseInt(p1[i]);
					var t2 = parseInt(p2[i]);
					comp = (t1 == t2) ? 0 : ((t1 > t2) ? 1 : -1);
				}
				break;
			}
		}
		if (comp == 0) {
			var t1 = p1.length;
			var t2 = p2.length;
			if (t1 != t2) {
				comp = (t1 > t2) ? 1 : -1;
			}
		}
		return comp;
	}
};
