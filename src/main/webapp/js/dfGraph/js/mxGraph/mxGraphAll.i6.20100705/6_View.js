var mxPerimeter = {
	RectanglePerimeter: function(bounds, vertex, next, orthogonal) {
		var cx = bounds.getCenterX();
		var cy = bounds.getCenterY();
		var dx = next.x - cx;
		var dy = next.y - cy;
		var alpha = Math.atan2(dy, dx);
		var p = new mxPoint(0, 0);
		var pi = Math.PI;
		var pi2 = Math.PI / 2;
		var beta = pi2 - alpha;
		var t = Math.atan2(bounds.height, bounds.width);
		if (alpha < -pi + t || alpha > pi - t) {
			p.x = bounds.x;
			p.y = cy - bounds.width * Math.tan(alpha) / 2;
		} else if (alpha < -t) {
			p.y = bounds.y;
			p.x = cx - bounds.height * Math.tan(beta) / 2;
		} else if (alpha < t) {
			p.x = bounds.x + bounds.width;
			p.y = cy + bounds.width * Math.tan(alpha) / 2;
		} else {
			p.y = bounds.y + bounds.height;
			p.x = cx + bounds.height * Math.tan(beta) / 2;
		}
		if (orthogonal) {
			if (next.x >= bounds.x && next.x <= bounds.x + bounds.width) {
				p.x = next.x;
			} else if (next.y >= bounds.y && next.y <= bounds.y + bounds.height) {
				p.y = next.y;
			}
			if (next.x < bounds.x) {
				p.x = bounds.x;
			} else if (next.x > bounds.x + bounds.width) {
				p.x = bounds.x + bounds.width;
			}
			if (next.y < bounds.y) {
				p.y = bounds.y;
			} else if (next.y > bounds.y + bounds.height) {
				p.y = bounds.y + bounds.height;
			}
		}
		return p;
	},
	EllipsePerimeter: function(bounds, vertex, next, orthogonal) {
		var x = bounds.x;
		var y = bounds.y;
		var a = bounds.width / 2;
		var b = bounds.height / 2;
		var cx = x + a;
		var cy = y + b;
		var px = next.x;
		var py = next.y;
		var dx = parseInt(px - cx);
		var dy = parseInt(py - cy);
		if (dx == 0) {
			return new mxPoint(cx, cy + b * dy / Math.abs(dy));
		}
		if (orthogonal) {
			if (py >= y && py <= y + bounds.height) {
				var ty = py - cy;
				var tx = Math.sqrt(a * a * (1 - (ty * ty) / (b * b))) || 0;
				if (px <= x) {
					tx = -tx;
				}
				return new mxPoint(cx + tx, py);
			}
			if (px >= x && px <= x + bounds.width) {
				var tx = px - cx;
				var ty = Math.sqrt(b * b * (1 - (tx * tx) / (a * a))) || 0;
				if (py <= y) {
					ty = -ty;
				}
				return new mxPoint(px, cy + ty);
			}
		}
		var d = dy / dx;
		var h = cy - d * cx;
		var e = a * a * d * d + b * b;
		var f = -2 * cx * e;
		var g = a * a * d * d * cx * cx + b * b * cx * cx - a * a * b * b;
		var det = Math.sqrt(f * f - 4 * e * g);
		var xout1 = ( - f + det) / (2 * e);
		var xout2 = ( - f - det) / (2 * e);
		var yout1 = d * xout1 + h;
		var yout2 = d * xout2 + h;
		var dist1 = Math.sqrt(Math.pow((xout1 - px), 2) + Math.pow((yout1 - py), 2));
		var dist2 = Math.sqrt(Math.pow((xout2 - px), 2) + Math.pow((yout2 - py), 2));
		var xout = 0;
		var yout = 0;
		if (dist1 < dist2) {
			xout = xout1;
			yout = yout1;
		} else {
			xout = xout2;
			yout = yout2;
		}
		return new mxPoint(xout, yout);
	},
	RhombusPerimeter: function(bounds, vertex, next, orthogonal) {
		var x = bounds.x;
		var y = bounds.y;
		var w = bounds.width;
		var h = bounds.height;
		var cx = x + w / 2;
		var cy = y + h / 2;
		var px = next.x;
		var py = next.y;
		if (cx == px) {
			if (cy > py) {
				return new mxPoint(cx, y);
			} else {
				return new mxPoint(cx, y + h);
			}
		} else if (cy == py) {
			if (cx > px) {
				return new mxPoint(x, cy);
			} else {
				return new mxPoint(x + w, cy);
			}
		}
		var tx = cx;
		var ty = cy;
		if (orthogonal) {
			if (px >= x && px <= x + w) {
				tx = px;
			} else if (py >= y && py <= y + h) {
				ty = py;
			}
		}
		if (px < cx) {
			if (py < cy) {
				return mxUtils.intersection(px, py, tx, ty, cx, y, x, cy);
			} else {
				return mxUtils.intersection(px, py, tx, ty, cx, y + h, x, cy);
			}
		} else if (py < cy) {
			return mxUtils.intersection(px, py, tx, ty, cx, y, x + w, cy);
		} else {
			return mxUtils.intersection(px, py, tx, ty, cx, y + h, x + w, cy);
		}
	},
	TrianglePerimeter: function(bounds, vertex, next, orthogonal) {
		var direction = (vertex != null) ? vertex.style[mxConstants.STYLE_DIRECTION] : null;
		var vertical = direction == mxConstants.DIRECTION_NORTH || direction == mxConstants.DIRECTION_SOUTH;
		var x = bounds.x;
		var y = bounds.y;
		var w = bounds.width;
		var h = bounds.height;
		var cx = x + w / 2;
		var cy = y + h / 2;
		var start = new mxPoint(x, y);
		var corner = new mxPoint(x + w, cy);
		var end = new mxPoint(x, y + h);
		if (direction == mxConstants.DIRECTION_NORTH) {
			start = end;
			corner = new mxPoint(cx, y);
			end = new mxPoint(x + w, y + h);
		} else if (direction == mxConstants.DIRECTION_SOUTH) {
			corner = new mxPoint(cx, y + h);
			end = new mxPoint(x + w, y);
		} else if (direction == mxConstants.DIRECTION_WEST) {
			start = new mxPoint(x + w, y);
			corner = new mxPoint(x, cy);
			end = new mxPoint(x + w, y + h);
		}
		var dx = next.x - cx;
		var dy = next.y - cy;
		var alpha = (vertical) ? Math.atan2(dx, dy) : Math.atan2(dy, dx);
		var t = (vertical) ? Math.atan2(w, h) : Math.atan2(h, w);
		var base = false;
		if (direction == mxConstants.DIRECTION_NORTH || direction == mxConstants.DIRECTION_WEST) {
			base = alpha > -t && alpha < t;
		} else {
			base = alpha < -Math.PI + t || alpha > Math.PI - t;
		}
		var result = null;
		if (base) {
			if (orthogonal && ((vertical && next.x >= start.x && next.x <= end.x) || (!vertical && next.y >= start.y && next.y <= end.y))) {
				if (vertical) {
					result = new mxPoint(next.x, start.y);
				} else {
					result = new mxPoint(start.x, next.y);
				}
			} else {
				if (direction == mxConstants.DIRECTION_NORTH) {
					result = new mxPoint(x + w / 2 + h * Math.tan(alpha) / 2, y + h);
				} else if (direction == mxConstants.DIRECTION_SOUTH) {
					result = new mxPoint(x + w / 2 - h * Math.tan(alpha) / 2, y);
				} else if (direction == mxConstants.DIRECTION_WEST) {
					result = new mxPoint(x + w, y + h / 2 + w * Math.tan(alpha) / 2);
				} else {
					result = new mxPoint(x, y + h / 2 - w * Math.tan(alpha) / 2);
				}
			}
		} else {
			if (orthogonal) {
				var pt = new mxPoint(cx, cy);
				if (next.y >= y && next.y <= y + h) {
					pt.x = (vertical) ? cx: ((direction == mxConstants.DIRECTION_WEST) ? x + w: x);
					pt.y = next.y;
				} else if (next.x >= x && next.x <= x + w) {
					pt.x = next.x;
					pt.y = (!vertical) ? cy: ((direction == mxConstants.DIRECTION_NORTH) ? y + h: y);
				}
				dx = next.x - pt.x;
				dy = next.y - pt.y;
				cx = pt.x;
				cy = pt.y;
			}
			if ((vertical && next.x <= x + w / 2) || (!vertical && next.y <= y + h / 2)) {
				result = mxUtils.intersection(next.x, next.y, cx, cy, start.x, start.y, corner.x, corner.y);
			} else {
				result = mxUtils.intersection(next.x, next.y, cx, cy, corner.x, corner.y, end.x, end.y);
			}
		}
		if (result == null) {
			result = new mxPoint(cx, cy);
		}
		return result;
	}
};
function mxPrintPreview(graph, scale, pageFormat, border, x0, y0, borderColor, title, pageSelector) {
	this.graph = graph;
	this.scale = (scale != null) ? scale: 1 / graph.pageScale;
	this.border = (border != null) ? border: 0;
	this.pageFormat = (pageFormat != null) ? pageFormat: graph.pageFormat;
	this.title = (title != null) ? title: 'Printer-friendly version';
	this.x0 = (x0 != null) ? x0: 0;
	this.y0 = (y0 != null) ? y0: 0;
	this.borderColor = borderColor;
	this.pageSelector = (pageSelector != null) ? pageSelector: true;
};
mxPrintPreview.prototype.graph = null;
mxPrintPreview.prototype.pageFormat = null;
mxPrintPreview.prototype.scale = null;
mxPrintPreview.prototype.border = null;
mxPrintPreview.prototype.x0 = null;
mxPrintPreview.prototype.y0 = null;
mxPrintPreview.prototype.autoOrigin = true;
mxPrintPreview.prototype.printOverlays = false;
mxPrintPreview.prototype.borderColor = null;
mxPrintPreview.prototype.title = null;
mxPrintPreview.prototype.pageSelector = null;
mxPrintPreview.prototype.wnd = null;
mxPrintPreview.prototype.pageCount = null;
mxPrintPreview.prototype.getWindow = function() {
	return this.wnd;
};
mxPrintPreview.prototype.open = function(css) {
	var previousInitializeOverlay = this.graph.cellRenderer.initializeOverlay;
	var div = null;
	try {
		if (this.printOverlays) {
			this.graph.cellRenderer.initializeOverlay = function(state, overlay) {
				overlay.init(state.view.getDrawPane());
			};
		}
		if (this.wnd == null) {
			this.wnd = window.open();
			var doc = this.wnd.document;
			doc.writeln('<html>');
			doc.writeln('<head>');
			this.writeHead(doc, css);
			doc.writeln('</head>');
			doc.writeln('<body>');
			mxClient.link('stylesheet', mxClient.basePath + '/css/common.css', doc);
			if (true) {
				doc.namespaces.add("v", "urn:schemas-microsoft-com:vml");
				doc.namespaces.add("o", "urn:schemas-microsoft-com:office:office");
				mxClient.link('stylesheet', mxClient.basePath + '/css/explorer.css', doc);
			}
			var bounds = this.graph.getGraphBounds().clone();
			var currentScale = this.graph.getView().getScale();
			var sc = currentScale / this.scale;
			var tr = this.graph.getView().getTranslate();
			if (!this.autoOrigin) {
				this.x0 = -tr.x * this.scale;
				this.y0 = -tr.y * this.scale;
				bounds.width += bounds.x;
				bounds.height += bounds.y;
				bounds.x = 0;
				bounds.y = 0;
				this.border = 0;
			}
			bounds.width /= sc;
			bounds.height /= sc;
			var availableWidth = this.pageFormat.width - (this.border * 2);
			var availableHeight = this.pageFormat.height - (this.border * 2);
			var hpages = Math.max(1, Math.ceil((bounds.width + this.y0) / availableWidth));
			var vpages = Math.max(1, Math.ceil((bounds.height + this.x0) / availableHeight));
			this.pageCount = hpages * vpages;
			for (var i = 0; i < vpages; i++) {
				var dy = i * availableHeight / this.scale - this.y0 / this.scale + (bounds.y - tr.y * currentScale) / currentScale;
				for (var j = 0; j < hpages; j++) {
					if (this.wnd == null) {
						return null;
					}
					var dx = j * availableWidth / this.scale - this.x0 / this.scale + (bounds.x - tr.x * currentScale) / currentScale;
					var pageNum = i * hpages + j + 1;
					div = this.renderPage(this.pageFormat.width, this.pageFormat.height, -dx, -dy, this.scale, pageNum);
					div.setAttribute('id', 'mxPage-' + pageNum);
					if (this.borderColor != null) {
						div.style.borderColor = this.borderColor;
						div.style.borderStyle = 'solid';
						div.style.borderWidth = '1px';
					}
					div.style.background = 'white';
					if (i < vpages - 1 || j < hpages - 1) {
						div.style.pageBreakAfter = 'always';
					}
					if (true) {
						doc.writeln(div.outerHTML);
						div.parentNode.removeChild(div);
					} else {
						div.parentNode.removeChild(div);
						doc.body.appendChild(div);
					}
					if (i < vpages - 1 || j < hpages - 1) {
						doc.body.appendChild(doc.createElement('hr'));
					}
				}
			}
			doc.writeln('</body>');
			doc.writeln('</html>');
			doc.close();
			mxEvent.release(doc.body);
			if (this.pageSelector && (vpages > 1 || hpages > 1)) {
				var table = this.createPageSelector(vpages, hpages);
				doc.body.appendChild(table);
				if (true) {
					table.style.position = 'absolute';
					var update = function() {
						table.style.top = (doc.body.scrollTop + 10) + 'px';
					};
					mxEvent.addListener(this.wnd, 'scroll',
					function(evt) {
						update();
					});
					mxEvent.addListener(this.wnd, 'resize',
					function(evt) {
						update();
					});
				}
			}
		}
		this.wnd.focus();
	} catch(e) {
		if (div != null && div.parentNode != null) {
			div.parentNode.removeChild(div);
		}
	} finally {
		this.graph.cellRenderer.initializeOverlay = previousInitializeOverlay;
	}
	return this.wnd;
};
mxPrintPreview.prototype.writeHead = function(doc, css) {
	if (this.title != null) {
		doc.writeln('<title>' + this.title + '</title>');
	}
	doc.writeln('<style type="text/css">');
	doc.writeln('@media print {');
	doc.writeln('  table.mxPageSelector { display: none; }');
	doc.writeln('  hr { display: none; }');
	doc.writeln('}');
	doc.writeln('@media screen {');
	doc.writeln('  table.mxPageSelector { position: fixed; right: 10px; top: 10px;' + 'font-family: Arial; font-size:10pt; border: solid 1px darkgray;' + 'background: white; border-collapse:collapse; }');
	doc.writeln('  table.mxPageSelector td { border: solid 1px gray; padding:4px; }');
	doc.writeln('  body { background: gray; }');
	doc.writeln('}');
	if (css != null) {
		doc.writeln(css);
	}
	doc.writeln('</style>');
};
mxPrintPreview.prototype.createPageSelector = function(vpages, hpages) {
	var doc = this.wnd.document;
	var table = doc.createElement('table');
	table.className = 'mxPageSelector';
	table.setAttribute('border', '0');
	var tbody = doc.createElement('tbody');
	for (var i = 0; i < vpages; i++) {
		var row = doc.createElement('tr');
		for (var j = 0; j < hpages; j++) {
			var cell = doc.createElement('td');
			cell.style.cursor = 'pointer';
			var pageNum = i * hpages + j + 1;
			mxUtils.write(cell, pageNum, doc);
			this.addPageClickListener(cell, pageNum);
			row.appendChild(cell);
		}
		tbody.appendChild(row);
	}
	table.appendChild(tbody);
	return table;
};
mxPrintPreview.prototype.addPageClickListener = function(cell, pageNumber) {
	mxEvent.addListener(cell, 'click', mxUtils.bind(this,
	function(evt) {
		var page = this.wnd.document.getElementById('mxPage-' + pageNumber);
		if (page != null) {
			this.wnd.scrollTo(0, Math.max(0, page.offsetTop - 8));
		}
	}));
};
mxPrintPreview.prototype.renderPage = function(w, h, dx, dy, scale, pageNumber) {
	var div = document.createElement('div');
	try {
		div.style.width = w + 'px';
		div.style.height = h + 'px';
		div.style.overflow = 'hidden';
		div.style.pageBreakInside = 'avoid';
		var innerDiv = document.createElement('div');
		innerDiv.style.top = this.border + 'px';
		innerDiv.style.left = this.border + 'px';
		innerDiv.style.width = (w - 2 * this.border) + 'px';
		innerDiv.style.height = (h - 2 * this.border) + 'px';
		innerDiv.style.overflow = 'hidden';
		if (true) {
			innerDiv.style.position = 'absolute';
		}
		div.appendChild(innerDiv);
		document.body.appendChild(div);
		var view = this.graph.getView();
		var previousContainer = this.graph.container;
		this.graph.container = innerDiv;
		var canvas = view.getCanvas();
		var backgroundPane = view.getBackgroundPane();
		var drawPane = view.getDrawPane();
		var overlayPane = view.getOverlayPane();
		if (this.graph.dialect == mxConstants.DIALECT_SVG) {
			view.createSvg();
		} else if (this.graph.dialect == mxConstants.DIALECT_VML) {
			view.createVml();
		} else {
			view.createHtml();
		}
		var eventsEnabled = view.isEventsEnabled();
		view.setEventsEnabled(false);
		var graphEnabled = this.graph.isEnabled();
		this.graph.setEnabled(false);
		var translate = view.getTranslate();
		view.translate = new mxPoint(dx, dy);
		var temp = null;
		try {
			var model = this.graph.getModel();
			var cells = [model.getRoot()];
			temp = new mxTemporaryCellStates(view, scale, cells);
		} finally {
			if (true) {
				view.overlayPane.innerHTML = '';
			} else {
				var tmp = innerDiv.firstChild;
				while (tmp != null) {
					var next = tmp.nextSibling;
					if (tmp.nodeName.toLowerCase() != 'svg' && tmp.style.cursor != 'default') {
						tmp.parentNode.removeChild(tmp);
					}
					tmp = next;
				}
			}
			view.overlayPane.parentNode.removeChild(view.overlayPane);
			this.graph.setEnabled(graphEnabled);
			this.graph.container = previousContainer;
			view.canvas = canvas;
			view.backgroundPane = backgroundPane;
			view.drawPane = drawPane;
			view.overlayPane = overlayPane;
			view.translate = translate;
			temp.destroy();
			view.setEventsEnabled(eventsEnabled);
		}
	} catch(e) {
		div.parentNode.removeChild(div);
		div = null;
		throw e;
	}
	return div;
};
mxPrintPreview.prototype.print = function() {
	var wnd = this.open();
	if (wnd != null) {
		wnd.print();
	}
};
mxPrintPreview.prototype.close = function() {
	if (this.wnd != null) {
		this.wnd.close();
		this.wnd = null;
	}
};
function mxStylesheet() {
	this.styles = new Object();
	this.putDefaultVertexStyle(this.createDefaultVertexStyle());
	this.putDefaultEdgeStyle(this.createDefaultEdgeStyle());
};
mxStylesheet.prototype.styles;
mxStylesheet.prototype.createDefaultVertexStyle = function() {
	var style = new Object();
	style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
	style[mxConstants.STYLE_PERIMETER] = mxPerimeter.RectanglePerimeter;
	style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
	style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
	style[mxConstants.STYLE_FILLCOLOR] = '#C3D9FF';
	style[mxConstants.STYLE_STROKECOLOR] = '#6482B9';
	style[mxConstants.STYLE_FONTCOLOR] = '#774400';
	return style;
};
mxStylesheet.prototype.createDefaultEdgeStyle = function() {
	var style = new Object();
	style[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
	style[mxConstants.STYLE_ENDARROW] = mxConstants.ARROW_CLASSIC;
	style[mxConstants.STYLE_VERTICAL_ALIGN] = mxConstants.ALIGN_MIDDLE;
	style[mxConstants.STYLE_ALIGN] = mxConstants.ALIGN_CENTER;
	style[mxConstants.STYLE_STROKECOLOR] = '#6482B9';
	style[mxConstants.STYLE_FONTCOLOR] = '#446299';
	return style;
};
mxStylesheet.prototype.putDefaultVertexStyle = function(style) {
	this.putCellStyle('defaultVertex', style);
};
mxStylesheet.prototype.putDefaultEdgeStyle = function(style) {
	this.putCellStyle('defaultEdge', style);
};
mxStylesheet.prototype.getDefaultVertexStyle = function() {
	return this.styles['defaultVertex'];
};
mxStylesheet.prototype.getDefaultEdgeStyle = function() {
	return this.styles['defaultEdge'];
};
mxStylesheet.prototype.putCellStyle = function(name, style) {
	this.styles[name] = style;
};
mxStylesheet.prototype.getCellStyle = function(name, defaultStyle) {
	var style = defaultStyle;
	if (name != null && name.length > 0) {
		var pairs = name.split(';');
		if (style != null && name.charAt(0) != ';') {
			style = mxUtils.clone(style);
		} else {
			style = new Object();
		}
		for (var i = 0; i < pairs.length; i++) {
			var tmp = pairs[i];
			var pos = tmp.indexOf('=');
			if (pos >= 0) {
				var key = tmp.substring(0, pos);
				var value = tmp.substring(pos + 1);
				if (value == mxConstants.NONE) {
					delete style[key];
				} else if (mxUtils.isNumeric(value)) {
					style[key] = parseFloat(value);
				} else {
					style[key] = value;
				}
			} else {
				var tmpStyle = this.styles[tmp];
				if (tmpStyle != null) {
					for (var key in tmpStyle) {
						style[key] = tmpStyle[key];
					}
				}
			}
		}
	}
	return style;
};
function mxCellState(view, cell, style) {
	this.view = view;
	this.cell = cell;
	this.style = style;
	this.origin = new mxPoint();
	this.absoluteOffset = new mxPoint();
};
mxCellState.prototype = new mxRectangle();
mxCellState.prototype.constructor = mxCellState;
mxCellState.prototype.view = null;
mxCellState.prototype.cell = null;
mxCellState.prototype.style = null;
mxCellState.prototype.invalid = true;
mxCellState.prototype.orderChanged = null;
mxCellState.prototype.origin = null;
mxCellState.prototype.absolutePoints = null;
mxCellState.prototype.absoluteOffset = null;
mxCellState.prototype.terminalDistance = 0;
mxCellState.prototype.length = 0;
mxCellState.prototype.segments = null;
mxCellState.prototype.shape = null;
mxCellState.prototype.text = null;
mxCellState.prototype.getPerimeterBounds = function(border) {
	border = border || 0;
	var bounds = new mxRectangle(this.x, this.y, this.width, this.height);
	if (border != 0) {
		bounds.grow(border);
	}
	return bounds;
};
mxCellState.prototype.setAbsoluteTerminalPoint = function(point, isSource) {
	if (isSource) {
		if (this.absolutePoints == null) {
			this.absolutePoints = [];
		}
		if (this.absolutePoints.length == 0) {
			this.absolutePoints.push(point);
		} else {
			this.absolutePoints[0] = point;
		}
	} else {
		if (this.absolutePoints == null) {
			this.absolutePoints = [];
			this.absolutePoints.push(null);
			this.absolutePoints.push(point);
		} else if (this.absolutePoints.length == 1) {
			this.absolutePoints.push(point);
		} else {
			this.absolutePoints[this.absolutePoints.length - 1] = point;
		}
	}
};
mxCellState.prototype.setCursor = function(cursor) {
	if (this.shape != null) {
		if (this.shape.innerNode != null && !this.view.graph.getModel().isEdge(this.cell)) {
			this.shape.innerNode.style.cursor = cursor;
		} else {
			this.shape.node.style.cursor = cursor;
		}
	}
	if (this.text != null) {
		this.text.node.style.cursor = cursor;
	}
};
mxCellState.prototype.destroy = function() {
	this.view.graph.cellRenderer.destroy(this);
};
mxCellState.prototype.clone = function() {
	var clone = new mxCellState(this.view, this.cell, this.style);
	if (this.absolutePoints != null) {
		clone.absolutePoints = [];
		for (i = 0; i < this.absolutePoints.length; i++) {
			clone.absolutePoints.push(this.absolutePoints[i].clone());
		}
	}
	if (this.origin != null) {
		clone.origin = this.origin.clone();
	}
	if (this.absoluteOffset != null) {
		clone.absoluteOffset = this.absoluteOffset.clone();
	}
	if (this.boundingBox != null) {
		clone.boundingBox = this.boundingBox.clone();
	}
	clone.terminalDistance = this.terminalDistance;
	clone.segments = this.segments;
	clone.length = this.length;
	clone.x = this.x;
	clone.y = this.y;
	clone.width = this.width;
	clone.height = this.height;
	return clone;
};
function mxGraphSelectionModel(graph) {
	this.graph = graph;
	this.cells = [];
};
mxGraphSelectionModel.prototype = new mxEventSource();
mxGraphSelectionModel.prototype.constructor = mxGraphSelectionModel;
mxGraphSelectionModel.prototype.doneResource = (mxClient.language != 'none') ? 'done': '';
mxGraphSelectionModel.prototype.updatingSelectionResource = (mxClient.language != 'none') ? 'updatingSelection': '';
mxGraphSelectionModel.prototype.graph = null;
mxGraphSelectionModel.prototype.singleSelection = false;
mxGraphSelectionModel.prototype.isSingleSelection = function() {
	return this.singleSelection;
};
mxGraphSelectionModel.prototype.setSingleSelection = function(singleSelection) {
	this.singleSelection = singleSelection;
};
mxGraphSelectionModel.prototype.isSelected = function(cell) {
	if (cell != null) {
		return mxUtils.indexOf(this.cells, cell) >= 0;
	}
	return false;
};
mxGraphSelectionModel.prototype.isEmpty = function() {
	return this.cells.length == 0;
};
mxGraphSelectionModel.prototype.clear = function() {
	this.changeSelection(null, this.cells);
};
mxGraphSelectionModel.prototype.setCell = function(cell) {
	if (cell != null) {
		this.setCells([cell]);
	}
};
mxGraphSelectionModel.prototype.setCells = function(cells) {
	if (cells != null) {
		if (this.singleSelection) {
			cells = [this.getFirstSelectableCell(cells)];
		}
		var tmp = [];
		for (var i = 0; i < cells.length; i++) {
			if (this.graph.isCellSelectable(cells[i])) {
				tmp.push(cells[i]);
			}
		}
		this.changeSelection(tmp, this.cells);
	}
};
mxGraphSelectionModel.prototype.getFirstSelectableCell = function(cells) {
	if (cells != null) {
		for (var i = 0; i < cells.length; i++) {
			if (this.graph.isCellSelectable(cells[i])) {
				return cells[i];
			}
		}
	}
	return null;
};
mxGraphSelectionModel.prototype.addCell = function(cell) {
	if (cell != null) {
		this.addCells([cell]);
	}
};
mxGraphSelectionModel.prototype.addCells = function(cells) {
	if (cells != null) {
		var remove = null;
		if (this.singleSelection) {
			remove = this.cells;
			cells = [this.getFirstSelectableCell(cells)];
		}
		var tmp = [];
		for (var i = 0; i < cells.length; i++) {
			if (!this.isSelected(cells[i]) && this.graph.isCellSelectable(cells[i])) {
				tmp.push(cells[i]);
			}
		}
		this.changeSelection(tmp, remove);
	}
};
mxGraphSelectionModel.prototype.removeCell = function(cell) {
	if (cell != null) {
		this.removeCells([cell]);
	}
};
mxGraphSelectionModel.prototype.removeCells = function(cells) {
	if (cells != null) {
		var tmp = [];
		for (var i = 0; i < cells.length; i++) {
			if (this.isSelected(cells[i])) {
				tmp.push(cells[i]);
			}
		}
		this.changeSelection(null, tmp);
	}
};
mxGraphSelectionModel.prototype.changeSelection = function(added, removed) {
	if ((added != null && added.length > 0 && added[0] != null) || (removed != null && removed.length > 0 && removed[0] != null)) {
		var change = new mxSelectionChange(this, added, removed);
		change.execute();
		var edit = new mxUndoableEdit(this, false);
		edit.add(change);
		this.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', edit));
	}
};
mxGraphSelectionModel.prototype.cellAdded = function(cell) {
	if (cell != null && !this.isSelected(cell)) {
		this.cells.push(cell);
	}
};
mxGraphSelectionModel.prototype.cellRemoved = function(cell) {
	if (cell != null) {
		var index = mxUtils.indexOf(this.cells, cell);
		if (index >= 0) {
			this.cells.splice(index, 1);
		}
	}
};
function mxSelectionChange(selectionModel, added, removed) {
	this.selectionModel = selectionModel;
	this.added = (added != null) ? added.slice() : null;
	this.removed = (removed != null) ? removed.slice() : null;
};
mxSelectionChange.prototype.execute = function() {
	var t0 = mxLog.enter('mxSelectionChange.execute');
	window.status = mxResources.get(this.selectionModel.updatingSelectionResource) || this.selectionModel.updatingSelectionResource;
	if (this.removed != null) {
		for (var i = 0; i < this.removed.length; i++) {
			this.selectionModel.cellRemoved(this.removed[i]);
		}
	}
	if (this.added != null) {
		for (var i = 0; i < this.added.length; i++) {
			this.selectionModel.cellAdded(this.added[i]);
		}
	}
	var tmp = this.added;
	this.added = this.removed;
	this.removed = tmp;
	window.status = mxResources.get(this.selectionModel.doneResource) || this.selectionModel.doneResource;
	mxLog.leave('mxSelectionChange.execute', t0);
	this.selectionModel.fireEvent(new mxEventObject(mxEvent.CHANGE, 'added', this.added, 'removed', this.removed));
};
function mxCellEditor(graph) {
	this.graph = graph;
	this.textarea = document.createElement('textarea');
	this.textarea.className = 'mxCellEditor';
	this.textarea.style.position = 'absolute';
	this.textarea.style.overflow = 'visible';
	this.textarea.setAttribute('cols', '20');
	this.textarea.setAttribute('rows', '4');
	if (false) {
		this.textarea.style.resize = 'none';
	}
	this.init();
};
mxCellEditor.prototype.graph = null;
mxCellEditor.prototype.textarea = null;
mxCellEditor.prototype.editingCell = null;
mxCellEditor.prototype.trigger = null;
mxCellEditor.prototype.modified = false;
mxCellEditor.prototype.emptyLabelText = '';
mxCellEditor.prototype.textNode = '';
mxCellEditor.prototype.init = function() {
	mxEvent.addListener(this.textarea, 'blur', mxUtils.bind(this,
	function(evt) {
		this.stopEditing(!this.graph.isInvokesStopCellEditing());
	}));
	mxEvent.addListener(this.textarea, 'keydown', mxUtils.bind(this,
	function(evt) {
		if (!mxEvent.isConsumed(evt)) {
			if (evt.keyCode == 113 || (this.graph.isEnterStopsCellEditing() && evt.keyCode == 13 && !mxEvent.isControlDown(evt) && !mxEvent.isShiftDown(evt))) {
				this.graph.stopEditing(false);
				mxEvent.consume(evt);
			} else if (evt.keyCode == 27) {
				this.graph.stopEditing(true);
				mxEvent.consume(evt);
			} else {
				if (this.clearOnChange) {
					this.clearOnChange = false;
					this.textarea.value = '';
				}
				this.setModified(true);
			}
		}
	}));
};
mxCellEditor.prototype.isModified = function() {
	return this.modified;
};
mxCellEditor.prototype.setModified = function(value) {
	this.modified = value;
};
mxCellEditor.prototype.startEditing = function(cell, trigger) {
	this.stopEditing(true);
	var state = this.graph.getView().getState(cell);
	if (state != null) {
		this.editingCell = cell;
		this.trigger = trigger;
		this.textNode = null;
		if (state.text != null && this.isHideLabel(state)) {
			this.textNode = state.text.node;
			this.textNode.style.visibility = 'hidden';
		}
		var scale = this.graph.getView().scale;
		var size = mxUtils.getValue(state.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE) * scale;
		var family = mxUtils.getValue(state.style, mxConstants.STYLE_FONTFAMILY, mxConstants.DEFAULT_FONTFAMILY);
		var color = mxUtils.getValue(state.style, mxConstants.STYLE_TEXTCOLOR, 'black');
		var align = (this.graph.model.isEdge(state.cell)) ? mxConstants.ALIGN_LEFT: mxUtils.getValue(state.style, mxConstants.STYLE_ALIGN, mxConstants.ALIGN_LEFT);
		var bold = (mxUtils.getValue(state.style, mxConstants.STYLE_FONTSTYLE, 0) & mxConstants.FONT_BOLD) == mxConstants.FONT_BOLD;
		this.textarea.style.fontSize = size;
		this.textarea.style.fontFamily = family;
		this.textarea.style.textAlign = align;
		this.textarea.style.color = (color != 'white') ? color: 'black';
		this.textarea.style.fontWeight = (bold) ? 'bold': 'normal';
		var bounds = this.getEditorBounds(state);
		this.textarea.style.left = bounds.x + 'px';
		this.textarea.style.top = bounds.y + 'px';
		this.textarea.style.width = bounds.width + 'px';
		this.textarea.style.height = bounds.height + 'px';
		this.textarea.style.zIndex = 5;
		var value = this.getInitialValue(state, trigger);
		if (value == null || value.length == 0) {
			value = this.getEmptyLabelText();
			this.clearOnChange = true;
		} else {
			this.clearOnChange = false;
		}
		this.setModified(false);
		this.textarea.value = value;
		this.graph.container.appendChild(this.textarea);
		this.textarea.focus();
		this.textarea.select();
	}
};
mxCellEditor.prototype.stopEditing = function(cancel) {
	cancel = cancel || false;
	if (this.editingCell != null) {
		if (this.textNode != null) {
			this.textNode.style.visibility = 'visible';
			this.textNode = null;
		}
		if (!cancel && this.isModified()) {
			this.graph.labelChanged(this.editingCell, this.getCurrentValue(), this.trigger);
		}
		this.editingCell = null;
		this.trigger = null;
		this.textarea.blur();
		this.textarea.parentNode.removeChild(this.textarea);
	}
};
mxCellEditor.prototype.getInitialValue = function(state, trigger) {
	return this.graph.getEditingValue(state.cell, trigger);
};
mxCellEditor.prototype.getCurrentValue = function() {
	return this.textarea.value.replace(/\r/g, '');
};
mxCellEditor.prototype.isHideLabel = function(state) {
	return true;
};
mxCellEditor.prototype.getEditorBounds = function(state) {
	var isEdge = this.graph.getModel().isEdge(state.cell);
	var scale = this.graph.getView().scale;
	var minHeight = (state.text == null) ? 30 : state.text.size * scale + 20;
	var minWidth = (this.textarea.style.textAlign == 'left') ? 120 : 40;
	var spacing = parseInt(state.style[mxConstants.STYLE_SPACING] || 2) * scale;
	var spacingTop = (parseInt(state.style[mxConstants.STYLE_SPACING_TOP] || 0)) * scale + spacing;
	var spacingRight = (parseInt(state.style[mxConstants.STYLE_SPACING_RIGHT] || 0)) * scale + spacing;
	var spacingBottom = (parseInt(state.style[mxConstants.STYLE_SPACING_BOTTOM] || 0)) * scale + spacing;
	var spacingLeft = (parseInt(state.style[mxConstants.STYLE_SPACING_LEFT] || 0)) * scale + spacing;
	var result = new mxRectangle(state.x, state.y, Math.max(minWidth, state.width - spacingLeft - spacingRight), Math.max(minHeight, state.height - spacingTop - spacingBottom));
	if (isEdge) {
		result.x = state.absoluteOffset.x;
		result.y = state.absoluteOffset.y;
		if (state.text != null && state.text.boundingBox != null) {
			if (state.text.boundingBox.x > 0) {
				result.x = state.text.boundingBox.x;
			}
			if (state.text.boundingBox.y > 0) {
				result.y = state.text.boundingBox.y;
			}
		}
	} else if (state.text != null && state.text.boundingBox != null) {
		result.x = Math.min(result.x, state.text.boundingBox.x);
		result.y = Math.min(result.y, state.text.boundingBox.y);
	}
	result.x += spacingLeft;
	result.y += spacingTop;
	if (state.text != null && state.text.boundingBox != null) {
		if (!isEdge) {
			result.width = Math.max(result.width, state.text.boundingBox.width);
			result.height = Math.max(result.height, state.text.boundingBox.height);
		} else {
			result.width = Math.max(minWidth, state.text.boundingBox.width);
			result.height = Math.max(minHeight, state.text.boundingBox.height);
		}
	}
	if (this.graph.getModel().isVertex(state.cell)) {
		var horizontal = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
		if (horizontal == mxConstants.ALIGN_LEFT) {
			result.x -= state.width;
		} else if (horizontal == mxConstants.ALIGN_RIGHT) {
			result.x += state.width;
		}
		var vertical = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
		if (vertical == mxConstants.ALIGN_TOP) {
			result.y -= state.height;
		} else if (vertical == mxConstants.ALIGN_BOTTOM) {
			result.y += state.height;
		}
	}
	return result;
};
mxCellEditor.prototype.getEmptyLabelText = function(cell) {
	return this.emptyLabelText;
};
mxCellEditor.prototype.getEditingCell = function() {
	return this.editingCell;
};
mxCellEditor.prototype.destroy = function() {
	mxEvent.release(this.textarea);
	if (this.textarea.parentNode != null) {
		this.textarea.parentNode.removeChild(this.textarea);
	}
	this.textarea = null;
};
function mxCellRenderer() {
	this.shapes = mxUtils.clone(this.defaultShapes);
};
mxCellRenderer.prototype.shapes = null;
mxCellRenderer.prototype.defaultEdgeShape = mxPolyline;
mxCellRenderer.prototype.defaultVertexShape = mxRectangleShape;
mxCellRenderer.prototype.defaultShapes = new Object();
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_ARROW] = mxArrow;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_RECTANGLE] = mxRectangleShape;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_ELLIPSE] = mxEllipse;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_DOUBLE_ELLIPSE] = mxDoubleEllipse;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_RHOMBUS] = mxRhombus;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_IMAGE] = mxImageShape;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_LINE] = mxLine;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_LABEL] = mxLabel;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_CYLINDER] = mxCylinder;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_SWIMLANE] = mxSwimlane;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_CONNECTOR] = mxConnector;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_ACTOR] = mxActor;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_CLOUD] = mxCloud;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_TRIANGLE] = mxTriangle;
mxCellRenderer.prototype.defaultShapes[mxConstants.SHAPE_HEXAGON] = mxHexagon;
mxCellRenderer.prototype.registerShape = function(key, shape) {
	this.shapes[key] = shape;
};
mxCellRenderer.prototype.initialize = function(state) {
	var model = state.view.graph.getModel();
	if (state.view.graph.container != null && state.shape == null && state.cell != state.view.currentRoot && (model.isVertex(state.cell) || model.isEdge(state.cell))) {
		this.createShape(state);
		if (state.shape != null) {
			this.initializeShape(state);
			if (state.view.graph.ordered) {
				state.orderChanged = true;
			} else if (model.isEdge(state.cell)) {
				this.orderEdge(state);
			} else if (state.view.graph.keepEdgesInForeground && this.firstEdge != null) {
				if (this.firstEdge.parentNode == state.shape.node.parentNode) {
					this.inserState(state, this.firstEdge);
				} else {
					this.firstEdge = null;
				}
			}
			state.shape.scale = state.view.scale;
			this.createCellOverlays(state);
			this.installListeners(state);
		}
	}
};
mxCellRenderer.prototype.initializeShape = function(state) {
	state.shape.init(state.view.getDrawPane());
};
mxCellRenderer.prototype.getPreviousStateInContainer = function(state, container) {
	var result = null;
	var graph = state.view.graph;
	var model = graph.getModel();
	var child = state.cell;
	var p = model.getParent(child);
	while (p != null && result == null) {
		result = this.findPreviousStateInContainer(graph, p, child, container);
		child = p;
		p = model.getParent(child);
	}
	return result;
};
mxCellRenderer.prototype.findPreviousStateInContainer = function(graph, cell, stop, container) {
	var result = null;
	var model = graph.getModel();
	if (stop != null) {
		var start = cell.getIndex(stop);
		for (var i = start - 1; i >= 0 && result == null; i--) {
			result = this.findPreviousStateInContainer(graph, model.getChildAt(cell, i), null, container);
		}
	} else {
		var childCount = model.getChildCount(cell);
		for (var i = childCount - 1; i >= 0 && result == null; i--) {
			result = this.findPreviousStateInContainer(graph, model.getChildAt(cell, i), null, container);
		}
	}
	if (result == null) {
		result = graph.view.getState(cell);
		if (result != null && (result.shape == null || result.shape.node == null || result.shape.node.parentNode != container)) {
			result = null;
		}
	}
	return result;
};
mxCellRenderer.prototype.order = function(state) {
	var container = state.shape.node.parentNode;
	var previous = this.getPreviousStateInContainer(state, container);
	var nextNode = container.firstChild;
	if (previous != null) {
		nextNode = previous.shape.node;
		if (previous.text != null && previous.text.node != null && previous.text.node.parentNode == container) {
			nextNode = previous.text.node;
		}
		nextNode = nextNode.nextSibling;
	}
	this.insertState(state, nextNode);
};
mxCellRenderer.prototype.orderEdge = function(state) {
	var view = state.view;
	var model = view.graph.getModel();
	if (view.graph.keepEdgesInForeground) {
		var node = state.shape.node;
		if (this.firstEdge == null || this.firstEdge.parentNode == null || this.firstEdge.parentNode != state.shape.node.parentNode) {
			this.firstEdge = state.shape.node;
		}
	} else if (view.graph.keepEdgesInBackground) {
		var node = state.shape.node;
		var parent = node.parentNode;
		var pcell = model.getParent(state.cell);
		var pstate = view.getState(pcell);
		if (pstate != null && pstate.shape != null && pstate.shape.node != null) {
			var child = pstate.shape.node.nextSibling;
			if (child != null && child != node) {
				this.insertState(state, child);
			}
		} else {
			var child = parent.firstChild;
			if (child != null && child != node) {
				this.insertState(state, child);
			}
		}
	}
};
mxCellRenderer.prototype.insertState = function(state, nextNode) {
	state.shape.node.parentNode.insertBefore(state.shape.node, nextNode);
	if (state.text != null && state.text.node != null && state.text.node.parentNode == state.shape.node.parentNode) {
		state.shape.node.parentNode.insertBefore(state.text.node, state.shape.node.nextSibling);
	}
};
mxCellRenderer.prototype.createShape = function(state) {
	if (state.style != null) {
		var ctor = this.getShapeConstructor(state);
		state.shape = new ctor();
		state.shape.points = state.absolutePoints;
		state.shape.bounds = new mxRectangle(state.x, state.y, state.width, state.height);
		state.shape.dialect = state.view.graph.dialect;
		this.configureShape(state);
	}
};
mxCellRenderer.prototype.getShapeConstructor = function(state) {
	var key = state.style[mxConstants.STYLE_SHAPE];
	var ctor = (key != null) ? this.shapes[key] : null;
	if (ctor == null) {
		ctor = (state.view.graph.getModel().isEdge(state.cell)) ? this.defaultEdgeShape: this.defaultVertexShape;
	}
	return ctor;
};
mxCellRenderer.prototype.configureShape = function(state) {
	state.shape.apply(state);
	var image = state.view.graph.getImage(state);
	if (image != null) {
		state.shape.image = image;
	}
	var indicator = state.view.graph.getIndicatorColor(state);
	var key = state.view.graph.getIndicatorShape(state);
	var ctor = (key != null) ? this.shapes[key] : null;
	if (indicator != null) {
		state.shape.indicatorShape = ctor;
		state.shape.indicatorColor = indicator;
		state.shape.indicatorGradientColor = state.view.graph.getIndicatorGradientColor(state);
		state.shape.indicatorDirection = state.style[mxConstants.STYLE_INDICATOR_DIRECTION];
	} else {
		var indicator = state.view.graph.getIndicatorImage(state);
		if (indicator != null) {
			state.shape.indicatorImage = indicator;
		}
	}
	this.postConfigureShape(state);
};
mxCellRenderer.prototype.postConfigureShape = function(state) {
	if (state.shape != null) {
		this.resolveColor(state, 'indicatorColor', mxConstants.STYLE_FILLCOLOR);
		this.resolveColor(state, 'indicatorGradientColor', mxConstants.STYLE_GRADIENTCOLOR);
		this.resolveColor(state, 'fill', mxConstants.STYLE_FILLCOLOR);
		this.resolveColor(state, 'stroke', mxConstants.STYLE_STROKECOLOR);
		this.resolveColor(state, 'gradient', mxConstants.STYLE_GRADIENTCOLOR);
	}
};
mxCellRenderer.prototype.resolveColor = function(state, field, key) {
	var value = state.shape[field];
	var graph = state.view.graph;
	var referenced = null;
	if (value == 'inherit') {
		referenced = graph.model.getParent(state.cell);
	} else if (value == 'swimlane') {
		if (graph.model.getTerminal(state.cell, false) != null) {
			referenced = graph.model.getTerminal(state.cell, false);
		} else {
			referenced = state.cell;
		}
		referenced = graph.getSwimlane(referenced);
		key = graph.swimlaneIndicatorColorAttribute;
	} else if (value == 'indicated') {
		state.shape[field] = state.shape.indicatorColor;
	}
	if (referenced != null) {
		var rstate = graph.getView().getState(referenced);
		state.shape[field] = null;
		if (rstate != null) {
			if (rstate.shape != null && field != 'indicatorColor') {
				state.shape[field] = rstate.shape[field];
			} else {
				state.shape[field] = rstate.style[key];
			}
		}
	}
};
mxCellRenderer.prototype.getLabelValue = function(state) {
	var graph = state.view.graph;
	var value = graph.getLabel(state.cell);
	if (!graph.isHtmlLabel(state.cell) && !mxUtils.isNode(value) && true && value != null) {
		value = mxUtils.htmlEntities(value, false);
	}
	return value;
};
mxCellRenderer.prototype.createLabel = function(state, value) {
	var graph = state.view.graph;
	var isEdge = graph.getModel().isEdge(state.cell);
	if (state.style[mxConstants.STYLE_FONTSIZE] > 0 || state.style[mxConstants.STYLE_FONTSIZE] == null) {
		var isForceHtml = (graph.isHtmlLabel(state.cell) || (value != null && mxUtils.isNode(value))) && graph.dialect == mxConstants.DIALECT_SVG;
		state.text = new mxText(value, new mxRectangle(), (state.style[mxConstants.STYLE_ALIGN] || mxConstants.ALIGN_CENTER), graph.getVerticalAlign(state), state.style[mxConstants.STYLE_FONTCOLOR], state.style[mxConstants.STYLE_FONTFAMILY], state.style[mxConstants.STYLE_FONTSIZE], state.style[mxConstants.STYLE_FONTSTYLE], state.style[mxConstants.STYLE_SPACING], state.style[mxConstants.STYLE_SPACING_TOP], state.style[mxConstants.STYLE_SPACING_RIGHT], state.style[mxConstants.STYLE_SPACING_BOTTOM], state.style[mxConstants.STYLE_SPACING_LEFT], state.style[mxConstants.STYLE_HORIZONTAL], state.style[mxConstants.STYLE_LABEL_BACKGROUNDCOLOR], state.style[mxConstants.STYLE_LABEL_BORDERCOLOR], graph.isWrapping(state.cell), graph.isLabelClipped(state.cell), state.style[mxConstants.STYLE_OVERFLOW]);
		state.text.opacity = state.style[mxConstants.STYLE_TEXT_OPACITY];
		state.text.dialect = (isForceHtml) ? mxConstants.DIALECT_STRICTHTML: state.view.graph.dialect;
		this.initializeLabel(state);
		var md = (mxClient.IS_TOUCH) ? 'touchstart': 'mousedown';
		var mm = (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove';
		var mu = (mxClient.IS_TOUCH) ? 'touchend': 'mouseup';
		mxEvent.addListener(state.text.node, md, mxUtils.bind(this,
		function(evt) {
			if (this.isLabelEvent(state, evt)) {
				graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, state));
			}
		}));
		mxEvent.addListener(state.text.node, mm, mxUtils.bind(this,
		function(evt) {
			if (this.isLabelEvent(state, evt)) {
				graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, state));
			}
		}));
		mxEvent.addListener(state.text.node, mu, mxUtils.bind(this,
		function(evt) {
			if (this.isLabelEvent(state, evt)) {
				graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt, state));
			}
		}));
		var dc = (mxClient.IS_TOUCH) ? 'gestureend': 'dblclick';
		mxEvent.addListener(state.text.node, dc, mxUtils.bind(this,
		function(evt) {
			if (dc == 'gestureend' && (Math.abs(evt.rotation) > 4 || Math.abs(1 - evt.scale) > 0.8)) {
				return;
			}
			if (this.isLabelEvent(state, evt)) {
				graph.dblClick(evt, state.cell);
				mxEvent.consume(evt);
			}
		}));
	}
};
mxCellRenderer.prototype.initializeLabel = function(state) {
	var graph = state.view.graph;
	if (state.text.dialect != mxConstants.DIALECT_SVG) {
		if (false && mxClient.NO_FO) {
			state.text.init(graph.container);
		} else if (mxUtils.isVml(state.view.getDrawPane())) {
			if (state.shape.label != null) {
				state.text.init(state.shape.label);
			} else {
				state.text.init(state.shape.node);
			}
		}
	}
	if (state.text.node == null) {
		state.text.init(state.view.getDrawPane());
		if (state.shape != null && state.text != null) {
			state.shape.node.parentNode.insertBefore(state.text.node, state.shape.node.nextSibling);
		}
	}
};
mxCellRenderer.prototype.createCellOverlays = function(state) {
	var graph = state.view.graph;
	var overlays = graph.getCellOverlays(state.cell);
	if (overlays != null) {
		state.overlays = [];
		for (var i = 0; i < overlays.length; i++) {
			var tmp = new mxImageShape(new mxRectangle(), overlays[i].image.src);
			tmp.dialect = state.view.graph.dialect;
			this.initializeOverlay(state, tmp);
			tmp.node.style.cursor = 'help';
			this.installCellOverlayListeners(state, overlays[i], tmp);
			state.overlays.push(tmp);
		}
	}
};
mxCellRenderer.prototype.initializeOverlay = function(state, overlay) {
	overlay.init(state.view.getOverlayPane());
};
mxCellRenderer.prototype.installCellOverlayListeners = function(state, overlay, shape) {
	var graph = state.view.graph;
	mxEvent.addListener(shape.node, 'click',
	function(evt) {
		overlay.fireEvent(new mxEventObject(mxEvent.CLICK, 'event', evt, 'cell', state.cell));
	});
	var md = (mxClient.IS_TOUCH) ? 'touchstart': 'mousedown';
	var mm = (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove';
	mxEvent.addListener(shape.node, md,
	function(evt) {
		mxEvent.consume(evt);
	});
	mxEvent.addListener(shape.node, mm,
	function(evt) {
		graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, state));
	});
};
mxCellRenderer.prototype.createControl = function(state) {
	var graph = state.view.graph;
	var image = graph.getFoldingImage(state);
	if (graph.foldingEnabled && image != null) {
		if (state.control == null) {
			var b = new mxRectangle(0, 0, image.width, image.height);
			state.control = new mxImageShape(b, image.src);
			state.control.dialect = state.view.graph.dialect;
			var isForceHtml = graph.isHtmlLabel(state.cell) && mxClient.NO_FO && graph.dialect == mxConstants.DIALECT_SVG;
			if (isForceHtml) {
				state.control.dialect = mxConstants.DIALECT_PREFERHTML;
				state.control.init(graph.container);
				state.control.node.style.zIndex = 1;
			} else {
				state.control.init(state.view.getOverlayPane());
			}
			var node = state.control.innerNode || state.control.node;
			if (graph.isEnabled()) {
				node.style.cursor = 'pointer';
			}
			mxEvent.addListener(node, 'click',
			function(evt) {
				if (graph.isEnabled()) {
					var collapse = !graph.isCellCollapsed(state.cell);
					graph.foldCells(collapse, false, [state.cell]);
					mxEvent.consume(evt);
				}
			});
			var md = (mxClient.IS_TOUCH) ? 'touchstart': 'mousedown';
			var mm = (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove';
			mxEvent.addListener(node, md,
			function(evt) {
				graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, state));
				mxEvent.consume(evt);
			});
			mxEvent.addListener(node, mm,
			function(evt) {
				graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, state));
			});
		}
	} else if (state.control != null) {
		state.control.destroy();
		state.control = null;
	}
};
mxCellRenderer.prototype.isShapeEvent = function(state, evt) {
	return true;
};
mxCellRenderer.prototype.isLabelEvent = function(state, evt) {
	return true;
};
mxCellRenderer.prototype.installListeners = function(state) {
	var graph = state.view.graph;
	if (graph.dialect == mxConstants.DIALECT_SVG) {
		var events = 'all';
		if (graph.getModel().isEdge(state.cell) && state.shape.stroke != null && state.shape.fill == null) {
			events = 'visibleStroke';
		}
		if (state.shape.innerNode != null) {
			state.shape.innerNode.setAttribute('pointer-events', events);
		} else {
			state.shape.node.setAttribute('pointer-events', events);
		}
	}
	var md = (mxClient.IS_TOUCH) ? 'touchstart': 'mousedown';
	var mm = (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove';
	var mu = (mxClient.IS_TOUCH) ? 'touchend': 'mouseup';
	mxEvent.addListener(state.shape.node, md, mxUtils.bind(this,
	function(evt) {
		if (this.isShapeEvent(state, evt)) {
			graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, (state.shape != null && mxEvent.getSource(evt) == state.shape.content) ? null: state));
		}
	}));
	mxEvent.addListener(state.shape.node, mm, mxUtils.bind(this,
	function(evt) {
		if (this.isShapeEvent(state, evt)) {
			graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, (state.shape != null && mxEvent.getSource(evt) == state.shape.content) ? null: state));
		}
	}));
	mxEvent.addListener(state.shape.node, mu, mxUtils.bind(this,
	function(evt) {
		if (this.isShapeEvent(state, evt)) {
			graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt, (state.shape != null && mxEvent.getSource(evt) == state.shape.content) ? null: state));
		}
	}));
	var dc = (mxClient.IS_TOUCH) ? 'gestureend': 'dblclick';
	mxEvent.addListener(state.shape.node, dc, mxUtils.bind(this,
	function(evt) {
		if (dc == 'gestureend' && (Math.abs(evt.rotation) > 4 || Math.abs(1 - evt.scale) > 0.8)) {
			return;
		}
		if (this.isShapeEvent(state, evt)) {
			graph.dblClick(evt, (state.shape != null && mxEvent.getSource(evt) == state.shape.content) ? null: state.cell);
			mxEvent.consume(evt);
		}
	}));
};
mxCellRenderer.prototype.redrawLabel = function(state) {
	var value = this.getLabelValue(state);
	if (state.text == null && value != null && value.length > 0) {
		this.createLabel(state, value);
	} else if (state.text != null && (value == null || value.length == 0)) {
		state.text.destroy();
		state.text = null;
	}
	if (state.text != null) {
		var graph = state.view.graph;
		var wrapping = graph.isWrapping(state.cell);
		var clipping = graph.isLabelClipped(state.cell);
		var bounds = this.getLabelBounds(state);
		if (state.text.value != value || state.text.isWrapping != wrapping || state.text.isClipping != clipping || state.text.scale != state.view.scale || !state.text.bounds.equals(bounds)) {
			state.text.value = value;
			state.text.bounds = bounds;
			state.text.scale = state.view.scale;
			state.text.isWrapping = wrapping;
			state.text.isClipping = clipping;
			state.text.redraw();
		}
	}
};
mxCellRenderer.prototype.getLabelBounds = function(state) {
	var graph = state.view.graph;
	var isEdge = graph.getModel().isEdge(state.cell);
	var bounds = new mxRectangle(state.absoluteOffset.x, state.absoluteOffset.y);
	if (!isEdge) {
		bounds.x += state.shape.bounds.x;
		bounds.y += state.shape.bounds.y;
		bounds.width = Math.max(1, state.shape.bounds.width);
		bounds.height = Math.max(1, state.shape.bounds.height);
		if (graph.isSwimlane(state.cell)) {
			var scale = graph.view.scale;
			var size = graph.getStartSize(state.cell);
			if (size.width > 0) {
				bounds.width = size.width * scale;
			} else if (size.height > 0) {
				bounds.height = size.height * scale;
			}
		}
	}
	return bounds;
};
mxCellRenderer.prototype.redrawCellOverlays = function(state) {
	var overlays = state.view.graph.getCellOverlays(state.cell);
	var oldCount = (state.overlays != null) ? state.overlays.length: 0;
	var newCount = (overlays != null) ? overlays.length: 0;
	if (oldCount != newCount) {
		if (oldCount > 0) {
			for (var i = 0; i < state.overlays.length; i++) {
				state.overlays[i].destroy();
			}
			state.overlays = null;
		}
		if (newCount > 0) {
			this.createCellOverlays(state);
		}
	}
	if (state.overlays != null) {
		for (var i = 0; i < overlays.length; i++) {
			var bounds = overlays[i].getBounds(state);
			if (state.overlays[i].bounds == null || state.overlays[i].scale != state.view.scale || !state.overlays[i].bounds.equals(bounds)) {
				state.overlays[i].bounds = bounds;
				state.overlays[i].scale = state.view.scale;
				state.overlays[i].redraw();
			}
		}
	}
};
mxCellRenderer.prototype.redrawControl = function(state) {
	if (state.control != null) {
		var bounds = this.getControlBounds(state);
		var s = state.view.scale;
		if (state.control.scale != s || !state.control.bounds.equals(bounds)) {
			state.control.bounds = bounds;
			state.control.scale = s;
			state.control.redraw();
		}
	}
};
mxCellRenderer.prototype.getControlBounds = function(state) {
	if (state.control != null) {
		var oldScale = state.control.scale;
		var w = state.control.bounds.width / oldScale;
		var h = state.control.bounds.height / oldScale;
		var s = state.view.scale;
		return (state.view.graph.getModel().isEdge(state.cell)) ? new mxRectangle(state.x + state.width / 2 - w / 2 * s, state.y + state.height / 2 - h / 2 * s, w * s, h * s) : new mxRectangle(state.x + w / 2 * s, state.y + h / 2 * s, w * s, h * s);
	}
	return null;
};
mxCellRenderer.prototype.redraw = function(state) {
	if (state.shape != null) {
		var model = state.view.graph.getModel();
		var isEdge = model.isEdge(state.cell);
		var reconfigure = false;
		this.createControl(state);
		if (state.shape.bounds == null || state.shape.scale != state.view.scale || !state.shape.bounds.equals(state) || !mxUtils.equalPoints(state.shape.points, state.absolutePoints)) {
			if (state.absolutePoints != null) {
				state.shape.points = state.absolutePoints.slice();
			} else {
				state.shape.points = null;
			}
			state.shape.bounds = new mxRectangle(state.x, state.y, state.width, state.height);
			state.shape.scale = state.view.scale;
			state.shape.redraw();
		}
		this.redrawLabel(state);
		this.redrawCellOverlays(state);
		this.redrawControl(state);
		if (state.orderChanged && state.view.graph.ordered) {
			this.order(state);
			reconfigure = true;
		}
		delete state.orderChanged;
		if (!mxUtils.equalEntries(state.shape.style, state.style)) {
			state.shape.apply(state);
			reconfigure = true;
		}
		if (reconfigure) {
			this.configureShape(state);
			state.shape.reconfigure();
		}
	}
};
mxCellRenderer.prototype.destroy = function(state) {
	if (state.shape != null) {
		if (state.text != null) {
			state.text.destroy();
			state.text = null;
		}
		if (state.overlays != null) {
			for (var i = 0; i < state.overlays.length; i++) {
				state.overlays[i].destroy();
			}
			state.overlays = null;
		}
		if (state.control != null) {
			state.control.destroy();
			state.control = null;
		}
		state.shape.destroy();
		state.shape = null;
	}
};
var mxEdgeStyle = {
	EntityRelation: function(state, source, target, points, result) {
		var view = state.view;
		var graph = view.graph;
		var segment = mxUtils.getValue(state.style, mxConstants.STYLE_SEGMENT, mxConstants.ENTITY_SEGMENT) * view.scale;
		var pts = state.absolutePoints;
		var p0 = pts[0];
		var pe = pts[pts.length - 1];
		var isSourceLeft = false;
		if (p0 != null) {
			source = new mxCellState();
			source.x = p0.x;
			source.y = p0.y;
		} else if (source != null) {
			var sourceGeometry = graph.getCellGeometry(source.cell);
			if (sourceGeometry.relative) {
				isSourceLeft = sourceGeometry.x <= 0.5;
			} else if (target != null) {
				isSourceLeft = target.x + target.width < source.x;
			}
		} else {
			return;
		}
		var isTargetLeft = true;
		if (pe != null) {
			target = new mxCellState();
			target.x = pe.x;
			target.y = pe.y;
		} else if (target != null) {
			var targetGeometry = graph.getCellGeometry(target.cell);
			if (targetGeometry.relative) {
				isTargetLeft = targetGeometry.x <= 0.5;
			} else if (source != null) {
				isTargetLeft = source.x + source.width < target.x;
			}
		}
		if (source != null && target != null) {
			var x0 = (isSourceLeft) ? source.x: source.x + source.width;
			var y0 = view.getRoutingCenterY(source);
			var xe = (isTargetLeft) ? target.x: target.x + target.width;
			var ye = view.getRoutingCenterY(target);
			var seg = segment;
			var dx = (isSourceLeft) ? -seg: seg;
			var dep = new mxPoint(x0 + dx, y0);
			dx = (isTargetLeft) ? -seg: seg;
			var arr = new mxPoint(xe + dx, ye);
			if (isSourceLeft == isTargetLeft) {
				var x = (isSourceLeft) ? Math.min(x0, xe) - segment: Math.max(x0, xe) + segment;
				result.push(new mxPoint(x, y0));
				result.push(new mxPoint(x, ye));
			} else if ((dep.x < arr.x) == isSourceLeft) {
				var midY = y0 + (ye - y0) / 2;
				result.push(dep);
				result.push(new mxPoint(dep.x, midY));
				result.push(new mxPoint(arr.x, midY));
				result.push(arr);
			} else {
				result.push(dep);
				result.push(arr);
			}
		}
	},
	Loop: function(state, source, target, points, result) {
		if (source != null) {
			var view = state.view;
			var graph = view.graph;
			var pt = (points != null && points.length > 0) ? points[0] : null;
			if (pt != null) {
				pt = view.transformControlPoint(state, pt);
				if (mxUtils.contains(source, pt.x, pt.y)) {
					pt = null;
				}
			}
			var x = 0;
			var dx = 0;
			var y = 0;
			var dy = 0;
			var seg = mxUtils.getValue(state.style, mxConstants.STYLE_SEGMENT, graph.gridSize) * view.scale;
			var dir = mxUtils.getValue(state.style, mxConstants.STYLE_DIRECTION, mxConstants.DIRECTION_WEST);
			if (dir == mxConstants.DIRECTION_NORTH || dir == mxConstants.DIRECTION_SOUTH) {
				x = view.getRoutingCenterX(source);
				dx = seg;
			} else {
				y = view.getRoutingCenterY(source);
				dy = seg;
			}
			if (pt == null || pt.x < source.x || pt.x > source.x + source.width) {
				if (pt != null) {
					x = pt.x;
					dy = Math.max(Math.abs(y - pt.y), dy);
				} else {
					if (dir == mxConstants.DIRECTION_NORTH) {
						y = source.y - 2 * dx;
					} else if (dir == mxConstants.DIRECTION_SOUTH) {
						y = source.y + source.height + 2 * dx;
					} else if (dir == mxConstants.DIRECTION_EAST) {
						x = source.x - 2 * dy;
					} else {
						x = source.x + source.width + 2 * dy;
					}
				}
			} else if (pt != null) {
				x = view.getRoutingCenterX(source);
				dx = Math.max(Math.abs(x - pt.x), dy);
				y = pt.y;
				dy = 0;
			}
			result.push(new mxPoint(x - dx, y - dy));
			result.push(new mxPoint(x + dx, y + dy));
		}
	},
	ElbowConnector: function(state, source, target, points, result) {
		var pt = (points != null && points.length > 0) ? points[0] : null;
		var vertical = false;
		var horizontal = false;
		if (source != null && target != null) {
			if (pt != null) {
				var left = Math.min(source.x, target.x);
				var right = Math.max(source.x + source.width, target.x + target.width);
				var top = Math.min(source.y, target.y);
				var bottom = Math.max(source.y + source.height, target.y + target.height);
				pt = state.view.transformControlPoint(state, pt);
				vertical = pt.y < top || pt.y > bottom;
				horizontal = pt.x < left || pt.x > right;
			} else {
				var left = Math.max(source.x, target.x);
				var right = Math.min(source.x + source.width, target.x + target.width);
				vertical = left == right;
				if (!vertical) {
					var top = Math.max(source.y, target.y);
					var bottom = Math.min(source.y + source.height, target.y + target.height);
					horizontal = top == bottom;
				}
			}
		}
		if (!horizontal && (vertical || state.style[mxConstants.STYLE_ELBOW] == mxConstants.ELBOW_VERTICAL)) {
			mxEdgeStyle.TopToBottom(state, source, target, points, result);
		} else {
			mxEdgeStyle.SideToSide(state, source, target, points, result);
		}
	},
	SideToSide: function(state, source, target, points, result) {
		var view = state.view;
		var pt = (points != null && points.length > 0) ? points[0] : null;
		var pts = state.absolutePoints;
		var p0 = pts[0];
		var pe = pts[pts.length - 1];
		if (pt != null) {
			pt = view.transformControlPoint(state, pt);
		}
		if (p0 != null) {
			source = new mxCellState();
			source.x = p0.x;
			source.y = p0.y;
		}
		if (pe != null) {
			target = new mxCellState();
			target.x = pe.x;
			target.y = pe.y;
		}
		if (source != null && target != null) {
			var l = Math.max(source.x, target.x);
			var r = Math.min(source.x + source.width, target.x + target.width);
			var x = (pt != null) ? pt.x: r + (l - r) / 2;
			var y1 = view.getRoutingCenterY(source);
			var y2 = view.getRoutingCenterY(target);
			if (pt != null) {
				if (p0 != null && pt.y >= source.y && pt.y <= source.y + source.height) {
					y1 = pt.y;
				}
				if (pe != null && pt.y >= target.y && pt.y <= target.y + target.height) {
					y2 = pt.y;
				}
			}
			if (!mxUtils.contains(target, x, y1) && !mxUtils.contains(source, x, y1)) {
				result.push(new mxPoint(x, y1));
			}
			if (!mxUtils.contains(target, x, y2) && !mxUtils.contains(source, x, y2)) {
				result.push(new mxPoint(x, y2));
			}
			if (result.length == 1) {
				if (pt != null) {
					if (!mxUtils.contains(target, x, pt.y) && !mxUtils.contains(source, x, pt.y)) {
						result.push(new mxPoint(x, pt.y));
					}
				} else {
					var t = Math.max(source.y, target.y);
					var b = Math.min(source.y + source.height, target.y + target.height);
					result.push(new mxPoint(x, t + (b - t) / 2));
				}
			}
		}
	},
	TopToBottom: function(state, source, target, points, result) {
		var view = state.view;
		var pt = (points != null && points.length > 0) ? points[0] : null;
		var pts = state.absolutePoints;
		var p0 = pts[0];
		var pe = pts[pts.length - 1];
		if (pt != null) {
			pt = view.transformControlPoint(state, pt);
		}
		if (p0 != null) {
			source = new mxCellState();
			source.x = p0.x;
			source.y = p0.y;
		}
		if (pe != null) {
			target = new mxCellState();
			target.x = pe.x;
			target.y = pe.y;
		}
		if (source != null && target != null) {
			var t = Math.max(source.y, target.y);
			var b = Math.min(source.y + source.height, target.y + target.height);
			var x = view.getRoutingCenterX(source);
			if (pt != null && pt.x >= source.x && pt.x <= source.x + source.width) {
				x = pt.x;
			}
			var y = (pt != null) ? pt.y: b + (t - b) / 2;
			if (!mxUtils.contains(target, x, y) && !mxUtils.contains(source, x, y)) {
				result.push(new mxPoint(x, y));
			}
			if (pt != null && pt.x >= target.x && pt.x <= target.x + target.width) {
				x = pt.x;
			} else {
				x = view.getRoutingCenterX(target);
			}
			if (!mxUtils.contains(target, x, y) && !mxUtils.contains(source, x, y)) {
				result.push(new mxPoint(x, y));
			}
			if (result.length == 1) {
				if (pt != null && result.length == 1) {
					if (!mxUtils.contains(target, pt.x, y) && !mxUtils.contains(source, pt.x, y)) {
						result.push(new mxPoint(pt.x, y));
					}
				} else {
					var l = Math.max(source.x, target.x);
					var r = Math.min(source.x + source.width, target.x + target.width);
					result.push(new mxPoint(l + (r - l) / 2, y));
				}
			}
		}
	}
};
var mxStyleRegistry = {
	values: [],
	putValue: function(name, obj) {
		mxStyleRegistry.values[name] = obj;
	},
	getValue: function(name) {
		return mxStyleRegistry.values[name];
	},
	getName: function(value) {
		for (var key in mxStyleRegistry.values) {
			if (mxStyleRegistry.values[key] == value) {
				return key;
			}
		}
		return null;
	}
};
mxStyleRegistry.putValue(mxConstants.EDGESTYLE_ELBOW, mxEdgeStyle.ElbowConnector);
mxStyleRegistry.putValue(mxConstants.EDGESTYLE_ENTITY_RELATION, mxEdgeStyle.EntityRelation);
mxStyleRegistry.putValue(mxConstants.EDGESTYLE_LOOP, mxEdgeStyle.Loop);
mxStyleRegistry.putValue(mxConstants.EDGESTYLE_SIDETOSIDE, mxEdgeStyle.SideToSide);
mxStyleRegistry.putValue(mxConstants.EDGESTYLE_TOPTOBOTTOM, mxEdgeStyle.TopToBottom);
mxStyleRegistry.putValue(mxConstants.PERIMETER_ELLIPSE, mxPerimeter.EllipsePerimeter);
mxStyleRegistry.putValue(mxConstants.PERIMETER_RECTANGLE, mxPerimeter.RectanglePerimeter);
mxStyleRegistry.putValue(mxConstants.PERIMETER_RHOMBUS, mxPerimeter.RhombusPerimeter);
mxStyleRegistry.putValue(mxConstants.PERIMETER_TRIANGLE, mxPerimeter.TrianglePerimeter);
function mxGraphView(graph) {
	this.graph = graph;
	this.translate = new mxPoint();
	this.graphBounds = new mxRectangle();
	this.states = new mxDictionary();
};
mxGraphView.prototype = new mxEventSource();
mxGraphView.prototype.constructor = mxGraphView;
mxGraphView.prototype.EMPTY_POINT = new mxPoint();
mxGraphView.prototype.doneResource = (mxClient.language != 'none') ? 'done': '';
mxGraphView.prototype.updatingDocumentResource = (mxClient.language != 'none') ? 'updatingDocument': '';
mxGraphView.prototype.allowEval = false;
mxGraphView.prototype.captureDocumentGesture = true;
mxGraphView.prototype.rendering = true;
mxGraphView.prototype.graph = null;
mxGraphView.prototype.currentRoot = null;
mxGraphView.prototype.graphBounds = null;
mxGraphView.prototype.scale = 1;
mxGraphView.prototype.translate = null;
mxGraphView.prototype.updateStyle = false;
mxGraphView.prototype.getGraphBounds = function() {
	return this.graphBounds;
};
mxGraphView.prototype.setGraphBounds = function(value) {
	this.graphBounds = value;
};
mxGraphView.prototype.getBounds = function(cells) {
	var result = null;
	if (cells != null && cells.length > 0) {
		var model = this.graph.getModel();
		for (var i = 0; i < cells.length; i++) {
			if (model.isVertex(cells[i]) || model.isEdge(cells[i])) {
				var state = this.getState(cells[i]);
				if (state != null) {
					if (result == null) {
						result = new mxRectangle(state.x, state.y, state.width, state.height);
					} else {
						result.add(state);
					}
				}
			}
		}
	}
	return result;
};
mxGraphView.prototype.setCurrentRoot = function(root) {
	if (this.currentRoot != root) {
		var change = new mxCurrentRootChange(this, root);
		change.execute();
		var edit = new mxUndoableEdit(this, false);
		edit.add(change);
		this.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', edit));
		this.graph.sizeDidChange();
	}
	return root;
};
mxGraphView.prototype.scaleAndTranslate = function(scale, dx, dy) {
	var previousScale = this.scale;
	var previousTranslate = new mxPoint(this.translate.x, this.translate.y);
	if (this.scale != scale || this.translate.x != dx || this.translate.y != dy) {
		this.scale = scale;
		this.translate.x = dx;
		this.translate.y = dy;
		if (this.isEventsEnabled()) {
			this.revalidate();
			this.graph.sizeDidChange();
		}
	}
	this.fireEvent(new mxEventObject(mxEvent.SCALE_AND_TRANSLATE, 'scale', scale, 'previousScale', previousScale, 'translate', this.translate, 'previousTranslate', previousTranslate));
};
mxGraphView.prototype.getScale = function() {
	return this.scale;
};
mxGraphView.prototype.setScale = function(value) {
	var previousScale = this.scale;
	if (this.scale != value) {
		this.scale = value;
		if (this.isEventsEnabled()) {
			this.revalidate();
			this.graph.sizeDidChange();
		}
	}
	this.fireEvent(new mxEventObject(mxEvent.SCALE, 'scale', value, 'previousScale', previousScale));
};
mxGraphView.prototype.getTranslate = function() {
	return this.translate;
};
mxGraphView.prototype.setTranslate = function(dx, dy) {
	var previousTranslate = new mxPoint(this.translate.x, this.translate.y);
	if (this.translate.x != dx || this.translate.y != dy) {
		this.translate.x = dx;
		this.translate.y = dy;
		if (this.isEventsEnabled()) {
			this.revalidate();
			this.graph.sizeDidChange();
		}
	}
	this.fireEvent(new mxEventObject(mxEvent.TRANSLATE, 'translate', this.translate, 'previousTranslate', previousTranslate));
};
mxGraphView.prototype.refresh = function() {
	if (this.currentRoot != null) {
		this.clear();
	}
	this.revalidate();
};
mxGraphView.prototype.revalidate = function() {
	this.invalidate();
	this.validate();
};
mxGraphView.prototype.clear = function(cell, force, recurse) {
	var model = this.graph.getModel();
	cell = cell || model.getRoot();
	force = (force != null) ? force: false;
	recurse = (recurse != null) ? recurse: true;
	this.removeState(cell);
	if (recurse && (force || cell != this.currentRoot)) {
		var childCount = model.getChildCount(cell);
		for (var i = 0; i < childCount; i++) {
			this.clear(model.getChildAt(cell, i), force);
		}
	} else {
		this.invalidate(cell);
	}
};
mxGraphView.prototype.invalidate = function(cell, recurse, includeEdges, orderChanged) {
	var model = this.graph.getModel();
	cell = cell || model.getRoot();
	recurse = (recurse != null) ? recurse: true;
	includeEdges = (includeEdges != null) ? includeEdges: true;
	orderChanged = (orderChanged != null) ? orderChanged: false;
	var state = this.getState(cell);
	if (state != null) {
		state.invalid = true;
		if (orderChanged) {
			state.orderChanged = true;
		}
	}
	if (recurse) {
		var childCount = model.getChildCount(cell);
		for (var i = 0; i < childCount; i++) {
			var child = model.getChildAt(cell, i);
			this.invalidate(child, recurse, includeEdges);
		}
	}
	if (includeEdges) {
		var edgeCount = model.getEdgeCount(cell);
		for (var i = 0; i < edgeCount; i++) {
			this.invalidate(model.getEdgeAt(cell, i), recurse, false);
		}
	}
};
mxGraphView.prototype.validate = function(cell) {
	var t0 = mxLog.enter('mxGraphView.validate');
	window.status = mxResources.get(this.updatingDocumentResource) || this.updatingDocumentResource;
	cell = cell || ((this.currentRoot != null) ? this.currentRoot: this.graph.getModel().getRoot());
	this.validateBounds(null, cell);
	var graphBounds = this.validatePoints(null, cell);
	if (graphBounds == null) {
		graphBounds = new mxRectangle();
	}
	this.setGraphBounds(graphBounds);
	this.validateBackground();
	window.status = mxResources.get(this.doneResource) || this.doneResource;
	mxLog.leave('mxGraphView.validate', t0);
};
mxGraphView.prototype.validateBackground = function() {
	var bg = this.graph.getBackgroundImage();
	if (bg != null) {
		if (this.backgroundImage == null || this.backgroundImage.image != bg.src) {
			if (this.backgroundImage != null) {
				this.backgroundImage.destroy();
			}
			var bounds = new mxRectangle(0, 0, 1, 1);
			this.backgroundImage = new mxImageShape(bounds, bg.src);
			this.backgroundImage.dialect = this.graph.dialect;
			this.backgroundImage.init(this.backgroundPane);
		}
		this.redrawBackgroundImage(this.backgroundImage, bg);
	} else if (this.backgroundImage != null) {
		this.backgroundImage.destroy();
		this.backgroundImage = null;
	}
	if (this.graph.pageVisible) {
		var fmt = this.graph.pageFormat;
		var ps = this.scale * this.graph.pageScale;
		var bounds = new mxRectangle(this.scale * this.translate.x, this.scale * this.translate.y, fmt.width * ps, fmt.height * ps);
		if (this.backgroundPageShape == null) {
			this.backgroundPageShape = new mxRectangleShape(bounds, 'white', 'black');
			this.backgroundPageShape.scale = this.scale;
			this.backgroundPageShape.isShadow = true;
			this.backgroundPageShape.dialect = this.graph.dialect;
			this.backgroundPageShape.init(this.backgroundPane);
			mxEvent.addListener(this.backgroundPageShape.node, 'dblclick', mxUtils.bind(this,
			function(evt) {
				this.graph.dblClick(evt);
			}));
			var md = (mxClient.IS_TOUCH) ? 'touchstart': 'mousedown';
			var mm = (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove';
			var mu = (mxClient.IS_TOUCH) ? 'touchend': 'mouseup';
			mxEvent.addListener(this.backgroundPageShape.node, md, mxUtils.bind(this,
			function(evt) {
				this.graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt));
			}));
			mxEvent.addListener(this.backgroundPageShape.node, mm, mxUtils.bind(this,
			function(evt) {
				if (this.graph.tooltipHandler != null && this.graph.tooltipHandler.isHideOnHover()) {
					this.graph.tooltipHandler.hide();
				}
				if (this.graph.isMouseDown && !mxEvent.isConsumed(evt)) {
					this.graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt));
				}
			}));
			mxEvent.addListener(this.backgroundPageShape.node, mu, mxUtils.bind(this,
			function(evt) {
				this.graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt));
			}));
		} else {
			this.backgroundPageShape.scale = this.scale;
			this.backgroundPageShape.bounds = bounds;
			this.backgroundPageShape.redraw();
		}
	} else if (this.backgroundPageShape != null) {
		this.backgroundPageShape.destroy();
		this.backgroundPageShape = null;
	}
};
mxGraphView.prototype.redrawBackgroundImage = function(backgroundImage, bg) {
	backgroundImage.scale = this.scale;
	backgroundImage.bounds.x = this.scale * this.translate.x;
	backgroundImage.bounds.y = this.scale * this.translate.y;
	backgroundImage.bounds.width = this.scale * bg.width;
	backgroundImage.bounds.height = this.scale * bg.height;
	backgroundImage.redraw();
};
mxGraphView.prototype.validateBounds = function(parentState, cell) {
	var model = this.graph.getModel();
	var state = this.getState(cell, true);
	if (state != null && state.invalid) {
		if (!this.graph.isCellVisible(cell)) {
			this.removeState(cell);
		} else if (cell != this.currentRoot && parentState != null) {
			state.absoluteOffset.x = 0;
			state.absoluteOffset.y = 0;
			state.origin.x = parentState.origin.x;
			state.origin.y = parentState.origin.y;
			var geo = this.graph.getCellGeometry(cell);
			if (geo != null) {
				if (!model.isEdge(cell)) {
					var offset = geo.offset || this.EMPTY_POINT;
					if (geo.relative) {
						state.origin.x += geo.x * parentState.width / this.scale + offset.x;
						state.origin.y += geo.y * parentState.height / this.scale + offset.y;
					} else {
						state.absoluteOffset.x = this.scale * offset.x;
						state.absoluteOffset.y = this.scale * offset.y;
						state.origin.x += geo.x;
						state.origin.y += geo.y;
					}
				}
				state.x = this.scale * (this.translate.x + state.origin.x);
				state.y = this.scale * (this.translate.y + state.origin.y);
				state.width = this.scale * geo.width;
				state.height = this.scale * geo.height;
				if (model.isVertex(cell)) {
					this.updateVertexLabelOffset(state);
				}
			}
		}
		var offset = this.graph.getChildOffsetForCell(cell);
		if (offset != null) {
			state.origin.x += offset.x;
			state.origin.y += offset.y;
		}
	}
	if (state != null && (!this.graph.isCellCollapsed(cell) || cell == this.currentRoot)) {
		var childCount = model.getChildCount(cell);
		for (var i = 0; i < childCount; i++) {
			var child = model.getChildAt(cell, i);
			this.validateBounds(state, child);
		}
	}
};
mxGraphView.prototype.updateVertexLabelOffset = function(state) {
	var horizontal = mxUtils.getValue(state.style, mxConstants.STYLE_LABEL_POSITION, mxConstants.ALIGN_CENTER);
	if (horizontal == mxConstants.ALIGN_LEFT) {
		state.absoluteOffset.x -= state.width;
	} else if (horizontal == mxConstants.ALIGN_RIGHT) {
		state.absoluteOffset.x += state.width;
	}
	var vertical = mxUtils.getValue(state.style, mxConstants.STYLE_VERTICAL_LABEL_POSITION, mxConstants.ALIGN_MIDDLE);
	if (vertical == mxConstants.ALIGN_TOP) {
		state.absoluteOffset.y -= state.height;
	} else if (vertical == mxConstants.ALIGN_BOTTOM) {
		state.absoluteOffset.y += state.height;
	}
};
mxGraphView.prototype.validatePoints = function(parentState, cell) {
	var model = this.graph.getModel();
	var state = this.getState(cell);
	var bbox = null;
	if (state != null) {
		if (state.invalid) {
			var geo = this.graph.getCellGeometry(cell);
			if (geo != null && model.isEdge(cell)) {
				var source = this.getState(this.getVisibleTerminal(cell, true));
				if (source != null && model.isEdge(source.cell) && !model.isAncestor(source.cell, cell)) {
					var tmp = this.getState(model.getParent(source.cell));
					this.validatePoints(tmp, source.cell);
				}
				var target = this.getState(this.getVisibleTerminal(cell, false));
				if (target != null && model.isEdge(target.cell) && !model.isAncestor(target.cell, cell)) {
					var tmp = this.getState(model.getParent(target.cell));
					this.validatePoints(tmp, target.cell);
				}
				this.updateFixedTerminalPoints(state, source, target);
				this.updatePoints(state, geo.points, source, target);
				this.updateFloatingTerminalPoints(state, source, target);
				this.updateEdgeBounds(state);
				this.updateEdgeLabelOffset(state);
			} else if (geo != null && geo.relative && parentState != null && model.isEdge(parentState.cell)) {
				var origin = this.getPoint(parentState, geo);
				if (origin != null) {
					state.x = origin.x;
					state.y = origin.y;
					origin.x = (origin.x / this.scale) - this.translate.x;
					origin.y = (origin.y / this.scale) - this.translate.y;
					state.origin = origin;
					this.childMoved(parentState, state);
				}
			}
			state.invalid = false;
			if (this.isRendering() && cell != this.currentRoot) {
				this.graph.cellRenderer.redraw(state);
			}
		}
		if (model.isEdge(cell) || model.isVertex(cell)) {
			bbox = new mxRectangle(state.x, state.y, state.width, state.height);
			var box = (state.text != null && !this.graph.isLabelClipped(state.cell)) ? state.text.boundingBox: null;
			if (box != null) {
				bbox.add(box);
			}
		}
	}
	if (state != null && (!this.graph.isCellCollapsed(cell) || cell == this.currentRoot)) {
		var childCount = model.getChildCount(cell);
		for (var i = 0; i < childCount; i++) {
			var child = model.getChildAt(cell, i);
			var bounds = this.validatePoints(state, child);
			if (bounds != null) {
				if (bbox == null) {
					bbox = bounds;
				} else {
					bbox.add(bounds);
				}
			}
		}
	}
	return bbox;
};
mxGraphView.prototype.childMoved = function(parent, child) {
	var cell = child.cell;
	if (!this.graph.isCellCollapsed(cell) || cell == this.currentRoot) {
		var model = this.graph.getModel();
		var childCount = model.getChildCount(cell);
		for (var i = 0; i < childCount; i++) {
			this.validateBounds(child, model.getChildAt(cell, i));
		}
	}
};
mxGraphView.prototype.updateFixedTerminalPoints = function(edge, source, target) {
	this.updateFixedTerminalPoint(edge, source, true, this.graph.getConnectionConstraint(edge, source, true));
	this.updateFixedTerminalPoint(edge, target, false, this.graph.getConnectionConstraint(edge, target, false));
};
mxGraphView.prototype.updateFixedTerminalPoint = function(edge, terminal, source, constraint) {
	var pt = null;
	if (constraint != null) {
		pt = this.graph.getConnectionPoint(terminal, constraint);
	}
	if (pt == null && terminal == null) {
		var s = this.scale;
		var tr = this.translate;
		var orig = edge.origin;
		var geo = this.graph.getCellGeometry(edge.cell);
		pt = geo.getTerminalPoint(source);
		if (pt != null) {
			pt = new mxPoint(s * (tr.x + pt.x + orig.x), s * (tr.y + pt.y + orig.y));
		}
	}
	edge.setAbsoluteTerminalPoint(pt, source);
};
mxGraphView.prototype.updatePoints = function(edge, points, source, target) {
	if (edge != null) {
		var pts = [];
		pts.push(edge.absolutePoints[0]);
		var edgeStyle = this.getEdgeStyle(edge, points, source, target);
		if (edgeStyle != null) {
			var src = this.getTerminalPort(edge, source, true);
			var trg = this.getTerminalPort(edge, target, false);
			edgeStyle(edge, src, trg, points, pts);
		} else if (points != null) {
			for (var i = 0; i < points.length; i++) {
				if (points[i] != null) {
					var pt = mxUtils.clone(points[i]);
					pts.push(this.transformControlPoint(edge, pt));
				}
			}
		}
		var tmp = edge.absolutePoints;
		pts.push(tmp[tmp.length - 1]);
		edge.absolutePoints = pts;
	}
};
mxGraphView.prototype.transformControlPoint = function(state, pt) {
	var orig = state.origin;
	return new mxPoint(this.scale * (pt.x + this.translate.x + orig.x), this.scale * (pt.y + this.translate.y + orig.y));
};
mxGraphView.prototype.getEdgeStyle = function(edge, points, source, target) {
	var edgeStyle = (source != null && source == target) ? mxUtils.getValue(edge.style, mxConstants.STYLE_LOOP, this.graph.defaultLoopStyle) : (!mxUtils.getValue(edge.style, mxConstants.STYLE_NOEDGESTYLE, false) ? edge.style[mxConstants.STYLE_EDGE] : null);
	if (typeof(edgeStyle) == "string") {
		var tmp = mxStyleRegistry.getValue(edgeStyle);
		if (tmp == null && this.isAllowEval()) {
			tmp = mxUtils.eval(edgeStyle);
		}
		edgeStyle = tmp;
	}
	if (typeof(edgeStyle) == "function") {
		return edgeStyle;
	}
	return null;
};
mxGraphView.prototype.updateFloatingTerminalPoints = function(state, source, target) {
	var pts = state.absolutePoints;
	var p0 = pts[0];
	var pe = pts[pts.length - 1];
	if (pe == null && target != null) {
		this.updateFloatingTerminalPoint(state, target, source, false);
	}
	if (p0 == null && source != null) {
		this.updateFloatingTerminalPoint(state, source, target, true);
	}
};
mxGraphView.prototype.updateFloatingTerminalPoint = function(edge, start, end, source) {
	start = this.getTerminalPort(edge, start, source);
	var next = this.getNextPoint(edge, end, source);
	var border = parseFloat(edge.style[mxConstants.STYLE_PERIMETER_SPACING] || 0);
	border += parseFloat(edge.style[(source) ? mxConstants.STYLE_SOURCE_PERIMETER_SPACING: mxConstants.STYLE_TARGET_PERIMETER_SPACING] || 0);
	var pt = this.getPerimeterPoint(start, next, this.graph.isOrthogonal(edge), border);
	edge.setAbsoluteTerminalPoint(pt, source);
};
mxGraphView.prototype.getTerminalPort = function(state, terminal, source) {
	var key = (source) ? mxConstants.STYLE_SOURCE_PORT: mxConstants.STYLE_TARGET_PORT;
	var id = mxUtils.getValue(state.style, key);
	if (id != null) {
		var tmp = this.getState(this.graph.getModel().getCell(id));
		if (tmp != null) {
			terminal = tmp;
		}
	}
	return terminal;
};
mxGraphView.prototype.getPerimeterPoint = function(terminal, next, orthogonal, border) {
	var point = null;
	if (terminal != null) {
		var perimeter = this.getPerimeterFunction(terminal);
		if (perimeter != null && next != null) {
			var bounds = this.getPerimeterBounds(terminal, border);
			if (bounds.width > 0 || bounds.height > 0) {
				point = perimeter(bounds, terminal, next, orthogonal);
			}
		}
		if (point == null) {
			point = this.getPoint(terminal);
		}
	}
	return point;
};
mxGraphView.prototype.getRoutingCenterX = function(state) {
	var f = (state.style != null) ? parseFloat(state.style[mxConstants.STYLE_ROUTING_CENTER_X]) || 0 : 0;
	return state.getCenterX() + f * state.width;
};
mxGraphView.prototype.getRoutingCenterY = function(state) {
	var f = (state.style != null) ? parseFloat(state.style[mxConstants.STYLE_ROUTING_CENTER_Y]) || 0 : 0;
	return state.getCenterY() + f * state.height;
};
mxGraphView.prototype.getPerimeterBounds = function(terminal, border) {
	border = (border != null) ? border: 0;
	if (terminal != null) {
		border += parseFloat(terminal.style[mxConstants.STYLE_PERIMETER_SPACING] || 0);
	}
	return terminal.getPerimeterBounds(border * this.scale);
};
mxGraphView.prototype.getPerimeterFunction = function(state) {
	var perimeter = state.style[mxConstants.STYLE_PERIMETER];
	if (typeof(perimeter) == "string") {
		var tmp = mxStyleRegistry.getValue(perimeter);
		if (tmp == null && this.isAllowEval()) {
			tmp = mxUtils.eval(perimeter);
		}
		perimeter = tmp;
	}
	if (typeof(perimeter) == "function") {
		return perimeter;
	}
	return null;
};
mxGraphView.prototype.getNextPoint = function(edge, opposite, source) {
	var pts = edge.absolutePoints;
	var point = null;
	if (pts != null && (source || pts.length > 2 || opposite == null)) {
		var count = pts.length;
		point = pts[(source) ? Math.min(1, count - 1) : Math.max(0, count - 2)];
	}
	if (point == null && opposite != null) {
		point = new mxPoint(opposite.getCenterX(), opposite.getCenterY());
	}
	return point;
};
mxGraphView.prototype.getVisibleTerminal = function(edge, source) {
	var model = this.graph.getModel();
	var result = model.getTerminal(edge, source);
	var best = result;
	while (result != null && result != this.currentRoot) {
		if (!this.graph.isCellVisible(best) || this.graph.isCellCollapsed(result)) {
			best = result;
		}
		result = model.getParent(result);
	}
	if (model.getParent(best) == model.getRoot()) {
		best = null;
	}
	return best;
};
mxGraphView.prototype.updateEdgeBounds = function(state) {
	var points = state.absolutePoints;
	state.length = 0;
	if (points != null && points.length > 0) {
		var p0 = points[0];
		var pe = points[points.length - 1];
		if (p0 == null || pe == null) {
			this.clear(state.cell, true);
		} else {
			if (p0.x != pe.x || p0.y != pe.y) {
				var dx = pe.x - p0.x;
				var dy = pe.y - p0.y;
				state.terminalDistance = Math.sqrt(dx * dx + dy * dy);
			} else {
				state.terminalDistance = 0;
			}
			var length = 0;
			var segments = [];
			var pt = p0;
			if (pt != null) {
				var minX = pt.x;
				var minY = pt.y;
				var maxX = minX;
				var maxY = minY;
				for (var i = 1; i < points.length; i++) {
					var tmp = points[i];
					if (tmp != null) {
						var dx = pt.x - tmp.x;
						var dy = pt.y - tmp.y;
						var segment = Math.sqrt(dx * dx + dy * dy);
						segments.push(segment);
						length += segment;
						pt = tmp;
						minX = Math.min(pt.x, minX);
						minY = Math.min(pt.y, minY);
						maxX = Math.max(pt.x, maxX);
						maxY = Math.max(pt.y, maxY);
					}
				}
				state.length = length;
				state.segments = segments;
				var markerSize = 1;
				state.x = minX;
				state.y = minY;
				state.width = Math.max(markerSize, maxX - minX);
				state.height = Math.max(markerSize, maxY - minY);
			}
		}
	}
};
mxGraphView.prototype.getPoint = function(state, geometry) {
	var x = state.getCenterX();
	var y = state.getCenterY();
	if (state.segments != null && (geometry == null || geometry.relative)) {
		var gx = (geometry != null) ? geometry.x / 2 : 0;
		var pointCount = state.absolutePoints.length;
		var dist = (gx + 0.5) * state.length;
		var segment = state.segments[0];
		var length = 0;
		var index = 1;
		while (dist > length + segment && index < pointCount - 1) {
			length += segment;
			segment = state.segments[index++];
		}
		if (segment != 0) {
			var factor = (dist - length) / segment;
			var p0 = state.absolutePoints[index - 1];
			var pe = state.absolutePoints[index];
			if (p0 != null && pe != null) {
				var gy = 0;
				var offsetX = 0;
				var offsetY = 0;
				if (geometry != null) {
					gy = geometry.y;
					var offset = geometry.offset;
					if (offset != null) {
						offsetX = offset.x;
						offsetY = offset.y;
					}
				}
				var dx = pe.x - p0.x;
				var dy = pe.y - p0.y;
				var nx = dy / segment;
				var ny = dx / segment;
				x = p0.x + dx * factor + (nx * gy + offsetX) * this.scale;
				y = p0.y + dy * factor - (ny * gy - offsetY) * this.scale;
			}
		}
	} else if (geometry != null) {
		var offset = geometry.offset;
		if (offset != null) {
			x += offset.x;
			y += offset.y;
		}
	}
	return new mxPoint(x, y);
};
mxGraphView.prototype.getRelativePoint = function(edgeState, x, y) {
	var model = this.graph.getModel();
	var geometry = model.getGeometry(edgeState.cell);
	if (geometry != null) {
		var pointCount = edgeState.absolutePoints.length;
		if (geometry.relative && pointCount > 1) {
			var totalLength = edgeState.length;
			var segments = edgeState.segments;
			var p0 = edgeState.absolutePoints[0];
			var pe = edgeState.absolutePoints[1];
			var minDist = mxUtils.ptSegDistSq(p0.x, p0.y, pe.x, pe.y, x, y);
			var index = 0;
			var tmp = 0;
			var length = 0;
			for (var i = 2; i < pointCount; i++) {
				tmp += segments[i - 2];
				pe = edgeState.absolutePoints[i];
				var dist = mxUtils.ptSegDistSq(p0.x, p0.y, pe.x, pe.y, x, y);
				if (dist <= minDist) {
					minDist = dist;
					index = i - 1;
					length = tmp;
				}
				p0 = pe;
			}
			var seg = segments[index];
			p0 = edgeState.absolutePoints[index];
			pe = edgeState.absolutePoints[index + 1];
			var x2 = p0.x;
			var y2 = p0.y;
			var x1 = pe.x;
			var y1 = pe.y;
			var px = x;
			var py = y;
			var xSegment = x2 - x1;
			var ySegment = y2 - y1;
			px -= x1;
			py -= y1;
			var projlenSq = 0;
			px = xSegment - px;
			py = ySegment - py;
			var dotprod = px * xSegment + py * ySegment;
			if (dotprod <= 0.0) {
				projlenSq = 0;
			} else {
				projlenSq = dotprod * dotprod / (xSegment * xSegment + ySegment * ySegment);
			}
			var projlen = Math.sqrt(projlenSq);
			if (projlen > seg) {
				projlen = seg;
			}
			var yDistance = Math.sqrt(mxUtils.ptSegDistSq(p0.x, p0.y, pe.x, pe.y, x, y));
			var direction = mxUtils.relativeCcw(p0.x, p0.y, pe.x, pe.y, x, y);
			if (direction == -1) {
				yDistance = -yDistance;
			}
			return new mxPoint(((totalLength / 2 - length - projlen) / totalLength) * -2, yDistance / this.scale);
		}
	}
	return new mxPoint();
};
mxGraphView.prototype.updateEdgeLabelOffset = function(state) {
	var points = state.absolutePoints;
	state.absoluteOffset.x = state.getCenterX();
	state.absoluteOffset.y = state.getCenterY();
	if (points != null && points.length > 0 && state.segments != null) {
		var geometry = this.graph.getCellGeometry(state.cell);
		if (geometry.relative) {
			var offset = this.getPoint(state, geometry);
			if (offset != null) {
				state.absoluteOffset = offset;
			}
		} else {
			var p0 = points[0];
			var pe = points[points.length - 1];
			if (p0 != null && pe != null) {
				var dx = pe.x - p0.x;
				var dy = pe.y - p0.y;
				var x0 = 0;
				var y0 = 0;
				var off = geometry.offset;
				if (off != null) {
					x0 = off.x;
					y0 = off.y;
				}
				var x = p0.x + dx / 2 + x0 * this.scale;
				var y = p0.y + dy / 2 + y0 * this.scale;
				state.absoluteOffset.x = x;
				state.absoluteOffset.y = y;
			}
		}
	}
};
mxGraphView.prototype.getState = function(cell, create) {
	create = create || false;
	var state = null;
	if (cell != null) {
		state = this.states.get(cell);
		if (this.graph.isCellVisible(cell)) {
			if (state == null && create && this.graph.isCellVisible(cell)) {
				state = this.createState(cell);
				this.states.put(cell, state);
			} else if (create && state != null && this.updateStyle) {
				state.style = this.graph.getCellStyle(cell);
			}
		}
	}
	return state;
};
mxGraphView.prototype.isRendering = function() {
	return this.rendering;
};
mxGraphView.prototype.setRendering = function(value) {
	this.rendering = value;
};
mxGraphView.prototype.isAllowEval = function() {
	return this.allowEval;
};
mxGraphView.prototype.setAllowEval = function(value) {
	this.allowEval = value;
};
mxGraphView.prototype.getStates = function() {
	return this.states;
};
mxGraphView.prototype.setStates = function(value) {
	this.states = value;
};
mxGraphView.prototype.getCellStates = function(cells) {
	if (cells == null) {
		return this.states;
	} else {
		var result = [];
		for (var i = 0; i < cells.length; i++) {
			var state = this.getState(cells[i]);
			if (state != null) {
				result.push(state);
			}
		}
		return result;
	}
};
mxGraphView.prototype.removeState = function(cell) {
	var state = null;
	if (cell != null) {
		state = this.states.remove(cell);
		if (state != null) {
			this.graph.cellRenderer.destroy(state);
			state.destroy();
		}
	}
	return state;
};
mxGraphView.prototype.createState = function(cell) {
	var style = this.graph.getCellStyle(cell);
	var state = new mxCellState(this, cell, style);
	if (this.isRendering()) {
		this.graph.cellRenderer.initialize(state);
	}
	return state;
};
mxGraphView.prototype.getCanvas = function() {
	return this.canvas;
};
mxGraphView.prototype.getBackgroundPane = function() {
	return this.backgroundPane;
};
mxGraphView.prototype.getDrawPane = function() {
	return this.drawPane;
};
mxGraphView.prototype.getOverlayPane = function() {
	return this.overlayPane;
};
mxGraphView.prototype.isContainerEvent = function(evt) {
	var source = mxEvent.getSource(evt);
	return (source == this.graph.container || source.parentNode == this.backgroundPane || (source.parentNode != null && source.parentNode.parentNode == this.backgroundPane) || source == this.canvas.parentNode || source == this.canvas || source == this.backgroundPane || source == this.drawPane || source == this.overlayPane);
};
mxGraphView.prototype.isScrollEvent = function(evt) {
	var offset = mxUtils.getOffset(this.graph.container);
	var pt = new mxPoint(evt.clientX - offset.x, evt.clientY - offset.y);
	var outWidth = this.graph.container.offsetWidth;
	var inWidth = this.graph.container.clientWidth;
	if (outWidth > inWidth && pt.x > inWidth + 2 && pt.x <= outWidth) {
		return true;
	}
	var outHeight = this.graph.container.offsetHeight;
	var inHeight = this.graph.container.clientHeight;
	if (outHeight > inHeight && pt.y > inHeight + 2 && pt.y <= outHeight) {
		return true;
	}
	return false;
};
mxGraphView.prototype.init = function() {
	this.installListeners();
	var graph = this.graph;
	if (graph.dialect == mxConstants.DIALECT_SVG) {
		this.createSvg();
	} else if (graph.dialect == mxConstants.DIALECT_VML) {
		this.createVml();
	} else {
		this.createHtml();
	}
};
mxGraphView.prototype.installListeners = function() {
	var graph = this.graph;
	var container = graph.container;
	if (container != null) {
		var md = (mxClient.IS_TOUCH) ? 'touchstart': 'mousedown';
		var mm = (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove';
		var mu = (mxClient.IS_TOUCH) ? 'touchend': 'mouseup';
		mxEvent.addListener(container, md, mxUtils.bind(this,
		function(evt) {
			if (this.isContainerEvent(evt) && ((!true && !false && !false && !false) || !this.isScrollEvent(evt))) {
				graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt));
			}
		}));
		mxEvent.addListener(container, mm, mxUtils.bind(this,
		function(evt) {
			if (this.isContainerEvent(evt)) {
				graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt));
			}
		}));
		mxEvent.addListener(container, mu, mxUtils.bind(this,
		function(evt) {
			if (this.isContainerEvent(evt)) {
				graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt));
			}
		}));
		mxEvent.addListener(container, 'dblclick', mxUtils.bind(this,
		function(evt) {
			graph.dblClick(evt);
		}));
		mxEvent.addListener(document, md, mxUtils.bind(this,
		function(evt) {
			if (this.isContainerEvent(evt)) {
				graph.panningHandler.hideMenu();
			}
		}));
		mxEvent.addListener(document, mm, mxUtils.bind(this,
		function(evt) {
			if (graph.tooltipHandler != null && graph.tooltipHandler.isHideOnHover()) {
				graph.tooltipHandler.hide();
			}
			if (this.captureDocumentGesture && graph.isMouseDown && !mxEvent.isConsumed(evt)) {
				graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt));
			}
		}));
		mxEvent.addListener(document, mu, mxUtils.bind(this,
		function(evt) {
			if (this.captureDocumentGesture) {
				graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt));
			}
		}));
	}
};
mxGraphView.prototype.createHtml = function() {
	var container = this.graph.container;
	if (container != null) {
		this.canvas = this.createHtmlPane();
		this.backgroundPane = this.createHtmlPane(1, 1);
		this.drawPane = this.createHtmlPane(1, 1);
		this.overlayPane = this.createHtmlPane(1, 1);
		this.canvas.appendChild(this.backgroundPane);
		this.canvas.appendChild(this.drawPane);
		this.canvas.appendChild(this.overlayPane);
		container.appendChild(this.canvas);
	}
};
mxGraphView.prototype.createHtmlPane = function(width, height) {
	var pane = document.createElement('DIV');
	if (width != null && height != null) {
		pane.style.position = 'absolute';
		pane.style.left = '0px';
		pane.style.top = '0px';
		pane.style.width = width + 'px';
		pane.style.height = height + 'px';
	} else {
		pane.style.position = 'relative';
	}
	return pane;
};
mxGraphView.prototype.createVml = function() {
	var container = this.graph.container;
	if (container != null) {
		var width = container.offsetWidth;
		var height = container.offsetHeight;
		this.canvas = this.createVmlPane(width, height);
		this.backgroundPane = this.createVmlPane(width, height);
		this.drawPane = this.createVmlPane(width, height);
		this.overlayPane = this.createVmlPane(width, height);
		this.canvas.appendChild(this.backgroundPane);
		this.canvas.appendChild(this.drawPane);
		this.canvas.appendChild(this.overlayPane);
		container.appendChild(this.canvas);
	}
};
mxGraphView.prototype.createVmlPane = function(width, height) {
	var pane = document.createElement('v:group');
	pane.style.position = 'absolute';
	pane.style.left = '0px';
	pane.style.top = '0px';
	pane.style.width = width + 'px';
	pane.style.height = height + 'px';
	pane.setAttribute('coordsize', width + ',' + height);
	pane.setAttribute('coordorigin', '0,0');
	return pane;
};
mxGraphView.prototype.createSvg = function() {
	var container = this.graph.container;
	this.canvas = document.createElementNS(mxConstants.NS_SVG, 'g');
	this.backgroundPane = document.createElementNS(mxConstants.NS_SVG, 'g');
	this.canvas.appendChild(this.backgroundPane);
	this.drawPane = document.createElementNS(mxConstants.NS_SVG, 'g');
	this.canvas.appendChild(this.drawPane);
	this.overlayPane = document.createElementNS(mxConstants.NS_SVG, 'g');
	this.canvas.appendChild(this.overlayPane);
	var root = document.createElementNS(mxConstants.NS_SVG, 'svg');
	var onResize = mxUtils.bind(this,
	function(evt) {
		if (this.graph.container != null) {
			var width = this.graph.container.offsetWidth;
			var height = this.graph.container.offsetHeight;
			var bounds = this.getGraphBounds();
			root.setAttribute('width', Math.max(width, bounds.width));
			root.setAttribute('height', Math.max(height, bounds.height));
		}
	});
	mxEvent.addListener(window, 'resize', onResize);
	if (false) {
		onResize();
	}
	root.appendChild(this.canvas);
	if (container != null) {
		container.appendChild(root);
		var style = mxUtils.getCurrentStyle(container);
		if (style.position == 'static') {
			container.style.position = 'relative';
		}
	}
};
mxGraphView.prototype.destroy = function() {
	var root = (this.canvas != null) ? this.canvas.ownerSVGElement: null;
	if (root == null) {
		root = this.canvas;
	}
	if (root != null && root.parentNode != null) {
		this.clear(this.currentRoot, true);
		mxEvent.removeAllListeners(document);
		mxEvent.release(this.graph.container);
		root.parentNode.removeChild(root);
		this.canvas = null;
		this.backgroundPane = null;
		this.drawPane = null;
		this.overlayPane = null;
	}
};
function mxCurrentRootChange(view, root) {
	this.view = view;
	this.root = root;
	this.previous = root;
	this.isUp = root == null;
	if (!this.isUp) {
		var tmp = this.view.currentRoot;
		var model = this.view.graph.getModel();
		while (tmp != null) {
			if (tmp == root) {
				this.isUp = true;
				break;
			}
			tmp = model.getParent(tmp);
		}
	}
};
mxCurrentRootChange.prototype.execute = function() {
	var tmp = this.view.currentRoot;
	this.view.currentRoot = this.previous;
	this.previous = tmp;
	var translate = this.view.graph.getTranslateForRoot(this.view.currentRoot);
	if (translate != null) {
		this.view.translate = new mxPoint( - translate.x, -translate.y);
	}
	var name = (this.isUp) ? mxEvent.UP: mxEvent.DOWN;
	this.view.fireEvent(new mxEventObject(name, 'root', this.view.currentRoot, 'previous', this.previous));
	if (this.isUp) {
		this.view.clear(this.view.currentRoot, true);
		this.view.validate();
	} else {
		this.view.refresh();
	}
	this.isUp = !this.isUp;
};
function mxGraph(container, model, renderHint) {
	this.renderHint = renderHint;
	if (false) {
		this.dialect = mxConstants.DIALECT_SVG;
	} else if (renderHint == mxConstants.RENDERING_HINT_EXACT && true) {
		this.dialect = mxConstants.DIALECT_VML;
	} else if (renderHint == mxConstants.RENDERING_HINT_FASTEST) {
		this.dialect = mxConstants.DIALECT_STRICTHTML;
	} else if (renderHint == mxConstants.RENDERING_HINT_FASTER) {
		this.dialect = mxConstants.DIALECT_PREFERHTML;
	} else {
		this.dialect = mxConstants.DIALECT_MIXEDHTML;
	}
	this.model = (model != null) ? model: new mxGraphModel();
	this.multiplicities = [];
	this.cellRenderer = this.createCellRenderer();
	this.setSelectionModel(this.createSelectionModel());
	this.setStylesheet(this.createStylesheet());
	this.view = this.createGraphView();
	this.model.addListener(mxEvent.CHANGE, mxUtils.bind(this,
	function(sender, evt) {
		this.graphModelChanged(evt.getProperty('changes'));
	}));
	this.createHandlers();
	if (container != null) {
		this.init(container);
	}
	this.view.revalidate();
};
mxResources.add(mxClient.basePath + '/resources/graph');
mxGraph.prototype = new mxEventSource();
mxGraph.prototype.constructor = mxGraph;
mxGraph.prototype.EMPTY_ARRAY = [];
mxGraph.prototype.mouseListeners = null;
mxGraph.prototype.isMouseDown = false;
mxGraph.prototype.model = null;
mxGraph.prototype.view = null;
mxGraph.prototype.stylesheet = null;
mxGraph.prototype.selectionModel = null;
mxGraph.prototype.cellEditor = null;
mxGraph.prototype.cellRenderer = null;
mxGraph.prototype.multiplicities = null;
mxGraph.prototype.renderHint = null;
mxGraph.prototype.dialect = null;
mxGraph.prototype.gridSize = 10;
mxGraph.prototype.gridEnabled = true;
mxGraph.prototype.tolerance = 4;
mxGraph.prototype.defaultOverlap = 0.5;
mxGraph.prototype.defaultParent = null;
mxGraph.prototype.alternateEdgeStyle = null;
mxGraph.prototype.backgroundImage = null;
mxGraph.prototype.pageVisible = false;
mxGraph.prototype.pageBreaksVisible = false;
mxGraph.prototype.pageBreakColor = 'gray';
mxGraph.prototype.pageBreakDashed = true;
mxGraph.prototype.minPageBreakDist = 20;
mxGraph.prototype.preferPageSize = false;
mxGraph.prototype.pageFormat = mxConstants.PAGE_FORMAT_A4_PORTRAIT;
mxGraph.prototype.pageScale = 1.5;
mxGraph.prototype.enabled = true;
mxGraph.prototype.escapeEnabled = true;
mxGraph.prototype.invokesStopCellEditing = true;
mxGraph.prototype.enterStopsCellEditing = false;
mxGraph.prototype.useScrollbarsForPanning = true;
mxGraph.prototype.exportEnabled = true;
mxGraph.prototype.importEnabled = true;
mxGraph.prototype.cellsLocked = false;
mxGraph.prototype.cellsCloneable = true;
mxGraph.prototype.foldingEnabled = true;
mxGraph.prototype.cellsEditable = true;
mxGraph.prototype.cellsDeletable = true;
mxGraph.prototype.cellsMovable = true;
mxGraph.prototype.edgeLabelsMovable = true;
mxGraph.prototype.vertexLabelsMovable = false;
mxGraph.prototype.dropEnabled = false;
mxGraph.prototype.splitEnabled = true;
mxGraph.prototype.cellsResizable = true;
mxGraph.prototype.cellsBendable = true;
mxGraph.prototype.cellsSelectable = true;
mxGraph.prototype.cellsDisconnectable = true;
mxGraph.prototype.autoSizeCells = false;
mxGraph.prototype.autoScroll = true;
mxGraph.prototype.autoExtend = true;
mxGraph.prototype.maximumGraphBounds = null;
mxGraph.prototype.minimumGraphSize = null;
mxGraph.prototype.minimumContainerSize = null;
mxGraph.prototype.maximumContainerSize = null;
mxGraph.prototype.resizeContainer = false;
mxGraph.prototype.border = 0;
mxGraph.prototype.ordered = true;
mxGraph.prototype.keepEdgesInForeground = false;
mxGraph.prototype.keepEdgesInBackground = true;
mxGraph.prototype.allowNegativeCoordinates = true;
mxGraph.prototype.constrainChildren = true;
mxGraph.prototype.extendParents = true;
mxGraph.prototype.extendParentsOnAdd = true;
mxGraph.prototype.collapseToPreferredSize = true;
mxGraph.prototype.zoomFactor = 1.2;
mxGraph.prototype.keepSelectionVisibleOnZoom = false;
mxGraph.prototype.centerZoom = true;
mxGraph.prototype.resetViewOnRootChange = true;
mxGraph.prototype.resetEdgesOnResize = false;
mxGraph.prototype.resetEdgesOnMove = false;
mxGraph.prototype.resetEdgesOnConnect = true;
mxGraph.prototype.allowLoops = false;
mxGraph.prototype.defaultLoopStyle = mxEdgeStyle.Loop;
mxGraph.prototype.multigraph = true;
mxGraph.prototype.connectableEdges = false;
mxGraph.prototype.allowDanglingEdges = true;
mxGraph.prototype.cloneInvalidEdges = false;
mxGraph.prototype.disconnectOnMove = true;
mxGraph.prototype.labelsVisible = true;
mxGraph.prototype.htmlLabels = false;
mxGraph.prototype.swimlaneSelectionEnabled = true;
mxGraph.prototype.swimlaneNesting = true;
mxGraph.prototype.swimlaneIndicatorColorAttribute = mxConstants.STYLE_FILLCOLOR;
mxGraph.prototype.collapsedImage = new mxImage(mxClient.imageBasePath + '/collapsed.gif', 9, 9);
mxGraph.prototype.expandedImage = new mxImage(mxClient.imageBasePath + '/expanded.gif', 9, 9);
mxGraph.prototype.warningImage = new mxImage(mxClient.imageBasePath + '/warning' + ((mxClient.IS_MAC) ? '.png': '.gif'), 16, 16);
mxGraph.prototype.alreadyConnectedResource = (mxClient.language != 'none') ? 'alreadyConnected': '';
mxGraph.prototype.containsValidationErrorsResource = (mxClient.language != 'none') ? 'containsValidationErrors': '';
mxGraph.prototype.collapseExpandResource = (mxClient.language != 'none') ? 'collapse-expand': '';
mxGraph.prototype.init = function(container) {
	this.container = container;
	this.cellEditor = this.createCellEditor();
	this.view.init();
	this.sizeDidChange();
	if (true) {
		mxEvent.addListener(window, 'unload', mxUtils.bind(this,
		function() {
			this.destroy();
		}));
		mxEvent.addListener(container, 'selectstart', mxUtils.bind(this,
		function() {
			return this.isEditing();
		}));
	}
};
mxGraph.prototype.createHandlers = function(container) {
	this.tooltipHandler = new mxTooltipHandler(this);
	this.tooltipHandler.setEnabled(false);
	this.panningHandler = new mxPanningHandler(this);
	this.panningHandler.panningEnabled = false;
	this.selectionCellsHandler = new mxSelectionCellsHandler(this);
	this.connectionHandler = new mxConnectionHandler(this);
	this.connectionHandler.setEnabled(false);
	this.graphHandler = new mxGraphHandler(this);
};
mxGraph.prototype.createSelectionModel = function() {
	return new mxGraphSelectionModel(this);
};
mxGraph.prototype.createStylesheet = function() {
	return new mxStylesheet();
};
mxGraph.prototype.createGraphView = function() {
	return new mxGraphView(this);
};
mxGraph.prototype.createCellRenderer = function() {
	return new mxCellRenderer();
};
mxGraph.prototype.createCellEditor = function() {
	return new mxCellEditor(this);
};
mxGraph.prototype.getModel = function() {
	return this.model;
};
mxGraph.prototype.getView = function() {
	return this.view;
};
mxGraph.prototype.getStylesheet = function() {
	return this.stylesheet;
};
mxGraph.prototype.setStylesheet = function(stylesheet) {
	this.stylesheet = stylesheet;
};
mxGraph.prototype.getSelectionModel = function() {
	return this.selectionModel;
};
mxGraph.prototype.setSelectionModel = function(selectionModel) {
	this.selectionModel = selectionModel;
};
mxGraph.prototype.getSelectionCellsForChanges = function(changes) {
	var cells = [];
	for (var i = 0; i < changes.length; i++) {
		var change = changes[i];
		if (change.constructor != mxRootChange) {
			var cell = null;
			if (change.constructor == mxChildChange && change.isAdded) {
				cell = change.child;
			} else if (change.cell != null && change.cell.constructor == mxCell) {
				cell = change.cell;
			}
			if (cell != null && mxUtils.indexOf(cells, cell) < 0) {
				cells.push(cell);
			}
		}
	}
	return this.getModel().getTopmostCells(cells);
};
mxGraph.prototype.graphModelChanged = function(changes) {
	for (var i = 0; i < changes.length; i++) {
		this.processChange(changes[i]);
	}
	this.removeSelectionCells(this.getRemovedCellsForChanges(changes));
	this.view.validate();
	this.sizeDidChange();
};
mxGraph.prototype.getRemovedCellsForChanges = function(changes) {
	var result = [];
	for (var i = 0; i < changes.length; i++) {
		var change = changes[i];
		if (change.constructor == mxRootChange) {
			break;
		} else if (change.constructor == mxChildChange) {
			if (!change.isAdded) {
				result = result.concat(this.model.getDescendants(change.child));
			}
		} else if (change.constructor == mxVisibleChange) {
			result = result.concat(this.model.getDescendants(change.cell));
		}
	}
	return result;
};
mxGraph.prototype.processChange = function(change) {
	if (change.constructor == mxRootChange) {
		this.clearSelection();
		this.removeStateForCell(change.previous);
		if (this.resetViewOnRootChange) {
			this.view.scale = 1;
			this.view.translate.x = 0;
			this.view.translate.y = 0;
		}
		this.fireEvent(new mxEventObject(mxEvent.ROOT));
	} else if (change.constructor == mxChildChange) {
		var newParent = this.model.getParent(change.child);
		if (newParent != null) {
			this.view.invalidate(change.child, true, false, true);
		} else {
			this.removeStateForCell(change.child);
		}
		if (newParent != change.previous) {
			if (newParent != null) {
				this.view.invalidate(newParent, false, false);
			}
			if (change.previous != null) {
				this.view.invalidate(change.previous, false, false);
			}
		}
	} else if (change.constructor == mxTerminalChange || change.constructor == mxGeometryChange) {
		this.view.invalidate(change.cell);
	} else if (change.constructor == mxValueChange) {
		this.view.invalidate(change.cell, false, false);
	} else if (change.constructor == mxStyleChange) {
		this.view.removeState(change.cell);
	} else if (change.cell != null && change.cell.constructor == mxCell) {
		this.removeStateForCell(change.cell);
	}
};
mxGraph.prototype.removeStateForCell = function(cell) {
	var childCount = this.model.getChildCount(cell);
	for (var i = 0; i < childCount; i++) {
		this.removeStateForCell(this.model.getChildAt(cell, i));
	}
	this.view.removeState(cell);
};
mxGraph.prototype.addCellOverlay = function(cell, overlay) {
	if (cell.overlays == null) {
		cell.overlays = [];
	}
	cell.overlays.push(overlay);
	var state = this.view.getState(cell);
	if (state != null) {
		this.cellRenderer.redraw(state);
	}
	this.fireEvent(new mxEventObject(mxEvent.ADD_OVERLAY, 'cell', cell, 'overlay', overlay));
	return overlay;
};
mxGraph.prototype.getCellOverlays = function(cell) {
	return cell.overlays;
};
mxGraph.prototype.removeCellOverlay = function(cell, overlay) {
	if (overlay == null) {
		this.removeCellOverlays(cell);
	} else {
		var index = mxUtils.indexOf(cell.overlays, overlay);
		if (index >= 0) {
			cell.overlays.splice(index, 1);
			if (cell.overlays.length == 0) {
				cell.overlays = null;
			}
			var state = this.view.getState(cell);
			if (state != null) {
				this.cellRenderer.redraw(state);
			}
			this.fireEvent(new mxEventObject(mxEvent.REMOVE_OVERLAY, 'cell', cell, 'overlay', overlay));
		} else {
			overlay = null;
		}
	}
	return overlay;
};
mxGraph.prototype.removeCellOverlays = function(cell) {
	var overlays = cell.overlays;
	if (overlays != null) {
		cell.overlays = null;
		var state = this.view.getState(cell);
		if (state != null) {
			this.cellRenderer.redraw(state);
		}
		for (var i = 0; i < overlays.length; i++) {
			this.fireEvent(new mxEventObject(mxEvent.REMOVE_OVERLAY, 'cell', cell, 'overlay', overlays[i]));
		}
	}
	return overlays;
};
mxGraph.prototype.clearCellOverlays = function(cell) {
	cell = (cell != null) ? cell: this.model.getRoot();
	this.removeCellOverlays(cell);
	var childCount = this.model.getChildCount(cell);
	for (var i = 0; i < childCount; i++) {
		var child = this.model.getChildAt(cell, i);
		this.clearCellOverlays(child);
	}
};
mxGraph.prototype.setCellWarning = function(cell, warning, img, isSelect) {
	if (warning != null && warning.length > 0) {
		img = (img != null) ? img: this.warningImage;
		var overlay = new mxCellOverlay(img, '<font color=red>' + warning + '</font>');
		if (isSelect) {
			overlay.addListener(mxEvent.CLICK, mxUtils.bind(this,
			function(sender, evt) {
				if (this.isEnabled()) {
					this.setSelectionCell(cell);
				}
			}));
		}
		return this.addCellOverlay(cell, overlay);
	} else {
		this.removeCellOverlays(cell);
	}
	return null;
};
mxGraph.prototype.startEditing = function(evt) {
	this.startEditingAtCell(null, evt);
};
mxGraph.prototype.startEditingAtCell = function(cell, evt) {
	if (cell == null) {
		cell = this.getSelectionCell();
		if (cell != null && !this.isCellEditable(cell)) {
			cell = null;
		}
	}
	if (cell != null) {
		this.fireEvent(new mxEventObject(mxEvent.START_EDITING, 'cell', cell, 'event', evt));
		this.cellEditor.startEditing(cell, evt);
	}
};
mxGraph.prototype.getEditingValue = function(cell, evt) {
	return this.convertValueToString(cell);
};
mxGraph.prototype.stopEditing = function(cancel) {
	this.cellEditor.stopEditing(cancel);
};
mxGraph.prototype.labelChanged = function(cell, value, evt) {
	this.model.beginUpdate();
	try {
		this.cellLabelChanged(cell, value, this.isAutoSizeCell(cell));
		this.fireEvent(new mxEventObject(mxEvent.LABEL_CHANGED, 'cell', cell, 'value', value, 'event', evt));
	} finally {
		this.model.endUpdate();
	}
	return cell;
};
mxGraph.prototype.cellLabelChanged = function(cell, value, autoSize) {
	this.model.beginUpdate();
	try {
		this.model.setValue(cell, value);
		if (autoSize) {
			this.cellSizeUpdated(cell, false);
		}
	} finally {
		this.model.endUpdate();
	}
};
mxGraph.prototype.escape = function(evt) {
	this.stopEditing(true);
	this.connectionHandler.reset();
	this.graphHandler.reset();
	var cells = this.getSelectionCells();
	for (var i = 0; i < cells.length; i++) {
		var state = this.view.getState(cells[i]);
		if (state != null && state.handler != null) {
			state.handler.reset();
		}
	}
};
mxGraph.prototype.click = function(me) {
	var evt = me.getEvent();
	var cell = me.getCell();
	var mxe = new mxEventObject(mxEvent.CLICK, 'event', evt, 'cell', cell);
	if (me.isConsumed()) {
		mxe.consume();
	}
	this.fireEvent(mxe);
	if (this.isEnabled() && !mxEvent.isConsumed(evt) && !mxe.isConsumed()) {
		if (cell != null) {
			this.selectCellForEvent(cell, evt);
		} else {
			var swimlane = null;
			if (this.isSwimlaneSelectionEnabled()) {
				var pt = mxUtils.convertPoint(this.container, evt.clientX, evt.clientY);
				swimlane = this.getSwimlaneAt(pt.x, pt.y);
			}
			if (swimlane != null) {
				this.selectCellForEvent(swimlane, evt);
			} else if (!this.isToggleEvent(evt)) {
				this.clearSelection();
			}
		}
	}
};
mxGraph.prototype.dblClick = function(evt, cell) {
	var mxe = new mxEventObject(mxEvent.DOUBLE_CLICK, 'event', evt, 'cell', cell);
	this.fireEvent(mxe);
	if (this.isEnabled() && !mxEvent.isConsumed(evt) && !mxe.isConsumed() && cell != null && this.isCellEditable(cell)) {
		this.startEditingAtCell(cell, evt);
	}
};
mxGraph.prototype.scrollPointToVisible = function(x, y, extend, border) {
	if (mxUtils.hasScrollbars(this.container)) {
		var c = this.container;
		border = (border != null) ? border: 20;
		if (x >= c.scrollLeft && y >= c.scrollTop && x <= c.scrollLeft + c.clientWidth && y <= c.scrollTop + c.clientHeight) {
			var dx = c.scrollLeft + c.clientWidth - x;
			if (dx < border) {
				var old = c.scrollLeft;
				c.scrollLeft += border - dx;
				if (extend && old == c.scrollLeft) {
					if (this.dialect == mxConstants.DIALECT_SVG) {
						var root = this.view.getDrawPane().ownerSVGElement;
						var width = parseInt(root.getAttribute('width')) + border - dx;
						root.setAttribute('width', width);
					} else {
						var width = Math.max(c.clientWidth, c.scrollWidth) + border - dx;
						var canvas = this.view.getCanvas();
						canvas.style.width = width + 'px';
					}
					c.scrollLeft += border - dx;
				}
			} else {
				dx = x - c.scrollLeft;
				if (dx < border) {
					c.scrollLeft -= border - dx;
				}
			}
			var dy = c.scrollTop + c.clientHeight - y;
			if (dy < border) {
				var old = c.scrollTop;
				c.scrollTop += border - dy;
				if (old == c.scrollTop && extend) {
					if (this.dialect == mxConstants.DIALECT_SVG) {
						var root = this.view.getDrawPane().ownerSVGElement;
						var height = parseInt(root.getAttribute('height')) + border - dy;
						root.setAttribute('height', height);
					} else {
						var height = Math.max(c.clientHeight, c.scrollHeight) + border - dy;
						var canvas = this.view.getCanvas();
						canvas.style.height = height + 'px';
					}
					c.scrollTop += border - dy;
				}
			} else {
				dy = y - c.scrollTop;
				if (dy < border) {
					c.scrollTop -= border - dy;
				}
			}
		}
	}
};
mxGraph.prototype.sizeDidChange = function() {
	var bounds = this.getGraphBounds();
	if (this.container != null) {
		var border = this.getBorder();
		var width = bounds.x + bounds.width + 1 + border;
		var height = bounds.y + bounds.height + 1 + border;
		if (this.minimumContainerSize != null) {
			width = Math.max(width, this.minimumContainerSize.width);
			height = Math.max(height, this.minimumContainerSize.height);
		}
		if (this.resizeContainer) {
			var w = width;
			var h = height;
			if (this.maximumContainerSize != null) {
				w = Math.min(this.maximumContainerSize.width, w);
				h = Math.min(this.maximumContainerSize.height, h);
			}
			this.container.style.width = w + 'px';
			this.container.style.height = h + 'px';
		}
		if (this.preferPageSize || (!true && this.pageVisible)) {
			var scale = this.view.scale;
			var tr = this.view.translate;
			var fmt = this.pageFormat;
			var ps = scale * this.pageScale;
			var page = new mxRectangle(scale * tr.x, scale * tr.y, fmt.width * ps, fmt.height * ps);
			var hCount = (this.pageBreaksVisible) ? Math.ceil(width / page.width) : 1;
			var vCount = (this.pageBreaksVisible) ? Math.ceil(height / page.height) : 1;
			width = hCount * page.width + 2;
			height = vCount * page.height + 2;
		}
		width = Math.max(width, this.container.offsetWidth);
		height = Math.max(height, this.container.offsetHeight);
		if (this.dialect == mxConstants.DIALECT_SVG) {
			var root = this.view.getDrawPane().ownerSVGElement;
			if (this.minimumGraphSize != null) {
				width = Math.max(width, this.minimumGraphSize.width * this.view.scale);
				height = Math.max(height, this.minimumGraphSize.height * this.view.scale);
			}
			root.setAttribute('width', width);
			root.setAttribute('height', height);
			if (width <= this.container.offsetWidth && this.container.clientWidth < this.container.offsetWidth) {
				var prevValue = this.container.style.overflow;
				this.container.style.overflow = 'hidden';
				this.container.scrollLeft = 1;
				this.container.style.overflow = prevValue;
			}
		} else {
			var drawPane = this.view.getDrawPane();
			var canvas = this.view.getCanvas();
			drawPane.style.width = width + 'px';
			drawPane.style.height = height + 'px';
			canvas.style.width = width + 'px';
			canvas.style.height = height + 'px';
			if (this.minimumGraphSize != null) {
				width = Math.max(width, this.minimumGraphSize.width * this.view.scale);
				height = Math.max(height, this.minimumGraphSize.height * this.view.scale);
				canvas.style.width = width + 'px';
				canvas.style.height = height + 'px';
			}
		}
		this.updatePageBreaks(this.pageBreaksVisible, width - 1, height - 1);
	}
	this.fireEvent(new mxEventObject(mxEvent.SIZE, 'bounds', bounds));
};
mxGraph.prototype.updatePageBreaks = function(visible, width, height) {
	var scale = this.view.scale;
	var tr = this.view.translate;
	var fmt = this.pageFormat;
	var ps = scale * this.pageScale;
	var bounds = new mxRectangle(scale * tr.x, scale * tr.y, fmt.width * ps, fmt.height * ps);
	visible = visible && Math.min(bounds.width, bounds.height) > this.minPageBreakDist;
	bounds.x = mxUtils.mod(bounds.x, bounds.width);
	bounds.y = mxUtils.mod(bounds.y, bounds.height);
	var horizontalCount = (visible) ? Math.ceil((width - bounds.x) / bounds.width) : 0;
	var verticalCount = (visible) ? Math.ceil((height - bounds.y) / bounds.height) : 0;
	var right = width;
	var bottom = height;
	if (this.horizontalPageBreaks == null && horizontalCount > 0) {
		this.horizontalPageBreaks = [];
	}
	if (this.horizontalPageBreaks != null) {
		for (var i = 0; i <= horizontalCount; i++) {
			var pts = [new mxPoint(bounds.x + i * bounds.width, 1), new mxPoint(bounds.x + i * bounds.width, bottom)];
			if (this.horizontalPageBreaks[i] != null) {
				this.horizontalPageBreaks[i].scale = scale;
				this.horizontalPageBreaks[i].points = pts;
				this.horizontalPageBreaks[i].redraw();
			} else {
				var pageBreak = new mxPolyline(pts, this.pageBreakColor, this.scale);
				pageBreak.dialect = this.dialect;
				pageBreak.isDashed = this.pageBreakDashed;
				pageBreak.scale = scale;
				pageBreak.crisp = true;
				pageBreak.init(this.view.backgroundPane);
				this.horizontalPageBreaks[i] = pageBreak;
			}
		}
		for (var i = horizontalCount; i < this.horizontalPageBreaks.length; i++) {
			this.horizontalPageBreaks[i].destroy();
		}
		this.horizontalPageBreaks.splice(horizontalCount, this.horizontalPageBreaks.length - horizontalCount);
	}
	if (this.verticalPageBreaks == null && verticalCount > 0) {
		this.verticalPageBreaks = [];
	}
	if (this.verticalPageBreaks != null) {
		for (var i = 0; i <= verticalCount; i++) {
			var pts = [new mxPoint(1, bounds.y + i * bounds.height), new mxPoint(right, bounds.y + i * bounds.height)];
			if (this.verticalPageBreaks[i] != null) {
				this.verticalPageBreaks[i].scale = scale;
				this.verticalPageBreaks[i].points = pts;
				this.verticalPageBreaks[i].redraw();
			} else {
				var pageBreak = new mxPolyline(pts, this.pageBreakColor, scale);
				pageBreak.dialect = this.dialect;
				pageBreak.isDashed = this.pageBreakDashed;
				pageBreak.scale = scale;
				pageBreak.crisp = true;
				pageBreak.init(this.view.backgroundPane);
				this.verticalPageBreaks[i] = pageBreak;
			}
		}
		for (var i = verticalCount; i < this.verticalPageBreaks.length; i++) {
			this.verticalPageBreaks[i].destroy();
		}
		this.verticalPageBreaks.splice(verticalCount, this.verticalPageBreaks.length - verticalCount);
	}
};
mxGraph.prototype.getCellStyle = function(cell) {
	var stylename = this.model.getStyle(cell);
	var style = null;
	if (this.model.isEdge(cell)) {
		style = this.stylesheet.getDefaultEdgeStyle();
	} else {
		style = this.stylesheet.getDefaultVertexStyle();
	}
	if (stylename != null) {
		style = this.stylesheet.getCellStyle(stylename, style);
	}
	if (style == null) {
		style = mxGraph.prototype.EMPTY_ARRAY;
	}
	return style;
};
mxGraph.prototype.setCellStyle = function(style, cells) {
	cells = cells || this.getSelectionCells();
	if (cells != null) {
		this.model.beginUpdate();
		try {
			for (var i = 0; i < cells.length; i++) {
				this.model.setStyle(cells[i], style);
			}
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.toggleCellStyle = function(key, defaultValue, cell) {
	cell = cell || this.getSelectionCell();
	this.toggleCellStyles(key, defaultValue, [cell]);
};
mxGraph.prototype.toggleCellStyles = function(key, defaultValue, cells) {
	defaultValue = (defaultValue != null) ? defaultValue: false;
	cells = cells || this.getSelectionCells();
	if (cells != null && cells.length > 0) {
		var state = this.view.getState(cells[0]);
		var style = (state != null) ? state.style: this.getCellStyle(cells[0]);
		if (style != null) {
			var val = (mxUtils.getValue(style, key, defaultValue)) ? 0 : 1;
			this.setCellStyles(key, val, cells);
		}
	}
};
mxGraph.prototype.setCellStyles = function(key, value, cells) {
	cells = cells || this.getSelectionCells();
	mxUtils.setCellStyles(this.model, cells, key, value);
};
mxGraph.prototype.toggleCellStyleFlags = function(key, flag, cells) {
	this.setCellStyleFlags(key, flag, null, cells);
};
mxGraph.prototype.setCellStyleFlags = function(key, flag, value, cells) {
	cells = cells || this.getSelectionCells();
	if (cells != null && cells.length > 0) {
		if (value == null) {
			var state = this.view.getState(cells[0]);
			var style = (state != null) ? state.style: this.getCellStyle(cells[0]);
			if (style != null) {
				var current = parseInt(style[key] || 0);
				value = !((current & flag) == flag);
			}
		}
		mxUtils.setCellStyleFlags(this.model, cells, key, flag, value);
	}
};
mxGraph.prototype.alignCells = function(align, cells, param) {
	if (cells == null) {
		cells = this.getSelectionCells();
	}
	if (cells != null && cells.length > 1) {
		if (param == null) {
			for (var i = 0; i < cells.length; i++) {
				var geo = this.getCellGeometry(cells[i]);
				if (geo != null && !this.model.isEdge(cells[i])) {
					if (param == null) {
						if (align == mxConstants.ALIGN_CENTER) {
							param = geo.x + geo.width / 2;
							break;
						} else if (align == mxConstants.ALIGN_RIGHT) {
							param = geo.x + geo.width;
						} else if (align == mxConstants.ALIGN_TOP) {
							param = geo.y;
						} else if (align == mxConstants.ALIGN_MIDDLE) {
							param = geo.y + geo.height / 2;
							break;
						} else if (align == mxConstants.ALIGN_BOTTOM) {
							param = geo.y + geo.height;
						} else {
							param = geo.x;
						}
					} else {
						if (align == mxConstants.ALIGN_RIGHT) {
							param = Math.max(param, geo.x + geo.width);
						} else if (align == mxConstants.ALIGN_TOP) {
							param = Math.min(param, geo.y);
						} else if (align == mxConstants.ALIGN_BOTTOM) {
							param = Math.max(param, geo.y + geo.height);
						} else {
							param = Math.min(param, geo.x);
						}
					}
				}
			}
		}
		this.model.beginUpdate();
		try {
			for (var i = 0; i < cells.length; i++) {
				var geo = this.getCellGeometry(cells[i]);
				if (geo != null && !this.model.isEdge(cells[i])) {
					geo = geo.clone();
					if (align == mxConstants.ALIGN_CENTER) {
						geo.x = param - geo.width / 2;
					} else if (align == mxConstants.ALIGN_RIGHT) {
						geo.x = param - geo.width;
					} else if (align == mxConstants.ALIGN_TOP) {
						geo.y = param;
					} else if (align == mxConstants.ALIGN_MIDDLE) {
						geo.y = param - geo.height / 2;
					} else if (align == mxConstants.ALIGN_BOTTOM) {
						geo.y = param - geo.height;
					} else {
						geo.x = param;
					}
					this.model.setGeometry(cells[i], geo);
				}
			}
			this.fireEvent(new mxEventObject(mxEvent.ALIGN_CELLS, 'align', align, 'cells', cells));
		} finally {
			this.model.endUpdate();
		}
	}
	return cells;
};
mxGraph.prototype.flipEdge = function(edge) {
	if (edge != null && this.alternateEdgeStyle != null) {
		this.model.beginUpdate();
		try {
			var style = this.model.getStyle(edge);
			if (style == null || style.length == 0) {
				this.model.setStyle(edge, this.alternateEdgeStyle);
			} else {
				this.model.setStyle(edge, null);
			}
			this.resetEdge(edge);
			this.fireEvent(new mxEventObject(mxEvent.FLIP_EDGE, 'edge', edge));
		} finally {
			this.model.endUpdate();
		}
	}
	return edge;
};
mxGraph.prototype.orderCells = function(back, cells) {
	if (cells == null) {
		cells = mxUtils.sortCells(this.getSelectionCells(), true);
	}
	this.model.beginUpdate();
	try {
		this.cellsOrdered(cells, back);
		this.fireEvent(new mxEventObject(mxEvent.ORDER_CELLS, 'back', back, 'cells', cells));
	} finally {
		this.model.endUpdate();
	}
	return cells;
};
mxGraph.prototype.cellsOrdered = function(cells, back) {
	if (cells != null) {
		this.model.beginUpdate();
		try {
			for (var i = 0; i < cells.length; i++) {
				var parent = this.model.getParent(cells[i]);
				if (back) {
					this.model.add(parent, cells[i], i);
				} else {
					this.model.add(parent, cells[i], this.model.getChildCount(parent) - 1);
				}
			}
			this.fireEvent(new mxEventObject(mxEvent.CELLS_ORDERED, 'back', back, 'cells', cells));
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.groupCells = function(group, border, cells) {
	if (cells == null) {
		cells = mxUtils.sortCells(this.getSelectionCells(), true);
	}
	cells = this.getCellsForGroup(cells);
	if (group == null) {
		group = this.createGroupCell(cells);
	}
	var bounds = this.getBoundsForGroup(group, cells, border);
	if (cells.length > 0 && bounds != null) {
		var parent = this.model.getParent(cells[0]);
		this.model.beginUpdate();
		try {
			if (this.getCellGeometry(group) == null) {
				this.model.setGeometry(group, new mxGeometry());
			}
			var index = this.model.getChildCount(group);
			this.cellsAdded(cells, group, index, null, null, false);
			this.cellsMoved(cells, -bounds.x, -bounds.y, false, true);
			index = this.model.getChildCount(parent);
			this.cellsAdded([group], parent, index, null, null, false);
			this.cellsResized([group], [bounds]);
			this.fireEvent(new mxEventObject(mxEvent.GROUP_CELLS, 'group', group, 'border', border, 'cells', cells));
		} finally {
			this.model.endUpdate();
		}
	}
	return group;
};
mxGraph.prototype.getCellsForGroup = function(cells) {
	var result = [];
	if (cells != null && cells.length > 0) {
		var parent = this.model.getParent(cells[0]);
		result.push(cells[0]);
		for (var i = 1; i < cells.length; i++) {
			if (this.model.getParent(cells[i]) == parent) {
				result.push(cells[i]);
			}
		}
	}
	return result;
};
mxGraph.prototype.getBoundsForGroup = function(group, children, border) {
	var result = this.getBoundingBoxFromGeometry(children);
	if (result != null) {
		if (this.isSwimlane(group)) {
			var size = this.getStartSize(group);
			result.x -= size.width;
			result.y -= size.height;
			result.width += size.width;
			result.height += size.height;
		}
		result.x -= border;
		result.y -= border;
		result.width += 2 * border;
		result.height += 2 * border;
	}
	return result;
};
mxGraph.prototype.createGroupCell = function(cells) {
	var group = new mxCell('');
	group.setVertex(true);
	group.setConnectable(false);
	return group;
};
mxGraph.prototype.ungroupCells = function(cells) {
	var result = [];
	if (cells == null) {
		cells = this.getSelectionCells();
		var tmp = [];
		for (var i = 0; i < cells.length; i++) {
			if (this.model.getChildCount(cells[i]) > 0) {
				tmp.push(cells[i]);
			}
		}
		cells = tmp;
	}
	if (cells != null && cells.length > 0) {
		this.model.beginUpdate();
		try {
			for (var i = 0; i < cells.length; i++) {
				var children = this.model.getChildren(cells[i]);
				if (children != null && children.length > 0) {
					children = children.slice();
					var parent = this.model.getParent(cells[i]);
					var index = this.model.getChildCount(parent);
					this.cellsAdded(children, parent, index, null, null, true);
					result = result.concat(children);
				}
			}
			this.cellsRemoved(this.addAllEdges(cells));
			this.fireEvent(new mxEventObject(mxEvent.UNGROUP_CELLS, 'cells', cells));
		} finally {
			this.model.endUpdate();
		}
	}
	return result;
};
mxGraph.prototype.removeCellsFromParent = function(cells) {
	if (cells == null) {
		cells = this.getSelectionCells();
	}
	this.model.beginUpdate();
	try {
		var parent = this.getDefaultParent();
		var index = this.model.getChildCount(parent);
		this.cellsAdded(cells, parent, index, null, null, true);
		this.fireEvent(new mxEventObject(mxEvent.REMOVE_CELLS_FROM_PARENT, 'cells', cells));
	} finally {
		this.model.endUpdate();
	}
	return cells;
};
mxGraph.prototype.updateGroupBounds = function(cells, border, moveGroup) {
	if (cells == null) {
		cells = this.getSelectionCells();
	}
	border = (border != null) ? border: 0;
	moveGroup = (moveGroup != null) ? moveGroup: false;
	this.model.beginUpdate();
	try {
		for (var i = 0; i < cells.length; i++) {
			var geo = this.getCellGeometry(cells[i]);
			if (geo != null) {
				var children = this.getChildCells(cells[i]);
				if (children != null && children.length > 0) {
					var childBounds = this.getBoundingBoxFromGeometry(children);
					if (childBounds.width > 0 && childBounds.height > 0) {
						var size = (this.isSwimlane(cells[i])) ? this.getStartSize(cells[i]) : new mxRectangle();
						geo = geo.clone();
						if (moveGroup) {
							geo.x += childBounds.x - size.width - border;
							geo.y += childBounds.y - size.height - border;
						}
						geo.width = childBounds.width + size.width + 2 * border;
						geo.height = childBounds.height + size.height + 2 * border;
						this.model.setGeometry(cells[i], geo);
						this.moveCells(children, -childBounds.x + size.width + border, -childBounds.y + size.height + border);
					}
				}
			}
		}
	} finally {
		this.model.endUpdate();
	}
	return cells;
};
mxGraph.prototype.cloneCells = function(cells, allowInvalidEdges) {
	allowInvalidEdges = (allowInvalidEdges != null) ? allowInvalidEdges: true;
	var clones = null;
	if (cells != null) {
		var hash = new Object();
		var tmp = [];
		for (var i = 0; i < cells.length; i++) {
			var id = mxCellPath.create(cells[i]);
			hash[id] = cells[i];
			tmp.push(cells[i]);
		}
		if (tmp.length > 0) {
			var scale = this.view.scale;
			var trans = this.view.translate;
			clones = this.model.cloneCells(cells, true);
			for (var i = 0; i < cells.length; i++) {
				if (!allowInvalidEdges && this.model.isEdge(clones[i]) && this.getEdgeValidationError(clones[i], this.model.getTerminal(clones[i], true), this.model.getTerminal(clones[i], false)) != null) {
					clones[i] = null;
				} else {
					var g = this.model.getGeometry(clones[i]);
					if (g != null) {
						var state = this.view.getState(cells[i]);
						var pstate = this.view.getState(this.model.getParent(cells[i]));
						if (state != null && pstate != null) {
							var dx = pstate.origin.x;
							var dy = pstate.origin.y;
							if (this.model.isEdge(clones[i])) {
								var pts = state.absolutePoints;
								var src = this.model.getTerminal(cells[i], true);
								var srcId = mxCellPath.create(src);
								while (src != null && hash[srcId] == null) {
									src = this.model.getParent(src);
									srcId = mxCellPath.create(src);
								}
								if (src == null) {
									g.setTerminalPoint(new mxPoint(pts[0].x / scale - trans.x, pts[0].y / scale - trans.y), true);
								}
								var trg = this.model.getTerminal(cells[i], false);
								var trgId = mxCellPath.create(trg);
								while (trg != null && hash[trgId] == null) {
									trg = this.model.getParent(trg);
									trgId = mxCellPath.create(trg);
								}
								if (trg == null) {
									var n = pts.length - 1;
									g.setTerminalPoint(new mxPoint(pts[n].x / scale - trans.x, pts[n].y / scale - trans.y), false);
								}
								var points = g.points;
								if (points != null) {
									for (var j = 0; j < points.length; j++) {
										points[j].x += dx;
										points[j].y += dy;
									}
								}
							} else {
								g.x += dx;
								g.y += dy;
							}
						}
					}
				}
			}
		} else {
			clones = [];
		}
	}
	return clones;
};
mxGraph.prototype.insertVertex = function(parent, id, value, x, y, width, height, style) {
	var vertex = this.createVertex(parent, id, value, x, y, width, height, style);
	return this.addCell(vertex, parent);
};
mxGraph.prototype.createVertex = function(parent, id, value, x, y, width, height, style) {
	var geometry = new mxGeometry(x, y, width, height);
	var vertex = new mxCell(value, geometry, style);
	vertex.setId(id);
	vertex.setVertex(true);
	vertex.setConnectable(true);
	return vertex;
};
mxGraph.prototype.insertEdge = function(parent, id, value, source, target, style) {
	var edge = this.createEdge(parent, id, value, source, target, style);
	return this.addEdge(edge, parent, source, target);
};
mxGraph.prototype.createEdge = function(parent, id, value, source, target, style) {
	var edge = new mxCell(value, new mxGeometry(), style);
	edge.setId(id);
	edge.setEdge(true);
	edge.geometry.relative = true;
	return edge;
};
mxGraph.prototype.addEdge = function(edge, parent, source, target, index) {
	return this.addCell(edge, parent, index, source, target);
};
mxGraph.prototype.addCell = function(cell, parent, index, source, target) {
	return this.addCells([cell], parent, index, source, target)[0];
};
mxGraph.prototype.addCells = function(cells, parent, index, source, target) {
	if (parent == null) {
		parent = this.getDefaultParent();
	}
	if (index == null) {
		index = this.model.getChildCount(parent);
	}
	this.model.beginUpdate();
	try {
		this.cellsAdded(cells, parent, index, source, target, false);
		this.fireEvent(new mxEventObject(mxEvent.ADD_CELLS, 'cells', cells, 'parent', parent, 'index', index, 'source', source, 'target', target));
	} finally {
		this.model.endUpdate();
	}
	return cells;
};
mxGraph.prototype.cellsAdded = function(cells, parent, index, source, target, absolute) {
	if (cells != null && parent != null && index != null) {
		this.model.beginUpdate();
		try {
			var parentState = (absolute) ? this.view.getState(parent) : null;
			var o1 = (parentState != null) ? parentState.origin: null;
			var zero = new mxPoint(0, 0);
			for (var i = 0; i < cells.length; i++) {
				var previous = this.model.getParent(cells[i]);
				if (o1 != null && cells[i] != parent && parent != previous) {
					var oldState = this.view.getState(previous);
					var o2 = (oldState != null) ? oldState.origin: zero;
					var geo = this.model.getGeometry(cells[i]);
					if (geo != null) {
						var dx = o2.x - o1.x;
						var dy = o2.y - o1.y;
						geo = geo.clone();
						geo.translate(dx, dy);
						if (!geo.relative && this.model.isVertex(cells[i]) && !this.isAllowNegativeCoordinates()) {
							geo.x = Math.max(0, geo.x);
							geo.y = Math.max(0, geo.y);
						}
						this.model.setGeometry(cells[i], geo);
					}
				}
				if (parent == previous) {
					index--;
				}
				this.model.add(parent, cells[i], index + i);
				if (this.isExtendParentsOnAdd() && this.isExtendParent(cells[i])) {
					this.extendParent(cells[i]);
				}
				this.constrainChild(cells[i]);
				if (source != null) {
					this.cellConnected(cells[i], source, true);
				}
				if (target != null) {
					this.cellConnected(cells[i], target, false);
				}
			}
			this.fireEvent(new mxEventObject(mxEvent.CELLS_ADDED, 'cells', cells, 'parent', parent, 'index', index, 'source', source, 'target', target, 'absolute', absolute));
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.removeCells = function(cells, includeEdges) {
	includeEdges = (includeEdges != null) ? includeEdges: true;
	if (cells == null) {
		cells = this.getDeletableCells(this.getSelectionCells());
	}
	if (includeEdges) {
		cells = this.getDeletableCells(this.addAllEdges(cells));
	}
	this.model.beginUpdate();
	try {
		this.cellsRemoved(cells);
		this.fireEvent(new mxEventObject(mxEvent.REMOVE_CELLS, 'cells', cells, 'includeEdges', includeEdges));
	} finally {
		this.model.endUpdate();
	}
	return cells;
};
mxGraph.prototype.cellsRemoved = function(cells) {
	if (cells != null && cells.length > 0) {
		var scale = this.view.scale;
		var tr = this.view.translate;
		this.model.beginUpdate();
		try {
			var hash = new Object();
			for (var i = 0; i < cells.length; i++) {
				var id = mxCellPath.create(cells[i]);
				hash[id] = cells[i];
			}
			for (var i = 0; i < cells.length; i++) {
				var edges = this.getConnections(cells[i]);
				for (var j = 0; j < edges.length; j++) {
					var id = mxCellPath.create(edges[j]);
					if (hash[id] == null) {
						var geo = this.model.getGeometry(edges[j]);
						if (geo != null) {
							var state = this.view.getState(edges[j]);
							if (state != null) {
								geo = geo.clone();
								var source = this.view.getVisibleTerminal(edges[j], true) == cells[i];
								var pts = state.absolutePoints;
								var n = (source) ? 0 : pts.length - 1;
								geo.setTerminalPoint(new mxPoint(pts[n].x / scale - tr.x, pts[n].y / scale - tr.y), source);
								this.model.setTerminal(edges[j], null, source);
								this.model.setGeometry(edges[j], geo);
							}
						}
					}
				}
				this.model.remove(cells[i]);
			}
			this.fireEvent(new mxEventObject(mxEvent.CELLS_REMOVED, 'cells', cells));
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.splitEdge = function(edge, cells, newEdge, dx, dy) {
	dx = dx || 0;
	dy = dy || 0;
	if (newEdge == null) {
		newEdge = this.cloneCells([edge])[0];
	}
	var parent = this.model.getParent(edge);
	var source = this.model.getTerminal(edge, true);
	this.model.beginUpdate();
	try {
		this.cellsMoved(cells, dx, dy, false, false);
		this.cellsAdded(cells, parent, this.model.getChildCount(parent), null, null, true);
		this.cellsAdded([newEdge], parent, this.model.getChildCount(parent), source, cells[0], false);
		this.cellConnected(edge, cells[0], true);
		this.fireEvent(new mxEventObject(mxEvent.SPLIT_EDGE, 'edge', edge, 'cells', cells, 'newEdge', newEdge, 'dx', dx, 'dy', dy));
	} finally {
		this.model.endUpdate();
	}
	return newEdge;
};
mxGraph.prototype.toggleCells = function(show, cells, includeEdges) {
	if (cells == null) {
		cells = this.getSelectionCells();
	}
	if (includeEdges) {
		cells = this.addAllEdges(cells);
	}
	this.model.beginUpdate();
	try {
		this.cellsToggled(cells, show);
		this.fireEvent(new mxEventObject(mxEvent.TOGGLE_CELLS, 'show', show, 'cells', cells, 'includeEdges', includeEdges));
	} finally {
		this.model.endUpdate();
	}
	return cells;
};
mxGraph.prototype.cellsToggled = function(cells, show) {
	if (cells != null && cells.length > 0) {
		this.model.beginUpdate();
		try {
			for (var i = 0; i < cells.length; i++) {
				this.model.setVisible(cells[i], show);
			}
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.foldCells = function(collapse, recurse, cells) {
	recurse = (recurse != null) ? recurse: false;
	if (cells == null) {
		cells = this.getFoldableCells(this.getSelectionCells(), collapse);
	}
	this.stopEditing(false);
	this.model.beginUpdate();
	try {
		this.cellsFolded(cells, collapse, recurse);
		this.fireEvent(new mxEventObject(mxEvent.FOLD_CELLS, 'collapse', collapse, 'recurse', recurse, 'cells', cells));
	} finally {
		this.model.endUpdate();
	}
	return cells;
};
mxGraph.prototype.cellsFolded = function(cells, collapse, recurse) {
	if (cells != null && cells.length > 0) {
		this.model.beginUpdate();
		try {
			for (var i = 0; i < cells.length; i++) {
				if (collapse != this.isCellCollapsed(cells[i])) {
					this.model.setCollapsed(cells[i], collapse);
					this.swapBounds(cells[i], collapse);
					if (this.isExtendParent(cells[i])) {
						this.extendParent(cells[i]);
					}
					if (recurse) {
						var children = this.model.getChildren(cells[i]);
						this.foldCells(children, collapse, recurse);
					}
				}
			}
			this.fireEvent(new mxEventObject(mxEvent.CELLS_FOLDED, 'cells', cells, 'collapse', collapse, 'recurse', recurse));
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.swapBounds = function(cell, willCollapse) {
	if (cell != null) {
		var geo = this.model.getGeometry(cell);
		if (geo != null) {
			geo = geo.clone();
			this.updateAlternateBounds(cell, geo, willCollapse);
			geo.swap();
			this.model.setGeometry(cell, geo);
		}
	}
};
mxGraph.prototype.updateAlternateBounds = function(cell, geo, willCollapse) {
	if (cell != null && geo != null) {
		if (geo.alternateBounds == null) {
			var bounds = geo;
			if (this.collapseToPreferredSize) {
				var tmp = this.getPreferredSizeForCell(cell);
				if (tmp != null) {
					bounds = tmp;
					var state = this.view.getState(cell);
					var style = (state != null) ? state.style: this.getCellStyle(cell);
					var startSize = mxUtils.getValue(style, mxConstants.STYLE_STARTSIZE);
					if (startSize > 0) {
						bounds.height = Math.max(bounds.height, startSize);
					}
				}
			}
			geo.alternateBounds = new mxRectangle(geo.x, geo.y, bounds.width, bounds.height);
		} else {
			geo.alternateBounds.x = geo.x;
			geo.alternateBounds.y = geo.y;
		}
	}
};
mxGraph.prototype.addAllEdges = function(cells) {
	var allCells = cells.slice();
	allCells = allCells.concat(this.getAllEdges(cells));
	return allCells;
};
mxGraph.prototype.getAllEdges = function(cells) {
	var edges = [];
	if (cells != null) {
		for (var i = 0; i < cells.length; i++) {
			var edgeCount = this.model.getEdgeCount(cells[i]);
			for (var j = 0; j < edgeCount; j++) {
				edges.push(this.model.getEdgeAt(cells[i], j));
			}
			var children = this.model.getChildren(cells[i]);
			edges = edges.concat(this.getAllEdges(children));
		}
	}
	return edges;
};
mxGraph.prototype.updateCellSize = function(cell, ignoreChildren) {
	ignoreChildren = (ignoreChildren != null) ? ignoreChildren: false;
	this.model.beginUpdate();
	try {
		this.cellSizeUpdated(cell, ignoreChildren);
		this.fireEvent(new mxEventObject(mxEvent.UPDATE_CELL_SIZE, 'cell', cell, 'ignoreChildren', ignoreChildren));
	} finally {
		this.model.endUpdate();
	}
	return cell;
};
mxGraph.prototype.cellSizeUpdated = function(cell, ignoreChildren) {
	if (cell != null) {
		this.model.beginUpdate();
		try {
			var size = this.getPreferredSizeForCell(cell);
			var geo = this.model.getGeometry(cell);
			if (size != null && geo != null) {
				var collapsed = this.isCellCollapsed(cell);
				geo = geo.clone();
				if (this.isSwimlane(cell)) {
					var state = this.view.getState(cell);
					var style = (state != null) ? state.style: this.getCellStyle(cell);
					var cellStyle = this.model.getStyle(cell);
					if (cellStyle == null) {
						cellStyle = '';
					}
					if (mxUtils.getValue(style, mxConstants.STYLE_HORIZONTAL, true)) {
						cellStyle = mxUtils.setStyle(cellStyle, mxConstants.STYLE_STARTSIZE, size.height + 8);
						if (collapsed) {
							geo.height = size.height + 8;
						}
						geo.width = size.width;
					} else {
						cellStyle = mxUtils.setStyle(cellStyle, mxConstants.STYLE_STARTSIZE, size.width + 8);
						if (collapsed) {
							geo.width = size.width + 8;
						}
						geo.height = size.height;
					}
					this.model.setStyle(cell, cellStyle);
				} else {
					geo.width = size.width;
					geo.height = size.height;
				}
				if (!ignoreChildren && !collapsed) {
					var bounds = this.view.getBounds(this.model.getChildren(cell));
					if (bounds != null) {
						var tr = this.view.translate;
						var scale = this.view.scale;
						var width = (bounds.x + bounds.width) / scale - geo.x - tr.x;
						var height = (bounds.y + bounds.height) / scale - geo.y - tr.y;
						geo.width = Math.max(geo.width, width);
						geo.height = Math.max(geo.height, height);
					}
				}
				this.cellsResized([cell], [geo]);
			}
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.getPreferredSizeForCell = function(cell) {
	var result = null;
	if (cell != null) {
		var state = this.view.getState(cell);
		var style = (state != null) ? state.style: this.getCellStyle(cell);
		if (style != null && !this.model.isEdge(cell)) {
			var fontSize = style[mxConstants.STYLE_FONTSIZE] || mxConstants.DEFAULT_FONTSIZE;
			var dx = 0;
			var dy = 0;
			if (this.getImage(state) != null || style[mxConstants.STYLE_IMAGE] != null) {
				if (style[mxConstants.STYLE_SHAPE] == mxConstants.SHAPE_LABEL) {
					if (style[mxConstants.STYLE_VERTICAL_ALIGN] == mxConstants.ALIGN_MIDDLE) {
						dx += style[mxConstants.STYLE_IMAGE_WIDTH] || mxLabel.prototype.imageSize;
					}
					if (style[mxConstants.STYLE_ALIGN] != mxConstants.ALIGN_CENTER) {
						dy += style[mxConstants.STYLE_IMAGE_HEIGHT] || mxLabel.prototype.imageSize;
					}
				}
			}
			dx += 2 * (style[mxConstants.STYLE_SPACING] || 0);
			dx += style[mxConstants.STYLE_SPACING_LEFT] || 0;
			dx += style[mxConstants.STYLE_SPACING_RIGHT] || 0;
			dy += 2 * (style[mxConstants.STYLE_SPACING] || 0);
			dy += style[mxConstants.STYLE_SPACING_TOP] || 0;
			dy += style[mxConstants.STYLE_SPACING_BOTTOM] || 0;
			var image = this.getFoldingImage(state);
			if (image != null) {
				dx += image.width + 8;
			}
			var value = this.getLabel(cell);
			if (value != null && value.length > 0) {
				if (!this.isHtmlLabel(cell)) {
					value = value.replace(/\n/g, '<br>');
				}
				var size = mxUtils.getSizeForString(value, fontSize, style[mxConstants.STYLE_FONTFAMILY]);
				var width = size.width + dx;
				var height = size.height + dy;
				if (!mxUtils.getValue(style, mxConstants.STYLE_HORIZONTAL, true)) {
					var tmp = height;
					height = width;
					width = tmp;
				}
				if (this.gridEnabled) {
					width = this.snap(width + this.gridSize / 2);
					height = this.snap(height + this.gridSize / 2);
				}
				result = new mxRectangle(0, 0, width, height);
			} else {
				var gs2 = 4 * this.gridSize;
				result = new mxRectangle(0, 0, gs2, gs2);
			}
		}
	}
	return result;
};
mxGraph.prototype.resizeCell = function(cell, bounds) {
	return this.resizeCells([cell], [bounds])[0];
};
mxGraph.prototype.resizeCells = function(cells, bounds) {
	this.model.beginUpdate();
	try {
		this.cellsResized(cells, bounds);
		this.fireEvent(new mxEventObject(mxEvent.RESIZE_CELLS, 'cells', cells, 'bounds', bounds));
	} finally {
		this.model.endUpdate();
	}
	return cells;
};
mxGraph.prototype.cellsResized = function(cells, bounds) {
	if (cells != null && bounds != null && cells.length == bounds.length) {
		this.model.beginUpdate();
		try {
			for (var i = 0; i < cells.length; i++) {
				var tmp = bounds[i];
				var geo = this.model.getGeometry(cells[i]);
				if (geo != null && (geo.x != tmp.x || geo.y != tmp.y || geo.width != tmp.width || geo.height != tmp.height)) {
					geo = geo.clone();
					if (geo.relative) {
						var offset = geo.offset;
						if (offset != null) {
							offset.x += tmp.x - geo.x;
							offset.y += tmp.y - geo.y;
						}
					} else {
						geo.x = tmp.x;
						geo.y = tmp.y;
					}
					geo.width = tmp.width;
					geo.height = tmp.height;
					if (!geo.relative && this.model.isVertex(cells[i]) && !this.isAllowNegativeCoordinates()) {
						geo.x = Math.max(0, geo.x);
						geo.y = Math.max(0, geo.y);
					}
					this.model.setGeometry(cells[i], geo);
					if (this.isExtendParent(cells[i])) {
						this.extendParent(cells[i]);
					}
				}
			}
			if (this.resetEdgesOnResize) {
				this.resetEdges(cells);
			}
			this.fireEvent(new mxEventObject(mxEvent.CELLS_RESIZED, 'cells', cells, 'bounds', bounds));
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.extendParent = function(cell) {
	if (cell != null) {
		var parent = this.model.getParent(cell);
		var p = this.model.getGeometry(parent);
		if (parent != null && p != null && !this.isCellCollapsed(parent)) {
			var geo = this.model.getGeometry(cell);
			if (geo != null && (p.width < geo.x + geo.width || p.height < geo.y + geo.height)) {
				p = p.clone();
				p.width = Math.max(p.width, geo.x + geo.width);
				p.height = Math.max(p.height, geo.y + geo.height);
				this.cellsResized([parent], [p]);
			}
		}
	}
};
mxGraph.prototype.importCells = function(cells, dx, dy, target, evt) {
	return this.moveCells(cells, dx, dy, true, target, evt);
};
mxGraph.prototype.moveCells = function(cells, dx, dy, clone, target, evt) {
	if (cells != null && (dx != 0 || dy != 0 || clone || target != null)) {
		this.model.beginUpdate();
		try {
			if (clone) {
				cells = this.cloneCells(cells, this.isCloneInvalidEdges());
				if (target == null) {
					target = this.getDefaultParent();
				}
			}
			this.cellsMoved(cells, dx, dy, !clone && this.isDisconnectOnMove() && this.isAllowDanglingEdges(), target == null);
			if (target != null) {
				var index = this.model.getChildCount(target);
				this.cellsAdded(cells, target, index, null, null, true);
			}
			this.fireEvent(new mxEventObject(mxEvent.MOVE_CELLS, 'cells', cells, 'dx', dx, 'dy', dy, 'clone', clone, 'target', target, 'event', evt));
		} finally {
			this.model.endUpdate();
		}
	}
	return cells;
};
mxGraph.prototype.cellsMoved = function(cells, dx, dy, disconnect, constrain) {
	if (cells != null && (dx != 0 || dy != 0)) {
		this.model.beginUpdate();
		try {
			if (disconnect) {
				this.disconnectGraph(cells);
			}
			for (var i = 0; i < cells.length; i++) {
				this.translateCell(cells[i], dx, dy);
				if (constrain) {
					this.constrainChild(cells[i]);
				}
			}
			if (this.resetEdgesOnMove) {
				this.resetEdges(cells);
			}
			this.fireEvent(new mxEventObject(mxEvent.CELLS_MOVED, 'cells', cells, 'dx', dy, 'dy', dy, 'disconnect', disconnect));
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.translateCell = function(cell, dx, dy) {
	var geo = this.model.getGeometry(cell);
	if (geo != null) {
		geo = geo.clone();
		geo.translate(dx, dy);
		if (!geo.relative && this.model.isVertex(cell) && !this.isAllowNegativeCoordinates()) {
			geo.x = Math.max(0, geo.x);
			geo.y = Math.max(0, geo.y);
		}
		if (geo.relative && !this.model.isEdge(cell)) {
			if (geo.offset == null) {
				geo.offset = new mxPoint(dx, dy);
			} else {
				geo.offset.X += dx;
				geo.offset.Y += dy;
			}
		}
		this.model.setGeometry(cell, geo);
	}
};
mxGraph.prototype.getCellContainmentArea = function(cell) {
	if (cell != null && !this.model.isEdge(cell)) {
		var parent = this.model.getParent(cell);
		if (parent == this.getDefaultParent() || parent == this.getCurrentRoot()) {
			return this.getMaximumGraphBounds();
		} else if (parent != null && parent != this.getDefaultParent()) {
			var g = this.model.getGeometry(parent);
			if (g != null) {
				var x = 0;
				var y = 0;
				var w = g.width;
				var h = g.height;
				if (this.isSwimlane(parent)) {
					var size = this.getStartSize(parent);
					x = size.width;
					w -= size.width;
					y = size.height;
					h -= size.height;
				}
				return new mxRectangle(x, y, w, h);
			}
		}
	}
	return null;
};
mxGraph.prototype.getMaximumGraphBounds = function() {
	return this.maximumGraphBounds;
};
mxGraph.prototype.constrainChild = function(cell) {
	if (cell != null) {
		var geo = this.model.getGeometry(cell);
		var area = (this.isConstrainChild(cell)) ? this.getCellContainmentArea(cell) : this.getMaximumGraphBounds();
		if (geo != null && area != null) {
			if (!geo.relative && (geo.x < area.x || geo.y < area.y || area.width < geo.x + geo.width || area.height < geo.y + geo.height)) {
				var overlap = this.getOverlap(cell);
				if (area.width > 0) {
					geo.x = Math.min(geo.x, area.x + area.width - (1 - overlap) * geo.width);
				}
				if (area.height > 0) {
					geo.y = Math.min(geo.y, area.y + area.height - (1 - overlap) * geo.height);
				}
				geo.x = Math.max(geo.x, area.x - geo.width * overlap);
				geo.y = Math.max(geo.y, area.y - geo.height * overlap);
			}
		}
	}
};
mxGraph.prototype.resetEdges = function(cells) {
	if (cells != null) {
		var hash = new Object();
		for (var i = 0; i < cells.length; i++) {
			var id = mxCellPath.create(cells[i]);
			hash[id] = cells[i];
		}
		this.model.beginUpdate();
		try {
			for (var i = 0; i < cells.length; i++) {
				var edges = this.model.getEdges(cells[i]);
				if (edges != null) {
					for (var j = 0; j < edges.length; j++) {
						var source = this.view.getVisibleTerminal(edges[j], true);
						var sourceId = mxCellPath.create(source);
						var target = this.view.getVisibleTerminal(edges[j], false);
						var targetId = mxCellPath.create(target);
						if (hash[sourceId] == null || hash[targetId] == null) {
							this.resetEdge(edges[j]);
						}
					}
				}
				this.resetEdges(this.model.getChildren(cells[i]));
			}
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.resetEdge = function(edge) {
	var geo = this.model.getGeometry(edge);
	if (geo != null && geo.points != null && geo.points.length > 0) {
		geo = geo.clone();
		geo.points = [];
		this.model.setGeometry(edge, geo);
	}
	return edge;
};
mxGraph.prototype.getAllConnectionConstraints = function(terminal, source) {
	return null;
};
mxGraph.prototype.getConnectionConstraint = function(edge, terminal, source) {
	var point = null;
	var x = edge.style[(source) ? mxConstants.STYLE_EXIT_X: mxConstants.STYLE_ENTRY_X];
	if (x != null) {
		var y = edge.style[(source) ? mxConstants.STYLE_EXIT_Y: mxConstants.STYLE_ENTRY_Y];
		if (y != null) {
			point = new mxPoint(parseFloat(x), parseFloat(y));
		}
	}
	var perimeter = false;
	if (point != null) {
		perimeter = mxUtils.getValue(edge.style, (source) ? mxConstants.STYLE_EXIT_PERIMETER: mxConstants.STYLE_ENTRY_PERIMETER, true);
	}
	return new mxConnectionConstraint(point, perimeter);
};
mxGraph.prototype.setConnectionConstraint = function(edge, terminal, source, constraint) {
	if (constraint != null) {
		this.model.beginUpdate();
		try {
			if (constraint == null || constraint.point == null) {
				this.setCellStyles((source) ? mxConstants.STYLE_EXIT_X: mxConstants.STYLE_ENTRY_X, null, [edge]);
				this.setCellStyles((source) ? mxConstants.STYLE_EXIT_Y: mxConstants.STYLE_ENTRY_Y, null, [edge]);
				this.setCellStyles((source) ? mxConstants.STYLE_EXIT_PERIMETER: mxConstants.STYLE_ENTRY_PERIMETER, null, [edge]);
			} else if (constraint.point != null) {
				this.setCellStyles((source) ? mxConstants.STYLE_EXIT_X: mxConstants.STYLE_ENTRY_X, constraint.point.x, [edge]);
				this.setCellStyles((source) ? mxConstants.STYLE_EXIT_Y: mxConstants.STYLE_ENTRY_Y, constraint.point.y, [edge]);
				if (!constraint.perimeter) {
					this.setCellStyles((source) ? mxConstants.STYLE_EXIT_PERIMETER: mxConstants.STYLE_ENTRY_PERIMETER, '0', [edge]);
				} else {
					this.setCellStyles((source) ? mxConstants.STYLE_EXIT_PERIMETER: mxConstants.STYLE_ENTRY_PERIMETER, null, [edge]);
				}
			}
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.getConnectionPoint = function(vertex, constraint) {
	var point = null;
	if (vertex != null && constraint.point != null) {
		point = new mxPoint(vertex.x + constraint.point.x * vertex.width, vertex.y + constraint.point.y * vertex.height);
	}
	if (point != null && constraint.perimeter) {
		point = this.view.getPerimeterPoint(vertex, point, false);
	}
	return point;
};
mxGraph.prototype.connectCell = function(edge, terminal, source, constraint) {
	this.model.beginUpdate();
	try {
		var previous = this.model.getTerminal(edge, source);
		this.cellConnected(edge, terminal, source, constraint);
		this.fireEvent(new mxEventObject(mxEvent.CONNECT_CELL, 'edge', edge, 'terminal', terminal, 'source', source, 'previous', previous));
	} finally {
		this.model.endUpdate();
	}
	return edge;
};
mxGraph.prototype.cellConnected = function(edge, terminal, source, constraint) {
	if (edge != null) {
		this.model.beginUpdate();
		try {
			var previous = this.model.getTerminal(edge, source);
			this.setConnectionConstraint(edge, terminal, source, constraint);
			var id = null;
			if (this.isPort(terminal)) {
				id = terminal.getId();
				terminal = this.getTerminalForPort(terminal, source);
			}
			var key = (source) ? mxConstants.STYLE_SOURCE_PORT: mxConstants.STYLE_TARGET_PORT;
			this.setCellStyles(key, id, [edge]);
			this.model.setTerminal(edge, terminal, source);
			if (this.resetEdgesOnConnect) {
				this.resetEdge(edge);
			}
			this.fireEvent(new mxEventObject(mxEvent.CELL_CONNECTED, 'edge', edge, 'terminal', terminal, 'source', source, 'previous', previous));
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.disconnectGraph = function(cells) {
	if (cells != null) {
		this.model.beginUpdate();
		try {
			var scale = this.view.scale;
			var tr = this.view.translate;
			var hash = new Object();
			for (var i = 0; i < cells.length; i++) {
				var id = mxCellPath.create(cells[i]);
				hash[id] = cells[i];
			}
			for (var i = 0; i < cells.length; i++) {
				if (this.model.isEdge(cells[i])) {
					var geo = this.model.getGeometry(cells[i]);
					if (geo != null) {
						var state = this.view.getState(cells[i]);
						var pstate = this.view.getState(this.model.getParent(cells[i]));
						if (state != null && pstate != null) {
							geo = geo.clone();
							var dx = -pstate.origin.x;
							var dy = -pstate.origin.y;
							var pts = state.absolutePoints;
							var src = this.model.getTerminal(cells[i], true);
							if (src != null && this.isCellDisconnectable(cells[i], src, true)) {
								var srcId = mxCellPath.create(src);
								while (src != null && hash[srcId] == null) {
									src = this.model.getParent(src);
									srcId = mxCellPath.create(src);
								}
								if (src == null) {
									geo.setTerminalPoint(new mxPoint(pts[0].x / scale - tr.x + dx, pts[0].y / scale - tr.y + dy), true);
									this.model.setTerminal(cells[i], null, true);
								}
							}
							var trg = this.model.getTerminal(cells[i], false);
							if (trg != null && this.isCellDisconnectable(cells[i], trg, false)) {
								var trgId = mxCellPath.create(trg);
								while (trg != null && hash[trgId] == null) {
									trg = this.model.getParent(trg);
									trgId = mxCellPath.create(trg);
								}
								if (trg == null) {
									var n = pts.length - 1;
									geo.setTerminalPoint(new mxPoint(pts[n].x / scale - tr.x + dx, pts[n].y / scale - tr.y + dy), false);
									this.model.setTerminal(cells[i], null, false);
								}
							}
							this.model.setGeometry(cells[i], geo);
						}
					}
				}
			}
		} finally {
			this.model.endUpdate();
		}
	}
};
mxGraph.prototype.getCurrentRoot = function() {
	return this.view.currentRoot;
};
mxGraph.prototype.getTranslateForRoot = function(cell) {
	return null;
};
mxGraph.prototype.isPort = function(cell) {
	return false;
};
mxGraph.prototype.getTerminalForPort = function(cell, source) {
	return this.model.getParent(cell);
};
mxGraph.prototype.getChildOffsetForCell = function(cell) {
	return null;
};
mxGraph.prototype.enterGroup = function(cell) {
	cell = cell || this.getSelectionCell();
	if (cell != null && this.isValidRoot(cell)) {
		this.view.setCurrentRoot(cell);
		this.clearSelection();
	}
};
mxGraph.prototype.exitGroup = function() {
	var root = this.model.getRoot();
	var current = this.getCurrentRoot();
	if (current != null) {
		var next = this.model.getParent(current);
		while (next != root && !this.isValidRoot(next) && this.model.getParent(next) != root) {
			next = this.model.getParent(next);
		}
		if (next == root || this.model.getParent(next) == root) {
			this.view.setCurrentRoot(null);
		} else {
			this.view.setCurrentRoot(next);
		}
		var state = this.view.getState(current);
		if (state != null) {
			this.setSelectionCell(current);
		}
	}
};
mxGraph.prototype.home = function() {
	var current = this.getCurrentRoot();
	if (current != null) {
		this.view.setCurrentRoot(null);
		var state = this.view.getState(current);
		if (state != null) {
			this.setSelectionCell(current);
		}
	}
};
mxGraph.prototype.isValidRoot = function(cell) {
	return (cell != null);
};
mxGraph.prototype.getGraphBounds = function() {
	return this.view.getGraphBounds();
};
mxGraph.prototype.getCellBounds = function(cell, includeEdges, includeDescendants) {
	var cells = [cell];
	if (includeEdges) {
		cells = cells.concat(this.model.getEdges(cell));
	}
	var result = this.view.getBounds(cells);
	if (includeDescendants) {
		var childCount = this.model.getChildCount(cell);
		for (var i = 0; i < childCount; i++) {
			var tmp = this.getCellBounds(this.model.getChildAt(cell, i), includeEdges, true);
			if (result != null) {
				result.add(tmp);
			} else {
				result = tmp;
			}
		}
	}
};
mxGraph.prototype.getBoundingBoxFromGeometry = function(cells) {
	var result = null;
	if (cells != null) {
		for (var i = 0; i < cells.length; i++) {
			if (this.model.isVertex(cells[i])) {
				var geo = this.getCellGeometry(cells[i]);
				if (result == null) {
					result = new mxRectangle(geo.x, geo.y, geo.width, geo.height);
				} else {
					result.add(geo);
				}
			}
		}
	}
	return result;
};
mxGraph.prototype.refresh = function(cell) {
	this.view.clear(cell, cell == null);
	this.view.validate();
	this.sizeDidChange();
	this.fireEvent(new mxEventObject(mxEvent.REFRESH));
};
mxGraph.prototype.snap = function(value) {
	if (this.gridEnabled) {
		value = Math.round(value / this.gridSize) * this.gridSize;
	}
	return value;
};
mxGraph.prototype.panGraph = function(dx, dy) {
	var style = mxUtils.getCurrentStyle(this.container);
	if (this.useScrollbarsForPanning && mxUtils.hasScrollbars(this.container)) {
		this.container.scrollLeft = -dx;
		this.container.scrollTop = -dy;
	} else {
		var canvas = this.view.getCanvas();
		if (this.dialect == mxConstants.DIALECT_SVG) {
			canvas.setAttribute('transform', 'translate(' + dx + ',' + dy + ')');
			if (dx == 0 && dy == 0) {
				if (this.shiftPreview != null) {
					this.shiftPreview.parentNode.removeChild(this.shiftPreview);
					this.shiftPreview = null;
					var child = this.container.firstChild;
					while (child != null) {
						if (child != canvas.parentNode) {
							if (child.style != null) {
								child.style.visibility = 'visible';
							}
						}
						child = child.nextSibling;
					}
				}
			} else {
				if (this.shiftPreview == null) {
					this.shiftPreview = document.createElement('div');
					var tmp = [];
					var child = this.container.firstChild;
					while (child != null) {
						if (child != canvas.parentNode) {
							tmp.push(mxUtils.getInnerHtml(child));
							if (child.style != null) {
								child.style.visibility = 'hidden';
							}
						}
						child = child.nextSibling;
					}
					this.shiftPreview.innerHTML = tmp.join('');
					this.shiftPreview.style.position = 'absolute';
					this.shiftPreview.style.overflow = 'visible';
					var pt = mxUtils.getOffset(this.container);
					this.shiftPreview.style.left = pt.x + 'px';
					this.shiftPreview.style.top = pt.y + 'px';
					this.container.appendChild(this.shiftPreview);
				}
				this.shiftPreview.style.left = dx + 'px';
				this.shiftPreview.style.top = dy + 'px';
			}
		} else if (this.dialect == mxConstants.DIALECT_VML) {
			canvas.setAttribute('coordorigin', ( - dx) + ',' + ( - dy));
		} else {
			if (dx == 0 && dy == 0) {
				if (this.shiftPreview != null) {
					this.shiftPreview.parentNode.removeChild(this.shiftPreview);
					canvas.style.visibility = 'visible';
					this.shiftPreview = null;
				}
			} else {
				if (this.shiftPreview == null) {
					this.shiftPreview = this.view.getDrawPane().cloneNode(false);
					var tmp = mxUtils.getInnerHtml(this.view.getBackgroundPane());
					tmp += mxUtils.getInnerHtml(this.view.getDrawPane());
					this.shiftPreview.innerHTML = tmp;
					var pt = mxUtils.getOffset(this.container);
					this.shiftPreview.style.position = 'absolute';
					this.shiftPreview.style.left = pt.x + 'px';
					this.shiftPreview.style.top = pt.y + 'px';
					canvas.style.visibility = 'hidden';
					this.container.appendChild(this.shiftPreview);
				}
				this.shiftPreview.style.left = dx + 'px';
				this.shiftPreview.style.top = dy + 'px';
			}
		}
	}
};
mxGraph.prototype.zoomIn = function() {
	this.zoom(this.zoomFactor);
};
mxGraph.prototype.zoomOut = function() {
	this.zoom(1 / this.zoomFactor);
};
mxGraph.prototype.zoomActual = function() {
	this.view.translate.x = 0;
	this.view.translate.y = 0;
	this.view.setScale(1);
};
mxGraph.prototype.zoom = function(factor) {
	var scale = this.view.scale * factor;
	var state = this.view.getState(this.getSelectionCell());
	if (this.keepSelectionVisibleOnZoom && state != null) {
		var rect = new mxRectangle(state.x * factor, state.y * factor, state.width * factor, state.height * factor);
		this.view.scale = scale;
		if (!this.scrollRectToVisible(rect)) {
			this.view.revalidate();
			this.view.setScale(scale);
		}
	} else if (this.centerZoom && !mxUtils.hasScrollbars(this.container)) {
		var dx = this.container.offsetWidth;
		var dy = this.container.offsetHeight;
		if (factor > 1) {
			var f = (factor - 1) / (scale * 2);
			dx *= -f;
			dy *= -f;
		} else {
			var f = (1 / factor - 1) / (this.view.scale * 2);
			dx *= f;
			dy *= f;
		}
		this.view.scaleAndTranslate(scale, this.view.translate.x + dx, this.view.translate.y + dy);
	} else {
		this.view.setScale(scale);
	}
};
mxGraph.prototype.fit = function(border, keepOrigin) {
	if (this.container != null) {
		border = (border != null) ? border: 0;
		keepOrigin = (keepOrigin != null) ? keepOrigin: false;
		var w1 = this.container.offsetWidth;
		var h1 = this.container.offsetHeight;
		var bounds = this.view.getGraphBounds();
		if (keepOrigin && bounds.x != null && bounds.y != null) {
			bounds.width += bounds.x;
			bounds.height += bounds.y;
			bounds.x = 0;
			bounds.y = 0;
		}
		var s = this.view.scale;
		var w2 = (bounds.width / s) + 1;
		var h2 = (bounds.height / s) + 1;
		if (this.backgroundImage != null) {
			w2 = Math.max(w2, this.backgroundImage.width - bounds.x / s);
			h2 = Math.max(h2, this.backgroundImage.height - bounds.y / s);
		}
		var b = (keepOrigin) ? border: 2 * border;
		var s2 = Math.min(w1 / (w2 + b), h1 / (h2 + b));
		if (s2 > 0.1 && s2 < 8) {
			if (!keepOrigin) {
				this.view.translate.x = (bounds.x != null) ? this.view.translate.x - bounds.x / s + border: border;
				this.view.translate.y = (bounds.y != null) ? this.view.translate.y - bounds.y / s + border: border;
			}
			this.view.setScale(s2);
		}
	}
	return this.view.scale;
};
mxGraph.prototype.scrollCellToVisible = function(cell, center) {
	var x = -this.view.translate.x;
	var y = -this.view.translate.y;
	var state = this.view.getState(cell);
	if (state != null) {
		var bounds = new mxRectangle(x + state.x, y + state.y, state.width, state.height);
		if (center && this.container != null) {
			var w = this.container.clientWidth;
			var h = this.container.clientHeight;
			bounds.x = bounds.getCenterX() - w / 2;
			bounds.width = w;
			bounds.y = bounds.getCenterY() - h / 2;
			bounds.height = h;
		}
		if (this.scrollRectToVisible(bounds)) {
			this.view.setTranslate(this.view.translate.x, this.view.translate.y);
		}
	}
};
mxGraph.prototype.scrollRectToVisible = function(rect) {
	if (rect != null) {
		var isChanged = false;
		var w = this.container.offsetWidth;
		var h = this.container.offsetHeight;
		var widthLimit = Math.min(w, rect.width);
		var heightLimit = Math.min(h, rect.height);
		if (mxUtils.hasScrollbars(this.container)) {
			var c = this.container;
			var dx = c.scrollLeft - rect.x;
			var ddx = Math.max(dx - c.scrollLeft, 0);
			if (dx > 0) {
				c.scrollLeft -= dx + 2;
			} else {
				dx = rect.x + widthLimit - c.scrollLeft - c.clientWidth;
				if (dx > 0) {
					c.scrollLeft += dx + 2;
				}
			}
			var dy = c.scrollTop - rect.y;
			var ddy = Math.max(0, dy - c.scrollTop);
			if (dy > 0) {
				c.scrollTop -= dy + 2;
			} else {
				dy = rect.y + heightLimit - c.scrollTop - c.clientHeight;
				if (dy > 0) {
					c.scrollTop += dy + 2;
				}
			}
			var tr = this.view.translate;
			if (!this.useScrollbarsForPanning && (ddx != 0 || ddy != 0)) {
				this.view.setTranslate(ddx, ddy);
			}
		} else {
			var x = -this.view.translate.x;
			var y = -this.view.translate.y;
			var s = this.view.scale;
			if (rect.x + widthLimit > x + w) {
				this.view.translate.x -= (rect.x + widthLimit - w - x) / s;
				isChanged = true;
			}
			if (rect.y + heightLimit > y + h) {
				this.view.translate.y -= (rect.y + heightLimit - h - y) / s;
				isChanged = true;
			}
			if (rect.x < x) {
				this.view.translate.x += (x - rect.x) / s;
				isChanged = true;
			}
			if (rect.y < y) {
				this.view.translate.y += (y - rect.y) / s;
				isChanged = true;
			}
			if (isChanged) {
				this.view.refresh();
			}
		}
	}
	return isChanged;
};
mxGraph.prototype.getCellGeometry = function(cell) {
	return this.model.getGeometry(cell);
};
mxGraph.prototype.isCellVisible = function(cell) {
	return this.model.isVisible(cell);
};
mxGraph.prototype.isCellCollapsed = function(cell) {
	return this.model.isCollapsed(cell);
};
mxGraph.prototype.isCellConnectable = function(cell) {
	return this.model.isConnectable(cell);
};
mxGraph.prototype.isOrthogonal = function(edge) {
	var orthogonal = edge.style[mxConstants.STYLE_ORTHOGONAL];
	if (orthogonal != null) {
		return orthogonal;
	}
	var tmp = this.view.getEdgeStyle(edge);
	return tmp == mxEdgeStyle.ElbowConnector || tmp == mxEdgeStyle.SideToSide || tmp == mxEdgeStyle.TopToBottom || tmp == mxEdgeStyle.EntityRelation;
};
mxGraph.prototype.isLoop = function(state) {
	var src = this.view.getVisibleTerminal(state.cell, true);
	var trg = this.view.getVisibleTerminal(state.cell, false);
	return (src != null && src == trg);
};
mxGraph.prototype.isCloneEvent = function(evt) {
	return mxEvent.isControlDown(evt);
};
mxGraph.prototype.isToggleEvent = function(evt) {
	return mxEvent.isControlDown(evt);
};
mxGraph.prototype.isGridEnabledEvent = function(evt) {
	return evt != null && !mxEvent.isAltDown(evt);
};
mxGraph.prototype.isConstrainedEvent = function(evt) {
	return mxEvent.isShiftDown(evt);
};
mxGraph.prototype.isForceMarqueeEvent = function(evt) {
	return mxEvent.isAltDown(evt) || mxEvent.isMetaDown(evt);
};
mxGraph.prototype.validationAlert = function(message) {
	mxUtils.alert(message);
};
mxGraph.prototype.isEdgeValid = function(edge, source, target) {
	return this.getEdgeValidationError(edge, source, target) == null;
};
mxGraph.prototype.getEdgeValidationError = function(edge, source, target) {
	if (edge != null && this.model.getTerminal(edge, true) == null && this.model.getTerminal(edge, false) == null) {
		return null;
	}
	if (!this.allowLoops && source == target && source != null) {
		return '';
	}
	if (!this.isValidConnection(source, target)) {
		return '';
	}
	if (source != null && target != null) {
		var error = '';
		if (!this.multigraph) {
			var tmp = this.model.getEdgesBetween(source, target, true);
			if (tmp.length > 1 || (tmp.length == 1 && tmp[0] != edge)) {
				error += (mxResources.get(this.alreadyConnectedResource) || this.alreadyConnectedResource) + '\n';
			}
		}
		var sourceOut = this.model.getDirectedEdgeCount(source, true, edge);
		var targetIn = this.model.getDirectedEdgeCount(target, false, edge);
		for (var i = 0; i < this.multiplicities.length; i++) {
			var err = this.multiplicities[i].check(this, edge, source, target, sourceOut, targetIn);
			if (err != null) {
				error += err;
			}
		}
		var err = this.validateEdge(edge, source, target);
		if (err != null) {
			error += err;
		}
		return (error.length > 0) ? error: null;
	}
	return (this.allowDanglingEdges) ? null: '';
};
mxGraph.prototype.validateEdge = function(edge, source, target) {
	return null;
};
mxGraph.prototype.validateGraph = function(cell, context) {
	cell = (cell != null) ? cell: this.model.getRoot();
	context = (context != null) ? context: new Object();
	var isValid = true;
	var childCount = this.model.getChildCount(cell);
	for (var i = 0; i < childCount; i++) {
		var tmp = this.model.getChildAt(cell, i);
		var ctx = context;
		if (this.isValidRoot(tmp)) {
			ctx = new Object();
		}
		var warn = this.validateGraph(tmp, ctx);
		if (warn != null) {
			var html = warn.replace(/\n/g, '<br>');
			var len = html.length;
			this.setCellWarning(tmp, html.substring(0, Math.max(0, len - 4)));
		} else {
			this.setCellWarning(tmp, null);
		}
		isValid = isValid && warn == null;
	}
	var warning = '';
	if (this.isCellCollapsed(cell) && !isValid) {
		warning += (mxResources.get(this.containsValidationErrorsResource) || this.containsValidationErrorsResource) + '\n';
	}
	if (this.model.isEdge(cell)) {
		warning += this.getEdgeValidationError(cell, this.model.getTerminal(cell, true), this.model.getTerminal(cell, false)) || '';
	} else {
		warning += this.getCellValidationError(cell) || '';
	}
	var err = this.validateCell(cell, context);
	if (err != null) {
		warning += err;
	}
	if (this.model.getParent(cell) == null) {
		this.view.validate();
	}
	return (warning.length > 0 || !isValid) ? warning: null;
};
mxGraph.prototype.getCellValidationError = function(cell) {
	var outCount = this.model.getDirectedEdgeCount(cell, true);
	var inCount = this.model.getDirectedEdgeCount(cell, false);
	var value = this.model.getValue(cell);
	var error = '';
	for (var i = 0; i < this.multiplicities.length; i++) {
		var rule = this.multiplicities[i];
		if (rule.source && mxUtils.isNode(value, rule.type, rule.attr, rule.value) && ((rule.max == 0 && outCount > 0) || (rule.min == 1 && outCount == 0) || (rule.max == 1 && outCount > 1))) {
			error += rule.countError + '\n';
		} else if (!rule.source && mxUtils.isNode(value, rule.type, rule.attr, rule.value) && ((rule.max == 0 && inCount > 0) || (rule.min == 1 && inCount == 0) || (rule.max == 1 && inCount > 1))) {
			error += rule.countError + '\n';
		}
	}
	return (error.length > 0) ? error: null;
};
mxGraph.prototype.validateCell = function(cell, context) {
	return null;
};
mxGraph.prototype.getBackgroundImage = function() {
	return this.backgroundImage;
};
mxGraph.prototype.setBackgroundImage = function(image) {
	this.backgroundImage = image;
};
mxGraph.prototype.getFoldingImage = function(state) {
	if (state != null) {
		var tmp = this.isCellCollapsed(state.cell);
		if (this.isCellFoldable(state.cell, !tmp)) {
			return (tmp) ? this.collapsedImage: this.expandedImage;
		}
	}
	return null;
};
mxGraph.prototype.convertValueToString = function(cell) {
	var value = this.model.getValue(cell);
	if (value != null) {
		if (mxUtils.isNode(value)) {
			return value.nodeName;
		} else if (typeof(value.toString) == 'function') {
			return value.toString();
		}
	}
	return '';
};
mxGraph.prototype.getLabel = function(cell) {
	var result = '';
	if (cell != null) {
		var state = this.view.getState(cell);
		var style = (state != null) ? state.style: this.getCellStyle(cell);
		if (this.labelsVisible && !mxUtils.getValue(style, mxConstants.STYLE_NOLABEL, false)) {
			result = this.convertValueToString(cell);
		}
	}
	return result;
};
mxGraph.prototype.isHtmlLabel = function(cell) {
	return this.isHtmlLabels();
};
mxGraph.prototype.isHtmlLabels = function() {
	return this.htmlLabels;
};
mxGraph.prototype.setHtmlLabels = function(value) {
	this.htmlLabels = value;
};
mxGraph.prototype.isWrapping = function(cell) {
	var state = this.view.getState(cell);
	var style = (state != null) ? state.style: this.getCellStyle(cell);
	return (style != null) ? style[mxConstants.STYLE_WHITE_SPACE] == 'wrap': false;
};
mxGraph.prototype.isLabelClipped = function(cell) {
	var state = this.view.getState(cell);
	var style = (state != null) ? state.style: this.getCellStyle(cell);
	return (style != null) ? style[mxConstants.STYLE_OVERFLOW] == 'hidden': false;
};
mxGraph.prototype.getTooltip = function(state, node, x, y) {
	var tip = null;
	if (state != null) {
		if (state.control != null && (node == state.control.node || node.parentNode == state.control.node)) {
			tip = this.collapseExpandResource;
			tip = mxResources.get(tip) || tip;
		}
		if (tip == null && state.overlays != null) {
			for (var i = 0; i < state.overlays.length; i++) {
				if (node == state.overlays[i].node || node.parentNode == state.overlays[i].node) {
					tip = this.getCellOverlays(state.cell)[i].toString();
					break;
				}
			}
		}
		if (tip == null) {
			var handler = this.selectionCellsHandler.getHandler(state.cell);
			if (handler != null && typeof(handler.getTooltipForNode) == 'function') {
				tip = handler.getTooltipForNode(node);
			}
		}
		if (tip == null) {
			tip = this.getTooltipForCell(state.cell);
		}
	}
	return tip;
};
mxGraph.prototype.getTooltipForCell = function(cell) {
	var tip = null;
	if (cell.getTooltip != null) {
		tip = cell.getTooltip();
	} else {
		tip = this.convertValueToString(cell);
	}
	return tip;
};
mxGraph.prototype.getCursorForCell = function(cell) {
	return null;
};
mxGraph.prototype.getStartSize = function(swimlane) {
	var result = new mxRectangle();
	var state = this.view.getState(swimlane);
	var style = (state != null) ? state.style: this.getCellStyle(swimlane);
	if (style != null) {
		var size = parseInt(mxUtils.getValue(style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE));
		if (mxUtils.getValue(style, mxConstants.STYLE_HORIZONTAL, true)) {
			result.height = size;
		} else {
			result.width = size;
		}
	}
	return result;
};
mxGraph.prototype.getImage = function(state) {
	return (state != null && state.style != null) ? state.style[mxConstants.STYLE_IMAGE] : null;
};
mxGraph.prototype.getVerticalAlign = function(state) {
	return (state != null && state.style != null) ? (state.style[mxConstants.STYLE_VERTICAL_ALIGN] || mxConstants.ALIGN_MIDDLE) : null;
};
mxGraph.prototype.getIndicatorColor = function(state) {
	return (state != null && state.style != null) ? state.style[mxConstants.STYLE_INDICATOR_COLOR] : null;
};
mxGraph.prototype.getIndicatorGradientColor = function(state) {
	return (state != null && state.style != null) ? state.style[mxConstants.STYLE_INDICATOR_GRADIENTCOLOR] : null;
};
mxGraph.prototype.getIndicatorShape = function(state) {
	return (state != null && state.style != null) ? state.style[mxConstants.STYLE_INDICATOR_SHAPE] : null;
};
mxGraph.prototype.getIndicatorImage = function(state) {
	return (state != null && state.style != null) ? state.style[mxConstants.STYLE_INDICATOR_IMAGE] : null;
};
mxGraph.prototype.getBorder = function() {
	return this.border;
};
mxGraph.prototype.setBorder = function(value) {
	this.border = value;
};
mxGraph.prototype.isSwimlane = function(cell) {
	if (cell != null) {
		if (this.model.getParent(cell) != this.model.getRoot()) {
			var state = this.view.getState(cell);
			var style = (state != null) ? state.style: this.getCellStyle(cell);
			if (style != null && !this.model.isEdge(cell)) {
				return style[mxConstants.STYLE_SHAPE] == mxConstants.SHAPE_SWIMLANE;
			}
		}
	}
	return false;
};
mxGraph.prototype.isResizeContainer = function() {
	return this.resizeContainer;
};
mxGraph.prototype.setResizeContainer = function(value) {
	this.resizeContainer = value;
};
mxGraph.prototype.isEnabled = function() {
	return this.enabled;
};
mxGraph.prototype.setEnabled = function(value) {
	this.enabled = value;
};
mxGraph.prototype.isEscapeEnabled = function() {
	return this.escapeEnabled;
};
mxGraph.prototype.setEscapeEnabled = function(value) {
	this.escapeEnabled = value;
};
mxGraph.prototype.isInvokesStopCellEditing = function() {
	return this.invokesStopCellEditing;
};
mxGraph.prototype.setInvokesStopCellEditing = function(value) {
	this.invokesStopCellEditing = value;
};
mxGraph.prototype.isEnterStopsCellEditing = function() {
	return this.enterStopsCellEditing;
};
mxGraph.prototype.setEnterStopsCellEditing = function(value) {
	this.enterStopsCellEditing = value;
};
mxGraph.prototype.isCellLocked = function(cell) {
	var geometry = this.model.getGeometry(cell);
	return this.isCellsLocked() || (geometry != null && this.model.isVertex(cell) && geometry.relative);
};
mxGraph.prototype.isCellsLocked = function() {
	return this.cellsLocked;
};
mxGraph.prototype.setCellsLocked = function(value) {
	this.cellsLocked = value;
};
mxGraph.prototype.getCloneableCells = function(cells) {
	return this.model.filterCells(cells, mxUtils.bind(this,
	function(cell) {
		return this.isCellCloneable(cell);
	}));
};
mxGraph.prototype.isCellCloneable = function(cell) {
	return this.isCellsCloneable();
};
mxGraph.prototype.isCellsCloneable = function() {
	return this.cellsCloneable;
};
mxGraph.prototype.setCellsCloneable = function(value) {
	this.cellsCloneable = value;
};
mxGraph.prototype.getExportableCells = function(cells) {
	return this.model.filterCells(cells, mxUtils.bind(this,
	function(cell) {
		return this.canExportCell(cell);
	}));
};
mxGraph.prototype.canExportCell = function(cell) {
	return this.exportEnabled;
};
mxGraph.prototype.getImportableCells = function(cells) {
	return this.model.filterCells(cells, mxUtils.bind(this,
	function(cell) {
		return this.canImportCell(cell);
	}));
};
mxGraph.prototype.canImportCell = function(cell) {
	return this.importEnabled;
};
mxGraph.prototype.isCellSelectable = function(cell) {
	return this.isCellsSelectable();
};
mxGraph.prototype.isCellsSelectable = function() {
	return this.cellsSelectable;
};
mxGraph.prototype.setCellsSelectable = function(value) {
	this.cellsSelectable = value;
};
mxGraph.prototype.getDeletableCells = function(cells) {
	return this.model.filterCells(cells, mxUtils.bind(this,
	function(cell) {
		return this.isCellDeletable(cell);
	}));
};
mxGraph.prototype.isCellDeletable = function(cell) {
	return this.isCellsDeletable();
};
mxGraph.prototype.isCellsDeletable = function() {
	return this.cellsDeletable;
};
mxGraph.prototype.setCellsDeletable = function(value) {
	this.cellsDeletable = value;
};
mxGraph.prototype.isLabelMovable = function(cell) {
	return ! this.isCellLocked(cell) && ((this.model.isEdge(cell) && this.edgeLabelsMovable) || (this.model.isVertex(cell) && this.vertexLabelsMovable));
};
mxGraph.prototype.getMovableCells = function(cells) {
	return this.model.filterCells(cells, mxUtils.bind(this,
	function(cell) {
		return this.isCellMovable(cell);
	}));
};
mxGraph.prototype.isCellMovable = function(cell) {
	return this.isCellsMovable() && !this.isCellLocked(cell);
};
mxGraph.prototype.isCellsMovable = function() {
	return this.cellsMovable;
};
mxGraph.prototype.setCellsMovable = function(value) {
	this.cellsMovable = value;
};
mxGraph.prototype.isGridEnabled = function() {
	return this.gridEnabled;
};
mxGraph.prototype.setGridEnabled = function(value) {
	this.gridEnabled = value;
};
mxGraph.prototype.getGridSize = function() {
	return this.gridSize;
};
mxGraph.prototype.setGridSize = function(value) {
	this.gridSize = value;
};
mxGraph.prototype.getTolerance = function() {
	return this.tolerance;
};
mxGraph.prototype.setTolerance = function(value) {
	this.tolerance = value;
};
mxGraph.prototype.isVertexLabelsMovable = function() {
	return this.vertexLabelsMovable;
};
mxGraph.prototype.setVertexLabelsMovable = function(value) {
	this.vertexLabelsMovable = value;
};
mxGraph.prototype.isEdgeLabelsMovable = function() {
	return this.edgeLabelsMovable;
};
mxGraph.prototype.setEdgeLabelsMovable = function(value) {
	this.edgeLabelsMovable = value;
};
mxGraph.prototype.isSwimlaneNesting = function() {
	return this.swimlaneNesting;
};
mxGraph.prototype.setSwimlaneNesting = function(value) {
	this.swimlaneNesting = value;
};
mxGraph.prototype.isSwimlaneSelectionEnabled = function() {
	return this.swimlaneSelectionEnabled;
};
mxGraph.prototype.setSwimlaneSelectionEnabled = function(value) {
	this.swimlaneSelectionEnabled = value;
};
mxGraph.prototype.isMultigraph = function() {
	return this.multigraph;
};
mxGraph.prototype.setMultigraph = function(value) {
	this.multigraph = value;
};
mxGraph.prototype.isAllowLoops = function() {
	return this.allowLoops;
};
mxGraph.prototype.setAllowDanglingEdges = function(value) {
	this.allowDanglingEdges = value;
};
mxGraph.prototype.isAllowDanglingEdges = function() {
	return this.allowDanglingEdges;
};
mxGraph.prototype.setConnectableEdges = function(value) {
	this.connectableEdges = value;
};
mxGraph.prototype.isConnectableEdges = function() {
	return this.connectableEdges;
};
mxGraph.prototype.setCloneInvalidEdges = function(value) {
	this.cloneInvalidEdges = value;
};
mxGraph.prototype.isCloneInvalidEdges = function() {
	return this.cloneInvalidEdges;
};
mxGraph.prototype.setAllowLoops = function(value) {
	this.allowLoops = value;
};
mxGraph.prototype.isDisconnectOnMove = function() {
	return this.disconnectOnMove;
};
mxGraph.prototype.setDisconnectOnMove = function(value) {
	this.disconnectOnMove = value;
};
mxGraph.prototype.isDropEnabled = function() {
	return this.dropEnabled;
};
mxGraph.prototype.setDropEnabled = function(value) {
	this.dropEnabled = value;
};
mxGraph.prototype.isSplitEnabled = function() {
	return this.splitEnabled;
};
mxGraph.prototype.setSplitEnabled = function(value) {
	this.splitEnabled = value;
};
mxGraph.prototype.isCellResizable = function(cell) {
	return this.isCellsResizable() && !this.isCellLocked(cell);
};
mxGraph.prototype.isCellsResizable = function() {
	return this.cellsResizable;
};
mxGraph.prototype.setCellsResizable = function(value) {
	this.cellsResizable = value;
};
mxGraph.prototype.isCellBendable = function(cell) {
	return this.isCellsBendable() && !this.isCellLocked(cell);
};
mxGraph.prototype.isCellsBendable = function() {
	return this.cellsBendable;
};
mxGraph.prototype.setCellsBendable = function(value) {
	this.cellsBendable = value;
};
mxGraph.prototype.isCellEditable = function(cell) {
	return this.isCellsEditable() && !this.isCellLocked(cell);
};
mxGraph.prototype.isCellsEditable = function() {
	return this.cellsEditable;
};
mxGraph.prototype.setCellsEditable = function(value) {
	this.cellsEditable = value;
};
mxGraph.prototype.isCellDisconnectable = function(cell, terminal, source) {
	return this.isCellsDisconnectable() && !this.isCellLocked(cell);
};
mxGraph.prototype.isCellsDisconnectable = function() {
	return this.cellsDisconnectable;
};
mxGraph.prototype.setCellsDisconnectable = function(value) {
	this.cellsDisconnectable = value;
};
mxGraph.prototype.isValidSource = function(cell) {
	return (cell == null && this.allowDanglingEdges) || (cell != null && (!this.model.isEdge(cell) || this.connectableEdges) && this.isCellConnectable(cell));
};
mxGraph.prototype.isValidTarget = function(cell) {
	return this.isValidSource(cell);
};
mxGraph.prototype.isValidConnection = function(source, target) {
	return this.isValidSource(source) && this.isValidTarget(target);
};
mxGraph.prototype.setConnectable = function(connectable) {
	this.connectionHandler.setEnabled(connectable);
};
mxGraph.prototype.isConnectable = function(connectable) {
	return this.connectionHandler.isEnabled();
};
mxGraph.prototype.setTooltips = function(enabled) {
	this.tooltipHandler.setEnabled(enabled);
};
mxGraph.prototype.setPanning = function(enabled) {
	this.panningHandler.panningEnabled = enabled;
};
mxGraph.prototype.isEditing = function(cell) {
	if (this.cellEditor != null) {
		var editingCell = this.cellEditor.getEditingCell();
		return (cell == null) ? editingCell != null: cell == editingCell;
	}
	return false;
};
mxGraph.prototype.isAutoSizeCell = function(cell) {
	return this.isAutoSizeCells();
};
mxGraph.prototype.isAutoSizeCells = function() {
	return this.autoSizeCells;
};
mxGraph.prototype.setAutoSizeCells = function(value) {
	this.autoSizeCells = value;
};
mxGraph.prototype.isExtendParent = function(cell) {
	return ! this.getModel().isEdge(cell) && this.isExtendParents();
};
mxGraph.prototype.isExtendParents = function() {
	return this.extendParents;
};
mxGraph.prototype.setExtendParents = function(value) {
	this.extendParents = value;
};
mxGraph.prototype.isExtendParentsOnAdd = function() {
	return this.extendParentsOnAdd;
};
mxGraph.prototype.setExtendParentsOnAdd = function(value) {
	this.extendParentsOnAdd = value;
};
mxGraph.prototype.isConstrainChild = function(cell) {
	return this.isConstrainChildren();
};
mxGraph.prototype.isConstrainChildren = function() {
	return this.constrainChildren;
};
mxGraph.prototype.setConstrainChildren = function(value) {
	this.constrainChildren = value;
};
mxGraph.prototype.isAllowNegativeCoordinates = function() {
	return this.allowNegativeCoordinates;
};
mxGraph.prototype.setAllowNegativeCoordinates = function(value) {
	this.allowNegativeCoordinates = value;
};
mxGraph.prototype.getOverlap = function(cell) {
	return (this.isAllowOverlapParent(cell)) ? this.defaultOverlap: 0;
};
mxGraph.prototype.isAllowOverlapParent = function(cell) {
	return false;
};
mxGraph.prototype.getFoldableCells = function(cells, collapse) {
	return this.model.filterCells(cells, mxUtils.bind(this,
	function(cell) {
		return this.isCellFoldable(cell, collapse);
	}));
};
mxGraph.prototype.isCellFoldable = function(cell, collapse) {
	return this.model.getChildCount(cell) > 0;
};
mxGraph.prototype.isValidDropTarget = function(cell, cells, evt) {
	return cell != null && ((this.isSplitEnabled() && this.isSplitTarget(cell, cells, evt)) || (!this.model.isEdge(cell) && (this.isSwimlane(cell) || (this.model.getChildCount(cell) > 0 && !this.isCellCollapsed(cell)))));
};
mxGraph.prototype.isSplitTarget = function(target, cells, evt) {
	if (this.model.isEdge(target) && cells != null && cells.length == 1 && this.isCellConnectable(cells[0]) && this.getEdgeValidationError(target, this.model.getTerminal(target, true), cells[0]) == null) {
		var src = this.model.getTerminal(target, true);
		var trg = this.model.getTerminal(target, false);
		return (!this.model.isAncestor(cells[0], src) && !this.model.isAncestor(cells[0], trg));
	}
	return false;
};
mxGraph.prototype.getDropTarget = function(cells, evt, cell) {
	if (!this.isSwimlaneNesting()) {
		for (var i = 0; i < cells.length; i++) {
			if (this.isSwimlane(cells[i])) {
				return null;
			}
		}
	}
	var pt = mxUtils.convertPoint(this.container, evt.clientX, evt.clientY);
	var swimlane = this.getSwimlaneAt(pt.x, pt.y);
	if (cell == null) {
		cell = swimlane;
	} else if (swimlane != null) {
		var tmp = this.model.getParent(swimlane);
		while (tmp != null && this.isSwimlane(tmp) && tmp != cell) {
			tmp = this.model.getParent(tmp);
		}
		if (tmp == cell) {
			cell = swimlane;
		}
	}
	while (cell != null && !this.isValidDropTarget(cell, cells, evt) && !this.model.isLayer(cell)) {
		cell = this.model.getParent(cell);
	}
	return (!this.model.isLayer(cell) && mxUtils.indexOf(cells, cell) < 0) ? cell: null;
};
mxGraph.prototype.getDefaultParent = function() {
	var parent = this.defaultParent;
	if (parent == null) {
		parent = this.getCurrentRoot();
		if (parent == null) {
			var root = this.model.getRoot();
			parent = this.model.getChildAt(root, 0);
		}
	}
	return parent;
};
mxGraph.prototype.setDefaultParent = function(cell) {
	this.defaultParent = cell;
};
mxGraph.prototype.getSwimlane = function(cell) {
	while (cell != null && !this.isSwimlane(cell)) {
		cell = this.model.getParent(cell);
	}
	return cell;
};
mxGraph.prototype.getSwimlaneAt = function(x, y, parent) {
	parent = parent || this.getDefaultParent();
	if (parent != null) {
		var childCount = this.model.getChildCount(parent);
		for (var i = 0; i < childCount; i++) {
			var child = this.model.getChildAt(parent, i);
			var result = this.getSwimlaneAt(x, y, child);
			if (result != null) {
				return result;
			} else if (this.isSwimlane(child)) {
				var state = this.view.getState(child);
				if (this.intersects(state, x, y)) {
					return child;
				}
			}
		}
	}
	return null;
};
mxGraph.prototype.getCellAt = function(x, y, parent, vertices, edges) {
	vertices = vertices || true;
	edges = edges || true;
	parent = parent || this.getDefaultParent();
	if (parent != null) {
		var childCount = this.model.getChildCount(parent);
		for (var i = childCount - 1; i >= 0; i--) {
			var cell = this.model.getChildAt(parent, i);
			var result = this.getCellAt(x, y, cell, vertices, edges);
			if (result != null) {
				return result;
			} else if (this.isCellVisible(cell) && (edges && this.model.isEdge(cell) || vertices && this.model.isVertex(cell))) {
				var state = this.view.getState(cell);
				if (this.intersects(state, x, y)) {
					return cell;
				}
			}
		}
	}
	return null;
};
mxGraph.prototype.intersects = function(state, x, y) {
	if (state != null) {
		var pts = state.absolutePoints;
		if (pts != null) {
			var t2 = this.tolerance * this.tolerance;
			var pt = pts[0];
			for (var i = 1; i < pts.length; i++) {
				var next = pts[i];
				var dist = mxUtils.ptSegDistSq(pt.x, pt.y, next.x, next.y, x, y);
				if (dist <= t2) {
					return true;
				}
				pt = next;
			}
		} else if (mxUtils.contains(state, x, y)) {
			return true;
		}
	}
	return false;
};
mxGraph.prototype.hitsSwimlaneContent = function(swimlane, x, y) {
	var state = this.getView().getState(swimlane);
	var size = this.getStartSize(swimlane);
	if (state != null) {
		var scale = this.getView().getScale();
		x -= state.x;
		y -= state.y;
		if (size.width > 0 && x > 0 && x > size.width * scale) {
			return true;
		} else if (size.height > 0 && y > 0 && y > size.height * scale) {
			return true;
		}
	}
	return false;
};
mxGraph.prototype.getChildVertices = function(parent) {
	return this.getChildCells(parent, true, false);
};
mxGraph.prototype.getChildEdges = function(parent) {
	return this.getChildCells(parent, false, true);
};
mxGraph.prototype.getChildCells = function(parent, vertices, edges) {
	parent = (parent != null) ? parent: this.getDefaultParent();
	vertices = (vertices != null) ? vertices: false;
	edges = (edges != null) ? edges: false;
	var cells = this.model.getChildCells(parent, vertices, edges);
	var result = [];
	for (var i = 0; i < cells.length; i++) {
		if (this.isCellVisible(cells[i])) {
			result.push(cells[i]);
		}
	}
	return result;
};
mxGraph.prototype.getConnections = function(cell, parent) {
	return this.getEdges(cell, parent, true, true, false);
};
mxGraph.prototype.getIncomingEdges = function(cell, parent) {
	return this.getEdges(cell, parent, true, false, false);
};
mxGraph.prototype.getOutgoingEdges = function(cell, parent) {
	return this.getEdges(cell, parent, false, true, false);
};
mxGraph.prototype.getEdges = function(cell, parent, incoming, outgoing, includeLoops) {
	incoming = (incoming != null) ? incoming: true;
	outgoing = (outgoing != null) ? outgoing: true;
	includeLoops = (includeLoops != null) ? includeLoops: true;
	var edges = [];
	var isCollapsed = this.isCellCollapsed(cell);
	var childCount = this.model.getChildCount(cell);
	for (var i = 0; i < childCount; i++) {
		var child = this.model.getChildAt(cell, i);
		if (isCollapsed || !this.isCellVisible(child)) {
			edges = edges.concat(this.model.getEdges(child, incoming, outgoing));
		}
	}
	edges = edges.concat(this.model.getEdges(cell, incoming, outgoing));
	var result = [];
	for (var i = 0; i < edges.length; i++) {
		var source = this.view.getVisibleTerminal(edges[i], true);
		var target = this.view.getVisibleTerminal(edges[i], false);
		if (includeLoops || ((source != target) && ((incoming && target == cell && (parent == null || this.model.getParent(source) == parent)) || (outgoing && source == cell && (parent == null || this.model.getParent(target) == parent))))) {
			result.push(edges[i]);
		}
	}
	return result;
};
mxGraph.prototype.getOpposites = function(edges, terminal, sources, targets) {
	sources = (sources != null) ? sources: true;
	targets = (targets != null) ? targets: true;
	var terminals = [];
	var hash = new Object();
	if (edges != null) {
		for (var i = 0; i < edges.length; i++) {
			var source = this.view.getVisibleTerminal(edges[i], true);
			var target = this.view.getVisibleTerminal(edges[i], false);
			if (source == terminal && target != null && target != terminal && targets) {
				var id = mxCellPath.create(target);
				if (hash[id] == null) {
					hash[id] = target;
					terminals.push(target);
				}
			} else if (target == terminal && source != null && source != terminal && sources) {
				var id = mxCellPath.create(source);
				if (hash[id] == null) {
					hash[id] = source;
					terminals.push(source);
				}
			}
		}
	}
	return terminals;
};
mxGraph.prototype.getEdgesBetween = function(source, target, directed) {
	directed = (directed != null) ? directed: false;
	var edges = this.getEdges(source);
	var result = [];
	for (var i = 0; i < edges.length; i++) {
		var src = this.view.getVisibleTerminal(edges[i], true);
		var trg = this.view.getVisibleTerminal(edges[i], false);
		if ((src == source && trg == target) || (!directed && src == target && trg == source)) {
			result.push(edges[i]);
		}
	}
	return result;
};
mxGraph.prototype.getPointForEvent = function(evt) {
	var p = mxUtils.convertPoint(this.container, evt.clientX, evt.clientY);
	var s = this.view.scale;
	var tr = this.view.translate;
	p.x = this.snap(p.x / s - tr.x - this.gridSize / 2);
	p.y = this.snap(p.y / s - tr.y - this.gridSize / 2);
	return p;
};
mxGraph.prototype.getCells = function(x, y, width, height, parent, result) {
	var result = result || [];
	if (width > 0 || height > 0) {
		var right = x + width;
		var bottom = y + height;
		parent = parent || this.getDefaultParent();
		if (parent != null) {
			var childCount = this.model.getChildCount(parent);
			for (var i = 0; i < childCount; i++) {
				var cell = this.model.getChildAt(parent, i);
				var state = this.view.getState(cell);
				if (this.isCellVisible(cell) && state != null) {
					if (state.x >= x && state.y >= y && state.x + state.width <= right && state.y + state.height <= bottom) {
						result.push(cell);
					} else {
						this.getCells(x, y, width, height, cell, result);
					}
				}
			}
		}
	}
	return result;
};
mxGraph.prototype.getCellsBeyond = function(x0, y0, parent, rightHalfpane, bottomHalfpane) {
	var result = [];
	if (rightHalfpane || bottomHalfpane) {
		if (parent == null) {
			parent = this.getDefaultParent();
		}
		if (parent != null) {
			var childCount = this.model.getChildCount(parent);
			for (var i = 0; i < childCount; i++) {
				var child = this.model.getChildAt(parent, i);
				var state = this.view.getState(child);
				if (this.isCellVisible(child) && state != null) {
					if ((!rightHalfpane || state.x >= x0) && (!bottomHalfpane || state.y >= y0)) {
						result.push(child);
					}
				}
			}
		}
	}
	return result;
};
mxGraph.prototype.findTreeRoots = function(parent, isolate, invert) {
	isolate = (isolate != null) ? isolate: false;
	invert = (invert != null) ? invert: false;
	var roots = [];
	if (parent != null) {
		var model = this.getModel();
		var childCount = model.getChildCount(parent);
		var best = null;
		var maxDiff = 0;
		for (var i = 0; i < childCount; i++) {
			var cell = model.getChildAt(parent, i);
			if (this.model.isVertex(cell) && this.isCellVisible(cell)) {
				var conns = this.getConnections(cell, (isolate) ? parent: null);
				var fanOut = 0;
				var fanIn = 0;
				for (var j = 0; j < conns.length; j++) {
					var src = this.view.getVisibleTerminal(conns[j], true);
					if (src == cell) {
						fanOut++;
					} else {
						fanIn++;
					}
				}
				if ((invert && fanOut == 0 && fanIn > 0) || (!invert && fanIn == 0 && fanOut > 0)) {
					roots.push(cell);
				}
				var diff = (invert) ? fanIn - fanOut: fanOut - fanIn;
				if (diff > maxDiff) {
					maxDiff = diff;
					best = cell;
				}
			}
		}
		if (roots.length == 0 && best != null) {
			roots.push(best);
		}
	}
	return roots;
};
mxGraph.prototype.traverse = function(vertex, directed, func, edge, visited) {
	if (func != null && vertex != null) {
		directed = (directed != null) ? directed: true;
		visited = visited || [];
		var id = mxCellPath.create(vertex);
		if (visited[id] == null) {
			visited[id] = vertex;
			var result = func(vertex, edge);
			if (result == null || result) {
				var edgeCount = this.model.getEdgeCount(vertex);
				if (edgeCount > 0) {
					for (var i = 0; i < edgeCount; i++) {
						var e = this.model.getEdgeAt(vertex, i);
						var isSource = this.model.getTerminal(e, true) == vertex;
						if (!directed || isSource) {
							var next = this.model.getTerminal(e, !isSource);
							this.traverse(next, directed, func, e, visited);
						}
					}
				}
			}
		}
	}
};
mxGraph.prototype.isCellSelected = function(cell) {
	return this.getSelectionModel().isSelected(cell);
};
mxGraph.prototype.isSelectionEmpty = function() {
	return this.getSelectionModel().isEmpty();
};
mxGraph.prototype.clearSelection = function() {
	return this.getSelectionModel().clear();
};
mxGraph.prototype.getSelectionCount = function() {
	return this.getSelectionModel().cells.length;
};
mxGraph.prototype.getSelectionCell = function() {
	return this.getSelectionModel().cells[0];
};
mxGraph.prototype.getSelectionCells = function() {
	return this.getSelectionModel().cells.slice();
};
mxGraph.prototype.setSelectionCell = function(cell) {
	this.getSelectionModel().setCell(cell);
};
mxGraph.prototype.setSelectionCells = function(cells) {
	this.getSelectionModel().setCells(cells);
};
mxGraph.prototype.addSelectionCell = function(cell) {
	this.getSelectionModel().addCell(cell);
};
mxGraph.prototype.addSelectionCells = function(cells) {
	this.getSelectionModel().addCells(cells);
};
mxGraph.prototype.removeSelectionCell = function(cell) {
	this.getSelectionModel().removeCell(cell);
};
mxGraph.prototype.removeSelectionCells = function(cells) {
	this.getSelectionModel().removeCells(cells);
};
mxGraph.prototype.selectRegion = function(rect, evt) {
	var cells = this.getCells(rect.x, rect.y, rect.width, rect.height);
	this.selectCellsForEvent(cells, evt);
	return cells;
};
mxGraph.prototype.selectNextCell = function() {
	this.selectCell(true);
};
mxGraph.prototype.selectPreviousCell = function() {
	this.selectCell();
};
mxGraph.prototype.selectParentCell = function() {
	this.selectCell(false, true);
};
mxGraph.prototype.selectChildCell = function() {
	this.selectCell(false, false, true);
};
mxGraph.prototype.selectCell = function(isNext, isParent, isChild) {
	var sel = this.selectionModel;
	var cell = (sel.cells.length > 0) ? sel.cells[0] : null;
	if (sel.cells.length > 1) {
		sel.clear();
	}
	var parent = (cell != null) ? this.model.getParent(cell) : this.getDefaultParent();
	var childCount = this.model.getChildCount(parent);
	if (cell == null && childCount > 0) {
		var child = this.model.getChildAt(parent, 0);
		this.setSelectionCell(child);
	} else if ((cell == null || isParent) && this.view.getState(parent) != null && this.model.getGeometry(parent) != null) {
		if (this.getCurrentRoot() != parent) {
			this.setSelectionCell(parent);
		}
	} else if (cell != null && isChild) {
		var tmp = this.model.getChildCount(cell);
		if (tmp > 0) {
			var child = this.model.getChildAt(cell, 0);
			this.setSelectionCell(child);
		}
	} else if (childCount > 0) {
		var i = parent.getIndex(cell);
		if (isNext) {
			i++;
			var child = this.model.getChildAt(parent, i % childCount);
			this.setSelectionCell(child);
		} else {
			i--;
			var index = (i < 0) ? childCount - 1 : i;
			var child = this.model.getChildAt(parent, index);
			this.setSelectionCell(child);
		}
	}
};
mxGraph.prototype.selectAll = function(parent) {
	parent = parent || this.getDefaultParent();
	var children = this.model.getChildren(parent);
	if (children != null) {
		this.setSelectionCells(children);
	}
};
mxGraph.prototype.selectVertices = function(parent) {
	this.selectCells(true, false, parent);
};
mxGraph.prototype.selectEdges = function(parent) {
	this.selectCells(false, true, parent);
};
mxGraph.prototype.selectCells = function(vertices, edges, parent) {
	parent = parent || this.getDefaultParent();
	var filter = mxUtils.bind(this,
	function(cell) {
		return this.view.getState(cell) != null && this.model.getChildCount(cell) == 0 && ((this.model.isVertex(cell) && vertices) || (this.model.isEdge(cell) && edges));
	});
	var cells = this.model.filterDescendants(filter, parent);
	this.setSelectionCells(cells);
};
mxGraph.prototype.selectCellForEvent = function(cell, evt) {
	var isSelected = this.isCellSelected(cell);
	if (this.isToggleEvent(evt)) {
		if (isSelected) {
			this.removeSelectionCell(cell);
		} else {
			this.addSelectionCell(cell);
		}
	} else if (!isSelected || this.getSelectionCount() != 1) {
		this.setSelectionCell(cell);
	}
};
mxGraph.prototype.selectCellsForEvent = function(cells, evt) {
	if (this.isToggleEvent(evt)) {
		this.addSelectionCells(cells);
	} else {
		this.setSelectionCells(cells);
	}
};
mxGraph.prototype.createHandler = function(state) {
	var result = null;
	if (state != null) {
		if (this.model.isEdge(state.cell)) {
			var style = this.view.getEdgeStyle(state);
			if (this.isLoop(state) || style == mxEdgeStyle.ElbowConnector || style == mxEdgeStyle.SideToSide || style == mxEdgeStyle.TopToBottom) {
				result = new mxElbowEdgeHandler(state);
			} else {
				result = new mxEdgeHandler(state);
			}
		} else {
			result = new mxVertexHandler(state);
		}
	}
	return result;
};
mxGraph.prototype.addMouseListener = function(listener) {
	if (this.mouseListeners == null) {
		this.mouseListeners = [];
	}
	this.mouseListeners.push(listener);
};
mxGraph.prototype.removeMouseListener = function(listener) {
	if (this.mouseListeners != null) {
		for (var i = 0; i < this.mouseListeners.length; i++) {
			if (this.mouseListeners[i] == listener) {
				this.mouseListeners.splice(i, 1);
				break;
			}
		}
	}
};
mxGraph.prototype.fireMouseEvent = function(evtName, me, sender) {
	if (sender == null) {
		sender = this;
	}
	if (evtName == mxEvent.MOUSE_DOWN) {
		this.isMouseDown = true;
	}
	if ((evtName != mxEvent.MOUSE_UP || this.isMouseDown) && me.getEvent().detail != 2) {
		if (evtName == mxEvent.MOUSE_UP) {
			this.isMouseDown = false;
		}
		if (!this.isEditing() && (false || false || false || me.getEvent().target != this.container)) {
			if (evtName == mxEvent.MOUSE_MOVE && this.isMouseDown && this.autoScroll) {
				var pt = mxUtils.convertPoint(this.container, me.getX(), me.getY());
				this.scrollPointToVisible(pt.x, pt.y, this.autoExtend);
			}
			if (this.mouseListeners != null) {
				var args = [sender, me];
				me.getEvent().returnValue = true;
				for (var i = 0; i < this.mouseListeners.length; i++) {
					var l = this.mouseListeners[i];
					if (evtName == mxEvent.MOUSE_DOWN) {
						l.mouseDown.apply(l, args);
					} else if (evtName == mxEvent.MOUSE_MOVE) {
						l.mouseMove.apply(l, args);
					} else if (evtName == mxEvent.MOUSE_UP) {
						l.mouseUp.apply(l, args);
					}
				}
			}
			if (evtName == mxEvent.MOUSE_UP) {
				this.click(me);
			}
		}
	} else if (evtName == mxEvent.MOUSE_UP) {
		this.isMouseDown = false;
	}
};
mxGraph.prototype.destroy = function() {
	if (!this.destroyed) {
		this.destroyed = true;
		if (this.tooltipHandler != null) {
			this.tooltipHandler.destroy();
		}
		if (this.selectionCellsHandler != null) {
			this.selectionCellsHandler.destroy();
		}
		if (this.panningHandler != null) {
			this.panningHandler.destroy();
		}
		if (this.connectionHandler != null) {
			this.connectionHandler.destroy();
		}
		if (this.graphHandler != null) {
			this.graphHandler.destroy();
		}
		if (this.cellEditor != null) {
			this.cellEditor.destroy();
		}
		if (this.view != null) {
			this.view.destroy();
		}
		if (this.focusHandler != null) {
			mxEvent.removeListener(document.body, 'focus', this.focusHandler);
			this.focusHandler = null;
		}
		if (this.blurHandler != null) {
			mxEvent.removeListener(document.body, 'blur', this.blurHandler);
			this.blurHandler = null;
		}
		this.container = null;
	}
};
function mxCellOverlay(image, tooltip, align, verticalAlign) {
	this.image = image;
	this.tooltip = tooltip;
	this.align = align;
	this.verticalAlign = verticalAlign;
};
mxCellOverlay.prototype = new mxEventSource();
mxCellOverlay.prototype.constructor = mxCellOverlay;
mxCellOverlay.prototype.image = null;
mxCellOverlay.prototype.tooltip = null;
mxCellOverlay.prototype.align = null;
mxCellOverlay.prototype.verticalAlign = null;
mxCellOverlay.prototype.defaultOverlap = 0.5;
mxCellOverlay.prototype.getBounds = function(state) {
	var isEdge = state.view.graph.getModel().isEdge(state.cell);
	var s = state.view.scale;
	var pt = null;
	var w = this.image.width;
	var h = this.image.height;
	if (isEdge) {
		var pts = state.absolutePoints;
		if (pts.length % 2 == 1) {
			pt = pts[Math.floor(pts.length / 2)];
		} else {
			var idx = pts.length / 2;
			var p0 = pts[idx - 1];
			var p1 = pts[idx];
			pt = new mxPoint(p0.x + (p1.x - p0.x) / 2, p0.y + (p1.y - p0.y) / 2);
		}
	} else {
		pt = new mxPoint();
		if (this.align == mxConstants.ALIGN_LEFT) {
			pt.x = state.x;
		} else if (this.align == mxConstants.ALIGN_CENTER) {
			pt.x = state.x + state.width / 2;
		} else {
			pt.x = state.x + state.width;
		}
		if (this.verticalAlign == mxConstants.ALIGN_TOP) {
			pt.y = state.y;
		} else if (this.verticalAlign == mxConstants.ALIGN_MIDDLE) {
			pt.y = state.y + state.height / 2;
		} else {
			pt.y = state.y + state.height;
		}
	}
	return new mxRectangle(pt.x - w * this.defaultOverlap * s, pt.y - h * this.defaultOverlap * s, w * s, h * s);
};
mxCellOverlay.prototype.toString = function() {
	return this.tooltip;
};
function mxOutline(source, container) {
	this.source = source;
	this.outline = new mxGraph(container, source.getModel(), this.graphRenderHint);
	if (false) {
		var node = this.outline.getView().getCanvas().parentNode;
		node.setAttribute('shape-rendering', 'optimizeSpeed');
		node.setAttribute('image-rendering', 'optimizeSpeed');
	}
	this.outline.setStylesheet(source.getStylesheet());
	this.outline.setEnabled(false);
	this.outline.labelsVisible = false;
	source.getModel().addListener(mxEvent.CHANGE, mxUtils.bind(this,
	function(sender, evt) {
		this.update();
	}));
	this.outline.addMouseListener(this);
	var funct = mxUtils.bind(this,
	function(sender) {
		if (!this.active) {
			this.update();
		}
	});
	this.source.getModel().addListener(mxEvent.CHANGE, funct);
	var view = this.source.getView();
	view.addListener(mxEvent.SCALE, funct);
	view.addListener(mxEvent.TRANSLATE, funct);
	view.addListener(mxEvent.SCALE_AND_TRANSLATE, funct);
	view.addListener(mxEvent.DOWN, funct);
	view.addListener(mxEvent.UP, funct);
	mxEvent.addListener(source.container, 'scroll', funct);
	source.addListener(mxEvent.REFRESH, mxUtils.bind(this,
	function(sender) {
		this.outline.setStylesheet(source.getStylesheet());
		this.outline.refresh();
	}));
	this.bounds = new mxRectangle(0, 0, 0, 0);
	this.selectionBorder = new mxRectangleShape(this.bounds, null, mxConstants.OUTLINE_COLOR, mxConstants.OUTLINE_STROKEWIDTH);
	this.selectionBorder.dialect = (this.outline.dialect != mxConstants.DIALECT_SVG) ? mxConstants.DIALECT_VML: mxConstants.DIALECT_SVG;
	this.selectionBorder.init(this.outline.getView().getOverlayPane());
	mxEvent.redirectMouseEvents(this.selectionBorder.node, this.outline);
	this.selectionBorder.node.style.background = '';
	this.sizer = new mxRectangleShape(this.bounds, mxConstants.OUTLINE_HANDLE_FILLCOLOR, mxConstants.OUTLINE_HANDLE_STROKECOLOR);
	this.sizer.dialect = this.outline.dialect;
	this.sizer.init(this.outline.getView().getOverlayPane());
	if (this.enabled) {
		this.sizer.node.style.cursor = 'pointer';
	}
	mxEvent.addListener(this.sizer.node, 'mousedown', mxUtils.bind(this,
	function(evt) {
		this.outline.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt));
	}));
	this.selectionBorder.node.style.display = (this.showViewport) ? '': 'none';
	this.sizer.node.style.display = this.selectionBorder.node.style.display;
	this.selectionBorder.node.style.cursor = 'move';
	this.refresh();
};
mxOutline.prototype.source = null;
mxOutline.prototype.outline = null;
mxOutline.prototype.graphRenderHint = mxConstants.RENDERING_HINT_FASTER;
mxOutline.prototype.enabled = true;
mxOutline.prototype.showViewport = true;
mxOutline.prototype.border = 10;
mxOutline.prototype.sizerSize = 4;
mxOutline.prototype.isEnabled = function() {
	return this.enabled;
};
mxOutline.prototype.setEnabled = function(value) {
	this.enabled = value;
};
mxOutline.prototype.setZoomEnabled = function(value) {
	this.sizer.node.style.visibility = (value) ? 'visible': 'hidden';
};
mxOutline.prototype.refresh = function() {
	this.update();
	this.outline.refresh();
};
mxOutline.prototype.update = function(revalidate) {
	var sourceScale = this.source.view.scale;
	var scaledGraphBounds = this.source.getGraphBounds();
	var unscaledGraphBounds = new mxRectangle(scaledGraphBounds.x / sourceScale, scaledGraphBounds.y / sourceScale, scaledGraphBounds.width / sourceScale, scaledGraphBounds.height / sourceScale);
	var x0 = Math.min(0, unscaledGraphBounds.x);
	var y0 = Math.min(0, unscaledGraphBounds.y);
	var unscaledFinderBounds = new mxRectangle( - x0, -y0, this.source.container.clientWidth / sourceScale, this.source.container.clientHeight / sourceScale);
	var union = unscaledGraphBounds;
	union.add(unscaledFinderBounds);
	var completeWidth = Math.max(this.source.container.scrollWidth / sourceScale, union.width + union.x);
	var completeHeight = Math.max(this.source.container.scrollHeight / sourceScale, union.height + union.y);
	var availableWidth = Math.max(0, this.outline.container.clientWidth - this.border);
	var availableHeight = Math.max(0, this.outline.container.clientHeight - this.border);
	var outlineScale = Math.min(availableWidth / completeWidth, availableHeight / completeHeight);
	var scale = outlineScale;
	if (scale > 0) {
		if (this.outline.getView().scale != scale) {
			this.outline.getView().scale = scale;
			revalidate = true;
		}
		var navView = this.outline.getView();
		if (navView.currentRoot != this.source.getView().currentRoot) {
			navView.setCurrentRoot(this.source.getView().currentRoot);
		}
		var t = this.source.view.translate;
		var tx = t.x;
		var ty = t.y;
		if (unscaledGraphBounds.x < 0) {
			tx = t.x - unscaledGraphBounds.x;
		}
		if (unscaledGraphBounds.y < 0) {
			ty = t.y - unscaledGraphBounds.y;
		}
		if (navView.translate.x != tx || navView.translate.y != ty) {
			navView.translate.x = tx;
			navView.translate.y = ty;
			revalidate = true;
		}
		var t2 = navView.translate;
		var scale = this.source.getView().scale;
		var scale2 = scale / navView.scale;
		var scale3 = 1.0 / navView.scale;
		var container = this.source.container;
		this.bounds = new mxRectangle((t2.x - t.x) / scale3, (t2.y - t.y) / scale3, (container.clientWidth / scale2), (container.clientHeight / scale2));
		this.bounds.x += this.source.container.scrollLeft * navView.scale / scale;
		this.bounds.y += this.source.container.scrollTop * navView.scale / scale;
		this.selectionBorder.bounds = this.bounds;
		this.selectionBorder.redraw();
		var s = this.sizerSize;
		this.sizer.bounds = new mxRectangle(this.bounds.x + this.bounds.width - s, this.bounds.y + this.bounds.height - s, 2 * s, 2 * s);
		this.sizer.redraw();
		if (revalidate) {
			this.outline.view.revalidate();
		}
	}
};
mxOutline.prototype.mouseDown = function(sender, me) {
	if (this.enabled && this.showViewport) {
		this.zoom = me.isSource(this.sizer);
		this.startX = me.getX();
		this.startY = me.getY();
		this.active = true;
		if (this.source.useScrollbarsForPanning && mxUtils.hasScrollbars(this.source.container)) {
			this.dx0 = this.source.container.scrollLeft;
			this.dy0 = this.source.container.scrollTop;
		} else {
			this.dx0 = 0;
			this.dy0 = 0;
		}
	}
	me.consume();
};
mxOutline.prototype.mouseMove = function(sender, me) {
	if (this.active) {
		this.selectionBorder.node.style.display = (this.showViewport) ? '': 'none';
		this.sizer.node.style.display = this.selectionBorder.node.style.display;
		var dx = me.getX() - this.startX;
		var dy = me.getY() - this.startY;
		var bounds = null;
		if (!this.zoom) {
			var scale = this.outline.getView().scale;
			bounds = new mxRectangle(this.bounds.x + dx, this.bounds.y + dy, this.bounds.width, this.bounds.height);
			this.selectionBorder.bounds = bounds;
			this.selectionBorder.redraw();
			dx /= scale;
			dx *= this.source.getView().scale;
			dy /= scale;
			dy *= this.source.getView().scale;
			this.source.panGraph( - dx - this.dx0, -dy - this.dy0);
		} else {
			var container = this.source.container;
			var viewRatio = container.clientWidth / container.clientHeight;
			dy = dx / viewRatio;
			bounds = new mxRectangle(this.bounds.x, this.bounds.y, Math.max(1, this.bounds.width + dx), Math.max(1, this.bounds.height + dy));
			this.selectionBorder.bounds = bounds;
			this.selectionBorder.redraw();
		}
		var s = this.sizerSize;
		this.sizer.bounds = new mxRectangle(bounds.x + bounds.width - s, bounds.y + bounds.height - s, 2 * s, 2 * s);
		this.sizer.redraw();
		me.consume();
	}
};
mxOutline.prototype.mouseUp = function(sender, me) {
	if (this.active) {
		var dx = me.getX() - this.startX;
		var dy = me.getY() - this.startY;
		if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
			if (!this.zoom) {
				if (!this.source.useScrollbarsForPanning || !mxUtils.hasScrollbars(this.source.container)) {
					this.source.panGraph(0, 0);
					dx /= this.outline.getView().scale;
					dy /= this.outline.getView().scale;
					var t = this.source.getView().translate;
					this.source.getView().setTranslate(t.x - dx, t.y - dy);
				}
			} else {
				var w = this.selectionBorder.bounds.width;
				var h = this.selectionBorder.bounds.height;
				var scale = this.source.getView().scale;
				this.source.getView().setScale(scale - (dx * scale) / w);
			}
			this.update();
			me.consume();
		}
		this.index = null;
		this.active = false;
	}
};
function mxMultiplicity(source, type, attr, value, min, max, validNeighbors, countError, typeError, validNeighborsAllowed) {
	this.source = source;
	this.type = type;
	this.attr = attr;
	this.value = value;
	this.min = (min != null) ? min: 0;
	this.max = (max != null) ? max: 'n';
	this.validNeighbors = validNeighbors;
	this.countError = mxResources.get(countError) || countError;
	this.typeError = mxResources.get(typeError) || typeError;
	this.validNeighborsAllowed = (validNeighborsAllowed != null) ? validNeighborsAllowed: true;
};
mxMultiplicity.prototype.type = null;
mxMultiplicity.prototype.attr = null;
mxMultiplicity.prototype.value = null;
mxMultiplicity.prototype.source = null;
mxMultiplicity.prototype.min = null;
mxMultiplicity.prototype.max = null;
mxMultiplicity.prototype.validNeighbors = null;
mxMultiplicity.prototype.validNeighborsAllowed = true;
mxMultiplicity.prototype.countError = null;
mxMultiplicity.prototype.typeError = null;
mxMultiplicity.prototype.check = function(graph, edge, source, target, sourceOut, targetIn) {
	var sourceValue = graph.model.getValue(source);
	var targetValue = graph.model.getValue(target);
	var error = '';
	if ((this.source && this.checkType(graph, sourceValue, this.type, this.attr, this.value)) || (!this.source && this.checkType(graph, targetValue, this.type, this.attr, this.value))) {
		if (this.countError != null && ((this.source && (this.max == 0 || (sourceOut >= this.max))) || (!this.source && (this.max == 0 || (targetIn >= this.max))))) {
			error += this.countError + '\n';
		}
		var valid = this.validNeighbors;
		if (valid != null && valid.length > 0) {
			var isValid = !this.validNeighborsAllowed;
			for (var j = 0; j < valid.length; j++) {
				if (this.source && this.checkType(graph, targetValue, valid[j])) {
					isValid = this.validNeighborsAllowed;
					break;
				} else if (!this.source && this.checkType(graph, sourceValue, valid[j])) {
					isValid = this.validNeighborsAllowed;
					break;
				}
			}
			if (!isValid && this.typeError != null) {
				error += this.typeError + '\n';
			}
		}
	}
	return (error.length > 0) ? error: null;
};
mxMultiplicity.prototype.checkType = function(graph, value, type, attr, attrValue) {
	if (value != null) {
		if (!isNaN(value.nodeType)) {
			return mxUtils.isNode(value, type, attr, attrValue);
		} else {
			return value == type;
		}
	}
	return false;
};
function mxLayoutManager(graph) {
	this.undoHandler = mxUtils.bind(this,
	function(sender, evt) {
		if (this.isEnabled()) {
			this.beforeUndo(evt.getProperty('edit'));
		}
	});
	this.moveHandler = mxUtils.bind(this,
	function(sender, evt) {
		if (this.isEnabled()) {
			this.cellsMoved(evt.getProperty('cells'), evt.getProperty('event'));
		}
	});
	this.setGraph(graph);
};
mxLayoutManager.prototype = new mxEventSource();
mxLayoutManager.prototype.constructor = mxLayoutManager;
mxLayoutManager.prototype.graph = null;
mxLayoutManager.prototype.bubbling = true;
mxLayoutManager.prototype.enabled = true;
mxLayoutManager.prototype.updateHandler = null;
mxLayoutManager.prototype.moveHandler = null;
mxLayoutManager.prototype.isEnabled = function() {
	return this.enabled;
};
mxLayoutManager.prototype.setEnabled = function(enabled) {
	this.enabled = enabled;
};
mxLayoutManager.prototype.isBubbling = function() {
	return this.bubbling;
};
mxLayoutManager.prototype.setBubbling = function(value) {
	this.bubbling = value;
};
mxLayoutManager.prototype.getGraph = function() {
	return this.graph;
};
mxLayoutManager.prototype.setGraph = function(graph) {
	if (this.graph != null) {
		var model = this.graph.getModel();
		model.removeListener(this.undoHandler);
		this.graph.removeListener(this.moveHandler);
	}
	this.graph = graph;
	if (this.graph != null) {
		var model = this.graph.getModel();
		model.addListener(mxEvent.BEFORE_UNDO, this.undoHandler);
		this.graph.addListener(mxEvent.MOVE_CELLS, this.moveHandler);
	}
};
mxLayoutManager.prototype.getLayout = function(parent) {
	return null;
};
mxLayoutManager.prototype.beforeUndo = function(undoableEdit) {
	var cells = this.getCellsForChanges(undoableEdit.changes);
	var model = this.getGraph().getModel();
	if (this.isBubbling()) {
		var tmp = model.getParents(cells);
		while (tmp.length > 0) {
			cells = cells.concat(tmp);
			tmp = model.getParents(tmp);
		}
	}
	this.layoutCells(mxUtils.sortCells(cells, false));
};
mxLayoutManager.prototype.cellsMoved = function(cells, evt) {
	if (cells != null && evt != null) {
		var point = mxUtils.convertPoint(this.getGraph().container, evt.clientX, evt.clientY);
		var model = this.getGraph().getModel();
		for (var i = 0; i < cells.length; i++) {
			var layout = this.getLayout(model.getParent(cells[i]));
			if (layout != null) {
				layout.moveCell(cells[i], point.x, point.y);
			}
		}
	}
};
mxLayoutManager.prototype.getCellsForChanges = function(changes) {
	var result = [];
	var hash = new Object();
	for (var i = 0; i < changes.length; i++) {
		var change = changes[i];
		if (change instanceof mxRootChange) {
			return [];
		} else {
			var cells = this.getCellsForChange(change);
			for (var j = 0; j < cells.length; j++) {
				if (cells[j] != null) {
					var id = mxCellPath.create(cells[j]);
					if (hash[id] == null) {
						hash[id] = cells[j];
						result.push(cells[j]);
					}
				}
			}
		}
	}
	return result;
};
mxLayoutManager.prototype.getCellsForChange = function(change) {
	var model = this.getGraph().getModel();
	if (change.constructor == mxChildChange) {
		return [change.child, change.previous, model.getParent(change.child)];
	} else if (change.constructor == mxTerminalChange || change.constructor == mxGeometryChange) {
		return [change.cell, model.getParent(change.cell)];
	}
	return [];
};
mxLayoutManager.prototype.layoutCells = function(cells) {
	if (cells.length > 0) {
		var model = this.getGraph().getModel();
		model.beginUpdate();
		try {
			var last = null;
			for (var i = 0; i < cells.length; i++) {
				if (cells[i] != model.getRoot() && cells[i] != last) {
					last = cells[i];
					this.executeLayout(this.getLayout(last), last);
				}
			}
			this.fireEvent(new mxEventObject(mxEvent.LAYOUT_CELLS, 'cells', cells));
		} finally {
			model.endUpdate();
		}
	}
};
mxLayoutManager.prototype.executeLayout = function(layout, parent) {
	if (layout != null && parent != null) {
		layout.execute(parent);
	}
};
mxLayoutManager.prototype.destroy = function() {
	this.setGraph(null);
};
function mxSpaceManager(graph, shiftRightwards, shiftDownwards, extendParents) {
	this.resizeHandler = mxUtils.bind(this,
	function(sender, evt) {
		if (this.isEnabled()) {
			this.cellsResized(evt.getProperty('cells'));
		}
	});
	this.foldHandler = mxUtils.bind(this,
	function(sender, evt) {
		if (this.isEnabled()) {
			this.cellsResized(evt.getProperty('cells'));
		}
	});
	this.shiftRightwards = (shiftRightwards != null) ? shiftRightwards: true;
	this.shiftDownwards = (shiftDownwards != null) ? shiftDownwards: true;
	this.extendParents = (extendParents != null) ? extendParents: true;
	this.setGraph(graph);
};
mxSpaceManager.prototype = new mxEventSource();
mxSpaceManager.prototype.constructor = mxSpaceManager;
mxSpaceManager.prototype.graph = null;
mxSpaceManager.prototype.enabled = true;
mxSpaceManager.prototype.shiftRightwards = true;
mxSpaceManager.prototype.shiftDownwards = true;
mxSpaceManager.prototype.extendParents = true;
mxSpaceManager.prototype.resizeHandler = null;
mxSpaceManager.prototype.foldHandler = null;
mxSpaceManager.prototype.isCellIgnored = function(cell) {
	return ! this.getGraph().getModel().isVertex(cell);
};
mxSpaceManager.prototype.isCellShiftable = function(cell) {
	return this.getGraph().getModel().isVertex(cell) && this.getGraph().isCellMovable(cell);
};
mxSpaceManager.prototype.isEnabled = function() {
	return this.enabled;
};
mxSpaceManager.prototype.setEnabled = function(value) {
	this.enabled = value;
};
mxSpaceManager.prototype.isShiftRightwards = function() {
	return this.shiftRightwards;
};
mxSpaceManager.prototype.setShiftRightwards = function(value) {
	this.shiftRightwards = value;
};
mxSpaceManager.prototype.isShiftDownwards = function() {
	return this.shiftDownwards;
};
mxSpaceManager.prototype.setShiftDownwards = function(value) {
	this.shiftDownwards = value;
};
mxSpaceManager.prototype.isExtendParents = function() {
	return this.extendParents;
};
mxSpaceManager.prototype.setExtendParents = function(value) {
	this.extendParents = value;
};
mxSpaceManager.prototype.getGraph = function() {
	return this.graph;
};
mxSpaceManager.prototype.setGraph = function(graph) {
	if (this.graph != null) {
		this.graph.removeListener(this.resizeHandler);
		this.graph.removeListener(this.foldHandler);
	}
	this.graph = graph;
	if (this.graph != null) {
		this.graph.addListener(mxEvent.RESIZE_CELLS, this.resizeHandler);
		this.graph.addListener(mxEvent.FOLD_CELLS, this.foldHandler);
	}
};
mxSpaceManager.prototype.cellsResized = function(cells) {
	if (cells != null) {
		var model = this.graph.getModel();
		model.beginUpdate();
		try {
			for (var i = 0; i < cells.length; i++) {
				if (!this.isCellIgnored(cells[i])) {
					this.cellResized(cells[i]);
					break;
				}
			}
		} finally {
			model.endUpdate();
		}
	}
};
mxSpaceManager.prototype.cellResized = function(cell) {
	var graph = this.getGraph();
	var view = graph.getView();
	var model = graph.getModel();
	var state = view.getState(cell);
	var pstate = view.getState(model.getParent(cell));
	if (state != null && pstate != null) {
		var cells = this.getCellsToShift(state);
		var geo = model.getGeometry(cell);
		if (cells != null && geo != null) {
			var tr = view.translate;
			var scale = view.scale;
			var x0 = state.x - pstate.origin.x - tr.x * scale;
			var y0 = state.y - pstate.origin.y - tr.y * scale;
			var right = state.x + state.width;
			var bottom = state.y + state.height;
			var dx = state.width - geo.width * scale + x0 - geo.x * scale;
			var dy = state.height - geo.height * scale + y0 - geo.y * scale;
			var fx = 1 - geo.width * scale / state.width;
			var fy = 1 - geo.height * scale / state.height;
			model.beginUpdate();
			try {
				for (var i = 0; i < cells.length; i++) {
					if (cells[i] != cell && this.isCellShiftable(cells[i])) {
						this.shiftCell(cells[i], dx, dy, x0, y0, right, bottom, fx, fy, this.isExtendParents() && graph.isExtendParent(cells[i]));
					}
				}
			} finally {
				model.endUpdate();
			}
		}
	}
};
mxSpaceManager.prototype.shiftCell = function(cell, dx, dy, Ox0, y0, right, bottom, fx, fy, extendParent) {
	var graph = this.getGraph();
	var state = graph.getView().getState(cell);
	if (state != null) {
		var model = graph.getModel();
		var geo = model.getGeometry(cell);
		if (geo != null) {
			model.beginUpdate();
			try {
				if (this.isShiftRightwards()) {
					if (state.x >= right) {
						geo = geo.clone();
						geo.translate( - dx, 0);
					} else {
						var tmpDx = Math.max(0, state.x - x0);
						geo = geo.clone();
						geo.translate( - fx * tmpDx, 0);
					}
				}
				if (this.isShiftDownwards()) {
					if (state.y >= bottom) {
						geo = geo.clone();
						geo.translate(0, -dy);
					} else {
						var tmpDy = Math.max(0, state.y - y0);
						geo = geo.clone();
						geo.translate(0, -fy * tmpDy);
					}
				}
				if (geo != model.getGeometry(cell)) {
					model.setGeometry(cell, geo);
					if (extendParent) {
						graph.extendParent(cell);
					}
				}
			} finally {
				model.endUpdate();
			}
		}
	}
};
mxSpaceManager.prototype.getCellsToShift = function(state) {
	var graph = this.getGraph();
	var parent = graph.getModel().getParent(state.cell);
	var down = this.isShiftDownwards();
	var right = this.isShiftRightwards();
	return graph.getCellsBeyond(state.x + ((down) ? 0 : state.width), state.y + ((down && right) ? 0 : state.height), parent, right, down);
};
mxSpaceManager.prototype.destroy = function() {
	this.setGraph(null);
};
function mxSwimlaneManager(graph, horizontal, siblings, bubbling) {
	this.addHandler = mxUtils.bind(this,
	function(sender, evt) {
		if (this.isEnabled()) {
			this.cellsAdded(evt.getProperty('cells'));
		}
	});
	this.resizeHandler = mxUtils.bind(this,
	function(sender, evt) {
		if (this.isEnabled()) {
			this.cellsResized(evt.getProperty('cells'));
		}
	});
	this.horizontal = (horizontal != null) ? horizontal: true;
	this.siblings = (siblings != null) ? siblings: true;
	this.bubbling = (bubbling != null) ? bubbling: true;
	this.setGraph(graph);
};
mxSwimlaneManager.prototype = new mxEventSource();
mxSwimlaneManager.prototype.constructor = mxSwimlaneManager;
mxSwimlaneManager.prototype.graph = null;
mxSwimlaneManager.prototype.enabled = true;
mxSwimlaneManager.prototype.horizontal = true;
mxSwimlaneManager.prototype.siblings = true;
mxSwimlaneManager.prototype.bubbling = true;
mxSwimlaneManager.prototype.addHandler = null;
mxSwimlaneManager.prototype.resizeHandler = null;
mxSwimlaneManager.prototype.isSwimlaneIgnored = function(swimlane) {
	return ! this.getGraph().isSwimlane(swimlane);
};
mxSwimlaneManager.prototype.isEnabled = function() {
	return this.enabled;
};
mxSwimlaneManager.prototype.setEnabled = function(value) {
	this.enabled = value;
};
mxSwimlaneManager.prototype.isHorizontal = function() {
	return this.horizontal;
};
mxSwimlaneManager.prototype.setHorizontal = function(value) {
	this.horizontal = value;
};
mxSwimlaneManager.prototype.isSiblings = function() {
	return this.siblings;
};
mxSwimlaneManager.prototype.setSiblings = function(value) {
	this.siblings = value;
};
mxSwimlaneManager.prototype.isBubbling = function() {
	return this.bubbling;
};
mxSwimlaneManager.prototype.setBubbling = function(value) {
	this.bubbling = value;
};
mxSwimlaneManager.prototype.getGraph = function() {
	return this.graph;
};
mxSwimlaneManager.prototype.setGraph = function(graph) {
	if (this.graph != null) {
		this.graph.removeListener(this.addHandler);
		this.graph.removeListener(this.resizeHandler);
	}
	this.graph = graph;
	if (this.graph != null) {
		this.graph.addListener(mxEvent.ADD_CELLS, this.addHandler);
		this.graph.addListener(mxEvent.CELLS_RESIZED, this.resizeHandler);
	}
};
mxSwimlaneManager.prototype.cellsAdded = function(cells) {
	if (cells != null) {
		var model = this.getGraph().getModel();
		model.beginUpdate();
		try {
			for (var i = 0; i < cells.length; i++) {
				if (!this.isSwimlaneIgnored(cells[i])) {
					this.swimlaneAdded(cells[i]);
				}
			}
		} finally {
			model.endUpdate();
		}
	}
};
mxSwimlaneManager.prototype.swimlaneAdded = function(swimlane) {
	var model = this.getGraph().getModel();
	var geo = null;
	var parent = model.getParent(swimlane);
	var childCount = model.getChildCount(parent);
	for (var i = 0; i < childCount; i++) {
		var child = model.getChildAt(parent, i);
		if (child != swimlane && !this.isSwimlaneIgnored(child)) {
			geo = model.getGeometry(child);
			break;
		}
	}
	if (geo != null) {
		this.resizeSwimlane(swimlane, geo.width, geo.height);
	}
};
mxSwimlaneManager.prototype.cellsResized = function(cells) {
	if (cells != null) {
		var model = this.getGraph().getModel();
		model.beginUpdate();
		try {
			for (var i = 0; i < cells.length; i++) {
				if (!this.isSwimlaneIgnored(cells[i])) {
					this.swimlaneResized(cells[i]);
				}
			}
		} finally {
			model.endUpdate();
		}
	}
};
mxSwimlaneManager.prototype.swimlaneResized = function(swimlane) {
	var model = this.getGraph().getModel();
	var geo = model.getGeometry(swimlane);
	if (geo != null) {
		var w = geo.width;
		var h = geo.height;
		model.beginUpdate();
		try {
			var parent = model.getParent(swimlane);
			if (this.isSiblings()) {
				var childCount = model.getChildCount(parent);
				for (var i = 0; i < childCount; i++) {
					var child = model.getChildAt(parent, i);
					if (child != swimlane && !this.isSwimlaneIgnored(child)) {
						this.resizeSwimlane(child, w, h);
					}
				}
			}
			if (this.isBubbling() && !this.isSwimlaneIgnored(parent)) {
				this.resizeParent(parent, w, h);
				this.swimlaneResized(parent);
			}
		} finally {
			model.endUpdate();
		}
	}
};
mxSwimlaneManager.prototype.resizeSwimlane = function(swimlane, w, h) {
	var model = this.getGraph().getModel();
	var geo = model.getGeometry(swimlane);
	if (geo != null) {
		geo = geo.clone();
		if (this.isHorizontal()) {
			geo.width = w;
		} else {
			geo.height = h;
		}
		model.setGeometry(swimlane, geo);
	}
};
mxSwimlaneManager.prototype.resizeParent = function(parent, w, h) {
	var graph = this.getGraph();
	var model = graph.getModel();
	var geo = model.getGeometry(parent);
	if (geo != null) {
		geo = geo.clone();
		var size = (this.graph.isSwimlane(parent)) ? this.graph.getStartSize(parent) : new mxRectangle();
		if (this.isHorizontal()) {
			geo.width = w + size.width;
		} else {
			geo.height = h + size.height;
		}
		model.setGeometry(parent, geo);
	}
};
mxSwimlaneManager.prototype.destroy = function() {
	this.setGraph(null);
};
function mxTemporaryCellStates(view, scale, cells) {
	this.view = view;
	scale = (scale != null) ? scale: 1;
	this.oldBounds = view.getGraphBounds();
	this.oldStates = view.getStates();
	this.oldScale = view.getScale();
	view.setStates(new mxDictionary());
	view.setScale(scale);
	if (cells != null) {
		var state = view.createState(new mxCell());
		for (var i = 0; i < cells.length; i++) {
			view.validateBounds(state, cells[i]);
		}
		var bbox = null;
		for (var i = 0; i < cells.length; i++) {
			var bounds = view.validatePoints(state, cells[i]);
			if (bbox == null) {
				bbox = bounds;
			} else {
				bbox.add(bounds);
			}
		}
		if (bbox == null) {
			bbox = new mxRectangle();
		}
		view.setGraphBounds(bbox);
	}
};
mxTemporaryCellStates.prototype.view = null;
mxTemporaryCellStates.prototype.oldStates = null;
mxTemporaryCellStates.prototype.oldBounds = null;
mxTemporaryCellStates.prototype.oldScale = null;
mxTemporaryCellStates.prototype.destroy = function() {
	this.view.setScale(this.oldScale);
	this.view.setStates(this.oldStates);
	this.view.setGraphBounds(this.oldBounds);
};
function mxCellStatePreview(graph) {
	this.graph = graph;
	this.deltas = new Object();
};
mxCellStatePreview.prototype.graph = null;
mxCellStatePreview.prototype.deltas = null;
mxCellStatePreview.prototype.count = 0;
mxCellStatePreview.prototype.isEmpty = function() {
	return this.count == 0;
};
mxCellStatePreview.prototype.moveState = function(state, dx, dy, add, includeEdges) {
	add = (add != null) ? add: true;
	includeEdges = (includeEdges != null) ? includeEdges: true;
	var id = mxCellPath.create(state.cell);
	var delta = this.deltas[id];
	if (delta == null) {
		delta = new mxPoint(dx, dy);
		this.deltas[id] = delta;
		this.count++;
	} else {
		if (add) {
			delta.X += dx;
			delta.Y += dy;
		} else {
			delta.X = dx;
			delta.Y = dy;
		}
	}
	if (includeEdges) {
		this.addEdges(state);
	}
	return delta;
};
mxCellStatePreview.prototype.show = function(visitor) {
	var model = this.graph.getModel();
	var root = model.getRoot();
	for (var id in this.deltas) {
		var cell = mxCellPath.resolve(root, id);
		var state = this.graph.view.getState(cell);
		var delta = this.deltas[id];
		var parentState = this.graph.view.getState(model.getParent(cell));
		this.translateState(parentState, state, delta.x, delta.y);
	}
	for (var id in this.deltas) {
		var cell = mxCellPath.resolve(root, id);
		var state = this.graph.view.getState(cell);
		var delta = this.deltas[id];
		var parentState = this.graph.view.getState(model.getParent(cell));
		this.revalidateState(parentState, state, delta.x, delta.y, visitor);
	}
};
mxCellStatePreview.prototype.translateState = function(parentState, state, dx, dy) {
	if (state != null) {
		var model = this.graph.getModel();
		if (model.isVertex(state.cell)) {
			state.invalid = true;
			this.graph.view.validateBounds(parentState, state.cell);
			var geo = model.getGeometry(state.cell);
			var id = mxCellPath.create(state.cell);
			if (geo != null && (dx != 0 || dy != 0) && (!geo.relative || this.deltas[id] != null)) {
				state.x += dx;
				state.y += dy;
			}
		}
		var childCount = model.getChildCount(state.cell);
		for (var i = 0; i < childCount; i++) {
			this.translateState(state, this.graph.view.getState(model.getChildAt(state.cell, i)), dx, dy);
		}
	}
};
mxCellStatePreview.prototype.revalidateState = function(parentState, state, dx, dy, visitor) {
	if (state != null) {
		state.invalid = true;
		this.graph.view.validatePoints(parentState, state.cell);
		var id = mxCellPath.create(state.cell);
		var model = this.graph.getModel();
		var geo = model.getGeometry(state.cell);
		if (geo != null && dx != 0 && dy != 0 && model.isVertex(state.cell) && geo.relative && this.deltas[id] != null) {
			state.x += dx;
			state.y += dy;
			this.graph.view.updateLabelBounds(state);
			this.graph.cellRenderer.redraw(state);
		}
		if (visitor != null) {
			visitor(state);
		}
		var childCount = model.getChildCount(state.cell);
		for (var i = 0; i < childCount; i++) {
			this.revalidateState(state, this.graph.view.getState(model.getChildAt(state.cell, i)), dx, dy, visitor);
		}
	}
};
mxCellStatePreview.prototype.addEdges = function(state) {
	var model = this.graph.getModel();
	var edgeCount = model.getEdgeCount(state.cell);
	for (var i = 0; i < edgeCount; i++) {
		var s = this.graph.view.getState(model.getEdgeAt(state.cell, i));
		if (s != null) {
			this.moveState(s, 0, 0);
		}
	}
};
function mxConnectionConstraint(point, perimeter) {
	this.point = point;
	this.perimeter = (perimeter != null) ? perimeter: true;
};
mxConnectionConstraint.prototype.point = null;
mxConnectionConstraint.prototype.perimeter = null;
