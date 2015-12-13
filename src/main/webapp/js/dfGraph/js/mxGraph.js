function Navigater(){
	var ua = navigator.userAgent.toLowerCase();
	if (ua.indexOf("msie")!=-1)Navigater.ie = true;
	if (ua.indexOf("firefox")!=-1)Navigater.firefox = true;
	if (ua.indexOf("opera")!=-1)Navigater.opera = true;
	if (ua.indexOf("safari")!=-1)Navigater.safari = true;
	if (ua.indexOf("chrome")!=-1)Navigater.chrome = true;
};Navigater();
if(Navigater.firefox){
	//alert("firefox");
	document.write("<script src='"+mxMxGraphPath+"mxGraph/mxGraphAll.ff.20100628.js'></script>");
}else if(Navigater.chrome){
	document.write("<script src='"+mxMxGraphPath+"mxGraph/mxGraphAll.ff.20100628.js'></script>");
}
else if(Navigater.ie){
	//alert("IE");
	document.write("<script src='"+mxMxGraphPath+"mxGraph/mxGraphAll.i6.20100705.js'></script>");
	/*
	var path = mxMxGraphPath + "mxGraph/mxGraphAll.i6.20100705/";
	document.write("<script src='"+path+"1_mxClient.js'></script>");
	document.write("<script src='"+path+"2_Util.js'></script>");
	document.write("<script src='"+path+"3_Shape.js'></script>");
	document.write("<script src='"+path+"4_Layout.js'></script>");
	document.write("<script src='"+path+"5_Model.js'></script>");
	document.write("<script src='"+path+"6_View.js'></script>");
	document.write("<script src='"+path+"7_Handler.js'></script>");
	document.write("<script src='"+path+"8_Editor.js'></script>");
	document.write("<script src='"+path+"9_Io.js'></script>");
	*/
}