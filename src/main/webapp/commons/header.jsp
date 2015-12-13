<%@page import="com.chengyb.mdm.menu.valueobject.MenuInfo"%>
<%@page import="com.chengyb.mdm.user.valueobject.UserInfo"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
	
	UserInfo user = (UserInfo)session.getAttribute("user");
	/* User currentUser = (User)(request.getSession().getAttribute(AietlConstants.USER_INFO));
	
	Locale locale = (Locale) request.getSession().getAttribute("WW_TRANS_I18N_LOCALE"); */
	boolean isCn = true;
	/* if (Locale.US == locale)
		isCn = false;
 */
	
	String menu = null;
	MenuInfo root = (MenuInfo)session.getAttribute("menu");
	if (root != null) {
		menu = root.toHtml(request.getContextPath(), true, isCn);
	} else {
		menu = "用户没有登录，或者没有权限!";
	}
%>
<!DOCTYPE html>
<html lang="en-us">
	<head>
	<!-- Link to Google CDN's jQuery + jQueryUI; fall back to local -->
		<script src="<%=basePath%>static_resources/js/google/jquery.min.js"></script>
		<script>
			if (!window.jQuery) {
				document.write('<script src="<%=basePath%>static_resources/js/libs/jquery-2.0.2.min.js"><\/script>');
			}
		</script>

		<script src="<%=basePath%>static_resources/js/google/jquery-ui.min.js"></script>
		
		<script src="<%=basePath%>static_resources/js/util/validate.js"></script>
		<script>
			if (!window.jQuery.ui) {
				document.write('<script src="<%=basePath%>static_resources/js/libs/jquery-ui-1.10.3.min.js"><\/script>');
			}
		</script>
		
		
		
		<meta charset="utf-8">

		<title>北京互联网产品创业精英团</title>
		<meta name="description" content="">
		<meta name="author" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		<link rel="stylesheet" type="text/css" media="screen" href="<%=basePath%>static_resources/css/bootstrap.min.css">
		<link rel="stylesheet" type="text/css" media="screen" href="<%=basePath%>static_resources/css/font-awesome.min.css">
		<link rel="stylesheet" type="text/css" media="screen" href="<%=basePath%>static_resources/css/smartadmin-production.min.css">
		<link rel="stylesheet" type="text/css" media="screen" href="<%=basePath%>static_resources/css/smartadmin-skins.min.css">
		<link rel="stylesheet" type="text/css" media="screen" href="<%=basePath%>static_resources/css/bootstrap-datetimepicker.min.css">
		<link rel="stylesheet" type="text/css" media="screen" href="<%=basePath%>static_resources/css/demo.min.css">
		<link rel="shortcut icon" href="<%=basePath%>static_resources/img/favicon/favicon.ico" type="image/x-icon">
		<link rel="icon" href="<%=basePath%>static_resources/img/favicon/favicon.ico" type="image/x-icon">
		<link rel="stylesheet" href="<%=basePath%>static_resources/css/google-fonts.css">
		<link rel="apple-touch-icon" href="<%=basePath%>static_resources/img/splash/sptouch-icon-iphone.png">
		<link rel="apple-touch-icon" sizes="76x76" href="<%=basePath%>static_resources/img/splash/touch-icon-ipad.png">
		<link rel="apple-touch-icon" sizes="120x120" href="<%=basePath%>static_resources/img/splash/touch-icon-iphone-retina.png">
		<link rel="apple-touch-icon" sizes="152x152" href="<%=basePath%>static_resources/img/splash/touch-icon-ipad-retina.png">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<link rel="apple-touch-startup-image" href="<%=basePath%>static_resources/img/splash/ipad-landscape.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)">
		<link rel="apple-touch-startup-image" href="<%=basePath%>static_resources/img/splash/ipad-portrait.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)">
		<link rel="apple-touch-startup-image" href="<%=basePath%>static_resources/img/splash/iphone.png" media="screen and (max-device-width: 320px)">
		
		<style type="text/css">
			.monitor-list{float:left; width: 15% ;}
			.monitor-list a {float:left; width:90%}
			
			td.details-control {
    			background: url('<%=basePath%>static_resources/img/datatables-detail/details_open.png') no-repeat center center;
    			cursor: pointer;
			}
			tr.details td.details-control {
    			background: url('<%=basePath%>static_resources/img/datatables-detail/details_close.png') no-repeat center center;
			}
		</style>
		<script type="text/javascript">
			var cn = "<%=request.getParameter("cn")%>";
		</script>
		
	</head>
	<body class="">
		<!-- HEADER -->
		<header id="header">
			<div id="logo-group">
				<!-- PLACE YOUR LOGO HERE -->
				<span id="logo"> <img src="<%=basePath%>static_resources/img/logo.png" alt="SmartAdmin"> </span>
				<!-- END LOGO PLACEHOLDER -->
			</div>
		
			<!-- pulled right: nav area -->
			<div class="pull-right">
				<!-- collapse menu button -->
				<div id="hide-menu" class="btn-header pull-right">
					<span> <a href="javascript:void(0);" data-action="toggleMenu" title="伸缩菜单"><i class="fa fa-reorder"></i></a> </span>
				</div>
				<!-- end collapse menu -->
				
				<!-- #MOBILE -->
				<!-- logout button -->
				<div id="logout" class="btn-header transparent pull-right">
					<span> <a href="/eSight/admin/logout" title="注销" data-action="userLogout" data-logout-msg=""><i class="fa fa-sign-out"></i></a> </span>
				</div>
				<!-- end logout button -->
		
				<!-- search mobile button (this is hidden till mobile view port) -->
				<div id="search-mobile" class="btn-header transparent pull-right">
					<span> <a href="javascript:void(0)" title="Search"><i class="fa fa-search"></i></a> </span>
				</div>
				<!-- end search mobile button -->
		
				<!-- fullscreen button -->
				<div id="fullscreen" class="btn-header transparent pull-right">
					<span> <a href="javascript:void(0);" data-action="launchFullscreen" title="全屏"><i class="fa fa-arrows-alt"></i></a> </span>
				</div>
				<!-- end fullscreen button -->
				
				<div id="hide-editP" class="btn-header pull-right accessible" style="" pname="vendor_editPwd">
					<span>
						<a href="#" title="修改密码" data-toggle="modal" data-target="#changePassword_open_modal"><i class="fa  fa-pencil-square-o"></i></a>
					</span>
            	</div>
				
			</div>
				
				
			</div>
			<!-- end pulled right: nav area -->
		
		</header>
		<!-- END HEADER -->
		
		<div class="modal fade in" id="changePassword_open_modal" tabindex="-1" role="dialog" aria-labelledby="user_oper_modal_label" aria-hidden="false" style="display: none;">
				    <div class="modal-dialog">
				        <div class="col-sm-12   col-xs-12 col-md-12 col-lg-12">
				            <div class="modal-content">
				                <div class="modal-header">
				                    <a class="close" href="#" data-dismiss="modal" aria-hidden="true">×</a>
				                    <h3 class="modal-title" id="user_oper_modal_label">修改密码</h3>
				                </div>
				                <div class="modal-body">
				                        <div id="create_user_modal" class="form-horizontal">
				                            <div class="form-group" id="create_userN_div">
				                                <label style="margin-top: 10px;" class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="create_user_name">旧密码</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input style="margin-top: 10px;" class="form-control" id="oldPassword" maxlength="20" placeholder="请输入旧密码" type="password" name="oldPassword">
				                                    <span class="help-block1" id="create_userN_block" for="create_user_name" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="change_oldPassword_note"></span>
				                                </div>
				                                <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>
				                           <div class="form-group" id="create_userE_div">
				                                <label class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="create_user_password">新密码</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input class="form-control" id="newPassword" placeholder="请输入新密码" maxlength="40" type="password" name="newPassword">
				                                    <span class="help-block1" id="create_pwdN_block" for="create_user_name" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="change_newPassword_note"></span>
				                                </div>
				                               <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>
				                            <div class="form-group" id="create_userP_div">
				                                <label class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="create_role_desc">确认新密码</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input class="form-control" id="againNewPassword" placeholder="请输入确认新密码" maxlength="40" type="password" name="againNewPassword">
				                                    <span class="help-block1" id="create_role_desc_block" for="create_role_desc" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="change_againNewPassword_note"></span>
				                                </div>
				                               <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>
				                        </div>
				                </div>
				                <div class="modal-footer">
				                    <button type="button" id="btn_close" class="btn btn-default" data-dismiss="modal">关闭</button>
				                    <button type="button" id="btn_userChangePas_confirm" class="btn btn-primary" style="border:solid 1px #ccc;">确定</button>
				                </div>
				            </div>
				        </div>
				    </div>
				</div>
		
		
		<!-- Left panel : Navigation area -->
		<!-- Note: This width of the aside area can be adjusted through LESS variables -->
		<aside id="left-panel">

			<!-- User info -->
			<div class="login-info">
				<span> <!-- User image size is adjusted inside CSS, it should stay as it --> 
					
					<a href="javascript:void(0);" id="show-shortcut" data-action="toggleShortcut">
						<img src="<%=basePath%>static_resources/img/avatars/male.png" alt="me" class="online" /> 
						<span>
							<%=user.getUsername_() %> 
						</span>
						<i class="fa fa-angle-down"></i>
					</a> 
					
				</span>
			</div>
			<!-- end user info -->

			<!-- NAVIGATION : This navigation is also responsive

			To make this navigation dynamic please make sure to link the node
			(the reference to the nav > ul) after page load. Or the navigation
			will not initialize.
			-->
			<nav><ul class="sf-menu" id="menus"></ul></nav>
			<span class="minifyme" data-action="minifyMenu"> 
				<i class="fa fa-arrow-circle-left hit"></i> 
			</span>

		</aside>
		<!-- END NAVIGATION -->
		
		<script type="text/javascript">
			function findChildren(da,dbid){
				$.each( da, function(i, n){
					var urlPath = "/eSight" + n.urlPath;
					if(n.urlPath==null || n.urlPath==""){
						urlPath = "#";
					}
				    if(n.parentId!=null && n.parentId==dbid){
					  	if(isHaveChild(da,n.dbid)){
					  		var content = "<li id=\"m-" + n.dbid+"\" dbid=\"" + n.dbid + "\"><a href=\"" +  urlPath
					  			+ "\"><i class=\"fa fa-lg fa-fw fa-arrow-right\"></i> "
					  			+ n.name + "<b class=\"collapse-sign\"><em class=\"fa fa-minus-square-o\"></em></b></a>";
					  		content += "<ul id=\"menu_"+n.dbid+ "_children\"></ul>";
					  		content += "</li>";
					  		//对一级菜单排序
					  		//设置游标，初始值为首页的dbid
					  		var after_cursor = 0;
					  		//查找当前菜单列表里有多少个菜单
					  		var siblingMenus = $("#menus").children("li");
					  		//遍历
							for(var i=0;i<siblingMenus.length;i++){
								//已有菜单的dbid
								var smdbid = $(siblingMenus[i]).attr("dbid");
								//如果要插入的菜单的dbid大于循环节点的值，说明应该插入到循环节点的后面
								if(n.dbid > smdbid){
									//如果游标的值小于循环节点的值，证明要插入的菜单优先级要改变了
									if(after_cursor < smdbid ){
										after_cursor = smdbid
									}
								}
							}
							$("#m-" + after_cursor).after(content);
					  		findChildren(da,n.dbid);
					  	}else{
					  		var content = "<li id=\"m-" + n.dbid + "\"><a href=\"" + urlPath + "?cn=m-" + n.dbid
					  			+ "\"><i class=\"fa fa-lg fa-fw fa-desktop\"></i> "
					  			+ n.name + "</a>";
					  		$("#menu_" + n.parentId + "_children").append(content);
					  	}
				    }
				});
			}

			function isHaveChild(da,dbid){
				var isHave = false;
				$.each(da, function(i, n){
			 		if(n.parentId!=null && n.parentId==dbid){
			 			isHave = true;
			 			return false;	
			 		}
				});
				return isHave;
			}
		    $.ajax({
		        url: "/eSight/admin/menu/listByUser",
		        data: '',
		        cache: true,
		        async: false,
		        type: "GET",
		        dataType: 'json',
		        success: function(result) {
		            if (result.result == "success" && result.data != null) {
		            	
		            	var indexPage = "<li id=\"m-0\" dbid=\"0\"><a href=\"/eSight/admin/dashboard?cn=m-0\" title=\"Dashboard\"><i class=\"fa fa-lg fa-fw fa-home\"></i> <span class=\"menu-item-parent\">首页</span></a></li>"
		            			$("#menus").append(indexPage);
		            	findChildren(result.data,"-1");	
		            } else {
		                alert("加载导航菜单失败！");
		            }
		        }
		    }); 
		</script>
		
		</body>
		</html>