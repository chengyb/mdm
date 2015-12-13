//此文件为元数据新增、修改的页面的客户端校验js

var mdFormValidator;
var fieldFormValidator;
var refFormValidator;

$(function() {
	// 元数据表级约束表单校验
	mdFormValidator = $("#mdForm").validate({
		/*rules : {
			mdName : {
				required : true,
				nowhitespace : true,
				javaVar : true
			}
		},
		messages : {
			mdName : {
				required : "请输入元数据名"
			}
		}*/
		
	        rules: {
	        	mdTypeName: {  required: true },
	        	mdName: {  required: true },
	        	mdDisplayName:{ required: true } 
	        },
	        messages: {
	        	mdTypeName: '<font style="color: red;">必填字段</font>',
	        	mdName: '<font style="color: red;"><br/>必填字段</font>',
	        	mdDisplayName: '<font style="color: red;"><br/>必填字段</font>',  
			 	}
	});
	// $("#mdForm").css("display", "none");
	// 元数据表单校验
	fieldFormValidator = $("#fieldForm").validate({
		rules : {
			fieldName : {
				required : true,
				nowhitespace : true,
				javaVar : true
			},
			precision : {
				digits : true
			},
			length_: {
				digits : true
			},
			dataType : {
				required : true
			}
		},
		messages : {
			fieldName : {
				required : '<font style="color: red;"><br/>必填字段</font>' ,
			},
			dataType : "请选择数据类型",
			length_ : "请输入数字",
			precision : "请输入数字"
		},
		submitHandler : function() {
			addField();
		}
	});
	// 引用关系表单校验
	refFormValidator = $("#refForm").validate({
		rules : {
			fkName : {
				required : true
			},
			fields : {
				required : true
			},
			metadatas : {
				required : true
			},
			refFields : {
				required : true
			}
		},
		messages : {
			fkName : "请输入引用名称",
			fields : "请选择当前元数据字段",
			metadatas : "请选择引用的元数据名",
			refFields : "请输入引用的字段"
		},
		submitHandler : function() {
			addFk();
		}
	});
});
function getFieldFormData() {
	var consoleDlg = $("#consoleDlg");// selectId

	var pIsNull = consoleDlg.find("#isnull").prop("checked");
	var pIsPk = consoleDlg.find("#ispk").prop("checked");
	var pIsTrim = consoleDlg.find("#istrim").prop("checked");

	var query = $('#fieldForm').serializeArray();
	json = {};
	for (i in query) {
		json[query[i].name] = query[i].value;
	}
	var selectId = consoleDlg.find("#selectFieldId").val();
	if (selectId == "") {
		selectId = idFactory++;
	}
	json["tempId"] = selectId;
	json["isnull"] = pIsNull;
	json["ispk"] = pIsPk;
	json["istrim"] = pIsTrim;

	return json;
}

/**
 * 在元数据里面新增一行字段的信息
 */
var addField = function() {
	var consoleDlg = $("#consoleDlg");
	var dataRow = getFieldFormData();

	$("#fieldList").jqGrid("addRowData", dataRow.tempId, dataRow, "last");
	// consoleDlg.dialog("close");
	calculateIndex();
	openDialog4AddingField();
};



function calculateIndex(){
    $("#fieldList tbody > tr").each(function(i){
    	if($(this).attr("class") != "jqgfirstrow"){                		
    		$(this).find(":nth-child(4)").text(i-1);
    	}
    });
}


//打新增字段对话框
var openDialog4AddingField = function(){
    fieldFormValidator.resetForm();
    var consoleDlg = $("#consoleDlg");
    var dialogButtonPanel = consoleDlg.siblings(".ui-dialog-buttonpane");
    consoleDlg.find("input").removeAttr("disabled").val("");
    consoleDlg.find("#isnull").attr("checked","checked");
    //consoleDlg.find("#ispk").attr("checked","");
    //consoleDlg.find("#istrim").attr("checked","");
    consoleDlg.find("#dataType").val("String");
    dialogButtonPanel.find("button:not(:contains('" + '取消' + "'))").hide();
    dialogButtonPanel.find("button:contains('" + '创建' + "')").show();
    consoleDlg.dialog("option", "title", "创建新字段").dialog("open");
    initFormat();
};


//根据元数据字段数据类型来设置Format。当类型为Date时，format才可见
function initFormat(){
	var type = $("#dataType").val();
	if( type == "Date"){
		$("#formatTr").show();
	}else{
		$("#formatTr").hide();
	}
	if( type == "BigDecimal"){
		$("#roundingModetr").show();
	}else{
		$("#roundingModetr").hide();
	}
}

var updateField = function() {
	var isValid = $("#fieldForm").valid();// 先进行校验
	if (isValid == false) {
		return;
	}
	var consoleDlg = $("#consoleDlg");
	var dataRow = getFieldFormData();
	$("#fieldList").jqGrid("setRowData", dataRow.tempId, dataRow);
	consoleDlg.dialog("close");
};
// 获取元数据关联关系的表单的数据，并组织成JSon格式
function getFkFormData() {
	var consoleDlg = $("#fkConsoleDlg");

	var selectId = consoleDlg.find("#selectedRefId").val();
	if (selectId == "") {
		selectId = idFactory++;
	}

	var name = $.trim(consoleDlg.find("#fkName").val());
	var fieldNames = [];
	$("#fields option:selected").each(function() {
		fieldNames[fieldNames.length] = $(this).text();
	});
	var metaName = $("#metadatas option:selected").text();
	var refFieldNames = [];
	$("#refFields option:selected").each(function() {
		refFieldNames[refFieldNames.length] = $(this).text();
	});

	var refFieldIds = $("#refFields").val();
	var fieldIds = $("#fields").val();
	var mdTypeId = $("#refMdTypeId").val();

	var dataRow = {
		tempId : selectId,
		fkName : name,
		fieldNames : fieldNames,
		refMeta : metaName,
		foreignFields : refFieldNames,
		refFieldIds : refFieldIds,
		fieldIds : fieldIds,
		mdTypeId : mdTypeId,
		mdId : $("#metadatas").val()
	};
	return dataRow;
}
/**
 * 在引用关系表里面新增一行字段的信息
 */
var addFk = function() {
	var consoleDlg = $("#fkConsoleDlg");
	var dataRow = getFkFormData();
	$("#fkList").jqGrid("addRowData", dataRow.tempId, dataRow, "last");
	consoleDlg.dialog("close");
};
// 更新引用关系表里面的一行字段的信息
var updateFk = function() {
	var isValid = $("#refForm").valid();// 先进行校验
	if (isValid == false) {
		return;
	}
	var consoleDlg = $("#fkConsoleDlg");
	var dataRow = getFkFormData();
	$("#fkList").jqGrid("setRowData", dataRow.tempId, dataRow);
	consoleDlg.dialog("close");
};
function checkUnique() {
	var fields = $("#fieldList").jqGrid("getRowData");
	var fieldName = $.trim($("#fieldName").val());

	var isUnique = true;
	$.each(fields, function(i, entry) {
		if ($.trim(entry.fieldName).toUpperCase() == fieldName.toUpperCase()) {
			alert(fieldName + "重复");
			isUnique = false;
			return false;
		}
	});
	return isUnique;
}