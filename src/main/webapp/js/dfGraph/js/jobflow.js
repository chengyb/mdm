/********************************************************************
 Editor部分 
 ********************************************************************/

//从dom里取一个节点作为graph的容器，如果没有的话就新建一个。
function createGraphContainer(id){
	var container = null;
	if(id != null){
		//从既有的dom节点里选一个节点。
		container = document.getElementById(id);
	}else{
		//如果是自己创建容器，需要设定样式。
		container = document.createElement('div');
		container.style.position = 'absolute';
		container.style.overflow = 'hidden';
		container.style.padding = '2px';
		container.style.left = '0px';
		container.style.top = '0px';
		container.style.right = '0px';
		container.style.bottom = '0px';
		if (mxClient.IS_IE){new mxDivResizer(container);}
		document.body.appendChild(container);
	}
	return container;
}

//创建编辑器
function createEditor(graphContainer){
	var editor = new mxEditor();
	editor.setGraphContainer(graphContainer);
	editor.createGraph();
	return editor;
}



/********************************************************************
 toolbar部分（上面横着的那个工具栏叫toolbar，左边的那个工具栏叫nodebar） 
 ********************************************************************/
 
//创建工具栏的容器
function createToolbarContainer(){
	var container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.overflow = 'hidden';
	container.style.padding = '2px';
	container.style.top = '0px';
	container.style.left = '0px';
	container.style.right = '0px';
	container.style.height = '32px';
	container.style.background = "url('" + mxBasePath + "/images/toolbar.gif')";
	document.body.appendChild(container);
	if (mxClient.IS_IE){new mxDivResizer(container);}
	return container;
}
	
//在工具栏容器里创建一个工具栏对象
function createToolbar(container){
	var toolbar = new mxToolbar(container);
	toolbar.enabled = false;
	return toolbar;
}
	
//添加所有的编辑工具
function addAllTools(editor, graph, toolbar){
	_addTool(editor, graph, toolbar, mxBasePath+"/images/save.gif", "serialize");
	//toolbar.addSeparator(mxBasePath+"/images/separator.gif");
	//_addTool(editor, graph, toolbar, mxBasePath+"/images/undo.gif", "undo");
	//_addTool(editor, graph, toolbar, mxBasePath+"/images/redo.gif", "redo");
	//toolbar.addSeparator( mxBasePath+"/images/separator.gif");
	//_addTool(editor, graph, toolbar, mxBasePath+"/images/cut.gif", "cut");
	//_addTool(editor, graph, toolbar, mxBasePath+"/images/copy.gif", "copy");
	//_addTool(editor, graph, toolbar, mxBasePath+"/images/paste.gif", "paste");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/delete.gif", "delete");
	toolbar.addSeparator(mxBasePath+"/images/separator.gif");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/fit.gif", "fit");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/zoomactual.gif", "actualSize");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/zoomout.gif", "zoomOut");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/zoomin.gif", "zoomIn");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/zoom.gif", "zoom");
	toolbar.addSeparator(mxBasePath+"/images/separator.gif");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/classic_start.gif", "back");
}
	
//添加单个工具
function _addTool(editor, graph, toolbar, image, action){
	var funct = function(evt){
		if(action == "undo"){
			editor.undo();
			//alert(editor.undoManager.indexOfNextAdd);
		}
		editor.execute(action);
	};
	var img = toolbar.addMode("tooltip", image);
	mxEvent.addListener(img, 'click', funct);
}

var xml;

//添加用户自定义的序列化方法
function addUserActions(editor, graph){
	//序列化方法（保存）
	var serialize = function(editor, cell){
		var graph = editor.graph;
		var encoder = new mxCodec();
		var node = encoder.encode(graph.getModel());
		xml = mxUtils.getPrettyXml(node);
		//alert(xml);
		$("#name").val(dataFlowName);
		$("#priority").val(priority);
		if(dataFlowName != ''){
			$("#name").attr('disabled','disabled');
		}
		$('#dialog-form').dialog('open');
	};
	
	var back = function(editor, cell){
		history.back();
	};
	
	editor.addAction("serialize", serialize);
	editor.addAction("back", back);
	//editor.addAction("unserialize", unserialize);
}

//编辑栏 main 函数
function toolbarMain(editor){
	var graph = editor.graph;
	var container = createToolbarContainer();
	var toolbar = createToolbar(container);
	addUserActions(editor, graph);
	addAllTools(editor, graph, toolbar);
}

	
	
/********************************************************************
 graph部分，graph对象在editor里创建，这里只是配置方法。
 ********************************************************************/
 
//配置graph对象的属性（通过graph自己的方法）
function configMxGraph(graph){
	graph.gridSize = 20;
	graph.edgeLabelsMovable = false;
	graph.htmlLabels = true;

	//graph.setResizeContainer(true);
	//graph.setEnabled(false);
	//graph.setBackgroundImage(new mxImage('images/gradient_background.jpg', 360, 200));
	//graph.maximumGraphBounds = new mxRectangle(0, 0, 360, 200);
	graph.setAutoSizeCells(false);
	graph.setConnectable(true);
	graph.setMultigraph(false);
	graph.setTooltips(true);
	graph.setPanning(true);
	graph.setCellsResizable(false);
	//graph.panningHandler.useLeftButtonForPanning = true;
	
	//设置删除的操作，对原有方法进行扩展
//	graph.getModel().cellRemoved = function (cell) {
//    	if (cell != null && this.cells != null) {
//        	var childCount = this.getChildCount(cell);
//        	for (var i = childCount - 1; i >= 0; i--) {
//            	this.cellRemoved(this.getChildAt(cell, i));
//        	}
//        	if (this.cells != null && cell.getId() != null) {
//            	delete this.cells[cell.getId()];
//            	//去服务端删除缓存
//            	$.ajax({
//					url: delNodeActionUrl,
//					type: "POST",
//					cache: false,
//					data: {
//						"delNodeId" : cell.getId()
//					}
//        		});
//        	}
//    	}
//	};
}

//配置graph对象的属性（通过handler给graph添加额外的特性）
function handleMxGraph(graph){
	new mxRubberband(graph);
	new mxCellTracker(graph, '#00FF00');
}
	
//给graph对象添加鼠标事件监听器
function mouseEventMxGraph(graph){
	graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt){
		var cell = evt.getProperty('cell');
		if(cell != null && cell.isEdge()){
			var obj = new Object();
			window.showModalDialog(toLinkEditPath + "?id=" + cell.id + "&contextId=" + contextId, obj, "dialogWidth=500px;dialogHeight=200px;resizable=yes;status=no;location=no;titlebar=no");
			evt.consume();
		}
	});
}

//给graph对象添加批量删除监听器
function removeCellsEventMxGraph(graph) {
	graph.addListener(mxEvent.REMOVE_CELLS, function(sender, evt){
		var cells = evt.getProperty('cells');
		if (cells != null) {
			for (var i = 0; i < cells.length; i++) {
				var cell = cells[i];
				//去服务端删除缓存
	        	$.ajax({
					url: delNodeActionUrl,
					async : false,
					type: "POST",
					cache: false,
					data: {
						"delNodeId" : cell.getId()
					}
	    		});
			}
    	}
	});
}

//键盘事件
function keyEventMxGraph(graph){
	var keyHandler = new mxKeyHandler(graph);
	keyHandler.enter = function() {};
	keyHandler.bindKey(8, function(){graph.foldCells(true);});
	keyHandler.bindKey(13, function(){graph.foldCells(false);});
	keyHandler.bindKey(33, function(){graph.exitGroup();});
	keyHandler.bindKey(34, function(){graph.enterGroup();});
	keyHandler.bindKey(36, function(){graph.home();});
	keyHandler.bindKey(35, function(){graph.refresh();});
	keyHandler.bindKey(37, function(){graph.selectPreviousCell();});
	keyHandler.bindKey(38, function(){graph.selectParentCell();});
	keyHandler.bindKey(39, function(){graph.selectNextCell();});
	keyHandler.bindKey(40, function(){graph.selectChildCell();});
	keyHandler.bindKey(46, function(){graph.removeCells();});
	keyHandler.bindKey(107, function(){graph.zoomIn();});
	keyHandler.bindKey(109, function(){graph.zoomOut();});
	keyHandler.bindKey(113, function(){graph.startEditingAtCell();});
	keyHandler.bindControlKey(65, function(){graph.selectAll();});
	keyHandler.bindControlKey(89, function(){history.redo();});
	keyHandler.bindControlKey(90, function(){history.undo();});
	keyHandler.bindControlKey(88, function(){mxClipboard.cut(graph);});
	keyHandler.bindControlKey(67, function(){mxClipboard.copy(graph);});
	keyHandler.bindControlKey(86, function(){mxClipboard.paste(graph);});
	keyHandler.bindControlKey(71, function(){graph.setSelectionCell(graph.groupCells(null, 20));});
	keyHandler.bindControlKey(85, function(){graph.setSelectionCells(graph.ungroupCells());});
}
	
//配置部分 main 函数
function configGraphMain(graph){
 	configMxGraph(graph);
	handleMxGraph(graph);
	mouseEventMxGraph(graph);
	keyEventMxGraph(graph);
	removeCellsEventMxGraph(graph);
}


 
 /********************************************************************
 nodebar部分（上面横着的那个工具栏叫toolbar，左边的那个工具栏叫nodebar） 
 ********************************************************************/
 
//创建节点栏的容器
function createNodebarContainer(){
	var container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.overflow = 'hidden';
	container.style.padding = '2px';
	document.body.appendChild(container);
	return container;
}
	
//将节点栏容器塞到一个窗口里
function windowNodebar(container){
	var tbWindow = new mxWindow(tool, container, 15, 40, 50, 300, true, true);
	tbWindow.setVisible(true);
	tbWindow.setMinimizable(false);
	tbWindow.setResizable(true);
}

//在节点栏容器里创建一个工具栏对象
function createNodebar(container){
	var nodebar = new mxToolbar(container);
	nodebar.enabled = false;
	return nodebar;
}
	
//添加所有的工具
function addAllNodes(graph, nodebar, nodes){
	for(var i=0; i<nodes.length; i++){
		if(nodes[i].seperator != null){
			nodebar.addLine();
		}else{
			_addNode(graph, nodebar, nodes[i]);
		}
	}
}

function _getSrc(cell, j) {
	var srcInfo = "";
	j = j == null ? 0 : j;
	if (cell.getEdgeCount() > 0) {
		for (var i = 0; i < cell.getEdgeCount(); i++) {
			var edge = cell.edges[i];
			var terminal = edge.getTerminal(true);
			if (cell.id != terminal.id) {
				if ('udf' == terminal.vertexType || 'output' == terminal.vertexType || 'unicheck' == terminal.vertexType || 'fkcheck' == terminal.vertexType) {
					srcInfo += _getSrc(terminal, j);
				} else {
					var terminalId = terminal.id;
					var terminalTitle = terminal.title;
					srcInfo += j == 0 ? terminalId + "," + terminalTitle : ";" + terminalId + "," + terminalTitle;
					j++;
				}
			}
		}
	}
	return srcInfo;
}
	
//向工具栏里添加一个图标
function _addNode(graph, nodebar, node){

	//创建一个原型
	var vertexType = mxUtils.createXmlDocument().createElement(node.vertexType);
	var prototype = new mxCell(vertexType, new mxGeometry(0, 0, node.vertexWidth, node.vertexHeight), node.vertexStyle);
	prototype.vertexTitle = node.vertexTitle;
	prototype.setVertex(true);
	prototype.vertexType = node.vertexType;
	prototype.hasOverlayTip = node.hasOverlayTip;
	if (node.hasOverlayTip == 'true') {
		var overlay = new mxCellOverlay( new mxImage(mxBasePath + '/images/overlays/pencil2.png', 16, 16), node.overlayTip);
		graph.addCellOverlay(prototype, overlay);
		overlay.addListener(mxEvent.CLICK, function(sender, evt){
			var cell = evt.getProperty("cell");
			//alert('Overlay clicked\nId:'+cell.id+"\nType:"+cell.vertexType+"\nName:"+cell.title+"\nEdgeCount:"+cell.getEdgeCount());
			var obj = new Object();
			obj.name = cell.title;
			//将当前节点的输入节点id和title传到编辑页面
			obj.srcInfo = _getSrc(cell, 0);
			obj.contextId = contextId;
			var returnValue;
			if (cell.vertexType == 'outterschedule') {
				returnValue = window.showModalDialog(rootPath+"sch/" + cell.vertexType + "NodeEdit?id=" + cell.id +"&isTemp=true", obj, "dialogWidth=800px;dialogHeight=600px;resizable=yes;status=no;location=no;titlebar=no");
			} else {
				returnValue = window.showModalDialog(rootPath+"sch/" + cell.vertexType + "NodeEdit?id=" + cell.id +"&isTemp=" + isTemp, obj, "dialogWidth=800px;dialogHeight=600px;resizable=yes;status=no;location=no;titlebar=no");
			}
			if(returnValue != null){				
				graph.cellLabelChanged(cell,returnValue);
			}
		});
	}
	
	//在工具栏添加图标
	var img = _addNodebarItem(graph, nodebar, node.iconImg, node.iconTip, prototype);
	img.enabled = true;
	
	//给节点添加约束（这个点作为src时）
	if(node.srcMin != 0 || node.srcMax != 'n'){
		graph.multiplicities.push(new mxMultiplicity(
			true, 
			mxUtils.createXmlDocument().createElement(node.vertexType).nodeName, 
			null, null, 
			node.srcMin, node.srcMax, null, 
			node.srcCntErrMsg, null)); 
	}
	//给节点添加约束（这个点作为trg时）
	if(node.trgMin != 0 || node.trgMax != 'n'){
		graph.multiplicities.push(new mxMultiplicity(
			false, 
			mxUtils.createXmlDocument().createElement(node.vertexType).nodeName, 
			null, null, 
			node.trgMin, node.trgMax, null, 
			node.trgCntErrMsg, null)); 
	}
}
				
//向toolbar添加一个image图标，用于向graph拖拽一个prototype
function _addNodebarItem(graph, nodebar, image, iconTip, prototype){

	// 当image drop到graph上时执行的函数。cell表示鼠标指着的cell。
	var funct = function(graph, evt, cell){
		graph.stopEditing(false);
		var pt = graph.getPointForEvent(evt);
		var vertex = graph.getModel().cloneCell(prototype);
		vertex.geometry.x = pt.x;
		vertex.geometry.y = pt.y;
		
		(graph.vertexIndex == null)?graph.vertexIndex=0:graph.vertexIndex++;
		vertex.title = vertex.vertexTitle + " " + graph.vertexIndex;
		graph.addCell(vertex);
		
		graph.setSelectionCell(vertex);
	};
	
	//拖拽时随鼠标显示的图形。
	var img = nodebar.addMode(iconTip, image, funct);
	
	//给img添加拖拽能力。		
	mxUtils.makeDraggable(img, graph, funct);
	
	return img;
}

//修改节点的label默认值
function vertexLable(graph){
	graph.convertValueToString = function(cell){
		if (cell.isVertex()){
			return cell.title;
		}
	};

	graph.cellLabelChanged = function(cell, newValue, autoSize){
		if(cell.isVertex()){
			cell.title = newValue;
			graph.moveCells([cell],-1,-1);
			graph.moveCells([cell],1,1);
		}
	};
}
	
//节点栏 main 函数
function nodebarMain(graph){
	var toolvarContainer = createNodebarContainer();
	windowNodebar(toolvarContainer);
	var nodebar = createNodebar(toolvarContainer);
	
	addAllNodes(graph, nodebar, nodes);
	vertexLable(graph);
}


//这里是完整的节点配置
var nodes = [
	{//scheduleJob
		iconTip:"job",
		iconImg:mxBasePath+'/icon/job_small.png',
		vertexType:'schedule',
		vertexTitle:"job title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/job.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"job node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:"只能有一个后继任务",
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:'n',
		trgCntErrMsg:"任务节点不接受输出",
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{//outter scheduleJob
		iconTip:"outterjob",
		iconImg:mxBasePath+'/icon/outterjob_small.png',
		vertexType:'outterschedule',
		vertexTitle:"outter job title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/outterjob.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"outter job node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:"只能有一个后继任务",
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:'n',
		trgCntErrMsg:"任务节点不接受输出",
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{//scheduleJobFlow
		iconTip:"jobFlow",
		iconImg:mxBasePath+'/icon/jobFlow_small.png',
		vertexType:'jobFlow',
		vertexTitle:"jobFlow title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/jobFlow.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"jobFlow node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:"只能有一个后继任务",
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:'n',
		trgCntErrMsg:"任务组节点不接受输出",
		trgTypes:null,
		trgTypeErrMsg:null
	}
];




 
 
 
 
 
 
 

