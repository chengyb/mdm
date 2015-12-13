<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!-- PAGE FOOTER -->
<div class="page-footer">
	<div class="row">
		<div class="col-xs-12 col-sm-6">
			<span class="txt-color-white">Copyright © 2013-2016 ehualu.com All rights reserved</span>
		</div>

		<div class="col-xs-6 col-sm-6 text-right hidden-xs">
			<div class="txt-color-white inline-block">
				<i class="txt-color-redLight hidden-mobile">版权所有：<i class="fa fa-clock-o"></i> <strong>北京互联网产品创业精英团出品&nbsp;</strong> </i>
			</div>
		</div>
	</div>
</div>
<script type="text/javascript">
				
				$("#oldPassword").blur(function(){
					if($("#oldPassword").val() == ""){
						$("#change_oldPassword_note").text("旧密码不能为空");
					}else{
						$("#change_oldPassword_note").text("");
					}
				});
				
				$("#newPassword").blur(function(){
					if($("#newPassword").val() == ""){
						$("#change_newPassword_note").text("新密码不能为空");
					}else{
						$("#change_newPassword_note").text("");
					}
				});
				
				$("#againNewPassword").blur(function(){
					if($("#againNewPassword").val() == ""){
						$("#change_againNewPassword_note").text("确认密码不能为空");
					}else{
						$("#change_againNewPassword_note").text("");
					}
				});
				
				
				$("#againNewPassword").blur(function(){
					var newPassword = $("#newPassword").val();
					var againNewPassword = $("#againNewPassword").val();
					if(newPassword != againNewPassword){
						alert("确认密码输入错误,请重新输入");
					}else{
						return;
					}
				});

				$("#btn_userChangePas_confirm").click(function(){
					if(!validateLength($("#oldPassword").val(),5,10)){
				    	alert("密码长度应在5-10之间");
				    	return;
				    }
					if(!validateLength($("#newPassword").val(),5,10)){
				    	alert("密码长度应在5-10之间");
				    	return;
				    }
					if(!validateLength($("#againNewPassword").val(),5,10)){
				    	alert("密码长度应在5-10之间");
				    	return;
				    }
					$.ajax({
						url : '/eSight/admin/chgPwd/',
						data : {
							"oldPassword": $("#oldPassword").val(),
				            "newPassword": $("#newPassword").val()
						},
						cache : false,
						type : "POST",
						dataType : 'json',
						success : function(result){
							$("#btn_close").click();
				            if (result.result == "success" && result.data != null) {
				            	alert("修改成功！");
				            	location.reload();
				            } else {
				                alert("修改失败！原因可能是旧密码输入错误");
				            }
						}
					});
				});
				
				$(document).ready(function() {
					/*BEGIN MENU -- ADD BY TIANLI*/
					var cn = "<%=request.getParameter("cn")%>";
					$("#" + cn).addClass("active");
					$("#" + cn).parent().css("display", "block");
					$("#" + cn).parent().parent().addClass("open");
					/*END MENU -- ADD BY TIANLI*/
				});
</script>
<!-- END PAGE FOOTER -->