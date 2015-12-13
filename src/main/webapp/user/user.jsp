<%@page import="org.apache.commons.lang.StringUtils"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ include file="/commons/header.jsp" %>

		<!-- MAIN PANEL -->
		<div id="main" role="main">

			<!-- RIBBON -->
			<div id="ribbon">

				<span class="ribbon-button-alignment"> 
					<span id="refresh" class="btn btn-ribbon" data-action="resetWidgets" data-title="refresh"  rel="tooltip" data-placement="bottom" data-original-title="<i class='text-warning fa fa-warning'></i> Warning! This will reset all your widget settings." data-html="true">
						<i class="fa fa-refresh"></i>
					</span> 
				</span>

				<!-- breadcrumb -->
				<ol class="breadcrumb">
					<li>首页</li><li>系统管理</li><li>用户管理</li>
				</ol>
				<!-- end breadcrumb -->
			</div>
			<!-- END RIBBON -->

			<!-- MAIN CONTENT -->
			<div id="content">

				<div class="row">
					<div class="col-xs-12 col-sm-7 col-md-7 col-lg-4">
						<h1 class="page-title txt-color-blueDark">
							<i class="fa fa-table fa-fw "></i> 
								系统管理
							<span>> 
								用户管理
							</span>
						</h1>
					</div>
				</div>

				<!-- operation button begin-->
				<div class="row margin-bottom-5 col-sm-12 col-xs-12 col-md-12 col-lg-12">
				    <a id="btn_user_refresh" class="btn btn-default" href="javascript:void(0);"><i class="fa fa-refresh"></i></a>
				    <a id="btn_user_create" data-toggle="modal" data-target="#user_oper_modal" class="btn btn-primary" href="#"><i class="fa fa-plus-square"></i> 新增</a>
				    <a id="btn_user_edit" data-toggle="modal" data-target="#user_edit_modal" class="btn btn-default disabled" href="#"><i class="fa fa-edit"></i> 编辑</a>
				    <a id="btn_user_delete" class="btn btn-default disabled" href="javascript:void(0);"><i class="fa fa-trash-o"></i> 删除</a>
				    <a id="btn_user_role" data-toggle="modal" data-target="#user_role_modal" class="btn btn-default disabled" href="#"><i class="fa fa-user"></i> 角色管理</a>
				</div>
				
				
				<div class="modal fade in" id="user_oper_modal" tabindex="-1" role="dialog" aria-labelledby="user_oper_modal_label" aria-hidden="false" style="display: none;">
				<form id="create_user_form">
				    <div class="modal-dialog">
				        <div class="col-sm-12   col-xs-12 col-md-12 col-lg-12">
				            <div class="modal-content">
				                <div class="modal-header">
				                    <a class="close" href="#" data-dismiss="modal" aria-hidden="true">×</a>
				                    <h3 class="modal-title" id="user_oper_modal_label">新增</h3>
				                </div>
				                <div class="modal-body">
				                        <div id="create_user_modal" class="form-horizontal">
				                            <div class="form-group" id="create_userN_username_div">
				                                <label style="margin-top: 10px;" class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="create_user_name">用户名称：</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input style="margin-top: 10px;" class="form-control" id="create_user_name" maxlength="20" placeholder="" type="text" name="username">
				                                    <span class="help-block1" id="create_userN_block" for="create_user_name" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="create_userN_note"></span>
				                                </div>
				                                <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>
				                           <div class="form-group" id="create_userE_password_div">
				                                <label class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="create_user_password">密码：</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input class="form-control" id="create_user_password" placeholder="" maxlength="40" type="password" name="password">
				                                    <span class="help-block1" id="create_pwdN_block" for="create_user_password" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="create_pwdN_note"></span>
				                                </div>
				                               <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>
				                           <div class="form-group" id="create_userE_repassword_div">
				                                <label class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="create_user_repassword">重复密码：</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input class="form-control" id="create_user_repassword" placeholder="" maxlength="40" type="password" name="repassword">
				                                    <span class="help-block1" id="create_repwdN_block" for="create_user_repassword" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="create_repwdN_note"></span>
				                                </div>
				                               <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>				                            
				                        </div>
				                </div>
				                <div class="modal-footer">
				                    <button type="button" id="btn_close" class="btn btn-default" data-dismiss="modal">关闭</button>
				                    <button type="submit" id="btn_user_confirm" class="btn btn-primary" style="border:solid 1px #ccc;">确定</button>
				                </div>
				            </div>
				        </div>
				    </div>
				     </form>
				</div>
				
				
				<div class="modal fade" id="user_edit_modal" tabindex="-1" role="dialog" aria-labelledby="user_oper_modal_label" aria-hidden="true">
				<form id="update_user_form">
				    <div class="modal-dialog">
				        <div class="col-sm-12   col-xs-12 col-md-12 col-lg-12">
				            <div class="modal-content">
				                <div class="modal-header">
				                    <a class="close" href="#"  data-dismiss="modal" aria-hidden="true">&times;</a>
				                    <h3 class="modal-title" id="user_edit_modal_label">编辑用户信息</h3>
				                </div>
				               <div class="modal-body">
				                        <div id="user-edit-wizard-1" class="form-horizontal">
				                            <div class="form-group" id="edit_userN_div">
				                                <label style="margin-top: 10px;" class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="edit_user_name">用户名称：</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input style="margin-top: 10px;" class="form-control" id="edit_user_name" maxlength="20" placeholder="" type="text" name="username">
				                                    <span class="help-block1" id="edit_userN_block" for="edit_user_name" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="edit_userN_note"></span>
				                                </div>
				                                <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>
				                           <div class="form-group" id="edit_userNewPass_div">
				                                <label class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="edit_user_password">新密码：</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input class="form-control" id="edit_user_password" placeholder="" maxlength="40" type="password" name="password">
				                                    <span class="help-block1" id="edit_pwdN_block" for="edit_user_name" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="edit_pwdN_note"></span>
				                                </div>
				                               <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>
			                           		<div class="form-group" id="edit_user_repassword_div">
				                                <label class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="edit_user_old_password">重复新密码：</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input class="form-control" id="edit_user_repassword" placeholder="" maxlength="40" type="password" name="repassword">
				                                    <span class="help-block1" id="edit_user_repassword_block" for="edit_user_repassword" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="edit_user_repassword_note"></span>
				                                </div>
				                               <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>				                            
				                        </div>
				                </div>
				    
				                <div class="modal-footer">
				                    <button type="button" id="btn_userD_close" class="btn btn-default" data-dismiss="modal">关闭</button>
				                    <button type="submit" id="btn_userD_confirm" class="btn btn-primary" style="border:solid 1px #ccc;">确定</button>
				                </div>
				            </div>
				        </div>
				    </div>
				    </form>
				    
				</div>
				
				
				<div class="modal fade" id="user_role_modal" tabindex="-1" role="dialog" aria-labelledby="user_oper_modal_label" aria-hidden="true">
				    <div class="modal-dialog">
				        <div class="col-sm-12   col-xs-12 col-md-12 col-lg-12">
				            <div class="modal-content">
				                <div class="modal-header">
				                    <a class="close" href="#"  data-dismiss="modal" aria-hidden="true">&times;</a>
				                    <h3 class="modal-title" id="user_edit_modal_label">角色管理</h3>
				                </div>
				               <div id="role_modal_body" class="modal-body"></div>
				                <div class="modal-footer">
				                    <button type="button" id="btn_user_role_close" class="btn btn-default" data-dismiss="modal">关闭</button>
				                    <button type="button" id="btn_user_role_confirm" class="btn btn-primary" style="border:solid 1px #ccc;">确定</button>
				                </div>
				            </div>
				        </div>
				    </div>
				</div>
				<!-- operation button end-->
				<!-- widget grid -->
				<section id="widget-grid" class="">
				
					<!-- row -->
					<div class="row">
				
						<!-- NEW WIDGET START -->
						<article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				
							<!-- Widget ID (each widget will need unique ID)-->
							<div class="jarviswidget jarviswidget-color-darken" id="wid-id-0" data-widget-togglebutton="false" data-widget-colorbutton="false" data-widget-fullscreenbutton="false" data-widget-editbutton="false" data-widget-deletebutton="false">
								<header>
									<span class="widget-icon"> <i class="fa fa-table"></i> </span>
									<h2>用户列表 </h2>
								</header>
				
								<!-- widget div-->
								<div>
									<!-- widget edit box -->
									<div class="jarviswidget-editbox">
										<!-- This area used as dropdown edit box -->
				
									</div>
									<!-- end widget edit box -->
				
									<!-- widget content -->
									<div  id="user_table">
										<table id="dt_basic" class="table table-bordered table-striped table-condensed table-hover smart-form has-tickbox" width="100%">
											<thead>
												<tr>
													<th></th>
													<th data-class="expand"><i class="fa fa-fw fa-user text-muted hidden-md hidden-sm hidden-xs"></i> 用户名称</th>
													<th data-hide="phone,tablet"><i class="fa fa-fw fa-calendar txt-color-blue hidden-md hidden-sm hidden-xs"></i> 创建时间</th>
													<th data-hide="phone,tablet"><i class="fa fa-fw fa-calendar txt-color-blue hidden-md hidden-sm hidden-xs"></i> 修改时间</th>
												</tr>
											</thead>
										</table>
									</div>
								<!-- end widget content -->
				
								</div>
								<!-- end widget div -->
				
							</div>
							<!-- end widget -->

						</article>
						<!-- WIDGET END -->
				
					</div>
				
					<!-- end row -->
				
					<!-- end row -->
				
				</section>
				<!-- end widget grid -->

			</div>
			<!-- END MAIN CONTENT -->

		</div>
		<!-- END MAIN PANEL -->

		<%@ include file="/commons/footer.jsp" %>


		<!--================================================== -->

		<!-- PACE LOADER - turn this on if you want ajax loading to show (caution: uses lots of memory on iDevices)-->
		<script data-pace-options='{ "restartOnRequestAfter": true }' src="<%=basePath%>static_resources/js/plugin/pace/pace.min.js"></script>

		<!-- Link to Google CDN's jQuery + jQueryUI; fall back to local -->
		<script src="<%=basePath%>static_resources/js/google/jquery.min.js"></script>
		<script>
			if (!window.jQuery) {
				document.write('<script src="<%=basePath%>static_resources/js/libs/jquery-2.0.2.min.js"><\/script>');
			}
		</script>

		<script src="<%=basePath%>static_resources/js/google/jquery-ui.min.js"></script>
		<script>
			if (!window.jQuery.ui) {
				document.write('<script src="<%=basePath%>static_resources/js/libs/jquery-ui-1.10.3.min.js"><\/script>');
			}
		</script>

		<script src="<%=basePath%>static_resources/js/util/ehualu.date.format.js"></script>
		<script src="<%=basePath%>user/js/user.js"></script>
		
		<!-- IMPORTANT: APP CONFIG -->
		<script src="<%=basePath%>static_resources/js/app.config.js"></script>

		<!-- JS TOUCH : include this plugin for mobile drag / drop touch events-->
		<script src="<%=basePath%>static_resources/js/plugin/jquery-touch/jquery.ui.touch-punch.min.js"></script> 

		<!-- BOOTSTRAP JS -->
		<script src="<%=basePath%>static_resources/js/bootstrap/bootstrap.min.js"></script>

		<!-- CUSTOM NOTIFICATION -->
		<script src="<%=basePath%>static_resources/js/notification/SmartNotification.min.js"></script>

		<!-- JARVIS WIDGETS -->
		<script src="<%=basePath%>static_resources/js/smartwidgets/jarvis.widget.min.js"></script>

		<!-- EASY PIE CHARTS -->
		<script src="<%=basePath%>static_resources/js/plugin/easy-pie-chart/jquery.easy-pie-chart.min.js"></script>

		<!-- SPARKLINES -->
		<script src="<%=basePath%>static_resources/js/plugin/sparkline/jquery.sparkline.min.js"></script>

		<!-- JQUERY VALIDATE -->
		<script src="<%=basePath%>static_resources/js/plugin/jquery-validate/jquery.validate.min.js"></script>

		<!-- JQUERY MASKED INPUT -->
		<script src="<%=basePath%>static_resources/js/plugin/masked-input/jquery.maskedinput.min.js"></script>

		<!-- JQUERY SELECT2 INPUT -->
		<script src="<%=basePath%>static_resources/js/plugin/select2/select2.min.js"></script>

		<!-- JQUERY UI + Bootstrap Slider -->
		<script src="<%=basePath%>static_resources/js/plugin/bootstrap-slider/bootstrap-slider.min.js"></script>

		<!-- browser msie issue fix -->
		<script src="<%=basePath%>static_resources/js/plugin/msie-fix/jquery.mb.browser.min.js"></script>

		<!-- FastClick: For mobile devices -->
		<script src="<%=basePath%>static_resources/js/plugin/fastclick/fastclick.min.js"></script>

		<!--[if IE 8]>

		<h1>Your browser is out of date, please update your browser by going to www.microsoft.com/download</h1>

		<![endif]-->

		<!-- MAIN APP JS FILE -->
		<script src="<%=basePath%>static_resources/js/app.min.js"></script>

		<!-- ENHANCEMENT PLUGINS : NOT A REQUIREMENT -->
		<!-- Voice command : plugin -->
		<script src="<%=basePath%>static_resources/js/speech/voicecommand.min.js"></script>

		<!-- PAGE RELATED PLUGIN(S) -->
		<script src="<%=basePath%>static_resources/js/plugin/datatables/jquery.dataTables.min.js"></script>
		<script src="<%=basePath%>static_resources/js/plugin/datatables/dataTables.colVis.min.js"></script>
		<script src="<%=basePath%>static_resources/js/plugin/datatables/dataTables.tableTools.min.js"></script>
		<script src="<%=basePath%>static_resources/js/plugin/datatables/dataTables.bootstrap.min.js"></script>
		<script src="<%=basePath%>static_resources/js/plugin/datatable-responsive/datatables.responsive.min.js"></script>
		
		
		<script src="<%=basePath%>static_resources/js/util/validate.js"></script>

		<script type="text/javascript">
		
		// DO NOT REMOVE : GLOBAL FUNCTIONS!
		
		$(document).ready(function() {
			 
			pageSetUp();
			
			/*BEGIN MENU -- ADD BY TIANLI*/
			var cn = "<%=request.getParameter("cn")%>";
			$("#" + cn).addClass("active");
			$("#" + cn).parent().css("display", "block");
			$("#" + cn).parent().parent().addClass("open");
			/*END MENU -- ADD BY TIANLI*/
			
			/* // DOM Position key index //
		
			l - Length changing (dropdown)
			f - Filtering input (search)
			t - The Table! (datatable)
			i - Information (records)
			p - Pagination (paging)
			r - pRocessing 
			< and > - div elements
			<"#id" and > - div with an id
			<"class" and > - div with a class
			<"#id.class" and > - div with an id and class
			
			Also see: http://legacy.datatables.net/usage/features
			*/	
	
			/* BASIC ;*/
				var responsiveHelper_dt_basic = undefined;
				
				var breakpointDefinition = {
					tablet : 1024,
					phone : 480
				};
	
				initTable();
	
			/* END BASIC */
			
		});

		</script>

		<!-- Your GOOGLE ANALYTICS CODE Below -->
		<script type="text/javascript">
			var _gaq = _gaq || [];
			_gaq.push(['_setAccount', 'UA-XXXXXXXX-X']);
			_gaq.push(['_trackPageview']);
			
			(function() {
			var ga = document.createElement('script');
			ga.type = 'text/javascript';
			ga.async = true;
			ga.src = '<%=basePath%>static_resources/js/google/ga.js';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(ga, s);
			})();
		</script>

	</body>

</html>