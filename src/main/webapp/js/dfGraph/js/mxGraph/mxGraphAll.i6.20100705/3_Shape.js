function mxShape() {};
mxShape.prototype.SVG_STROKE_TOLERANCE = 8;
mxShape.prototype.scale = 1;
mxShape.prototype.dialect = null;
mxShape.prototype.crisp = false;
mxShape.prototype.mixedModeHtml = true;
mxShape.prototype.preferModeHtml = true;
mxShape.prototype.bounds = null;
mxShape.prototype.points = null;
mxShape.prototype.node = null;
mxShape.prototype.label = null;
mxShape.prototype.innerNode = null;
mxShape.prototype.style = null;
mxShape.prototype.startOffset = null;
mxShape.prototype.endOffset = null;
mxShape.prototype.init = function(container) {
	if (this.node == null) {
		this.node = this.create(container);
		if (container != null) {
			container.appendChild(this.node);
		}
	}
	this.redraw();
	if (this.insertGradientNode != null) {
		this.insertGradient(this.insertGradientNode);
		this.insertGradientNode = null;
	}
};
mxShape.prototype.insertGradient = function(node) {
	if (node != null) {
		var count = 0;
		var id = node.getAttribute('id');
		var gradient = document.getElementById(id);
		while (gradient != null && gradient.ownerSVGElement != this.node.ownerSVGElement) {
			count++;
			id = node.getAttribute('id') + '-' + count;
			gradient = document.getElementById(id);
		}
		if (gradient == null) {
			node.setAttribute('id', id);
			this.node.ownerSVGElement.appendChild(node);
			gradient = node;
		}
		if (gradient != null) {
			var ref = 'url(#' + id + ')';
			var tmp = (this.innerNode != null) ? this.innerNode: this.node;
			if (tmp != null && tmp.getAttribute('fill') != ref) {
				tmp.setAttribute('fill', ref);
			}
		}
	}
};
mxShape.prototype.isMixedModeHtml = function() {
	return this.mixedModeHtml && !this.isRounded && !this.isShadow && this.gradient == null;
};
mxShape.prototype.create = function(container) {
	var node = null;
	if (this.dialect == mxConstants.DIALECT_SVG) {
		node = this.createSvg();
	} else if (this.dialect == mxConstants.DIALECT_STRICTHTML || (this.preferModeHtml && this.dialect == mxConstants.DIALECT_PREFERHTML) || (this.isMixedModeHtml() && this.dialect == mxConstants.DIALECT_MIXEDHTML)) {
		node = this.createHtml();
	} else {
		node = this.createVml();
	}
	return node;
};
mxShape.prototype.createHtml = function() {
	var node = document.createElement('DIV');
	this.configureHtmlShape(node);
	return node;
};
mxShape.prototype.destroy = function() {
	if (this.node != null) {
		mxEvent.release(this.node);
		if (this.node.parentNode != null) {
			this.node.parentNode.removeChild(this.node);
		}
		this.node = null;
	}
};
mxShape.prototype.apply = function(state) {
	var style = state.style;
	this.style = style;
	if (style != null) {
		this.fill = mxUtils.getValue(style, mxConstants.STYLE_FILLCOLOR, this.fill);
		this.gradient = mxUtils.getValue(style, mxConstants.STYLE_GRADIENTCOLOR, this.gradient);
		this.gradientDirection = mxUtils.getValue(style, mxConstants.STYLE_GRADIENT_DIRECTION, this.gradientDirection);
		this.opacity = mxUtils.getValue(style, mxConstants.STYLE_OPACITY, this.opacity);
		this.stroke = mxUtils.getValue(style, mxConstants.STYLE_STROKECOLOR, this.stroke);
		this.strokewidth = mxUtils.getValue(style, mxConstants.STYLE_STROKEWIDTH, this.strokewidth);
		this.isShadow = mxUtils.getValue(style, mxConstants.STYLE_SHADOW, this.isShadow);
		this.isDashed = mxUtils.getValue(style, mxConstants.STYLE_DASHED, this.isDashed);
		this.spacing = mxUtils.getValue(style, mxConstants.STYLE_SPACING, this.spacing);
		this.startSize = mxUtils.getValue(style, mxConstants.STYLE_STARTSIZE, this.startSize);
		this.endSize = mxUtils.getValue(style, mxConstants.STYLE_ENDSIZE, this.endSize);
		this.isRounded = mxUtils.getValue(style, mxConstants.STYLE_ROUNDED, this.isRounded);
		this.startArrow = mxUtils.getValue(style, mxConstants.STYLE_STARTARROW, this.startArrow);
		this.endArrow = mxUtils.getValue(style, mxConstants.STYLE_ENDARROW, this.endArrow);
		this.rotation = mxUtils.getValue(style, mxConstants.STYLE_ROTATION, this.rotation);
		this.direction = mxUtils.getValue(style, mxConstants.STYLE_DIRECTION, this.direction);
	}
};
mxShape.prototype.createSvgGroup = function(shape) {
	var g = document.createElementNS(mxConstants.NS_SVG, 'g');
	this.innerNode = document.createElementNS(mxConstants.NS_SVG, shape);
	this.configureSvgShape(this.innerNode);
	if (shape == 'rect' && this.strokewidth * this.scale >= 1 && !this.isRounded) {
		this.innerNode.setAttribute('shape-rendering', 'optimizeSpeed');
	}
	this.shadowNode = this.createSvgShadow(this.innerNode);
	if (this.shadowNode != null) {
		g.appendChild(this.shadowNode);
	}
	g.appendChild(this.innerNode);
	return g;
};
mxShape.prototype.createSvgShadow = function(node) {
	if (this.isShadow && this.fill != null) {
		var shadow = node.cloneNode(true);
		shadow.setAttribute('stroke', mxConstants.SHADOWCOLOR);
		shadow.setAttribute('fill', mxConstants.SHADOWCOLOR);
		shadow.setAttribute('transform', mxConstants.SVG_SHADOWTRANSFORM);
		return shadow;
	}
	return null;
};
mxShape.prototype.configureHtmlShape = function(node) {
	if (mxUtils.isVml(node)) {
		this.configureVmlShape(node);
	} else {
		node.style.position = 'absolute';
		node.style.overflow = 'hidden';
		var color = this.stroke;
		if (color != null && color != mxConstants.NONE) {
			node.style.borderColor = color;
			if (this.isDashed) {
				node.style.borderStyle = 'dashed';
			} else if (this.strokewidth > 0) {
				node.style.borderStyle = 'solid';
			}
			node.style.borderWidth = this.strokewidth + 'px';
		} else {
			node.style.borderWidth = '0px';
		}
		color = this.fill;
		node.style.background = '';
		if (color != null && color != mxConstants.NONE) {
			node.style.backgroundColor = color;
		} else if (this.points == null) {
			node.style.background = 'url(\'' + mxClient.imageBasePath + '/transparent.gif\')';
		}
		if (this.opacity != null) {
			mxUtils.setOpacity(node, this.opacity);
		}
	}
};
mxShape.prototype.configureVmlShape = function(node) {
	node.style.position = 'absolute';
	var color = this.stroke;
	if (color != null && color != mxConstants.NONE) {
		node.setAttribute('stroked', 'true');
		node.setAttribute('strokecolor', color);
	} else {
		node.setAttribute('stroked', 'false');
	}
	color = this.fill;
	node.style.background = '';
	if (color != null && color != mxConstants.NONE) {
		node.setAttribute('filled', 'true');
		node.setAttribute('fillcolor', color);
		if (node.fillNode == null) {
			node.fillNode = document.createElement('v:fill');
			node.appendChild(node.fillNode);
		}
		node.fillNode.setAttribute('color', color);
		if (this.gradient != null) {
			node.fillNode.setAttribute('type', 'gradient');
			node.fillNode.setAttribute('color2', this.gradient);
			var angle = '180';
			if (this.gradientDirection == mxConstants.DIRECTION_EAST) {
				angle = '270';
			} else if (this.gradientDirection == mxConstants.DIRECTION_WEST) {
				angle = '90';
			} else if (this.gradientDirection == mxConstants.DIRECTION_NORTH) {
				angle = '0';
			}
			node.fillNode.setAttribute('angle', angle);
		}
		if (this.opacity != null) {
			node.fillNode.setAttribute('opacity', this.opacity + '%');
			if (this.gradient != null) {
				node.fillNode.setAttribute('o:opacity2', this.opacity + '%');
			}
		}
	} else {
		node.setAttribute('filled', 'false');
		if (this.points == null) {
			this.configureTransparentVmlBackground(node);
		}
		if (node.fillNode != null) {
			mxEvent.release(node.fillNode);
			node.removeChild(node.fillNode);
			node.fillNode = null;
		}
	}
	if ((this.isDashed || this.opacity != null) && this.strokeNode == null) {
		this.strokeNode = document.createElement('v:stroke');
		node.appendChild(this.strokeNode);
	}
	if (this.strokeNode != null) {
		if (this.isDashed) {
			this.strokeNode.setAttribute('dashstyle', '2 2');
		} else {
			this.strokeNode.setAttribute('dashstyle', 'solid');
		}
		if (this.opacity != null) {
			this.strokeNode.setAttribute('opacity', this.opacity + '%');
		}
	}
	if (this.isShadow && this.fill != null) {
		if (this.shadowNode == null) {
			this.shadowNode = document.createElement('v:shadow');
			this.shadowNode.setAttribute('on', 'true');
			this.shadowNode.setAttribute('color', mxConstants.SHADOWCOLOR);
			node.appendChild(this.shadowNode);
		}
	}
	if (node.nodeName == 'roundrect') {
		try {
			node.setAttribute('arcsize', String(mxConstants.RECTANGLE_ROUNDING_FACTOR * 100) + '%');
		} catch(e) {}
	}
};
mxShape.prototype.configureTransparentVmlBackground = function(node) {
	node.style.background = 'url(\'' + mxClient.imageBasePath + '/transparent.gif\')';
};
mxShape.prototype.configureSvgShape = function(node) {
	var color = this.stroke;
	if (color != null && color != mxConstants.NONE) {
		node.setAttribute('stroke', color);
	} else {
		node.setAttribute('stroke', 'none');
	}
	color = this.fill;
	if (color != null && color != mxConstants.NONE) {
		if (this.gradient != null) {
			var id = this.getGradientId(color, this.gradient, this.opacity);
			if (this.gradientNode != null && this.gradientNode.getAttribute('id') != id) {
				this.gradientNode = null;
				node.setAttribute('fill', '');
			}
			if (this.gradientNode == null) {
				this.gradientNode = this.createSvgGradient(id, color, this.gradient, this.opacity, node);
				node.setAttribute('fill', 'url(#' + id + ')');
			}
		} else {
			this.gradientNode = null;
			node.setAttribute('fill', color);
		}
	} else {
		node.setAttribute('fill', 'none');
	}
	if (this.isDashed) {
		node.setAttribute('stroke-dasharray', '3, 3');
	}
	if (this.opacity != null) {
		node.setAttribute('fill-opacity', this.opacity / 100);
		node.setAttribute('stroke-opacity', this.opacity / 100);
	}
};
mxShape.prototype.getGradientId = function(start, end, opacity) {
	var op = (opacity != null) ? opacity: 100;
	var dir = null;
	if (this.gradientDirection == null || this.gradientDirection == mxConstants.DIRECTION_SOUTH) {
		dir = 'south';
	} else if (this.gradientDirection == mxConstants.DIRECTION_EAST) {
		dir = 'east';
	} else if (this.gradientDirection == mxConstants.DIRECTION_NORTH) {
		dir = 'north';
	} else if (this.gradientDirection == mxConstants.DIRECTION_WEST) {
		dir = 'west';
	}
	return '-mx-gradient-' + start + '-' + end + '-' + op + '-' + dir;
};
mxShape.prototype.createSvgGradient = function(id, start, end, opacity, node) {
	var op = (opacity != null) ? opacity: 100;
	var gradient = this.insertGradientNode;
	if (gradient == null) {
		var gradient = document.createElementNS(mxConstants.NS_SVG, 'linearGradient');
		gradient.setAttribute('id', id);
		gradient.setAttribute('x1', '0%');
		gradient.setAttribute('y1', '0%');
		gradient.setAttribute('x2', '0%');
		gradient.setAttribute('y2', '0%');
		if (this.gradientDirection == null || this.gradientDirection == mxConstants.DIRECTION_SOUTH) {
			gradient.setAttribute('y2', '100%');
		} else if (this.gradientDirection == mxConstants.DIRECTION_EAST) {
			gradient.setAttribute('x2', '100%');
		} else if (this.gradientDirection == mxConstants.DIRECTION_NORTH) {
			gradient.setAttribute('y1', '100%');
		} else if (this.gradientDirection == mxConstants.DIRECTION_WEST) {
			gradient.setAttribute('x1', '100%');
		}
		var stop = document.createElementNS(mxConstants.NS_SVG, 'stop');
		stop.setAttribute('offset', '0%');
		stop.setAttribute('style', 'stop-color:' + start + ';stop-opacity:' + (op / 100));
		gradient.appendChild(stop);
		stop = document.createElementNS(mxConstants.NS_SVG, 'stop');
		stop.setAttribute('offset', '100%');
		stop.setAttribute('style', 'stop-color:' + end + ';stop-opacity:' + (op / 100));
		gradient.appendChild(stop);
	}
	this.insertGradientNode = gradient;
	return gradient;
};
mxShape.prototype.createPoints = function(moveCmd, lineCmd, curveCmd, isRelative) {
	var offsetX = (isRelative) ? this.bounds.x: 0;
	var offsetY = (isRelative) ? this.bounds.y: 0;
	if (isNaN(this.points[0].x) || isNaN(this.points[0].y)) {
		return null;
	}
	var size = mxConstants.LINE_ARCSIZE * this.scale;
	var points = moveCmd + ' ' + Math.floor(this.points[0].x - offsetX) + ' ' + Math.floor(this.points[0].y - offsetY) + ' ';
	for (var i = 1; i < this.points.length; i++) {
		var pt = this.points[i];
		var p0 = this.points[i - 1];
		if (isNaN(pt.x) || isNaN(pt.y)) {
			return null;
		}
		if (i == 1 && this.startOffset != null) {
			p0 = p0.clone();
			p0.x += this.startOffset.x;
			p0.y += this.startOffset.y;
		} else if (i == this.points.length - 1 && this.endOffset != null) {
			pt = pt.clone();
			pt.x += this.endOffset.x;
			pt.y += this.endOffset.y;
		}
		var dx = p0.x - pt.x;
		var dy = p0.y - pt.y;
		if ((this.isRounded && i < this.points.length - 1) && (dx != 0 || dy != 0) && this.scale > 0.3) {
			var dist = Math.sqrt(dx * dx + dy * dy);
			var nx1 = dx * Math.min(size, dist / 2) / dist;
			var ny1 = dy * Math.min(size, dist / 2) / dist;
			points += lineCmd + ' ' + Math.floor(pt.x + nx1 - offsetX) + ' ' + Math.floor(pt.y + ny1 - offsetY) + ' ';
			var pe = this.points[i + 1];
			dx = pe.x - pt.x;
			dy = pe.y - pt.y;
			dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
			if (dist != 0) {
				var nx2 = dx * Math.min(size, dist / 2) / dist;
				var ny2 = dy * Math.min(size, dist / 2) / dist;
				points += curveCmd + ' ' + Math.floor(pt.x - offsetX) + ' ' + Math.floor(pt.y - offsetY) + ' ' + Math.floor(pt.x - offsetX) + ',' + Math.floor(pt.y - offsetY) + ' ' + Math.floor(pt.x + nx2 - offsetX) + ' ' + Math.floor(pt.y + ny2 - offsetY) + ' ';
			}
		} else {
			points += lineCmd + ' ' + Math.floor(pt.x - offsetX) + ' ' + Math.floor(pt.y - offsetY) + ' ';
		}
	}
	return points;
};
mxShape.prototype.updateHtmlShape = function(node) {
	if (node != null) {
		if (mxUtils.isVml(node)) {
			this.updateVmlShape(node);
		} else {
			node.style.borderWidth = Math.max(1, Math.floor(this.strokewidth * this.scale)) + 'px';
			if (this.bounds != null && !isNaN(this.bounds.x) && !isNaN(this.bounds.y) && !isNaN(this.bounds.width) && !isNaN(this.bounds.height)) {
				node.style.left = Math.floor(Math.max(0, this.bounds.x)) + 'px';
				node.style.top = Math.floor(Math.max(0, this.bounds.y)) + 'px';
				node.style.width = Math.floor(Math.max(0, this.bounds.width)) + 'px';
				node.style.height = Math.floor(Math.max(0, this.bounds.height)) + 'px';
			}
		}
		if (this.points != null && this.bounds != null && !mxUtils.isVml(node)) {
			if (this.divContainer == null) {
				this.divContainer = node;
			}
			while (this.divContainer.firstChild != null) {
				mxEvent.release(this.divContainer.firstChild);
				this.divContainer.removeChild(this.divContainer.firstChild);
			}
			node.style.borderStyle = '';
			node.style.background = '';
			if (this.points.length == 2) {
				var p0 = this.points[0];
				var pe = this.points[1];
				var dx = pe.x - p0.x;
				var dy = pe.y - p0.y;
				if (dx == 0 || dy == 0) {
					node.style.borderStyle = 'solid';
				} else {
					node.style.width = Math.floor(this.bounds.width + 1) + 'px';
					node.style.height = Math.floor(this.bounds.height + 1) + 'px';
					var length = Math.sqrt(dx * dx + dy * dy);
					var dotCount = 1 + (length / (8 * this.scale));
					var nx = dx / dotCount;
					var ny = dy / dotCount;
					var x = p0.x - this.bounds.x;
					var y = p0.y - this.bounds.y;
					for (var i = 0; i < dotCount; i++) {
						var tmp = document.createElement('DIV');
						tmp.style.position = 'absolute';
						tmp.style.overflow = 'hidden';
						tmp.style.left = Math.floor(x) + 'px';
						tmp.style.top = Math.floor(y) + 'px';
						tmp.style.width = Math.max(1, 2 * this.scale) + 'px';
						tmp.style.height = Math.max(1, 2 * this.scale) + 'px';
						tmp.style.backgroundColor = this.stroke;
						this.divContainer.appendChild(tmp);
						x += nx;
						y += ny;
					}
				}
			} else if (this.points.length == 3) {
				var mid = this.points[1];
				var n = '0';
				var s = '1';
				var w = '0';
				var e = '1';
				if (mid.x == this.bounds.x) {
					e = '0';
					w = '1';
				}
				if (mid.y == this.bounds.y) {
					n = '1';
					s = '0';
				}
				node.style.borderStyle = 'solid';
				node.style.borderWidth = n + ' ' + e + ' ' + s + ' ' + w + 'px';
			} else {
				node.style.width = Math.floor(this.bounds.width + 1) + 'px';
				node.style.height = Math.floor(this.bounds.height + 1) + 'px';
				var last = this.points[0];
				for (var i = 1; i < this.points.length; i++) {
					var next = this.points[i];
					var tmp = document.createElement('DIV');
					tmp.style.position = 'absolute';
					tmp.style.overflow = 'hidden';
					tmp.style.borderColor = this.stroke;
					tmp.style.borderStyle = 'solid';
					tmp.style.borderWidth = '1 0 0 1px';
					var x = Math.min(next.x, last.x) - this.bounds.x;
					var y = Math.min(next.y, last.y) - this.bounds.y;
					var w = Math.max(1, Math.abs(next.x - last.x));
					var h = Math.max(1, Math.abs(next.y - last.y));
					tmp.style.left = x + 'px';
					tmp.style.top = y + 'px';
					tmp.style.width = w + 'px';
					tmp.style.height = h + 'px';
					this.divContainer.appendChild(tmp);
					last = next;
				}
			}
		}
	}
};
mxShape.prototype.updateVmlShape = function(node) {
	node.setAttribute('strokeweight', this.strokewidth * this.scale);
	if (this.bounds != null && !isNaN(this.bounds.x) && !isNaN(this.bounds.y) && !isNaN(this.bounds.width) && !isNaN(this.bounds.height)) {
		node.style.left = Math.floor(this.bounds.x) + 'px';
		node.style.top = Math.floor(this.bounds.y) + 'px';
		node.style.width = Math.floor(Math.max(0, this.bounds.width)) + 'px';
		node.style.height = Math.floor(Math.max(0, this.bounds.height)) + 'px';
		if (this.points == null) {
			if (this.rotation != null && this.rotation != 0) {
				node.style.rotation = this.rotation;
			} else if (node.style.rotation != null) {
				node.style.rotation = '';
			}
		}
	}
	if (this.points != null) {
		if (node.nodeName == 'polyline' && node.points != null) {
			var points = '';
			for (var i = 0; i < this.points.length; i++) {
				points += this.points[i].x + ',' + this.points[i].y + ' ';
			}
			node.points.value = points;
			node.style.left = null;
			node.style.top = null;
			node.style.width = null;
			node.style.height = null;
		} else if (this.bounds != null) {
			this.node.setAttribute('coordsize', Math.floor(this.bounds.width) + ',' + Math.floor(this.bounds.height));
			var points = this.createPoints('m', 'l', 'c', true);
			if (this.style != null && this.style[mxConstants.STYLE_SMOOTH]) {
				var pts = this.points;
				var n = pts.length;
				if (n > 3) {
					var x0 = this.bounds.x;
					var y0 = this.bounds.y;
					points = 'm ' + Math.floor(pts[0].x - x0) + ' ' + Math.floor(pts[0].y - y0) + ' qb';
					for (var i = 1; i < n - 1; i++) {
						points += ' ' + Math.floor(pts[i].x - x0) + ' ' + Math.floor(pts[i].y - y0);
					}
					points += ' nf l ' + Math.floor(pts[n - 1].x - x0) + ' ' + Math.floor(pts[n - 1].y - y0);
				}
			}
			node.setAttribute('path', points + ' e');
		}
	}
};
mxShape.prototype.updateSvgShape = function(node) {
	var strokeWidth = Math.max(1, this.strokewidth * this.scale);
	node.setAttribute('stroke-width', strokeWidth);
	if (this.crisp) {
		node.setAttribute('shape-rendering', 'crispEdges');
	} else {
		node.removeAttribute('shape-rendering');
	}
	if (this.points != null && this.points[0] != null) {
		var d = this.createPoints('M', 'L', 'C', false);
		if (d != null) {
			node.setAttribute('d', d);
			if (this.style != null && this.style[mxConstants.STYLE_SMOOTH]) {
				var pts = this.points;
				var n = pts.length;
				if (n > 3) {
					var points = 'M ' + pts[0].x + ' ' + pts[0].y + ' ';
					points += ' Q ' + pts[1].x + ' ' + pts[1].y + ' ' + ' ' + pts[2].x + ' ' + pts[2].y;
					for (var i = 3; i < n; i++) {
						points += ' T ' + pts[i].x + ' ' + pts[i].y;
					}
					node.setAttribute('d', points);
				}
			}
			node.removeAttribute('x');
			node.removeAttribute('y');
			node.removeAttribute('width');
			node.removeAttribute('height');
		}
	} else if (this.bounds != null) {
		node.setAttribute('x', this.bounds.x);
		node.setAttribute('y', this.bounds.y);
		var w = this.bounds.width;
		var h = this.bounds.height;
		node.setAttribute('width', w);
		node.setAttribute('height', h);
		if (this.isRounded) {
			var r = Math.min(w * mxConstants.RECTANGLE_ROUNDING_FACTOR, h * mxConstants.RECTANGLE_ROUNDING_FACTOR);
			node.setAttribute('rx', r);
			node.setAttribute('ry', r);
		}
		this.updateSvgTransform(node, node == this.shadowNode);
	}
};
mxShape.prototype.updateSvgTransform = function(node, shadow) {
	if (this.rotation != null && this.rotation != 0) {
		var cx = this.bounds.x + this.bounds.width / 2;
		var cy = this.bounds.y + this.bounds.height / 2;
		if (shadow) {
			node.setAttribute('transform', 'rotate(' + this.rotation + ',' + cx + ',' + cy + ') ' + mxConstants.SVG_SHADOWTRANSFORM);
		} else {
			node.setAttribute('transform', 'rotate(' + this.rotation + ',' + cx + ',' + cy + ')');
		}
	} else {
		if (shadow) {
			node.setAttribute('transform', mxConstants.SVG_SHADOWTRANSFORM);
		} else {
			node.removeAttribute('transform');
		}
	}
};
mxShape.prototype.reconfigure = function() {
	if (this.dialect == mxConstants.DIALECT_SVG) {
		if (this.innerNode != null) {
			this.configureSvgShape(this.innerNode);
		} else {
			this.configureSvgShape(this.node);
		}
		if (this.insertGradientNode != null) {
			this.insertGradient(this.insertGradientNode);
			this.insertGradientNode = null;
		}
	} else if (mxUtils.isVml(this.node)) {
		this.configureVmlShape(this.node);
	} else {
		this.configureHtmlShape(this.node);
	}
};
mxShape.prototype.redraw = function() {
	if (this.dialect == mxConstants.DIALECT_SVG) {
		this.redrawSvg();
	} else if (mxUtils.isVml(this.node)) {
		this.redrawVml();
	} else {
		this.redrawHtml();
	}
};
mxShape.prototype.redrawSvg = function() {
	if (this.innerNode != null) {
		this.updateSvgShape(this.innerNode);
		if (this.shadowNode != null) {
			this.updateSvgShape(this.shadowNode);
		}
	} else {
		this.updateSvgShape(this.node);
	}
};
mxShape.prototype.redrawVml = function() {
	this.updateVmlShape(this.node);
};
mxShape.prototype.redrawHtml = function() {
	this.updateHtmlShape(this.node);
};
mxShape.prototype.createPath = function(arg) {
	var x = this.bounds.x;
	var y = this.bounds.y;
	var w = this.bounds.width;
	var h = this.bounds.height;
	var path = null;
	if (this.dialect == mxConstants.DIALECT_SVG) {
		path = new mxPath('svg');
		path.setTranslate(x, y);
	} else {
		path = new mxPath('vml');
	}
	this.redrawPath(path, x, y, w, h, arg);
	return path.getPath();
};
mxShape.prototype.redrawPath = function(path, x, y, w, h) {};
function mxActor(bounds, fill, stroke, strokewidth) {
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = strokewidth || 1;
};
mxActor.prototype = new mxShape();
mxActor.prototype.constructor = mxActor;
mxActor.prototype.mixedModeHtml = false;
mxActor.prototype.preferModeHtml = false;
mxActor.prototype.createVml = function() {
	var node = document.createElement('v:shape');
	this.configureVmlShape(node);
	return node;
};
mxActor.prototype.redrawVml = function() {
	this.updateVmlShape(this.node);
	var w = Math.floor(this.bounds.width);
	var h = Math.floor(this.bounds.height);
	var s = this.strokewidth * this.scale;
	this.node.setAttribute('coordsize', w + ',' + h);
	this.node.setAttribute('strokeweight', s);
	var d = this.createPath();
	this.node.setAttribute('path', d);
};
mxActor.prototype.createSvg = function() {
	return this.createSvgGroup('path');
};
mxActor.prototype.redrawSvg = function() {
	var strokeWidth = Math.max(1, this.strokewidth * this.scale);
	this.innerNode.setAttribute('stroke-width', strokeWidth);
	var d = this.createPath();
	if (d.length > 0) {
		this.innerNode.setAttribute('d', d);
		this.updateSvgTransform(this.innerNode, false);
		if (this.shadowNode != null) {
			this.shadowNode.setAttribute('stroke-width', strokeWidth);
			this.shadowNode.setAttribute('d', d);
			this.updateSvgTransform(this.shadowNode, true);
		}
	} else {
		this.innerNode.removeAttribute('d');
		if (this.shadowNode != null) {
			this.shadowNode.removeAttribute('d');
		}
	}
};
mxActor.prototype.redrawPath = function(path, x, y, w, h) {
	var width = w / 3;
	path.moveTo(0, h);
	path.curveTo(0, 3 * h / 5, 0, 2 * h / 5, w / 2, 2 * h / 5);
	path.curveTo(w / 2 - width, 2 * h / 5, w / 2 - width, 0, w / 2, 0);
	path.curveTo(w / 2 + width, 0, w / 2 + width, 2 * h / 5, w / 2, 2 * h / 5);
	path.curveTo(w, 2 * h / 5, w, 3 * h / 5, w, h);
	path.close();
};
function mxCloud(bounds, fill, stroke, strokewidth) {
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = strokewidth || 1;
};
mxCloud.prototype = new mxActor();
mxCloud.prototype.constructor = mxActor;
mxCloud.prototype.redrawPath = function(path, x, y, w, h) {
	path.moveTo(0.25 * w, 0.25 * h);
	path.curveTo(0.05 * w, 0.25 * h, 0, 0.5 * h, 0.16 * w, 0.55 * h);
	path.curveTo(0, 0.66 * h, 0.18 * w, 0.9 * h, 0.31 * w, 0.8 * h);
	path.curveTo(0.4 * w, h, 0.7 * w, h, 0.8 * w, 0.8 * h);
	path.curveTo(w, 0.8 * h, w, 0.6 * h, 0.875 * w, 0.5 * h);
	path.curveTo(w, 0.3 * h, 0.8 * w, 0.1 * h, 0.625 * w, 0.2 * h);
	path.curveTo(0.5 * w, 0.05 * h, 0.3 * w, 0.05 * h, 0.25 * w, 0.25 * h);
	path.close();
};
function mxRectangleShape(bounds, fill, stroke, strokewidth) {
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = strokewidth || 1;
};
mxRectangleShape.prototype = new mxShape();
mxRectangleShape.prototype.constructor = mxRectangleShape;
mxRectangleShape.prototype.createHtml = function() {
	var node = document.createElement('DIV');
	this.configureHtmlShape(node);
	return node;
};
mxRectangleShape.prototype.createVml = function() {
	var name = (this.isRounded) ? 'v:roundrect': 'v:rect';
	var node = document.createElement(name);
	this.configureVmlShape(node);
	return node;
};
mxRectangleShape.prototype.createSvg = function() {
	return this.createSvgGroup('rect');
};
mxRectangleShape.prototype.redrawSvg = function() {
	this.crisp = !this.isRounded;
	mxShape.prototype.redrawSvg.apply(this, arguments);
};
function mxEllipse(bounds, fill, stroke, strokewidth) {
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = strokewidth || 1;
};
mxEllipse.prototype = new mxShape();
mxEllipse.prototype.constructor = mxEllipse;
mxEllipse.prototype.mixedModeHtml = false;
mxEllipse.prototype.preferModeHtml = false;
mxEllipse.prototype.createVml = function() {
	var node = document.createElement('v:arc');
	node.setAttribute('startangle', '0');
	node.setAttribute('endangle', '360');
	this.configureVmlShape(node);
	return node;
};
mxEllipse.prototype.createSvg = function() {
	return this.createSvgGroup('ellipse');
};
mxEllipse.prototype.redrawSvg = function() {
	this.updateSvgNode(this.innerNode);
	this.updateSvgNode(this.shadowNode);
};
mxEllipse.prototype.updateSvgNode = function(node) {
	if (node != null) {
		var strokeWidth = Math.max(1, this.strokewidth * this.scale);
		node.setAttribute('stroke-width', strokeWidth);
		node.setAttribute('cx', this.bounds.x + this.bounds.width / 2);
		node.setAttribute('cy', this.bounds.y + this.bounds.height / 2);
		node.setAttribute('rx', this.bounds.width / 2);
		node.setAttribute('ry', this.bounds.height / 2);
	}
};
function mxDoubleEllipse(bounds, fill, stroke, strokewidth) {
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = strokewidth || 1;
};
mxDoubleEllipse.prototype = new mxShape();
mxDoubleEllipse.prototype.constructor = mxDoubleEllipse;
mxDoubleEllipse.prototype.mixedModeHtml = false;
mxDoubleEllipse.prototype.preferModeHtml = false;
mxDoubleEllipse.prototype.createVml = function() {
	var node = document.createElement('v:group');
	this.background = document.createElement('v:arc');
	this.background.setAttribute('startangle', '0');
	this.background.setAttribute('endangle', '360');
	this.configureVmlShape(this.background);
	node.appendChild(this.background);
	this.label = this.background;
	this.isShadow = false;
	this.fill = null;
	this.foreground = document.createElement('v:oval');
	this.configureVmlShape(this.foreground);
	node.appendChild(this.foreground);
	this.stroke = null;
	this.configureVmlShape(node);
	return node;
};
mxDoubleEllipse.prototype.redrawVml = function() {
	var x = Math.floor(this.bounds.x);
	var y = Math.floor(this.bounds.y);
	var w = Math.floor(this.bounds.width);
	var h = Math.floor(this.bounds.height);
	var s = this.strokewidth * this.scale;
	this.updateVmlShape(this.node);
	this.node.setAttribute('coordsize', w + ',' + h);
	this.updateVmlShape(this.background);
	this.background.setAttribute('strokeweight', s);
	this.background.style.top = '0px';
	this.background.style.left = '0px';
	this.updateVmlShape(this.foreground);
	this.foreground.setAttribute('strokeweight', s);
	var inset = 3 + s;
	this.foreground.style.top = inset + 'px';
	this.foreground.style.left = inset + 'px';
	this.foreground.style.width = Math.max(0, w - 2 * inset) + 'px';
	this.foreground.style.height = Math.max(0, h - 2 * inset) + 'px';
};
mxDoubleEllipse.prototype.createSvg = function() {
	var g = this.createSvgGroup('ellipse');
	this.foreground = document.createElementNS(mxConstants.NS_SVG, 'ellipse');
	if (this.stroke != null) {
		this.foreground.setAttribute('stroke', this.stroke);
	} else {
		this.foreground.setAttribute('stroke', 'none');
	}
	this.foreground.setAttribute('fill', 'none');
	g.appendChild(this.foreground);
	return g;
};
mxDoubleEllipse.prototype.redrawSvg = function() {
	var s = this.strokewidth * this.scale;
	this.updateSvgNode(this.innerNode);
	this.updateSvgNode(this.shadowNode);
	this.updateSvgNode(this.foreground, 3 * this.scale + s);
};
mxDoubleEllipse.prototype.updateSvgNode = function(node, inset) {
	inset = (inset != null) ? inset: 0;
	if (node != null) {
		var strokeWidth = Math.max(1, this.strokewidth * this.scale);
		node.setAttribute('stroke-width', strokeWidth);
		node.setAttribute('cx', this.bounds.x + this.bounds.width / 2);
		node.setAttribute('cy', this.bounds.y + this.bounds.height / 2);
		node.setAttribute('rx', Math.max(0, this.bounds.width / 2 - inset));
		node.setAttribute('ry', Math.max(0, this.bounds.height / 2 - inset));
	}
};
function mxRhombus(bounds, fill, stroke, strokewidth) {
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = strokewidth || 1;
};
mxRhombus.prototype = new mxShape();
mxRhombus.prototype.constructor = mxRhombus;
mxRhombus.prototype.mixedModeHtml = false;
mxRhombus.prototype.preferModeHtml = false;
mxRhombus.prototype.createHtml = function() {
	var node = document.createElement('DIV');
	this.configureHtmlShape(node);
	return node;
};
mxRhombus.prototype.createVml = function() {
	var node = document.createElement('v:shape');
	this.configureVmlShape(node);
	return node;
};
mxRhombus.prototype.createSvg = function() {
	return this.createSvgGroup('path');
};
mxRhombus.prototype.redrawVml = function() {
	this.node.setAttribute('strokeweight', this.strokewidth * this.scale);
	this.updateVmlShape(this.node);
	var x = 0;
	var y = 0;
	var w = Math.floor(this.bounds.width);
	var h = Math.floor(this.bounds.height);
	this.node.setAttribute('coordsize', w + ',' + h);
	var points = 'm ' + Math.floor(x + w / 2) + ' ' + y + ' l ' + (x + w) + ' ' + Math.floor(y + h / 2) + ' l ' + Math.floor(x + w / 2) + ' ' + (y + h) + ' l ' + x + ' ' + Math.floor(y + h / 2);
	this.node.setAttribute('path', points + ' x e');
};
mxRhombus.prototype.redrawHtml = function() {
	this.updateHtmlShape(this.node);
};
mxRhombus.prototype.redrawSvg = function() {
	this.updateSvgNode(this.innerNode);
	if (this.shadowNode != null) {
		this.updateSvgNode(this.shadowNode);
	}
};
mxRhombus.prototype.updateSvgNode = function(node) {
	var strokeWidth = Math.max(1, this.strokewidth * this.scale);
	node.setAttribute('stroke-width', strokeWidth);
	var x = this.bounds.x;
	var y = this.bounds.y;
	var w = this.bounds.width;
	var h = this.bounds.height;
	var d = 'M ' + (x + w / 2) + ' ' + y + ' L ' + (x + w) + ' ' + (y + h / 2) + ' L ' + (x + w / 2) + ' ' + (y + h) + ' L ' + x + ' ' + (y + h / 2) + ' Z ';
	node.setAttribute('d', d);
	this.updateSvgTransform(node, node == this.shadowNode);
};
function mxPolyline(points, stroke, strokewidth) {
	this.points = points;
	this.stroke = stroke || 'black';
	this.strokewidth = strokewidth || 1;
};
mxPolyline.prototype = new mxShape();
mxPolyline.prototype.constructor = mxPolyline;
mxPolyline.prototype.create = function() {
	var node = null;
	if (this.dialect == mxConstants.DIALECT_SVG) {
		node = this.createSvg();
	} else if (this.dialect == mxConstants.DIALECT_STRICTHTML || (this.dialect == mxConstants.DIALECT_PREFERHTML && this.points != null && this.points.length > 0)) {
		node = document.createElement('DIV');
		this.configureHtmlShape(node);
		node.style.borderStyle = '';
		node.style.background = '';
	} else {
		node = document.createElement('v:shape');
		this.configureVmlShape(node);
		var strokeNode = document.createElement('v:stroke');
		if (this.opacity != null) {
			strokeNode.setAttribute('opacity', this.opacity + '%');
		}
		node.appendChild(strokeNode);
	}
	return node;
};
mxPolyline.prototype.redrawVml = function() {
	if (this.points != null && this.points.length > 0 && this.points[0] != null) {
		this.bounds = new mxRectangle(this.points[0].x, this.points[0].y, 0, 0);
		for (var i = 1; i < this.points.length; i++) {
			this.bounds.add(new mxRectangle(this.points[i].x, this.points[i].y, 0, 0));
		}
	}
	mxShape.prototype.redrawVml.apply(this, arguments);
};
mxPolyline.prototype.createSvg = function() {
	var g = this.createSvgGroup('path');
	var color = this.innerNode.getAttribute('stroke');
	this.pipe = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.pipe.setAttribute('stroke', color);
	this.pipe.setAttribute('visibility', 'hidden');
	this.pipe.setAttribute('pointer-events', 'stroke');
	g.appendChild(this.pipe);
	return g;
};
mxPolyline.prototype.redrawSvg = function() {
	this.updateSvgShape(this.innerNode);
	var d = this.innerNode.getAttribute('d');
	if (d != null) {
		this.pipe.setAttribute('d', d);
		var strokeWidth = this.strokewidth * this.scale;
		this.pipe.setAttribute('stroke-width', strokeWidth + mxShape.prototype.SVG_STROKE_TOLERANCE);
	}
};
function mxArrow(points, fill, stroke, strokewidth, arrowWidth, spacing, endSize) {
	this.points = points;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = strokewidth || 1;
	this.arrowWidth = arrowWidth || mxConstants.ARROW_WIDTH;
	this.spacing = spacing || mxConstants.ARROW_SPACING;
	this.endSize = endSize || mxConstants.ARROW_SIZE;
};
mxArrow.prototype = new mxShape();
mxArrow.prototype.constructor = mxArrow;
mxArrow.prototype.mixedModeHtml = false;
mxArrow.prototype.preferModeHtml = false;
mxArrow.prototype.DEG_PER_RAD = 57.2957795;
mxArrow.prototype.createVml = function() {
	var node = document.createElement('v:shape');
	this.configureVmlShape(node);
	return node;
};
mxArrow.prototype.redrawVml = function() {
	this.node.setAttribute('strokeweight', this.strokewidth * this.scale);
	if (this.points != null) {
		this.updateVmlShape(this.node);
		var spacing = this.spacing * this.scale;
		var width = this.arrowWidth * this.scale;
		var arrow = this.endSize * this.scale;
		var p0 = this.points[0];
		var pe = this.points[this.points.length - 1];
		var dx = pe.x - p0.x;
		var dy = pe.y - p0.y;
		var dist = Math.sqrt(dx * dx + dy * dy);
		var length = dist - 2 * spacing - arrow;
		var nx = dx / dist;
		var ny = dy / dist;
		var basex = length * nx;
		var basey = length * ny;
		var floorx = width * ny / 3;
		var floory = -width * nx / 3;
		var p0x = p0.x - floorx / 2 + spacing * nx;
		var p0y = p0.y - floory / 2 + spacing * ny;
		var p1x = p0x + floorx;
		var p1y = p0y + floory;
		var p2x = p1x + basex;
		var p2y = p1y + basey;
		var p3x = p2x + floorx;
		var p3y = p2y + floory;
		var p5x = p3x - 3 * floorx;
		var p5y = p3y - 3 * floory;
		var d = 'm' + Math.round(p0x) + ',' + Math.round(p0y) + ' l' + Math.round(p1x) + ',' + Math.round(p1y) + ',' + Math.round(p2x) + ',' + Math.round(p2y) + ',' + Math.round(p3x) + ',' + Math.round(p3y) + ',' + Math.round(pe.x - spacing * nx) + ',' + Math.round(pe.y - spacing * ny) + ',' + Math.round(p5x) + ',' + Math.round(p5y) + ',' + Math.round(p5x + floorx) + ',' + Math.round(p5y + floory) + ',' + Math.round(p0x) + ',' + Math.round(p0y) + ' xe';
		this.node.style.left = null;
		this.node.style.top = null;
		this.node.setAttribute('path', d);
	}
};
mxArrow.prototype.createSvg = function() {
	var node = document.createElementNS(mxConstants.NS_SVG, 'polygon');
	this.configureSvgShape(node);
	return node;
};
mxArrow.prototype.redrawSvg = function() {
	if (this.points != null) {
		var strokeWidth = Math.max(1, this.strokewidth * this.scale);
		this.node.setAttribute('stroke-width', strokeWidth);
		var p0 = this.points[0];
		var pe = this.points[this.points.length - 1];
		var tdx = pe.x - p0.x;
		var tdy = pe.y - p0.y;
		var dist = Math.sqrt(tdx * tdx + tdy * tdy);
		var offset = this.spacing * this.scale;
		var h = Math.min(25, Math.max(20, dist / 5)) * this.scale;
		var w = dist - 2 * offset;
		var x = p0.x + offset;
		var y = p0.y - h / 2;
		var dx = h;
		var dy = h * 0.3;
		var right = x + w;
		var bottom = y + h;
		var points = x + ',' + (y + dy) + ' ' + (right - dx) + ',' + (y + dy) + ' ' + (right - dx) + ',' + y + ' ' + right + ',' + (y + h / 2) + ' ' + (right - dx) + ',' + bottom + ' ' + (right - dx) + ',' + (bottom - dy) + ' ' + x + ',' + (bottom - dy);
		this.node.setAttribute('points', points);
		var dx = pe.x - p0.x;
		var dy = pe.y - p0.y;
		var theta = Math.atan(dy / dx) * this.DEG_PER_RAD;
		if (dx < 0) {
			theta -= 180;
		}
		this.node.setAttribute('transform', 'rotate(' + theta + ',' + p0.x + ',' + p0.y + ')');
	}
};
function mxText(value, bounds, align, valign, color, family, size, fontStyle, spacing, spacingTop, spacingRight, spacingBottom, spacingLeft, horizontal, background, border, wrap, clipped, overflow) {
	this.value = value;
	this.bounds = bounds;
	this.color = color || 'black';
	this.align = align || '';
	this.valign = valign || '';
	this.family = family || mxConstants.DEFAULT_FONTFAMILY;
	this.size = size || mxConstants.DEFAULT_FONTSIZE;
	this.fontStyle = fontStyle || 0;
	this.spacing = parseInt(spacing || 2);
	this.spacingTop = this.spacing + parseInt(spacingTop || 0);
	this.spacingRight = this.spacing + parseInt(spacingRight || 0);
	this.spacingBottom = this.spacing + parseInt(spacingBottom || 0);
	this.spacingLeft = this.spacing + parseInt(spacingLeft || 0);
	this.horizontal = (horizontal != null) ? horizontal: true;
	this.background = background;
	this.border = border;
	this.wrap = (wrap != null) ? wrap: false;
	this.clipped = (clipped != null) ? clipped: false;
	this.overflow = (overflow != null) ? overflow: 'visible';
};
mxText.prototype = new mxShape();
mxText.prototype.constructor = mxText;
mxText.prototype.isStyleSet = function(style) {
	return (this.fontStyle & style) == style;
};
mxText.prototype.create = function(container) {
	var node = null;
	if (this.dialect == mxConstants.DIALECT_SVG) {
		node = this.createSvg();
	} else if (this.dialect == mxConstants.DIALECT_STRICTHTML || this.dialect == mxConstants.DIALECT_PREFERHTML || !mxUtils.isVml(container)) {
		if (false && !mxClient.NO_FO) {
			node = this.createForeignObject();
		} else {
			node = this.createHtml();
		}
	} else {
		node = this.createVml();
	}
	return node;
};
mxText.prototype.createForeignObject = function() {
	var node = document.createElementNS(mxConstants.NS_SVG, 'g');
	var fo = document.createElementNS(mxConstants.NS_SVG, 'foreignObject');
	fo.setAttribute('pointer-events', 'fill');
	var body = document.createElementNS(mxConstants.NS_XHTML, 'body');
	body.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
	body.style.margin = '0px';
	body.style.height = '100%';
	fo.appendChild(body);
	node.appendChild(fo);
	return node;
};
mxText.prototype.createHtml = function() {
	var table = this.createHtmlTable();
	table.style.position = 'absolute';
	return table;
};
mxText.prototype.createVml = function() {
	return document.createElement('v:textbox');
};
mxText.prototype.redrawHtml = function() {
	this.redrawVml();
};
mxText.prototype.getOffset = function(outerWidth, outerHeight, actualWidth, actualHeight, horizontal) {
	horizontal = (horizontal != null) ? horizontal: this.horizontal;
	var tmpalign = (horizontal) ? this.align: this.valign;
	var tmpvalign = (horizontal) ? this.valign: this.align;
	var dx = actualWidth - outerWidth;
	var dy = actualHeight - outerHeight;
	if (tmpalign == mxConstants.ALIGN_CENTER || tmpalign == mxConstants.ALIGN_MIDDLE) {
		dx = Math.floor(dx / 2);
	} else if (tmpalign == mxConstants.ALIGN_LEFT || tmpalign === mxConstants.ALIGN_TOP) {
		dx = (horizontal) ? 0 : (actualWidth - actualHeight) / 2;
	} else if (!horizontal) {
		dx = (actualWidth + actualHeight) / 2 - outerWidth;
	}
	if (tmpvalign == mxConstants.ALIGN_MIDDLE || tmpvalign == mxConstants.ALIGN_CENTER) {
		dy = Math.floor(dy / 2);
	} else if (tmpvalign == mxConstants.ALIGN_TOP || tmpvalign == mxConstants.ALIGN_LEFT) {
		dy = (horizontal) ? 0 : (actualHeight + actualWidth) / 2 - outerHeight;
	} else if (!horizontal) {
		dy = (actualHeight - actualWidth) / 2;
	}
	return new mxPoint(dx, dy);
};
mxText.prototype.getSpacing = function(horizontal) {
	horizontal = (horizontal != null) ? horizontal: this.horizontal;
	var dx = this.spacingLeft;
	var dy = this.spacingTop;
	if (this.align == mxConstants.ALIGN_CENTER) {
		dx -= this.spacingRight;
	} else if (this.align == mxConstants.ALIGN_RIGHT) {
		dx = -this.spacingRight;
	}
	if (this.valign == mxConstants.ALIGN_MIDDLE) {
		dy -= this.spacingBottom;
	} else if (this.valign == mxConstants.ALIGN_BOTTOM) {
		dy = -this.spacingBottom;
	}
	return (horizontal) ? new mxPoint(dx, dy) : new mxPoint(dy, dx);
};
mxText.prototype.createHtmlTable = function() {
	var table = document.createElement('table');
	table.style.borderCollapse = 'collapse';
	var tbody = document.createElement('tbody');
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	tr.appendChild(td);
	tbody.appendChild(tr);
	table.appendChild(tbody);
	return table;
};
mxText.prototype.updateHtmlTable = function(table, scale) {
	scale = (scale != null) ? scale: 1;
	var td = table.firstChild.firstChild.firstChild;
	if (mxUtils.isNode(this.value)) {
		td.appendChild(this.value);
	} else {
		if (this.lastValue != this.value) {
			td.innerHTML = this.value.replace(/\n/g, '<br/>');
			this.lastValue = this.value;
		}
	}
	var fontSize = Math.round(this.size * scale);
	if (fontSize <= 0) {
		table.style.visibility = 'hidden';
	} else {
		table.style.visibility = '';
	}
	table.style.fontSize = (fontSize) + 'px';
	table.style.color = this.color;
	table.style.fontFamily = this.family;
	if (this.isStyleSet(mxConstants.FONT_BOLD)) {
		table.style.fontWeight = 'bold';
	} else {
		table.style.fontWeight = 'normal';
	}
	if (this.isStyleSet(mxConstants.FONT_ITALIC)) {
		table.style.fontStyle = 'italic';
	} else {
		table.style.fontStyle = '';
	}
	if (this.isStyleSet(mxConstants.FONT_UNDERLINE)) {
		table.style.textDecoration = 'underline';
	} else {
		table.style.textDecoration = '';
	}
	if (this.opacity != null) {
		mxUtils.setOpacity(table, this.opacity);
	}
	if (true) {
		if (this.isStyleSet(mxConstants.FONT_SHADOW)) {
			td.style.filter = 'Shadow(Color=#666666,' + 'Direction=135,Strength=%)';
		} else {
			td.style.removeAttribute('filter');
		}
	}
	if (this.wrap && this.bounds.width > 0 && this.dialect != mxConstants.DIALECT_SVG) {
		if (false) {
			table.style.width = this.bounds.width + 'px';
		} else {
			var space = ((this.horizontal || mxUtils.isVml(this.node)) ? this.bounds.width: this.bounds.height) / this.scale;
			table.style.width = space + 'px';
		}
		td.style.whiteSpace = '';
	} else {
		table.style.width = '';
		td.style.whiteSpace = 'nowrap';
	}
	td.style.textAlign = (this.align == mxConstants.ALIGN_RIGHT) ? 'right': ((this.align == mxConstants.ALIGN_CENTER) ? 'center': 'left');
	td.style.verticalAlign = (this.valign == mxConstants.ALIGN_BOTTOM) ? 'bottom': ((this.valign == mxConstants.ALIGN_MIDDLE) ? 'middle': 'top');
	if (this.value.length > 0 && this.background != null) {
		td.style.background = this.background;
	} else {
		td.style.background = '';
	}
	if (this.value.length > 0 && this.border != null) {
		table.style.borderColor = this.border;
		table.style.borderWidth = '1px';
		table.style.borderStyle = 'solid';
	} else {
		table.style.borderStyle = 'none';
	}
};
mxText.prototype.redrawVml = function() {
	if (this.node.nodeName == 'g') {
		this.redrawForeignObject();
	} else if (mxUtils.isVml(this.node)) {
		this.redrawTextbox();
	} else {
		this.redrawHtmlTable();
	}
};
mxText.prototype.redrawTextbox = function() {
	var textbox = this.node;
	if (textbox.firstChild == null) {
		textbox.appendChild(this.createHtmlTable());
	}
	var table = textbox.firstChild;
	this.updateHtmlTable(table);
	table.style.filter = '';
	textbox.inset = '0px,0px,0px,0px';
	if (this.overflow != 'fill') {
		var w = table.offsetWidth * this.scale;
		var h = table.offsetHeight * this.scale;
		var offset = this.getOffset(this.bounds.width, this.bounds.height, w, h);
		if (!this.horizontal) {
			table.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)';
		}
		var spacing = this.getSpacing();
		var x = this.bounds.x - offset.x + spacing.x * this.scale;
		var y = this.bounds.y - offset.y + spacing.y * this.scale;
		var x0 = this.bounds.x;
		var y0 = this.bounds.y;
		var ow = this.bounds.width;
		var oh = this.bounds.height;
		if (this.horizontal) {
			var tx = Math.round(x - x0);
			var ty = Math.round(y - y0);
			var r = Math.min(0, Math.round(x0 + ow - x - w - 1));
			var b = Math.min(0, Math.round(y0 + oh - y - h - 1));
			textbox.inset = tx + 'px,' + ty + 'px,' + r + 'px,' + b + 'px';
		} else {
			var t = 0;
			var l = 0;
			var r = 0;
			var b = 0;
			if (this.align == mxConstants.ALIGN_CENTER) {
				t = (oh - w) / 2;
				b = t;
			} else if (this.align == mxConstants.ALIGN_LEFT) {
				t = oh - w;
			} else {
				b = oh - w;
			}
			if (this.valign == mxConstants.ALIGN_MIDDLE) {
				l = (ow - h) / 2;
				r = l;
			} else if (this.valign == mxConstants.ALIGN_BOTTOM) {
				l = ow - h;
			} else {
				r = ow - h;
			}
			l += hs * this.scale;
			t += vs * this.scale;
			r += hs * this.scale;
			b += vs * this.scale;
			textbox.inset = l + 'px,' + t + 'px,' + r + 'px,' + b + 'px';
		}
		textbox.style.zoom = this.scale;
		if (this.clipped && this.bounds.width > 0 && this.bounds.height > 0) {
			this.boundingBox = this.bounds.clone();
			var dx = Math.round(x0 - x);
			var dy = Math.round(y0 - y);
			textbox.style.clip = 'rect(' + (dy / this.scale) + ' ' + ((dx + this.bounds.width) / this.scale) + ' ' + ((dy + this.bounds.height) / this.scale) + ' ' + (dx / this.scale) + ')';
		} else {
			this.boundingBox = new mxRectangle(x, y, w, h);
		}
	} else {
		this.boundingBox = this.bounds.clone();
	}
};
mxText.prototype.redrawHtmlTable = function() {
	if (isNaN(this.bounds.x) || isNaN(this.bounds.y) || isNaN(this.bounds.width) || isNaN(this.bounds.height)) {
		return;
	}
	var table = this.node;
	var td = table.firstChild.firstChild.firstChild;
	var oldBrowser = false;
	var fallbackScale = 1;
	if (true) {
		table.style.removeAttribute('filter')
	} else if (false || false) {
		table.style.WebkitTransform = '';
	} else if (false) {
		table.style.MozTransform = '';
		td.style.MozTransform = '';
	} else {
		if (mxClient.IS_OT) {
			table.style.OTransform = '';
		}
		fallbackScale = this.scale;
		oldBrowser = true;
	}
	this.updateHtmlTable(table, fallbackScale);
	if (this.overflow != 'fill') {
		table.style.left = '';
		table.style.top = '';
		table.style.height = '';
		var currentZoom = parseFloat(td.style.zoom) || 1;
		var w = table.offsetWidth / currentZoom;
		var h = table.offsetHeight / currentZoom;
		var offset = this.getOffset(this.bounds.width / this.scale, this.bounds.height / this.scale, w, h, oldBrowser || this.horizontal);
		var spacing = this.getSpacing(oldBrowser || this.horizontal);
		var x = this.bounds.x / this.scale - offset.x + spacing.x;
		var y = this.bounds.y / this.scale - offset.y + spacing.y;
		var s = this.scale;
		var s2 = 1;
		var shiftX = 0;
		var shiftY = 0;
		if (!this.horizontal) {
			if (true) {
				table.style.filter = 'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)';
				shiftX = w / 2 - h / 2;
				shiftY = -shiftX;
			} else if (false || false) {
				table.style.WebkitTransform = 'rotate(-90deg)';
			} else if (mxClient.IS_OT) {
				table.style.OTransform = 'rotate(-90deg)';
			} else if (false) {
				table.style.MozTransform = 'rotate(-90deg)';
				td.style.MozTransform = 'rotate(0deg)';
				s2 = 1 / this.scale;
				s = 1;
			}
		}
		if (false || oldBrowser) {
			if (false) {
				table.style.MozTransform += ' scale(' + this.scale + ')';
				s2 = 1 / this.scale;
			}
			shiftX = (this.scale - 1) * w / (2 * this.scale);
			shiftY = (this.scale - 1) * h / (2 * this.scale);
			s = 1;
		} else if (!oldBrowser) {
			td.style.zoom = this.scale;
		}
		table.style.left = Math.round((x + shiftX) * this.scale) + 'px';
		table.style.top = Math.round((y + shiftY) * this.scale) + 'px';
		table.style.width = Math.round(w * s) + 'px';
		table.style.height = Math.round(h * s) + 'px';
		if (this.clipped && this.bounds.width > 0 && this.bounds.height > 0) {
			this.boundingBox = this.bounds.clone();
			if (this.horizontal || (oldBrowser && !mxClient.IS_OT)) {
				var dx = Math.max(0, offset.x * s);
				var dy = Math.max(0, offset.y * s);
				table.style.clip = 'rect(' + (dy) + ' ' + (dx + this.bounds.width * s2) + ' ' + (dy + this.bounds.height * s2) + ' ' + (dx) + ')';
			} else {
				if (true) {
					var uw = this.bounds.width;
					var uh = this.bounds.height;
					var dx = 0;
					var dy = 0;
					if (this.align == mxConstants.ALIGN_LEFT) {
						dx = Math.max(0, w - uh / this.scale) * this.scale;
					} else if (this.align == mxConstants.ALIGN_CENTER) {
						dx = Math.max(0, w - uh / this.scale) * this.scale / 2;
					}
					if (this.valign == mxConstants.ALIGN_BOTTOM) {
						dy = Math.max(0, h - uw / this.scale) * this.scale;
					} else if (this.valign == mxConstants.ALIGN_MIDDLE) {
						dy = Math.max(0, h - uw / this.scale) * this.scale / 2;
					}
					table.style.clip = 'rect(' + (dx) + ' ' + (dy + uw - 1) + ' ' + (dx + uh - 1) + ' ' + (dy) + ')';
				} else {
					var uw = this.bounds.width / this.scale;
					var uh = this.bounds.height / this.scale;
					if (mxClient.IS_OT) {
						uw = this.bounds.width;
						uh = this.bounds.height;
					}
					var dx = 0;
					var dy = 0;
					if (this.align == mxConstants.ALIGN_RIGHT) {
						dx = Math.max(0, w - uh);
					} else if (this.align == mxConstants.ALIGN_CENTER) {
						dx = Math.max(0, w - uh) / 2;
					}
					if (this.valign == mxConstants.ALIGN_BOTTOM) {
						dy = Math.max(0, h - uw);
					} else if (this.valign == mxConstants.ALIGN_MIDDLE) {
						dy = Math.max(0, h - uw) / 2;
					}
					if (false || false) {
						dx *= this.scale;
						dy *= this.scale;
						uw *= this.scale;
						uh *= this.scale;
					}
					table.style.clip = 'rect(' + (dy) + ' ' + (dx + uh) + ' ' + (dy + uw) + ' ' + (dx) + ')';
				}
			}
		} else {
			this.boundingBox = new mxRectangle(x * this.scale, y * this.scale, w * this.scale, h * this.scale);
		}
	} else {
		this.boundingBox = this.bounds.clone();
		table.style.left = Math.round(this.bounds.x) + 'px';
		table.style.top = Math.round(this.bounds.y) + 'px';
		table.style.width = Math.round(this.bounds.width) + 'px';
		table.style.height = Math.round(this.bounds.height) + 'px';
	}
};
mxText.prototype.redrawForeignObject = function() {
	var group = this.node;
	var fo = group.firstChild;
	while (fo == this.backgroundNode) {
		fo = fo.nextSibling;
	}
	var body = fo.firstChild;
	if (body.firstChild == null) {
		body.appendChild(this.createHtmlTable());
	}
	var table = body.firstChild;
	this.updateHtmlTable(table);
	if (false || false) {
		table.style.borderStyle = 'none';
		table.firstChild.firstChild.firstChild.style.background = '';
		if (this.backgroundNode == null && (this.background != null || this.border != null)) {
			this.backgroundNode = document.createElementNS(mxConstants.NS_SVG, 'rect');
			group.insertBefore(this.backgroundNode, group.firstChild);
		} else if (this.backgroundNode != null && this.background == null && this.border == null) {
			this.backgroundNode.parentNode.removeChild(this.backgroundNode);
			this.backgroundNode = null;
		}
		if (this.backgroundNode != null) {
			if (this.background != null) {
				this.backgroundNode.setAttribute('fill', this.background);
			} else {
				this.backgroundNode.setAttribute('fill', 'none');
			}
			if (this.border != null) {
				this.backgroundNode.setAttribute('stroke', this.border);
			} else {
				this.backgroundNode.setAttribute('stroke', 'none');
			}
		}
	}
	if (this.overflow != 'fill') {
		fo.removeAttribute('x');
		fo.removeAttribute('y');
		fo.removeAttribute('width');
		fo.removeAttribute('height');
		fo.style.width = '';
		fo.style.height = '';
		fo.style.clip = '';
		if (!false && !false) {
			document.body.appendChild(table);
		}
		var w = table.offsetWidth;
		var h = table.offsetHeight;
		if (table.parentNode != body) {
			body.appendChild(table);
		}
		var spacing = this.getSpacing();
		var x = this.bounds.x / this.scale + spacing.x;
		var y = this.bounds.y / this.scale + spacing.y;
		var uw = this.bounds.width / this.scale;
		var uh = this.bounds.height / this.scale;
		var offset = this.getOffset(uw, uh, w, h);
		if (this.horizontal) {
			x -= offset.x;
			y -= offset.y;
			group.setAttribute('transform', 'scale(' + this.scale + ')');
		} else {
			var x0 = x + w / 2;
			var y0 = y + h / 2;
			group.setAttribute('transform', 'scale(' + this.scale + ') rotate(270 ' + x0 + ' ' + y0 + ')');
			x += offset.y;
			y -= offset.x;
		}
		if (this.backgroundNode != null) {
			this.backgroundNode.setAttribute('x', x);
			this.backgroundNode.setAttribute('y', y);
			this.backgroundNode.setAttribute('width', w);
			this.backgroundNode.setAttribute('height', h);
		}
		fo.setAttribute('x', x);
		fo.setAttribute('y', y);
		fo.setAttribute('width', w);
		fo.setAttribute('height', h);
		if (this.clipped && this.bounds.width > 0 && this.bounds.height > 0) {
			this.boundingBox = this.bounds.clone();
			var dx = Math.max(0, offset.x);
			var dy = Math.max(0, offset.y);
			if (this.horizontal) {
				fo.style.clip = 'rect(' + dy + ' ' + (dx + uw) + ' ' + (dy + uh) + ' ' + (dx) + ')';
			} else {
				var dx = 0;
				var dy = 0;
				if (this.align == mxConstants.ALIGN_RIGHT) {
					dx = Math.max(0, w - uh);
				} else if (this.align == mxConstants.ALIGN_CENTER) {
					dx = Math.max(0, w - uh) / 2;
				}
				if (this.valign == mxConstants.ALIGN_BOTTOM) {
					dy = Math.max(0, h - uw);
				} else if (this.valign == mxConstants.ALIGN_MIDDLE) {
					dy = Math.max(0, h - uw) / 2;
				}
				fo.style.clip = 'rect(' + (dy) + ' ' + (dx + uh) + ' ' + (dy + uw) + ' ' + (dx) + ')';
			}
			if (this.backgroundNode != null) {
				x = this.bounds.x / this.scale;
				y = this.bounds.y / this.scale;
				if (!this.horizontal) {
					x += (h + w) / 2 - uh;
					y += (h - w) / 2;
					var tmp = uw;
					uw = uh;
					uh = tmp;
				}
				var clip = this.getSvgClip(this.node.ownerSVGElement, x, y, uw, uh);
				if (clip != this.clip) {
					this.releaseSvgClip();
					this.clip = clip;
					clip.refCount++;
				}
				this.backgroundNode.setAttribute('clip-path', 'url(#' + clip.getAttribute('id') + ')');
			}
		} else {
			this.releaseSvgClip();
			if (this.backgroundNode != null) {
				this.backgroundNode.removeAttribute('clip-path');
			}
			if (this.horizontal) {
				this.boundingBox = new mxRectangle(x * this.scale, y * this.scale, w * this.scale, h * this.scale);
			} else {
				this.boundingBox = new mxRectangle(x * this.scale, y * this.scale, h * this.scale, w * this.scale);
			}
		}
	} else {
		fo.setAttribute('x', this.bounds.x);
		fo.setAttribute('y', this.bounds.y);
		fo.setAttribute('width', this.bounds.width);
		fo.setAttribute('height', this.bounds.height);
		if (this.backgroundNode != null) {
			this.backgroundNode.setAttribute('x', x);
			this.backgroundNode.setAttribute('y', y);
			this.backgroundNode.setAttribute('width', this.bounds.width);
			this.backgroundNode.setAttribute('height', this.bounds.height);
		}
		table.style.width = '100%';
		table.style.height = '100%';
	}
};
mxText.prototype.createSvg = function() {
	var node = document.createElementNS(mxConstants.NS_SVG, 'g');
	var uline = this.isStyleSet(mxConstants.FONT_UNDERLINE) ? 'underline': 'none';
	var weight = this.isStyleSet(mxConstants.FONT_BOLD) ? 'bold': 'normal';
	var s = this.isStyleSet(mxConstants.FONT_ITALIC) ? 'italic': null;
	var align = (this.align == mxConstants.ALIGN_RIGHT) ? 'end': (this.align == mxConstants.ALIGN_CENTER) ? 'middle': 'start';
	node.setAttribute('text-decoration', uline);
	node.setAttribute('text-anchor', align);
	node.setAttribute('font-family', this.family);
	node.setAttribute('font-weight', weight);
	node.setAttribute('font-size', Math.floor(this.size * this.scale) + 'px');
	node.setAttribute('fill', this.color);
	if (s != null) {
		node.setAttribute('font-style', s);
	}
	if (this.background != null || this.border != null) {
		this.backgroundNode = document.createElementNS(mxConstants.NS_SVG, 'rect');
		this.backgroundNode.setAttribute('shape-rendering', 'crispEdges');
		if (this.background != null) {
			this.backgroundNode.setAttribute('fill', this.background);
		} else {
			this.backgroundNode.setAttribute('fill', 'none');
		}
		if (this.border != null) {
			this.backgroundNode.setAttribute('stroke', this.border);
		} else {
			this.backgroundNode.setAttribute('stroke', 'none');
		}
	}
	this.updateSvgValue(node);
	return node;
};
mxText.prototype.updateSvgValue = function(node) {
	if (this.currentValue != this.value) {
		while (node.firstChild != null) {
			node.removeChild(node.firstChild);
		}
		if (this.value != null) {
			var lines = this.value.split('\n');
			this.textNodes = new Array(lines.length);
			for (var i = 0; i < lines.length; i++) {
				if (!this.isEmptyString(lines[i])) {
					var tspan = this.createSvgSpan(lines[i]);
					node.appendChild(tspan);
					this.textNodes[i] = tspan;
					tspan.setAttribute('text-decoration', 'inherit');
				} else {
					this.textNodes[i] = null;
				}
			}
		}
		this.currentValue = this.value;
	}
};
mxText.prototype.redrawSvg = function() {
	if (this.node.nodeName == 'foreignObject') {
		this.redrawHtml();
		return;
	}
	var fontSize = Math.round(this.size * this.scale);
	if (fontSize <= 0) {
		this.node.setAttribute('visibility', 'hidden');
	} else {
		this.node.removeAttribute('visibility');
	}
	this.updateSvgValue(this.node);
	this.node.setAttribute('font-size', fontSize + 'px');
	if (this.opacity != null) {
		this.node.setAttribute('fill-opacity', this.opacity / 100);
		this.node.setAttribute('stroke-opacity', this.opacity / 100);
	}
	var dy = this.size * 1.3 * this.scale;
	var childCount = this.node.childNodes.length;
	var lineCount = (this.textNodes != null) ? this.textNodes.length: 0;
	if (this.backgroundNode != null) {
		childCount--;
	}
	var x = this.bounds.x;
	var y = this.bounds.y;
	x += (this.align == mxConstants.ALIGN_RIGHT) ? ((this.horizontal) ? this.bounds.width: this.bounds.height) - this.spacingRight * this.scale: (this.align == mxConstants.ALIGN_CENTER) ? this.spacingLeft + (((this.horizontal) ? this.bounds.width: this.bounds.height) - this.spacingLeft - this.spacingRight) / 2 : this.spacingLeft * this.scale;
	y += (this.valign == mxConstants.ALIGN_BOTTOM) ? ((this.horizontal) ? this.bounds.height: this.bounds.width) - (lineCount - 1) * dy - this.spacingBottom * this.scale - 3 : (this.valign == mxConstants.ALIGN_MIDDLE) ? (this.spacingTop * this.scale + ((this.horizontal) ? this.bounds.height: this.bounds.width) - this.spacingBottom * this.scale - (lineCount - 1.5) * dy) / 2 + 1 : this.spacingTop * this.scale + dy - 2;
	if (!this.horizontal) {
		var cx = this.bounds.x + this.bounds.width / 2;
		var cy = this.bounds.y + this.bounds.height / 2;
		var offsetX = (this.bounds.width - this.bounds.height) / 2;
		var offsetY = (this.bounds.height - this.bounds.width) / 2;
		this.node.setAttribute('transform', 'rotate(-90 ' + cx + ' ' + cy + ') ' + 'translate(' + -offsetY + ' ' + ( - offsetX) + ')');
	}
	if (this.textNodes != null) {
		var currentY = y;
		for (var i = 0; i < lineCount; i++) {
			var node = this.textNodes[i];
			if (node != null) {
				node.setAttribute('x', x);
				node.setAttribute('y', currentY);
				node.setAttribute('style', 'pointer-events: all');
			}
			currentY += dy;
		}
	}
	if (this.overflow != 'fill') {
		var previous = this.value;
		var table = this.createHtmlTable();
		this.lastValue = null;
		this.value = mxUtils.htmlEntities(this.value, false);
		this.updateHtmlTable(table);
		document.body.appendChild(table);
		var w = table.offsetWidth * this.scale;
		var h = table.offsetHeight * this.scale;
		table.parentNode.removeChild(table);
		this.value = previous;
		var dx = 2 * this.scale;
		if (this.align == mxConstants.ALIGN_CENTER) {
			dx += w / 2;
		} else if (this.align == mxConstants.ALIGN_RIGHT) {
			dx += w;
		}
		this.boundingBox = new mxRectangle(x - dx, y - dy, w + 4 * this.scale, h + 1 * this.scale);
	} else {
		this.boundingBox = this.bounds.clone();
	}
	if (this.value.length > 0 && this.backgroundNode != null && this.node.firstChild != null) {
		if (this.node.firstChild != this.backgroundNode) {
			this.node.insertBefore(this.backgroundNode, this.node.firstChild);
		}
		this.backgroundNode.setAttribute('x', this.boundingBox.x + 2 * this.scale);
		this.backgroundNode.setAttribute('y', this.boundingBox.y + 2 * this.scale);
		this.backgroundNode.setAttribute('width', this.boundingBox.width);
		this.backgroundNode.setAttribute('height', this.boundingBox.height);
		var strokeWidth = Math.round(Math.max(1, this.scale));
		this.backgroundNode.setAttribute('stroke-width', strokeWidth);
	}
	if (this.clipped && this.bounds.width > 0 && this.bounds.height > 0) {
		this.boundingBox = this.bounds.clone();
		if (!this.horizontal) {
			this.boundingBox.width = this.bounds.height;
			this.boundingBox.height = this.bounds.width;
		}
		x = this.bounds.x;
		y = this.bounds.y;
		if (this.horizontal) {
			w = this.bounds.width;
			h = this.bounds.height;
		} else {
			w = this.bounds.height;
			h = this.bounds.width;
		}
		var clip = this.getSvgClip(this.node.ownerSVGElement, x, y, w, h);
		if (clip != this.clip) {
			this.releaseSvgClip();
			this.clip = clip;
			clip.refCount++;
		}
		this.node.setAttribute('clip-path', 'url(#' + clip.getAttribute('id') + ')');
	} else {
		this.releaseSvgClip();
		this.node.removeAttribute('clip-path');
	}
};
mxText.prototype.releaseSvgClip = function() {
	if (this.clip != null) {
		this.clip.refCount--;
		if (this.clip.refCount == 0) {
			this.clip.parentNode.removeChild(this.clip);
		}
		this.clip = null;
	}
};
mxText.prototype.getSvgClip = function(svg, x, y, w, h) {
	x = Math.round(x);
	y = Math.round(y);
	w = Math.round(w);
	h = Math.round(h);
	var id = '-mx-clip+' + x + '+' + y + '+' + w + '+' + h;
	if (this.clip != null && this.clip.ident == id) {
		return this.clip;
	}
	var counter = 0;
	var tmp = id + '-' + counter;
	var clip = document.getElementById(tmp);
	while (clip != null) {
		if (clip.ownerSVGElement == svg) {
			return clip;
		}
		counter++;
		tmp = id + '-' + counter;
		clip = document.getElementById(tmp)[0];
	}
	if (clip != null) {
		clip = clip.cloneNode(true);
		counter++;
	} else {
		clip = document.createElementNS(mxConstants.NS_SVG, 'clipPath');
		var rect = document.createElementNS(mxConstants.NS_SVG, 'rect');
		rect.setAttribute('x', x);
		rect.setAttribute('y', y);
		rect.setAttribute('width', w);
		rect.setAttribute('height', h);
		clip.appendChild(rect);
	}
	clip.setAttribute('id', id + '-' + counter);
	clip.ident = id;
	svg.appendChild(clip);
	clip.refCount = 0;
	return clip;
};
mxText.prototype.isEmptyString = function(text) {
	return text.replace(/ /g, '').length == 0;
};
mxText.prototype.createSvgSpan = function(text) {
	var node = document.createElementNS(mxConstants.NS_SVG, 'text');
	mxUtils.write(node, text);
	return node;
};
mxText.prototype.destroy = function() {
	this.releaseSvgClip();
	mxShape.prototype.destroy.apply(this, arguments);
};
function mxTriangle() {};
mxTriangle.prototype = new mxActor();
mxTriangle.prototype.constructor = mxTriangle;
mxTriangle.prototype.redrawPath = function(path, x, y, w, h) {
	if (this.direction == mxConstants.DIRECTION_NORTH) {
		path.moveTo(0, h);
		path.lineTo(0.5 * w, 0);
		path.lineTo(w, h);
	} else if (this.direction == mxConstants.DIRECTION_SOUTH) {
		path.moveTo(0, 0);
		path.lineTo(0.5 * w, h);
		path.lineTo(w, 0);
	} else if (this.direction == mxConstants.DIRECTION_WEST) {
		path.moveTo(w, 0);
		path.lineTo(0, 0.5 * h);
		path.lineTo(w, h);
	} else {
		path.moveTo(0, 0);
		path.lineTo(w, 0.5 * h);
		path.lineTo(0, h);
	}
	path.close();
};
function mxHexagon() {};
mxHexagon.prototype = new mxActor();
mxHexagon.prototype.constructor = mxHexagon;
mxHexagon.prototype.redrawPath = function(path, x, y, w, h) {
	if (this.direction == mxConstants.DIRECTION_NORTH || this.direction == mxConstants.DIRECTION_SOUTH) {
		path.moveTo(0.5 * w, 0);
		path.lineTo(w, 0.25 * h);
		path.lineTo(w, 0.75 * h);
		path.lineTo(0.5 * w, h);
		path.lineTo(0, 0.75 * h);
		path.lineTo(0, 0.25 * h);
	} else {
		path.moveTo(0.25 * w, 0);
		path.lineTo(0.75 * w, 0);
		path.lineTo(w, 0.5 * h);
		path.lineTo(0.75 * w, h);
		path.lineTo(0.25 * w, h);
		path.lineTo(0, 0.5 * h);
	}
	path.close();
};
function mxLine(bounds, stroke, strokewidth) {
	this.bounds = bounds;
	this.stroke = stroke || 'black';
	this.strokewidth = strokewidth || 1;
};
mxLine.prototype = new mxShape();
mxLine.prototype.constructor = mxLine;
mxLine.prototype.mixedModeHtml = false;
mxLine.prototype.preferModeHtml = false;
mxLine.prototype.clone = function() {
	var clone = new mxLine(this.bounds, this.stroke, this.strokewidth);
	clone.isDashed = this.isDashed;
	return clone;
};
mxLine.prototype.createVml = function() {
	var node = document.createElement('v:group');
	node.setAttribute('coordorigin', '0,0');
	node.style.position = 'absolute';
	node.style.overflow = 'visible';
	this.label = document.createElement('v:rect');
	this.configureVmlShape(this.label);
	this.label.setAttribute('stroked', 'false');
	this.label.setAttribute('filled', 'false');
	node.appendChild(this.label);
	this.innerNode = document.createElement('v:shape');
	this.configureVmlShape(this.innerNode);
	node.appendChild(this.innerNode);
	return node;
};
mxLine.prototype.redrawVml = function() {
	var x = Math.round(this.bounds.x);
	var y = Math.round(this.bounds.y);
	var w = Math.round(this.bounds.width);
	var h = Math.round(this.bounds.height);
	this.updateVmlShape(this.node);
	this.node.setAttribute('coordsize', w + ',' + h);
	this.updateVmlShape(this.label);
	this.label.style.left = '0px';
	this.label.style.top = '0px';
	this.innerNode.setAttribute('coordsize', w + ',' + h);
	this.innerNode.style.left = x + 'px';
	this.innerNode.style.top = y + 'px';
	this.innerNode.style.width = w + 'px';
	this.innerNode.style.height = h + 'px';
	this.innerNode.setAttribute('strokeweight', this.strokewidth * this.scale);
	if (this.direction == mxConstants.DIRECTION_NORTH || this.direction == mxConstants.DIRECTION_SOUTH) {
		this.innerNode.setAttribute('path', 'm ' + (w / 2 - x) + ' ' + ( - y) + ' l ' + (w / 2 - x) + ' ' + (h - y) + ' e');
	} else {
		this.innerNode.setAttribute('path', 'm ' + ( - x) + ' ' + (h / 2 - y) + ' l ' + (w - x) + ' ' + (h / 2 - y) + ' e');
	}
};
mxLine.prototype.createSvg = function() {
	var g = this.createSvgGroup('path');
	var color = this.innerNode.getAttribute('stroke');
	this.pipe = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.pipe.setAttribute('stroke', color);
	this.pipe.setAttribute('visibility', 'hidden');
	this.pipe.setAttribute('pointer-events', 'stroke');
	g.appendChild(this.pipe);
	return g;
};
mxLine.prototype.redrawSvg = function() {
	var strokeWidth = Math.max(1, this.strokewidth * this.scale);
	this.innerNode.setAttribute('stroke-width', strokeWidth);
	if (this.bounds != null) {
		var x = this.bounds.x;
		var y = this.bounds.y;
		var w = this.bounds.width;
		var h = this.bounds.height;
		var d = null;
		if (this.direction == mxConstants.DIRECTION_NORTH || this.direction == mxConstants.DIRECTION_SOUTH) {
			d = 'M ' + (x + w / 2) + ' ' + y + ' L ' + (x + w / 2) + ' ' + (y + h);
		} else {
			d = 'M ' + x + ' ' + (y + h / 2) + ' L ' + (x + w) + ' ' + (y + h / 2);
		}
		this.innerNode.setAttribute('d', d);
		this.pipe.setAttribute('d', d);
		this.pipe.setAttribute('stroke-width', this.strokewidth * this.scale + mxShape.prototype.SVG_STROKE_TOLERANCE);
		this.updateSvgTransform(this.innerNode, false);
		this.updateSvgTransform(this.pipe, false);
	}
};
function mxImageShape(bounds, image, fill, stroke, strokewidth) {
	this.bounds = bounds;
	this.image = image;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = strokewidth || 1;
	this.isShadow = false;
};
mxImageShape.prototype = new mxShape();
mxImageShape.prototype.constructor = mxImageShape;
mxImageShape.prototype.apply = function(state) {
	mxShape.prototype.apply.apply(this, arguments);
	this.fill = null;
	this.stroke = null;
	if (this.style != null) {
		this.fill = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_BACKGROUND);
		this.stroke = mxUtils.getValue(this.style, mxConstants.STYLE_IMAGE_BORDER);
	}
};
mxImageShape.prototype.create = function() {
	var node = null;
	if (this.dialect == mxConstants.DIALECT_SVG) {
		node = this.createSvgGroup('rect');
		this.innerNode.setAttribute('fill', this.fill);
		this.innerNode.setAttribute('visibility', 'hidden');
		this.innerNode.setAttribute('pointer-events', 'fill');
		this.imageNode = document.createElementNS(mxConstants.NS_SVG, 'image');
		this.imageNode.setAttributeNS(mxConstants.NS_XLINK, 'xlink:href', this.image);
		this.imageNode.setAttribute('style', 'pointer-events:none');
		this.configureSvgShape(this.imageNode);
		this.imageNode.removeAttribute('stroke');
		this.imageNode.removeAttribute('fill');
		node.insertBefore(this.imageNode, this.innerNode);
		if ((this.fill != null && this.fill != mxConstants.NONE) || (this.stroke != null && this.stroke != mxConstants.NONE)) {
			this.bg = document.createElementNS(mxConstants.NS_SVG, 'rect');
			this.bg.setAttribute('fill', this.fill || 'none');
			this.bg.setAttribute('stroke', this.stroke || 'none');
			node.insertBefore(this.bg, node.firstChild);
		}
	} else {
		if (this.dialect == mxConstants.DIALECT_STRICTHTML || this.dialect == mxConstants.DIALECT_PREFERHTML) {
			node = document.createElement('DIV');
			this.configureHtmlShape(node);
			var imgName = this.image.toUpperCase();
			if (imgName.substring(imgName.length - 3, imgName.length) == "PNG" && true) {
				node.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader (src=\'' + this.image + '\', sizingMethod=\'scale\')';
			} else {
				var img = document.createElement('img');
				img.setAttribute('src', this.image);
				img.style.width = '100%';
				img.style.height = '100%';
				img.setAttribute('border', '0');
				node.appendChild(img);
			}
		} else {
			node = document.createElement('v:image');
			node.setAttribute('src', this.image);
			this.configureVmlShape(node);
		}
	}
	return node;
};
mxImageShape.prototype.configureTransparentVmlBackground = function(node) {};
mxImageShape.prototype.redrawSvg = function() {
	this.updateSvgShape(this.innerNode);
	this.updateSvgShape(this.imageNode);
	if (this.bg != null) {
		this.updateSvgShape(this.bg);
		this.bg.setAttribute('fill', this.innerNode.getAttribute('fill'));
		this.bg.setAttribute('stroke', this.innerNode.getAttribute('stroke'));
		this.bg.setAttribute('shape-rendering', 'crispEdges');
	}
};
function mxLabel(bounds, fill, stroke, strokewidth) {
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = strokewidth || 1;
};
mxLabel.prototype = new mxShape();
mxLabel.prototype.constructor = mxLabel;
mxLabel.prototype.imageSize = mxConstants.DEFAULT_IMAGESIZE;
mxLabel.prototype.spacing = 2;
mxLabel.prototype.indicatorSize = 10;
mxLabel.prototype.indicatorSpacing = 2;
mxLabel.prototype.init = function(container) {
	mxShape.prototype.init.apply(this, arguments);
	if (this.indicatorColor != null && this.indicatorShape != null) {
		this.indicator = new this.indicatorShape();
		this.indicator.dialect = this.dialect;
		this.indicator.bounds = this.bounds;
		this.indicator.fill = this.indicatorColor;
		this.indicator.stroke = this.indicatorColor;
		this.indicator.gradient = this.indicatorGradientColor;
		this.indicator.direction = this.indicatorDirection;
		this.indicator.init(this.node);
		this.indicatorShape = null;
	}
};
mxLabel.prototype.reconfigure = function() {
	mxShape.prototype.reconfigure.apply(this);
	if (this.indicator != null) {
		this.indicator.fill = this.indicatorColor;
		this.indicator.stroke = this.indicatorColor;
		this.indicator.gradient = this.indicatorGradientColor;
		this.indicator.direction = this.indicatorDirection;
		this.indicator.reconfigure();
	}
};
mxLabel.prototype.createHtml = function() {
	var name = 'DIV';
	var node = document.createElement(name);
	this.configureHtmlShape(node);
	if (this.indicatorImage != null) {
		this.indicatorImageNode = mxUtils.createImage(this.indicatorImage);
		this.indicatorImageNode.style.position = 'absolute';
		node.appendChild(this.indicatorImageNode);
	}
	if (this.image != null) {
		this.imageNode = mxUtils.createImage(this.image);
		this.stroke = null;
		this.configureHtmlShape(this.imageNode);
		node.appendChild(this.imageNode);
	}
	return node;
};
mxLabel.prototype.createVml = function() {
	var node = document.createElement('v:group');
	var name = (this.isRounded) ? 'v:roundrect': 'v:rect';
	this.rectNode = document.createElement(name);
	this.configureVmlShape(this.rectNode);
	this.isShadow = false;
	this.configureVmlShape(node);
	node.setAttribute('coordorigin', '0,0');
	node.appendChild(this.rectNode);
	if (this.indicatorImage != null) {
		this.indicatorImageNode = document.createElement('v:image');
		this.indicatorImageNode.setAttribute('src', this.indicatorImage);
		node.appendChild(this.indicatorImageNode);
	}
	if (this.image != null) {
		this.imageNode = document.createElement('v:image');
		this.imageNode.setAttribute('src', this.image);
		this.configureVmlShape(this.imageNode);
		node.appendChild(this.imageNode);
	}
	this.label = document.createElement('v:rect');
	this.label.style.top = '0px';
	this.label.style.left = '0px';
	this.label.setAttribute('filled', 'false');
	this.label.setAttribute('stroked', 'false');
	node.appendChild(this.label);
	return node;
};
mxLabel.prototype.createSvg = function() {
	var g = this.createSvgGroup('rect');
	if (this.indicatorImage != null) {
		this.indicatorImageNode = document.createElementNS(mxConstants.NS_SVG, 'image');
		this.indicatorImageNode.setAttributeNS(mxConstants.NS_XLINK, 'href', this.indicatorImage);
		g.appendChild(this.indicatorImageNode);
	}
	if (this.image != null) {
		this.imageNode = document.createElementNS(mxConstants.NS_SVG, 'image');
		this.imageNode.setAttributeNS(mxConstants.NS_XLINK, 'href', this.image);
		this.imageNode.setAttribute('style', 'pointer-events:none');
		this.configureSvgShape(this.imageNode);
		g.appendChild(this.imageNode);
	}
	return g;
};
mxLabel.prototype.redraw = function() {
	var isSvg = (this.dialect == mxConstants.DIALECT_SVG);
	var isVml = mxUtils.isVml(this.node);
	if (isSvg) {
		this.updateSvgShape(this.innerNode);
		if (this.shadowNode != null) {
			this.updateSvgShape(this.shadowNode);
		}
	} else if (isVml) {
		this.updateVmlShape(this.node);
		this.node.setAttribute('coordsize', this.bounds.width + ',' + this.bounds.height);
		this.updateVmlShape(this.rectNode);
		this.rectNode.style.top = '0px';
		this.rectNode.style.left = '0px';
		this.label.style.width = this.bounds.width + 'px';
		this.label.style.height = this.bounds.height + 'px';
	} else {
		this.updateHtmlShape(this.node);
	}
	var imageWidth = 0;
	var imageHeight = 0;
	if (this.imageNode != null) {
		imageWidth = (this.style[mxConstants.STYLE_IMAGE_WIDTH] || this.imageSize) * this.scale;
		imageHeight = (this.style[mxConstants.STYLE_IMAGE_HEIGHT] || this.imageSize) * this.scale;
	}
	var indicatorSpacing = 0;
	var indicatorWidth = 0;
	var indicatorHeight = 0;
	if (this.indicator != null || this.indicatorImageNode != null) {
		indicatorSpacing = (this.style[mxConstants.STYLE_INDICATOR_SPACING] || this.indicatorSpacing) * this.scale;
		indicatorWidth = (this.style[mxConstants.STYLE_INDICATOR_WIDTH] || this.indicatorSize) * this.scale;
		indicatorHeight = (this.style[mxConstants.STYLE_INDICATOR_HEIGHT] || this.indicatorSize) * this.scale;
	}
	var align = this.style[mxConstants.STYLE_IMAGE_ALIGN];
	var valign = this.style[mxConstants.STYLE_IMAGE_VERTICAL_ALIGN];
	var inset = this.spacing * this.scale;
	var width = Math.max(imageWidth, indicatorWidth);
	var height = imageHeight + indicatorSpacing + indicatorHeight;
	var x = (isSvg) ? this.bounds.x: 0;
	if (align == mxConstants.ALIGN_RIGHT) {
		x += this.bounds.width - width - inset;
	} else if (align == mxConstants.ALIGN_CENTER) {
		x += (this.bounds.width - width) / 2;
	} else {
		x += inset;
	}
	var y = (isSvg) ? this.bounds.y: 0;
	if (valign == mxConstants.ALIGN_BOTTOM) {
		y += this.bounds.height - height - inset;
	} else if (valign == mxConstants.ALIGN_TOP) {
		y += inset;
	} else {
		y += (this.bounds.height - height) / 2;
	}
	if (this.imageNode != null) {
		if (isSvg) {
			this.imageNode.setAttribute('x', (x + (width - imageWidth) / 2) + 'px');
			this.imageNode.setAttribute('y', y + 'px');
			this.imageNode.setAttribute('width', imageWidth + 'px');
			this.imageNode.setAttribute('height', imageHeight + 'px');
		} else {
			this.imageNode.style.left = (x + width - imageWidth) + 'px';
			this.imageNode.style.top = y + 'px';
			this.imageNode.style.width = imageWidth + 'px';
			this.imageNode.style.height = imageHeight + 'px';
		}
	}
	if (this.indicator != null) {
		this.indicator.bounds = new mxRectangle(x + (width - indicatorWidth) / 2, y + imageHeight + indicatorSpacing, indicatorWidth, indicatorHeight);
		this.indicator.redraw();
	} else if (this.indicatorImageNode != null) {
		if (isSvg) {
			this.indicatorImageNode.setAttribute('x', (x + (width - indicatorWidth) / 2) + 'px');
			this.indicatorImageNode.setAttribute('y', (y + imageHeight + indicatorSpacing) + 'px');
			this.indicatorImageNode.setAttribute('width', indicatorWidth + 'px');
			this.indicatorImageNode.setAttribute('height', indicatorHeight + 'px');
		} else {
			this.indicatorImageNode.style.left = (x + (width - indicatorWidth) / 2) + 'px';
			this.indicatorImageNode.style.top = (y + imageHeight + indicatorSpacing) + 'px';
			this.indicatorImageNode.style.width = indicatorWidth + 'px';
			this.indicatorImageNode.style.height = indicatorHeight + 'px';
		}
	}
};
mxLabel.prototype.updateSvgShape = function() {
	this.crisp = !this.isRounded;
	mxShape.prototype.updateSvgShape.apply(this, arguments);
};
function mxCylinder(bounds, fill, stroke, strokewidth) {
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = strokewidth || 1;
};
mxCylinder.prototype = new mxShape();
mxCylinder.prototype.constructor = mxCylinder;
mxCylinder.prototype.mixedModeHtml = false;
mxCylinder.prototype.preferModeHtml = false;
mxCylinder.prototype.maxHeight = 40;
mxCylinder.prototype.create = function(container) {
	if (this.stroke == null) {
		this.stroke = this.fill;
	}
	return mxShape.prototype.create.apply(this, arguments);
};
mxCylinder.prototype.reconfigure = function() {
	if (this.dialect == mxConstants.DIALECT_SVG) {
		this.configureSvgShape(this.foreground);
		this.foreground.setAttribute('fill', 'none');
	} else if (mxUtils.isVml(this.node)) {
		this.configureVmlShape(this.background);
		this.configureVmlShape(this.foreground);
	}
	mxShape.prototype.reconfigure.apply(this);
};
mxCylinder.prototype.createVml = function() {
	var node = document.createElement('v:group');
	this.background = document.createElement('v:shape');
	this.label = this.background;
	this.configureVmlShape(this.background);
	node.appendChild(this.background);
	this.fill = null;
	this.isShadow = false;
	this.configureVmlShape(node);
	this.foreground = document.createElement('v:shape');
	this.configureVmlShape(this.foreground);
	node.appendChild(this.foreground);
	return node;
};
mxCylinder.prototype.redrawVml = function() {
	var x = Math.floor(this.bounds.x);
	var y = Math.floor(this.bounds.y);
	var w = Math.floor(this.bounds.width);
	var h = Math.floor(this.bounds.height);
	var s = this.strokewidth * this.scale;
	this.node.setAttribute('coordsize', w + ',' + h);
	this.background.setAttribute('coordsize', w + ',' + h);
	this.foreground.setAttribute('coordsize', w + ',' + h);
	this.updateVmlShape(this.node);
	this.updateVmlShape(this.background);
	this.background.style.top = '0px';
	this.background.style.left = '0px';
	this.background.style.rotation = null;
	this.updateVmlShape(this.foreground);
	this.foreground.style.top = '0px';
	this.foreground.style.left = '0px';
	this.foreground.style.rotation = null;
	this.background.setAttribute('strokeweight', s);
	this.foreground.setAttribute('strokeweight', s);
	var d = this.createPath(false);
	this.background.setAttribute('path', d);
	var d = this.createPath(true);
	this.foreground.setAttribute('path', d);
};
mxCylinder.prototype.createSvg = function() {
	var g = this.createSvgGroup('path');
	this.foreground = document.createElementNS(mxConstants.NS_SVG, 'path');
	if (this.stroke != null && this.stroke != mxConstants.NONE) {
		this.foreground.setAttribute('stroke', this.stroke);
	} else {
		this.foreground.setAttribute('stroke', 'none');
	}
	this.foreground.setAttribute('fill', 'none');
	g.appendChild(this.foreground);
	return g;
};
mxCylinder.prototype.redrawSvg = function() {
	var strokeWidth = Math.max(1, this.strokewidth * this.scale);
	this.innerNode.setAttribute('stroke-width', strokeWidth);
	var d = this.createPath(false);
	if (d.length > 0) {
		this.innerNode.setAttribute('d', d);
		this.updateSvgTransform(this.innerNode, false);
	} else {
		this.innerNode.removeAttribute('d');
	}
	if (this.shadowNode != null) {
		this.shadowNode.setAttribute('stroke-width', strokeWidth);
		this.shadowNode.setAttribute('d', d);
		this.updateSvgTransform(this.shadowNode, true);
	}
	d = this.createPath(true);
	if (d.length > 0) {
		this.foreground.setAttribute('stroke-width', strokeWidth);
		this.foreground.setAttribute('d', d);
		this.updateSvgTransform(this.foreground, false);
	} else {
		this.foreground.removeAttribute('d');
	}
};
mxCylinder.prototype.redrawPath = function(path, x, y, w, h, isForeground) {
	var dy = Math.min(this.maxHeight, Math.floor(h / 5));
	if (isForeground) {
		path.moveTo(0, dy);
		path.curveTo(0, 2 * dy, w, 2 * dy, w, dy);
	} else {
		path.moveTo(0, dy);
		path.curveTo(0, -dy / 3, w, -dy / 3, w, dy);
		path.lineTo(w, h - dy);
		path.curveTo(w, h + dy / 3, 0, h + dy / 3, 0, h - dy);
		path.close();
	}
};
function mxConnector(points, stroke, strokewidth) {
	this.points = points;
	this.stroke = stroke || 'black';
	this.strokewidth = strokewidth || 1;
};
mxConnector.prototype = new mxShape();
mxConnector.prototype.constructor = mxConnector;
mxConnector.prototype.mixedModeHtml = false;
mxConnector.prototype.preferModeHtml = false;
mxConnector.prototype.configureHtmlShape = function(node) {
	mxShape.prototype.configureHtmlShape.apply(this, arguments);
	node.style.borderStyle = '';
	node.style.background = '';
};
mxConnector.prototype.createVml = function() {
	var node = document.createElement('v:shape');
	this.strokeNode = document.createElement('v:stroke');
	this.configureVmlShape(node);
	this.strokeNode.setAttribute('endarrow', this.endArrow);
	this.strokeNode.setAttribute('startarrow', this.startArrow);
	if (this.opacity != null) {
		this.strokeNode.setAttribute('opacity', this.opacity + '%');
	}
	node.appendChild(this.strokeNode);
	return node;
};
mxConnector.prototype.redrawVml = function() {
	if (this.node != null && this.strokeNode != null) {
		var startSize = mxUtils.getValue(this.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_MARKERSIZE) * this.scale;
		var endSize = mxUtils.getValue(this.style, mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE) * this.scale;
		var startWidth = 'medium';
		var startLength = 'medium';
		var endWidth = 'medium';
		var endLength = 'medium';
		if (startSize < 6) {
			startWidth = 'narrow';
			startLength = 'short';
		} else if (startSize > 10) {
			startWidth = 'wide';
			startLength = 'long';
		}
		if (endSize < 6) {
			endWidth = 'narrow';
			endLength = 'short';
		} else if (endSize > 10) {
			endWidth = 'wide';
			endLength = 'long';
		}
		this.strokeNode.setAttribute('startarrowwidth', startWidth);
		this.strokeNode.setAttribute('startarrowlength', startLength);
		this.strokeNode.setAttribute('endarrowwidth', endWidth);
		this.strokeNode.setAttribute('endarrowlength', endLength);
		this.updateVmlShape(this.node);
	}
};
mxConnector.prototype.createSvg = function() {
	var g = this.createSvgGroup('path');
	var color = this.innerNode.getAttribute('stroke');
	if (this.shadowNode != null) {
		this.shadowNode.setAttribute('fill', 'none');
	}
	if (this.startArrow != null) {
		this.start = document.createElementNS(mxConstants.NS_SVG, 'path');
		g.appendChild(this.start);
	}
	if (this.endArrow != null) {
		this.end = document.createElementNS(mxConstants.NS_SVG, 'path');
		g.appendChild(this.end);
	}
	this.pipe = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.pipe.setAttribute('stroke', color);
	this.pipe.setAttribute('visibility', 'hidden');
	this.pipe.setAttribute('pointer-events', 'stroke');
	g.appendChild(this.pipe);
	return g;
};
mxConnector.prototype.redrawSvg = function() {
	mxShape.prototype.redrawSvg.apply(this, arguments);
	var strokeWidth = this.strokewidth * this.scale;
	var color = this.innerNode.getAttribute('stroke');
	if (this.points != null && this.points[0] != null) {
		if (this.start != null) {
			var p0 = this.points[1];
			var pe = this.points[0];
			var size = mxUtils.getValue(this.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_MARKERSIZE);
			this.startOffset = this.redrawSvgMarker(this.start, this.startArrow, p0, pe, color, size);
		}
		if (this.end != null) {
			var n = this.points.length;
			var p0 = this.points[n - 2];
			var pe = this.points[n - 1];
			var size = mxUtils.getValue(this.style, mxConstants.STYLE_ENDSIZE, mxConstants.DEFAULT_MARKERSIZE);
			this.endOffset = this.redrawSvgMarker(this.end, this.endArrow, p0, pe, color, size);
		}
	}
	this.updateSvgShape(this.innerNode);
	var d = this.innerNode.getAttribute('d');
	if (d != null) {
		this.pipe.setAttribute('d', this.innerNode.getAttribute('d'));
		this.pipe.setAttribute('stroke-width', strokeWidth + mxShape.prototype.SVG_STROKE_TOLERANCE);
	}
	this.innerNode.setAttribute('fill', 'none');
};
mxConnector.prototype.redrawSvgMarker = function(node, type, p0, pe, color, size) {
	var offset = null;
	var dx = pe.x - p0.x;
	var dy = pe.y - p0.y;
	if (isNaN(dx) || isNaN(dy)) {
		return;
	}
	var dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
	var absSize = size * this.scale;
	var nx = dx * absSize / dist;
	var ny = dy * absSize / dist;
	pe = pe.clone();
	pe.x -= nx * this.strokewidth / (2 * size);
	pe.y -= ny * this.strokewidth / (2 * size);
	nx *= 0.5 + this.strokewidth / 2;
	ny *= 0.5 + this.strokewidth / 2;
	if (type == 'classic' || type == 'block') {
		var d = 'M ' + pe.x + ' ' + pe.y + ' L ' + (pe.x - nx - ny / 2) + ' ' + (pe.y - ny + nx / 2) + ((type != 'classic') ? '': ' L ' + (pe.x - nx * 3 / 4) + ' ' + (pe.y - ny * 3 / 4)) + ' L ' + (pe.x + ny / 2 - nx) + ' ' + (pe.y - ny - nx / 2) + ' z';
		node.setAttribute('d', d);
		offset = new mxPoint( - nx * 3 / 4, -ny * 3 / 4);
	} else if (type == 'open') {
		nx *= 1.2;
		ny *= 1.2;
		var d = 'M ' + (pe.x - nx - ny / 2) + ' ' + (pe.y - ny + nx / 2) + ' L ' + (pe.x - nx / 6) + ' ' + (pe.y - ny / 6) + ' L ' + (pe.x + ny / 2 - nx) + ' ' + (pe.y - ny - nx / 2) + ' M ' + pe.x + ' ' + pe.y;
		node.setAttribute('d', d);
		node.setAttribute('fill', 'none');
		node.setAttribute('stroke-width', this.scale * this.strokewidth);
		offset = new mxPoint( - nx / 4, -ny / 4);
	} else if (type == 'oval') {
		nx *= 1.2;
		ny *= 1.2;
		absSize *= 1.2;
		var d = 'M ' + (pe.x - ny / 2) + ' ' + (pe.y + nx / 2) + ' a ' + (absSize / 2) + ' ' + (absSize / 2) + ' 0  1,1 ' + (nx / 8) + ' ' + (ny / 8) + ' z';
		node.setAttribute('d', d);
	} else if (type == 'diamond') {
		var d = 'M ' + (pe.x + nx / 2) + ' ' + (pe.y + ny / 2) + ' L ' + (pe.x - ny / 2) + ' ' + (pe.y + nx / 2) + ' L ' + (pe.x - nx / 2) + ' ' + (pe.y - ny / 2) + ' L ' + (pe.x + ny / 2) + ' ' + (pe.y - nx / 2) + ' z';
		node.setAttribute('d', d);
	}
	node.setAttribute('stroke', color);
	if (type != 'open') {
		node.setAttribute('fill', color);
	} else {
		node.setAttribute('stroke-linecap', 'round');
	}
	if (this.opacity != null) {
		node.setAttribute('fill-opacity', this.opacity / 100);
		node.setAttribute('stroke-opacity', this.opacity / 100);
	}
	return offset;
};
function mxSwimlane(bounds, fill, stroke, strokewidth) {
	this.bounds = bounds;
	this.fill = fill;
	this.stroke = stroke;
	this.strokewidth = strokewidth || 1;
};
mxSwimlane.prototype = new mxShape();
mxSwimlane.prototype.constructor = mxSwimlane;
mxSwimlane.prototype.imageSize = 16;
mxSwimlane.prototype.mixedModeHtml = false;
mxRhombus.prototype.preferModeHtml = false;
mxSwimlane.prototype.createHtml = function() {
	var node = document.createElement('DIV');
	this.configureHtmlShape(node);
	node.style.background = '';
	node.style.backgroundColor = '';
	node.style.borderStyle = 'none';
	this.label = document.createElement('DIV');
	this.configureHtmlShape(this.label);
	node.appendChild(this.label);
	this.content = document.createElement('DIV');
	var tmp = this.fill;
	this.configureHtmlShape(this.content);
	this.content.style.backgroundColor = '';
	if (mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true)) {
		this.content.style.borderTopStyle = 'none';
	} else {
		this.content.style.borderLeftStyle = 'none';
	}
	this.content.style.cursor = 'default';
	node.appendChild(this.content);
	var color = this.style[mxConstants.STYLE_SEPARATORCOLOR];
	if (color != null) {
		this.separator = document.createElement('DIV');
		this.separator.style.borderColor = color;
		this.separator.style.borderLeftStyle = 'dashed';
		node.appendChild(this.separator);
	}
	if (this.image != null) {
		this.imageNode = mxUtils.createImage(this.image);
		this.configureHtmlShape(this.imageNode);
		this.imageNode.style.borderStyle = 'none';
		node.appendChild(this.imageNode);
	}
	return node;
};
mxSwimlane.prototype.reconfigure = function(node) {
	mxShape.prototype.reconfigure.apply(this, arguments);
	if (this.dialect == mxConstants.DIALECT_SVG) {
		if (this.shadowNode != null) {
			this.updateSvgShape(this.shadowNode);
			if (mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true)) {
				this.shadowNode.setAttribute('height', this.startSize * this.scale);
			} else {
				this.shadowNode.setAttribute('width', this.startSize * this.scale);
			}
		}
	} else if (!mxUtils.isVml(this.node)) {
		this.node.style.background = '';
		this.node.style.backgroundColor = '';
	}
};
mxSwimlane.prototype.redrawHtml = function() {
	this.updateHtmlShape(this.node);
	this.node.style.background = '';
	this.node.style.backgroundColor = '';
	this.startSize = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE));
	this.updateHtmlShape(this.label);
	this.label.style.top = '0px';
	this.label.style.left = '0px';
	if (mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true)) {
		this.startSize = Math.min(this.startSize, this.bounds.height);
		this.label.style.height = (this.startSize * this.scale) + 'px';
		this.updateHtmlShape(this.content);
		this.content.style.background = '';
		this.content.style.backgroundColor = '';
		var h = this.startSize * this.scale;
		this.content.style.top = h + 'px';
		this.content.style.left = '0px';
		this.content.style.height = Math.max(1, this.bounds.height - h) + 'px';
		if (this.separator != null) {
			this.separator.style.left = Math.floor(this.bounds.width) + 'px';
			this.separator.style.top = Math.floor(this.startSize * this.scale) + 'px';
			this.separator.style.width = '1px';
			this.separator.style.height = Math.floor(this.bounds.height) + 'px';
			this.separator.style.borderWidth = Math.floor(this.scale) + 'px';
		}
		if (this.imageNode != null) {
			this.imageNode.style.left = (this.bounds.width - this.imageSize - 4) + 'px';
			this.imageNode.style.top = '0px';
			this.imageNode.style.width = Math.floor(this.imageSize * this.scale) + 'px';
			this.imageNode.style.height = Math.floor(this.imageSize * this.scale) + 'px';
		}
	} else {
		this.startSize = Math.min(this.startSize, this.bounds.width);
		this.label.style.width = (this.startSize * this.scale) + 'px';
		this.updateHtmlShape(this.content);
		this.content.style.background = '';
		this.content.style.backgroundColor = '';
		var w = this.startSize * this.scale;
		this.content.style.top = '0px';
		this.content.style.left = w + 'px';
		this.content.style.width = Math.max(0, this.bounds.width - w) + 'px';
		if (this.separator != null) {
			this.separator.style.left = Math.floor(this.startSize * this.scale) + 'px';
			this.separator.style.top = Math.floor(this.bounds.height) + 'px';
			this.separator.style.width = Math.floor(this.bounds.width) + 'px';
			this.separator.style.height = '1px';
		}
		if (this.imageNode != null) {
			this.imageNode.style.left = (this.bounds.width - this.imageSize - 4) + 'px';
			this.imageNode.style.top = '0px';
			this.imageNode.style.width = this.imageSize * this.scale + 'px';
			this.imageNode.style.height = this.imageSize * this.scale + 'px';
		}
	}
};
mxSwimlane.prototype.createVml = function() {
	var node = document.createElement('v:group');
	var name = (this.isRounded) ? 'v:roundrect': 'v:rect';
	this.label = document.createElement(name);
	this.configureVmlShape(this.label);
	if (this.isRounded) {
		this.label.setAttribute('arcsize', '20%');
	}
	this.isShadow = false;
	this.configureVmlShape(node);
	node.setAttribute('coordorigin', '0,0');
	node.appendChild(this.label);
	this.content = document.createElement(name);
	var tmp = this.fill;
	this.fill = null;
	this.configureVmlShape(this.content);
	node.style.background = '';
	if (this.isRounded) {
		this.content.setAttribute('arcsize', '4%');
	}
	this.fill = tmp;
	this.content.style.borderBottom = '0px';
	node.appendChild(this.content);
	var color = this.style[mxConstants.STYLE_SEPARATORCOLOR];
	if (color != null) {
		this.separator = document.createElement('v:shape');
		this.separator.setAttribute('strokecolor', color);
		this.separator.style.position = 'absolute';
		var strokeNode = document.createElement('v:stroke');
		strokeNode.setAttribute('dashstyle', '2 2');
		this.separator.appendChild(strokeNode);
		node.appendChild(this.separator);
	}
	if (this.image != null) {
		this.imageNode = document.createElement('v:image');
		this.imageNode.setAttribute('src', this.image);
		this.configureVmlShape(this.imageNode);
		node.appendChild(this.imageNode);
	}
	return node;
};
mxSwimlane.prototype.redrawVml = function() {
	var x = Math.round(this.bounds.x);
	var y = Math.round(this.bounds.y);
	var w = Math.round(this.bounds.width);
	var h = Math.round(this.bounds.height);
	this.updateVmlShape(this.node);
	this.node.setAttribute('coordsize', w + ',' + h);
	this.updateVmlShape(this.label);
	this.label.style.top = '0px';
	this.label.style.left = '0px';
	this.label.style.rotation = null;
	this.startSize = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE));
	var start = Math.floor(this.startSize * this.scale);
	if (this.separator != null) {
		this.separator.setAttribute('coordsize', w + ',' + h);
		this.separator.style.left = x + 'px';
		this.separator.style.top = y + 'px';
		this.separator.style.width = w + 'px';
		this.separator.style.height = h + 'px';
	}
	if (mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true)) {
		start = Math.min(start, this.bounds.height);
		this.label.style.height = start + 'px';
		this.updateVmlShape(this.content);
		this.content.style.background = '';
		this.content.style.top = start + 'px';
		this.content.style.left = '0px';
		this.content.style.height = Math.max(0, h - start) + 'px';
		if (this.separator != null) {
			var d = 'm ' + (w - x) + ' ' + (start - y) + ' l ' + (w - x) + ' ' + (h - y) + ' e';
			this.separator.setAttribute('path', d);
		}
		if (this.imageNode != null) {
			var img = Math.floor(this.imageSize * this.scale);
			this.imageNode.style.left = (w - img - 4) + 'px';
			this.imageNode.style.top = '0px';
			this.imageNode.style.width = img + 'px';
			this.imageNode.style.height = img + 'px';
		}
	} else {
		start = Math.min(start, this.bounds.width);
		this.label.style.width = start + 'px';
		this.updateVmlShape(this.content);
		this.content.style.background = '';
		this.content.style.top = '0px';
		this.content.style.left = start + 'px';
		this.content.style.width = Math.max(0, w - start) + 'px';
		if (this.separator != null) {
			var d = 'm ' + (start - x) + ' ' + (h - y) + ' l ' + (w - x) + ' ' + (h - y) + ' e';
			this.separator.setAttribute('path', d);
		}
		if (this.imageNode != null) {
			var img = Math.floor(this.imageSize * this.scale);
			this.imageNode.style.left = (w - img - 4) + 'px';
			this.imageNode.style.top = '0px';
			this.imageNode.style.width = img + 'px';
			this.imageNode.style.height = img + 'px';
		}
	}
	this.content.style.rotation = null;
};
mxSwimlane.prototype.createSvg = function() {
	var node = this.createSvgGroup('rect');
	if (this.isRounded) {
		this.innerNode.setAttribute('rx', 10);
		this.innerNode.setAttribute('ry', 10);
	}
	this.content = document.createElementNS(mxConstants.NS_SVG, 'path');
	this.configureSvgShape(this.content);
	this.content.setAttribute('fill', 'none');
	if (this.isRounded) {
		this.content.setAttribute('rx', 10);
		this.content.setAttribute('ry', 10);
	}
	node.appendChild(this.content);
	var color = this.style[mxConstants.STYLE_SEPARATORCOLOR];
	if (color != null) {
		this.separator = document.createElementNS(mxConstants.NS_SVG, 'line');
		this.separator.setAttribute('stroke', color);
		this.separator.setAttribute('fill', 'none');
		this.separator.setAttribute('stroke-dasharray', '2, 2');
		node.appendChild(this.separator);
	}
	if (this.image != null) {
		this.imageNode = document.createElementNS(mxConstants.NS_SVG, 'image');
		this.imageNode.setAttributeNS(mxConstants.NS_XLINK, 'href', this.image);
		this.configureSvgShape(this.imageNode);
		node.appendChild(this.imageNode);
	}
	return node;
};
mxSwimlane.prototype.redrawSvg = function() {
	this.crisp = !this.isRounded;
	var tmp = this.isRounded;
	this.isRounded = false;
	this.updateSvgShape(this.innerNode);
	this.updateSvgShape(this.content);
	var horizontal = mxUtils.getValue(this.style, mxConstants.STYLE_HORIZONTAL, true);
	if (this.shadowNode != null) {
		this.updateSvgShape(this.shadowNode);
		if (horizontal) {
			this.shadowNode.setAttribute('height', this.startSize * this.scale);
		} else {
			this.shadowNode.setAttribute('width', this.startSize * this.scale);
		}
	}
	this.isRounded = tmp;
	this.startSize = parseInt(mxUtils.getValue(this.style, mxConstants.STYLE_STARTSIZE, mxConstants.DEFAULT_STARTSIZE));
	if (horizontal) {
		this.startSize = Math.min(this.startSize, this.bounds.height);
		this.innerNode.setAttribute('height', this.startSize * this.scale);
		var h = this.startSize * this.scale;
		var points = 'M ' + this.bounds.x + ' ' + (this.bounds.y + h) + ' l 0 ' + (this.bounds.height - h) + ' l ' + this.bounds.width + ' 0' + ' l 0 ' + ( - this.bounds.height + h);
		this.content.setAttribute('d', points);
		this.content.removeAttribute('x');
		this.content.removeAttribute('y');
		this.content.removeAttribute('width');
		this.content.removeAttribute('height');
		if (this.separator != null) {
			this.separator.setAttribute('x1', this.bounds.x + this.bounds.width);
			this.separator.setAttribute('y1', this.bounds.y + this.startSize * this.scale);
			this.separator.setAttribute('x2', this.bounds.x + this.bounds.width);
			this.separator.setAttribute('y2', this.bounds.y + this.bounds.height);
		}
		if (this.imageNode != null) {
			this.imageNode.setAttribute('x', this.bounds.x + this.bounds.width - this.imageSize - 4);
			this.imageNode.setAttribute('y', this.bounds.y);
			this.imageNode.setAttribute('width', this.imageSize * this.scale + 'px');
			this.imageNode.setAttribute('height', this.imageSize * this.scale + 'px');
		}
	} else {
		this.startSize = Math.min(this.startSize, this.bounds.width);
		this.innerNode.setAttribute('width', this.startSize * this.scale);
		var w = this.startSize * this.scale;
		var points = 'M ' + (this.bounds.x + w) + ' ' + this.bounds.y + ' l ' + (this.bounds.width - w) + ' 0' + ' l 0 ' + this.bounds.height + ' l ' + ( - this.bounds.width + w) + ' 0';
		this.content.setAttribute('d', points);
		this.content.removeAttribute('x');
		this.content.removeAttribute('y');
		this.content.removeAttribute('width');
		this.content.removeAttribute('height');
		if (this.separator != null) {
			this.separator.setAttribute('x1', this.bounds.x + this.startSize * this.scale);
			this.separator.setAttribute('y1', this.bounds.y + this.bounds.height);
			this.separator.setAttribute('x2', this.bounds.x + this.bounds.width);
			this.separator.setAttribute('y2', this.bounds.y + this.bounds.height);
		}
		if (this.imageNode != null) {
			this.imageNode.setAttribute('x', this.bounds.x + this.bounds.width - this.imageSize - 4);
			this.imageNode.setAttribute('y', this.bounds.y);
			this.imageNode.setAttribute('width', this.imageSize * this.scale + 'px');
			this.imageNode.setAttribute('height', this.imageSize * this.scale + 'px');
		}
	}
};
