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

var validateErr;

//添加用户自定义的序列化方法
function addUserActions(editor, graph){
	//序列化方法（保存）
	var serialize = function(editor, cell){
		validateErr = null;
		var graph = editor.graph;
		validateDataFlowGraph(graph);
		var encoder = new mxCodec();
		var node = encoder.encode(graph.getModel());
		xml = mxUtils.getPrettyXml(node);
		$("#name").val(dataFlowName);
		//$('#dialog-form').dialog('open');
		$('#dim_oper_modal').show();
	};
	
	var back = function(editor, cell){
		history.back();
	};
	
	editor.addAction("serialize", serialize);
	editor.addAction("back", back);
	//editor.addAction("unserialize", unserialize);
}

function validateDataFlowGraph(graph) {
	var model = graph.model;
	var layer0 = model.getChildren(model.root)[0];
	var cells = model.getDescendants(layer0);
	if(cells == null){return;}
	for(var i=0; i<cells.length; i++){
		var node = cells[i];
		if (node.isVertex() && node.vertexType != 'event') {
			if (node.getEdgeCount() == 0) {
				validateErr = "节点" + node.title + "必须被连接";
			}
		}
	}
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
	graph.getModel().cellRemoved = function (cell) {
		if (cell != null && this.cells != null) {
	    	var childCount = this.getChildCount(cell);
	    	for (var i = childCount - 1; i >= 0; i--) {
	        	this.cellRemoved(this.getChildAt(cell, i));
	    	}
	    	if (this.cells != null && cell.getId() != null) {
	        	delete this.cells[cell.getId()];
	        	//去服务端删除缓存
	        	$.ajax({
					url: delNodeActionUrl,
					type: "POST",
					cache: false,
					data: {
						"delNodeId" : cell.getId(),
						"contextId" : contextId
					}
	    		});
	    	}
		}
	};
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
			window.showModalDialog("df/transitionEdit?id=" + cell.id + "&contextId=" + contextId, obj, "dialogWidth=350px;dialogHeight=200px;resizable=yes;status=no;location=no;titlebar=no");
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
						"delNodeId" : cell.getId(),
						"contextId" : contextId
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
//	alert($dataflowMsgs.graphTools);
	var tbWindow = new mxWindow(dataflowMsgs.graphTools, container, 15, 40, 50, 250, true, true);
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
			
			//将当前节点的输入节点id和title传到编辑页面
			obj.srcInfo = _getSrc(cell, 0);
			window.showModalDialog(basePath + "admin/df/" + cell.vertexType + "/NodeEdit?id=" + cell.id + "&contextId=" + contextId, obj, "dialogWidth=800px;dialogHeight=600px;resizable=yes;status=no;location=no;titlebar=no");
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
		
		//校验只用有一个start
		if (vertex.vertexType == 'start') {
			var model = graph.model;
			var layer0 = model.getChildren(model.root)[0];
			var cells = model.getDescendants(layer0);
			if(cells != null){
				for(var i=0; i<cells.length; i++){
					var cell = cells[i];
					if (cell.vertexType == 'start') {
						alert("start只能有一个");
						return;
					}
				}
			}
		}
		vertex.geometry.x = pt.x;
		vertex.geometry.y = pt.y;
		
		(graph.vertexIndex == null)?graph.vertexIndex=0:graph.vertexIndex++;
		vertex.title = vertex.vertexTitle + " " + graph.vertexIndex;
		graph.addCell(vertex);
		graph.setSelectionCell(vertex);
		//增加节点时先预保存
		if ('start' != vertex.vertexType && 'end' != vertex.vertexType) {
			var actUrl = basePath + "admin/df/" + vertex.vertexType + "/nodePreSave";
			$.ajax({
				url: actUrl,
				type: "POST",
				async: false,
				data: {
					"id" : vertex.id,
					"contextId" : contextId
				},
				dataType: "json",
				cache: false,
				success: function(result){
				},
				error: function(textStatus, errorThrown){
					alert("pre save error." + errorThrown);
				}
		    });
		}
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
	
	//不容许没有连接节点的线
	graph.setAllowDanglingEdges(false);
	
	//已经连接的节点不容许反向连线
	graph.validateEdge = function(edge,	source,	target) {
		var model = graph.model;
		var layer0 = model.getChildren(model.root)[0];
		var cells = model.getDescendants(layer0);
		if(cells == null){return null;}
		for(var i=0; i<cells.length; i++){
			var node = cells[i];
			if (node.isEdge()) {
				if (node.getTerminal(true) == target && node.getTerminal(false) == source) {
					return "节点间已经连线！";
				}
			}
		}
	};

	
	graph.setAllowLoops(false);
	addAllNodes(graph, nodebar, nodes);
	vertexLable(graph);
}


//这里是完整的节点配置
var nodes = [
	{//start
		iconTip:"start",
		iconImg: mxBasePath+'/icon/start_small.png',
		
		vertexType:'start',
		vertexTitle:"start",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" +  mxBasePath + "/icon/start.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'false',
		overlayTip:null,
		overlayWindow:null,
		
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:0,
		trgCntErrMsg:"start节点不接受输入",
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{//end
		iconTip:"end",
		iconImg: mxBasePath+'/icon/end_small.png',
		
		vertexType:'end',
		vertexTitle:"end",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" +  mxBasePath + "/icon/end.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'false',
		overlayTip:null,
		overlayWindow:null,
		
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:"end节点不接受输出",
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:0,
		trgCntErrMsg:null,
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{seperator:true},
	{//extract
		iconTip:"extract",
		iconImg: mxBasePath+'/icon/extract_small.png',
		
		vertexType:'extract',
		vertexTitle:"extract title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" +  mxBasePath + "/icon/extract.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"extract node detail",
		overlayWindow:null,
		
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:0,
		trgCntErrMsg:null,
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{//output
		iconTip:"output",
		iconImg:mxBasePath+'/icon/output_small.png',
		vertexType:'output',
		vertexTitle:"output title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/output.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"output node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:0,
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:1,
		trgCntErrMsg:"output节点只接受一个输入",
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{//load
		iconTip:"load",
		iconImg:mxBasePath+'/icon/load_small.png',
		vertexType:'load',
		vertexTitle:"load title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/load.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"load node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:0,
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:1,
		trgCntErrMsg:"load节点只接受一个输入",
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{//hive load
		iconTip:"hive4load",
		iconImg:mxBasePath+'/icon/hive4load_small.png',
		vertexType:'hive4load',
		vertexTitle:"hive4load title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/hive4load.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"hive4load node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:0,
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:1,
		trgCntErrMsg:"hive4load节点只接受一个输入",
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{seperator:true},
	{//parallel
		iconTip:"parallel",
		iconImg: mxBasePath+'/icon/parallel_small.png',
		
		vertexType:'parallel',
		vertexTitle:"parallel title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" +  mxBasePath + "/icon/parallel.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"parallel node detail",
		overlayWindow:null,
		
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:1,
		trgCntErrMsg:"parallel节点值接受一个输入",
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{//hive trans 
		iconTip:"hive4trans",
		iconImg:mxBasePath+'/icon/hive4trans_small.png',
		vertexType:'hive4trans',
		vertexTitle:"hive4trans title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/hive4trans.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"hive4trans node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:0,
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:1,
		trgCntErrMsg:"hive4trans节点只接受一个输入",
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{//join
		iconTip:"join",
		iconImg:mxBasePath+'/icon/join_small.png',
		vertexType:'join',
		vertexTitle:"join title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/join.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"join node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:'n',
		trgCntErrMsg:null,
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{//union
		iconTip:"union",
		iconImg:mxBasePath+'/icon/union_small.png',
		vertexType:'union',
		vertexTitle:"union title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/union.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"union node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:'n',
		trgCntErrMsg:null,
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{//group
		iconTip:"group",
		iconImg:mxBasePath+'/icon/group_small.png',
		vertexType:'group',
		vertexTitle:"group title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/group.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"group node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:1,
		trgCntErrMsg:"group节点值接受一个输入",
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{//UDF
		iconTip:"UDF",
		iconImg:mxBasePath+'/icon/udf_small.png',
		vertexType:'udf',
		vertexTitle:"UDF title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/udf.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"UDF node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:1,
		trgCntErrMsg:null,
		trgTypes:null,
		trgTypeErrMsg:null
	},
	/**
	{seperator:true},
	{//unicheck
		iconTip:"unicheck",
		iconImg:mxBasePath+'/icon/unicheck_small.png',
		vertexType:'unicheck',
		vertexTitle:"unicheck title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/unicheck.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"unicheck node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:1,
		trgCntErrMsg:"unicheck节点值接受一个输入",
		trgTypes:null,
		trgTypeErrMsg:null
	},
	{//fkcheck
		iconTip:"fkcheck",
		iconImg:mxBasePath+'/icon/fkcheck_small.png',
		vertexType:'fkcheck',
		vertexTitle:"fkcheck title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/fkcheck.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"fkcheck node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:'n',
		srcCntErrMsg:null,
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:2,
		trgMax:3,
		trgCntErrMsg:"fkcheck节点值接受两个输入",
		trgTypes:null,
		trgTypeErrMsg:null
	},
	*/
	{seperator:true},
	{//event
		iconTip:"event",
		iconImg:mxBasePath+'/icon/event_small.png',
		vertexType:'event',
		vertexTitle:"event title",
		vertexWidth:32,
		vertexHeight:32,
		vertexStyle:"shape=image;image=" + mxBasePath + "/icon/event.png;verticalLabelPosition=bottom;verticalAlign=top",
		
		hasOverlayTip:'true',
		overlayTip:"event node detail",
		overlayWindow:null,
		srcMin:0,
		srcMax:0,
		srcCntErrMsg:"event节点不接受输入",
		srcTypes:null,
		srcTypeErrMsg:null,
		trgMin:0,
		trgMax:0,
		trgCntErrMsg:"event节点不接受输出",
		trgTypes:null,
		trgTypeErrMsg:null
	}
];

var context = "";
function loadingDir(){
    $.ajax({
        url: '/eSight/admin/df/listDir',
        data: '',
        cache: false,
        async: false,
        type: "GET",
        dataType: 'json',
        success: function(result) {
            if (result.result == "success" && result.data != null) {
            	var dirs = result.data;
            	context = "<ul>";
            	for(var i=0; i<dirs.length; i++){
            		context += "<li id=\"db_" + dirs[i].dbid 
            	 		+ "\" ><span onclick='dirSubmit(\"" + dirs[i].dbid
            	 		+ "\", \"" + dirs[i].name
            	 		+ "\")'><i class=\"fa fa-lg fa-minus-circle\"></i> " + dirs[i].name + "</span>";
            		context += "<ul>";
            		context += "</ul>";
            		context += "</li>";
            	}
            	context += "</ul>";
            }
        }
    });
}

function dirSubmit(id, name){
	$("#dirName").val(name);
	$("#dirId").val(id);
	$('#tree_div').dialog('close');
}