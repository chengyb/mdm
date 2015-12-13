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
	
	$.ajax({
        url: "/eSight/admin/df/selectlist/loadFunc",
        type: "POST",
        dataType: "json",
        async: false,
        data :{},
        success: function(result){
         	var data = result.data;
        	var split = "";
        	funcs = "";
        	$.each(data, function(key, value){
        		funcs += split + key + ":" + value;
        		split = ";";
        	});
        },
        error: function(){
            alert("函数加载失败！");
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
			editable : true,
			edittype:"select",
			editoptions:{
				value : funcs,
				dataEvents: [{ type: 'change', fn: onFuncChange }]
				},
			formatter:"select",
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
		caption : "输出字段",
		multiselect : false,
		recordtext : "从 {0} 到 {1} 共  {2} 条数据",
		rowNum : 10,
		rowList : [10, 20, 30],
		pager : '#pjqgrid',
		sortname : 'id',
		toolbarfilter : true,
		viewrecords : true,
		sortorder : "asc",
		editurl : "forEdit",
		datatype : "json",
//		data : datas,
//		mtype : "GET",
		postData: {"id" : $("#id").val(), "srcInfo" : srcInfo, "contextId" : $("#contextId").val(),"loadFromSession" : true},
        url : "/eSight/admin/df/nodeEdit/getJQGridJSON",
		jsonReader : {
			root : "data", // (2)
			repeatitems : false
		},
		shrinkToFit : true,
//		pgbuttons : false,
//		pginput : false,
		viewrecords : true,
		loadonce: true
	};
	
	$("#jqgrid").GridUnload();// 表格
	jQuery("#jqgrid").jqGrid(jqGridOptions);
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

		editfunc : function(rowId) {
			var rowid = $('#jqgrid').jqGrid('getGridParam', 'selrow');
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
				top : 700,  //位置
				left: 250 //位置
//				height:480, //大小
//				width:750 //大小
			};
			$('#jqgrid').jqGrid('editGridRow', rowid, properties);
		},
		delfunc : function() {
			var row = $('#jqgrid').jqGrid('getGridParam', 'selrow');
			var suc = $('#jqgrid').jqGrid('delRowData', row);
			if (suc) {
				resetTableIndex($('#jqgrid'));
			}
		}
	},{
	},{
		addCaption : "新增",
		bSubmit : "提交",
		bCancel : "取消",
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
		clearAfterAdd : true,
		top : 700,  //位置
		left: 250 //位置
	},
	{
		caption : "删除",
		msg : "确定删除选中记录(s)?",
		bSubmit : "确认",
		bCancel : "取消"
	}
//	).navButtonAdd('#pjqgrid', { ghz 自定义按钮
//		  //caption 为标题字段
//		  caption : "ghz_test",
//		  buttonicon : "ui-icon-newwin",
//		  //下边栏按钮点击事件
//		  onClickButton: function( e) { 
//			  alert("helloworld!");
//		  }
//	
//	}
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
	
	// 添加行
//	var vars = eval(data.dataJson);
//	for ( var i = 0; i < vars.length; i++) {
//		$("#jqgrid").jqGrid('addRowData', vars[i].id, vars[i]);
//	}
//	jQuery("#jqgrid").trigger("reloadGrid");
});

function onDimensionChange(e) {
	var dimensionVal = $(window.parent.document).find("#dimension").val();
	$(window.parent.document).find("#dimensionFromCol").empty();
	$(window.parent.document).find("#dimensionToCol").empty();
	if (dimensionVal == null || dimensionVal == "undefined" || dimensionVal == "") {
		return;
	}
	$.ajax({
        url: "/eSight/admin/df/nodeEdit/loadDimensionCol",
        type: "POST",
        dataType: "json",
        async: false,
        data :{"dimensionVal" : dimensionVal},
        success: function(result){
        	var data = result.data;
        	var split = "";
        	$.each(data, function(key, value){
        		 $("<option value='" + value + "'>" + value + "</option>").appendTo($(window.parent.document).find("#dimensionFromCol"));
        		 $("<option value='" + value + "'>" + value + "</option>").appendTo($(window.parent.document).find("#dimensionToCol"));
        	});
        },
        error: function(){
            alert(_errDimession);
        }
    });
}

/**
 * 当列转换自定义类变化，联动其参数
 */
function onJavaValueChange(e) {
	var javaValueVal = $(window.parent.document).find("#javaValue").val();
	$("#javaValueParam").val("");
	if (javaValueVal == null || javaValueVal == "undefined" || javaValueVal == "") {
		return;
	}
	$.ajax({
        url: "/eSight/admin/df/nodeEdit/loadJavaValueParam",
        type: "GET",
        dataType: "json",
        async: false,
        data :{"javaValueVal" : javaValueVal},
        success: function(result){
        	var data = result.data;
        	alert(data);
        },
        error: function(){
            alert(_errJavaValueParam);
        }
    });
}

/**
 * 当函数变换，联动类型选择
 */
function onFuncChange() {
	var funcVal = $(window.parent.document).find("#func").val();
	if ('COUNT' == funcVal) {
		$(window.parent.document).find("#type").val("Long").attr("disabled", "disabled");
		$(window.parent.document).find("#value").val(null);
	} else {
		$(window.parent.document).find("#type").removeAttr("disabled");
	}
}



//初始化输出字段列表
function loadPreFeilds(){
	var url = "/eSight/admin/df/nodeEdit/loadPreFeilds?metaDataId=" + $("#metadatas").val();
	jQuery("#jqgrid").setGridParam({
		datatype : "json",
		mtype : "GET",
		url : url,
		jsonReader : {
			root : "data",
			repeatitems : false
		}
	}).trigger('reloadGrid');
}

//
///**
// * 重新根据url读取表格数据
// * @param url
// */
//feildGrid.prototype.reloadData = function (url, feildListName) {
//	this.feildGridObj.jqGrid("setGridParam", {
//		datatype : "json",
//		mtype : "GET",
//		url : url,
//		jsonReader : {
//			root : feildListName,
//			repeatitems : false
//		}
//	}).trigger('reloadGrid');
//};
//
///**
// * 清空表格数据
// */
//feildGrid.prototype.clearData = function() {
//	this.feildGridObj.jqGrid("clearGridData");
//};
//
///**
// * 提交前调用，防止编辑途中提交出错
// */
//feildGrid.prototype.restoreAll = function () {
//	var dataIds = this.feildGridObj.jqGrid('getDataIDs');
//	for (var i = 0; i < dataIds.length; i++) {
//		var dataId = dataIds[i];
//		this.feildGridObj.jqGrid('restoreRow', dataId);
//	}
//};
