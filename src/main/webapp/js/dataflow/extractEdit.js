//var srcInfo = window.dialogArguments.srcInfo;

$(function() {
	$("button").button();
//	if (null != vNode) {
//		$("#filter").val(vNode.filter);
//	}
	initMdTypeSelect();
	initActivityClassSelect();
	initPrioritySelect();
	//$("#retryTime").val("${hive4LoadNode.retryTime}");
	//$("#retryInterval").val("${hive4LoadNode.retryInterval}");
});

//提交数据
function submitData() {
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
}

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
//            $.each(data.mdIdNameMap, function(key, value){
	    		for(var i=0; i<=data.length; i++){
	    	     	var da = data[i];
	            	var selected = "";
	            	if (da != null) {
		            	if (vmetaDataId == da.id)
		            		selected = "selected='selected'";
		                $("<option value='" + da.id + "' " + selected + ">" + da.mdDisplayName + "</option>").appendTo("#metadatas");
	            	}
	    		}
//            });
//            initMdPartition();
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
	$("<option value='" + priority + "'>" + priority + "</option>").remove();
	$("<option selected='selected' value='" + vpriority + "'>" + vpriority + " </option>").appendTo("#priority");
//	priority
//	//优先级下拉列表
//    $.ajax({
//        url: "<s:url action='loadPriority' namespace='/df' />",
//        type: "POST",
//        async : false,
//        dataType: "json",
//        success: function(data){
//            $("#priority").empty();
//            if (data.priorities == null)
//            	return;
//            $.each(data.priorities, function(key, value){
//            	var selected = "";
//            	if ("${hive4LoadNode.priority}" == key)
//            		selected = "selected='selected'";
//               	$("<option value='" + key + "' " + selected + ">" + value + "</option>").appendTo("#priority");
//            });
//        },
//        error: function(){
//            alert('<s:text name="df.node.err.pri"/>');
//        }
//    });
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
