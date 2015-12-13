//var resultGrid;
var conditionJson;
var validateJson;
var dimensionValidateJson;

$(function() {
	$("button").button();
	initMdTypeSelect();
	initNode();
	loadPreFeilds();
	loadInputFeilds();
	
	$("#btn_dim_update_confirm").click(function(){
		//form校验规则
		$("#groupForm").validate({
	        rules: {
	        	errorOutput: {  required: true },
	        	reduce:{ required: true },
	        	path:{ required: true },
	        	refMdTypeId:{ required: true },
	        	metadatas:{ required: true },
//	        	useCombineInput:{ required: true },
	        	
				
	        },
	        messages: {
	        	errorOutput: '<font style="color: #ee8262;">必填字段</font>',
	        	reduce: '<font style="color: #ee8262;">必填字段</font>',
	        	path: '<font style="color: #ee8262;">必填字段</font>',
	        	refMdTypeId: '<font style="color: #ee8262;">必填字段</font>',
	        	metadatas: '<font style="color: #ee8262;">必填字段</font>',
//	        	useCombineInput: '<font style="color: #ee8262;">必填字段</font>',
	        	
	        	
	        	
			},
//	        	
		    invalidHandler : function(){
		        return false;
		    },
		    submitHandler : function(){
		    	$.ajax({
		    		url: "/eSight/admin/df/group/save",
		    		type: "POST",
		    		async: false,
		    		data: {
		    			"resultsJson" : $.toJSON(fields),
		    			"inputFeilds" : $.toJSON(inputFeilds),
		    			"errorOutput" : errorOutput,
		    			"reduce" : reduce,
		    			"path" : path,
//		    			"useCombineInput" : useCombineInput,
		    			"metaDataType" : metaDataType,
		    			"metaDataId" : metaDataId,
		    			"id" : $("#id").val(),
		    			"contextId" : $("#contextId").val()
//		    			"conditionJson" : condJson,
//		    			"validateJson": validateJSON,
//		    			"dimensionValidateJson" : dimensionValidatedJson
		    		},
		    		dataType: "json",
		    		cache: false,
		    		error: function(textStatus, errorThrown){
		    			alert("保存失败！");
		    		},
		    		success: function(data, textStatus){
		    			self.close();
		    		}
		        });
		    },
	
	
});
	});
});

//初始化元数据类型下拉列表
function initMdTypeSelect(){
    //元数据类型下拉列表
    $.ajax({
        url: "/eSight/admin/md/metadataType",
        type: "GET",
        dataType: "json",
        success: function(data){
            $("#refMdTypeId").empty();
            if (data == null)
            	return;
    		for(var i=0; i<=data.length; i++){
    	     	var da = data[i];
            	var selected = "";
            	if (da != null) {
                	if (vmetaDataType == da.mdTypeId) {
                		selected = "selected='selected'";
                	}
                   	$("<option value='" + da.mdTypeId + "' " + selected + ">" + da.mdTypeValue + "</option>").appendTo("#refMdTypeId");
            	}
    		}
            initMdSelect();
        },
        error: function(){
            alert("元数据类型加载失败！");
        }
    });
}
//根据元数据类型显示元数据的下拉列表的值
function initMdSelect(){
	var mdType = $("#refMdTypeId").val();
	if(mdType == "") {
		return;
	}
    //元数据类型下拉列表
    $.ajax({
        url: "/eSight/admin/md/queryMetadata?dirId=" + 0,
        type: "GET",
        dataType: "json",
        cache : false,
        async : true,
        data :{
        	metadataType : mdType,
        	mdId : vmetaDataId
        },
        success: function(data){
            $("#metadatas").empty();
            if (data == null)
            	return;
            $("<option value=''></option>").appendTo("#metadatas");
	    		for(var i=0; i<=data.length; i++){
	    	     	var da = data[i];
	            	var selected = "";
	            	if (da != null) {
		            	if (vmetaDataId == da.id)
		            		selected = "selected='selected'";
		                $("<option value='" + da.id + "' " + selected + ">" + da.mdDisplayName + "</option>").appendTo("#metadatas");
	            	}
	    		}
        },
        error: function(){
            alert("元数据加载失败！");
        }
    });
}

// 初始化节点信息
function initNode(){
    $.ajax({
        url: "/eSight/admin/df/group/getNode",
        type: "GET",
        dataType: "json",
        cache : false,
        async : true,
        data :{
        	id : id,
        	contextId : contextId
        },
        success: function(data){
            if (data == null) {
            	return;
            }
    		resultGrid = data.resultGrid;
    		conditionJson = data.conditionJson;
    		validateJson = data.validateJson;
    		dimensionValidateJson = data.dimensionValidateJson;
        },
        error: function(){
            alert('error');
        }
    });
}

function submitData() {
	var fields = $("#jqgrid").jqGrid("getRowData");
	var inputFeilds = $("#jqgrid-input").jqGrid("getRowData");
	
	var errorOutput = $("#errorOutput").val();
	var reduce = $("#reduce").val();
	var path = $("#path").val();
	var metaDataType = $("#refMdTypeId").val();
	var metaDataId = $("#metadatas").val();
	var useCombineInput = $("#useCombineInput").val();
//	$.ajax({
//		url: "/eSight/admin/df/group/save",
//		type: "POST",
//		async: false,
//		data: {
//			"resultsJson" : $.toJSON(fields),
//			"inputFeilds" : $.toJSON(inputFeilds),
//			"errorOutput" : errorOutput,
//			"reduce" : reduce,
//			"path" : path,
//			"useCombineInput" : useCombineInput,
//			"metaDataType" : metaDataType,
//			"metaDataId" : metaDataId,
//			"id" : $("#id").val(),
//			"contextId" : $("#contextId").val()
////			"conditionJson" : condJson,
////			"validateJson": validateJSON,
////			"dimensionValidateJson" : dimensionValidatedJson
//		},
//		dataType: "json",
//		cache: false,
//		error: function(textStatus, errorThrown){
//			alert("保存失败！");
//		},
//		success: function(data, textStatus){
//			self.close();
//		}
//    });
}

$(document).ready(function() {

	var srcInfo = window.dialogArguments.srcInfo;
	var dataTypes = "";
	var roundingModes;
	var dimensions;
	var javaValues;
	var funcs;
	var ifOpenDimensionValidation = true;
	// 加载数据类型
	$.ajax({
         url: "/eSight/admin/df/nodeEdit/loadDataType",
         type: "GET",
         dataType: "json",
         async: false,
         data :{},
         success: function(result){
         	var data = result.data;
         	var split = "";
         	$.each(data, function(key, value){
         		dataTypes += split + key + ":" + value;
         		split = ";";
         	});
         },
         error: function(){
             alert("数据类型加载失败！");
         }
    });
	
	// 加载舍位方式
	$.ajax({
        url: "/eSight/admin/df/nodeEdit/loadRoundingMode",
        type: "GET",
        dataType: "json",
        async: false,
        data :{},
        success: function(result){
         	var data = result.data;
        	var split = "";
        	$.each(data, function(key, value){
        		roundingModes += split + key + ":" + value;
        		split = ";";
        	});
        },
        error: function(){
            alert("舍位方式加载失败！");
        }
    });
	
	// 加载维度数据
	$.ajax({
        url: "/eSight/admin/dim/getAll",
        type: "GET",
        dataType: "json",
        async: false,
        data :{},
        success: function(result){
         	var data = result.data;
        	var split = "";
        	dimensions = "";
        	for (var i = 0; i < data.length; i++) {
        		dimensions += split + data[i].dimDefId + ":" + data[i].englishName;
        		split = ";";
        	}
        },
        error: function(){
            alert("维度数据加载失败！");
        }
    });
	
	$.ajax({
        url: "/eSight/admin/df/nodeEdit/loadJavaValue",
        type: "GET",
        dataType: "json",
        async: false,
        data :{},
        success: function(result){
         	var data = result.data;
        	var split = "";
        	javaValues = "";
        	$.each(data, function(key, value){
        		javaValues += split + key + ":" + value;
        		split = ";";
        	});
        },
        error: function(){
            alert("Java加载失败！");
        }
    });
	
	var datas;
	var jqGridOptions = {
		reload : true,
		datatype : 'json',
		height : 'auto',
		width : 'auto',
		colModel : [ {
			name : "index",
			index : "index",
			label : "序号",
			align : "right",
			width : 60,
			sortable : false
		}, {
			name : "name",
			index : "name",
			label : "名称",
			editable : true,
			cellEdit : true,
			sortable : false
		}, {
			name : "value",
			index : "value",
			label : "值",
			editable : true,
			edittype : "textarea",
			sortable : false
		}, {
			name : "type",
			index : "type",
			label : "类型",
			editable : true,
			edittype:"select",
			editoptions:{value:dataTypes},
			sortable : false
		}, {
			name : "visible",
			index : "visible",
			label : "是否输出",
			editable : true,
			edittype : "checkbox",
			editoptions : {value:"Yes:No"},
			sortable : false
		}, {
			name : "isKey",
			index : "isKey",
			label : "是否为键值",
			editable : true,
			edittype : "checkbox",
			editoptions : {value:"Yes:No"},
			sortable : false
		}, {
			name : "sortIndex",
			index : "sortIndex",
			label : "排序级别",
			editable : true,
			formoptions : {label : "排序级别", elmsuffix : "排序级别" },
			edittype : "text",
			sortable : false
		}, {
			name : "onIndex",
			index : "onIndex",
			label : "关联序号",
			editable : true,
			sortable : false
		}, {
			name : "func",
			index : "func",
			label : "函数",
			edittype:"select",
			sortable : false
		}, {
			name : "toEnv",
			index : "toEnv",
			label : "加入环境变量",
			editable : true,
			edittype : "checkbox",
			editoptions : {value:"Yes:No"},
			sortable : false
		}, {
			name : "format",
			index : "format",
			label : "格式化",
			sortable : false
		}, {
			name : "length",
			index : "length",
			label : "长度",
			editable : true,
			sortable : false
		},{
			name : "scale",
			index : "scale",
			label : "精度",
			editable : true,
			sortable : false
		}, {
			name : "roundingMode",
			index : "roundingMode",
			label : "舍位方式",
			editable : true,
			edittype:"select",
			editoptions:{value:roundingModes},
			sortable : false
		}, {
			name : "defaultValue",
			index : "defaultValue",
			label : "默认值",
			editable : true,
			sortable : false
		}, {
			name : "dimension",
			index : "dimension",
			label : "维度",
			editable : true,
			edittype:"select",
			editoptions : {
				value:dimensions,
				dataEvents: [{ type: 'change', fn: onDimensionChange }]
			},
			sortable : false,
			editrules : {edithidden:true}
		}, {
			name : "dimensionFromCol",
			index : "dimensionFromCol",
			label : "维度主值",
			editable : true,
			edittype:"select",
			editoptions : {value:":"},
			sortable : false,
			editrules : {edithidden:true},
			hidden : true
		}, {
			name : "dimensionToCol",
			index : "dimensionToCol",
			label : "维度目标值",
			editable : true,
			edittype:"select",
			editoptions : {value:":"},
			sortable : false,
			editrules : {edithidden:true},
			hidden : true
		}, {
			name : "javaValue",
			index : "javaValue",
			label : "Java",
			editable : true,
			sortable : false,
			edittype:"select",
			editoptions:{
				value : javaValues,
				dataEvents: [{ type: 'change', fn: onJavaValueChange }]
				},
			formatter:"select",
			editrules : {required : false}
		},{
			name : "javaValueParam",
			index : "javaValueParam",
			label : "Java入参",
			editable : true,
			formoptions : {elmsuffix : "<br>以','分隔，列引用使用'#'"},
			sortable : false,
			editrules : {edithidden:true}
		}],
		shrinkToFit : true,
		caption : "输入字段",
		multiselect : false,
		recordtext : "从 {0} 到 {1} 共  {2} 条数据",
		rowNum : 10,
		rowList : [10, 20, 30],
		pager : '#pjqgrid-input',
	//	sortname : 'id',
		toolbarfilter : true,
		viewrecords : true,
		sortorder : "asc",
		editurl : "save",
		datatype : "json",
		data : datas,
	//	mtype : "GET",
		postData: {"id" : $("#id").val(), "srcInfo" : srcInfo, "contextId" : $("#contextId").val(),"loadFromSession" : true},
	    url : "/eSight/admin/df/group/getJQGridJSON",
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
	//	gridComplete : function() {
	//	},
	//	add : {
	//		addCaption: "新增",  
	//	  editCaption: "Edit Record",  
	//	  bSubmit: "11Submit",  
	//	  bCancel: "22Cancel",  
	//	  bClose: "Close",  
	//	  saveData: "Data has been changed! Save changes?",  
	//	  bYes : "Yes",  
	//	  bNo : "No",  
	//	  bExit : "Cancel" 
	//	}
	};
	
	$("#jqgrid-input").GridUnload();// 表格
	jQuery("#jqgrid-input").jqGrid(jqGridOptions);
	jQuery("#jqgrid-input").jqGrid({pager : '#pjqgrid-input'}).navGrid('#pjqgrid-input', {
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
			var row = $('#jqgrid-input').jqGrid('getGridParam', 'selrow');
			var suc = $('#jqgrid-input').jqGrid('delRowData', row);
			if (suc) {
				resetTableIndex($('#jqgrid-input'));
			}
		}
	}
	,{
		caption : "编辑",
		bSubmit : "提交",
		bCancel : "取消"
	},{
		addCaption : "新增",
		bSubmit : "提交",
		bCancel : "取消",
		reloadAfterSubmit : false,
		modal : true,
		addedrow : "last",
		afterComplete : function(response, postdata, formid) {
			var row = $('#jqgrid-input').jqGrid('getGridParam', 'selrow');
			if (row == null) {
				var len = $('#jqgrid-input').jqGrid('getDataIDs').length;
				postdata.index = len - 1;
				$('#jqgrid-input').jqGrid('setRowData', postdata.id, postdata);
			} else {
				$('#jqgrid-input').jqGrid('delRowData', postdata.id);
				$('#jqgrid-input').jqGrid('addRowData', postdata.id, postdata, 'after', row);
				resetTableIndex($('#jqgrid-input'));
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
	//.navButtonAdd('#pjqgrid-input', { ghz 自定义按钮
	//	  //caption 为标题字段
	//	  caption : "ghz_test",
	//	  buttonicon : "ui-icon-newwin",
	//	  //下边栏按钮点击事件
	//	  onClickButton: function( e) { 
	//		  alert("helloworld!");
	//	  }
	//
	//});
	//jQuery("#jqgrid").jqGrid('inlineNav', "#pjqgrid-input");
	/* Add tooltips */
	$('.navtable .ui-pg-button').tooltip({
		container : 'body'
	});
	//jQuery("#jqgrid-input").setGridParam({editurl:'/eSight/admin/dim/dimDataEdit/' + dbid});
	
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

// 添加行
//var vars = eval(data.dataJson);
//for ( var i = 0; i < vars.length; i++) {
//	$("#jqgrid-input").jqGrid('addRowData', vars[i].id, vars[i]);
//}
//jQuery("#jqgrid-input").trigger("reloadGrid");
});

//初始化输入字段列表
function loadInputFeilds(){
	var url = "/eSight/admin/df/group/loadPreFeilds?metaDataId=" + $("#metadatas").val();
	jQuery("#jqgrid-input").setGridParam({
		datatype : "json",
		mtype : "GET",
		url : url,
		jsonReader : {
			root : "data",
			repeatitems : false
		}
	}).trigger('reloadGrid');
}
