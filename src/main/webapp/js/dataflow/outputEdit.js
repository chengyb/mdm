//var srcInfo = window.dialogArguments.srcInfo;

//验证路径

$(function() {
	//
	$("button").button();
	$("#btn_output_update_confirm").click(function(){
		$("#updateForm").validate({
	        rules: {
	        	separator: {  required: true },
	        	path: {  required: true },
	        	compressionType: {  required: true },
	        	
	        },	
	        messages: {
	        	separator: '<font style="color: #ee8262;">必填字段</font>',
	        	path: '<font style="color: #ee8262;"><br/>必填字段</font>',
	        	compressionType: '<font style="color: #ee8262;"><br/>必填字段</font>',
	        		},
	        	 invalidHandler : function(){
					 return false;
				 },
				 submitHandler : function(){
					 //
					 $.ajax({
							url: "/eSight/admin/df/output/save",
							type: "POST",
							async : false,
							data: {
								"separator" : $("#separator").val(),
								"enclosure" : $("#enclosure").val(),
								"path" : $("#path").val(),
								"compressionType" : $("#compressionType").val(),
								"combineOutput" : $("#combineOutput").is(':checked'),
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

//提交数据
function submitData() {
	$("#updateForm").validate({
	        rules: {
	        	separator: {  required: true },
	        	path: {  required: true },
	        	compressionType: {  required: true },
	        	
	        },	
	        messages: {
	        	separator: '<font style="color: #ee8262;">必填字段</font>',
	        	path: '<font style="color: red;"><br/>必填字段</font>',
	        	compressionType: '<font style="color: red;"><br/><br/>必填字段</font>',
	        		},
	        	 invalidHandler : function(){
					 return false;
				 },
				 submitHandler : function(){
					 $.ajax({
							url: "/eSight/admin/df/output/save",
							type: "POST",
							async : false,
							data: {
								"separator" : $("#separator").val(),
								"enclosure" : $("#enclosure").val(),
								"path" : $("#path").val(),
								"compressionType" : $("#compressionType").val(),
								"combineOutput" : $("#combineOutput").is(':checked'),
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
}
