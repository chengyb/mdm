$(function() {
	$("button").button();
	initActivityClassSelect();
	initPrioritySelect();
	initMdTypeSelect();
	
	$("#btn_hive_load_confirm").click(function() {
		$("#editor_form").validate({
			 rules: {
				 activityClass: {  required: true },
				 filter: {  required: true },
				 path: {  required: true },
				 priority: {  required: true },
				 refMdTypeId: {  required: true },
				 metadatas: {  required: true },
			},
			messages : {
				filter : '<font style="color: #ee8262;">必填字段</font>',
				path : '<font style="color: #ee8262;">必填字段</font>',
				activityClass : '<font style="color: #ee8262;">必填字段</font>',
				priority : '<font style="color: #ee8262;">必填字段</font>',
	  			refMdTypeId : '<font style="color: #ee8262;">必填字段</font>',
				metadatas : '<font style="color: #ee8262;">必填字段</font>',
			},
			invalidHandler : function(){
		       return false;
		    },
		    submitHandler : function(){
				$.ajax({
					url : '/eSight/admin/dim/updateDim/',
					data : {
						"path" : $("#path").val(),
						"filter" : $("#filter").val(),
						"activityClass" : $("#activityClass").val(),
						"priority" : $("#priority").val(),
						"metaDataType" : $("#refMdTypeId").val(),
						"metadatas" : $("#metadatas").val(),
						
					},
					cache : false,
					async : true,
					type : "POST",
					dataType : 'json',
					success : function(result) {
						$("#btn_close").click();
						if (result.result == "success" && result.data != null) {
							location.reload();
						} else {
							alert("修改失败！");
						}
					}
				});
		    	return false;
		   }
		});	
	});
	

});




//提交数据
/*function submitData() {
		if ($("#filter").val() == "") {

		$("#update_filter").text(
				'必填字段');
		return;
	} else {
		$("#create_role_name_note").text("");
		
	}
	if ($("#path").val() == ""||$("#filter").val() == "") {

			$("#update_path").text(
					'必填字段');
			return;
		} else {
			$("#create_path").text("");
			
		}
	$.ajax({
		url: "/eSight/admin/df/hive4load/save",
		type: "POST",
		async : false,
		data: {
			"activityClass" : $("#activityClass").val(),
			"priority" : $("#priority").val(),
			"retryTime" : $("#retryTime").val(),
			"retryInterval" : $("#retryInterval").val(),
			"filter" : $("#filter").val(),
			"path" : $("#path").val(),
			"metaDataType" : $("#refMdTypeId").val(),
			"metaDataId" : $("#metadatas").val(),
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
}*/


//初始化metadata的partition信息
function initMdPartition() {
	var mdId = $("#metadatas").val();
	if (mdId == "") {
		$("tr[mdPartitionTr='true']").remove();
		return;
	}
	
	$.ajax({
        url: "<s:url action='hive4loadMdPartitions' namespace='/df' />",
        type: "POST",
        dataType: "json",
        data :{
        	"hive4LoadNode.metaDataId" : mdId,
        	"id" : $("#id").val(),
        	"contextId" : $("#contextId").val()
        },
        success: function(data){
        	$("tr[mdPartitionTr='true']").remove();
            $("#metaDataLastTr").after(data.metaDataPartitionUI);
        },
        error: function(){
            alert('<s:text name="df.node.err.mdpart"/>');
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
        	mdId : "${hive4LoadNode.metaDataId}"
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
                	if (vmetaDataType == da.mdTypeId)
                		selected = "selected='selected'";
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
