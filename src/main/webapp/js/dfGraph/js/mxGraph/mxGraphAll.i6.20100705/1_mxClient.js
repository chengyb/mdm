var mxClient = {
	VERSION: '1.4.0.4',
	IS_IE: navigator.userAgent.indexOf('MSIE') >= 0,
	IS_IE6: navigator.userAgent.indexOf('MSIE 6') >= 0,
	IS_NS: navigator.userAgent.indexOf('Mozilla/') >= 0 && navigator.userAgent.indexOf('MSIE') < 0,
	IS_OP: navigator.userAgent.indexOf('Opera/') >= 0,
	IS_OT: navigator.userAgent.indexOf('Presto/2.4') < 0 && navigator.userAgent.indexOf('Presto/2.3') < 0 && navigator.userAgent.indexOf('Presto/2.2') < 0 && navigator.userAgent.indexOf('Presto/2.1') < 0 && navigator.userAgent.indexOf('Presto/2.0') < 0 && navigator.userAgent.indexOf('Presto/1') < 0,
	IS_SF: navigator.userAgent.indexOf('AppleWebKit/') >= 0 && navigator.userAgent.indexOf('Chrome/') < 0,
	IS_GC: navigator.userAgent.indexOf('Chrome/') >= 0,
	IS_MT: (navigator.userAgent.indexOf('Firefox/') >= 0 && navigator.userAgent.indexOf('Firefox/1') < 0 && navigator.userAgent.indexOf('Firefox/2') < 0) || (navigator.userAgent.indexOf('Iceweasel/') >= 0 && navigator.userAgent.indexOf('Iceweasel/1') < 0 && navigator.userAgent.indexOf('Iceweasel/2') < 0) || (navigator.userAgent.indexOf('SeaMonkey/') >= 0 && navigator.userAgent.indexOf('SeaMonkey/1') < 0) || (navigator.userAgent.indexOf('Iceape/') >= 0 && navigator.userAgent.indexOf('Iceape/1') < 0),
	IS_SVG: navigator.userAgent.indexOf('Firefox/') >= 0 || navigator.userAgent.indexOf('Iceweasel/') >= 0 || navigator.userAgent.indexOf('Seamonkey/') >= 0 || navigator.userAgent.indexOf('Iceape/') >= 0 || navigator.userAgent.indexOf('Galeon/') >= 0 || navigator.userAgent.indexOf('Epiphany/') >= 0 || navigator.userAgent.indexOf('AppleWebKit/') >= 0 || navigator.userAgent.indexOf('Gecko/') >= 0 || navigator.userAgent.indexOf('Opera/') >= 0,
	NO_FO: navigator.userAgent.indexOf('Firefox/1') >= 0 || navigator.userAgent.indexOf('Iceweasel/1') >= 0 || navigator.userAgent.indexOf('Firefox/2') >= 0 || navigator.userAgent.indexOf('Iceweasel/2') >= 0 || navigator.userAgent.indexOf('SeaMonkey/1') >= 0 || navigator.userAgent.indexOf('Iceape/1') >= 0 || navigator.userAgent.indexOf('Camino/1') >= 0 || navigator.userAgent.indexOf('Epiphany/2') >= 0 || navigator.userAgent.indexOf('Opera/') >= 0 || navigator.userAgent.indexOf('Mozilla/2') >= 0,
	IS_VML: navigator.appName.toUpperCase() == 'MICROSOFT INTERNET EXPLORER',
	IS_MAC: navigator.userAgent.toUpperCase().indexOf('MACINTOSH') > 0,
	IS_TOUCH: navigator.userAgent.toUpperCase().indexOf('IPAD') > 0,
	IS_LOCAL: document.location.href.indexOf('http://') < 0 && document.location.href.indexOf('https://') < 0,
	WINDOW_SHADOWS: true,
	TOOLTIP_SHADOWS: true,
	MENU_SHADOWS: true,
	isBrowserSupported: function() {
		return true || false;
	},
	link: function(rel, href, doc) {
		doc = doc || document;
		if (true) {
			doc.write('<link rel="' + rel + '" href="' + href + '" charset="ISO-8859-1" type="text/css"/>');
		} else {
			var link = doc.createElement('link');
			link.setAttribute('rel', rel);
			link.setAttribute('href', href);
			link.setAttribute('charset', 'ISO-8859-1');
			link.setAttribute('type', 'text/css');
			var head = doc.getElementsByTagName('head')[0];
			head.appendChild(link);
		}
	},
	include: function(src) {
		document.write('<script src="' + src + '"></script>');
	},
	unload: function() {
		mxEvent.release(document.documentElement);
		mxEvent.release(window);
	}
};
if (typeof(mxBasePath) != 'undefined' && mxBasePath.length > 0) {
	if (mxBasePath.substring(mxBasePath.length - 1) == '/') {
		mxBasePath = mxBasePath.substring(0, mxBasePath.length - 1);
	}
	mxClient.basePath = mxBasePath;
} else {
	mxClient.basePath = '.';
}
if (typeof(mxImageBasePath) != 'undefined' && mxImageBasePath.length > 0) {
	if (mxImageBasePath.substring(mxImageBasePath.length - 1) == '/') {
		mxImageBasePath = mxImageBasePath.substring(0, mxImageBasePath.length - 1);
	}
	mxClient.imageBasePath = mxImageBasePath;
} else {
	mxClient.imageBasePath = mxClient.basePath + '/images';
}
if (typeof(mxLanguage) != 'undefined') {
	mxClient.language = mxLanguage;
} else {
	mxClient.language = (true) ? navigator.userLanguage: navigator.language;
	var dash = mxClient.language.indexOf('-');
	if (dash > 0) {
		mxClient.language = mxClient.language.substring(0, dash);
	}
}
mxClient.link('stylesheet', mxClient.basePath + '/css/common.css');
if (true) {
	document.namespaces.add('v', 'urn:schemas-microsoft-com:vml');
	document.namespaces.add('o', 'urn:schemas-microsoft-com:office:office');
	mxClient.link('stylesheet', mxClient.basePath + '/css/explorer.css');
}
