var mxLog = {
	consoleResource: (mxClient.language != 'none') ? 'console': '',
	TRACE: false,
	DEBUG: true,
	WARN: true,
	buffer: '',
	init: function() {
		if (mxLog.window == null && document.body != null) {
			var title = (mxResources.get(mxLog.consoleResource) || mxLog.consoleResource) + ' - mxGraph ' + mxClient.VERSION;
			var table = document.createElement('table');
			table.setAttribute('width', '100%');
			table.setAttribute('height', '100%');
			var tbody = document.createElement('tbody');
			var tr = document.createElement('tr');
			var td = document.createElement('td');
			td.style.verticalAlign = 'top';
			mxLog.textarea = document.createElement('textarea');
			mxLog.textarea.setAttribute('readOnly', 'true');
			mxLog.textarea.style.width = "100%";
			mxLog.textarea.style.height = "100%";
			mxLog.textarea.value = mxLog.buffer;
			td.appendChild(mxLog.textarea);
			tr.appendChild(td);
			tbody.appendChild(tr);
			tr = document.createElement('tr');
			mxLog.td = document.createElement('td');
			mxLog.td.style.verticalAlign = 'top';
			mxLog.td.setAttribute('height', '30px');
			tr.appendChild(mxLog.td);
			tbody.appendChild(tr);
			table.appendChild(tbody);
			mxLog.addButton('Info',
			function(evt) {
				mxLog.info();
			});
			mxLog.addButton('DOM',
			function(evt) {
				var content = mxUtils.getInnerHtml(document.body);
				mxLog.debug(content);
			});
			mxLog.addButton('Trace',
			function(evt) {
				mxLog.TRACE = !mxLog.TRACE;
				if (mxLog.TRACE) {
					mxLog.debug('Tracing enabled');
				} else {
					mxLog.debug('Tracing disabled');
				}
			});
			mxLog.addButton('Copy',
			function(evt) {
				try {
					mxUtils.copy(mxLog.textarea.value);
				} catch(err) {
					mxUtils.alert(err);
				}
			});
			mxLog.addButton('Show',
			function(evt) {
				try {
					mxUtils.popup(mxLog.textarea.value);
				} catch(err) {
					mxUtils.alert(err);
				}
			});
			mxLog.addButton('Clear',
			function(evt) {
				mxLog.textarea.value = '';
			});
			var w = document.body.clientWidth;
			var h = (document.body.clientHeight || document.documentElement.clientHeight);
			mxLog.window = new mxWindow(title, table, w - 320, h - 210, 300, 160);
			mxLog.window.setMaximizable(true);
			mxLog.window.setScrollable(true);
			mxLog.window.setResizable(true);
			mxLog.window.setClosable(true);
			mxLog.window.destroyOnClose = false;
			if (false && document.compatMode != 'BackCompat') {
				var resizeHandler = function(sender, evt) {
					var elt = mxLog.window.getElement();
					mxLog.textarea.style.height = (elt.offsetHeight - 78) + 'px';
				};
				mxLog.window.addListener(mxEvent.RESIZE_END, resizeHandler);
				mxLog.window.addListener(mxEvent.MAXIMIZE, resizeHandler);
				mxLog.window.addListener(mxEvent.NORMALIZE, resizeHandler);
				var elt = mxLog.window.getElement();
				mxLog.textarea.style.height = '96px';
			}
		}
	},
	info: function() {
		mxLog.writeln(mxUtils.toString(navigator));
	},
	addButton: function(lab, funct) {
		var button = document.createElement('button');
		mxUtils.write(button, lab);
		mxEvent.addListener(button, 'click', funct);
		mxLog.td.appendChild(button);
	},
	isVisible: function() {
		if (mxLog.window != null) {
			return mxLog.window.isVisible();
		}
		return false;
	},
	show: function() {
		mxLog.setVisible(true);
	},
	setVisible: function(visible) {
		if (mxLog.window == null) {
			mxLog.init();
		}
		if (mxLog.window != null) {
			mxLog.window.setVisible(visible);
		}
	},
	enter: function(string) {
		if (mxLog.TRACE) {
			mxLog.writeln('Entering ' + string);
			return new Date().getTime();
		}
	},
	leave: function(string, t0) {
		if (mxLog.TRACE) {
			var dt = (t0 != 0) ? ' (' + (new Date().getTime() - t0) + ' ms)': '';
			mxLog.writeln('Leaving ' + string + dt);
		}
	},
	debug: function() {
		if (mxLog.DEBUG) {
			mxLog.writeln.apply(this, arguments);
		}
	},
	warn: function() {
		if (mxLog.WARN) {
			mxLog.writeln.apply(this, arguments);
		}
	},
	write: function() {
		var string = '';
		for (var i = 0; i < arguments.length; i++) {
			string += arguments[i];
			if (i < arguments.length - 1) {
				string += ' ';
			}
		}
		if (mxLog.textarea != null) {
			mxLog.textarea.value = mxLog.textarea.value + string;
			if (navigator.userAgent.indexOf('Presto/2.5') >= 0) {
				mxLog.textarea.style.visibility = 'hidden';
				mxLog.textarea.style.visibility = 'visible';
			}
			mxLog.textarea.scrollTop = mxLog.textarea.scrollHeight;
		} else {
			mxLog.buffer += string;
		}
	},
	writeln: function() {
		var string = '';
		for (var i = 0; i < arguments.length; i++) {
			string += arguments[i];
			if (i < arguments.length - 1) {
				string += ' ';
			}
		}
		mxLog.write(string + '\n');
	}
};
var mxObjectIdentity = {
	FIELD_NAME: 'mxObjectId',
	counter: 0,
	get: function(obj) {
		if (typeof(obj) == 'object' && obj[mxObjectIdentity.FIELD_NAME] == null) {
			var ctor = mxUtils.getFunctionName(obj.constructor);
			obj[mxObjectIdentity.FIELD_NAME] = ctor + '#' + mxObjectIdentity.counter++;
		}
		return obj[mxObjectIdentity.FIELD_NAME];
	},
	clear: function(obj) {
		if (typeof(obj) == 'object') {
			delete obj[mxObjectIdentity.FIELD_NAME];
		}
	}
};
function mxDictionary() {
	this.clear();
};
mxDictionary.prototype.map = null;
mxDictionary.prototype.clear = function() {
	this.map = {};
};
mxDictionary.prototype.get = function(key) {
	var id = mxObjectIdentity.get(key);
	return this.map[id];
};
mxDictionary.prototype.put = function(key, value) {
	var id = mxObjectIdentity.get(key);
	var previous = this.map[id];
	this.map[id] = value;
	return previous;
};
mxDictionary.prototype.remove = function(key) {
	var id = mxObjectIdentity.get(key);
	var previous = this.map[id];
	delete this.map[id];
	return previous;
};
mxDictionary.prototype.getKeys = function() {
	var result = [];
	for (key in this.map) {
		result.push(key);
	}
	return result;
};
mxDictionary.prototype.getValues = function() {
	var result = [];
	for (key in this.map) {
		result.push(this.map[key]);
	}
	return result;
};
mxDictionary.prototype.visit = function(visitor) {
	for (key in this.map) {
		visitor(key, this.map[key]);
	}
};
var mxResources = {
	resources: [],
	add: function(basename, lan) {
		lan = (lan != null) ? lan: mxClient.language;
		if (lan != mxConstants.NONE) {
			try {
				var req = mxUtils.load(basename + '.properties');
				if (req.isReady()) {
					mxResources.parse(req.getText());
				}
			} catch(e) {}
			try {
				var req = mxUtils.load(basename + '_' + lan + '.properties');
				if (req.isReady()) {
					mxResources.parse(req.getText());
				}
			} catch(e) {}
		}
	},
	parse: function(text) {
		if (text != null) {
			var lines = text.split('\n');
			for (var i = 0; i < lines.length; i++) {
				var index = lines[i].indexOf('=');
				if (index > 0) {
					var key = lines[i].substring(0, index);
					var idx = lines[i].length;
					if (lines[i].charCodeAt(idx - 1) == 13) {
						idx--;
					}
					var value = lines[i].substring(index + 1, idx);
					mxResources.resources[key] = unescape(value);
				}
			}
		}
	},
	get: function(key, params, defaultValue) {
		var value = mxResources.resources[key];
		if (value == null) {
			value = defaultValue;
		}
		if (value != null && params != null) {
			var result = [];
			var index = null;
			for (var i = 0; i < value.length; i++) {
				var c = value.charAt(i);
				if (c == '{') {
					index = '';
				} else if (index != null && c == '}') {
					index = parseInt(index) - 1;
					if (index >= 0 && index < params.length) {
						result.push(params[index]);
					}
					index = null;
				} else if (index != null) {
					index += c;
				} else {
					result.push(c);
				}
			}
			value = result.join('');
		}
		return value;
	}
};
function mxPoint(x, y) {
	this.x = (x != null) ? x: 0;
	this.y = (y != null) ? y: 0;
};
mxPoint.prototype.x = null;
mxPoint.prototype.y = null;
mxPoint.prototype.equals = function(obj) {
	return obj.x == this.x && obj.y == this.y;
};
mxPoint.prototype.clone = function() {
	return mxUtils.clone(this);
};
function mxRectangle(x, y, width, height) {
	mxPoint.call(this, x, y);
	this.width = (width != null) ? width: 0;
	this.height = (height != null) ? height: 0;
};
mxRectangle.prototype = new mxPoint();
mxRectangle.prototype.constructor = mxRectangle;
mxRectangle.prototype.width = null;
mxRectangle.prototype.height = null;
mxRectangle.prototype.getCenterX = function() {
	return this.x + this.width / 2;
};
mxRectangle.prototype.getCenterY = function() {
	return this.y + this.height / 2;
};
mxRectangle.prototype.add = function(rect) {
	if (rect != null) {
		var minX = Math.min(this.x, rect.x);
		var minY = Math.min(this.y, rect.y);
		var maxX = Math.max(this.x + this.width, rect.x + rect.width);
		var maxY = Math.max(this.y + this.height, rect.y + rect.height);
		this.x = minX;
		this.y = minY;
		this.width = maxX - minX;
		this.height = maxY - minY;
	}
};
mxRectangle.prototype.grow = function(amount) {
	this.x -= amount;
	this.y -= amount;
	this.width += 2 * amount;
	this.height += 2 * amount;
};
mxRectangle.prototype.getPoint = function() {
	return new mxPoint(this.x, this.y);
};
mxRectangle.prototype.equals = function(obj) {
	return obj.x == this.x && obj.y == this.y && obj.width == this.width && obj.height == this.height;
};
var mxEffects = {
	animateChanges: function(graph, changes) {
		var maxStep = 10;
		var step = 0;
		var animate = function() {
			var isRequired = false;
			for (var i = 0; i < changes.length; i++) {
				var change = changes[i];
				if (change.constructor == mxGeometryChange || change.constructor == mxTerminalChange || change.constructor == mxValueChange || change.constructor == mxChildChange || change.constructor == mxStyleChange) {
					var state = graph.getView().getState(change.cell || change.child, false);
					if (state != null) {
						isRequired = true;
						if (change.constructor != mxGeometryChange || graph.model.isEdge(change.cell)) {
							mxUtils.setOpacity(state.shape.node, 100 * step / maxStep);
						} else {
							var scale = graph.getView().scale;
							var dx = (change.geometry.x - change.previous.x) * scale;
							var dy = (change.geometry.y - change.previous.y) * scale;
							var sx = (change.geometry.width - change.previous.width) * scale;
							var sy = (change.geometry.height - change.previous.height) * scale;
							if (step == 0) {
								state.x -= dx;
								state.y -= dy;
								state.width -= sx;
								state.height -= sy;
							} else {
								state.x += dx / maxStep;
								state.y += dy / maxStep;
								state.width += sx / maxStep;
								state.height += sy / maxStep;
							}
							graph.cellRenderer.redraw(state);
							mxEffects.cascadeOpacity(graph, change.cell, 100 * step / maxStep);
						}
					}
				}
			}
			mxUtils.repaintGraph(graph, new mxPoint(1, 1));
			if (step < maxStep && isRequired) {
				step++;
				window.setTimeout(animate, delay);
			}
		};
		var delay = 30;
		animate();
	},
	cascadeOpacity: function(graph, cell, opacity) {
		var childCount = graph.model.getChildCount(cell);
		for (var i = 0; i < childCount; i++) {
			var child = graph.model.getChildAt(cell, i);
			var childState = graph.getView().getState(child);
			if (childState != null) {
				mxUtils.setOpacity(childState.shape.node, opacity);
				mxEffects.cascadeOpacity(graph, child, opacity);
			}
		}
		var edges = graph.model.getEdges(cell);
		if (edges != null) {
			for (var i = 0; i < edges.length; i++) {
				var edgeState = graph.getView().getState(edges[i]);
				if (edgeState != null) {
					mxUtils.setOpacity(edgeState.shape.node, opacity);
				}
			}
		}
	},
	fadeOut: function(node, from, remove, step, delay, isEnabled) {
		step = step || 40;
		delay = delay || 30;
		var opacity = from || 100;
		mxUtils.setOpacity(node, opacity);
		if (isEnabled || isEnabled == null) {
			var f = function() {
				opacity = Math.max(opacity - step, 0);
				mxUtils.setOpacity(node, opacity);
				if (opacity > 0) {
					window.setTimeout(f, delay);
				} else {
					node.style.visibility = 'hidden';
					if (remove && node.parentNode) {
						node.parentNode.removeChild(node);
					}
				}
			};
			window.setTimeout(f, delay);
		} else {
			node.style.visibility = 'hidden';
			if (remove && node.parentNode) {
				node.parentNode.removeChild(node);
			}
		}
	}
};
var mxUtils = {
	errorResource: (mxClient.language != 'none') ? 'error': '',
	closeResource: (mxClient.language != 'none') ? 'close': '',
	errorImage: mxClient.imageBasePath + '/error.gif',
	removeCursors: function(element) {
		if (element.style != null) {
			element.style.cursor = '';
		}
		var children = element.childNodes;
		if (children != null) {
			var childCount = children.length;
			for (var i = 0; i < childCount; i += 1) {
				mxUtils.removeCursors(children[i]);
			}
		}
	},
	repaintGraph: function(graph, pt) {
		var c = graph.container;
		if (c != null && pt != null && (false || false || false) && (c.scrollLeft > 0 || c.scrollTop > 0)) {
			var dummy = document.createElement('div');
			dummy.style.position = 'absolute';
			dummy.style.left = pt.x + 'px';
			dummy.style.top = pt.y + 'px';
			dummy.style.width = '1px';
			dummy.style.height = '1px';
			c.appendChild(dummy);
			c.removeChild(dummy);
		}
	},
	getCurrentStyle: function() {
		if (true) {
			return function(element) {
				return (element != null) ? element.currentStyle: null;
			};
		} else {
			return function(element) {
				return (element != null) ? window.getComputedStyle(element, '') : null;
			};
		}
	} (),
	hasScrollbars: function(node) {
		var style = mxUtils.getCurrentStyle(node);
		return style != null && (style.overflow == 'scroll' || style.overflow == 'auto');
	},
	bind: function(scope, funct) {
		return function() {
			return funct.apply(scope, arguments);
		};
	},
	eval: function(expr) {
		var result = null;
		if (expr.indexOf('function') >= 0) {
			try {
				eval('var _mxJavaScriptExpression=' + expr);
				result = _mxJavaScriptExpression;
				_mxJavaScriptExpression = null;
			} catch(e) {
				mxLog.warn(e.message + ' while evaluating ' + expr);
			}
		} else {
			try {
				result = eval(expr);
			} catch(e) {
				mxLog.warn(e.message + ' while evaluating ' + expr);
			}
		}
		return result;
	},
	findNode: function(node, attr, value) {
		var tmp = node.getAttribute(attr);
		if (tmp != null && tmp == value) {
			return node;
		}
		node = node.firstChild;
		while (node != null) {
			var result = mxUtils.findNode(node, attr, value);
			if (result != null) {
				return result;
			}
			node = node.nextSibling;
		}
		return null;
	},
	selectSingleNode: function() {
		if (true) {
			return function(doc, expr) {
				return doc.selectSingleNode(expr);
			};
		} else {
			return function(doc, expr) {
				var result = doc.evaluate(expr, doc, null, XPathResult.ANY_TYPE, null);
				return result.iterateNext();
			};
		}
	} (),
	getFunctionName: function(f) {
		var str = null;
		if (f != null) {
			if (f.name != null) {
				str = f.name;
			} else {
				var tmp = f.toString();
				var idx1 = 9;
				while (tmp.charAt(idx1) == ' ') {
					idx1++;
				}
				var idx2 = tmp.indexOf('(', idx1);
				str = tmp.substring(idx1, idx2);
			}
		}
		return str;
	},
	indexOf: function(array, obj) {
		if (array != null && obj != null) {
			for (var i = 0; i < array.length; i++) {
				if (array[i] == obj) {
					return i;
				}
			}
		}
		return - 1;
	},
	remove: function(obj, array) {
		var result = null;
		if (typeof(array) == 'object') {
			var index = mxUtils.indexOf(array, obj);
			while (index >= 0) {
				array.splice(index, 1);
				result = obj;
				index = mxUtils.indexOf(array, obj);
			}
		}
		for (var key in array) {
			if (array[key] == obj) {
				delete array[key];
				result = obj;
			}
		}
		return result;
	},
	isNode: function(value, nodeName, attributeName, attributeValue) {
		if (value != null && !isNaN(value.nodeType) && (nodeName == null || value.nodeName.toLowerCase() == nodeName.toLowerCase())) {
			return attributeName == null || value.getAttribute(attributeName) == attributeValue;
		}
		return false;
	},
	getChildNodes: function(node, nodeType) {
		nodeType = nodeType || mxConstants.NODETYPE_ELEMENT;
		var children = [];
		var tmp = node.firstChild;
		while (tmp != null) {
			if (tmp.nodeType == nodeType) {
				children.push(tmp);
			}
			tmp = tmp.nextSibling;
		}
		return children;
	},
	createXmlDocument: function() {
		var doc = null;
		if (document.implementation && document.implementation.createDocument) {
			doc = document.implementation.createDocument('', '', null);
		} else if (window.ActiveXObject) {
			doc = new ActiveXObject('Microsoft.XMLDOM');
		}
		return doc;
	},
	parseXml: function() {
		if (true) {
			return function(xml) {
				var result = mxUtils.createXmlDocument();
				result.async = 'false';
				result.loadXML(xml);
				return result;
			};
		} else {
			return function(xml) {
				var parser = new DOMParser();
				return parser.parseFromString(xml, 'text/xml');
			};
		}
	} (),
	createXmlElement: function(nodeName) {
		return mxUtils.parseXml('<' + nodeName + '/>').documentElement;
	},
	getPrettyXml: function(node, tab, indent) {
		var result = [];
		if (node != null) {
			tab = tab || '  ';
			indent = indent || '';
			if (node.nodeType == mxConstants.NODETYPE_TEXT) {
				result.push(node.nodeValue);
			} else {
				result.push(indent + '<' + node.nodeName);
				var attrs = node.attributes;
				if (attrs != null) {
					for (var i = 0; i < attrs.length; i++) {
						var val = mxUtils.htmlEntities(attrs[i].nodeValue);
						result.push(' ' + attrs[i].nodeName + '="' + val + '"');
					}
				}
				var tmp = node.firstChild;
				if (tmp != null) {
					result.push('>\n');
					while (tmp != null) {
						result.push(mxUtils.getPrettyXml(tmp, tab, indent + tab));
						tmp = tmp.nextSibling;
					}
					result.push(indent + '</' + node.nodeName + '>\n');
				} else {
					result.push('/>\n');
				}
			}
		}
		return result.join('');
	},
	removeWhitespace: function(node, before) {
		var tmp = (before) ? node.previousSibling: node.nextSibling;
		while (tmp != null && tmp.nodeType == mxConstants.NODETYPE_TEXT) {
			var next = (before) ? tmp.previousSibling: tmp.nextSibling;
			var text = mxUtils.getTextContent(tmp);
			if (mxUtils.trim(text).length == 0) {
				tmp.parentNode.removeChild(tmp);
			}
			tmp = next;
		}
	},
	htmlEntities: function(s, newline) {
		s = s || '';
		s = s.replace(/&/g, '&amp;');
		s = s.replace(/"/g, '&quot;');
		s = s.replace(/\'/g, '&#39;');
		s = s.replace(/</g, '&lt;');
		s = s.replace(/>/g, '&gt;');
		if (newline == null || newline) {
			s = s.replace(/\n/g, '&#xa;');
		}
		return s;
	},
	isVml: function(node) {
		return node != null && node.tagUrn == 'urn:schemas-microsoft-com:vml';
	},
	getXml: function(node, linefeed) {
		var xml = '';
		if (node != null) {
			xml = node.xml;
			if (xml == null) {
				if (true) {
					xml = node.innerHTML;
				} else {
					var xmlSerializer = new XMLSerializer();
					xml = xmlSerializer.serializeToString(node);
				}
			} else {
				xml = xml.replace(/\r\n\t[\t]*/g, '').replace(/>\r\n/g, '>').replace(/\r\n/g, '\n');
			}
		}
		linefeed = linefeed || '&#xa;';
		xml = xml.replace(/\n/g, linefeed);
		return xml;
	},
	getTextContent: function(node) {
		var result = '';
		if (node != null) {
			if (node.firstChild != null) {
				node = node.firstChild;
			}
			result = node.nodeValue || '';
		}
		return result;
	},
	getInnerHtml: function() {
		if (true) {
			return function(node) {
				if (node != null) {
					return node.innerHTML;
				}
				return '';
			};
		} else {
			return function(node) {
				if (node != null) {
					var serializer = new XMLSerializer();
					return serializer.serializeToString(node);
				}
				return '';
			};
		}
	} (),
	getOuterHtml: function() {
		if (true) {
			return function(node) {
				if (node != null) {
					var tmp = [];
					tmp.push('<' + node.nodeName);
					var attrs = node.attributes;
					for (var i = 0; i < attrs.length; i++) {
						var value = attrs[i].nodeValue;
						if (value != null && value.length > 0) {
							tmp.push(' ');
							tmp.push(attrs[i].nodeName);
							tmp.push('="');
							tmp.push(value);
							tmp.push('"');
						}
					}
					if (node.innerHTML.length == 0) {
						tmp.push('/>');
					} else {
						tmp.push('>');
						tmp.push(node.innerHTML);
						tmp.push('</' + node.nodeName + '>');
					}
					return tmp.join('');
				}
				return '';
			};
		} else {
			return function(node) {
				if (node != null) {
					var serializer = new XMLSerializer();
					return serializer.serializeToString(node);
				}
				return '';
			};
		}
	} (),
	write: function(parent, text, doc) {
		doc = (doc != null) ? doc: document;
		var node = doc.createTextNode(text);
		if (parent != null) {
			parent.appendChild(node);
		}
		return node;
	},
	writeln: function(parent, text, doc) {
		doc = (doc != null) ? doc: document;
		var node = doc.createTextNode(text);
		if (parent != null) {
			parent.appendChild(node);
			parent.appendChild(document.createElement('br'));
		}
		return node;
	},
	br: function(parent, count) {
		count = count || 1;
		var br;
		for (var i = 0; i < count; i++) {
			br = document.createElement('br');
			if (parent != null) {
				parent.appendChild(br);
			}
		}
		return br;
	},
	button: function(label, funct) {
		var button = document.createElement('button');
		mxUtils.write(button, label);
		mxEvent.addListener(button, 'click',
		function(evt) {
			funct(evt);
		});
		return button;
	},
	para: function(parent, text) {
		var p = document.createElement('p');
		mxUtils.write(p, text);
		if (parent != null) {
			parent.appendChild(p);
		}
		return p;
	},
	linkAction: function(parent, text, editor, action, pad) {
		return mxUtils.link(parent, text,
		function() {
			editor.execute(action)
		},
		pad);
	},
	linkInvoke: function(parent, text, editor, functName, arg, pad) {
		return mxUtils.link(parent, text,
		function() {
			editor[functName](arg)
		},
		pad);
	},
	link: function(parent, text, funct, pad) {
		var a = document.createElement('span');
		a.style.color = 'blue';
		a.style.textDecoration = 'underline';
		a.style.cursor = 'pointer';
		if (pad != null) {
			a.style.paddingLeft = pad + 'px';
		}
		mxEvent.addListener(a, 'click', funct);
		mxUtils.write(a, text);
		if (parent != null) {
			parent.appendChild(a);
		}
		return a;
	},
	fit: function(node) {
		var left = parseInt(node.offsetLeft);
		var width = parseInt(node.offsetWidth);
		var b = document.body;
		var d = document.documentElement;
		var right = (b.scrollLeft || d.scrollLeft) + (b.clientWidth || d.clientWidth);
		if (left + width > right) {
			node.style.left = Math.max((b.scrollLeft || d.scrollLeft), right - width) + 'px';
		}
		var top = parseInt(node.offsetTop);
		var height = parseInt(node.offsetHeight);
		var bottom = (b.scrollTop || d.scrollTop) + Math.max(b.clientHeight || 0, d.clientHeight);
		if (top + height > bottom) {
			node.style.top = Math.max((b.scrollTop || d.scrollTop), bottom - height) + 'px';
		}
	},
	open: function(filename) {
		if (false) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
			} catch(e) {
				mxUtils.alert('Permission to read file denied.');
				return '';
			}
			var file = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filename);
			if (!file.exists()) {
				mxUtils.alert('File not found.');
				return '';
			}
			var is = Components.classes['@mozilla.org/network/file-input-stream;1'].createInstance(Components.interfaces.nsIFileInputStream);
			is.init(file, 0x01, 00004, null);
			var sis = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
			sis.init(is);
			var output = sis.read(sis.available());
			return output;
		} else {
			var activeXObject = new ActiveXObject('Scripting.FileSystemObject');
			var newStream = activeXObject.OpenTextFile(filename, 1);
			var text = newStream.readAll();
			newStream.close();
			return text;
		}
		return null;
	},
	save: function(filename, content) {
		if (false) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
			} catch(e) {
				mxUtils.alert('Permission to write file denied.');
				return;
			}
			var file = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
			file.initWithPath(filename);
			if (!file.exists()) {
				file.create(0x00, 0644);
			}
			var outputStream = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
			outputStream.init(file, 0x20 | 0x02, 00004, null);
			outputStream.write(content, content.length);
			outputStream.flush();
			outputStream.close();
		} else {
			var fso = new ActiveXObject('Scripting.FileSystemObject');
			var file = fso.CreateTextFile(filename, true);
			file.Write(content);
			file.Close();
		}
	},
	saveAs: function(content) {
		var iframe = document.createElement('iframe');
		iframe.setAttribute('src', '');
		iframe.style.visibility = 'hidden';
		document.body.appendChild(iframe);
		try {
			if (false) {
				var doc = iframe.contentDocument;
				doc.open();
				doc.write(content);
				doc.close();
				try {
					netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
					iframe.focus();
					saveDocument(doc);
				} catch(e) {
					mxUtils.alert('Permission to save document denied.');
				}
			} else {
				var doc = iframe.contentWindow.document;
				doc.write(content);
				doc.execCommand('SaveAs', false, document.location);
			}
		} finally {
			document.body.removeChild(iframe);
		}
	},
	copy: function(content) {
		if (window.clipboardData) {
			window.clipboardData.setData('Text', content);
		} else {
			netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
			var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
			if (!clip) {
				return;
			}
			var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
			if (!trans) {
				return;
			}
			trans.addDataFlavor('text/unicode');
			var str = new Object();
			var len = new Object();
			var str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
			var copytext = content;
			str.data = copytext;
			trans.setTransferData('text/unicode', str, copytext.length * 2);
			var clipid = Components.interfaces.nsIClipboard;
			clip.setData(trans, null, clipid.kGlobalClipboard);
		}
	},
	load: function(url) {
		var req = new mxXmlRequest(url, null, 'GET', false);
		req.send();
		return req;
	},
	get: function(url, onload, onerror) {
		return new mxXmlRequest(url, null, 'GET').send(onload, onerror);
	},
	post: function(url, params, onload, onerror) {
		return new mxXmlRequest(url, params).send(onload, onerror);
	},
	submit: function(url, params, doc) {
		return new mxXmlRequest(url, params).simulate(doc);
	},
	loadInto: function(url, doc, onload) {
		if (true) {
			doc.onreadystatechange = function() {
				if (doc.readyState == 4) {
					onload()
				}
			};
		} else {
			doc.addEventListener('load', onload, false);
		}
		doc.load(url);
	},
	getValue: function(array, key, defaultValue) {
		var value = (array != null) ? array[key] : null;
		if (value == null) {
			value = defaultValue;
		}
		return value;
	},
	clone: function(obj, transients, shallow) {
		shallow = (shallow != null) ? shallow: false;
		var clone = null;
		if (obj != null && typeof(obj.constructor) == 'function') {
			clone = new obj.constructor();
			for (var i in obj) {
				if (i != mxObjectIdentity.FIELD_NAME && (transients == null || mxUtils.indexOf(transients, i) < 0)) {
					if (!shallow && typeof(obj[i]) == 'object') {
						clone[i] = mxUtils.clone(obj[i]);
					} else {
						clone[i] = obj[i];
					}
				}
			}
		}
		return clone;
	},
	equalPoints: function(a, b) {
		if ((a == null && b != null) || (a != null && b == null) || (a != null && b != null && a.length != b.length)) {
			return false;
		} else if (a != null && b != null) {
			for (var i = 0; i < a.length; i++) {
				if (a[i] == b[i] || (a[i] != null && !a[i].equals(b[i]))) {
					return false;
				}
			}
		}
		return true;
	},
	equalEntries: function(a, b) {
		if ((a == null && b != null) || (a != null && b == null) || (a != null && b != null && a.length != b.length)) {
			return false;
		} else if (a != null && b != null) {
			for (var key in a) {
				if (a[key] != b[key]) {
					return false;
				}
			}
		}
		return true;
	},
	toString: function(obj) {
		var output = '';
		for (var i in obj) {
			try {
				if (obj[i] == null) {
					output += i + ' = [null]\n';
				} else if (typeof(obj[i]) == 'function') {
					output += i + ' => [Function]\n';
				} else if (typeof(obj[i]) == 'object') {
					var ctor = mxUtils.getFunctionName(obj[i].constructor);
					output += i + ' => [' + ctor + ']\n';
				} else {
					output += i + ' = ' + obj[i] + '\n';
				}
			} catch(e) {
				output += i + '=' + e.message;
			}
		}
		return output;
	},
	toRadians: function(deg) {
		return Math.PI * deg / 180;
	},
	getBoundingBox: function(rect, rotation) {
		var result = null;
		if (rect != null && rotation != null && rotation != 0) {
			var rad = mxUtils.toRadians(rotation);
			var cos = Math.cos(rad);
			var sin = Math.sin(rad);
			var cx = new mxPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
			var p1 = new mxPoint(rect.x, rect.y);
			var p2 = new mxPoint(rect.x + rect.width, rect.y);
			var p3 = new mxPoint(p2.x, rect.y + rect.height);
			var p4 = new mxPoint(rect.x, p3.y);
			p1 = mxUtils.getRotatedPoint(p1, cos, sin, cx);
			p2 = mxUtils.getRotatedPoint(p2, cos, sin, cx);
			p3 = mxUtils.getRotatedPoint(p3, cos, sin, cx);
			p4 = mxUtils.getRotatedPoint(p4, cos, sin, cx);
			result = new mxRectangle(p1.x, p1.y, 0, 0);
			result.add(new mxRectangle(p2.x, p2.y, 0, 0));
			result.add(new mxRectangle(p3.x, p3.y, 0, 0));
			result.add(new mxRectangle(p4.x, p4.Y, 0, 0));
		}
		return result;
	},
	getRotatedPoint: function(pt, cos, sin, cx) {
		cx = (cx != null) ? cx: new mxPoint();
		var x = pt.x - c.x;
		var y = pt.y - c.y;
		var x1 = x * cos - y * sin;
		var y1 = y * cos + x * sin;
		return new mxPoint(x1 + c.x, y1 + c.y);
	},
	findNearestSegment: function(state, x, y) {
		var index = -1;
		if (state.absolutePoints.length > 0) {
			var last = state.absolutePoints[0];
			var min = null;
			for (var i = 1; i < state.absolutePoints.length; i++) {
				var current = state.absolutePoints[i];
				var dist = mxUtils.ptSegDistSq(last.x, last.y, current.x, current.y, x, y);
				if (min == null || dist < min) {
					min = dist;
					index = i - 1;
				}
				last = current;
			}
		}
		return index;
	},
	contains: function(bounds, x, y) {
		return (bounds.x <= x && bounds.x + bounds.width >= x && bounds.y <= y && bounds.y + bounds.height >= y);
	},
	intersects: function(a, b) {
		var tw = a.width;
		var th = a.height;
		var rw = b.width;
		var rh = b.height;
		if (rw <= 0 || rh <= 0 || tw <= 0 || th <= 0) {
			return false;
		}
		var tx = a.x;
		var ty = a.y;
		var rx = b.x;
		var ry = b.y;
		rw += rx;
		rh += ry;
		tw += tx;
		th += ty;
		return ((rw < rx || rw > tx) && (rh < ry || rh > ty) && (tw < tx || tw > rx) && (th < ty || th > ry));
	},
	intersectsHotspot: function(state, x, y, hotspot, min, max) {
		hotspot = (hotspot != null) ? hotspot: 1;
		min = (min != null) ? min: 0;
		max = (max != null) ? max: 0;
		if (hotspot > 0) {
			var cx = state.getCenterX();
			var cy = state.getCenterY();
			var w = state.width;
			var h = state.height;
			var start = mxUtils.getValue(state.style, mxConstants.STYLE_STARTSIZE);
			if (start > 0) {
				if (mxUtils.getValue(state.style, mxConstants.STYLE_HORIZONTAL, true)) {
					cy = state.y + start / 2;
					h = start;
				} else {
					cx = state.x + start / 2;
					w = start;
				}
			}
			var w = Math.max(min, w * hotspot);
			var h = Math.max(min, h * hotspot);
			if (max > 0) {
				w = Math.min(w, max);
				h = Math.min(h, max);
			}
			var rect = new mxRectangle(cx - w / 2, cy - h / 2, w, h);
			return mxUtils.contains(rect, x, y);
		}
		return true;
	},
	getOffset: function(container) {
		var offsetLeft = 0;
		var offsetTop = 0;
		while (container.offsetParent) {
			offsetLeft += container.offsetLeft;
			offsetTop += container.offsetTop;
			container = container.offsetParent;
		}
		return new mxPoint(offsetLeft, offsetTop);
	},
	getScrollOrigin: function(node) {
		var b = document.body;
		var d = document.documentElement;
		var sl = (b.scrollLeft || d.scrollLeft);
		var st = (b.scrollTop || d.scrollTop);
		var result = new mxPoint(sl, st);
		while (node != null && node != b && node != d) {
			result.x += node.scrollLeft;
			result.y += node.scrollTop;
			node = node.parentNode;
		}
		return result;
	},
	convertPoint: function(container, x, y) {
		var origin = mxUtils.getScrollOrigin(container);
		var offset = mxUtils.getOffset(container);
		offset.x -= origin.x;
		offset.y -= origin.y;
		return new mxPoint(x - offset.x, y - offset.y);
	},
	ltrim: function(str, chars) {
		chars = chars || "\\s";
		return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
	},
	rtrim: function(str, chars) {
		chars = chars || "\\s";
		return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
	},
	trim: function(str, chars) {
		return mxUtils.ltrim(mxUtils.rtrim(str, chars), chars);
	},
	isNumeric: function(str) {
		return str != null && (str.length == null || (str.length > 0 && str.indexOf('0x') < 0) && str.indexOf('0X') < 0) && !isNaN(str);
	},
	mod: function(n, m) {
		return ((n % m) + m) % m;
	},
	intersection: function(x0, y0, x1, y1, x2, y2, x3, y3) {
		var denom = ((y3 - y2) * (x1 - x0)) - ((x3 - x2) * (y1 - y0));
		var nume_a = ((x3 - x2) * (y0 - y2)) - ((y3 - y2) * (x0 - x2));
		var nume_b = ((x1 - x0) * (y0 - y2)) - ((y1 - y0) * (x0 - x2));
		var ua = nume_a / denom;
		var ub = nume_b / denom;
		if (ua >= 0.0 && ua <= 1.0 && ub >= 0.0 && ub <= 1.0) {
			var intersectionX = x0 + ua * (x1 - x0);
			var intersectionY = y0 + ua * (y1 - y0);
			return new mxPoint(intersectionX, intersectionY);
		}
		return null;
	},
	ptSegDistSq: function(x1, y1, x2, y2, px, py) {
		x2 -= x1;
		y2 -= y1;
		px -= x1;
		py -= y1;
		var dotprod = px * x2 + py * y2;
		var projlenSq;
		if (dotprod <= 0.0) {
			projlenSq = 0.0;
		} else {
			px = x2 - px;
			py = y2 - py;
			dotprod = px * x2 + py * y2;
			if (dotprod <= 0.0) {
				projlenSq = 0.0;
			} else {
				projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
			}
		}
		var lenSq = px * px + py * py - projlenSq;
		if (lenSq < 0) {
			lenSq = 0;
		}
		return lenSq;
	},
	relativeCcw: function(x1, y1, x2, y2, px, py) {
		x2 -= x1;
		y2 -= y1;
		px -= x1;
		py -= y1;
		var ccw = px * y2 - py * x2;
		if (ccw == 0.0) {
			ccw = px * x2 + py * y2;
			if (ccw > 0.0) {
				px -= x2;
				py -= y2;
				ccw = px * x2 + py * y2;
				if (ccw < 0.0) {
					ccw = 0.0;
				}
			}
		}
		return (ccw < 0.0) ? -1 : ((ccw > 0.0) ? 1 : 0);
	},
	animateChanges: function(graph, changes) {
		mxEffects.animateChanges.apply(this, arguments);
	},
	cascadeOpacity: function(graph, cell, opacity) {
		mxEffects.cascadeOpacity.apply(this, arguments);
	},
	fadeOut: function(node, from, remove, step, delay, isEnabled) {
		mxEffects.fadeOut.apply(this, arguments);
	},
	setOpacity: function(node, value) {
		if (mxUtils.isVml(node)) {
			if (value >= 100) {
				node.style.filter = null;
			} else {
				node.style.filter = 'alpha(opacity=' + (value / 5) + ')';
			}
		} else if (true) {
			if (value >= 100) {
				node.style.filter = null;
			} else {
				node.style.filter = 'alpha(opacity=' + value + ')';
			}
		} else {
			node.style.opacity = (value / 100);
		}
	},
	createImage: function(src) {
		var imgName = src.toUpperCase();
		var imageNode = null;
		if (imgName.substring(imgName.length - 3, imgName.length).toUpperCase() == 'PNG' && true) {
			imageNode = document.createElement('DIV');
			imageNode.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader (src=\'' + src + '\', sizingMethod=\'scale\')';
		} else {
			imageNode = document.createElement('img');
			imageNode.setAttribute('src', src);
			imageNode.setAttribute('border', '0');
		}
		return imageNode;
	},
	sortCells: function(cells, ascending) {
		ascending = (ascending != null) ? ascending: true;
		cells.sort(function(o1, o2) {
			var p1 = mxCellPath.create(o1).split(mxCellPath.PATH_SEPARATOR);
			var p2 = mxCellPath.create(o2).split(mxCellPath.PATH_SEPARATOR);
			var comp = mxCellPath.compare(p1, p2);
			return (comp == 0) ? 0 : (((comp > 0) == ascending) ? 1 : -1);
		});
		return cells;
	},
	getStylename: function(style) {
		if (style != null) {
			var pairs = style.split(';');
			var stylename = pairs[0];
			if (stylename.indexOf('=') < 0) {
				return stylename;
			}
		}
		return '';
	},
	getStylenames: function(style) {
		var result = [];
		if (style != null) {
			var pairs = style.split(';');
			for (var i = 0; i < pairs.length; i++) {
				if (pairs[i].indexOf('=') < 0) {
					result.push(pairs[i]);
				}
			}
		}
		return result;
	},
	indexOfStylename: function(style, stylename) {
		if (style != null && stylename != null) {
			var tokens = style.split(';');
			var pos = 0;
			for (var i = 0; i < tokens.length; i++) {
				if (tokens[i] == stylename) {
					return pos;
				}
				pos += tokens[i].length + 1;
			}
		}
		return - 1;
	},
	addStylename: function(style, stylename) {
		if (mxUtils.indexOfStylename(style, stylename) < 0) {
			if (style == null) {
				style = '';
			} else if (style.length > 0 && style.charAt(style.length - 1) != ';') {
				style += ';';
			}
			style += stylename;
		}
		return style;
	},
	removeStylename: function(style, stylename) {
		var result = [];
		if (style != null) {
			var tokens = style.split(';');
			for (var i = 0; i < tokens.length; i++) {
				if (tokens[i] != stylename) {
					result.push(tokens[i]);
				}
			}
		}
		return result.join(';');
	},
	removeAllStylenames: function(style) {
		var result = [];
		if (style != null) {
			var tokens = style.split(';');
			for (var i = 0; i < tokens.length; i++) {
				if (tokens[i].indexOf('=') >= 0) {
					result.push(tokens[i]);
				}
			}
		}
		return result.join(';');
	},
	setCellStyles: function(model, cells, key, value) {
		if (cells != null && cells.length > 0) {
			model.beginUpdate();
			try {
				for (var i = 0; i < cells.length; i++) {
					if (cells[i] != null) {
						var style = mxUtils.setStyle(model.getStyle(cells[i]), key, value);
						model.setStyle(cells[i], style);
					}
				}
			} finally {
				model.endUpdate();
			}
		}
	},
	setStyle: function(style, key, value) {
		var isValue = value != null && (typeof(value.length) == 'undefined' || value.length > 0);
		if (style == null || style.length == 0) {
			if (isValue) {
				style = key + '=' + value;
			}
		} else {
			var index = style.indexOf(key + '=');
			if (index < 0) {
				if (isValue) {
					var sep = (style.charAt(style.length - 1) == ';') ? '': ';';
					style = style + sep + key + '=' + value;
				}
			} else {
				var tmp = (isValue) ? (key + '=' + value) : '';
				var cont = style.indexOf(';', index);
				if (!isValue) {
					cont++;
				}
				style = style.substring(0, index) + tmp + ((cont > index) ? style.substring(cont) : '');
			}
		}
		return style;
	},
	setCellStyleFlags: function(model, cells, key, flag, value) {
		if (cells != null && cells.length > 0) {
			model.beginUpdate();
			try {
				for (var i = 0; i < cells.length; i++) {
					if (cells[i] != null) {
						var style = mxUtils.setStyleFlag(model.getStyle(cells[i]), key, flag, value);
						model.setStyle(cells[i], style);
					}
				}
			} finally {
				model.endUpdate();
			}
		}
	},
	setStyleFlag: function(style, key, flag, value) {
		if (style == null || style.length == 0) {
			if (value || value == null) {
				style = key + '=' + flag;
			} else {
				style = key + '=0';
			}
		} else {
			var index = style.indexOf(key + '=');
			if (index < 0) {
				var sep = (style.charAt(style.length - 1) == ';') ? '': ';';
				if (value || value == null) {
					style = style + sep + key + '=' + flag;
				} else {
					style = style + sep + key + '=0';
				}
			} else {
				var cont = style.indexOf(';', index);
				var tmp = '';
				if (cont < 0) {
					tmp = style.substring(index + key.length + 1);
				} else {
					tmp = style.substring(index + key.length + 1, cont);
				}
				if (value == null) {
					tmp = parseInt(tmp) ^ flag;
				} else if (value) {
					tmp = parseInt(tmp) | flag;
				} else {
					tmp = parseInt(tmp) & ~flag;
				}
				style = style.substring(0, index) + key + '=' + tmp + ((cont >= 0) ? style.substring(cont) : '');
			}
		}
		return style;
	},
	getSizeForString: function(text, fontSize, fontFamily) {
		var div = document.createElement('div');
		div.style.fontSize = fontSize || mxConstants.DEFAULT_FONTSIZE;
		div.style.fontFamily = fontFamily || mxConstants.DEFAULT_FONTFAMILY;
		div.style.position = 'absolute';
		div.style.display = 'inline';
		div.style.visibility = 'hidden';
		div.innerHTML = text;
		document.body.appendChild(div);
		var size = new mxRectangle(0, 0, div.offsetWidth, div.offsetHeight);
		document.body.removeChild(div);
		return size;
	},
	getViewXml: function(graph, scale, cells, x0, y0) {
		x0 = (x0 != null) ? x0: 0;
		y0 = (y0 != null) ? y0: 0;
		scale = (scale != null) ? scale: 1;
		if (cells == null) {
			var model = graph.getModel();
			cells = [model.getRoot()];
		}
		var view = graph.getView();
		var result = null;
		var eventsEnabled = view.isEventsEnabled();
		view.setEventsEnabled(false);
		var drawPane = view.drawPane;
		if (graph.dialect == mxConstants.DIALECT_SVG) {
			view.drawPane = document.createElementNS(mxConstants.NS_SVG, 'g');
			view.canvas.appendChild(view.drawPane);
		} else {
			view.drawPane = view.drawPane.cloneNode(false);
			view.canvas.appendChild(view.drawPane);
		}
		var translate = view.getTranslate();
		view.translate = new mxPoint(x0, y0);
		var temp = new mxTemporaryCellStates(graph.getView(), scale, cells);
		try {
			var enc = new mxCodec();
			result = enc.encode(graph.getView());
		} finally {
			temp.destroy();
			view.translate = translate;
			view.canvas.removeChild(view.drawPane);
			view.drawPane = drawPane;
			view.setEventsEnabled(eventsEnabled);
		}
		return result;
	},
	getScaleForPageCount: function(pageCount, graph, pageFormat, border) {
		if (pageCount < 1) {
			return 1;
		}
		pageFormat = (pageFormat != null) ? pageFormat: mxConstants.PAGE_FORMAT_A4_PORTRAIT;
		border = (border != null) ? border: 0;
		var availablePageWidth = pageFormat.width - (border * 2);
		var availablePageHeight = pageFormat.height - (border * 2);
		var graphBounds = graph.getGraphBounds().clone();
		var sc = graph.getView().getScale();
		graphBounds.width /= sc;
		graphBounds.height /= sc;
		var graphWidth = graphBounds.width;
		var graphHeight = graphBounds.height;
		var scale = 1;
		var pageFormatAspectRatio = availablePageWidth / availablePageHeight;
		var graphAspectRatio = graphWidth / graphHeight;
		var pagesAspectRatio = graphAspectRatio / pageFormatAspectRatio;
		var pageRoot = Math.sqrt(pageCount);
		var pagesAspectRatioSqrt = Math.sqrt(pagesAspectRatio);
		var numRowPages = pageRoot * pagesAspectRatioSqrt;
		var numColumnPages = pageRoot / pagesAspectRatioSqrt;
		if (numRowPages < 1 && numColumnPages > pageCount) {
			var scaleChange = numColumnPages / pageCount;
			numColumnPages = pageCount;
			numRowPages /= scaleChange;
		}
		if (numColumnPages < 1 && numRowPages > pageCount) {
			var scaleChange = numRowPages / pageCount;
			numRowPages = pageCount;
			numColumnPages /= scaleChange;
		}
		var currentTotalPages = Math.ceil(numRowPages) * Math.ceil(numColumnPages);
		var numLoops = 0;
		while (currentTotalPages > pageCount) {
			var roundRowDownProportion = Math.floor(numRowPages) / numRowPages;
			var roundColumnDownProportion = Math.floor(numColumnPages) / numColumnPages;
			if (roundRowDownProportion == 1) {
				roundRowDownProportion = Math.floor(numRowPages - 1) / numRowPages;
			}
			if (roundColumnDownProportion == 1) {
				roundColumnDownProportion = Math.floor(numColumnPages - 1) / numColumnPages;
			}
			var scaleChange = 1;
			if (roundRowDownProportion > roundColumnDownProportion) {
				scaleChange = roundRowDownProportion;
			} else {
				scaleChange = roundColumnDownProportion;
			}
			numRowPages = numRowPages * scaleChange;
			numColumnPages = numColumnPages * scaleChange;
			currentTotalPages = Math.ceil(numRowPages) * Math.ceil(numColumnPages);
			numLoops++;
			if (numLoops > 10) {
				break;
			}
		}
		var posterWidth = availablePageWidth * numRowPages;
		scale = posterWidth / graphWidth;
		return scale * 0.99999;
	},
	show: function(graph, doc, x0, y0) {
		x0 = (x0 != null) ? x0: 0;
		y0 = (y0 != null) ? y0: 0;
		if (doc == null) {
			var wnd = window.open();
			doc = wnd.document;
		} else {
			doc.open();
		}
		var bounds = graph.getGraphBounds();
		var dx = -bounds.x + x0;
		var dy = -bounds.y + y0;
		if (true) {
			var html = '<html>';
			html += '<head>';
			var base = document.getElementsByTagName('base');
			for (var i = 0; i < base.length; i++) {
				html += base[i].outerHTML;
			}
			html += '<style>';
			for (var i = 0; i < document.styleSheets.length; i++) {
				try {
					html += document.styleSheets(i).cssText;
				} catch(e) {}
			}
			html += '</style>';
			html += '</head>';
			html += '<body>';
			html += graph.container.innerHTML;
			html += '</body>';
			html += '<html>';
			doc.writeln(html);
			doc.close();
			var node = doc.body.getElementsByTagName('DIV')[0];
			if (node != null) {
				node.style.position = 'absolute';
				node.style.left = dx + 'px';
				node.style.top = dy + 'px';
			}
		} else {
			doc.writeln('<html');
			doc.writeln('<head>');
			var base = document.getElementsByTagName('base');
			for (var i = 0; i < base.length; i++) {
				doc.writeln(mxUtils.getOuterHtml(base[i]));
			}
			var links = document.getElementsByTagName('link');
			for (var i = 0; i < links.length; i++) {
				doc.writeln(mxUtils.getOuterHtml(links[i]));
			}
			var styles = document.getElementsByTagName('style');
			for (var i = 0; i < styles.length; i++) {
				doc.writeln(mxUtils.getOuterHtml(styles[i]));
			}
			doc.writeln('</head>');
			doc.writeln('</html>');
			doc.close();
			doc.documentElement.appendChild(doc.createElement('body'));
			var node = graph.container.firstChild;
			while (node != null) {
				var clone = node.cloneNode(true);
				doc.body.appendChild(clone);
				node = node.nextSibling;
			}
			var node = doc.getElementsByTagName('g')[0];
			if (node != null) {
				node.setAttribute('transform', 'translate(' + dx + ',' + dy + ')');
				var root = node.ownerSVGElement;
				root.setAttribute('width', bounds.width + Math.max(bounds.x, 0) + 3);
				root.setAttribute('height', bounds.height + Math.max(bounds.y, 0) + 3);
			}
		}
		mxUtils.removeCursors(doc.body);
		return doc;
	},
	printScreen: function(graph) {
		var wnd = window.open();
		mxUtils.show(graph, wnd.document);
		var print = function() {
			wnd.focus();
			wnd.print();
			wnd.close();
		};
		if (false) {
			wnd.setTimeout(print, 500)
		} else {
			print();
		}
	},
	popup: function(content, isInternalWindow) {
		if (isInternalWindow) {
			var div = document.createElement('div');
			div.style.overflow = 'scroll';
			div.style.width = '636px';
			div.style.height = '460px';
			var pre = document.createElement('pre');
			pre.innerHTML = mxUtils.htmlEntities(content, false).replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
			div.appendChild(pre);
			var w = document.body.clientWidth;
			var h = (document.body.clientHeight || document.documentElement.clientHeight);
			var wnd = new mxWindow('Popup Window', div, w / 2 - 320, h / 2 - 240, 640, 480, false, true);
			wnd.setClosable(true);
			wnd.setVisible(true);
		} else {
			if (false) {
				var wnd = window.open();
				wnd.document.writeln('<pre>' + mxUtils.htmlEntities(content) + '</pre');
				wnd.document.close();
			} else {
				var wnd = window.open();
				var pre = wnd.document.createElement('pre');
				pre.innerHTML = mxUtils.htmlEntities(content, false).replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
				wnd.document.body.appendChild(pre);
			}
		}
	},
	alert: function(message) {
		alert(message);
	},
	prompt: function(message, defaultValue) {
		return prompt(message, defaultValue);
	},
	confirm: function(message) {
		return confirm(message);
	},
	error: function(message, width, close, icon) {
		var div = document.createElement('div');
		div.style.padding = '20px';
		var img = document.createElement('img');
		img.setAttribute('src', icon || mxUtils.errorImage);
		img.setAttribute('valign', 'bottom');
		img.style.verticalAlign = 'middle';
		div.appendChild(img);
		div.appendChild(document.createTextNode('\u00a0'));
		div.appendChild(document.createTextNode('\u00a0'));
		div.appendChild(document.createTextNode('\u00a0'));
		mxUtils.write(div, message);
		var w = document.body.clientWidth;
		var h = (document.body.clientHeight || document.documentElement.clientHeight);
		var warn = new mxWindow(mxResources.get(mxUtils.errorResource) || mxUtils.errorResource, div, (w - width) / 2, h / 4, width, null, false, true);
		if (close) {
			mxUtils.br(div);
			var tmp = document.createElement('p');
			var button = document.createElement('button');
			if (true) {
				button.style.cssText = 'float:right';
			} else {
				button.setAttribute('style', 'float:right');
			}
			mxEvent.addListener(button, 'click',
			function(evt) {
				warn.destroy();
			});
			mxUtils.write(button, mxResources.get(mxUtils.closeResource) || mxUtils.closeResource);
			tmp.appendChild(button);
			div.appendChild(tmp);
			mxUtils.br(div);
			warn.setClosable(true);
		}
		warn.setVisible(true);
		return warn;
	},
	makeDraggable: function(element, graph, funct, dragElement, dx, dy, autoscroll, scalePreview, highlightDropTargets, getDropTarget) {
		dx = (dx != null) ? dx: 0;
		dy = (dy != null) ? dy: mxConstants.TOOLTIP_VERTICAL_OFFSET;
		highlightDropTargets = (highlightDropTargets != null) ? highlightDropTargets: true;
		getDropTarget = (getDropTarget != null) ? getDropTarget: function(x, y) {
			return graph.getCellAt(x, y);
		};
		var md = (mxClient.IS_TOUCH) ? 'touchstart': 'mousedown';
		var mm = (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove';
		var mu = (mxClient.IS_TOUCH) ? 'touchend': 'mouseup';
		mxEvent.addListener(element, md,
		function(evt) {
			if (graph.isEnabled() && !mxEvent.isConsumed(evt)) {
				graph.isMouseDown = true;
				var sprite = (dragElement != null) ? dragElement.cloneNode(true) : element.cloneNode(true);
				if (scalePreview) {
					var scale = graph.view.scale;
					sprite.style.width = (parseInt(sprite.style.width) * scale) + 'px';
					sprite.style.height = (parseInt(sprite.style.height) * scale) + 'px';
					dx *= scale;
					dy *= scale;
				}
				sprite.style.zIndex = 3;
				sprite.style.position = 'absolute';
				mxUtils.setOpacity(sprite, 70);
				var dropTarget = null;
				var initialized = false;
				var startX = evt.clientX;
				var startY = evt.clientY;
				var highlight = null;
				var highlightCell = function() {};
				if (highlightDropTargets && graph.isDropEnabled()) {
					highlight = new mxCellHighlight(graph, mxConstants.DROP_TARGET_COLOR);
					highlightCell = function(cell) {
						var state = graph.getView().getState(cell);
						highlight.highlight(state);
					};
				}
				var dragHandler = function(evt) {
					var origin = mxUtils.getScrollOrigin();
					var pt = mxUtils.convertPoint(graph.container, evt.clientX, evt.clientY);
					sprite.style.left = (evt.clientX + origin.x + dx) + 'px';
					sprite.style.top = (evt.clientY + origin.y + dy) + 'px';
					if (!initialized) {
						initialized = true;
						document.body.appendChild(sprite);
					} else if (graph.autoScroll && (autoscroll == null || autoscroll)) {
						graph.scrollPointToVisible(pt.x, pt.y, graph.autoExtend);
					}
					dropTarget = getDropTarget(pt.x, pt.y);
					highlightCell(dropTarget);
					mxEvent.consume(evt);
				};
				var dropHandler = function(evt) {
					mxEvent.removeListener(document, mm, dragHandler);
					mxEvent.removeListener(document, mu, dropHandler);
					if (sprite.parentNode != null) {
						sprite.parentNode.removeChild(sprite);
					}
					if (highlight != null) {
						highlight.destroy();
						highlight = null;
					}
					try {
						var pt = mxUtils.convertPoint(graph.container, evt.clientX, evt.clientY);
						var tol = 2 * graph.tolerance;
						if (pt.x >= graph.container.scrollLeft && pt.y >= graph.container.scrollTop && pt.x <= graph.container.scrollLeft + graph.container.clientWidth && pt.y <= graph.container.scrollTop + graph.container.clientHeight && (Math.abs(evt.clientX - startX) > tol || Math.abs(evt.clientY - startY) > tol)) {
							graph.container.focus();
							funct(graph, evt, dropTarget);
						}
					} finally {
						mxEvent.consume(evt);
						graph.isMouseDown = false;
					}
				};
				mxEvent.addListener(document, mm, dragHandler);
				mxEvent.addListener(document, mu, dropHandler);
				mxEvent.consume(evt);
			}
		});
	}
};
var mxConstants = {
	DEFAULT_HOTSPOT: 0.3,
	MIN_HOTSPOT_SIZE: 8,
	MAX_HOTSPOT_SIZE: 0,
	RENDERING_HINT_EXACT: 'exact',
	RENDERING_HINT_FASTER: 'faster',
	RENDERING_HINT_FASTEST: 'fastest',
	DIALECT_SVG: 'svg',
	DIALECT_VML: 'vml',
	DIALECT_MIXEDHTML: 'mixedHtml',
	DIALECT_PREFERHTML: 'preferHtml',
	DIALECT_STRICTHTML: 'strictHtml',
	NS_SVG: 'http://www.w3.org/2000/svg',
	NS_XHTML: 'http://www.w3.org/1999/xhtml',
	NS_XLINK: 'http://www.w3.org/1999/xlink',
	SHADOWCOLOR: 'gray',
	SVG_SHADOWTRANSFORM: 'translate(2 3)',
	NODETYPE_ELEMENT: 1,
	NODETYPE_ATTRIBUTE: 2,
	NODETYPE_TEXT: 3,
	NODETYPE_CDATA: 4,
	NODETYPE_ENTITY_REFERENCE: 5,
	NODETYPE_ENTITY: 6,
	NODETYPE_PROCESSING_INSTRUCTION: 7,
	NODETYPE_COMMENT: 8,
	NODETYPE_DOCUMENT: 9,
	NODETYPE_DOCUMENTTYPE: 10,
	NODETYPE_DOCUMENT_FRAGMENT: 11,
	NODETYPE_NOTATION: 12,
	TOOLTIP_VERTICAL_OFFSET: 16,
	DEFAULT_VALID_COLOR: '#00FF00',
	DEFAULT_INVALID_COLOR: '#FF0000',
	HIGHLIGHT_STROKEWIDTH: 3,
	CURSOR_MOVABLE_VERTEX: 'move',
	CURSOR_MOVABLE_EDGE: 'move',
	CURSOR_MOVABLE_LABEL: 'default',
	CURSOR_BEND_HANDLE: 'pointer',
	CURSOR_CONNECT: 'pointer',
	HIGHLIGHT_COLOR: '#00FF00',
	CONNECT_TARGET_COLOR: '#0000FF',
	INVALID_CONNECT_TARGET_COLOR: '#FF0000',
	DROP_TARGET_COLOR: '#0000FF',
	VALID_COLOR: '#00FF00',
	INVALID_COLOR: '#FF0000',
	EDGE_SELECTION_COLOR: '#00FF00',
	VERTEX_SELECTION_COLOR: '#00FF00',
	VERTEX_SELECTION_STROKEWIDTH: 1,
	EDGE_SELECTION_STROKEWIDTH: 1,
	VERTEX_SELECTION_DASHED: true,
	EDGE_SELECTION_DASHED: true,
	OUTLINE_COLOR: '#0099FF',
	OUTLINE_STROKEWIDTH: (true) ? 2 : 3,
	HANDLE_SIZE: 7,
	LABEL_HANDLE_SIZE: 4,
	HANDLE_FILLCOLOR: '#00FF00',
	HANDLE_STROKECOLOR: 'black',
	LABEL_HANDLE_FILLCOLOR: 'yellow',
	CONNECT_HANDLE_FILLCOLOR: '#0000FF',
	LOCKED_HANDLE_FILLCOLOR: '#FF0000',
	OUTLINE_HANDLE_FILLCOLOR: '#00FFFF',
	OUTLINE_HANDLE_STROKECOLOR: '#0033FF',
	DEFAULT_FONTFAMILY: 'Arial,Helvetica',
	DEFAULT_FONTSIZE: 11,
	DEFAULT_STARTSIZE: 40,
	DEFAULT_MARKERSIZE: 6,
	DEFAULT_IMAGESIZE: 24,
	ENTITY_SEGMENT: 30,
	RECTANGLE_ROUNDING_FACTOR: 0.15,
	LINE_ARCSIZE: 20,
	ARROW_SPACING: 10,
	ARROW_WIDTH: 30,
	ARROW_SIZE: 30,
	PAGE_FORMAT_A4_PORTRAIT: new mxRectangle(0, 0, 826, 1169),
	PAGE_FORMAT_A4_LANDSCAPE: new mxRectangle(0, 0, 1169, 826),
	NONE: 'none',
	STYLE_PERIMETER: 'perimeter',
	STYLE_SOURCE_PORT: 'sourcePort',
	STYLE_TARGET_PORT: 'targetPort',
	STYLE_OPACITY: 'opacity',
	STYLE_TEXT_OPACITY: 'textOpacity',
	STYLE_OVERFLOW: 'overflow',
	STYLE_ORTHOGONAL: 'orthogonal',
	STYLE_EXIT_X: 'exitX',
	STYLE_EXIT_Y: 'exitY',
	STYLE_EXIT_PERIMETER: 'exitPerimeter',
	STYLE_ENTRY_X: 'entryX',
	STYLE_ENTRY_Y: 'entryY',
	STYLE_ENTRY_PERIMETER: 'entryPerimeter',
	STYLE_WHITE_SPACE: 'whiteSpace',
	STYLE_ROTATION: 'rotation',
	STYLE_FILLCOLOR: 'fillColor',
	STYLE_GRADIENTCOLOR: 'gradientColor',
	STYLE_GRADIENT_DIRECTION: 'gradientDirection',
	STYLE_STROKECOLOR: 'strokeColor',
	STYLE_SEPARATORCOLOR: 'separatorColor',
	STYLE_STROKEWIDTH: 'strokeWidth',
	STYLE_ALIGN: 'align',
	STYLE_VERTICAL_ALIGN: 'verticalAlign',
	STYLE_LABEL_POSITION: 'labelPosition',
	STYLE_VERTICAL_LABEL_POSITION: 'verticalLabelPosition',
	STYLE_IMAGE_ALIGN: 'imageAlign',
	STYLE_IMAGE_VERTICAL_ALIGN: 'imageVerticalAlign',
	STYLE_IMAGE: 'image',
	STYLE_IMAGE_WIDTH: 'imageWidth',
	STYLE_IMAGE_HEIGHT: 'imageHeight',
	STYLE_IMAGE_BACKGROUND: 'imageBackground',
	STYLE_IMAGE_BORDER: 'imageBorder',
	STYLE_NOLABEL: 'noLabel',
	STYLE_NOEDGESTYLE: 'noEdgeStyle',
	STYLE_LABEL_BACKGROUNDCOLOR: 'labelBackgroundColor',
	STYLE_LABEL_BORDERCOLOR: 'labelBorderColor',
	STYLE_INDICATOR_SHAPE: 'indicatorShape',
	STYLE_INDICATOR_IMAGE: 'indicatorImage',
	STYLE_INDICATOR_COLOR: 'indicatorColor',
	STYLE_INDICATOR_STROKECOLOR: 'indicatorStrokeColor',
	STYLE_INDICATOR_GRADIENTCOLOR: 'indicatorGradientColor',
	STYLE_INDICATOR_SPACING: 'indicatorSpacing',
	STYLE_INDICATOR_WIDTH: 'indicatorWidth',
	STYLE_INDICATOR_HEIGHT: 'indicatorHeight',
	STYLE_INDICATOR_DIRECTION: 'indicatorDirection',
	STYLE_SHADOW: 'shadow',
	STYLE_SEGMENT: "segment",
	STYLE_ENDARROW: 'endArrow',
	STYLE_STARTARROW: 'startArrow',
	STYLE_ENDSIZE: 'endSize',
	STYLE_STARTSIZE: 'startSize',
	STYLE_DASHED: 'dashed',
	STYLE_ROUNDED: 'rounded',
	STYLE_SMOOTH: 'smooth',
	STYLE_SOURCE_PERIMETER_SPACING: 'sourcePerimeterSpacing',
	STYLE_TARGET_PERIMETER_SPACING: 'targetPerimeterSpacing',
	STYLE_PERIMETER_SPACING: 'perimeterSpacing',
	STYLE_SPACING: 'spacing',
	STYLE_SPACING_TOP: 'spacingTop',
	STYLE_SPACING_LEFT: 'spacingLeft',
	STYLE_SPACING_BOTTOM: 'spacingBottom',
	STYLE_SPACING_RIGHT: 'spacingRight',
	STYLE_HORIZONTAL: 'horizontal',
	STYLE_DIRECTION: 'direction',
	STYLE_ELBOW: 'elbow',
	STYLE_FONTCOLOR: 'fontColor',
	STYLE_FONTFAMILY: 'fontFamily',
	STYLE_FONTSIZE: 'fontSize',
	STYLE_FONTSTYLE: 'fontStyle',
	STYLE_SHAPE: 'shape',
	STYLE_EDGE: 'edgeStyle',
	STYLE_LOOP: 'loopStyle',
	STYLE_ROUTING_CENTER_X: 'routingCenterX',
	STYLE_ROUTING_CENTER_Y: 'routingCenterY',
	FONT_BOLD: 1,
	FONT_ITALIC: 2,
	FONT_UNDERLINE: 4,
	FONT_SHADOW: 8,
	SHAPE_RECTANGLE: 'rectangle',
	SHAPE_ELLIPSE: 'ellipse',
	SHAPE_DOUBLE_ELLIPSE: 'doubleEllipse',
	SHAPE_RHOMBUS: 'rhombus',
	SHAPE_LINE: 'line',
	SHAPE_IMAGE: 'image',
	SHAPE_ARROW: 'arrow',
	SHAPE_LABEL: 'label',
	SHAPE_CYLINDER: 'cylinder',
	SHAPE_SWIMLANE: 'swimlane',
	SHAPE_CONNECTOR: 'connector',
	SHAPE_ACTOR: 'actor',
	SHAPE_CLOUD: 'cloud',
	SHAPE_TRIANGLE: 'triangle',
	SHAPE_HEXAGON: 'hexagon',
	ARROW_CLASSIC: 'classic',
	ARROW_BLOCK: 'block',
	ARROW_OPEN: 'open',
	ARROW_OVAL: 'oval',
	ARROW_DIAMOND: 'diamond',
	ALIGN_LEFT: 'left',
	ALIGN_CENTER: 'center',
	ALIGN_RIGHT: 'right',
	ALIGN_TOP: 'top',
	ALIGN_MIDDLE: 'middle',
	ALIGN_BOTTOM: 'bottom',
	DIRECTION_NORTH: 'north',
	DIRECTION_SOUTH: 'south',
	DIRECTION_EAST: 'east',
	DIRECTION_WEST: 'west',
	ELBOW_VERTICAL: 'vertical',
	ELBOW_HORIZONTAL: 'horizontal',
	EDGESTYLE_ELBOW: 'elbowEdgeStyle',
	EDGESTYLE_ENTITY_RELATION: 'entityRelationEdgeStyle',
	EDGESTYLE_LOOP: 'loopEdgeStyle',
	EDGESTYLE_SIDETOSIDE: 'sideToSideEdgeStyle',
	EDGESTYLE_TOPTOBOTTOM: 'topToBottomEdgeStyle',
	PERIMETER_ELLIPSE: 'ellipsePerimeter',
	PERIMETER_RECTANGLE: 'rectanglePerimeter',
	PERIMETER_RHOMBUS: 'rhombusPerimeter',
	PERIMETER_TRIANGLE: 'trianglePerimeter'
};
function mxEventObject(name) {
	this.name = name;
	this.properties = [];
	for (var i = 1; i < arguments.length; i += 2) {
		if (arguments[i + 1] != null) {
			this.properties[arguments[i]] = arguments[i + 1];
		}
	}
};
mxEventObject.prototype.properties = null;
mxEventObject.prototype.properties = null;
mxEventObject.prototype.consumed = false;
mxEventObject.prototype.getName = function() {
	return this.name;
};
mxEventObject.prototype.getProperties = function() {
	return this.properties;
};
mxEventObject.prototype.getProperty = function(key) {
	return this.properties[key];
};
mxEventObject.prototype.isConsumed = function() {
	return this.consumed;
};
mxEventObject.prototype.consume = function() {
	this.consumed = true;
};
function mxMouseEvent(evt, state) {
	this.evt = evt;
	this.state = state;
};
mxMouseEvent.prototype.consumed = false;
mxMouseEvent.prototype.evt = null;
mxMouseEvent.prototype.state = null;
mxMouseEvent.prototype.getEvent = function() {
	return this.evt;
};
mxMouseEvent.prototype.getSource = function() {
	return mxEvent.getSource(this.evt);
};
mxMouseEvent.prototype.isSource = function(shape) {
	if (shape != null) {
		var source = this.getSource();
		while (source != null) {
			if (source == shape.node) {
				return true;
			}
			source = source.parentNode;
		}
	}
	return false;
};
mxMouseEvent.prototype.getX = function() {
	var e = this.getEvent();
	if ((e.type == 'touchstart' || e.type == 'touchmove') && e.touches != null && e.touches[0] != null) {
		e = e.touches[0];
	} else if (e.type == 'touchend' && e.changedTouches != null && e.changedTouches[0] != null) {
		e = e.changedTouches[0];
	}
	return e.clientX;
};
mxMouseEvent.prototype.getY = function() {
	var e = this.getEvent();
	if ((e.type == 'touchstart' || e.type == 'touchmove') && e.touches != null && e.touches[0] != null) {
		e = e.touches[0];
	} else if (e.type == 'touchend' && e.changedTouches != null && e.changedTouches[0] != null) {
		e = e.changedTouches[0];
	}
	return e.clientY;
};
mxMouseEvent.prototype.getState = function() {
	return this.state;
};
mxMouseEvent.prototype.getCell = function() {
	var state = this.getState();
	if (state != null) {
		return state.cell;
	}
	return null;
};
mxMouseEvent.prototype.isPopupTrigger = function() {
	return mxEvent.isPopupTrigger(this.getEvent());
};
mxMouseEvent.prototype.isConsumed = function() {
	return this.consumed;
};
mxMouseEvent.prototype.consume = function(preventDefault) {
	preventDefault = (preventDefault != null) ? preventDefault: true;
	if (preventDefault && this.evt.preventDefault) {
		this.evt.preventDefault();
	}
	this.consumed = true;
};
function mxEventSource(eventSource) {
	this.setEventSource(eventSource);
};
mxEventSource.prototype.eventListeners = null;
mxEventSource.prototype.eventsEnabled = true;
mxEventSource.prototype.eventSource = null;
mxEventSource.prototype.isEventsEnabled = function() {
	return this.eventsEnabled;
};
mxEventSource.prototype.setEventsEnabled = function(value) {
	this.eventsEnabled = value;
};
mxEventSource.prototype.getEventSource = function() {
	return this.eventSource;
};
mxEventSource.prototype.setEventSource = function(value) {
	this.eventSource = value;
};
mxEventSource.prototype.addListener = function(name, funct) {
	if (this.eventListeners == null) {
		this.eventListeners = [];
	}
	this.eventListeners.push(name);
	this.eventListeners.push(funct);
};
mxEventSource.prototype.removeListener = function(funct) {
	if (this.eventListeners != null) {
		var i = 0;
		while (i < this.eventListeners.length) {
			if (this.eventListeners[i + 1] == funct) {
				this.eventListeners.splice(i, 2);
			} else {
				i += 2;
			}
		}
	}
};
mxEventSource.prototype.fireEvent = function(evt, sender) {
	if (this.eventListeners != null && this.isEventsEnabled()) {
		if (evt == null) {
			evt = new mxEventObject();
		}
		if (sender == null) {
			sender = this.getEventSource();
		}
		if (sender == null) {
			sender = this;
		}
		var args = [sender, evt];
		for (var i = 0; i < this.eventListeners.length; i += 2) {
			var listen = this.eventListeners[i];
			if (listen == null || listen == evt.getName()) {
				this.eventListeners[i + 1].apply(this, args);
			}
		}
	}
};
var mxEvent = {
	addListener: function() {
		var updateListenerList = function(element, eventName, funct) {
			if (element.mxListenerList == null) {
				element.mxListenerList = [];
			}
			var entry = {
				name: eventName,
				f: funct
			};
			element.mxListenerList.push(entry);
		};
		if (true) {
			return function(element, eventName, funct) {
				element.attachEvent("on" + eventName, funct);
				updateListenerList(element, eventName, funct);
			};
		} else {
			return function(element, eventName, funct) {
				element.addEventListener(eventName, funct, false);
				updateListenerList(element, eventName, funct);
			};
		}
	} (),
	redirectMouseEvents: function(node, graph, state, down, move, up, dblClick) {
		var getState = function() {
			return (typeof(state) == 'function') ? state() : state;
		};
		var md = (mxClient.IS_TOUCH) ? 'touchstart': 'mousedown';
		var mm = (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove';
		var mu = (mxClient.IS_TOUCH) ? 'touchend': 'mouseup';
		mxEvent.addListener(node, md,
		function(evt) {
			if (down != null) {
				down(evt);
			} else if (!mxEvent.isConsumed(evt)) {
				graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, getState()));
			}
		});
		mxEvent.addListener(node, mm,
		function(evt) {
			if (move != null) {
				move(evt);
			} else if (!mxEvent.isConsumed(evt)) {
				graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, getState()));
			}
		});
		mxEvent.addListener(node, mu,
		function(evt) {
			if (up != null) {
				up(evt);
			} else if (!mxEvent.isConsumed(evt)) {
				graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt, getState()));
			}
		});
		mxEvent.addListener(node, 'dblclick',
		function(evt) {
			if (dblClick != null) {
				dblClick(evt);
			} else if (!mxEvent.isConsumed(evt)) {
				var tmp = getState();
				graph.dblClick(evt, (tmp != null) ? tmp.cell: null);
			}
		});
	},
	removeListener: function() {
		var updateListener = function(element, eventName, funct) {
			if (element.mxListenerList != null) {
				var listenerCount = element.mxListenerList.length;
				for (var i = 0; i < listenerCount; i++) {
					var entry = element.mxListenerList[i];
					if (entry.f == funct) {
						element.mxListenerList.splice(i, 1);
						break;
					}
				}
				if (element.mxListenerList.length == 0) {
					element.mxListenerList = null;
				}
			}
		};
		if (true) {
			return function(element, eventName, funct) {
				element.detachEvent("on" + eventName, funct);
				updateListener(element, eventName, funct);
			};
		} else {
			return function(element, eventName, funct) {
				element.removeEventListener(eventName, funct, false);
				updateListener(element, eventName, funct);
			};
		}
	} (),
	removeAllListeners: function(element) {
		var list = element.mxListenerList;
		if (list != null) {
			while (list.length > 0) {
				var entry = list[0];
				mxEvent.removeListener(element, entry.name, entry.f);
			}
		}
	},
	release: function(element) {
		if (element != null) {
			mxEvent.removeAllListeners(element);
			var children = element.childNodes;
			if (children != null) {
				var childCount = children.length;
				for (var i = 0; i < childCount; i += 1) {
					mxEvent.release(children[i]);
				}
			}
		}
	},
	addMouseWheelListener: function(funct) {
		if (funct != null) {
			var wheelHandler = function(evt) {
				if (evt == null) {
					evt = window.event;
				}
				var delta = 0;
				if (false && !false && !false) {
					delta = -evt.detail / 2;
				} else {
					delta = evt.wheelDelta / 120;
				}
				if (delta != 0) {
					funct(evt, delta > 0);
				}
			};
			if (false) {
				var eventName = (false || false) ? 'mousewheel': 'DOMMouseScroll';
				mxEvent.addListener(window, eventName, wheelHandler);
			} else {
				mxEvent.addListener(document, 'mousewheel', wheelHandler);
			}
		}
	},
	disableContextMenu: function() {
		if (true) {
			return function(element) {
				mxEvent.addListener(element, 'contextmenu',
				function() {
					return false;
				});
			};
		} else {
			return function(element) {
				element.setAttribute('oncontextmenu', 'return false;');
			};
		}
	} (),
	getSource: function(evt) {
		return (evt.srcElement != null) ? evt.srcElement: evt.target;
	},
	isConsumed: function(evt) {
		return evt.isConsumed != null && evt.isConsumed;
	},
	isLeftMouseButton: function(evt) {
		return evt.button == ((true) ? 1 : 0);
	},
	isRightMouseButton: function(evt) {
		return evt.button == 2;
	},
	isPopupTrigger: function(evt) {
		return mxEvent.isRightMouseButton(evt) || (mxEvent.isShiftDown(evt) && !mxEvent.isControlDown(evt));
	},
	isShiftDown: function(evt) {
		return (evt != null) ? evt.shiftKey: false;
	},
	isAltDown: function(evt) {
		return (evt != null) ? evt.altKey: false;
	},
	isControlDown: function(evt) {
		return (evt != null) ? evt.ctrlKey: false;
	},
	isMetaDown: function(evt) {
		return (evt != null) ? evt.metaKey: false;
	},
	consume: function(evt, preventDefault) {
		if (preventDefault == null || preventDefault) {
			if (evt.preventDefault) {
				evt.stopPropagation();
				evt.preventDefault();
			} else {
				evt.cancelBubble = true;
			}
		}
		evt.isConsumed = true;
		evt.returnValue = false;
	},
	LABEL_HANDLE: -1,
	MOUSE_DOWN: 'mouseDown',
	MOUSE_MOVE: 'mouseMove',
	MOUSE_UP: 'mouseUp',
	ACTIVATE: 'activate',
	RESIZE_START: 'resizeStart',
	RESIZE: 'resize',
	RESIZE_END: 'resizeEnd',
	MOVE_START: 'moveStart',
	MOVE: 'move',
	MOVE_END: 'moveEnd',
	MINIMIZE: 'minimize',
	NORMALIZE: 'normalize',
	MAXIMIZE: 'maximize',
	HIDE: 'hide',
	SHOW: 'show',
	CLOSE: 'close',
	DESTROY: 'destroy',
	REFRESH: 'refresh',
	SIZE: 'size',
	SELECT: 'select',
	FIRED: 'fired',
	GET: 'get',
	RECEIVE: 'receive',
	CONNECT: 'connect',
	DISCONNECT: 'disconnect',
	SUSPEND: 'suspend',
	RESUME: 'resume',
	MARK: 'mark',
	SESSION: 'session',
	ROOT: 'root',
	POST: 'post',
	OPEN: 'open',
	SAVE: 'save',
	BEFORE_ADD_VERTEX: 'beforeAddVertex',
	ADD_VERTEX: 'addVertex',
	AFTER_ADD_VERTEX: 'afterAddVertex',
	DONE: 'done',
	EXECUTE: 'execute',
	BEGIN_UPDATE: 'beginUpdate',
	END_UPDATE: 'endUpdate',
	BEFORE_UNDO: 'beforeUndo',
	UNDO: 'undo',
	REDO: 'redo',
	CHANGE: 'change',
	NOTIFY: 'notify',
	LAYOUT_CELLS: 'layoutCells',
	CLICK: 'click',
	SCALE: 'scale',
	TRANSLATE: 'translate',
	SCALE_AND_TRANSLATE: 'scaleAndTranslate',
	UP: 'up',
	DOWN: 'down',
	ADD: 'add',
	CLEAR: 'clear',
	ADD_CELLS: 'addCells',
	CELLS_ADDED: 'cellsAdded',
	MOVE_CELLS: 'moveCells',
	CELLS_MOVED: 'cellsMoved',
	RESIZE_CELLS: 'resizeCells',
	CELLS_RESIZED: 'cellsResized',
	TOGGLE_CELLS: 'toggleCells',
	CELLS_TOGGLED: 'cellsToggled',
	ORDER_CELLS: 'orderCells',
	CELLS_ORDERED: 'cellsOrdered',
	REMOVE_CELLS: 'removeCells',
	CELLS_REMOVED: 'cellsRemoved',
	GROUP_CELLS: 'groupCells',
	UNGROUP_CELLS: 'ungroupCells',
	REMOVE_CELLS_FROM_PARENT: 'removeCellsFromParent',
	FOLD_CELLS: 'foldCells',
	CELLS_FOLDED: 'cellsFolded',
	ALIGN_CELLS: 'alignCells',
	LABEL_CHANGED: 'labelChanged',
	CONNECT_CELL: 'connectCell',
	CELL_CONNECTED: 'cellConnected',
	SPLIT_EDGE: 'splitEdge',
	FLIP_EDGE: 'flipEdge',
	START_EDITING: 'startEditing',
	ADD_OVERLAY: 'addOverlay',
	REMOVE_OVERLAY: 'removeOverlay',
	UPDATE_CELL_SIZE: 'updateCellSize',
	ESCAPE: 'escape',
	CLICK: 'click',
	DOUBLE_CLICK: 'doubleClick'
};
function mxXmlRequest(url, params, method, async, username, password) {
	this.url = url;
	this.params = params;
	this.method = method || 'POST';
	this.async = (async != null) ? async: true;
	this.username = username;
	this.password = password;
};
mxXmlRequest.prototype.url = null;
mxXmlRequest.prototype.params = null;
mxXmlRequest.prototype.method = null;
mxXmlRequest.prototype.async = null;
mxXmlRequest.prototype.username = null;
mxXmlRequest.prototype.password = null;
mxXmlRequest.prototype.request = null;
mxXmlRequest.prototype.isReady = function() {
	return this.request.readyState == 4;
};
mxXmlRequest.prototype.getDocumentElement = function() {
	var doc = this.getXml();
	if (doc != null) {
		return doc.documentElement;
	}
	return null;
};
mxXmlRequest.prototype.getXml = function() {
	var xml = this.request.responseXML;
	if (xml == null || xml.documentElement == null) {
		xml = mxUtils.parseXml(this.request.responseText);
	}
	return xml;
};
mxXmlRequest.prototype.getText = function() {
	return this.request.responseText;
};
mxXmlRequest.prototype.getStatus = function() {
	return this.request.status;
};
mxXmlRequest.prototype.create = function() {
	if (window.XMLHttpRequest) {
		return function() {
			return new XMLHttpRequest();
		};
	} else if (typeof(ActiveXObject) != "undefined") {
		return function() {
			return new ActiveXObject("Microsoft.XMLHTTP");
		};
	}
} ();
mxXmlRequest.prototype.send = function(onload, onerror) {
	this.request = this.create();
	if (this.request != null) {
		this.request.onreadystatechange = mxUtils.bind(this,
		function() {
			if (this.isReady()) {
				if (onload != null) {
					onload(this);
				}
			}
		});
		this.request.open(this.method, this.url, this.async, this.username, this.password);
		this.setRequestHeaders(this.request, this.params);
		this.request.send(this.params);
	}
};
mxXmlRequest.prototype.setRequestHeaders = function(request, params) {
	if (params != null) {
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	}
};
mxXmlRequest.prototype.simulate = function(doc, target) {
	doc = doc || document;
	var old = null;
	if (doc == document) {
		old = window.onbeforeunload;
		window.onbeforeunload = null;
	}
	var form = doc.createElement('form');
	form.setAttribute('method', this.method);
	form.setAttribute('action', this.url);
	if (target != null) {
		form.setAttribute('target', target);
	}
	form.style.display = 'none';
	form.style.visibility = 'hidden';
	var pars = (this.params.indexOf('&') > 0) ? this.params.split('&') : this.params.split();
	for (var i = 0; i < pars.length; i++) {
		var pos = pars[i].indexOf('=');
		if (pos > 0) {
			var name = pars[i].substring(0, pos);
			var value = pars[i].substring(pos + 1);
			var textarea = doc.createElement('textarea');
			textarea.setAttribute('name', name);
			value = value.replace(/\n/g, '&#xa;');
			var content = doc.createTextNode(value);
			textarea.appendChild(content);
			form.appendChild(textarea);
		}
	}
	doc.body.appendChild(form);
	form.submit();
	doc.body.removeChild(form);
	if (old != null) {
		window.onbeforeunload = old;
	}
};
var mxClipboard = {
	STEPSIZE: 10,
	insertCount: 1,
	cells: null,
	isEmpty: function() {
		return mxClipboard.cells == null;
	},
	cut: function(graph, cells) {
		cells = mxClipboard.copy(graph, cells);
		mxClipboard.insertCount = 0;
		mxClipboard.removeCells(graph, cells);
		return cells;
	},
	removeCells: function(graph, cells) {
		graph.removeCells(cells);
	},
	copy: function(graph, cells) {
		cells = cells || graph.getSelectionCells();
		var result = graph.getExportableCells(cells);
		mxClipboard.insertCount = 1;
		mxClipboard.cells = graph.cloneCells(result);
		return result;
	},
	paste: function(graph) {
		if (mxClipboard.cells != null) {
			var cells = graph.getImportableCells(mxClipboard.cells);
			var delta = mxClipboard.insertCount * mxClipboard.STEPSIZE;
			var parent = graph.getDefaultParent();
			cells = graph.importCells(cells, delta, delta, parent);
			mxClipboard.insertCount++;
			graph.setSelectionCells(cells);
		}
	}
};
function mxWindow(title, content, x, y, width, height, minimizable, movable, replaceNode, style) {
	if (content != null) {
		minimizable = (minimizable != null) ? minimizable: true;
		this.content = content;
		this.init(x, y, width, height, style);
		this.installMaximizeHandler();
		this.installMinimizeHandler();
		this.installCloseHandler();
		this.setMinimizable(minimizable);
		mxUtils.write(this.title, title || '');
		if (movable == null || movable) {
			this.installMoveHandler();
		}
		if (replaceNode != null && replaceNode.parentNode != null) {
			replaceNode.parentNode.replaceChild(this.div, replaceNode);
		} else {
			document.body.appendChild(this.div);
		}
	}
};
mxWindow.prototype = new mxEventSource();
mxWindow.prototype.constructor = mxWindow;
mxWindow.prototype.closeImage = mxClient.imageBasePath + '/close.gif';
mxWindow.prototype.minimizeImage = mxClient.imageBasePath + '/minimize.gif';
mxWindow.prototype.normalizeImage = mxClient.imageBasePath + '/normalize.gif';
mxWindow.prototype.maximizeImage = mxClient.imageBasePath + '/maximize.gif';
mxWindow.prototype.resizeImage = mxClient.imageBasePath + '/resize.gif';
mxWindow.prototype.visible = false;
mxWindow.prototype.content = false;
mxWindow.prototype.minimumSize = new mxRectangle(0, 0, 50, 40);
mxWindow.prototype.content = false;
mxWindow.prototype.destroyOnClose = true;
mxWindow.prototype.init = function(x, y, width, height, style) {
	style = (style != null) ? style: 'mxWindow';
	this.div = document.createElement('div');
	this.div.className = style;
	this.div.style.left = x + 'px';
	this.div.style.top = y + 'px';
	if (!true && mxClient.WINDOW_SHADOWS) {
		this.shadow = document.createElement('div');
		this.shadow.style.background = mxConstants.SHADOWCOLOR;
		mxUtils.setOpacity(this.shadow, 70);
		this.shadow.style.position = 'absolute';
		this.shadow.style.display = 'inline';
	} else if (true && !mxClient.WINDOW_SHADOWS) {
		this.div.style.filter = '';
	}
	this.table = document.createElement('table');
	this.table.className = style;
	if (width != null) {
		if (!true) {
			this.div.style.width = width + 'px';
		}
		this.table.style.width = width + 'px';
	}
	if (height != null) {
		if (!true) {
			this.div.style.height = height + 'px';
		}
		this.table.style.height = height + 'px';
	}
	var tbody = document.createElement('tbody');
	var tr = document.createElement('tr');
	this.title = document.createElement('td');
	this.title.className = style + 'Title';
	tr.appendChild(this.title);
	tbody.appendChild(tr);
	tr = document.createElement('tr');
	this.td = document.createElement('td');
	this.td.className = style + 'Pane';
	this.contentWrapper = document.createElement('div');
	this.contentWrapper.className = style + 'Pane';
	this.contentWrapper.style.width = '100%';
	this.contentWrapper.appendChild(this.content);
	if (true || this.content.nodeName.toUpperCase() != 'DIV') {
		this.contentWrapper.style.height = '100%';
	}
	this.td.appendChild(this.contentWrapper);
	tr.appendChild(this.td);
	tbody.appendChild(tr);
	this.table.appendChild(tbody);
	this.div.appendChild(this.table);
	var activator = mxUtils.bind(this,
	function(evt) {
		this.activate();
	});
	mxEvent.addListener(this.title, 'mousedown', activator);
	mxEvent.addListener(this.table, 'mousedown', activator);
	if (this.shadow != null) {
		mxEvent.addListener(this.div, 'DOMNodeInserted', mxUtils.bind(this,
		function(evt) {
			var node = mxEvent.getSource(evt);
			var loadHandler = mxUtils.bind(this,
			function(evt) {
				mxEvent.removeListener(node, 'load', loadHandler);
				this.updateShadow();
			});
			mxEvent.addListener(node, 'load', loadHandler);
			this.updateShadow();
		}));
	}
	this.hide();
};
mxWindow.prototype.setScrollable = function(scrollable) {
	if (navigator.userAgent.indexOf('Presto/2.5') < 0) {
		if (scrollable) {
			this.contentWrapper.style.overflow = 'auto'
		} else {
			this.contentWrapper.style.overflow = 'hidden'
		}
	}
};
mxWindow.prototype.updateShadow = function() {
	if (this.shadow != null) {
		this.shadow.style.visibility = this.div.style.visibility;
		this.shadow.style.left = (parseInt(this.div.style.left) + 3) + 'px';
		this.shadow.style.top = (parseInt(this.div.style.top) + 3) + 'px';
		this.shadow.style.width = this.div.offsetWidth + 'px';
		this.shadow.style.height = this.div.offsetHeight + 'px';
		if (this.shadow.parentNode != this.div.parentNode) {
			this.div.parentNode.appendChild(this.shadow);
		}
	}
};
mxWindow.prototype.activate = function() {
	if (mxWindow.activeWindow != this) {
		var style = mxUtils.getCurrentStyle(this.getElement());
		var index = (style != null) ? style.zIndex: 3;
		if (mxWindow.activeWindow) {
			var elt = mxWindow.activeWindow.getElement();
			if (elt != null && elt.style != null) {
				elt.style.zIndex = index;
			}
		}
		var previousWindow = mxWindow.activeWindow;
		this.getElement().style.zIndex = index + 1;
		mxWindow.activeWindow = this;
		this.fireEvent(new mxEventObject(mxEvent.ACTIVATE, 'previousWindow', previousWindow));
	}
};
mxWindow.prototype.getElement = function() {
	return this.div;
};
mxWindow.prototype.fit = function() {
	mxUtils.fit(this.div);
};
mxWindow.prototype.isResizable = function() {
	if (this.resize != null) {
		return this.resize.style.display != 'none';
	}
	return false;
};
mxWindow.prototype.setResizable = function(resizable) {
	if (resizable) {
		if (this.resize == null) {
			this.resize = document.createElement('img');
			this.resize.style.position = 'absolute';
			this.resize.style.bottom = '2px';
			this.resize.style.right = '2px';
			this.resize.setAttribute('src', mxClient.imageBasePath + '/resize.gif');
			this.resize.style.cursor = 'nw-resize';
			var md = (mxClient.IS_TOUCH) ? 'touchstart': 'mousedown';
			var mm = (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove';
			var mu = (mxClient.IS_TOUCH) ? 'touchend': 'mouseup';
			mxEvent.addListener(this.resize, md, mxUtils.bind(this,
			function(evt) {
				this.activate();
				var startX = evt.clientX;
				var startY = evt.clientY;
				var width = this.div.offsetWidth;
				var height = this.div.offsetHeight;
				var dragHandler = mxUtils.bind(this,
				function(evt) {
					var dx = evt.clientX - startX;
					var dy = evt.clientY - startY;
					this.setSize(width + dx, height + dy);
					this.updateShadow();
					this.fireEvent(new mxEventObject(mxEvent.RESIZE, 'event', evt));
					mxEvent.consume(evt);
				});
				var dropHandler = mxUtils.bind(this,
				function(evt) {
					mxEvent.removeListener(document, mm, dragHandler);
					mxEvent.removeListener(document, mu, dropHandler);
					this.fireEvent(new mxEventObject(mxEvent.RESIZE_END, 'event', evt));
					mxEvent.consume(evt);
				});
				mxEvent.addListener(document, mm, dragHandler);
				mxEvent.addListener(document, mu, dropHandler);
				this.fireEvent(new mxEventObject(mxEvent.RESIZE_START, 'event', evt));
				mxEvent.consume(evt);
			}));
			this.div.appendChild(this.resize);
		} else {
			this.resize.style.display = 'inline';
		}
	} else if (this.resize != null) {
		this.resize.style.display = 'none';
	}
};
mxWindow.prototype.setSize = function(width, height) {
	width = Math.max(this.minimumSize.width, width);
	height = Math.max(this.minimumSize.height, height);
	if (!true) {
		this.div.style.width = width + 'px';
		this.div.style.height = height + 'px';
	}
	this.table.style.width = width + 'px';
	this.table.style.height = height + 'px';
	if (!true) {
		this.contentWrapper.style.height = (this.div.offsetHeight - this.title.offsetHeight - 2) + 'px';
	}
};
mxWindow.prototype.setMinimizable = function(minimizable) {
	this.minimize.style.display = (minimizable) ? '': 'none';
};
mxWindow.prototype.installMinimizeHandler = function() {
	this.minimize = document.createElement('img');
	this.minimize.setAttribute('src', this.minimizeImage);
	this.minimize.setAttribute('align', 'right');
	this.minimize.setAttribute('title', 'Minimize');
	this.minimize.style.cursor = 'pointer';
	this.minimize.style.marginRight = '1px';
	this.minimize.style.display = 'none';
	this.title.appendChild(this.minimize);
	var minimized = false;
	var maxDisplay = null;
	var height = null;
	var funct = mxUtils.bind(this,
	function(evt) {
		this.activate();
		if (!minimized) {
			minimized = true;
			this.minimize.setAttribute('src', this.normalizeImage);
			this.minimize.setAttribute('title', 'Normalize');
			this.contentWrapper.style.display = 'none';
			maxDisplay = this.maximize.style.display;
			this.maximize.style.display = 'none';
			height = this.table.style.height;
			if (!true) {
				this.div.style.height = this.title.offsetHeight + 'px';
			}
			this.table.style.height = this.title.offsetHeight + 'px';
			if (this.resize != null) {
				this.resize.style.visibility = 'hidden';
			}
			this.updateShadow();
			this.fireEvent(new mxEventObject(mxEvent.MINIMIZE, 'event', evt));
		} else {
			minimized = false;
			this.minimize.setAttribute('src', this.minimizeImage);
			this.minimize.setAttribute('title', 'Minimize');
			this.contentWrapper.style.display = '';
			this.maximize.style.display = maxDisplay;
			if (!true) {
				this.div.style.height = height;
			}
			this.table.style.height = height;
			if (this.resize != null) {
				this.resize.style.visibility = '';
			}
			this.updateShadow();
			this.fireEvent(new mxEventObject(mxEvent.NORMALIZE, 'event', evt));
		}
		mxEvent.consume(evt);
	});
	mxEvent.addListener(this.minimize, 'mousedown', funct);
};
mxWindow.prototype.setMaximizable = function(maximizable) {
	this.maximize.style.display = (maximizable) ? '': 'none';
};
mxWindow.prototype.installMaximizeHandler = function() {
	this.maximize = document.createElement('img');
	this.maximize.setAttribute('src', this.maximizeImage);
	this.maximize.setAttribute('align', 'right');
	this.maximize.setAttribute('title', 'Maximize');
	this.maximize.style.cursor = 'default';
	this.maximize.style.marginLeft = '1px';
	this.maximize.style.cursor = 'pointer';
	this.maximize.style.display = 'none';
	this.title.appendChild(this.maximize);
	var maximized = false;
	var x = null;
	var y = null;
	var height = null;
	var width = null;
	var funct = mxUtils.bind(this,
	function(evt) {
		this.activate();
		if (this.maximize.style.display != 'none') {
			if (!maximized) {
				maximized = true;
				this.maximize.setAttribute('src', this.normalizeImage);
				this.maximize.setAttribute('title', 'Normalize');
				this.contentWrapper.style.display = '';
				this.minimize.style.visibility = 'hidden';
				x = parseInt(this.div.style.left);
				y = parseInt(this.div.style.top);
				height = this.table.style.height;
				width = this.table.style.width;
				this.div.style.left = '0px';
				this.div.style.top = '0px';
				if (!true) {
					this.div.style.height = (document.body.clientHeight - 2) + 'px';
					this.div.style.width = (document.body.clientWidth - 2) + 'px';
				}
				this.table.style.width = (document.body.clientWidth - 2) + 'px';
				this.table.style.height = (document.body.clientHeight - 2) + 'px';
				if (this.resize != null) {
					this.resize.style.visibility = 'hidden';
				}
				if (this.shadow != null) {
					this.shadow.style.visibility = 'none';
				}
				if (!true) {
					var style = mxUtils.getCurrentStyle(this.contentWrapper);
					if (style.overflow == 'auto' || this.resize != null) {
						this.contentWrapper.style.height = (this.div.offsetHeight - this.title.offsetHeight - 2) + 'px';
					}
				}
				this.fireEvent(new mxEventObject(mxEvent.MAXIMIZE, 'event', evt));
			} else {
				maximized = false;
				this.maximize.setAttribute('src', this.maximizeImage);
				this.maximize.setAttribute('title', 'Maximize');
				this.contentWrapper.style.display = '';
				this.minimize.style.visibility = '';
				this.div.style.left = x + 'px';
				this.div.style.top = y + 'px';
				if (!true) {
					this.div.style.height = height;
					this.div.style.width = width;
					var style = mxUtils.getCurrentStyle(this.contentWrapper);
					if (style.overflow == 'auto' || this.resize != null) {
						this.contentWrapper.style.height = (this.div.offsetHeight - this.title.offsetHeight - 2) + 'px';
					}
				}
				this.table.style.height = height;
				this.table.style.width = width;
				if (this.resize != null) {
					this.resize.style.visibility = '';
				}
				this.updateShadow();
				this.fireEvent(new mxEventObject(mxEvent.NORMALIZE, 'event', evt));
			}
			mxEvent.consume(evt);
		}
	});
	mxEvent.addListener(this.maximize, 'mousedown', funct);
	mxEvent.addListener(this.title, 'dblclick', funct);
};
mxWindow.prototype.installMoveHandler = function() {
	this.title.style.cursor = 'move';
	var md = (mxClient.IS_TOUCH) ? 'touchstart': 'mousedown';
	var mm = (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove';
	var mu = (mxClient.IS_TOUCH) ? 'touchend': 'mouseup';
	mxEvent.addListener(this.title, md, mxUtils.bind(this,
	function(evt) {
		var startX = evt.clientX;
		var startY = evt.clientY;
		var x = this.getX();
		var y = this.getY();
		var dragHandler = mxUtils.bind(this,
		function(evt) {
			var dx = evt.clientX - startX;
			var dy = evt.clientY - startY;
			this.setLocation(x + dx, y + dy);
			this.fireEvent(new mxEventObject(mxEvent.MOVE, 'event', evt));
			mxEvent.consume(evt);
		});
		var dropHandler = mxUtils.bind(this,
		function(evt) {
			mxEvent.removeListener(document, mm, dragHandler);
			mxEvent.removeListener(document, mu, dropHandler);
			this.fireEvent(new mxEventObject(mxEvent.MOVE_END, 'event', evt));
			mxEvent.consume(evt);
		});
		mxEvent.addListener(document, mm, dragHandler);
		mxEvent.addListener(document, mu, dropHandler);
		this.fireEvent(new mxEventObject(mxEvent.MOVE_START, 'event', evt));
		mxEvent.consume(evt);
	}));
};
mxWindow.prototype.setLocation = function(x, y) {
	this.div.style.left = x + 'px';
	this.div.style.top = y + 'px';
	this.updateShadow();
};
mxWindow.prototype.getX = function() {
	return parseInt(this.div.style.left);
};
mxWindow.prototype.getY = function() {
	return parseInt(this.div.style.top);
};
mxWindow.prototype.installCloseHandler = function() {
	this.closeImg = document.createElement('img');
	this.closeImg.setAttribute('src', this.closeImage);
	this.closeImg.setAttribute('align', 'right');
	this.closeImg.setAttribute('title', 'Close');
	this.closeImg.style.marginLeft = '2px';
	this.closeImg.style.cursor = 'pointer';
	this.closeImg.style.display = 'none';
	this.title.insertBefore(this.closeImg, this.title.firstChild);
	mxEvent.addListener(this.closeImg, 'mousedown', mxUtils.bind(this,
	function(evt) {
		this.fireEvent(new mxEventObject(mxEvent.CLOSE, 'event', evt));
		if (this.destroyOnClose) {
			this.destroy();
		} else {
			this.setVisible(false);
		}
		mxEvent.consume(evt);
	}));
};
mxWindow.prototype.setImage = function(image) {
	this.image = document.createElement('img');
	this.image.setAttribute('src', image);
	this.image.setAttribute('align', 'left');
	this.image.style.marginRight = '4px';
	this.image.style.marginLeft = '0px';
	this.image.style.marginTop = '-2px';
	this.title.insertBefore(this.image, this.title.firstChild);
};
mxWindow.prototype.setClosable = function(closable) {
	this.closeImg.style.display = (closable) ? '': 'none';
};
mxWindow.prototype.isVisible = function() {
	if (this.div != null) {
		return this.div.style.visibility != 'hidden';
	}
	return false;
};
mxWindow.prototype.setVisible = function(visible) {
	if (this.div != null && this.isVisible() != visible) {
		if (visible) {
			this.show();
		} else {
			this.hide();
		}
	}
	this.updateShadow();
};
mxWindow.prototype.show = function() {
	this.div.style.visibility = '';
	this.activate();
	var style = mxUtils.getCurrentStyle(this.contentWrapper);
	if (!true && (style.overflow == 'auto' || this.resize != null)) {
		this.contentWrapper.style.height = (this.div.offsetHeight - this.title.offsetHeight - 2) + 'px';
	}
	this.fireEvent(new mxEventObject(mxEvent.SHOW));
};
mxWindow.prototype.hide = function() {
	this.div.style.visibility = 'hidden';
	this.fireEvent(new mxEventObject(mxEvent.HIDE));
};
mxWindow.prototype.destroy = function() {
	this.fireEvent(new mxEventObject(mxEvent.DESTROY));
	if (this.div != null) {
		mxEvent.release(this.div);
		this.div.parentNode.removeChild(this.div);
		this.div = null;
	}
	if (this.shadow != null) {
		this.shadow.parentNode.removeChild(this.shadow);
		this.shadow = null;
	}
	this.title = null;
	this.content = null;
	this.contentWrapper = null;
};
function mxForm(className) {
	this.table = document.createElement('table');
	this.table.className = className;
	this.body = document.createElement('tbody');
	this.table.appendChild(this.body);
};
mxForm.prototype.table = null;
mxForm.prototype.body = false;
mxForm.prototype.getTable = function() {
	return this.table;
};
mxForm.prototype.addButtons = function(okFunct, cancelFunct) {
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	tr.appendChild(td);
	td = document.createElement('td');
	var button = document.createElement('button');
	mxUtils.write(button, mxResources.get('ok') || 'OK');
	td.appendChild(button);
	mxEvent.addListener(button, 'click',
	function() {
		okFunct();
	});
	button = document.createElement('button');
	mxUtils.write(button, mxResources.get('cancel') || 'Cancel');
	td.appendChild(button);
	mxEvent.addListener(button, 'click',
	function() {
		cancelFunct();
	});
	tr.appendChild(td);
	this.body.appendChild(tr);
};
mxForm.prototype.addText = function(name, value) {
	var input = document.createElement('input');
	input.setAttribute('type', 'text');
	input.value = value;
	return this.addField(name, input);
};
mxForm.prototype.addCheckbox = function(name, value) {
	var input = document.createElement('input');
	input.setAttribute('type', 'checkbox');
	this.addField(name, input);
	if (value) {
		input.checked = true;
	}
	return input;
};
mxForm.prototype.addTextarea = function(name, value, rows) {
	var input = document.createElement('textarea');
	if (false) {
		rows--;
	}
	input.setAttribute('rows', rows || 2);
	input.value = value;
	return this.addField(name, input);
};
mxForm.prototype.addCombo = function(name, isMultiSelect, size) {
	var select = document.createElement('select');
	if (size != null) {
		select.setAttribute('size', size);
	}
	if (isMultiSelect) {
		select.setAttribute('multiple', 'true');
	}
	return this.addField(name, select);
};
mxForm.prototype.addOption = function(combo, label, value, isSelected) {
	var option = document.createElement('option');
	mxUtils.writeln(option, label);
	option.setAttribute('value', value);
	if (isSelected) {
		option.setAttribute('selected', isSelected);
	}
	combo.appendChild(option);
};
mxForm.prototype.addField = function(name, input) {
	var tr = document.createElement('tr');
	var td = document.createElement('td');
	mxUtils.write(td, name);
	tr.appendChild(td);
	td = document.createElement('td');
	td.appendChild(input);
	tr.appendChild(td);
	this.body.appendChild(tr);
	return input;
};
function mxImage(src, width, height) {
	this.src = src;
	this.width = width;
	this.height = height;
};
mxImage.prototype.src = null;
mxImage.prototype.width = null;
mxImage.prototype.height = null;
function mxDivResizer(div, container) {
	if (div.nodeName.toLowerCase() == 'div') {
		if (container == null) {
			container = window;
		}
		this.div = div;
		var style = mxUtils.getCurrentStyle(div);
		if (style != null) {
			this.resizeWidth = style.width == 'auto';
			this.resizeHeight = style.height == 'auto';
		}
		mxEvent.addListener(container, 'resize', mxUtils.bind(this,
		function(evt) {
			if (!this.handlingResize) {
				this.handlingResize = true;
				this.resize();
				this.handlingResize = false;
			}
		}));
		this.resize();
	}
};
mxDivResizer.prototype.resizeWidth = true;
mxDivResizer.prototype.resizeHeight = true;
mxDivResizer.prototype.handlingResize = false;
mxDivResizer.prototype.resize = function() {
	var w = this.getDocumentWidth();
	var h = this.getDocumentHeight();
	var l = parseInt(this.div.style.left);
	var r = parseInt(this.div.style.right);
	var t = parseInt(this.div.style.top);
	var b = parseInt(this.div.style.bottom);
	if (this.resizeWidth && !isNaN(l) && !isNaN(r) && l >= 0 && r >= 0 && w - r - l > 0) {
		this.div.style.width = (w - r - l) + 'px';
	}
	if (this.resizeHeight && !isNaN(t) && !isNaN(b) && t >= 0 && b >= 0 && h - t - b > 0) {
		this.div.style.height = (h - t - b) + 'px';
	}
};
mxDivResizer.prototype.getDocumentWidth = function() {
	return document.body.clientWidth;
};
mxDivResizer.prototype.getDocumentHeight = function() {
	return document.body.clientHeight;
};
function mxToolbar(container) {
	this.container = container;
};
mxToolbar.prototype = new mxEventSource();
mxToolbar.prototype.constructor = mxToolbar;
mxToolbar.prototype.container = null;
mxToolbar.prototype.enabled = true;
mxToolbar.prototype.noReset = false;
mxToolbar.prototype.updateDefaultMode = true;
mxToolbar.prototype.addItem = function(title, icon, funct, pressedIcon, style, factoryMethod) {
	var img = document.createElement((icon != null) ? 'img': 'button');
	var initialClassName = style || ((factoryMethod != null) ? 'mxToolbarMode': 'mxToolbarItem');
	img.className = initialClassName;
	img.setAttribute('src', icon);
	if (title != null) {
		if (icon != null) {
			img.setAttribute('title', title);
		} else {
			mxUtils.write(img, title);
		}
	}
	this.container.appendChild(img);
	if (funct != null) {
		mxEvent.addListener(img, 'click', funct);
	}
	mxEvent.addListener(img, 'mousedown', mxUtils.bind(this,
	function(evt) {
		if (pressedIcon != null) {
			img.setAttribute('src', pressedIcon);
		} else {
			img.style.backgroundColor = 'gray';
		}
		if (factoryMethod != null) {
			if (this.menu == null) {
				this.menu = new mxPopupMenu();
				this.menu.init();
			}
			var last = this.currentImg;
			if (this.menu.isMenuShowing()) {
				this.menu.hideMenu();
			}
			if (last != img) {
				this.currentImg = img;
				this.menu.factoryMethod = factoryMethod;
				var point = new mxPoint(img.offsetLeft, img.offsetTop + img.offsetHeight);
				this.menu.popup(point.x, point.y, null, evt);
				if (this.menu.isMenuShowing()) {
					img.className = initialClassName + 'Selected';
					this.menu.hideMenu = function() {
						mxPopupMenu.prototype.hideMenu.apply(this);
						img.className = initialClassName;
						this.currentImg = null;
					};
				}
			}
		}
	}));
	var mouseHandler = mxUtils.bind(this,
	function(evt) {
		if (pressedIcon != null) {
			img.setAttribute('src', icon);
		} else {
			img.style.backgroundColor = '';
		}
	});
	mxEvent.addListener(img, 'mouseup', mouseHandler);
	mxEvent.addListener(img, 'mouseout', mouseHandler);
	return img;
};
mxToolbar.prototype.addCombo = function(style) {
	var div = document.createElement('div');
	div.style.display = 'inline';
	div.className = 'mxToolbarComboContainer';
	var select = document.createElement('select');
	select.className = style || 'mxToolbarCombo';
	div.appendChild(select);
	this.container.appendChild(div);
	return select;
};
mxToolbar.prototype.addActionCombo = function(title, style) {
	var select = document.createElement('select');
	select.className = style || 'mxToolbarCombo';
	this.addOption(select, title, null);
	mxEvent.addListener(select, 'change',
	function(evt) {
		var value = select.options[select.selectedIndex];
		select.selectedIndex = 0;
		if (value.funct != null) {
			value.funct(evt);
		}
	});
	this.container.appendChild(select);
	return select;
};
mxToolbar.prototype.addOption = function(combo, title, value) {
	var option = document.createElement('option');
	mxUtils.writeln(option, title);
	if (typeof(value) == 'function') {
		option.funct = value;
	} else {
		option.setAttribute('value', value);
	}
	combo.appendChild(option);
	return option;
};
mxToolbar.prototype.addSwitchMode = function(title, icon, funct, pressedIcon, style) {
	var img = document.createElement('img');
	img.initialClassName = style || 'mxToolbarMode';
	img.className = img.initialClassName;
	img.setAttribute('src', icon);
	img.altIcon = pressedIcon;
	if (title != null) {
		img.setAttribute('title', title);
	}
	mxEvent.addListener(img, 'click', mxUtils.bind(this,
	function(evt) {
		var tmp = this.selectedMode.altIcon;
		if (tmp != null) {
			this.selectedMode.altIcon = this.selectedMode.getAttribute('src');
			this.selectedMode.setAttribute('src', tmp);
		} else {
			this.selectedMode.className = this.selectedMode.initialClassName;
		}
		if (this.updateDefaultMode) {
			this.defaultMode = img;
		}
		this.selectedMode = img;
		var tmp = img.altIcon;
		if (tmp != null) {
			img.altIcon = img.getAttribute('src');
			img.setAttribute('src', tmp);
		} else {
			img.className = img.initialClassName + 'Selected';
		}
		this.fireEvent(new mxEventObject(mxEvent.SELECT));
		funct();
	}));
	this.container.appendChild(img);
	if (this.defaultMode == null) {
		this.defaultMode = img;
		this.selectedMode = img;
		var tmp = img.altIcon;
		if (tmp != null) {
			img.altIcon = img.getAttribute('src');
			img.setAttribute('src', tmp);
		} else {
			img.className = img.initialClassName + 'Selected';
		}
		funct();
	}
	return img;
};
mxToolbar.prototype.addMode = function(title, icon, funct, pressedIcon, style) {
	var img = document.createElement((icon != null) ? 'img': 'button');
	img.initialClassName = style || 'mxToolbarMode';
	img.className = img.initialClassName;
	img.setAttribute('src', icon);
	img.altIcon = pressedIcon;
	if (title != null) {
		img.setAttribute('title', title);
	}
	if (this.enabled) {
		mxEvent.addListener(img, 'click', mxUtils.bind(this,
		function(evt) {
			this.selectMode(img, funct);
			this.noReset = false;
		}));
		mxEvent.addListener(img, 'dblclick', mxUtils.bind(this,
		function(evt) {
			this.selectMode(img, funct);
			this.noReset = true;
		}));
		if (this.defaultMode == null) {
			this.defaultMode = img;
			this.selectedMode = img;
			var tmp = img.altIcon;
			if (tmp != null) {
				img.altIcon = img.getAttribute('src');
				img.setAttribute('src', tmp);
			} else {
				img.className = img.initialClassName + 'Selected';
			}
		}
	}
	this.container.appendChild(img);
	return img;
};
mxToolbar.prototype.selectMode = function(domNode, funct) {
	if (this.selectedMode != domNode) {
		var tmp = this.selectedMode.altIcon;
		if (tmp != null) {
			this.selectedMode.altIcon = this.selectedMode.getAttribute('src');
			this.selectedMode.setAttribute('src', tmp);
		} else {
			this.selectedMode.className = this.selectedMode.initialClassName;
		}
		this.selectedMode = domNode;
		var tmp = this.selectedMode.altIcon;
		if (tmp != null) {
			this.selectedMode.altIcon = this.selectedMode.getAttribute('src');
			this.selectedMode.setAttribute('src', tmp);
		} else {
			this.selectedMode.className = this.selectedMode.initialClassName + 'Selected';
		}
		this.fireEvent(new mxEventObject(mxEvent.SELECT, "function", funct));
	}
};
mxToolbar.prototype.resetMode = function(forced) {
	if ((forced || !this.noReset) && this.selectedMode != this.defaultMode) {
		this.selectMode(this.defaultMode, null);
	}
};
mxToolbar.prototype.addSeparator = function(icon) {
	return this.addItem(null, icon, null);
};
mxToolbar.prototype.addBreak = function() {
	mxUtils.br(this.container);
};
mxToolbar.prototype.addLine = function() {
	var hr = document.createElement('hr');
	hr.style.marginRight = '6px';
	hr.setAttribute('size', '1');
	this.container.appendChild(hr);
};
mxToolbar.prototype.destroy = function() {
	mxEvent.release(this.container);
	this.container = null;
	this.defaultMode = null;
	this.selectedMode = null;
	if (this.menu != null) {
		this.menu.destroy();
	}
};
function mxSession(model, urlInit, urlPoll, urlNotify) {
	this.model = model;
	this.urlInit = urlInit;
	this.urlPoll = urlPoll;
	this.urlNotify = urlNotify;
	if (model != null) {
		this.codec = new mxCodec();
		this.codec.lookup = function(id) {
			return model.getCell(id);
		};
	}
	model.addListener(mxEvent.NOTIFY, mxUtils.bind(this,
	function(sender, evt) {
		var changes = evt.getProperty("changes");
		if (changes != null && this.debug || (this.connected && !this.suspended)) {
			this.notify(this.encodeChanges(changes));
		}
	}));
};
mxSession.prototype = new mxEventSource();
mxSession.prototype.constructor = mxSession;
mxSession.prototype.model = null;
mxSession.prototype.urlInit = null;
mxSession.prototype.urlPoll = null;
mxSession.prototype.urlNotify = null;
mxSession.prototype.codec = null;
mxSession.prototype.linefeed = '&#xa;';
mxSession.prototype.escapePostData = true;
mxSession.prototype.significantRemoteChanges = true;
mxSession.prototype.sent = 0;
mxSession.prototype.received = 0;
mxSession.prototype.debug = false;
mxSession.prototype.connected = false;
mxSession.prototype.suspended = false;
mxSession.prototype.polling = false;
mxSession.prototype.start = function() {
	if (this.debug) {
		this.connected = true;
		this.fireEvent(new mxEventObject(mxEvent.CONNECT));
	} else if (!this.connected) {
		this.get(this.urlInit, mxUtils.bind(this,
		function(req) {
			this.connected = true;
			this.fireEvent(new mxEventObject(mxEvent.CONNECT));
			this.poll();
		}));
	}
};
mxSession.prototype.suspend = function() {
	if (this.connected && !this.suspended) {
		this.suspended = true;
		this.fireEvent(new mxEventObject(mxEvent.SUSPEND));
	}
};
mxSession.prototype.resume = function(type, attr, value) {
	if (this.connected && this.suspended) {
		this.suspended = false;
		this.fireEvent(new mxEventObject(mxEvent.RESUME));
		if (!this.polling) {
			this.poll();
		}
	}
};
mxSession.prototype.stop = function(reason) {
	if (this.connected) {
		this.connected = false;
	}
	this.fireEvent(new mxEventObject(mxEvent.DISCONNECT, 'reason', reason));
};
mxSession.prototype.poll = function() {
	if (this.connected && !this.suspended && this.urlPoll != null) {
		this.polling = true;
		this.get(this.urlPoll, mxUtils.bind(this,
		function() {
			this.poll()
		}));
	} else {
		this.polling = false;
	}
};
mxSession.prototype.notify = function(xml, onLoad, onError) {
	if (xml != null && xml.length > 0) {
		if (this.urlNotify != null) {
			if (this.debug) {
				mxLog.show();
				mxLog.debug('mxSession.notify: ' + this.urlNotify + ' xml=' + xml);
			} else {
				if (this.escapePostData) {
					xml = encodeURIComponent(xml);
				}
				mxUtils.post(this.urlNotify, 'xml=' + xml, onLoad, onError);
			}
		}
		this.sent += xml.length;
		this.fireEvent(new mxEventObject(mxEvent.NOTIFY, "url", this.urlNotify, "xml", xml));
	}
};
mxSession.prototype.get = function(url, onLoad, onError) {
	if (typeof(mxUtils) != 'undefined') {
		var onErrorWrapper = mxUtils.bind(this,
		function(ex) {
			if (onError != null) {
				onError(ex);
			} else {
				this.stop(ex);
			}
		});
		var req = mxUtils.get(url, mxUtils.bind(this,
		function(req) {
			if (typeof(mxUtils) != 'undefined') {
				try {
					if (req.isReady() && req.getStatus() != 404) {
						this.received += req.getText().length;
						this.fireEvent(new mxEventObject(mxEvent.GET, 'url', url, 'request', req));
						if (this.isValidResponse(req)) {
							if (req.getText().length > 0) {
								var node = req.getDocumentElement();
								if (node == null) {
									onErrorWrapper('Invalid response: ' + req.getText());
								} else {
									this.receive(node);
								}
							}
							if (onLoad != null) {
								onLoad(req);
							}
						}
					} else {
						onErrorWrapper('Response not ready');
					}
				} catch(ex) {
					onErrorWrapper(ex);
					throw ex;
				}
			}
		}),
		function(req) {
			onErrorWrapper('Transmission error');
		});
	}
};
mxSession.prototype.isValidResponse = function(req) {
	return req.getText().indexOf('<?php') < 0;
};
mxSession.prototype.encodeChanges = function(changes) {
	var xml = '';
	for (var i = 0; i < changes.length; i++) {
		var node = this.codec.encode(changes[i]);
		xml += mxUtils.getXml(node, this.linefeed);
	}
	return xml;
};
mxSession.prototype.receive = function(node) {
	if (node != null && node.nodeType == mxConstants.NODETYPE_ELEMENT) {
		var name = node.nodeName.toLowerCase();
		if (name == 'state') {
			var tmp = node.firstChild;
			while (tmp != null) {
				this.receive(tmp);
				tmp = tmp.nextSibling;
			}
			var sid = node.getAttribute('namespace');
			this.model.prefix = sid + '-';
		} else if (name == 'delta') {
			var changes = this.decodeChanges(node);
			if (changes.length > 0) {
				var edit = this.createUndoableEdit(changes);
				this.model.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', edit));
				this.model.fireEvent(new mxEventObject(mxEvent.CHANGE, 'changes', changes));
				this.fireEvent(new mxEventObject(mxEvent.FIRED, 'changes', changes));
			}
		}
		this.fireEvent(new mxEventObject(mxEvent.RECEIVE, 'node', node));
	}
};
mxSession.prototype.createUndoableEdit = function(changes) {
	var edit = new mxUndoableEdit(this.model, this.significantRemoteChanges);
	edit.changes = changes;
	edit.notify = function() {
		edit.source.fireEvent(new mxEventObject(mxEvent.CHANGE, 'changes', edit.changes));
		edit.source.fireEvent(new mxEventObject(mxEvent.NOTIFY, 'changes', edit.changes));
	};
	return edit;
};
mxSession.prototype.decodeChanges = function(node) {
	this.codec.document = node.ownerDocument;
	var changes = [];
	node = node.firstChild;
	while (node != null) {
		if (node.nodeType == mxConstants.NODETYPE_ELEMENT) {
			var change = null;
			if (node.nodeName == 'mxRootChange') {
				var codec = new mxCodec(node.ownerDocument);
				change = codec.decode(node);
			} else {
				change = this.codec.decode(node);
			}
			if (change != null) {
				change.model = this.model;
				change.execute();
				changes.push(change);
			}
		}
		node = node.nextSibling;
	}
	return changes;
};
function mxUndoableEdit(source, significant) {
	this.source = source;
	this.changes = [];
	this.significant = (significant != null) ? significant: true;
};
mxUndoableEdit.prototype.source = null;
mxUndoableEdit.prototype.changes = null;
mxUndoableEdit.prototype.significant = null;
mxUndoableEdit.prototype.undone = false;
mxUndoableEdit.prototype.redone = false;
mxUndoableEdit.prototype.isEmpty = function() {
	return this.changes.length == 0;
};
mxUndoableEdit.prototype.isSignificant = function() {
	return this.significant;
};
mxUndoableEdit.prototype.add = function(change) {
	this.changes.push(change);
};
mxUndoableEdit.prototype.notify = function() {};
mxUndoableEdit.prototype.die = function() {};
mxUndoableEdit.prototype.undo = function() {
	if (!this.undone) {
		var count = this.changes.length;
		for (var i = count - 1; i >= 0; i--) {
			var change = this.changes[i];
			if (change.execute != null) {
				change.execute();
			} else if (change.undo != null) {
				change.undo();
			}
		}
		this.undone = true;
		this.redone = false;
	}
	this.notify();
};
mxUndoableEdit.prototype.redo = function() {
	if (!this.redone) {
		var count = this.changes.length;
		for (var i = 0; i < count; i++) {
			var change = this.changes[i];
			if (change.execute != null) {
				change.execute();
			} else if (change.redo != null) {
				change.redo();
			}
		}
		this.undone = false;
		this.redone = true;
	}
	this.notify();
};
function mxUndoManager(size) {
	this.size = size || 100;
	this.clear();
};
mxUndoManager.prototype = new mxEventSource();
mxUndoManager.prototype.constructor = mxUndoManager;
mxUndoManager.prototype.size = null;
mxUndoManager.prototype.history = null;
mxUndoManager.prototype.indexOfNextAdd = 0;
mxUndoManager.prototype.isEmpty = function() {
	return this.history.length == 0;
};
mxUndoManager.prototype.clear = function() {
	this.history = [];
	this.indexOfNextAdd = 0;
	this.fireEvent(new mxEventObject(mxEvent.CLEAR));
};
mxUndoManager.prototype.canUndo = function() {
	return this.indexOfNextAdd > 0;
};
mxUndoManager.prototype.undo = function() {
	while (this.indexOfNextAdd > 0) {
		var edit = this.history[--this.indexOfNextAdd];
		edit.undo();
		if (edit.isSignificant()) {
			this.fireEvent(new mxEventObject(mxEvent.UNDO, 'edit', edit));
			break;
		}
	}
};
mxUndoManager.prototype.canRedo = function() {
	return this.indexOfNextAdd < this.history.length;
};
mxUndoManager.prototype.redo = function() {
	var n = this.history.length;
	while (this.indexOfNextAdd < n) {
		var edit = this.history[this.indexOfNextAdd++];
		edit.redo();
		if (edit.isSignificant()) {
			this.fireEvent(new mxEventObject(mxEvent.REDO, 'edit', edit));
			break;
		}
	}
};
mxUndoManager.prototype.undoableEditHappened = function(undoableEdit) {
	this.trim();
	if (this.size > 0 && this.size == this.history.length) {
		this.history.shift();
	}
	this.history.push(undoableEdit);
	this.indexOfNextAdd = this.history.length;
	this.fireEvent(new mxEventObject(mxEvent.ADD, 'edit', undoableEdit));
};
mxUndoManager.prototype.trim = function() {
	if (this.history.length > this.indexOfNextAdd) {
		var edits = this.history.splice(this.indexOfNextAdd, this.history.length - this.indexOfNextAdd);
		for (var i = 0; i < edits.length; i++) {
			edits[i].die();
		}
	}
};
function mxPath(format) {
	this.format = format;
	this.path = [];
	this.translate = new mxPoint(0, 0);
};
mxPath.prototype.format = null;
mxPath.prototype.translate = null;
mxPath.prototype.path = null;
mxPath.prototype.isVml = function() {
	return this.format == 'vml';
};
mxPath.prototype.getPath = function() {
	return this.path.join('');
};
mxPath.prototype.setTranslate = function(x, y) {
	this.translate = new mxPoint(x, y);
};
mxPath.prototype.moveTo = function(x, y) {
	if (this.isVml()) {
		this.path.push('m ', Math.floor(this.translate.x + x), ' ', Math.floor(this.translate.y + y), ' ');
	} else {
		this.path.push('M ', Math.floor(this.translate.x + x), ' ', Math.floor(this.translate.y + y), ' ');
	}
};
mxPath.prototype.lineTo = function(x, y) {
	if (this.isVml()) {
		this.path.push('l ', Math.floor(this.translate.x + x), ' ', Math.floor(this.translate.y + y), ' ');
	} else {
		this.path.push('L ', Math.floor(this.translate.x + x), ' ', Math.floor(this.translate.y + y), ' ');
	}
};
mxPath.prototype.quadTo = function(x1, y1, x, y) {
	if (this.isVml()) {
		this.path.push('qb ', Math.floor(this.translate.x + x1), ' ', Math.floor(this.translate.y + y1), ' ', Math.floor(this.translate.x + x), ' ', Math.floor(this.translate.y + y), ' l ', Math.floor(this.translate.x + x), ' ', Math.floor(this.translate.y + y), ' ');
	} else {
		this.path.push('Q ', (this.translate.x + x1), ' ', (this.translate.y + y1), ' ', (this.translate.x + x), ' ', (this.translate.y + y), ' ');
	}
};
mxPath.prototype.curveTo = function(x1, y1, x2, y2, x, y) {
	if (this.isVml()) {
		this.path.push('c ', Math.floor(this.translate.x + x1), ' ', Math.floor(this.translate.y + y1), ' ', Math.floor(this.translate.x + x2), ' ', Math.floor(this.translate.y + y2), ' ', Math.floor(this.translate.x + x), ' ', Math.floor(this.translate.y + y), ' ');
	} else {
		this.path.push('C ', (this.translate.x + x1), ' ', (this.translate.y + y1), ' ', (this.translate.x + x2), ' ', (this.translate.y + y2), ' ', (this.translate.x + x), ' ', (this.translate.y + y), ' ');
	}
};
mxPath.prototype.write = function(string) {
	this.path.push(string, ' ');
};
mxPath.prototype.end = function() {
	if (this.format == 'vml') {
		this.path.push('e');
	}
};
mxPath.prototype.close = function() {
	if (this.format == 'vml') {
		this.path.push('x e');
	} else {
		this.path.push('Z');
	}
};
function mxPopupMenu(factoryMethod) {
	this.factoryMethod = factoryMethod;
};
mxPopupMenu.prototype.submenuImage = mxClient.imageBasePath + '/submenu.gif';
mxPopupMenu.prototype.zIndex = 10006;
mxPopupMenu.prototype.factoryMethod = true;
mxPopupMenu.prototype.useLeftButtonForPopup = false;
mxPopupMenu.prototype.enabled = true;
mxPopupMenu.prototype.itemCount = 0;
mxPopupMenu.prototype.init = function() {
	this.table = document.createElement('table');
	this.table.className = 'mxPopupMenu';
	this.tbody = document.createElement('tbody');
	this.table.appendChild(this.tbody);
	this.div = document.createElement('div');
	this.div.className = 'mxPopupMenu';
	this.div.style.display = 'inline';
	this.div.style.zIndex = this.zIndex;
	this.div.appendChild(this.table);
	if (!true && mxClient.MENU_SHADOWS) {
		this.shadow = document.createElement('div');
		this.shadow.className = 'mxPopupMenuShadow';
		this.shadow.style.zIndex = this.zIndex - 1;
		mxUtils.setOpacity(this.shadow, 70);
	} else if (true && !mxClient.MENU_SHADOWS) {
		this.div.style.filter = '';
	}
	mxEvent.disableContextMenu(this.div);
};
mxPopupMenu.prototype.isEnabled = function() {
	return this.enabled;
};
mxPopupMenu.prototype.setEnabled = function(enabled) {
	this.enabled = enabled;
};
mxPopupMenu.prototype.isPopupTrigger = function(me) {
	return me.isPopupTrigger() || (this.useLeftButtonForPopup && mxEvent.isLeftMouseButton(me.getEvent()));
};
mxPopupMenu.prototype.addItem = function(title, image, funct, parent) {
	parent = parent || this;
	this.itemCount++;
	var tr = document.createElement('tr');
	tr.className = 'mxPopupMenuItem';
	var col1 = document.createElement('td');
	col1.className = 'mxPopupMenuIcon';
	if (image != null) {
		var img = document.createElement('img');
		if (!true) {
			if (this.loading == null) {
				this.loading = 0;
			}
			this.loading++;
			var loader = mxUtils.bind(this,
			function() {
				mxEvent.removeListener(img, 'load', loader);
				this.loading--;
				if (this.loading == 0) {
					this.showShadow();
				}
			});
			mxEvent.addListener(img, 'load', loader);
		}
		img.src = image;
		col1.appendChild(img);
	}
	tr.appendChild(col1);
	var col2 = document.createElement('td');
	col2.className = 'mxPopupMenuItem';
	mxUtils.write(col2, title);
	col2.align = 'left';
	tr.appendChild(col2);
	var col3 = document.createElement('td');
	col3.style.width = '10px';
	col3.style.paddingRight = '6px';
	tr.appendChild(col3);
	if (parent.div == null) {
		this.createSubmenu(parent);
	}
	parent.tbody.appendChild(tr);
	var md = (mxClient.IS_TOUCH) ? 'touchstart': 'mousedown';
	var mm = (mxClient.IS_TOUCH) ? 'touchmove': 'mousemove';
	var mu = (mxClient.IS_TOUCH) ? 'touchend': 'mouseup';
	mxEvent.addListener(tr, md, mxUtils.bind(this,
	function(evt) {
		this.eventReceiver = tr;
		if (parent.activeRow != tr && parent.activeRow != parent) {
			if (parent.activeRow != null && parent.activeRow.div.parentNode != null) {
				this.hideSubmenu(parent);
			}
			if (tr.div != null) {
				this.showSubmenu(parent, tr);
				parent.activeRow = tr;
			}
		}
		mxEvent.consume(evt);
	}));
	mxEvent.addListener(tr, mm, mxUtils.bind(this,
	function(evt) {
		if (parent.activeRow != tr && parent.activeRow != parent) {
			if (parent.activeRow != null && parent.activeRow.div.parentNode != null) {
				this.hideSubmenu(parent);
			}
		}
		if (true) {
			tr.style.backgroundColor = '#000066';
			tr.style.color = 'white';
		}
	}));
	mxEvent.addListener(tr, mu, mxUtils.bind(this,
	function(evt) {
		if (this.eventReceiver == tr) {
			if (parent.activeRow != tr) {
				this.hideMenu();
			}
			if (funct != null) {
				funct(evt);
			}
		}
		this.eventReceiver = null;
		mxEvent.consume(evt);
	}));
	if (true) {
		mxEvent.addListener(tr, 'mouseout', mxUtils.bind(this,
		function(evt) {
			tr.style.backgroundColor = '';
			tr.style.color = '';
		}));
	}
	return tr;
};
mxPopupMenu.prototype.createSubmenu = function(parent) {
	parent.table = document.createElement('table');
	parent.table.className = 'mxPopupMenu';
	parent.tbody = document.createElement('tbody');
	parent.table.appendChild(parent.tbody);
	parent.div = document.createElement('div');
	parent.div.className = 'mxPopupMenu';
	parent.div.style.position = 'absolute';
	parent.div.style.display = 'inline';
	parent.div.appendChild(parent.table);
	var img = document.createElement('img');
	img.setAttribute('src', this.submenuImage);
	td = parent.firstChild.nextSibling.nextSibling;
	td.appendChild(img);
};
mxPopupMenu.prototype.showSubmenu = function(parent, row) {
	if (row.div != null) {
		row.div.style.left = (parent.div.offsetLeft + row.offsetLeft + row.offsetWidth - 1) + 'px';
		row.div.style.top = (parent.div.offsetTop + row.offsetTop) + 'px';
		document.body.appendChild(row.div);
		var left = parseInt(row.div.offsetLeft);
		var width = parseInt(row.div.offsetWidth);
		var b = document.body;
		var d = document.documentElement;
		var right = (b.scrollLeft || d.scrollLeft) + (b.clientWidth || d.clientWidth);
		if (left + width > right) {
			row.div.style.left = (parent.div.offsetLeft - width + ((true) ? 6 : -6)) + 'px';
		}
		mxUtils.fit(row.div);
	}
};
mxPopupMenu.prototype.addSeparator = function(parent) {
	parent = parent || this;
	var tr = document.createElement('tr');
	var col1 = document.createElement('td');
	col1.className = 'mxPopupMenuIcon';
	col1.style.padding = '0 0 0 0px';
	tr.appendChild(col1);
	var col2 = document.createElement('td');
	col2.style.padding = '0 0 0 0px';
	col2.setAttribute('colSpan', '2');
	var hr = document.createElement('hr');
	hr.setAttribute('size', '1');
	col2.appendChild(hr);
	tr.appendChild(col2);
	parent.tbody.appendChild(tr);
};
mxPopupMenu.prototype.popup = function(x, y, cell, evt) {
	if (this.div != null && this.tbody != null && this.factoryMethod != null) {
		this.div.style.left = x + 'px';
		this.div.style.top = y + 'px';
		while (this.tbody.firstChild != null) {
			mxEvent.release(this.tbody.firstChild);
			this.tbody.removeChild(this.tbody.firstChild);
		}
		this.itemCount = 0;
		this.factoryMethod(this, cell, evt);
		if (this.itemCount > 0) {
			this.showMenu();
		}
	}
};
mxPopupMenu.prototype.isMenuShowing = function() {
	return this.div != null && this.div.parentNode == document.body;
};
mxPopupMenu.prototype.showMenu = function() {
	document.body.appendChild(this.div);
	mxUtils.fit(this.div);
	if (this.shadow != null) {
		if (!this.loading) {
			this.showShadow();
		}
	}
};
mxPopupMenu.prototype.showShadow = function() {
	if (this.shadow != null && this.div.parentNode == document.body) {
		this.shadow.style.left = (parseInt(this.div.style.left) + 3) + 'px';
		this.shadow.style.top = (parseInt(this.div.style.top) + 3) + 'px';
		this.shadow.style.width = this.div.offsetWidth + 'px';
		this.shadow.style.height = this.div.offsetHeight + 'px';
		document.body.appendChild(this.shadow);
	}
};
mxPopupMenu.prototype.hideMenu = function() {
	if (this.div != null) {
		if (this.div.parentNode != null) {
			this.div.parentNode.removeChild(this.div);
		}
		if (this.shadow != null) {
			if (this.shadow.parentNode != null) {
				this.shadow.parentNode.removeChild(this.shadow);
			}
		}
		this.hideSubmenu(this);
	}
};
mxPopupMenu.prototype.hideSubmenu = function(parent) {
	if (parent.activeRow != null) {
		this.hideSubmenu(parent.activeRow);
		if (parent.activeRow.div.parentNode != null) {
			parent.activeRow.div.parentNode.removeChild(parent.activeRow.div);
		}
		parent.activeRow = null;
	}
};
mxPopupMenu.prototype.destroy = function() {
	if (this.div != null) {
		mxEvent.release(this.div);
		if (this.div.parentNode != null) {
			this.div.parentNode.removeChild(this.div);
		}
		this.div = null;
	}
	if (this.shadow != null) {
		mxEvent.release(this.shadow);
		if (this.shadow.parentNode != null) {
			this.shadow.parentNode.removeChild(this.shadow);
		}
		this.shadow = null;
	}
};
function mxAutoSaveManager(graph) {
	this.changeHandler = mxUtils.bind(this,
	function(sender, evt) {
		if (this.isEnabled()) {
			this.graphModelChanged(evt.getProperty('changes'));
		}
	});
	this.setGraph(graph);
};
mxAutoSaveManager.prototype = new mxEventSource();
mxAutoSaveManager.prototype.constructor = mxAutoSaveManager;
mxAutoSaveManager.prototype.graph = null;
mxAutoSaveManager.prototype.autoSaveDelay = 10;
mxAutoSaveManager.prototype.autoSaveThrottle = 2;
mxAutoSaveManager.prototype.autoSaveThreshold = 5;
mxAutoSaveManager.prototype.ignoredChanges = 0;
mxAutoSaveManager.prototype.lastSnapshot = 0;
mxAutoSaveManager.prototype.enabled = true;
mxAutoSaveManager.prototype.changeHandler = null;
mxAutoSaveManager.prototype.isEnabled = function() {
	return this.enabled;
};
mxAutoSaveManager.prototype.setEnabled = function(value) {
	this.enabled = value;
};
mxAutoSaveManager.prototype.setGraph = function(graph) {
	if (this.graph != null) {
		this.graph.getModel().removeListener(this.changeHandler);
	}
	this.graph = graph;
	if (this.graph != null) {
		this.graph.getModel().addListener(mxEvent.CHANGE, this.changeHandler);
	}
};
mxAutoSaveManager.prototype.save = function() {};
mxAutoSaveManager.prototype.graphModelChanged = function(changes) {
	var now = new Date().getTime();
	var dt = (now - this.lastSnapshot) / 1000;
	if (dt > this.autoSaveDelay || (this.ignoredChanges >= this.autoSaveThreshold && dt > this.autoSaveThrottle)) {
		this.save();
		this.reset();
	} else {
		this.ignoredChanges++;
	}
};
mxAutoSaveManager.prototype.reset = function() {
	this.lastSnapshot = new Date().getTime();
	this.ignoredChanges = 0;
};
mxAutoSaveManager.prototype.destroy = function() {
	this.setGraph(null);
};
function mxAnimation(delay) {
	this.delay = (delay != null) ? delay: 20;
};
mxAnimation.prototype = new mxEventSource();
mxAnimation.prototype.constructor = mxAnimation;
mxAnimation.prototype.delay = null;
mxAnimation.prototype.thread = null;
mxAnimation.prototype.startAnimation = function() {
	if (this.thread == null) {
		this.thread = window.setInterval(mxUtils.bind(this, this.updateAnimation), this.delay);
	}
};
mxAnimation.prototype.updateAnimation = function() {
	this.fireEvent(new mxEventObject(mxEvent.EXECUTE));
};
mxAnimation.prototype.stopAnimation = function() {
	if (this.thread != null) {
		window.clearInterval(this.thread);
		this.thread = null;
		this.fireEvent(new mxEventObject(mxEvent.DONE));
	}
};
function mxMorphing(graph, steps, ease, delay) {
	mxAnimation.call(this, delay);
	this.graph = graph;
	this.steps = (steps != null) ? steps: 6;
	this.ease = (ease != null) ? ease: 1.5;
};
mxMorphing.prototype = new mxAnimation();
mxMorphing.prototype.constructor = mxMorphing;
mxMorphing.prototype.graph = null;
mxMorphing.prototype.steps = null;
mxMorphing.prototype.step = 0;
mxMorphing.prototype.ease = null;
mxMorphing.prototype.cells = null;
mxMorphing.prototype.updateAnimation = function() {
	var move = new mxCellStatePreview(this.graph);
	if (this.cells != null) {
		for (var i = 0; i < this.cells.length; i++) {
			this.animateCell(cells[i], move, false);
		}
	} else {
		this.animateCell(this.graph.getModel().getRoot(), move, true);
	}
	this.show(move);
	if (move.isEmpty() || this.step++>=this.steps) {
		this.stopAnimation();
	}
};
mxMorphing.prototype.show = function(move) {
	move.show();
};
mxMorphing.prototype.animateCell = function(cell, move, recurse) {
	var state = this.graph.getView().getState(cell);
	var delta = null;
	if (state != null) {
		delta = this.getDelta(state);
		if (this.graph.getModel().isVertex(cell) && (delta.x != 0 || delta.y != 0)) {
			var translate = this.graph.view.getTranslate();
			var scale = this.graph.view.getScale();
			delta.x += translate.x * scale;
			delta.y += translate.y * scale;
			move.moveState(state, -delta.x / this.ease, -delta.y / this.ease);
		}
	}
	if (recurse && !this.stopRecursion(state, delta)) {
		var childCount = this.graph.getModel().getChildCount(cell);
		for (var i = 0; i < childCount; i++) {
			this.animateCell(this.graph.getModel().getChildAt(cell, i), move, recurse);
		}
	}
};
mxMorphing.prototype.stopRecursion = function(state, delta) {
	return delta != null && (delta.x != 0 || delta.y != 0);
};
mxMorphing.prototype.getDelta = function(state) {
	var origin = this.getOriginForCell(state.cell);
	var translate = this.graph.getView().getTranslate();
	var scale = this.graph.getView().getScale();
	var current = new mxPoint(state.x / scale - translate.x, state.y / scale - translate.y);
	return new mxPoint((origin.x - current.x) * scale, (origin.y - current.y) * scale);
};
mxMorphing.prototype.getOriginForCell = function(cell) {
	var result = null;
	if (cell != null) {
		result = this.getOriginForCell(this.graph.getModel().getParent(cell));
		var geo = this.graph.getCellGeometry(cell);
		if (geo != null) {
			result.x += geo.x;
			result.y += geo.y;
		}
	}
	if (result == null) {
		var t = this.graph.view.getTranslate();
		result = new mxPoint( - t.x, -t.y);
	}
	return result;
};
