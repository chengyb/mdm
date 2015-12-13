//var resultGrid;
var conditionJson;
var validateJson;
var dimensionValidateJson;

$(function() {
	$("button").button();
	initMdTypeSelect();
	initNode();
	initKeyPurpose();
	loadPreFeilds();
	$("#btn_dim_update_confirm").click(function(){
		//form校验规则
		$("#parallelForm").validate({
	        rules: {
	        	errorOutput: {  required: true },
	        	ocdcPriority:{ required: true },
	        	reduce:{ required: true },
	        	sortAsc:{ required: true },
	        	sortRemainRow:{ required: true },
	        	path:{ required: true },
	        	refMdTypeId:{ required: true },
	        	metadatas:{ required: true },
//	        	useCombineInput:{ required: true },
				
	        },
	        messages: {
	        	errorOutput: '<font style="color: #ee8262;">必填字段</font>',
	        	ocdcPriority: '<font style="color: #ee8262;">必填字段</font>',
	        	reduce: '<font style="color: #ee8262;">必填字段</font>',
	        	sortAsc: '<font style="color: #ee8262;">必填字段</font>',
	        	sortRemainRow: '<font style="color: #ee8262;">必填字段</font>',
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
				url: "/eSight/admin/df/parallel/save",
				type: "POST",
				async: false,
				data: {
					"resultsJson" : $.toJSON(fields),
					"errorOutput" : errorOutput,
					"ocdcPriority" : ocdcPriority,
					"reduce" : reduce,
					"sortAsc" : sortAsc,
					"sortRemainRow" : sortRemainRow,
					"path" : path,
					"useCombineInput" : useCombineInput,
					"pathExpression" : pathExpression,
					"keyPurpose" : keyPurpose,
					"metaDataType" : metaDataType,
					"metaDataId" : metaDataId,
					"id" : $("#id").val(),
					"contextId" : $("#contextId").val()
//					"conditionJson" : condJson,
//					"validateJson": validateJSON,
//					"dimensionValidateJson" : dimensionValidatedJson
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
            alert('<s:text name="df.node.err.mdtype"/>');
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
        	mdId : "${vParallelNode.metaDataId}"
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
            alert('error');
        }
    });
}

// 初始化节点信息
function initNode(){
    $.ajax({
        url: "/eSight/admin/df/parallel/getNode",
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


//初始化键值下拉列表
function initKeyPurpose(){
    $.ajax({
        url: "/eSight/admin/df/parallel/initKeyPurpose",
        type: "GET",
        dataType: "json",
        cache : false,
        async : true,
        data :{},
        success: function(data){
            $("#keyPurposeSelect").empty();
            var i = 0;
            $.each(data.data, function(key, value){
            	var selected = "";
            	if (keyPurpose == key)
            		selected = "selected='selected'";
            	if (i++ == 0) {
            		$("<option value=''></option>").appendTo("#keyPurposeSelect");
            	}
                $("<option value='" + key + "' " + selected + ">" + value + "</option>").appendTo("#keyPurposeSelect");
            });
        },
        error: function(){
            alert('初始化键值下拉列表失败！');
        }
    });
}

function submitData() {
	var fields = $("#jqgrid").jqGrid("getRowData");
	var fieldsStr = $.toJSON(fields)
	
	var errorOutput = $("#errorOutput").val();
	var ocdcPriority = $("#ocdcPriority").val();
	var reduce = $("#reduce").val();
	var sortAsc = $("#sortAsc").val();
	var sortRemainRow = $("#sortRemainRow").val();
	var path = $("#path").val();
	var metaDataType = $("#refMdTypeId").val();
	var metaDataId = $("#metadatas").val();
	var useCombineInput = $("#useCombineInput").val();
	var pathExpression = $("#pathExpression").val();
	var keyPurpose = $("#keyPurposeSelect").val();
	
//	var actionUrl = "<s:url action='saveParallelNode' namespace='/df' />?" + $('#parallelNodeForm').formSerialize();
//	var actionUrl = $('#parallelNodeForm').formSerialize();
//	alert(actionUrl);
	//提交前调用，防止编辑途中提交出错
//	resultGrid.restoreAll();
//	var condJson;
//	if (resultGrid.conJson != null)
//		condJson = $.toJSON(resultGrid.conJson);
//	
//	var dimensionValidatedJson;
//	if (resultGrid.dimensionValidateJson != null) {
//		dimensionValidatedJson = $.toJSON(resultGrid.dimensionValidateJson);
//	}
//	
//	var validateJSON = null;
//	if  ( resultGrid.validateRules && resultGrid.validateRules.length >0) {
//		validateJSON = $.toJSON(resultGrid.validateRules);
//	}
//	
//	var fields = $("#resFieldList").jqGrid("getRowData");
//	
//	var useSort = false;
//	var useKey = false;
//	$.each(fields, function(i, rowData) {
//		if ('' != rowData.sortIndex) {
//			useSort = true;
//			if(useKey) {
//				return false;
//			}
//		}
//		if('Yes' == rowData.isKey) {
//			useKey = true;
//			if(useSort) {
//				return false;
//			}
//		}
//	});
//	if(useSort && useKey) {
//		alert('<s:text name="df.parallel.msg.err.keyPurpose"/>');
//		return;
//	}
/*	$("#btn_dim_update_confirm").click(function(){
//		alert("33333");
		//form校验规则
		$("#parallelForm").validate({
	        rules: {
	        	errorOutput: {  required: true },
	        	ocdcPriority:{ required: true },
	        	reduce:{ required: true },
	        	sortAsc:{ required: true },
	        	sortRemainRow:{ required: true },
	        	path:{ required: true },
	        	refMdTypeId:{ required: true },
	        	metadatas:{ required: true },
	        	useCombineInput:{ required: true },
				
	        },
	        messages: {
	        	errorOutput: '<font style="color: #ee8262;">必填字段</font>',
	        	ocdcPriority: '<font style="color: #ee8262;">必填字段</font>',
	        	reduce: '<font style="color: #ee8262;">必填字段</font>',
	        	sortAsc: '<font style="color: #ee8262;">必填字段</font>',
	        	sortRemainRow: '<font style="color: #ee8262;">必填字段</font>',
	        	path: '<font style="color: #ee8262;">必填字段</font>',
	        	refMdTypeId: '<font style="color: #ee8262;">必填字段</font>',
	        	metadatas: '<font style="color: #ee8262;">必填字段</font>',
	        	useCombineInput: '<font style="color: #ee8262;">必填字段</font>',
	        	
	        	
			},
//	        	
		    invalidHandler : function(){
		        return false;
		    },
		    submitHandler : function(){$.ajax({
				url: "/eSight/admin/df/parallel/save",
				type: "POST",
				async: false,
				data: {
					"resultsJson" : $.toJSON(fields),
					"errorOutput" : errorOutput,
					"ocdcPriority" : ocdcPriority,
					"reduce" : reduce,
					"sortAsc" : sortAsc,
					"sortRemainRow" : sortRemainRow,
					"path" : path,
					"useCombineInput" : useCombineInput,
					"pathExpression" : pathExpression,
					"keyPurpose" : keyPurpose,
					"metaDataType" : metaDataType,
					"metaDataId" : metaDataId,
					"id" : $("#id").val(),
					"contextId" : $("#contextId").val()
//					"conditionJson" : condJson,
//					"validateJson": validateJSON,
//					"dimensionValidateJson" : dimensionValidatedJson
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
	});*/
//	$.ajax({
//		url: "/eSight/admin/df/parallel/save",
//		type: "POST",
//		async: false,
//		data: {
//			"resultsJson" : $.toJSON(fields),
//			"errorOutput" : errorOutput,
//			"ocdcPriority" : ocdcPriority,
//			"reduce" : reduce,
//			"sortAsc" : sortAsc,
//			"sortRemainRow" : sortRemainRow,
//			"path" : path,
//			"useCombineInput" : useCombineInput,
//			"pathExpression" : pathExpression,
//			"keyPurpose" : keyPurpose,
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

function changMetaDataId() {
	vmetaDataId = $("#metadatas").val();
}
//
//
////初始化输入数据列表
//function loadPreFeilds(){
//	alert(123);
//	var url = "/eSight/admin/parallel/loadPreFeilds";
//	
//	jQuery("#jqgrid").("setGridParam", {
//  		datatype : "json",
//		mtype : "GET",
//		url : url,
//		jsonReader : {
//			root : "data",
//			repeatitems : false
//		}
//	}).trigger('reloadGrid');
////  $.ajax({
////      url: url,
////      type: "GET",
////      data: {
////          "metaDataId" : vmetaDataId,
////          "id" : id,
////          "contextId" : contextId
////      }
////      dataType: "json",
////      success: function(data){
////          if (data == null) {
////              return;
////          }
////          
////      },
////      error: function(){
////          alert("数据加载失败！");
////      }
////  });
//}