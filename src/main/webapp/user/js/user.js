//用户记录的id
var dbid = "";

//按钮控制
function buttonOparation(obj){
    var obj_checked = obj.checked;
    $("input[name='checkbox-inline']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;
    
    if (obj_checked) {
    	dbid = obj.value;
        $("#btn_user_edit, #btn_user_delete, #btn_user_role").removeClass("btn-default").removeClass("disabled").addClass("btn-primary");
    } else {
    	dbid = "";
    	$("#btn_user_edit, #btn_user_delete, #btn_user_role").addClass("btn-default").addClass("disabled").removeClass("btn-primary");
    }
}

//判断是否选中一行用户记录
function isCheck() {
    var checkedNumbers = $('input[name="checkbox-inline"]').filter(':checked');
    if (dbid == "" || !checkedNumbers.length) {
        alert("请先选中一行！");
        return;
    }
    //dbid = $(radio[0]).parent().parent().siblings("#dbid").text();
}


//刷新列表
$("#btn_user_refresh").click(function() {
	location.reload();
});


//初始化数据表格
function initTable(){
	$('#dt_basic').dataTable( {
		"bServerSide": true,
		"bSort": false,
		"sPaginationType": "full_numbers",
		"sAjaxSource": "/eSight/admin/user/list-ajax",
		"aoColumns":  [ {
			"data" : "username"
		}, {
			"data" : "createDate"
		}, {
			"data" : "modifyDate"
		} ],
		//行的回调函数
		"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			var str = "";
			str += "<td><label class='checkbox'><input type='checkbox' name='checkbox-inline' onclick='buttonOparation(this)' value='" + aData.dbid + "'/><i></i></label></td>"+
			"<td>" + aData.username + "</td>" +
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


//添加
$("#btn_user_confirm").click(function() {
	$("#create_user_form").validate({
		rules: {
			username: {  required: true },
			password: {  required: true },
			repassword:{ required: true }
		},
		messages : {
			username : '<font style="color: #ee8262;">必填字段</font>',
			password : '<font style="color: #ee8262;">必填字段</font>',
			repassword : '<font style="color: #ee8262;">必填字段</font>'
		},
		invalidHandler : function(){
			return false;
		},
     
		submitHandler : function(){
    	 $.ajax({
    	        url: '/eSight/admin/user/add/',
    	        data: {
    	            "username": $("#create_user_name").val(),
    	            "password": $("#create_user_password").val(),
    	            "repassword": $("#create_user_repassword").val()
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

//添加用户时,密码不能为空
$("#create_user_password").blur(function() {
 /*   if ($("#create_user_password").val() == "") {
        $("#create_pwdN_note").text("密码不能为空！");
    } else {*/
    	if($("#create_user_repassword").val() != $("#create_user_password").val()){
    		$("#create_repwdN_note").text("两次输入密码不一致！");
    	}else{
    		$("#create_repwdN_note").text("");
    	}
        $("#create_pwdN_note").text("");

    /*}*/
});
//添加用户时,重复验证密码不能为空
$("#create_user_repassword").blur(function() {
    /*if ($("#create_user_repassword").val() == "") {
        $("#create_repwdN_note").text("重复密码不能为空！");
    } else {*/
    	if($("#create_user_repassword").val() != $("#create_user_password").val()){
    		$("#create_repwdN_note").text("两次输入密码不一致！");
    	}else{
    		$("#create_repwdN_note").text("");
    	}
    }
);


//添加用户
/*$("#btn_user_confirm").click(function() {
    if ($("#create_user_name").val() == "" || $("#create_user_password").val() == "" || $("#create_userN_note").text() != "" ||  $("#create_pwdN_note").text() != "") {
        alert("用户名或密码填写不正确！");
        return;
    }
    if(!validateLength($("#create_user_password").val(),5,10)){
    	alert("密码长度应在5-10之间");
    	return;
    }
    if($("#create_user_repassword").val() != $("#create_user_password").val()){
		$("#create_repwdN_note").text("两次输入密码不一致！");
		return;
    }
    $.ajax({
        url: '/eSight/admin/user/add/',
        data: {
            "username": $("#create_user_name").val(),
            "password": $("#create_user_password").val(),
            "repassword": $("#create_user_repassword").val()
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
});*/

//打开编辑用户界面
$("#btn_user_edit").click(function() {
    isCheck();
    
    $.ajax({
        url: '/eSight/admin/user/' + dbid,
        data: '',
        cache: false,
        async: true,
        type: "GET",
        dataType: 'json',
        success: function(result) {
            if (result.result == "success" && result.data != null) {
                $("#edit_user_name").val(result.data.username);
            }
        }
    });
});

//编辑用户时,验证用户名不能为空,不能已存在
$("#edit_user_name").blur(function() {
    if ($("#edit_user_name").val() == "") {
        $("#edit_userN_note").text("");
        return;
    } /*else {
        $("#edit_userN_note").text("");
    }*/
    $('font').text("");
    $.ajax({
        url: '/eSight/admin/user/name/' + $("#edit_user_name").val(),
        data: '',
        cache: false,
        async: true,
        type: "GET",
        dataType: 'json',
        success: function(result) {
            if (result.result == "success") {
                if (result.data != null && result.data.dbid != dbid) {
                    $("#edit_userN_note").text("用户名已存在！");
                } else {
                    $("#edit_userN_note").text("");
                }
            } else {
                $("#edit_userN_note").text(result.reason);
            }
        }
    });

});
//编辑用户时,验证新密码不能为空
$("#edit_user_password").blur(function() {
    if ($("#edit_user_password").val() == "") {
        $("#edit_pwdN_note").text("");
    } else {
    	if($("#edit_user_password").val() != $("#edit_user_repassword").val()){
    		$("#edit_user_repassword_note").text("两次输入密码不一致！");
    	}else{
    		$("#edit_user_repassword_note").text("");
    	}
    	$("#edit_pwdN_note").text("");
    }
});
//编辑用户时,验证重复新密码不能为空
$("#edit_user_repassword").blur(function() {
    if ($("#edit_user_repassword").val() == "") {
        $("#edit_user_repassword_note").text("");
    } else {
    	if($("#edit_user_password").val() != $("#edit_user_repassword").val()){
    		$("#edit_user_repassword_note").text("两次输入密码不一致！");
    	}else{
    		$("#edit_user_repassword_note").text("");
    	}
    }
});

//编辑用户
/*$("#btn_userD_confirm").click(function() {
    if ($("#edit_user_name").val() == "" || $("#edit_user_password").val() == "" || $("#edit_userN_note").text() != "" || $("#edit_pwdN_note").text() != "") {
        alert("用户名或密码填写不正确！");
        return;
    }
    if(!validateLength($("#edit_user_password").val(),5,10)){
    	alert("密码长度应在5-10之间");
    	return;
    }
    if($("#edit_user_password").val() != $("#edit_user_repassword").val()){
		$("#edit_user_repassword_note").text("两次输入密码不一致！");
		return;
	}*/
$("#btn_userD_confirm").click(function() {
	$("#update_user_form").validate({
		rules: {
			username: {  required: true },
			password: {  required: true },
			repassword:{ required: true }
		},
		messages : {
			username : '<font style="color: #ee8262;">必填字段</font>',
			password : '<font style="color: #ee8262;">必填字段</font>',
			repassword : '<font style="color: #ee8262;">必填字段</font>'
		},
		invalidHandler : function(){
			return false;
		},
     
		submitHandler : function(){
    $.ajax({
        url: '/eSight/admin/user/edit',
        data: {
            "dbid": dbid,
            "username": $("#edit_user_name").val(),
            "password": $("#edit_user_password").val(),
            "repassword": $("#edit_user_repassword").val()
        },
        cache: false,
        async: true,
        type: "POST",
        dataType: 'json',
        success: function(result) {
            if (result != null && result.result == "success" && result.data != null) {
               /* $("#btn_userD_close").click();
                initTable();*/
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
//删除用户
$("#btn_user_delete").click(function() {
    isCheck();
    var r = confirm("确认要删除?");
    if (r == false) {
        return;
    }
    //var dbid = $(radio[0]).parent().parent().siblings("#dbid").text();
    $.ajax({
        url: '/eSight/admin/user/delete/' + dbid,
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

//打开角色管理界面
$("#btn_user_role").click(function() {
    isCheck();
    $.ajax({
        url: '/eSight/admin/user/findRole/' + dbid,
        data: '',
        cache: false,
        async: true,
        type: "GET",
        dataType: 'json',
        success: function(result) {
            //将字符串转换成jquery对象
            //var data = jQuery.parseJSON(result.data);
        	$("#role_modal_body").empty();
            var context = "<ul>";
            if (result.result == "success") {
                var data = result.data;
                if (data != null) {
                    for (var i = 0; i < data.length; i++) {
                        var da = data[i];
                        if (da == null || da == "undefined") {
                            continue;
                        }
                        if (i % 4 == 0) {
                            context += "<li class='dd-item' data-id=''>";
                        }
                        context += "<h6 class='col-md-3 no-padding ' style='margin: 0;'><label>";
                        if (da.isBlong) {
                            context += "<input class='checkbox style-0' type='checkbox' checked='checked' name='user_role_id' value='" + da.dbid + "' />";
                        } else {
                            context += "<input class='checkbox style-0' type='checkbox' name='user_role_id' value='" + da.dbid + "' />";
                        }
                        context += "<span class='semi-bold' id='" + da.dbid + "'>" + da.name + "</span>";
                        context += "</label></h6>";
                        if (i % 4 == 3 || i == data.length - 1) {
                            context += "</li>";
                        }
                    }
                }
            } else {
                context += result.reason;
            }
            context += "</ul>";
            $("#role_modal_body").append(context);
        }
    });
});

//编辑用户角色
$("#btn_user_role_confirm").click(function() {
    var roleIds = '';
    var cs = $('input[name="user_role_id"]:checkbox').filter(':checked');
    for (var i = 0; i < cs.length; i++) {
        var c = cs[i];
        roleIds += c.value + ",";
    }
    $.ajax({
        url: '/eSight/admin/user/saveRole',
        data: {
            "dbid": dbid,
            "roleIds": roleIds
        },
        cache: false,
        async: true,
        type: "POST",
        dataType: 'json',
        success: function(result) {
            if (result.result == "success") {
                alert("编辑成功！");
            } else {
                alert("编辑失败！");
            }
            $("#btn_user_role_close").click();
        }
    });
});