/**
 * 注册Partition的jqgrid表格
 */
function registerPartitionGrid() {
	jQuery("#partitionTable").jqGrid({
		data : $.parseJSON(ptsJson),
		cache : false,
		datatype : "local",
		autowidth : true,
		colModel : [ {
			name : "ptId",
			index : "ptId",
			sorttype : "int",
			hidden : true,
			key : true
		}, {
			name : "ptSn",
			index : "ptSn",
			label : partitionSnText,
			sortable : false
		}, {
			name : "ptName",
			index : "ptName",
			label : partitionNameText,
			sortable : false
		}, {
			name : "ptDesc",
			index : "ptDesc",
			label : partitionDescText,
			sortable : false
		} ],
		height : 80,
		caption : partitionText+'&nbsp;&nbsp;&nbsp;<span style="color:#ee8262">*</span>',
		autowidth : true,
		shrinkToFit : true,
		pager : "#partitionPager",
		pgbuttons : false,
		pginput : false
	});
	$("#partitionTable").jqGrid('navGrid', '#partitionPager', {
		search : false,
		refresh : false,
		addfunc : openPtDialog4Adding,
		editfunc : openPtFkDialog4Update,
		delfunc : deletePartition
	});
}
/**
 * 打开Partition新增对话框
 * 
 * @returns
 */
var openPtDialog4Adding = function() {
	var consoleDlg = $("#ptConsoleDlg");
	var dialogButtonPanel = consoleDlg.siblings(".ui-dialog-buttonpane"); // (1)
	consoleDlg.find("input").removeAttr("disabled").val(""); // (2)
	dialogButtonPanel.find("button:not(:contains(" + dialogCancelText + "))").hide();
	dialogButtonPanel.find("button:contains(" + dialogCreateText + ")").show();
	consoleDlg.dialog("option", "title", partitionDialogCreateTitle).dialog("open"); // (5)
};
/**
 * 打开Partition修改对话框 rowId 会从jqGrid中传过来
 * 
 * @returns
 */
var openPtFkDialog4Update = function(rowId) {
	var consoleDlg = $("#ptConsoleDlg");
	var dialogButtonPanel = consoleDlg.siblings(".ui-dialog-buttonpane");
	consoleDlg.find("input").removeAttr("disabled");
	dialogButtonPanel.find("button:not(:contains('" + dialogCancelText + "'))").hide();
	dialogButtonPanel.find("button:contains('" + dialogSaveText + "')").show();
	consoleDlg.dialog("option", "title", partitionDialogUpdateTitle);

	var rowData = $("#partitionTable").jqGrid("getRowData", rowId);
	for ( var p in rowData) {
		if (typeof (rowData[p]) != "function") {
			$("#" + p).val(rowData[p]);
		}
	}
	// 打开对话框
	consoleDlg.dialog("open");
};
/**
 * 注册Partition对话框
 */
function registerPartitionDialog() {
	var buttons = {};
	buttons[dialogCancelText] = function() {
		$("#ptConsoleDlg").dialog("close");
	};
	buttons[dialogCreateText] = createPartition;
	buttons[dialogSaveText] = updatePartition;
	buttons[dialogDeleteText] = deletePartition;
	$("#ptConsoleDlg").dialog({
		autoOpen : false,
		modal : true, // 设置对话框为模态（modal）对话框
		resizable : true,
		width : 480,
		buttons : buttons
	});
}
/**
 * 创建partition
 */
var createPartition = function() {
	var isAccess = $("#ptForm").valid();
	if (!isAccess) {
		return;
	}
	var formData = getPtFormData();
	$("#partitionTable").jqGrid("addRowData", formData.ptId, formData, "last");

	//当分区信息存在数据，则去掉"必填字段"
	var fields = $("#partitionTable").jqGrid("getRowData");
	if (fields.length >= 1) {
		$("#partitionTable").jqGrid("setCaption", "分区信息&nbsp;&nbsp;&nbsp;<span style='color:#ee8262'>*</span>").trigger("reloadGrid");
	}

	$("#ptConsoleDlg").dialog("close");
	alert(partitionCreateSuccessText);
	
};
/**
 * 更新Partition
 */
var updatePartition = function() {
	var isValid = $("#ptForm").valid();// 先进行校验
	if (isValid == false) {
		return;
	}
	var consoleDlg = $("#ptConsoleDlg");
	var dataRow = getPtFormData();
	$("#partitionTable").jqGrid("setRowData", dataRow.ptId, dataRow);
	consoleDlg.dialog("close");
	alert(partitionUpdateSuccessText);
};
/**
 * 删除Partition
 */
var deletePartition = function() {
	var pId = $("#partitionTable").jqGrid("getGridParam", "selrow");
	var data = $("#partitionTable").jqGrid("getRowData", pId);
	if (confirm("确定要删除" + data.ptName + "吗？") == false) {
		return;
	}
	$("#partitionTable").jqGrid("delRowData", pId);
	alert(partitionDeleteSuccessText);
};
/**
 * 注册Partition的校验信息
 */
function registerPartitionForm() {
	$("#ptForm").validate({
		rules : {
			ptSn : {required : true},
			ptName : {required : true}
		},
		messages : {
			ptSn :'<font style="color: red;">必填字段</font>',
			ptName : '<font style="color: red;">必填字段</font>',
		}
	});
}
/**
 * 获取编辑分区信息的form上的信息
 */
function getPtFormData() {
	var formData = getJsonNameValueMap($("#ptForm"));
	var consoleDlg = $("#ptConsoleDlg");
	var selectId = consoleDlg.find("#ptId").val();
	if (selectId == "") {
		selectId = idFactory++;
	}
	formData.ptId = selectId;
	return json;
}