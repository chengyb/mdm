function mxGraphLayout(graph) {
	this.graph = graph;
};
mxGraphLayout.prototype.graph = null;
mxGraphLayout.prototype.useBoundingBox = true;
mxGraphLayout.prototype.moveCell = function(cell, x, y) {};
mxGraphLayout.prototype.execute = function(parent) {};
mxGraphLayout.prototype.getGraph = function() {
	return this.graph;
};
mxGraphLayout.prototype.getConstraint = function(key, cell, edge, source) {
	var state = this.graph.view.getState(cell);
	var style = (state != null) ? state.style: this.graph.getCellStyle(cell);
	return (style != null) ? style[key] : null;
};
mxGraphLayout.prototype.isVertexMovable = function(cell) {
	return this.graph.isCellMovable(cell);
};
mxGraphLayout.prototype.isVertexIgnored = function(vertex) {
	return ! this.graph.getModel().isVertex(vertex) || !this.graph.isCellVisible(vertex);
};
mxGraphLayout.prototype.isEdgeIgnored = function(edge) {
	var model = this.graph.getModel();
	return ! model.isEdge(edge) || !this.graph.isCellVisible(edge) || model.getTerminal(edge, true) == null || model.getTerminal(edge, false) == null;
};
mxGraphLayout.prototype.setEdgeStyleEnabled = function(edge, value) {
	this.graph.setCellStyles(mxConstants.STYLE_NOEDGESTYLE, (value) ? '0': '1', [edge]);
};
mxGraphLayout.prototype.setEdgePoints = function(edge, points) {
	if (edge != null) {
		var model = this.graph.model;
		var geometry = model.getGeometry(edge);
		if (geometry == null) {
			geometry = new mxGeometry();
			geometry.setRelative(true);
		} else {
			geometry = geometry.clone();
		}
		geometry.points = points;
		model.setGeometry(edge, geometry);
	}
};
mxGraphLayout.prototype.setVertexLocation = function(cell, x, y) {
	var model = this.graph.getModel();
	var geometry = model.getGeometry(cell);
	var result = null;
	if (geometry != null) {
		result = new mxRectangle(x, y, geometry.width, geometry.height);
		if (this.useBoundingBox) {
			var state = this.graph.getView().getState(cell);
			if (state != null && state.text != null && state.text.boundingBox != null) {
				var scale = this.graph.getView().scale;
				var box = state.text.boundingBox;
				if (state.text.boundingBox.x < state.x) {
					x += (state.x - box.x) / scale;
					result.width = box.width;
				}
				if (state.text.boundingBox.y < state.y) {
					y += (state.y - box.y) / scale;
					result.height = box.height;
				}
			}
		}
		if (geometry.x != x || geometry.y != y) {
			geometry = geometry.clone();
			geometry.x = x;
			geometry.y = y;
			model.setGeometry(cell, geometry);
		}
	}
	return result;
};
mxGraphLayout.prototype.getVertexBounds = function(cell) {
	var geo = this.graph.getModel().getGeometry(cell);
	if (this.useBoundingBox) {
		var state = this.graph.getView().getState(cell);
		if (state != null && state.text != null && state.text.boundingBox != null) {
			var scale = this.graph.getView().scale;
			var tmp = state.text.boundingBox;
			var dx0 = Math.max(state.x - tmp.x, 0) / scale;
			var dy0 = Math.max(state.y - tmp.y, 0) / scale;
			var dx1 = Math.max((tmp.x + tmp.width) - (state.x + state.width), 0) / scale;
			var dy1 = Math.max((tmp.y + tmp.height) - (state.y + state.height), 0) / scale;
			geo = new mxRectangle(geo.x - dx0, geo.y - dy0, geo.width + dx0 + dx1, geo.height + dy0 + dy1);
		}
	}
	return new mxRectangle(geo.x, geo.y, geo.width, geo.height);
};
function mxStackLayout(graph, horizontal, spacing, x0, y0, border) {
	mxGraphLayout.call(this, graph);
	this.horizontal = (horizontal != null) ? horizontal: true;
	this.spacing = (spacing != null) ? spacing: 0;
	this.x0 = (x0 != null) ? x0: 0;
	this.y0 = (y0 != null) ? y0: 0;
	this.border = (border != null) ? border: 0;
};
mxStackLayout.prototype = new mxGraphLayout();
mxStackLayout.prototype.constructor = mxStackLayout;
mxStackLayout.prototype.horizontal = null;
mxStackLayout.prototype.spacing = null;
mxStackLayout.prototype.x0 = null;
mxStackLayout.prototype.y0 = null;
mxStackLayout.prototype.border = 0;
mxStackLayout.prototype.keepFirstLocation = false;
mxStackLayout.prototype.fill = false;
mxStackLayout.prototype.resizeParent = false;
mxStackLayout.prototype.wrap = null;
mxStackLayout.prototype.isHorizontal = function() {
	return this.horizontal;
};
mxStackLayout.prototype.moveCell = function(cell, x, y) {
	var model = this.graph.getModel();
	var parent = model.getParent(cell);
	var horizontal = this.isHorizontal();
	if (cell != null && parent != null) {
		var i = 0;
		var last = 0;
		var childCount = model.getChildCount(parent);
		var value = (horizontal) ? x: y;
		var pstate = this.graph.getView().getState(parent);
		if (pstate != null) {
			value -= (horizontal) ? pstate.x: pstate.y;
		}
		for (i = 0; i < childCount; i++) {
			var child = model.getChildAt(parent, i);
			if (child != cell) {
				var bounds = model.getGeometry(child);
				if (bounds != null) {
					var tmp = (horizontal) ? bounds.x + bounds.width / 2 : bounds.y + bounds.height / 2;
					if (last < value && tmp > value) {
						break;
					}
					last = tmp;
				}
			}
		}
		var idx = parent.getIndex(cell);
		idx = Math.max(0, i - ((i > idx) ? 1 : 0));
		model.add(parent, cell, idx);
	}
};
mxStackLayout.prototype.getParentSize = function(parent) {
	var model = this.graph.getModel();
	var pgeo = model.getGeometry(parent);
	if (this.graph.container != null && ((pgeo == null && model.isLayer(parent)) || parent == this.graph.getView().currentRoot)) {
		var width = this.graph.container.offsetWidth - 1;
		var height = this.graph.container.offsetHeight - 1;
		pgeo = new mxRectangle(0, 0, width, height);
	}
	return pgeo;
};
mxStackLayout.prototype.execute = function(parent) {
	if (parent != null) {
		var horizontal = this.isHorizontal();
		var model = this.graph.getModel();
		var pgeo = this.getParentSize(parent);
		var fillValue = 0;
		if (pgeo != null) {
			fillValue = (horizontal) ? pgeo.height: pgeo.width;
		}
		fillValue -= 2 * this.spacing + 2 * this.border;
		var size = (this.graph.isSwimlane(parent)) ? this.graph.getStartSize(parent) : new mxRectangle();
		fillValue -= (horizontal) ? size.height: size.width;
		var x0 = this.x0 + size.width + this.border;
		var y0 = this.y0 + size.height + this.border;
		model.beginUpdate();
		try {
			var tmp = 0;
			var last = null;
			var childCount = model.getChildCount(parent);
			for (var i = 0; i < childCount; i++) {
				var child = model.getChildAt(parent, i);
				if (!this.isVertexIgnored(child) && this.isVertexMovable(child)) {
					var geo = model.getGeometry(child);
					if (geo != null) {
						geo = geo.clone();
						if (this.wrap != null && last != null) {
							if ((horizontal && last.x + last.width + geo.width + 2 * this.spacing > this.wrap) || (!horizontal && last.y + last.height + geo.height + 2 * this.spacing > this.wrap)) {
								last = null;
								if (horizontal) {
									y0 += tmp + this.spacing;
								} else {
									x0 += tmp + this.spacing;
								}
								tmp = 0;
							}
						}
						tmp = Math.max(tmp, (horizontal) ? geo.height: geo.width);
						if (last != null) {
							if (horizontal) {
								geo.x = last.x + last.width + this.spacing;
							} else {
								geo.y = last.y + last.height + this.spacing;
							}
						} else if (!this.keepFirstLocation) {
							if (horizontal) {
								geo.x = x0;
							} else {
								geo.y = y0;
							}
						}
						if (horizontal) {
							geo.y = y0;
						} else {
							geo.x = x0;
						}
						if (this.fill && fillValue > 0) {
							if (horizontal) {
								geo.height = fillValue;
							} else {
								geo.width = fillValue;
							}
						}
						model.setGeometry(child, geo);
						last = geo;
					}
				}
			}
			if (this.resizeParent && pgeo != null && last != null && !this.graph.isCellCollapsed(parent)) {
				pgeo = pgeo.clone();
				if (horizontal) {
					pgeo.width = last.x + last.width + this.spacing;
				} else {
					pgeo.height = last.y + last.height + this.spacing;
				}
				model.setGeometry(parent, pgeo);
			}
		} finally {
			model.endUpdate();
		}
	}
};
function mxPartitionLayout(graph, horizontal, spacing, border) {
	mxGraphLayout.call(this, graph);
	this.horizontal = (horizontal != null) ? horizontal: true;
	this.spacing = spacing || 0;
	this.border = border || 0;
};
mxPartitionLayout.prototype = new mxGraphLayout();
mxPartitionLayout.prototype.constructor = mxPartitionLayout;
mxPartitionLayout.prototype.horizontal = null;
mxPartitionLayout.prototype.spacing = null;
mxPartitionLayout.prototype.border = null;
mxPartitionLayout.prototype.resizeVertices = true;
mxPartitionLayout.prototype.isHorizontal = function() {
	return this.horizontal;
};
mxPartitionLayout.prototype.moveCell = function(cell, x, y) {
	var model = this.graph.getModel();
	var parent = model.getParent(cell);
	if (cell != null && parent != null) {
		var i = 0;
		var last = 0;
		var childCount = model.getChildCount(parent);
		for (i = 0; i < childCount; i++) {
			var child = model.getChildAt(parent, i);
			var bounds = this.getVertexBounds(child);
			if (bounds != null) {
				var tmp = bounds.x + bounds.width / 2;
				if (last < x && tmp > x) {
					break;
				}
				last = tmp;
			}
		}
		var idx = parent.getIndex(cell);
		idx = Math.max(0, i - ((i > idx) ? 1 : 0));
		model.add(parent, cell, idx);
	}
};
mxPartitionLayout.prototype.execute = function(parent) {
	var horizontal = this.isHorizontal();
	var model = this.graph.getModel();
	var pgeo = model.getGeometry(parent);
	if (this.graph.container != null && ((pgeo == null && model.isLayer(parent)) || parent == this.graph.getView().currentRoot)) {
		var width = this.graph.container.offsetWidth - 1;
		var height = this.graph.container.offsetHeight - 1;
		pgeo = new mxRectangle(0, 0, width, height);
	}
	if (pgeo != null) {
		var children = [];
		var childCount = model.getChildCount(parent);
		for (var i = 0; i < childCount; i++) {
			var child = model.getChildAt(parent, i);
			if (!this.isVertexIgnored(child) && this.isVertexMovable(child)) {
				children.push(child);
			}
		}
		var n = children.length;
		if (n > 0) {
			var x0 = this.border;
			var y0 = this.border;
			var other = (horizontal) ? pgeo.height: pgeo.width;
			other -= 2 * this.border;
			var size = (this.graph.isSwimlane(parent)) ? this.graph.getStartSize(parent) : new mxRectangle();
			other -= (horizontal) ? size.height: size.width;
			x0 = x0 + size.width;
			y0 = y0 + size.height;
			var tmp = this.border + (n - 1) * this.spacing;
			var value = (horizontal) ? ((pgeo.width - x0 - tmp) / n) : ((pgeo.height - y0 - tmp) / n);
			if (value > 0) {
				model.beginUpdate();
				try {
					for (var i = 0; i < n; i++) {
						var child = children[i];
						var geo = model.getGeometry(child);
						if (geo != null) {
							geo = geo.clone();
							geo.x = x0;
							geo.y = y0;
							if (horizontal) {
								if (this.resizeVertices) {
									geo.width = value;
									geo.height = other;
								}
								x0 += value + this.spacing;
							} else {
								if (this.resizeVertices) {
									geo.height = value;
									geo.width = other;
								}
								y0 += value + this.spacing;
							}
							model.setGeometry(child, geo);
						}
					}
				} finally {
					model.endUpdate();
				}
			}
		}
	}
};
function mxCompactTreeLayout(graph, horizontal, invert) {
	mxGraphLayout.call(this, graph);
	this.horizontal = (horizontal != null) ? horizontal: true;
	this.invert = (invert != null) ? invert: false;
};
mxCompactTreeLayout.prototype = new mxGraphLayout();
mxCompactTreeLayout.prototype.constructor = mxCompactTreeLayout;
mxCompactTreeLayout.prototype.horizontal = null;
mxCompactTreeLayout.prototype.invert = null;
mxCompactTreeLayout.prototype.resizeParent = true;
mxCompactTreeLayout.prototype.moveTree = true;
mxCompactTreeLayout.prototype.levelDistance = 10;
mxCompactTreeLayout.prototype.nodeDistance = 20;
mxCompactTreeLayout.prototype.resetEdges = true;
mxCompactTreeLayout.prototype.isVertexIgnored = function(vertex) {
	return mxGraphLayout.prototype.isVertexIgnored.apply(this, arguments) || this.graph.getConnections(vertex).length == 0;
};
mxCompactTreeLayout.prototype.isHorizontal = function() {
	return this.horizontal;
};
mxCompactTreeLayout.prototype.execute = function(parent, root) {
	var model = this.graph.getModel();
	if (root == null) {
		if (this.graph.getEdges(parent, model.getParent(parent), this.invert, !this.invert, false).length > 0) {
			root = parent;
		} else {
			var roots = this.graph.findTreeRoots(parent, true, this.invert);
			if (roots.length > 0) {
				for (var i = 0; i < roots.length; i++) {
					if (!this.isVertexIgnored(roots[i]) && this.graph.getEdges(roots[i], null, this.invert, !this.invert, false).length > 0) {
						root = roots[i];
						break;
					}
				}
			}
		}
	}
	if (root != null) {
		parent = model.getParent(root);
		model.beginUpdate();
		try {
			var node = this.dfs(root, parent);
			if (node != null) {
				this.layout(node);
				var x0 = this.graph.gridSize;
				var y0 = x0;
				if (!this.moveTree || model.isLayer(parent)) {
					var g = model.getGeometry(root);
					if (g != null) {
						x0 = g.x;
						y0 = g.y;
					}
				}
				var bounds = null;
				if (this.isHorizontal()) {
					bounds = this.horizontalLayout(node, x0, y0);
				} else {
					bounds = this.verticalLayout(node, null, x0, y0);
				}
				if (bounds != null) {
					var dx = 0;
					var dy = 0;
					if (bounds.x < 0) {
						dx = Math.abs(x0 - bounds.x);
					}
					if (bounds.y < 0) {
						dy = Math.abs(y0 - bounds.y);
					}
					if (parent != null) {
						var size = (this.graph.isSwimlane(parent)) ? this.graph.getStartSize(parent) : new mxRectangle();
						dx += size.width;
						dy += size.height;
						if (this.resizeParent && !this.graph.isCellCollapsed(parent)) {
							var g = model.getGeometry(parent);
							if (g != null) {
								var width = bounds.width + size.width - bounds.x + 2 * x0;
								var height = bounds.height + size.height - bounds.y + 2 * y0;
								g = g.clone();
								if (g.width > width) {
									dx += (g.width - width) / 2;
								} else {
									g.width = width;
								}
								if (g.height > height) {
									if (this.isHorizontal()) {
										dy += (g.height - height) / 2;
									}
								} else {
									g.height = height;
								}
								model.setGeometry(parent, g);
							}
						}
					}
					this.moveNode(node, dx, dy);
				}
			}
		} finally {
			model.endUpdate();
		}
	}
};
mxCompactTreeLayout.prototype.moveNode = function(node, dx, dy) {
	node.x += dx;
	node.y += dy;
	this.apply(node);
	var child = node.child;
	while (child != null) {
		this.moveNode(child, dx, dy);
		child = child.next;
	}
};
mxCompactTreeLayout.prototype.dfs = function(cell, parent, visited) {
	visited = (visited != null) ? visited: [];
	var id = mxCellPath.create(cell);
	var node = null;
	if (cell != null && visited[id] == null && !this.isVertexIgnored(cell)) {
		visited[id] = cell;
		node = this.createNode(cell);
		var model = this.graph.getModel();
		var prev = null;
		var out = this.graph.getEdges(cell, parent, this.invert, !this.invert, false);
		for (var i = 0; i < out.length; i++) {
			var edge = out[i];
			if (!this.isEdgeIgnored(edge)) {
				if (this.resetEdges) {
					this.setEdgePoints(edge, null);
				}
				var target = this.graph.getView().getVisibleTerminal(edge, this.invert);
				var tmp = this.dfs(target, parent, visited);
				if (tmp != null && model.getGeometry(target) != null) {
					if (prev == null) {
						node.child = tmp;
					} else {
						prev.next = tmp;
					}
					prev = tmp;
				}
			}
		}
	}
	return node;
};
mxCompactTreeLayout.prototype.layout = function(node) {
	if (node != null) {
		var child = node.child;
		while (child != null) {
			this.layout(child);
			child = child.next;
		}
		if (node.child != null) {
			this.attachParent(node, this.join(node));
		} else {
			this.layoutLeaf(node);
		}
	}
};
mxCompactTreeLayout.prototype.horizontalLayout = function(node, x0, y0, bounds) {
	node.x += x0 + node.offsetX;
	node.y += y0 + node.offsetY;
	bounds = this.apply(node, bounds);
	var child = node.child;
	if (child != null) {
		bounds = this.horizontalLayout(child, node.x, node.y, bounds);
		var siblingOffset = node.y + child.offsetY;
		var s = child.next;
		while (s != null) {
			bounds = this.horizontalLayout(s, node.x + child.offsetX, siblingOffset, bounds);
			siblingOffset += s.offsetY;
			s = s.next;
		}
	}
	return bounds;
};
mxCompactTreeLayout.prototype.verticalLayout = function(node, parent, x0, y0, bounds) {
	node.x += x0 + node.offsetY;
	node.y += y0 + node.offsetX;
	bounds = this.apply(node, bounds);
	var child = node.child;
	if (child != null) {
		bounds = this.verticalLayout(child, node, node.x, node.y, bounds);
		var siblingOffset = node.x + child.offsetY;
		var s = child.next;
		while (s != null) {
			bounds = this.verticalLayout(s, node, siblingOffset, node.y + child.offsetX, bounds);
			siblingOffset += s.offsetY;
			s = s.next;
		}
	}
	return bounds;
};
mxCompactTreeLayout.prototype.attachParent = function(node, height) {
	var x = this.nodeDistance + this.levelDistance;
	var y2 = (height - node.width) / 2 - this.nodeDistance;
	var y1 = y2 + node.width + 2 * this.nodeDistance - height;
	node.child.offsetX = x + node.height;
	node.child.offsetY = y1;
	node.contour.upperHead = this.createLine(node.height, 0, this.createLine(x, y1, node.contour.upperHead));
	node.contour.lowerHead = this.createLine(node.height, 0, this.createLine(x, y2, node.contour.lowerHead));
};
mxCompactTreeLayout.prototype.layoutLeaf = function(node) {
	var dist = 2 * this.nodeDistance;
	node.contour.upperTail = this.createLine(node.height + dist, 0);
	node.contour.upperHead = node.contour.upperTail;
	node.contour.lowerTail = this.createLine(0, -node.width - dist);
	node.contour.lowerHead = this.createLine(node.height + dist, 0, node.contour.lowerTail);
};
mxCompactTreeLayout.prototype.join = function(node) {
	var dist = 2 * this.nodeDistance;
	var child = node.child;
	node.contour = child.contour;
	var h = child.width + dist;
	var sum = h;
	child = child.next;
	while (child != null) {
		var d = this.merge(node.contour, child.contour);
		child.offsetY = d + h;
		child.offsetX = 0;
		h = child.width + dist;
		sum += d + h;
		child = child.next;
	}
	return sum;
};
mxCompactTreeLayout.prototype.merge = function(p1, p2) {
	var x = 0;
	var y = 0;
	var total = 0;
	var upper = p1.lowerHead;
	var lower = p2.upperHead;
	while (lower != null && upper != null) {
		var d = this.offset(x, y, lower.dx, lower.dy, upper.dx, upper.dy);
		y += d;
		total += d;
		if (x + lower.dx <= upper.dx) {
			x += lower.dx;
			y += lower.dy;
			lower = lower.next;
		} else {
			x -= upper.dx;
			y -= upper.dy;
			upper = upper.next;
		}
	}
	if (lower != null) {
		var b = this.bridge(p1.upperTail, 0, 0, lower, x, y);
		p1.upperTail = (b.next != null) ? p2.upperTail: b;
		p1.lowerTail = p2.lowerTail;
	} else {
		var b = this.bridge(p2.lowerTail, x, y, upper, 0, 0);
		if (b.next == null) {
			p1.lowerTail = b;
		}
	}
	p1.lowerHead = p2.lowerHead;
	return total;
};
mxCompactTreeLayout.prototype.offset = function(p1, p2, a1, a2, b1, b2) {
	var d = 0;
	if (b1 <= p1 || p1 + a1 <= 0) {
		return 0;
	}
	var t = b1 * a2 - a1 * b2;
	if (t > 0) {
		if (p1 < 0) {
			var s = p1 * a2;
			d = s / a1 - p2;
		} else if (p1 > 0) {
			var s = p1 * b2;
			d = s / b1 - p2;
		} else {
			d = -p2;
		}
	} else if (b1 < p1 + a1) {
		var s = (b1 - p1) * a2;
		d = b2 - (p2 + s / a1);
	} else if (b1 > p1 + a1) {
		var s = (a1 + p1) * b2;
		d = s / b1 - (p2 + a2);
	} else {
		d = b2 - (p2 + a2);
	}
	if (d > 0) {
		return d;
	} else {
		return 0;
	}
};
mxCompactTreeLayout.prototype.bridge = function(line1, x1, y1, line2, x2, y2) {
	var dx = x2 + line2.dx - x1;
	var dy = 0;
	var s = 0;
	if (line2.dx == 0) {
		dy = line2.dy;
	} else {
		var s = dx * line2.dy;
		dy = s / line2.dx;
	}
	var r = this.createLine(dx, dy, line2.next);
	line1.next = this.createLine(0, y2 + line2.dy - dy - y1, r);
	return r;
};
mxCompactTreeLayout.prototype.createNode = function(cell) {
	var node = new Object();
	node.cell = cell;
	node.x = 0;
	node.y = 0;
	node.width = 0;
	node.height = 0;
	var geo = this.getVertexBounds(cell);
	if (geo != null) {
		if (this.isHorizontal()) {
			node.width = geo.height;
			node.height = geo.width;
		} else {
			node.width = geo.width;
			node.height = geo.height;
		}
	}
	node.offsetX = 0;
	node.offsetY = 0;
	node.contour = new Object();
	return node;
};
mxCompactTreeLayout.prototype.apply = function(node, bounds) {
	var g = this.graph.getModel().getGeometry(node.cell);
	if (node.cell != null && g != null) {
		if (this.isVertexMovable(node.cell)) {
			g = this.setVertexLocation(node.cell, node.x, node.y);
		}
		if (bounds == null) {
			bounds = new mxRectangle(g.x, g.y, g.width, g.height);
		} else {
			bounds = new mxRectangle(Math.min(bounds.x, g.x), Math.min(bounds.y, g.y), Math.max(bounds.x + bounds.width, g.x + g.width), Math.max(bounds.y + bounds.height, g.y + g.height));
		}
	}
	return bounds;
};
mxCompactTreeLayout.prototype.createLine = function(dx, dy, next) {
	var line = new Object();
	line.dx = dx;
	line.dy = dy;
	line.next = next;
	return line;
};
function mxFastOrganicLayout(graph) {
	mxGraphLayout.call(this, graph);
};
mxFastOrganicLayout.prototype = new mxGraphLayout();
mxFastOrganicLayout.prototype.constructor = mxFastOrganicLayout;
mxFastOrganicLayout.prototype.useInputOrigin = true;
mxFastOrganicLayout.prototype.resetEdges = true;
mxFastOrganicLayout.prototype.disableEdgeStyle = true;
mxFastOrganicLayout.prototype.forceConstant = 50;
mxFastOrganicLayout.prototype.forceConstantSquared = 0;
mxFastOrganicLayout.prototype.minDistanceLimit = 2;
mxFastOrganicLayout.prototype.minDistanceLimitSquared = 4;
mxFastOrganicLayout.prototype.initialTemp = 200;
mxFastOrganicLayout.prototype.temperature = 0;
mxFastOrganicLayout.prototype.maxIterations = 0;
mxFastOrganicLayout.prototype.iteration = 0;
mxFastOrganicLayout.prototype.vertexArray;
mxFastOrganicLayout.prototype.dispX;
mxFastOrganicLayout.prototype.dispY;
mxFastOrganicLayout.prototype.cellLocation;
mxFastOrganicLayout.prototype.radius;
mxFastOrganicLayout.prototype.radiusSquared;
mxFastOrganicLayout.prototype.isMoveable;
mxFastOrganicLayout.prototype.neighbours;
mxFastOrganicLayout.prototype.indices;
mxFastOrganicLayout.prototype.allowedToRun = true;
mxFastOrganicLayout.prototype.isVertexIgnored = function(vertex) {
	return mxGraphLayout.prototype.isVertexIgnored.apply(this, arguments) || this.graph.getConnections(vertex).length == 0;
};
mxFastOrganicLayout.prototype.execute = function(parent) {
	var model = this.graph.getModel();
	this.vertexArray = [];
	var cells = this.graph.getChildVertices(parent);
	for (var i = 0; i < cells.length; i++) {
		if (!this.isVertexIgnored(cells[i])) {
			this.vertexArray.push(cells[i]);
		}
	}
	var initialBounds = (this.useInputOrigin) ? this.graph.view.getBounds(this.vertexArray) : null;
	var n = this.vertexArray.length;
	this.indices = [];
	this.dispX = [];
	this.dispY = [];
	this.cellLocation = [];
	this.isMoveable = [];
	this.neighbours = [];
	this.radius = [];
	this.radiusSquared = [];
	if (this.forceConstant < 0.001) {
		this.forceConstant = 0.001;
	}
	this.forceConstantSquared = this.forceConstant * this.forceConstant;
	for (var i = 0; i < this.vertexArray.length; i++) {
		var vertex = this.vertexArray[i];
		this.cellLocation[i] = [];
		var id = mxCellPath.create(vertex);
		this.indices[id] = i;
		var bounds = this.getVertexBounds(vertex);
		var width = bounds.width;
		var height = bounds.height;
		var x = bounds.x;
		var y = bounds.y;
		this.cellLocation[i][0] = x + width / 2.0;
		this.cellLocation[i][1] = y + height / 2.0;
		this.radius[i] = Math.min(width, height);
		this.radiusSquared[i] = this.radius[i] * this.radius[i];
	}
	model.beginUpdate();
	try {
		for (var i = 0; i < n; i++) {
			this.dispX[i] = 0;
			this.dispY[i] = 0;
			this.isMoveable[i] = this.isVertexMovable(this.vertexArray[i]);
			var edges = this.graph.getConnections(this.vertexArray[i], parent);
			var cells = this.graph.getOpposites(edges, this.vertexArray[i]);
			this.neighbours[i] = [];
			for (var j = 0; j < cells.length; j++) {
				if (this.resetEdges) {
					this.graph.resetEdge(edges[j]);
				}
				if (this.disableEdgeStyle) {
					this.setEdgeStyleEnabled(edges[j], false);
				}
				var id = mxCellPath.create(cells[j]);
				var index = this.indices[id];
				if (index != null) {
					this.neighbours[i][j] = index;
				} else {
					this.neighbours[i][j] = i;
				}
			}
		}
		this.temperature = this.initialTemp;
		if (this.maxIterations == 0) {
			this.maxIterations = 20 * Math.sqrt(n);
		}
		for (this.iteration = 0; this.iteration < this.maxIterations; this.iteration++) {
			if (!this.allowedToRun) {
				return;
			}
			this.calcRepulsion();
			this.calcAttraction();
			this.calcPositions();
			this.reduceTemperature();
		}
		var minx = null;
		var miny = null;
		for (var i = 0; i < this.vertexArray.length; i++) {
			var vertex = this.vertexArray[i];
			if (this.isVertexMovable(vertex)) {
				var bounds = this.getVertexBounds(vertex);
				if (bounds != null) {
					this.cellLocation[i][0] -= bounds.width / 2.0;
					this.cellLocation[i][1] -= bounds.height / 2.0;
					var x = this.graph.snap(this.cellLocation[i][0]);
					var y = this.graph.snap(this.cellLocation[i][1]);
					this.setVertexLocation(vertex, x, y);
					if (minx == null) {
						minx = x;
					} else {
						minx = Math.min(minx, x);
					}
					if (miny == null) {
						miny = y;
					} else {
						miny = Math.min(miny, y);
					}
				}
			}
		}
		var dx = -(minx || 0) + 1;
		var dy = -(miny || 0) + 1;
		if (initialBounds != null) {
			dx += initialBounds.x;
			dy += initialBounds.y;
		}
		this.graph.moveCells(this.vertexArray, dx, dy);
	} finally {
		model.endUpdate();
	}
};
mxFastOrganicLayout.prototype.calcPositions = function() {
	for (var index = 0; index < this.vertexArray.length; index++) {
		if (this.isMoveable[index]) {
			var deltaLength = Math.sqrt(this.dispX[index] * this.dispX[index] + this.dispY[index] * this.dispY[index]);
			if (deltaLength < 0.001) {
				deltaLength = 0.001;
			}
			var newXDisp = this.dispX[index] / deltaLength * Math.min(deltaLength, this.temperature);
			var newYDisp = this.dispY[index] / deltaLength * Math.min(deltaLength, this.temperature);
			this.dispX[index] = 0;
			this.dispY[index] = 0;
			this.cellLocation[index][0] += newXDisp;
			this.cellLocation[index][1] += newYDisp;
		}
	}
};
mxFastOrganicLayout.prototype.calcAttraction = function() {
	for (var i = 0; i < this.vertexArray.length; i++) {
		for (var k = 0; k < this.neighbours[i].length; k++) {
			var j = this.neighbours[i][k];
			if (i != j && this.isMoveable[i] && this.isMoveable[j]) {
				var xDelta = this.cellLocation[i][0] - this.cellLocation[j][0];
				var yDelta = this.cellLocation[i][1] - this.cellLocation[j][1];
				var deltaLengthSquared = xDelta * xDelta + yDelta * yDelta - this.radiusSquared[i] - this.radiusSquared[j];
				if (deltaLengthSquared < this.minDistanceLimitSquared) {
					deltaLengthSquared = this.minDistanceLimitSquared;
				}
				var deltaLength = Math.sqrt(deltaLengthSquared);
				var force = (deltaLengthSquared) / this.forceConstant;
				var displacementX = (xDelta / deltaLength) * force;
				var displacementY = (yDelta / deltaLength) * force;
				this.dispX[i] -= displacementX;
				this.dispY[i] -= displacementY;
				this.dispX[j] += displacementX;
				this.dispY[j] += displacementY;
			}
		}
	}
};
mxFastOrganicLayout.prototype.calcRepulsion = function() {
	var vertexCount = this.vertexArray.length;
	for (var i = 0; i < vertexCount; i++) {
		for (var j = i; j < vertexCount; j++) {
			if (!this.allowedToRun) {
				return;
			}
			if (j != i && this.isMoveable[i] && this.isMoveable[j]) {
				var xDelta = this.cellLocation[i][0] - this.cellLocation[j][0];
				var yDelta = this.cellLocation[i][1] - this.cellLocation[j][1];
				if (xDelta == 0) {
					xDelta = 0.01 + Math.random();
				}
				if (yDelta == 0) {
					yDelta = 0.01 + Math.random();
				}
				var deltaLength = Math.sqrt((xDelta * xDelta) + (yDelta * yDelta));
				var deltaLengthWithRadius = deltaLength - this.radius[i] - this.radius[j];
				if (deltaLengthWithRadius < this.minDistanceLimit) {
					deltaLengthWithRadius = this.minDistanceLimit;
				}
				var force = this.forceConstantSquared / deltaLengthWithRadius;
				var displacementX = (xDelta / deltaLength) * force;
				var displacementY = (yDelta / deltaLength) * force;
				this.dispX[i] += displacementX;
				this.dispY[i] += displacementY;
				this.dispX[j] -= displacementX;
				this.dispY[j] -= displacementY;
			}
		}
	}
};
mxFastOrganicLayout.prototype.reduceTemperature = function() {
	this.temperature = this.initialTemp * (1.0 - this.iteration / this.maxIterations);
};
function mxCircleLayout(graph, radius) {
	mxGraphLayout.call(this, graph);
	this.radius = (radius != null) ? radius: 100;
};
mxCircleLayout.prototype = new mxGraphLayout();
mxCircleLayout.prototype.constructor = mxCircleLayout;
mxCircleLayout.prototype.radius = null;
mxCircleLayout.prototype.moveCircle = false;
mxCircleLayout.prototype.x0 = 0;
mxCircleLayout.prototype.y0 = 0;
mxCircleLayout.prototype.resetEdges = true;
mxCircleLayout.prototype.disableEdgeStyle = true;
mxCircleLayout.prototype.execute = function(parent) {
	var model = this.graph.getModel();
	model.beginUpdate();
	try {
		var max = 0;
		var top = null;
		var left = null;
		var vertices = [];
		var childCount = model.getChildCount(parent);
		for (var i = 0; i < childCount; i++) {
			var cell = model.getChildAt(parent, i);
			if (!this.isVertexIgnored(cell)) {
				vertices.push(cell);
				var bounds = this.getVertexBounds(cell);
				if (top == null) {
					top = bounds.y;
				} else {
					top = Math.min(top, bounds.y);
				}
				if (left == null) {
					left = bounds.x;
				} else {
					left = Math.min(left, bounds.x);
				}
				max = Math.max(max, Math.max(bounds.width, bounds.height));
			} else if (!this.isEdgeIgnored(cell)) {
				if (this.resetEdges) {
					this.graph.resetEdge(cell);
				}
				if (this.disableEdgeStyle) {
					this.setEdgeStyleEnabled(cell, false);
				}
			}
		}
		var vertexCount = vertices.length;
		var r = Math.max(vertexCount * max / Math.PI, this.radius);
		if (this.moveCircle) {
			top = this.x0;
			left = this.y0;
		}
		this.circle(vertices, r, left, top);
	} finally {
		model.endUpdate();
	}
};
mxCircleLayout.prototype.circle = function(vertices, r, left, top) {
	var vertexCount = vertices.length;
	var phi = 2 * Math.PI / vertexCount;
	for (var i = 0; i < vertexCount; i++) {
		if (this.isVertexMovable(vertices[i])) {
			this.setVertexLocation(vertices[i], left + r + r * Math.sin(i * phi), top + r + r * Math.cos(i * phi));
		}
	}
};
function mxParallelEdgeLayout(graph) {
	mxGraphLayout.call(this, graph);
};
mxParallelEdgeLayout.prototype = new mxGraphLayout();
mxParallelEdgeLayout.prototype.constructor = mxParallelEdgeLayout;
mxParallelEdgeLayout.prototype.spacing = 20;
mxParallelEdgeLayout.prototype.execute = function(parent) {
	var lookup = this.findParallels(parent);
	this.graph.model.beginUpdate();
	try {
		for (var i in lookup) {
			var parallels = lookup[i];
			if (parallels.length > 1) {
				this.layout(parallels);
			}
		}
	} finally {
		this.graph.model.endUpdate();
	}
};
mxParallelEdgeLayout.prototype.findParallels = function(parent) {
	var view = this.graph.getView();
	var model = this.graph.getModel();
	var lookup = [];
	var childCount = model.getChildCount(parent);
	for (var i = 0; i < childCount; i++) {
		var child = model.getChildAt(parent, i);
		if (!this.isEdgeIgnored(child)) {
			var id = this.getEdgeId(child);
			if (id != null) {
				if (lookup[id] == null) {
					lookup[id] = [];
				}
				lookup[id].push(child);
			}
		}
	}
	return lookup;
};
mxParallelEdgeLayout.prototype.getEdgeId = function(edge) {
	var view = this.graph.getView();
	var src = view.getVisibleTerminal(edge, true);
	var trg = view.getVisibleTerminal(edge, false);
	if (src != null && trg != null) {
		src = mxCellPath.create(src);
		trg = mxCellPath.create(trg);
		return (src > trg) ? trg + '-' + src: src + '-' + trg;
	}
	return null;
};
mxParallelEdgeLayout.prototype.layout = function(parallels) {
	var edge = parallels[0];
	var view = this.graph.getView();
	var model = this.graph.getModel();
	var src = model.getGeometry(model.getTerminal(edge, true));
	var trg = model.getGeometry(model.getTerminal(edge, false));
	if (src == trg) {
		var x0 = src.x + src.width + this.spacing;
		var y0 = src.y + src.height / 2;
		for (var i = 0; i < parallels.length; i++) {
			this.route(parallels[i], x0, y0);
			x0 += this.spacing;
		}
	} else if (src != null && trg != null) {
		var scx = src.x + src.width / 2;
		var scy = src.y + src.height / 2;
		var tcx = trg.x + trg.width / 2;
		var tcy = trg.y + trg.height / 2;
		var dx = tcx - scx;
		var dy = tcy - scy;
		var len = Math.sqrt(dx * dx + dy * dy);
		var x0 = scx + dx / 2;
		var y0 = scy + dy / 2;
		var nx = dy * this.spacing / len;
		var ny = dx * this.spacing / len;
		x0 += nx * (parallels.length - 1) / 2;
		y0 -= ny * (parallels.length - 1) / 2;
		for (var i = 0; i < parallels.length; i++) {
			this.route(parallels[i], x0, y0);
			x0 -= nx;
			y0 += ny;
		}
	}
};
mxParallelEdgeLayout.prototype.route = function(edge, x, y) {
	if (this.graph.isCellMovable(edge)) {
		this.setEdgePoints(edge, [new mxPoint(x, y)]);
	}
};
function mxCompositeLayout(graph, layouts, master) {
	mxGraphLayout.call(this, graph);
	this.layouts = layouts;
	this.master = master;
};
mxCompositeLayout.prototype = new mxGraphLayout();
mxCompositeLayout.prototype.constructor = mxCompositeLayout;
mxCompositeLayout.prototype.layouts = null;
mxCompositeLayout.prototype.master = null;
mxCompositeLayout.prototype.moveCell = function(cell, x, y) {
	if (this.master != null) {
		this.master.move.apply(this.master, arguments);
	} else {
		this.layouts[0].move.apply(this.layouts[0], arguments);
	}
};
mxCompositeLayout.prototype.execute = function(parent) {
	var model = this.graph.getModel();
	model.beginUpdate();
	try {
		for (var i = 0; i < this.layouts.length; i++) {
			this.layouts[i].execute.apply(this.layouts[i], arguments);
		}
	} finally {
		model.endUpdate();
	}
};
function mxEdgeLabelLayout(graph, radius) {
	mxGraphLayout.call(this, graph);
};
mxEdgeLabelLayout.prototype = new mxGraphLayout();
mxEdgeLabelLayout.prototype.constructor = mxEdgeLabelLayout;
mxEdgeLabelLayout.prototype.execute = function(parent) {
	var view = this.graph.view;
	var model = this.graph.getModel();
	var edges = [];
	var vertices = [];
	var childCount = model.getChildCount(parent);
	for (var i = 0; i < childCount; i++) {
		var cell = model.getChildAt(parent, i);
		var state = view.getState(cell);
		if (state != null) {
			if (!this.isVertexIgnored(cell)) {
				vertices.push(state);
			} else if (!this.isEdgeIgnored(cell)) {
				edges.push(state);
			}
		}
	}
	this.placeLabels(vertices, edges);
};
mxEdgeLabelLayout.prototype.placeLabels = function(v, e) {
	var model = this.graph.getModel();
	model.beginUpdate();
	try {
		for (var i = 0; i < e.length; i++) {
			var edge = e[i];
			if (edge != null && edge.text != null && edge.text.boundingBox != null) {
				for (var j = 0; j < v.length; j++) {
					var vertex = v[j];
					if (vertex != null) {
						this.avoid(edge, vertex);
					}
				}
			}
		}
	} finally {
		model.endUpdate();
	}
};
mxEdgeLabelLayout.prototype.avoid = function(edge, vertex) {
	var model = this.graph.getModel();
	var labRect = edge.text.boundingBox;
	if (mxUtils.intersects(labRect, vertex)) {
		var dy1 = -labRect.y - labRect.height + vertex.y;
		var dy2 = -labRect.y + vertex.y + vertex.height;
		var dy = (Math.abs(dy1) < Math.abs(dy2)) ? dy1: dy2;
		var dx1 = -labRect.x - labRect.width + vertex.x;
		var dx2 = -labRect.x + vertex.x + vertex.width;
		var dx = (Math.abs(dx1) < Math.abs(dx2)) ? dx1: dx2;
		if (Math.abs(dx) < Math.abs(dy)) {
			dy = 0;
		} else {
			dx = 0;
		}
		var g = model.getGeometry(edge.cell);
		if (g != null) {
			g = g.clone();
			if (g.offset != null) {
				g.offset.x += dx;
				g.offset.y += dy;
			} else {
				g.offset = new mxPoint(dx, dy);
			}
			model.setGeometry(edge.cell, g);
		}
	}
};
function mxGraphAbstractHierarchyCell() {
	this.x = [];
	this.y = [];
	this.temp = [];
};
mxGraphAbstractHierarchyCell.prototype.maxRank = -1;
mxGraphAbstractHierarchyCell.prototype.minRank = -1;
mxGraphAbstractHierarchyCell.prototype.x = null;
mxGraphAbstractHierarchyCell.prototype.y = null;
mxGraphAbstractHierarchyCell.prototype.width = 0;
mxGraphAbstractHierarchyCell.prototype.height = 0;
mxGraphAbstractHierarchyCell.prototype.nextLayerConnectedCells = null;
mxGraphAbstractHierarchyCell.prototype.previousLayerConnectedCells = null;
mxGraphAbstractHierarchyCell.prototype.temp = null;
mxGraphAbstractHierarchyCell.prototype.getNextLayerConnectedCells = function(layer) {
	return null;
};
mxGraphAbstractHierarchyCell.prototype.getPreviousLayerConnectedCells = function(layer) {
	return null;
};
mxGraphAbstractHierarchyCell.prototype.isEdge = function() {
	return false;
};
mxGraphAbstractHierarchyCell.prototype.isVertex = function() {
	return false;
};
mxGraphAbstractHierarchyCell.prototype.getGeneralPurposeVariable = function(layer) {
	return null;
};
mxGraphAbstractHierarchyCell.prototype.setGeneralPurposeVariable = function(layer, value) {
	return null;
};
mxGraphAbstractHierarchyCell.prototype.setX = function(layer, value) {
	if (this.isVertex()) {
		this.x[0] = value;
	} else if (this.isEdge()) {
		this.x[layer - this.minRank - 1] = value;
	}
};
mxGraphAbstractHierarchyCell.prototype.getX = function(layer) {
	if (this.isVertex()) {
		return this.x[0];
	} else if (this.isEdge()) {
		return this.x[layer - this.minRank - 1];
	}
	return 0.0;
};
mxGraphAbstractHierarchyCell.prototype.setY = function(layer, value) {
	if (this.isVertex()) {
		this.y[0] = value;
	} else if (this.isEdge()) {
		this.y[layer - this.minRank - 1] = value;
	}
};
function mxGraphHierarchyNode(cell) {
	mxGraphAbstractHierarchyCell.apply(this, arguments);
	this.cell = cell;
};
mxGraphHierarchyNode.prototype = new mxGraphAbstractHierarchyCell();
mxGraphHierarchyNode.prototype.constructor = mxGraphHierarchyNode;
mxGraphHierarchyNode.prototype.cell = null;
mxGraphHierarchyNode.prototype.connectsAsTarget = [];
mxGraphHierarchyNode.prototype.connectsAsSource = [];
mxGraphHierarchyNode.prototype.hashCode = false;
mxGraphHierarchyNode.prototype.getRankValue = function(layer) {
	return this.maxRank;
};
mxGraphHierarchyNode.prototype.getNextLayerConnectedCells = function(layer) {
	if (this.nextLayerConnectedCells == null) {
		this.nextLayerConnectedCells = [];
		this.nextLayerConnectedCells[0] = [];
		for (var i = 0; i < this.connectsAsTarget.length; i++) {
			var edge = this.connectsAsTarget[i];
			if (edge.maxRank == -1 || edge.maxRank == layer + 1) {
				this.nextLayerConnectedCells[0].push(edge.source);
			} else {
				this.nextLayerConnectedCells[0].push(edge);
			}
		}
	}
	return this.nextLayerConnectedCells[0];
};
mxGraphHierarchyNode.prototype.getPreviousLayerConnectedCells = function(layer) {
	if (this.previousLayerConnectedCells == null) {
		this.previousLayerConnectedCells = [];
		this.previousLayerConnectedCells[0] = [];
		for (var i = 0; i < this.connectsAsSource.length; i++) {
			var edge = this.connectsAsSource[i];
			if (edge.minRank == -1 || edge.minRank == layer - 1) {
				this.previousLayerConnectedCells[0].push(edge.target);
			} else {
				this.previousLayerConnectedCells[0].push(edge);
			}
		}
	}
	return this.previousLayerConnectedCells[0];
};
mxGraphHierarchyNode.prototype.isVertex = function() {
	return true;
};
mxGraphHierarchyNode.prototype.getGeneralPurposeVariable = function(layer) {
	return this.temp[0];
};
mxGraphHierarchyNode.prototype.setGeneralPurposeVariable = function(layer, value) {
	this.temp[0] = value;
};
mxGraphHierarchyNode.prototype.isAncestor = function(otherNode) {
	if (otherNode != null && this.hashCode != null && otherNode.hashCode != null && this.hashCode.length < otherNode.hashCode.length) {
		if (this.hashCode == otherNode.hashCode) {
			return true;
		}
		if (this.hashCode == null || this.hashCode == null) {
			return false;
		}
		for (var i = 0; i < this.hashCode.length; i++) {
			if (this.hashCode[i] != otherNode.hashCode[i]) {
				return false;
			}
		}
		return true;
	}
	return false;
};
function mxGraphHierarchyEdge(edges) {
	mxGraphAbstractHierarchyCell.apply(this, arguments);
	this.edges = edges;
};
mxGraphHierarchyEdge.prototype = new mxGraphAbstractHierarchyCell();
mxGraphHierarchyEdge.prototype.constructor = mxGraphHierarchyEdge;
mxGraphHierarchyEdge.prototype.edges = null;
mxGraphHierarchyEdge.prototype.source = null;
mxGraphHierarchyEdge.prototype.target = null;
mxGraphHierarchyEdge.prototype.isReversed = false;
mxGraphHierarchyEdge.prototype.invert = function(layer) {
	var temp = this.source;
	this.source = this.target;
	this.target = temp;
	this.isReversed = !this.isReversed;
};
mxGraphHierarchyEdge.prototype.getNextLayerConnectedCells = function(layer) {
	if (this.nextLayerConnectedCells == null) {
		this.nextLayerConnectedCells = [];
		for (var i = 0; i < this.temp.length; i++) {
			this.nextLayerConnectedCells[i] = [];
			if (i == this.nextLayerConnectedCells.length - 1) {
				this.nextLayerConnectedCells[i].push(this.source);
			} else {
				this.nextLayerConnectedCells[i].push(this);
			}
		}
	}
	return this.nextLayerConnectedCells[layer - this.minRank - 1];
};
mxGraphHierarchyEdge.prototype.getPreviousLayerConnectedCells = function(layer) {
	if (this.previousLayerConnectedCells == null) {
		this.previousLayerConnectedCells = [];
		for (var i = 0; i < this.temp.length; i++) {
			this.previousLayerConnectedCells[i] = [];
			if (i == 0) {
				this.previousLayerConnectedCells[i].push(this.target);
			} else {
				this.previousLayerConnectedCells[i].push(this);
			}
		}
	}
	return this.previousLayerConnectedCells[layer - this.minRank - 1];
};
mxGraphHierarchyEdge.prototype.isEdge = function() {
	return true;
};
mxGraphHierarchyEdge.prototype.getGeneralPurposeVariable = function(layer) {
	return this.temp[layer - this.minRank - 1];
};
mxGraphHierarchyEdge.prototype.setGeneralPurposeVariable = function(layer, value) {
	this.temp[layer - this.minRank - 1] = value;
};
function mxGraphHierarchyModel(layout, vertices, roots, parent, ordered, deterministic, tightenToSource, scanRanksFromSinks) {
	var graph = layout.getGraph();
	this.deterministic = deterministic;
	this.tightenToSource = tightenToSource;
	this.scanRanksFromSinks = scanRanksFromSinks;
	this.roots = roots;
	this.parent = parent;
	this.vertexMapper = new Object();
	this.edgeMapper = new Object();
	this.maxRank = 0;
	var internalVertices = [];
	if (vertices == null) {
		vertices = this.graph.getChildVertices(parent);
	}
	if (ordered) {
		this.formOrderedHierarchy(layout, vertices, parent);
	} else {
		if (this.scanRanksFromSinks) {
			this.maxRank = 0;
		} else {
			this.maxRank = this.SOURCESCANSTARTRANK;
		}
		this.createInternalCells(layout, vertices, internalVertices);
		for (var i = 0; i < vertices.length; i++) {
			var edges = internalVertices[i].connectsAsSource;
			for (var j = 0; j < edges.length; j++) {
				var internalEdge = edges[j];
				var realEdges = internalEdge.edges;
				for (var k = 0; k < realEdges.length; k++) {
					var realEdge = realEdges[k];
					var targetCell = graph.getView().getVisibleTerminal(realEdge, false);
					var targetCellId = mxCellPath.create(targetCell);
					var internalTargetCell = this.vertexMapper[targetCellId];
					if (internalTargetCell != null && internalVertices[i] != internalTargetCell) {
						internalEdge.target = internalTargetCell;
						if (internalTargetCell.connectsAsTarget.length == 0) {
							internalTargetCell.connectsAsTarget = [];
						}
						if (mxUtils.indexOf(internalTargetCell.connectsAsTarget, internalEdge) < 0) {
							internalTargetCell.connectsAsTarget.push(internalEdge);
						}
					}
				}
			}
			internalVertices[i].temp[0] = 1;
		}
	}
};
mxGraphHierarchyModel.prototype.scanRanksFromSinks = true;
mxGraphHierarchyModel.prototype.maxRank = null;
mxGraphHierarchyModel.prototype.vertexMapper = null;
mxGraphHierarchyModel.prototype.edgeMapper = null;
mxGraphHierarchyModel.prototype.ranks = null;
mxGraphHierarchyModel.prototype.roots = null;
mxGraphHierarchyModel.prototype.parent = null;
mxGraphHierarchyModel.prototype.dfsCount = 0;
mxGraphHierarchyModel.prototype.SOURCESCANSTARTRANK = 100000000;
mxGraphHierarchyModel.prototype.deterministic;
mxGraphHierarchyModel.prototype.tightenToSource = false;
mxGraphHierarchyModel.prototype.formOrderedHierarchy = function(layout, vertices, parent) {
	var graph = layout.getGraph();
	this.createInternalCells(layout, vertices, internalVertices);
	var tempList = [];
	for (var i = 0; i < vertices.length; i++) {
		var edges = internalVertices[i].connectsAsSource;
		for (var j = 0; j < edges.length; j++) {
			var internalEdge = edges[j];
			var realEdges = internalEdge.edges;
			for (var k = 0; k < realEdges.length; k++) {
				var realEdge = realEdges[k];
				var targetCell = this.graph.getView().getVisibleTerminal(realEdge, false);
				var targetCellId = mxCellPath.create(targetCell);
				var internalTargetCell = vertexMapper[targetCellId];
				if (internalTargetCell != null && internalVertices[i] != internalTargetCell) {
					internalEdge.target = internalTargetCell;
					if (internalTargetCell.connectsAsTarget.length == 0) {
						internalTargetCell.connectsAsTarget = [];
					}
					if (internalTargetCell.temp[0] == 1) {
						internalEdge.invert();
						internalTargetCell.connectsAsSource.push(internalEdge);
						tempList.push(internalEdge);
						if (mxUtils.indexOf(internalVertices[i].connectsAsTarget, internalEdge) < 0) {
							internalVertices[i].connectsAsTarget.push(internalEdge);
						}
					} else {
						if (mxUtils.indexOf(internalTargetCell.connectsAsTarget, internalEdge) < 0) {
							internalTargetCell.connectsAsTarget.push(internalEdge);
						}
					}
				}
			}
		}
		for (var j = 0; j < tempList.length; j++) {
			var tmp = tempList[j];
			mxUtils.remove(tmp, internalVertices[i].connectsAsSource);
		}
		tempList = [];
		internalVertices[i].temp[0] = 1;
	}
};
mxGraphHierarchyModel.prototype.createInternalCells = function(layout, vertices, internalVertices) {
	var graph = layout.getGraph();
	for (var i = 0; i < vertices.length; i++) {
		internalVertices[i] = new mxGraphHierarchyNode(vertices[i]);
		var vertexId = mxCellPath.create(vertices[i]);
		this.vertexMapper[vertexId] = internalVertices[i];
		var conns = graph.getConnections(vertices[i], this.parent);
		var outgoingCells = graph.getOpposites(conns, vertices[i]);
		internalVertices[i].connectsAsSource = [];
		for (var j = 0; j < outgoingCells.length; j++) {
			var cell = outgoingCells[j];
			if (cell != vertices[i] && !layout.isVertexIgnored(cell)) {
				var edges = graph.getEdgesBetween(vertices[i], cell, true);
				if (edges != null && edges.length > 0) {
					var internalEdge = new mxGraphHierarchyEdge(edges);
					for (var k = 0; k < edges.length; k++) {
						var edge = edges[k];
						var edgeId = mxCellPath.create(edge);
						this.edgeMapper[edgeId] = internalEdge;
						graph.resetEdge(edge);
						if (layout.disableEdgeStyle) {
							layout.setEdgeStyleEnabled(edge, false);
						}
					}
					internalEdge.source = internalVertices[i];
					if (mxUtils.indexOf(internalVertices[i].connectsAsSource, internalEdge) < 0) {
						internalVertices[i].connectsAsSource.push(internalEdge);
					}
				}
			}
		}
		internalVertices[i].temp[0] = 0;
	}
};
mxGraphHierarchyModel.prototype.initialRank = function() {
	var startNodes = [];
	if (!this.scanRanksFromSinks && this.roots != null) {
		for (var i = 0; i < this.roots.length; i++) {
			var vertexId = mxCellPath.create(this.roots[i]);
			var internalNode = this.vertexMapper[vertexId];
			if (internalNode != null) {
				startNodes.push(internalNode);
			}
		}
	}
	if (this.scanRanksFromSinks) {
		for (var key in this.vertexMapper) {
			var internalNode = this.vertexMapper[key];
			if (internalNode.connectsAsSource == null || internalNode.connectsAsSource.length == 0) {
				startNodes.push(internalNode);
			}
		}
	}
	if (startNodes.length == 0) {
		for (var key in this.vertexMapper) {
			var internalNode = this.vertexMapper[key];
			if (internalNode.connectsAsTarget == null || internalNode.connectsAsTarget.length == 0) {
				startNodes.push(internalNode);
				this.scanRanksFromSinks = false;
				this.maxRank = this.SOURCESCANSTARTRANK;
			}
		}
	}
	for (var key in this.vertexMapper) {
		var internalNode = this.vertexMapper[key];
		internalNode.temp[0] = -1;
	}
	var startNodesCopy = startNodes.slice();
	while (startNodes.length > 0) {
		var internalNode = startNodes[0];
		var layerDeterminingEdges;
		var edgesToBeMarked;
		if (this.scanRanksFromSinks) {
			layerDeterminingEdges = internalNode.connectsAsSource;
			edgesToBeMarked = internalNode.connectsAsTarget;
		} else {
			layerDeterminingEdges = internalNode.connectsAsTarget;
			edgesToBeMarked = internalNode.connectsAsSource;
		}
		var allEdgesScanned = true;
		var minimumLayer = 0;
		if (!this.scanRanksFromSinks) {
			minimumLayer = this.SOURCESCANSTARTRANK;
		}
		for (var i = 0; i < layerDeterminingEdges.length; i++) {
			var internalEdge = layerDeterminingEdges[i];
			if (internalEdge.temp[0] == 5270620) {
				var otherNode;
				if (this.scanRanksFromSinks) {
					otherNode = internalEdge.target;
				} else {
					otherNode = internalEdge.source;
				}
				if (this.scanRanksFromSinks) {
					minimumLayer = Math.max(minimumLayer, otherNode.temp[0] + 1);
				} else {
					minimumLayer = Math.min(minimumLayer, otherNode.temp[0] - 1);
				}
			} else {
				allEdgesScanned = false;
				break;
			}
		}
		if (allEdgesScanned) {
			internalNode.temp[0] = minimumLayer;
			if (this.scanRanksFromSinks) {
				this.maxRank = Math.max(this.maxRank, minimumLayer);
			} else {
				this.maxRank = Math.min(this.maxRank, minimumLayer);
			}
			if (edgesToBeMarked != null) {
				for (var i = 0; i < edgesToBeMarked.length; i++) {
					var internalEdge = edgesToBeMarked[i];
					internalEdge.temp[0] = 5270620;
					var otherNode;
					if (this.scanRanksFromSinks) {
						otherNode = internalEdge.source;
					} else {
						otherNode = internalEdge.target;
					}
					if (otherNode.temp[0] == -1) {
						startNodes.push(otherNode);
						otherNode.temp[0] = -2;
					}
				}
			}
			startNodes.shift();
		} else {
			var removedCell = startNodes.shift();
			startNodes.push(internalNode);
			if (removedCell == internalNode && startNodes.length == 1) {
				break;
			}
		}
	}
	if (this.scanRanksFromSinks) {
		if (this.tightenToSource) {
			for (var i = 0; i < startNodesCopy.length; i++) {
				var internalNode = startNodesCopy[i];
				var currentMinLayer = 1000000;
				var layerDeterminingEdges = internalNode.connectsAsTarget;
				for (var j = 0; j < internalNode.connectsAsTarget.length; j++) {
					var internalEdge = internalNode.connectsAsTarget[j];
					var otherNode = internalEdge.source;
					internalNode.temp[0] = Math.min(currentMinLayer, otherNode.temp[0] - 1);
					currentMinLayer = internalNode.temp[0];
				}
			}
		}
	} else {
		for (var key in this.vertexMapper) {
			var internalNode = this.vertexMapper[key];
			internalNode.temp[0] -= this.maxRank;
		}
		this.maxRank = this.SOURCESCANSTARTRANK - this.maxRank;
	}
};
mxGraphHierarchyModel.prototype.fixRanks = function() {
	var rankList = [];
	this.ranks = [];
	for (var i = 0; i < this.maxRank + 1; i++) {
		rankList[i] = [];
		this.ranks[i] = rankList[i];
	}
	var rootsArray = null;
	if (this.roots != null) {
		var oldRootsArray = this.roots;
		rootsArray = [];
		for (var i = 0; i < oldRootsArray.length; i++) {
			var cell = oldRootsArray[i];
			var cellId = mxCellPath.create(cell);
			var internalNode = this.vertexMapper[cellId];
			rootsArray[i] = internalNode;
		}
	}
	this.visit(function(parent, node, edge, layer, seen) {
		if (seen == 0 && node.maxRank < 0 && node.minRank < 0) {
			rankList[node.temp[0]].push(node);
			node.maxRank = node.temp[0];
			node.minRank = node.temp[0];
			node.temp[0] = rankList[node.maxRank].length - 1;
		}
		if (parent != null && edge != null) {
			var parentToCellRankDifference = parent.maxRank - node.maxRank;
			if (parentToCellRankDifference > 1) {
				edge.maxRank = parent.maxRank;
				edge.minRank = node.maxRank;
				edge.temp = [];
				edge.x = [];
				edge.y = [];
				for (var i = edge.minRank + 1; i < edge.maxRank; i++) {
					rankList[i].push(edge);
					edge.setGeneralPurposeVariable(i, rankList[i].length - 1);
				}
			}
		}
	},
	rootsArray, false, null);
};
mxGraphHierarchyModel.prototype.visit = function(visitor, dfsRoots, trackAncestors, seenNodes) {
	if (dfsRoots != null) {
		for (var i = 0; i < dfsRoots.length; i++) {
			var internalNode = dfsRoots[i];
			if (internalNode != null) {
				if (seenNodes == null) {
					seenNodes = new Object();
				}
				if (trackAncestors) {
					internalNode.hashCode = [];
					internalNode.hashCode[0] = this.dfsCount;
					internalNode.hashCode[1] = i;
					this.extendedDfs(null, internalNode, null, visitor, seenNodes, internalNode.hashCode, i, 0);
				} else {
					this.dfs(null, internalNode, null, visitor, seenNodes, 0);
				}
			}
		}
		this.dfsCount++;
	}
};
mxGraphHierarchyModel.prototype.dfs = function(parent, root, connectingEdge, visitor, seen, layer) {
	if (root != null) {
		var rootId = mxCellPath.create(root.cell);
		if (seen[rootId] == null) {
			seen[rootId] = root;
			visitor(parent, root, connectingEdge, layer, 0);
			var outgoingEdges = root.connectsAsSource.slice();
			for (var i = 0; i < outgoingEdges.length; i++) {
				var internalEdge = outgoingEdges[i];
				var targetNode = internalEdge.target;
				this.dfs(root, targetNode, internalEdge, visitor, seen, layer + 1);
			}
		} else {
			visitor(parent, root, connectingEdge, layer, 1);
		}
	}
};
mxGraphHierarchyModel.prototype.extendedDfs = function(parent, root, connectingEdge, visitor, seen, ancestors, childHash, layer) {
	if (root != null) {
		if (parent != null) {
			if (root.hashCode == null || root.hashCode[0] != parent.hashCode[0]) {
				var hashCodeLength = parent.hashCode.length + 1;
				root.hashCode = parent.hashCode.slice();
				root.hashCode[hashCodeLength - 1] = childHash;
			}
		}
		var rootId = mxCellPath.create(root.cell);
		if (seen[rootId] == null) {
			seen[rootId] = root;
			visitor(parent, root, connectingEdge, layer, 0);
			var outgoingEdges = root.connectsAsSource.slice();
			for (var i = 0; i < outgoingEdges.length; i++) {
				var internalEdge = outgoingEdges[i];
				var targetNode = internalEdge.target;
				this.extendedDfs(root, targetNode, internalEdge, visitor, seen, root.hashCode, i, layer + 1);
			}
		} else {
			visitor(parent, root, connectingEdge, layer, 1);
		}
	}
};
function mxHierarchicalLayoutStage() {};
mxHierarchicalLayoutStage.prototype.execute = function(parent) {};
function mxMedianHybridCrossingReduction(layout) {
	this.layout = layout;
};
mxMedianHybridCrossingReduction.prototype = new mxHierarchicalLayoutStage();
mxMedianHybridCrossingReduction.prototype.constructor = mxMedianHybridCrossingReduction;
mxMedianHybridCrossingReduction.prototype.layout = null;
mxMedianHybridCrossingReduction.prototype.maxIterations = 24;
mxMedianHybridCrossingReduction.prototype.nestedBestRanks = null;
mxMedianHybridCrossingReduction.prototype.currentBestCrossings = 0;
mxMedianHybridCrossingReduction.prototype.iterationsWithoutImprovement = 0;
mxMedianHybridCrossingReduction.prototype.maxNoImprovementIterations = 2;
mxMedianHybridCrossingReduction.prototype.execute = function(parent) {
	var model = this.layout.getModel();
	this.nestedBestRanks = [];
	for (var i = 0; i < model.ranks.length; i++) {
		this.nestedBestRanks[i] = model.ranks[i].slice();
	}
	var iterationsWithoutImprovement = 0;
	var currentBestCrossings = this.calculateCrossings(model);
	for (var i = 0; i < this.maxIterations && iterationsWithoutImprovement < this.maxNoImprovementIterations; i++) {
		this.weightedMedian(i, model);
		this.transpose(i, model);
		var candidateCrossings = this.calculateCrossings(model);
		if (candidateCrossings < currentBestCrossings) {
			currentBestCrossings = candidateCrossings;
			iterationsWithoutImprovement = 0;
			for (var j = 0; j < this.nestedBestRanks.length; j++) {
				var rank = model.ranks[j];
				for (var k = 0; k < rank.length; k++) {
					var cell = rank[k];
					this.nestedBestRanks[j][cell.getGeneralPurposeVariable(j)] = cell;
				}
			}
		} else {
			iterationsWithoutImprovement++;
			for (var j = 0; j < this.nestedBestRanks.length; j++) {
				var rank = model.ranks[j];
				for (var k = 0; k < rank.length; k++) {
					var cell = rank[k];
					cell.setGeneralPurposeVariable(j, k);
				}
			}
		}
		if (currentBestCrossings == 0) {
			break;
		}
	}
	var ranks = [];
	var rankList = [];
	for (var i = 0; i < model.maxRank + 1; i++) {
		rankList[i] = [];
		ranks[i] = rankList[i];
	}
	for (var i = 0; i < this.nestedBestRanks.length; i++) {
		for (var j = 0; j < this.nestedBestRanks[i].length; j++) {
			rankList[i].push(this.nestedBestRanks[i][j]);
		}
	}
	model.ranks = ranks;
};
mxMedianHybridCrossingReduction.prototype.calculateCrossings = function(model) {
	var numRanks = model.ranks.length;
	var totalCrossings = 0;
	for (var i = 1; i < numRanks; i++) {
		totalCrossings += this.calculateRankCrossing(i, model);
	}
	return totalCrossings;
};
mxMedianHybridCrossingReduction.prototype.calculateRankCrossing = function(i, model) {
	var totalCrossings = 0;
	var rank = model.ranks[i];
	var previousRank = model.ranks[i - 1];
	var currentRankSize = rank.length;
	var previousRankSize = previousRank.length;
	var connections = [];
	for (var j = 0; j < currentRankSize; j++) {
		connections[j] = [];
	}
	for (var j = 0; j < rank.length; j++) {
		var node = rank[j];
		var rankPosition = node.getGeneralPurposeVariable(i);
		var connectedCells = node.getPreviousLayerConnectedCells(i);
		for (var k = 0; k < connectedCells.length; k++) {
			var connectedNode = connectedCells[k];
			var otherCellRankPosition = connectedNode.getGeneralPurposeVariable(i - 1);
			connections[rankPosition][otherCellRankPosition] = 201207;
		}
	}
	for (var j = 0; j < currentRankSize; j++) {
		for (var k = 0; k < previousRankSize; k++) {
			if (connections[j][k] == 201207) {
				for (var j2 = j + 1; j2 < currentRankSize; j2++) {
					for (var k2 = 0; k2 < k; k2++) {
						if (connections[j2][k2] == 201207) {
							totalCrossings++;
						}
					}
				}
				for (var j2 = 0; j2 < j; j2++) {
					for (var k2 = k + 1; k2 < previousRankSize; k2++) {
						if (connections[j2][k2] == 201207) {
							totalCrossings++;
						}
					}
				}
			}
		}
	}
	return totalCrossings / 2;
};
mxMedianHybridCrossingReduction.prototype.transpose = function(mainLoopIteration, model) {
	var improved = true;
	var count = 0;
	var maxCount = 10;
	while (improved && count++<maxCount) {
		var nudge = mainLoopIteration % 2 == 1 && count % 2 == 1;
		improved = false;
		for (var i = 0; i < model.ranks.length; i++) {
			var rank = model.ranks[i];
			var orderedCells = [];
			for (var j = 0; j < rank.length; j++) {
				var cell = rank[j];
				var tempRank = cell.getGeneralPurposeVariable(i);
				if (tempRank < 0) {
					tempRank = j;
				}
				orderedCells[tempRank] = cell;
			}
			var leftCellAboveConnections = null;
			var leftCellBelowConnections = null;
			var rightCellAboveConnections = null;
			var rightCellBelowConnections = null;
			var leftAbovePositions = null;
			var leftBelowPositions = null;
			var rightAbovePositions = null;
			var rightBelowPositions = null;
			var leftCell = null;
			var rightCell = null;
			for (var j = 0; j < (rank.length - 1); j++) {
				if (j == 0) {
					leftCell = orderedCells[j];
					leftCellAboveConnections = leftCell.getNextLayerConnectedCells(i);
					leftCellBelowConnections = leftCell.getPreviousLayerConnectedCells(i);
					leftAbovePositions = [];
					leftBelowPositions = [];
					for (var k = 0; k < leftAbovePositions.length; k++) {
						leftAbovePositions[k] = leftCellAboveConnections[k].getGeneralPurposeVariable(i + 1);
					}
					for (var k = 0; k < leftBelowPositions.length; k++) {
						leftBelowPositions[k] = leftCellBelowConnections[k].getGeneralPurposeVariable(i - 1);
					}
				} else {
					leftCellAboveConnections = rightCellAboveConnections;
					leftCellBelowConnections = rightCellBelowConnections;
					leftAbovePositions = rightAbovePositions;
					leftBelowPositions = rightBelowPositions;
					leftCell = rightCell;
				}
				rightCell = orderedCells[j + 1];
				rightCellAboveConnections = rightCell.getNextLayerConnectedCells(i);
				rightCellBelowConnections = rightCell.getPreviousLayerConnectedCells(i);
				rightAbovePositions = [];
				rightBelowPositions = [];
				for (var k = 0; k < rightAbovePositions.length; k++) {
					rightAbovePositions[k] = rightCellAboveConnections[k].getGeneralPurposeVariable(i + 1);
				}
				for (var k = 0; k < rightBelowPositions.length; k++) {
					rightBelowPositions[k] = rightCellBelowConnections[k].getGeneralPurposeVariable(i - 1);
				}
				var totalCurrentCrossings = 0;
				var totalSwitchedCrossings = 0;
				for (var k = 0; k < leftAbovePositions.length; k++) {
					for (var ik = 0; ik < rightAbovePositions.length; ik++) {
						if (leftAbovePositions[k] > rightAbovePositions[ik]) {
							totalCurrentCrossings++;
						}
						if (leftAbovePositions[k] < rightAbovePositions[ik]) {
							totalSwitchedCrossings++;
						}
					}
				}
				for (var k = 0; k < leftBelowPositions.length; k++) {
					for (var ik = 0; ik < rightBelowPositions.length; ik++) {
						if (leftBelowPositions[k] > rightBelowPositions[ik]) {
							totalCurrentCrossings++;
						}
						if (leftBelowPositions[k] < rightBelowPositions[ik]) {
							totalSwitchedCrossings++;
						}
					}
				}
				if ((totalSwitchedCrossings < totalCurrentCrossings) || (totalSwitchedCrossings == totalCurrentCrossings && nudge)) {
					var temp = leftCell.getGeneralPurposeVariable(i);
					leftCell.setGeneralPurposeVariable(i, rightCell.getGeneralPurposeVariable(i));
					rightCell.setGeneralPurposeVariable(i, temp);
					rightCellAboveConnections = leftCellAboveConnections;
					rightCellBelowConnections = leftCellBelowConnections;
					rightAbovePositions = leftAbovePositions;
					rightBelowPositions = leftBelowPositions;
					rightCell = leftCell;
					if (!nudge) {
						improved = true;
					}
				}
			}
		}
	}
};
mxMedianHybridCrossingReduction.prototype.weightedMedian = function(iteration, model) {
	var downwardSweep = (iteration % 2 == 0);
	if (downwardSweep) {
		for (var j = model.maxRank - 1; j >= 0; j--) {
			this.medianRank(j, downwardSweep);
		}
	} else {
		for (var j = 1; j < model.maxRank; j++) {
			this.medianRank(j, downwardSweep);
		}
	}
};
mxMedianHybridCrossingReduction.prototype.medianRank = function(rankValue, downwardSweep) {
	var numCellsForRank = this.nestedBestRanks[rankValue].length;
	var medianValues = [];
	for (var i = 0; i < numCellsForRank; i++) {
		var cell = this.nestedBestRanks[rankValue][i];
		medianValues[i] = new MedianCellSorter();
		medianValues[i].cell = cell;
		medianValues[i].nudge = !downwardSweep;
		var nextLevelConnectedCells;
		if (downwardSweep) {
			nextLevelConnectedCells = cell.getNextLayerConnectedCells(rankValue);
		} else {
			nextLevelConnectedCells = cell.getPreviousLayerConnectedCells(rankValue);
		}
		var nextRankValue;
		if (downwardSweep) {
			nextRankValue = rankValue + 1;
		} else {
			nextRankValue = rankValue - 1;
		}
		if (nextLevelConnectedCells != null && nextLevelConnectedCells.length != 0) {
			medianValues[i].medianValue = this.medianValue(nextLevelConnectedCells, nextRankValue);
		} else {
			medianValues[i].medianValue = -1.0;
		}
	}
	medianValues.sort(MedianCellSorter.prototype.compare);
	for (var i = 0; i < numCellsForRank; i++) {
		medianValues[i].cell.setGeneralPurposeVariable(rankValue, i);
	}
};
mxMedianHybridCrossingReduction.prototype.medianValue = function(connectedCells, rankValue) {
	var medianValues = [];
	var arrayCount = 0;
	for (var i = 0; i < connectedCells.length; i++) {
		var cell = connectedCells[i];
		medianValues[arrayCount++] = cell.getGeneralPurposeVariable(rankValue);
	}
	medianValues.sort(MedianCellSorter.prototype.compare);
	if (arrayCount % 2 == 1) {
		return medianValues[arrayCount / 2];
	} else if (arrayCount == 2) {
		return ((medianValues[0] + medianValues[1]) / 2.0);
	} else {
		var medianPoint = arrayCount / 2;
		var leftMedian = medianValues[medianPoint - 1] - medianValues[0];
		var rightMedian = medianValues[arrayCount - 1] - medianValues[medianPoint];
		return (medianValues[medianPoint - 1] * rightMedian + medianValues[medianPoint] * leftMedian) / (leftMedian + rightMedian);
	}
};
function MedianCellSorter() {};
MedianCellSorter.prototype.medianValue = 0;
MedianCellSorter.prototype.nudge = false;
MedianCellSorter.prototype.cell = false;
MedianCellSorter.prototype.compare = function(a, b) {
	if (a != null && b != null) {
		if (b.medianValue > a.medianValue) {
			return - 1;
		} else if (b.medianValue < a.medianValue) {
			return 1;
		} else {
			if (b.nudge) {
				return - 1;
			} else {
				return 1;
			}
		}
	} else {
		return 0;
	}
};
function mxMinimumCycleRemover(layout) {
	this.layout = layout;
};
mxMinimumCycleRemover.prototype = new mxHierarchicalLayoutStage();
mxMinimumCycleRemover.prototype.constructor = mxMinimumCycleRemover;
mxMinimumCycleRemover.prototype.layout = null;
mxMinimumCycleRemover.prototype.execute = function(parent) {
	var model = this.layout.getModel();
	var seenNodes = new Object();
	var unseenNodes = mxUtils.clone(model.vertexMapper, null, true);
	var rootsArray = null;
	if (model.roots != null) {
		var modelRoots = model.roots;
		rootsArray = [];
		for (var i = 0; i < modelRoots.length; i++) {
			var nodeId = mxCellPath.create(modelRoots[i]);
			rootsArray[i] = model.vertexMapper[nodeId];
		}
	}
	model.visit(function(parent, node, connectingEdge, layer, seen) {
		if (node.isAncestor(parent)) {
			connectingEdge.invert();
			mxUtils.remove(connectingEdge, parent.connectsAsSource);
			parent.connectsAsTarget.push(connectingEdge);
			mxUtils.remove(connectingEdge, node.connectsAsTarget);
			node.connectsAsSource.push(connectingEdge);
		}
		var cellId = mxCellPath.create(node.cell);
		seenNodes[cellId] = node;
		delete unseenNodes[cellId];
	},
	rootsArray, true, null);
	var possibleNewRoots = null;
	if (unseenNodes.lenth > 0) {
		possibleNewRoots = mxUtils.clone(unseenNodes, null, true);
	}
	var seenNodesCopy = mxUtils.clone(seenNodes, null, true);
	model.visit(function(parent, node, connectingEdge, layer, seen) {
		if (node.isAncestor(parent)) {
			connectingEdge.invert();
			mxUtils.remove(connectingEdge, parent.connectsAsSource);
			node.connectsAsSource.push(connectingEdge);
			parent.connectsAsTarget.push(connectingEdge);
			mxUtils.remove(connectingEdge, node.connectsAsTarget);
		}
		var cellId = mxCellPath.create(node.cell);
		seenNodes[cellId] = node;
		delete unseenNodes[cellId];
	},
	unseenNodes, true, seenNodesCopy);
	var graph = this.layout.getGraph();
	if (possibleNewRoots != null && possibleNewRoots.length > 0) {
		var roots = model.roots;
		for (var i = 0; i < possibleNewRoots.length; i++) {
			var node = possibleNewRoots[i];
			var realNode = node.cell;
			var numIncomingEdges = graph.getIncomingEdges(realNode).length;
			if (numIncomingEdges == 0) {
				roots.push(realNode);
			}
		}
	}
};
function mxCoordinateAssignment(layout, intraCellSpacing, interRankCellSpacing, orientation, initialX, parallelEdgeSpacing) {
	this.layout = layout;
	this.intraCellSpacing = intraCellSpacing;
	this.interRankCellSpacing = interRankCellSpacing;
	this.orientation = orientation;
	this.initialX = initialX;
	this.parallelEdgeSpacing = parallelEdgeSpacing;
};
mxCoordinateAssignment.prototype = new mxHierarchicalLayoutStage();
mxCoordinateAssignment.prototype.constructor = mxCoordinateAssignment;
mxCoordinateAssignment.prototype.layout = null;
mxCoordinateAssignment.prototype.intraCellSpacing = 30;
mxCoordinateAssignment.prototype.interRankCellSpacing = 10;
mxCoordinateAssignment.prototype.parallelEdgeSpacing = 10;
mxCoordinateAssignment.prototype.maxIterations = 8;
mxCoordinateAssignment.prototype.orientation = mxConstants.DIRECTION_NORTH;
mxCoordinateAssignment.prototype.initialX = null;
mxCoordinateAssignment.prototype.limitX = null;
mxCoordinateAssignment.prototype.currentXDelta = null;
mxCoordinateAssignment.prototype.widestRank = null;
mxCoordinateAssignment.prototype.widestRankValue = null;
mxCoordinateAssignment.prototype.rankWidths = null;
mxCoordinateAssignment.prototype.rankY = null;
mxCoordinateAssignment.prototype.fineTuning = true;
mxCoordinateAssignment.prototype.nextLayerConnectedCache = null;
mxCoordinateAssignment.prototype.previousLayerConnectedCache = null;
mxCoordinateAssignment.prototype.execute = function(parent) {
	var model = this.layout.getModel();
	this.currentXDelta = 0.0;
	this.initialCoords(this.layout.getGraph(), model);
	if (this.fineTuning) {
		this.minNode(model);
	}
	var bestXDelta = 100000000.0;
	if (this.fineTuning) {
		for (var i = 0; i < this.maxIterations; i++) {
			if (i != 0) {
				this.medianPos(i, model);
				this.minNode(model);
			}
			if (this.currentXDelta < bestXDelta) {
				for (var j = 0; j < model.ranks.length; j++) {
					var rank = model.ranks[j];
					for (var k = 0; k < rank.length; k++) {
						var cell = rank[k];
						cell.setX(j, cell.getGeneralPurposeVariable(j));
					}
				}
				bestXDelta = this.currentXDelta;
			} else {
				for (var j = 0; j < model.ranks.length; j++) {
					var rank = model.ranks[j];
					for (var k = 0; k < rank.length; k++) {
						var cell = rank[k];
						cell.setGeneralPurposeVariable(j, cell.getX(j));
					}
				}
			}
			this.currentXDelta = 0;
		}
	}
	this.setCellLocations(this.layout.getGraph(), model);
};
mxCoordinateAssignment.prototype.minNode = function(model) {
	var nodeList = [];
	var map = [];
	var rank = [];
	for (var i = 0; i <= model.maxRank; i++) {
		rank[i] = model.ranks[i];
		for (var j = 0; j < rank[i].length; j++) {
			var node = rank[i][j];
			var nodeWrapper = new WeightedCellSorter(node, i);
			nodeWrapper.rankIndex = j;
			nodeWrapper.visited = true;
			nodeList.push(nodeWrapper);
			var cellId = mxCellPath.create(node.cell);
			map[cellId] = nodeWrapper;
		}
	}
	var maxTries = nodeList.length * 10;
	var count = 0;
	var tolerance = 1;
	while (nodeList.length > 0 && count <= maxTries) {
		var cellWrapper = nodeList.shift();
		var cell = cellWrapper.cell;
		var rankValue = cellWrapper.weightedValue;
		var rankIndex = parseInt(cellWrapper.rankIndex);
		var nextLayerConnectedCells = cell.getNextLayerConnectedCells(rankValue);
		var previousLayerConnectedCells = cell.getPreviousLayerConnectedCells(rankValue);
		var numNextLayerConnected = nextLayerConnectedCells.length;
		var numPreviousLayerConnected = previousLayerConnectedCells.length;
		var medianNextLevel = this.medianXValue(nextLayerConnectedCells, rankValue + 1);
		var medianPreviousLevel = this.medianXValue(previousLayerConnectedCells, rankValue - 1);
		var numConnectedNeighbours = numNextLayerConnected + numPreviousLayerConnected;
		var currentPosition = cell.getGeneralPurposeVariable(rankValue);
		var cellMedian = currentPosition;
		if (numConnectedNeighbours > 0) {
			cellMedian = (medianNextLevel * numNextLayerConnected + medianPreviousLevel * numPreviousLayerConnected) / numConnectedNeighbours;
		}
		var positionChanged = false;
		if (cellMedian < currentPosition - tolerance) {
			if (rankIndex == 0) {
				cell.setGeneralPurposeVariable(rankValue, cellMedian);
				positionChanged = true;
			} else {
				var leftCell = rank[rankValue][rankIndex - 1];
				var leftLimit = leftCell.getGeneralPurposeVariable(rankValue);
				leftLimit = leftLimit + leftCell.width / 2 + this.intraCellSpacing + cell.width / 2;
				if (leftLimit < cellMedian) {
					cell.setGeneralPurposeVariable(rankValue, cellMedian);
					positionChanged = true;
				} else if (leftLimit < cell.getGeneralPurposeVariable(rankValue) - tolerance) {
					cell.setGeneralPurposeVariable(rankValue, leftLimit);
					positionChanged = true;
				}
			}
		} else if (cellMedian > currentPosition + tolerance) {
			var rankSize = rank[rankValue].length;
			if (rankIndex == rankSize - 1) {
				cell.setGeneralPurposeVariable(rankValue, cellMedian);
				positionChanged = true;
			} else {
				var rightCell = rank[rankValue][rankIndex + 1];
				var rightLimit = rightCell.getGeneralPurposeVariable(rankValue);
				rightLimit = rightLimit - rightCell.width / 2 - this.intraCellSpacing - cell.width / 2;
				if (rightLimit > cellMedian) {
					cell.setGeneralPurposeVariable(rankValue, cellMedian);
					positionChanged = true;
				} else if (rightLimit > cell.getGeneralPurposeVariable(rankValue) + tolerance) {
					cell.setGeneralPurposeVariable(rankValue, rightLimit);
					positionChanged = true;
				}
			}
		}
		if (positionChanged) {
			for (var i = 0; i < nextLayerConnectedCells.length; i++) {
				var connectedCell = nextLayerConnectedCells[i];
				var connectedCellId = mxCellPath.create(connectedCell.cell);
				var connectedCellWrapper = map[connectedCellId];
				if (connectedCellWrapper != null) {
					if (connectedCellWrapper.visited == false) {
						connectedCellWrapper.visited = true;
						nodeList.push(connectedCellWrapper);
					}
				}
			}
			for (var i = 0; i < previousLayerConnectedCells.length; i++) {
				var connectedCell = previousLayerConnectedCells[i];
				var connectedCellId = mxCellPath.create(connectedCell.cell);
				var connectedCellWrapper = map[connectedCellId];
				if (connectedCellWrapper != null) {
					if (connectedCellWrapper.visited == false) {
						connectedCellWrapper.visited = true;
						nodeList.push(connectedCellWrapper);
					}
				}
			}
		}
		cellWrapper.visited = false;
		count++;
	}
};
mxCoordinateAssignment.prototype.medianPos = function(i, model) {
	var downwardSweep = (i % 2 == 0);
	if (downwardSweep) {
		for (var j = model.maxRank; j > 0; j--) {
			this.rankMedianPosition(j - 1, model, j);
		}
	} else {
		for (var j = 0; j < model.maxRank - 1; j++) {
			this.rankMedianPosition(j + 1, model, j);
		}
	}
};
mxCoordinateAssignment.prototype.rankMedianPosition = function(rankValue, model, nextRankValue) {
	var rank = model.ranks[rankValue];
	var weightedValues = [];
	var cellMap = [];
	for (var i = 0; i < rank.length; i++) {
		var currentCell = rank[i];
		weightedValues[i] = new WeightedCellSorter();
		weightedValues[i].cell = currentCell;
		weightedValues[i].rankIndex = i;
		var currentCellId = mxCellPath.create(currentCell.cell);
		cellMap[currentCellId] = weightedValues[i];
		var nextLayerConnectedCells = null;
		if (nextRankValue < rankValue) {
			nextLayerConnectedCells = currentCell.getPreviousLayerConnectedCells(rankValue);
		} else {
			nextLayerConnectedCells = currentCell.getNextLayerConnectedCells(rankValue);
		}
		weightedValues[i].weightedValue = this.calculatedWeightedValue(currentCell, nextLayerConnectedCells);
	}
	weightedValues.sort(WeightedCellSorter.prototype.compare);
	for (var i = 0; i < weightedValues.length; i++) {
		var numConnectionsNextLevel = 0;
		var cell = weightedValues[i].cell;
		var nextLayerConnectedCells = null;
		var medianNextLevel = 0;
		if (nextRankValue < rankValue) {
			nextLayerConnectedCells = cell.getPreviousLayerConnectedCells(rankValue).slice();
		} else {
			nextLayerConnectedCells = cell.getNextLayerConnectedCells(rankValue).slice();
		}
		if (nextLayerConnectedCells != null) {
			numConnectionsNextLevel = nextLayerConnectedCells.length;
			if (numConnectionsNextLevel > 0) {
				medianNextLevel = this.medianXValue(nextLayerConnectedCells, nextRankValue);
			} else {
				medianNextLevel = cell.getGeneralPurposeVariable(rankValue);
			}
		}
		var leftBuffer = 0.0;
		var leftLimit = -100000000.0;
		for (var j = weightedValues[i].rankIndex - 1; j >= 0;) {
			var rankId = mxCellPath.create(rank[j].cell);
			var weightedValue = cellMap[rankId];
			if (weightedValue != null) {
				var leftCell = weightedValue.cell;
				if (weightedValue.visited) {
					leftLimit = leftCell.getGeneralPurposeVariable(rankValue) + leftCell.width / 2.0 + this.intraCellSpacing + leftBuffer + cell.width / 2.0;
					j = -1;
				} else {
					leftBuffer += leftCell.width + this.intraCellSpacing;
					j--;
				}
			}
		}
		var rightBuffer = 0.0;
		var rightLimit = 100000000.0;
		for (var j = weightedValues[i].rankIndex + 1; j < weightedValues.length;) {
			var rankId = mxCellPath.create(rank[j].cell);
			var weightedValue = cellMap[rankId];
			if (weightedValue != null) {
				var rightCell = weightedValue.cell;
				if (weightedValue.visited) {
					rightLimit = rightCell.getGeneralPurposeVariable(rankValue) - rightCell.width / 2.0 - this.intraCellSpacing - rightBuffer - cell.width / 2.0;
					j = weightedValues.length;
				} else {
					rightBuffer += rightCell.width + this.intraCellSpacing;
					j++;
				}
			}
		}
		if (medianNextLevel >= leftLimit && medianNextLevel <= rightLimit) {
			cell.setGeneralPurposeVariable(rankValue, medianNextLevel);
		} else if (medianNextLevel < leftLimit) {
			cell.setGeneralPurposeVariable(rankValue, leftLimit);
			this.currentXDelta += leftLimit - medianNextLevel;
		} else if (medianNextLevel > rightLimit) {
			cell.setGeneralPurposeVariable(rankValue, rightLimit);
			this.currentXDelta += medianNextLevel - rightLimit;
		}
		weightedValues[i].visited = true;
	}
};
mxCoordinateAssignment.prototype.calculatedWeightedValue = function(currentCell, collection) {
	var totalWeight = 0;
	for (var i = 0; i < collection.length; i++) {
		var cell = collection[i];
		if (currentCell.isVertex() && cell.isVertex()) {
			totalWeight++;
		} else if (currentCell.isEdge() && cell.isEdge()) {
			totalWeight += 8;
		} else {
			totalWeight += 2;
		}
	}
	return totalWeight;
};
mxCoordinateAssignment.prototype.medianXValue = function(connectedCells, rankValue) {
	if (connectedCells.length == 0) {
		return 0;
	}
	var medianValues = [];
	for (var i = 0; i < connectedCells.length; i++) {
		medianValues[i] = connectedCells[i].getGeneralPurposeVariable(rankValue);
	}
	medianValues.sort(MedianCellSorter.prototype.compare);
	if (connectedCells.length % 2 == 1) {
		return medianValues[connectedCells.length / 2];
	} else {
		var medianPoint = connectedCells.length / 2;
		var leftMedian = medianValues[medianPoint - 1];
		var rightMedian = medianValues[medianPoint];
		return ((leftMedian + rightMedian) / 2);
	}
};
mxCoordinateAssignment.prototype.initialCoords = function(facade, model) {
	this.calculateWidestRank(facade, model);
	for (var i = this.widestRank; i >= 0; i--) {
		if (i < model.maxRank) {
			this.rankCoordinates(i, facade, model);
		}
	}
	for (var i = this.widestRank + 1; i <= model.maxRank; i++) {
		if (i > 0) {
			this.rankCoordinates(i, facade, model);
		}
	}
};
mxCoordinateAssignment.prototype.rankCoordinates = function(rankValue, graph, model) {
	var rank = model.ranks[rankValue];
	var maxY = 0.0;
	var localX = this.initialX + (this.widestRankValue - this.rankWidths[rankValue]) / 2;
	var boundsWarning = false;
	for (var i = 0; i < rank.length; i++) {
		var node = rank[i];
		if (node.isVertex()) {
			var bounds = this.layout.getVertexBounds(node.cell);
			if (bounds != null) {
				if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_SOUTH) {
					node.width = bounds.width;
					node.height = bounds.height;
				} else {
					node.width = bounds.height;
					node.height = bounds.width;
				}
			} else {
				boundsWarning = true;
			}
			maxY = Math.max(maxY, node.height);
		} else if (node.isEdge()) {
			var numEdges = 1;
			if (node.edges != null) {
				numEdges = node.edges.length;
			} else {
				mxLog.warn('edge.edges is null');
			}
			node.width = (numEdges - 1) * this.parallelEdgeSpacing;
		}
		localX += node.width / 2.0;
		node.setX(rankValue, localX);
		node.setGeneralPurposeVariable(rankValue, localX);
		localX += node.width / 2.0;
		localX += this.intraCellSpacing;
	}
	if (boundsWarning == true) {
		mxLog.warn('At least one cell has no bounds');
	}
};
mxCoordinateAssignment.prototype.calculateWidestRank = function(graph, model) {
	var y = -this.interRankCellSpacing;
	var lastRankMaxCellHeight = 0.0;
	this.rankWidths = [];
	this.rankY = [];
	for (var rankValue = model.maxRank; rankValue >= 0; rankValue--) {
		var maxCellHeight = 0.0;
		var rank = model.ranks[rankValue];
		var localX = this.initialX;
		var boundsWarning = false;
		for (var i = 0; i < rank.length; i++) {
			var node = rank[i];
			if (node.isVertex()) {
				var bounds = this.layout.getVertexBounds(node.cell);
				if (bounds != null) {
					if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_SOUTH) {
						node.width = bounds.width;
						node.height = bounds.height;
					} else {
						node.width = bounds.height;
						node.height = bounds.width;
					}
				} else {
					boundsWarning = true;
				}
				maxCellHeight = Math.max(maxCellHeight, node.height);
			} else if (node.isEdge()) {
				var numEdges = 1;
				if (node.edges != null) {
					numEdges = node.edges.length;
				} else {
					mxLog.warn('edge.edges is null');
				}
				node.width = (numEdges - 1) * this.parallelEdgeSpacing;
			}
			localX += node.width / 2.0;
			node.setX(rankValue, localX);
			node.setGeneralPurposeVariable(rankValue, localX);
			localX += node.width / 2.0;
			localX += this.intraCellSpacing;
			if (localX > this.widestRankValue) {
				this.widestRankValue = localX;
				this.widestRank = rankValue;
			}
			this.rankWidths[rankValue] = localX;
		}
		if (boundsWarning == true) {
			mxLog.warn('At least one cell has no bounds');
		}
		this.rankY[rankValue] = y;
		var distanceToNextRank = maxCellHeight / 2.0 + lastRankMaxCellHeight / 2.0 + this.interRankCellSpacing;
		lastRankMaxCellHeight = maxCellHeight;
		if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_WEST) {
			y += distanceToNextRank;
		} else {
			y -= distanceToNextRank;
		}
		for (var i = 0; i < rank.length; i++) {
			var cell = rank[i];
			cell.setY(rankValue, y);
		}
	}
};
mxCoordinateAssignment.prototype.setCellLocations = function(graph, model) {
	for (var i = 0; i < model.ranks.length; i++) {
		var rank = model.ranks[i];
		for (var h = 0; h < rank.length; h++) {
			var node = rank[h];
			if (node.isVertex()) {
				var realCell = node.cell;
				var positionX = node.x[0] - node.width / 2;
				var positionY = node.y[0] - node.height / 2;
				if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_SOUTH) {
					this.layout.setVertexLocation(realCell, positionX, positionY);
				} else {
					this.layout.setVertexLocation(realCell, positionY, positionX);
				}
				limitX = Math.max(this.limitX, positionX + node.width);
			} else if (node.isEdge()) {
				var offsetX = 0.0;
				if (node.temp[0] != 101207) {
					for (var j = 0; j < node.edges.length; j++) {
						var realEdge = node.edges[j];
						var newPoints = [];
						if (node.isReversed) {
							for (var k = 0; k < node.x.length; k++) {
								var positionX = node.x[k] + offsetX;
								if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_SOUTH) {
									newPoints.push(new mxPoint(positionX, node.y[k]));
								} else {
									newPoints.push(new mxPoint(node.y[k], positionX));
								}
								limitX = Math.max(limitX, positionX);
							}
							this.processReversedEdge(node, realEdge);
						} else {
							for (var k = node.x.length - 1; k >= 0; k--) {
								var positionX = node.x[k] + offsetX;
								if (this.orientation == mxConstants.DIRECTION_NORTH || this.orientation == mxConstants.DIRECTION_SOUTH) {
									newPoints.push(new mxPoint(positionX, node.y[k]));
								} else {
									newPoints.push(new mxPoint(node.y[k], positionX));
								}
								limitX = Math.max(limitX, positionX);
							}
						}
						this.layout.setEdgePoints(realEdge, newPoints);
						if (offsetX == 0.0) {
							offsetX = this.parallelEdgeSpacing;
						} else if (offsetX > 0) {
							offsetX = -offsetX;
						} else {
							offsetX = -offsetX + this.parallelEdgeSpacing;
						}
					}
					node.temp[0] = 101207;
				}
			}
		}
	}
};
mxCoordinateAssignment.prototype.processReversedEdge = function(graph, model) {};
function WeightedCellSorter(cell, weightedValue) {
	this.cell = cell;
	this.weightedValue = weightedValue;
};
WeightedCellSorter.prototype.weightedValue = 0;
WeightedCellSorter.prototype.nudge = false;
WeightedCellSorter.prototype.visited = false;
WeightedCellSorter.prototype.rankIndex = null;
WeightedCellSorter.prototype.cell = null;
WeightedCellSorter.prototype.compare = function(a, b) {
	if (a != null && b != null) {
		if (b.weightedValue > a.weightedValue) {
			return - 1;
		} else if (b.weightedValue < a.weightedValue) {
			return 1;
		} else {
			if (b.nudge) {
				return - 1;
			} else {
				return 1;
			}
		}
	} else {
		return 0;
	}
};
function mxHierarchicalLayout(graph, orientation, deterministic) {
	mxGraphLayout.call(this, graph);
	this.orientation = (orientation != null) ? orientation: mxConstants.DIRECTION_NORTH;
	this.deterministic = (deterministic != null) ? deterministic: true;
};
mxHierarchicalLayout.prototype = new mxGraphLayout();
mxHierarchicalLayout.prototype.constructor = mxHierarchicalLayout;
mxHierarchicalLayout.prototype.roots = null;
mxHierarchicalLayout.prototype.resizeParent = false;
mxHierarchicalLayout.prototype.moveParent = false;
mxHierarchicalLayout.prototype.parentBorder = 0;
mxHierarchicalLayout.prototype.intraCellSpacing = 30;
mxHierarchicalLayout.prototype.interRankCellSpacing = 50;
mxHierarchicalLayout.prototype.interHierarchySpacing = 60;
mxHierarchicalLayout.prototype.parallelEdgeSpacing = 10;
mxHierarchicalLayout.prototype.orientation = mxConstants.DIRECTION_NORTH;
mxHierarchicalLayout.prototype.fineTuning = true;
mxHierarchicalLayout.prototype.deterministic;
mxHierarchicalLayout.prototype.fixRoots = false;
mxHierarchicalLayout.prototype.layoutFromSinks = true;
mxHierarchicalLayout.prototype.tightenToSource = true;
mxHierarchicalLayout.prototype.disableEdgeStyle = true;
mxHierarchicalLayout.prototype.model = null;
mxHierarchicalLayout.prototype.getModel = function() {
	return this.model;
};
mxHierarchicalLayout.prototype.execute = function(parent, roots) {
	if (roots == null) {
		roots = this.graph.findTreeRoots(parent);
	}
	this.roots = roots;
	if (this.roots != null) {
		var model = this.graph.getModel();
		model.beginUpdate();
		try {
			this.run(parent);
			if (this.resizeParent && !this.graph.isCellCollapsed(parent)) {
				this.graph.updateGroupBounds([parent], this.parentBorder, this.moveParent);
			}
		} finally {
			model.endUpdate();
		}
	}
};
mxHierarchicalLayout.prototype.run = function(parent) {
	var hierarchyVertices = [];
	var fixedRoots = null;
	var rootLocations = null;
	var affectedEdges = null;
	if (this.fixRoots) {
		fixedRoots = [];
		rootLocations = [];
		affectedEdges = [];
	}
	for (var i = 0; i < this.roots.length; i++) {
		var newHierarchy = true;
		for (var j = 0; newHierarchy && j < hierarchyVertices.length; j++) {
			var rootId = mxCellPath.create(this.roots[i]);
			if (hierarchyVertices[j][rootId] != null) {
				newHierarchy = false;
			}
		}
		if (newHierarchy) {
			var cellsStack = [];
			cellsStack.push(this.roots[i]);
			var edgeSet = null;
			if (this.fixRoots) {
				fixedRoots.push(this.roots[i]);
				var location = this.getVertexBounds(this.roots[i]).getPoint();
				rootLocations.push(location);
				edgeSet = [];
			}
			var vertexSet = new Object();
			while (cellsStack.length > 0) {
				var cell = cellsStack.shift();
				var cellId = mxCellPath.create(cell);
				if (vertexSet[cellId] == null) {
					vertexSet[cellId] = cell;
					if (this.fixRoots) {
						var tmp = this.graph.getIncomingEdges(cell, parent);
						for (var k = 0; k < tmp.length; k++) {
							edgeSet.push(tmp[k]);
						}
					}
					var conns = this.graph.getConnections(cell, parent);
					var cells = this.graph.getOpposites(conns, cell);
					for (var k = 0; k < cells.length; k++) {
						var tmpId = mxCellPath.create(cells[k]);
						if (vertexSet[tmpId] == null) {
							cellsStack.push(cells[k]);
						}
					}
				}
			}
			hierarchyVertices.push(vertexSet);
			if (this.fixRoots) {
				affectedEdges.push(edgeSet);
			}
		}
	}
	var initialX = 0;
	for (var i = 0; i < hierarchyVertices.length; i++) {
		var vertexSet = hierarchyVertices[i];
		var tmp = [];
		for (var key in vertexSet) {
			tmp.push(vertexSet[key]);
		}
		this.model = new mxGraphHierarchyModel(this, tmp, this.roots, parent, false, this.deterministic, this.tightenToSource, true);
		this.cycleStage(parent);
		this.layeringStage();
		this.crossingStage(parent);
		initialX = this.placementStage(initialX, parent);
		if (this.fixRoots) {
			var root = fixedRoots[i];
			var oldLocation = rootLocations[i];
			var newLocation = this.getVertexBounds(root).getPoint();
			var diffX = oldLocation.x - newLocation.x;
			var diffY = oldLocation.y - newLocation.y;
			this.graph.moveCells(vertexSet, diffX, diffY);
			var connectedEdges = affectedEdges[i + 1];
			this.graph.moveCells(connectedEdges, diffX, diffY);
		}
	}
};
mxHierarchicalLayout.prototype.cycleStage = function(parent) {
	var cycleStage = new mxMinimumCycleRemover(this);
	cycleStage.execute(parent);
};
mxHierarchicalLayout.prototype.layeringStage = function() {
	this.model.initialRank();
	this.model.fixRanks();
};
mxHierarchicalLayout.prototype.crossingStage = function(parent) {
	var crossingStage = new mxMedianHybridCrossingReduction(this);
	crossingStage.execute(parent);
};
mxHierarchicalLayout.prototype.placementStage = function(initialX, parent) {
	var placementStage = new mxCoordinateAssignment(this, this.intraCellSpacing, this.interRankCellSpacing, this.orientation, initialX, this.parallelEdgeSpacing);
	placementStage.fineTuning = this.fineTuning;
	placementStage.execute(parent);
	return placementStage.limitX + this.interHierarchySpacing;
};
