//角色记录的id
var dbid = "";


//选中的复选框的id
var checkedObj = null;
//按钮控制
function buttonOparation(obj){
    var obj_checked = obj.checked;
    $("input[name='checkbox-inline']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;
    
    if (obj_checked) {
    	dbid = obj.value;
        $("#btn_role_edit, #btn_role_delete").removeClass("btn-default").removeClass("disabled").addClass("btn-primary");
        checkedObj = obj;
    } else {
    	dbid = "";
    	$("#btn_role_edit, #btn_role_delete").addClass("btn-default").addClass("disabled").removeClass("btn-primary");
    	checkedObj = null;
    }
}

//判断是否选中一行角色记录
function isCheck() {
    var checkedNumbers = $('input[name="checkbox-inline"]').filter(':checked');
    if (dbid == "" || !checkedNumbers.length) {
        alert("请先选中一行！");
        return;
    }
    //dbid = $(radio[0]).parent().parent().siblings("#dbid").text();
}


//刷新列表
$("#btn_role_refresh").click(function() {
	location.reload();
});


//初始化数据表格
function initTable(){
	$('#dt_basic').dataTable( {
		"bServerSide": true,
		"bSort": false,
		"sPaginationType": "full_numbers",
		"sAjaxSource": "/eSight/admin/role/list",
		"aoColumns":  [ {
			"data" : "name"
		}, {
			"data" : "desc"
		}, {
			"data" : "createDate"
		}, {
			"data" : "modifyDate"
		} ],
		//行的回调函数
		"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			var str = "";
			str += "<td><label class='checkbox'><input type='checkbox' name='checkbox-inline' onclick='buttonOparation(this)' value='" + aData.dbid + "'/><i></i></label></td>"+
			"<td>" + aData.name + "</td>" +
			"<td>" + aData.desc + "</td>" +
			"<td>" + getSmpFormatDateByLong(aData.createDate,true) + "</td>";
			if(aData.modifyDate != null){
				str += "<td>" + getSmpFormatDateByLong(aData.modifyDate,true) + "</td>";
			}else{
				str += "<td></td>";
			}
			$(nRow).empty().append(str);	
			buttonOparation($(aData).find("checkbox"));
		},
		"oLanguage": {
			"sZeroRecords": "抱歉， 没有找到",
			"sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
			"sInfoEmpty": "没有数据",
			"sInfoFiltered": "(从 _MAX_ 条数据中检索)",
			"oPaginate": {"sFirst": "首页",
				"sPrevious": "前一页",
				"sNext": "后一页",
				"sLast": "尾页"
			},
			"sZeroRecords": "没有检索到数据",
			"sProcessing": "数据加载中..."
		},
		"sDom": '<"dt-top-row" <"top pull-left"f><"top pull-right"l>>rt<"dt-bottom-row dt-row"<"bottom pull-left"i><"bottom pull-right"p>><"clear">'
	} );
}


$("#btn_role_create").click(function(){
    $.ajax({
        url: '/eSight/admin/role/listMenu',
        data: '',
        cache: false,
        async: true,
        type: "GET",
        dataType: 'json',
        success: function(result) {
            if (result.result == "success" && result.data != null) {
            	$("#create_role_modal_menus,#role_edit_modal_menus").html("");
            	drawMenus("#create_role_modal_menus",-1,result.data);
            	$("#create_role_modal_menus").find("input:checkbox").on("change",function(){
            		controlParentAndChildrenMenu(this);
            	});
            } else {
                $("#create_role_modal_menus").empty().append("加载关联菜单失败！");
            }
        }
    });
});

$("#create_role_name").blur(function() {
    $.ajax({
        url: '/eSight/admin/role/name/' + $("#create_role_name").val(),
        data: '',
        cache: false,
        async: true,
        type: "GET",
        dataType: 'json',
        success: function(result) {
            if (result.result == "success") {
                if (result.data != null) {
                    $("#create_role_name_note").text("角色名已存在！");
                } else {
                    $("#create_role_name_note").text("");
                }
            } else {
                $("#create_role_name_note").text(result.reason);
            }
        }
    });

});


//添加角色
$("#btn_role_confirm").click(function() {
		
		$("#roleForm").validate({
		        rules: {
		        	create_role_name: {  required: true },
		        	create_role_desc: {  required: true },
		        	/*role_menu_id: {  required: true },*/
		        	
		        },	
		        messages: {
		        	create_role_name: '<font style="color: red;">必填字段</font>',
		        	create_role_desc: '<font style="color: red;"><br/>必填字段</font>',
		        	/*role_menu_id: '<font style="color: red;"><br/><br/>必填字段</font>',*/
		        	
				 },
				 invalidHandler : function(){
					 return false;
				 },
				 submitHandler : function(){
				    var menuIds = "";
				    var checkedMenus = $('input[name="menu"]').filter(':checked');
				    if(checkedMenus.length > 0){
				    	menuIds += "-1,";
				    }
				    checkedMenus.each(function(i){
				    	menuIds += this.value + ",";
				    });
				    if (null == menuIds || "" == menuIds) {
					    alert("至少要关联一个菜单！");
				    	return false;
				    }
				    $.ajax({
				        url: '/eSight/admin/role/add/',
				        data: {
				            "name": $("#create_role_name").val(),
				            "desc": $("#create_role_desc").val(),
				            "menuIds": menuIds
				        },
				        cache: false,
				        async: true,
				        type: "POST",
				        dataType: 'json',
				        success: function(result) {
				            $("#btn_close").click();
				            if (result.result == "success" && result.data != null) {
				            	location.reload();
				            } else {
				                alert("添加失败！");
				            }
				        }
				    });
				    return false;
	        }
		});
});

//打开编辑角色界面
function isHaveChild(obj,dbid){
	var isHave = false;
	$.each( obj, function(i, n){
 		if(n.parentId!=null && n.parentId==dbid){
 			isHave = true;
 			return false;	
 		}
	});
	return isHave;
}
function drawMenus(rootDivId,dbid,obj){
	$.each(obj, function(i, n){
	  var haveChild = isHaveChild(obj,n.dbid);
	  if(n.parentId!=null && n.parentId==dbid){
		  if(haveChild){
			  var left ="\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"dd-handle col-md-12\">\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<h6 class=\"col-md-3 no-padding \" style=\"margin: 0;\">\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<label>\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input dbid=\"" + n.dbid + "\" parentDbid=\"" + dbid + "\""
	          		+ " value=\"" + n.dbid + "\"" + " name=\"menu\" class=\"checkbox style-0\" type=\"checkbox\"";
			  if(n.isBlong){
				  left += "checked=\"checked\"";
			  }
	          left += " style=\"visibility: visible;\">\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"semi-bold \">" + n.name + "</span>\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</label>\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t</h6>\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div id=\"" + n.dbid + "_children\" class=\"col-md-9\" style=\"border-left: 1px solid #CCCCCC; \">\n" +

	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t</div>";
			  $(rootDivId).append(left);
			  drawMenus(rootDivId,n.dbid,obj);
		  }else{
			  var right="\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<div class=\"no-padding pull-left  col-md-4 col-xs-4 col-sm-4 col-lg-4\">\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<label>\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<input dbid=\"" + n.dbid + "\" parentDbid=\"" + n.parentId + "\""
	          		+ " value=\"" + n.dbid + "\"" +" name=\"menu\" class=\"checkbox style-0 child_box\"";
			  if(n.isBlong){
				  right += "checked=\"checked\"";
			  }
	          right += " type=\"checkbox\" style=\"visibility: hidden;\">\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t<span class=\"font-xs\">" + n.name + "</span>\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</label>\n" +
	          "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\n";
			  $(rootDivId +" #" + n.parentId + "_children").append(right);
		  }
		  
	  }
	});
}

function allMenuChecked(obj){
	$('input[name="menu"]').each( function() {
		$(this).prop("indeterminate", false);
        $(this).prop("checked", obj);     
    });  
}

function controlParentAndChildrenMenu(that){
	//查找父节点，改变父节点的选中状态：半选、选中、未选中
	var parentDbid = $(that).attr("parentdbid");
	var siblingNodes = $("#" + parentDbid + "_children").find("input");
	var siblingCheckedNodes = $("#" + parentDbid + "_children").find("input:checked");
	if(siblingCheckedNodes.length == 0){
		$("input:checkbox[dbid='" + $(that).attr("parentdbid") +"']").prop("indeterminate", false);
		$("input:checkbox[dbid='" + $(that).attr("parentdbid") +"']").prop("checked", false);
	}else{
  		if(siblingNodes.length == siblingCheckedNodes.length){
			$("input:checkbox[dbid='" + $(that).attr("parentdbid") +"']").prop("indeterminate", false);
			$("input:checkbox[dbid='" + $(that).attr("parentdbid") +"']").prop("checked", true);
		}else{
			$("input:checkbox[dbid='" + $(that).attr("parentdbid") +"']").prop("checked", true);
			$("input:checkbox[dbid='" + $(that).attr("parentdbid") +"']").prop("indeterminate", true);
		}
	}
	//查找所有子节点，改变子节点的选中状态：全选，或者全不选
	var checkedFlag = $(that).prop("checked");
	var childNodes = $("#"+$(that).attr("dbid")+"_children").find("input");
	$.each( childNodes, function(i, n){
		$(n).prop("indeterminate", false);
		$(n).prop("checked", checkedFlag);  
	});
}

$("#btn_role_edit").click(function() {
	isCheck();
    $("#edit_role_name").val($(checkedObj).parent().parent().siblings()[0].innerText);
    $("#edit_role_desc").val($(checkedObj).parent().parent().siblings()[1].innerText);
    
    $.ajax({
        url: '/eSight/admin/role/findMenu/' + dbid,
        data: '',
        cache: false,
        async: true,
        type: "GET",
        dataType: 'json',
        success: function(result) {
            if (result.result == "success" && result.data != null) {
            	$("#create_role_modal_menus,#role_edit_modal_menus").html("");
            	drawMenus("#role_edit_modal_menus",-1,result.data);
            	$("#role_edit_modal_menus").find("input:checkbox").on("change",function(){
            		controlParentAndChildrenMenu(this);
            	});
            } else {
                $("#role_edit_modal_menus").empty().append("加载关联菜单失败！");
            }
        }
    }); 
		 
});

//编辑角色时,验证角色名不能为空,不能已存在
$("#edit_role_name").blur(function() {
	var name = $("#edit_role_name").val();
    if (name == "") {
        $("#edit_role_name_note").text("");
        return;
    } else {
        $("#edit_role_name_note").text("");
    }
    $.ajax({
        url: '/eSight/admin/role/name/' + name,
        data: '',
        cache: false,
        async: true,
        type: "GET",
        dataType: 'json',
        success: function(result) {
            if (result.result == "success") {
                if (result.data != null && result.data.name != name) {
                    $("#edit_role_name_note").text("角色名已存在！");
                } else {
                    $("#edit_role_name_note").text("");
                }
            } else {
                $("#edit_role_name_note").text(result.reason);
            }
        }
    });

});

//添加角色时,简介不能为空
$("#edit_role_desc").blur(function() {
    if ($("#edit_role_desc").val() == "") {
        $("#edit_role_desc_note").text("");
    } else {
        $("#edit_role_desc_note").text("");

    }
});


//编辑角色
$("#btn_role_edit").click(function() {
	$("#update_roleForm").validate({
			
	        rules: {
	        	edit_role_name: {  required: true },
	        	edit_role_desc: {  required: true },
	        	/*menu: {  required: true },
	        	*/
	        },
	        messages: {
	        	edit_role_name: '<font style="color: red;">必填字段</font>',
	        	edit_role_desc: '<font style="color: red;"><br/>必填字段</font>',
	        	/*menu: '<font style="color: red;"><br/>必填字段</font>',*/
	        	
			 },
	
			 invalidHandler : function(){
				 return false;
			 },
			 submitHandler : function(){
			    var menuIds = "";
			    var checkedMenus = $('input[name="menu"]').filter(':checked');
			    if(checkedMenus.length > 0){
			    	menuIds += "-1,";
			    }
			    checkedMenus.each(function(i){
			    	menuIds += this.value + ",";
			    });
			    if (null == menuIds || "" == menuIds) {
				    alert("至少要关联一个菜单！");
			    	return false;
			    }
			    $.ajax({
			        url: '/eSight/admin/role/edit',
			        data: {
			            "dbid": dbid,
			            "name": $("#edit_role_name").val(),
			            "desc": $("#edit_role_desc").val(),
			            "menuIds": menuIds
			        },
			        cache: false,
			        async: true,
			        type: "POST",
			        dataType: 'json',
			        success: function(result) {
			            if (result != null && result.result == "success" && result.data != null) {
			            	location.reload();
			            } else {
			                $("#edit_userN_note").text(result.reason);
			                alert("编辑失败！");
			            }
			        }
			    });
			    return false;
			 }
	 });
});

//删除角色
$("#btn_role_delete").click(function() {
    isCheck();
    var r = confirm("确认要删除?");
    if (r == false) {
        return;
    }
    //var dbid = $(radio[0]).parent().parent().siblings("#dbid").text();
    $.ajax({
        url: '/eSight/admin/role/' + dbid,
        data: '',
        cache: false,
        async: true,
        type: "DELETE",
        dataType: 'json',
        success: function(result) {
            if (result.result == "success") {
            	//initTable();
            	location.reload();
            } else {
                alert("删除失败！");
            }
        }
    });
});
