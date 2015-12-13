/**
 * 元数据编辑页面的相关javascript,部分script还在jsp页面上
 */
function excelUpload() {
	$("#excelUploadDlg").dialog("open");
}

function excelDownload() {
	$("#excelUploadDlg").dialog("open");
}

$(function() {
	/**
	 * 批量执行打开的对话框
	 */
	$("#excelUploadDlg").dialog({
		resizable : false,
		height : 200,
		width : 620,
		modal : true,
		autoOpen : false,
		buttons : {
			"上传" : function() {
				ajaxFileUpload();
			},
			"取消" : function() {
				$(this).dialog("close");
			}
		}
	});
});

/**
 * 异步上传文件
 * 
 * @returns {Boolean}
 */
function ajaxFileUpload() {
	loading();// 动态加载小图标

	$.ajaxFileUpload({
		url : 'excelUploadFieldsAction',
		secureuri : false,
		fileElementId : 'fileToUpload',
		dataType : 'json',
		success : function(data, status) {
			if (data.ajaxResult == "success") {
				for ( var i = 0; i < data.dataList.length; i++) {
					data.dataList[i].tempId = idFactory++;
					$("#fieldList").jqGrid('addRowData', data.dataList[i].tempId, data.dataList[i]);
				}
				calculateIndex();
				alert("Excel导入字段成功");
			} else if (data.msg != null) {
				alert(data.msg);
			} else if (data.errors.file != null) {
				alert(data.fileName + " 不是Excel文件");
			} else if (data.errorMessages != null) {
				alert("文件大小超过30M");
			}
		},
		error : function(data, status, e) {
			alert(e);
		}
	});

	function loading() {
		$("#loading").ajaxStart(function() {
			$(this).show();
		}).ajaxComplete(function() {
			$(this).hide();
		});
	}
	return false;
}

function checkFieldNameUnique() {
	var fields = $("#fieldList").jqGrid("getRowData");
	var fieldName = $.trim($("#fieldName").val());

	var isUnique = true;
	$.each(fields, function(i, outEntry) {
		var num = 0;
		$.each(fields, function(i, entry) {
			if(isUnique == false){
				return false;
			}
			if ($.trim(entry.fieldName).toUpperCase() == outEntry.fieldName.toUpperCase()) {
				num++;
			}
			if(num >= 2){				
				alert(outEntry.fieldName + "重复");
				isUnique = false;
				return false;
			}
		});
	});

	return isUnique;

}