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
	
	editor.createTasks = function(div) {
		var off = 30;
		
		if (this.graph != null)
		{
			mxUtils.para(div,  "任务组:" + jobFlowName);
			//mxUtils.br(div);
			mxUtils.para(div,  "id:" + jobFlowId);
		}
	};
	editor.showTasks();
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
	//_addTool(editor, graph, toolbar, mxBasePath+"/images/cut.gif", "cut");
	//_addTool(editor, graph, toolbar, mxBasePath+"/images/copy.gif", "copy");
	//_addTool(editor, graph, toolbar, mxBasePath+"/images/paste.gif", "paste");
	//toolbar.addSeparator(mxBasePath+"/images/separator.gif");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/fit.gif", "fit", "最大化");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/zoomactual.gif", "actualSize", "默认大小");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/zoomout.gif", "zoomOut", "放大");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/zoomin.gif", "zoomIn", "缩小");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/zoom.gif", "zoom", "显示比例");
	toolbar.addSeparator(mxBasePath+"/images/separator.gif");
	_addTool(editor, graph, toolbar, mxBasePath+"/images/classic_start.gif", "back", "后退");
}
	
//添加单个工具
function _addTool(editor, graph, toolbar, image, action, tooltip){
	var funct = function(evt){
		if(action == "undo"){
			editor.undo();
			//alert(editor.undoManager.indexOfNextAdd);
		}
		editor.execute(action);
	};
	var img = toolbar.addMode(tooltip, image);
	mxEvent.addListener(img, 'click', funct);
}

var xml;

//添加用户自定义的序列化方法
function addUserActions(editor, graph){
	var back = function(editor, cell) {
		history.back();
	};
	
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
	graph.setConnectable(false);
	graph.setMultigraph(false);
	graph.setTooltips(true);
	graph.setPanning(true);
	graph.setCellsResizable(false);
	
	vertexLable(graph);
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
	//mouseEventMxGraph(graph);
	//keyEventMxGraph(graph);
}


 
 
 
 
 
 
 

