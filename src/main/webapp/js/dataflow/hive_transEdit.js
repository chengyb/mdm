//var srcInfo = window.dialogArguments.srcInfo;

/*$(function() {
	$("button").button();
//	if (null != vNode) {
//		$("#filter").val(vNode.filter);
//	}
	initActivityClassSelect();
	initPrioritySelect();
	//$("#retryTime").val("${hive4LoadNode.retryTime}");
	//$("#retryInterval").val("${hive4LoadNode.retryInterval}");
});*/

$(function() {
	//
	$("button").button();
	initActivityClassSelect();
	initPrioritySelect();
	$("#btn_dim_update_confirm").click(function(){
		$("#hive4transForm").validate({
	        rules: {
	        	activityClass: {  required: true },
	        	priority: {  required: true },
	        	filter: {  required: true },
	        	
	        },	
	        messages: {
	        	activityClass: '<font style="color: #ee8262;">必填字段</font>',
	        	priority: '<font style="color: #ee8262;"><br/>必填字段</font>',
	        	filter: '<font style="color: #ee8262;"><br/>必填字段</font>',
	        		},
	        	 invalidHandler : function(){
					 return false;
				 },
				 submitHandler : function(){
					 //
					 $.ajax({
							url: "/eSight/admin/df/hive4trans/save",
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
					 
					 return false;
				 }
		});
		
	});
	

});

//校验sql
function validateHQL(){
	$.post("/eSight/admin/hive/sql/check",
  {
    sql:$("#filter").val(),
    dbname:"default"
  },
  function(data,status){
	  if ("success" == data.data ){
		  $.smallBox({
				title : "SQL校检通过",
				content : "",
				color : "#739E73",
				iconSmall : "fa fa-thumbs-up bounce animated",
				timeout : 4000
			});
	  }else{
		  $.smallBox({
				title : "SQL校检失败",
				content : data.data,
				color : "#C46A69",
				iconSmall : "fa fa-warning shake animated"
			}); 
	  }
  });
}
//提交数据
/*function submitData() {
	$.ajax({
		url: "/eSight/admin/df/hive4trans/save",
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

function initPrioritySelect() {
	$("<option value='" + priority + "'>" + priority + "</option>").remove();
	$("<option selected='selected' value='" + vpriority + "'>" + vpriority + " </option>").appendTo("#priority");
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
