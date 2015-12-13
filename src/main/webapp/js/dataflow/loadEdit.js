var srcInfo = window.dialogArguments.srcInfo;
var id;

$(function() {
	$("button").button();
	initActivityClassSelect();
	initPrioritySelect();
	initPlatformType();
	initPlatform();
	id = $("#id").val();
	
	$("#getSrcFeildButton").bind("click", function() {
		$("#dialog-form").dialog("open");
		return false;
	});
	//
	var buttons = {};
	buttons['确定'] = function() {
		if ($("#srcId").val() != null && $("#srcId").val().split(",").length == 2) {
			$("#src").val($("#srcId").val().split(",")[1]);
			$('#resFieldList').jqGrid("setGridParam", {
				datatype : "json",
				mtype : "GET",
				url : "loadMappingFeild",
				postData: {
					"id" : $("#id").val(),
					"srcInfo" : $("#srcId").val(),
					"loadFromSession" : false,
					"contextId" : $("#contextId").val()
				},
				jsonReader : {
					root : "feildMappings",
					repeatitems : false
				}
			});
			$('#resFieldList').trigger('reloadGrid');
		}
		$(this).dialog("close");
	};
	buttons['取消'] = function() {
		$(this).dialog("close");
	};
	
	$("#dialog-form").dialog({
		autoOpen: false,
		height: 250,
		width: 460,
		modal: true,
//		buttons: buttons,
		close: function() {
		}
	});
	
	$("#dialogClose").click(function(){
		$("#dialog-form").dialog("close");
	});
	
	if (srcInfo != null && srcInfo.length > 0) {
		$("#srcId").empty();
		var srcPairs = srcInfo.split(";");
		for (var i = 0; i < srcPairs.length; i++) {
			var srcPair = srcPairs[i].split(",");
			if (srcPair.length != 2)
				continue;
			var id = srcPair[0];
			var name = srcPair[1];
			var selected = "";
			if (name == $("#src").val())
				selected = "selected";
			$("<option value='" + srcPair + "' " + selected + ">" + name + "</option>").appendTo("#srcId");
		}
	};
	
	$("#saveSrcInfo").click(function(){
		if ($("#srcId").val() != null && $("#srcId").val().split(",").length == 2) {
			var src = $("#srcId").val().split(",")[1];
			var srcId = $("#srcId").val().split(",")[0];
			$("#src").val(src);
			$.ajax({
				url : "/eSight/admin/df/load/loadMappingFeild",
		        type: "GET",
//		        dataType: "json",
		        data :{
					"id" : id,
					"srcId" : srcId,
					"loadFromSession" : false,
					"contextId" : $("#contextId").val()
		        },
		        success: function(data){
		        },
		        error: function(){
		            alert('error');
		        }
			});
		}
		$("#dialog-form").dialog("close");
	});
});

//提交数据
function submitData() {

	//验证活动类别
	if($("#activityClass option:selected").val() == ""){
		$("#update_dim_type_note").text("必填字段");
		return;
	}else{
		$("#update_dim_type_note").text("");
	}
	//验证优先级
	if($("#priority option:selected").val() == ""){
		$("#update_priority_note").text("必填字段");
		return;
	}else{
		$("#update_priority_note").text("");
	}
	//验证接入平台类型
	if($("#platformTypeId option:selected").val() == ""){
		$("#update_platform_type_note").text("必填字段");
		return;
	}else{
		$("#update_platform_type_note").text("");
	}
	//验证接入平台名称
	if($("#platformName option:selected").val() == ""){
		$("#update_type_name_note").text("必填字段");
		return;
	}else{
		$("#update_type_name_note").text("");
	}
	//验证接入平台动态属性
	var flag_validate = true;//表单能不能提交，默认能提交
	$.each($("#platformLastTr").find("input"),function(i,n){
		var flag = $(n).attr("isnull");
		var valueDynamic = n.value;
		if(flag == "true" && valueDynamic == ""){
			$("#"+n.name+"").text("必填字段");
			flag_validate = false;
			return;
		}else{
			$("#"+n.name+"").text("");
		}
	});
	if(!flag_validate){
		return;
	}
	
	
	
	var fields = $("#jqgrid").jqGrid("getRowData");
	$.ajax({
		url: "/eSight/admin/df/load/save",
		type: "POST",
		async : false,
		data: {
//			"mappingFeildJson" : $.toJSON(fields),
			"pfDynPropJson" : $.toJSON($("input[pfDyn='true']").serializeArray()),
			"mappingFeildJson" : $.toJSON(fields),
			"activityClass" : $("#activityClass").val(),
			"priority" : $("#priority").val(),
			"retryTime" : $("#retryTime").val(),
			"retryInterval" : $("#retryInterval").val(),
			"platformTypeId" : $("#platformTypeId").val(),
			"platformName" : $("#platformName").val(),
			"id" : $("#id").val(),
			"contextId" : $("#contextId").val()
		},
		dataType: "json",
		cache: false,
		error: function(textStatus, errorThrown){
			alert("something wrong");
		},
		success: function(data, textStatus){
			self.close();
		}
    });
}

//初始化接入平台类型和接入平台名称下拉列表
function initPlatformType(){
    //元数据类型下拉列表
    $.ajax({
        url: "/eSight/admin/pf/queryPlatform",
        type: "GET",
        dataType: "json",
        success: function(data){
            $("#platformTypeId").empty();
            $("<option value=''>请选择...</option>").appendTo("#platformTypeId");
            if (data == null)
            	return;
    		for(var i=0; i<=data.data.length; i++){
    	     	var da = data.data[i];
            	var selected = "";
            	if (da != null && da.operateType == 'load') {
            		if (platformType == da.dbid) {
            			selected = "selected";
            		}
                   	$("<option value='" + da.dbid + "' " + selected + ">" + da.typeName + "</option>").appendTo("#platformTypeId");
            	}
    		}
        },
        error: function(){
            alert('<s:text name="df.node.err.mdtype"/>');
        }
    });
}

function initPrioritySelect() {
	for (i=0; i < 10; i++) {
		var selected = "";
		if (vpriority == i){
			selected = "selected='selected'";
		}
		$("<option " + selected + " value='" + i + "'>" + i + " </option>").appendTo("#priority");
	}
}

function initActivityClassSelect() {
	//活动类别下拉列表
    $.ajax({
        url: "/eSight/admin/dataflow/activityClass/acList",
        type: "GET",
        dataType: "json",
        success: function(data){
            $("#activityClass").empty();
            if (data.data == null)
            	return;
            data = data.data
    		for(var i=0; i<=data.length; i++){
    	     	var da = data[i];
    	     	if (null != da) {
                	var selected = "";
                	if (vactivityClass == da.id)
                		selected = "selected='selected'";
                   	$("<option value='" + da.name + "' " + selected + ">" + da.name + "</option>").appendTo("#activityClass");
    	     	}
    		}
        },
        error: function(){
            alert('<s:text name="df.node.err.actclass"/>');
        }
    });
}

function initPlatform() {
	autoShowMappingInfo();
	$("#platformLastTr").empty();
	 //接入平台类型下拉列表
    $.ajax({
        url: "/eSight/admin/df/load/onPlatformTypeChange",
        type: "POST",
        data :{
        	"platformType" : platformType,
			"id" : $("#id").val()
        },
        success: function(data){
            $("#platformName").empty();
            if(null == data.pfIdNameMap || "" == data.pfIdNameMap) {
            	$("#platformLastTr").empty();
            }
//            var pfIdNameMap = data.pfIdNameMap;
//        	for(var i=0; i<=pfIdNameMap.length; i++){
//    	     	var da = pfIdNameMap[i];
//    	     	alert(da);
//    	     	if (null != da) {
//                	var selected = "";
//                	if (platformName == da.key)
//                		selected = "selected='selected'";
//                   	$("<option value='" + da.key + "' " + selected + ">" + da.value + "</option>").appendTo("#platformName");
//    	     	}
//    		}

            $.each(data.pfIdNameMap, function(key, value){
            	var selected = "";
            	if (key == platformName) {
            		selected = "selected='selected'";
            	}
                $("<option value='" + key + "' " + selected + " >" + value + "</option>").appendTo("#platformName");
            });
            $("tr[pfDynPropTr='true']").remove();
            $("#platformLastTr").empty().append(data.platformDynamicPropertyUI);
        },
        error: function(){
            alert('error');
        }
    });
}

/**
* 当平台类型发生变化，需要刷新平台信息和动态属性
*/
function onPfTypeChange(){
	autoShowMappingInfo();
	$("#platformLastTr").empty();
	var pfType = $("#platformTypeId").val();
	if(pfType == "") {
		return;
	}
	 //接入平台类型下拉列表
    $.ajax({
        url: "/eSight/admin/df/load/onPlatformTypeChange",
        type: "POST",
//        dataType: "json",
        data :{
        	"platformType" : pfType,
			"id" : $("#id").val()
        },
        success: function(data){
            $("#platformName").empty();
            $("<option>请选择...</option>").appendTo("#platformName");
            if(null == data.pfIdNameMap || "" == data.pfIdNameMap) {
            	$("#platformLastTr").empty();
            }
            $.each(data.pfIdNameMap, function(key, value){
                $("<option value='" + key + "'>" + value + "</option>").appendTo("#platformName");
            });
            $("tr[pfDynPropTr='true']").remove();
            $("#platformLastTr").empty().append(data.platformDynamicPropertyUI);
        },
        error: function(){
            alert('error');
        }
    });
}

function autoShowMappingInfo() {
	var pfType = $("#platformTypeId").val();
	if(pfType == "3") {
		//$("#mappingTable").hide();
	} else {
		//$("#mappingTable").show();
	}
}

$(document).ready(function() {
	//初始化数据类型下拉框
	var dataTypes = "";
	$.ajax({
        url: "loadDataType",
        type: "GET",
        dataType: "json",
        async: false,
        data :{},
        success: function(result){
        	var split = "";
        	var data = result.data;
        	$.each(data, function(key, value){
        		dataTypes += split + key + ":" + value;
        		split = ";";
        	});
        },
        error: function(){
            alert(_errDataType);
        }
   });

	var jqGridOptions = {
		reload : true,
		datatype : 'json',
		height : 'auto',
		width : 'auto',
		colNames : ['序号', '名称', '类型', '格式化', '长度', '列名'],
		colModel : [{
			name : "index",
			index : "index",
			label : '序号'
		},{
			name : "name",
			index : "name",
			label : '名称',
			editable : true
		},{
			name : "type",
			index : "type",
			label : '类型',
			edittype:"select",
			editoptions : {value:dataTypes},
			editable : true
		},{
			name : "format",
			index : "format",
			label : '格式化',
			editable : true
		},{
			name : "length",
			index : "length",
			label : '长度',
			editable : true
		},{
			name : "colName",
			index : "colName",
			label : '列名',
			editable : true
		}],
		shrinkToFit : true,
		caption : "数据",
		multiselect : false,
		recordtext : "从 {0} 到 {1} 共  {2} 条数据",
		rowNum : 10,
		rowList : [10, 20, 30],
		pager : '#pjqgrid',
//		sortname : 'id',
		toolbarfilter : true,
		viewrecords : true,
		sortorder : "asc",
		editurl : "save",
		datatype : "json",
		mtype : "GET",
		postData: {"id" : $("#id").val(), "srcInfo" : srcInfo, "contextId" : $("#contextId").val(),"loadFromSession" : true},
		url : "/eSight/admin/df/load/loadMappingFeild",
		jsonReader : {
			root : "data", // (2)
			repeatitems : false
		// (4)
		},
		shrinkToFit : true,
		pgbuttons : false,
		pginput : false,
		viewrecords : false,
		rowNum : -1,
		loadonce: true
//		gridComplete : function() {
//		},
//		add : {
//			addCaption: "新增",  
//		  editCaption: "Edit Record",  
//		  bSubmit: "11Submit",  
//		  bCancel: "22Cancel",  
//		  bClose: "Close",  
//		  saveData: "Data has been changed! Save changes?",  
//		  bYes : "Yes",  
//		  bNo : "No",  
//		  bExit : "Cancel" 
//		}
	};
	
	$("#jqgrid").GridUnload();// 表格
	jQuery("#jqgrid").jqGrid(jqGridOptions);
	var top = $('#pjqgrid').offset().top;
	top = top - 100;
	jQuery("#jqgrid").jqGrid({pager : '#pjqgrid'}).navGrid('#pjqgrid', {
		edit : true,
		edittitle : "编辑",
		add : true,
		addtitle : "新增",
		del : true,
		deltitle : "删除",
		search : true,
		searchtitle : "查询",
		alertcap: "提示",  
		alerttext: "请选择",
		refreshtitle : "刷新",
		delfunc : function() {
			var temps = document.getElementById("pjqgrid").offsetTop;
			var row = $('#jqgrid').jqGrid('getGridParam', 'selrow');
			var suc = $('#jqgrid').jqGrid('delRowData', row);
			if (suc) {
				resetTableIndex($('#jqgrid'));
			}

		},
		editfunc : function(rowId) {
			var rowid = $('#jqgrid').jqGrid('getGridParam', 'selrow');
//			var top = $('#pjqgrid').offset().top;
//			top = top - 200;
			var properties = {
				onclickSubmit : function(params, posdata) {
					$('#jqgrid').jqGrid('setRowData', rowid, posdata);
					return posdata;
				},
				closeAfterEdit : true,
				reloadAfterSubmit : false,
				editCaption : "编辑",
				bSubmit : "提交",
				bCancel : "取消",
				top : top,  //位置
				left: 250 //位置
//				height:480, //大小
//				width:750 //大小
			};
			$('#jqgrid').jqGrid('editGridRow', rowid, properties);
		}
		
//		addfunc : function(rowId) {
//			var top = $('#pjqgrid').offset().top;
//			top = top - 200;
//			var properties = {
//				addCaption : "新增",
//				bSubmit : "提交",
//				bCancel : "取消",
//				top : top,  //位置
//				left: 250 //位置
////				height:480, //大小
////				width:750 //大小
//			};
//		}
	}
	,{
//		editCaption : "编辑",
//		bSubmit : "提交",
//		bCancel : "取消",
//		top : 1000,  //位置
//		left: 250 //位置
//		height:480, //大小
//		width:750 //大小
	},{
		addCaption : "新增",
		bSubmit : "提交",
		bCancel : "取消",
		top : top,  //位置
		left: 250, //位置
//		height:480, //大小
//		width:750 //大小
		reloadAfterSubmit : false,
		modal : true,
		addedrow : "last",
		afterComplete : function(response, postdata, formid) {
			var row = $('#jqgrid').jqGrid('getGridParam', 'selrow');
			if (row == null) {
				var len = $('#jqgrid').jqGrid('getDataIDs').length;
				postdata.index = len - 1;
				$('#jqgrid').jqGrid('setRowData', postdata.id, postdata);
			} else {
				$('#jqgrid').jqGrid('delRowData', postdata.id);
				$('#jqgrid').jqGrid('addRowData', postdata.id, postdata, 'after', row);
				resetTableIndex($('#jqgrid'));
			}
		},
		clearAfterAdd : true
	},
	{
		caption : "删除",
		msg : "确定删除选中记录(s)?",
		bSubmit : "确认",
		bCancel : "取消"
	},{},{}
	);
//	jQuery("#jqgrid").jqGrid('inlineNav', "#pjqgrid");
	/* Add tooltips */
	$('.navtable .ui-pg-button').tooltip({
		container : 'body'
	});
//	jQuery("#jqgrid").setGridParam({editurl:'/eSight/admin/dim/dimDataEdit/' + dbid});
	
	// remove classes
	$(".ui-jqgrid").removeClass("ui-widget ui-widget-content");
	$(".ui-jqgrid-view").children().removeClass("ui-widget-header ui-state-default");
	$(".ui-jqgrid-labels, .ui-search-toolbar").children().removeClass("ui-state-default ui-th-column ui-th-ltr");
	$(".ui-jqgrid-pager").removeClass("ui-state-default");
	$(".ui-jqgrid").removeClass("ui-widget-content");
	
	// add classes
	$(".ui-jqgrid-htable").addClass("table table-bordered table-hover");
	$(".ui-jqgrid-btable").addClass("table table-bordered table-striped");
	
	$(".ui-pg-div").removeClass().addClass("btn btn-sm btn-primary");
	$(".ui-icon.ui-icon-plus").removeClass().addClass("fa fa-plus");
	$(".ui-icon.ui-icon-pencil").removeClass().addClass("fa fa-pencil");
	$(".ui-icon.ui-icon-trash").removeClass().addClass("fa fa-trash-o");
	$(".ui-icon.ui-icon-search").removeClass().addClass("fa fa-search");
	$(".ui-icon.ui-icon-refresh").removeClass().addClass("fa fa-refresh");
	$(".ui-icon.ui-icon-disk").removeClass().addClass("fa fa-save").parent(".btn-primary").removeClass("btn-primary").addClass("btn-success");
	$(".ui-icon.ui-icon-cancel").removeClass().addClass("fa fa-times").parent(".btn-primary").removeClass("btn-primary").addClass("btn-danger");
	
	$(".ui-icon.ui-icon-seek-prev").wrap("<div class='btn btn-sm btn-default'></div>");
	$(".ui-icon.ui-icon-seek-prev").removeClass().addClass("fa fa-backward");
	
	$(".ui-icon.ui-icon-seek-first").wrap("<div class='btn btn-sm btn-default'></div>");
	$(".ui-icon.ui-icon-seek-first").removeClass().addClass("fa fa-fast-backward");
	
	$(".ui-icon.ui-icon-seek-next").wrap("<div class='btn btn-sm btn-default'></div>");
	$(".ui-icon.ui-icon-seek-next").removeClass().addClass("fa fa-forward");
	
	$(".ui-icon.ui-icon-seek-end").wrap("<div class='btn btn-sm btn-default'></div>");
	$(".ui-icon.ui-icon-seek-end").removeClass().addClass("fa fa-fast-forward");
	//设置jqgrid宽度
	$(window).on('resize.jqGrid', function() {
		$("#jqgrid").jqGrid('setGridWidth', '515');
	});
	// 添加行
//	var vars = eval(data.dataJson);
//	for ( var i = 0; i < vars.length; i++) {
//		$("#jqgrid").jqGrid('addRowData', vars[i].id, vars[i]);
//	}
//	jQuery("#jqgrid").trigger("reloadGrid");
});
function resetTableIndex(feildGridObj) {
	var dataIds = feildGridObj.jqGrid('getDataIDs');
	for (var i = 0; i < dataIds.length; i++) {
		var dataId = dataIds[i];
		feildGridObj.jqGrid('setCell', dataId, "index", i);
	}
};

