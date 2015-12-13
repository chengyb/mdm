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
					<li>首页</li><li>系统管理</li><li>角色管理</li>
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
								角色管理
							</span>
						</h1>
					</div>
				</div>
				
							
				<!-- operation button begin-->
				<div class="row margin-bottom-5 col-sm-12 col-xs-12 col-md-12 col-lg-12">
				    <a id="btn_role_refresh" class="btn btn-default" href="javascript:void(0);"><i class="fa fa-refresh"></i></a>
				    <a id="btn_role_create" data-toggle="modal" data-target="#role_create_modal" class="btn btn-primary" href="#"><i class="fa fa-plus-square"></i> 新增</a>
				    <a id="btn_role_edit" data-toggle="modal" data-target="#role_edit_modal" class="btn btn-default disabled" href="#"><i class="fa fa-edit"></i> 编辑</a>
				    <a id="btn_role_delete" class="btn btn-default disabled" href="javascript:void(0);"><i class="fa fa-trash-o"></i> 删除</a>
				</div>
				
				
			<div class="modal fade in" id="role_create_modal" tabindex="-1" role="dialog" aria-labelledby="role_create_modal_label" aria-hidden="false" style="display: none;">
				<form id="roleForm" >
				    <div class="modal-dialog" style="width:1000px">
				        <div class="col-sm-12   col-xs-12 col-md-12 col-lg-12">
				            <div class="modal-content">
				                <div class="modal-header">
				                    <a class="close" href="#" data-dismiss="modal" aria-hidden="true">×</a>
				                    <h3 class="modal-title" id="user_oper_modal_label">新增</h3>
				                </div>
				                <div class="modal-body">
				                        <div id="role_create_modal_body1" class="form-horizontal">
				                            <div class="form-group" id="create_roleN_div">
				                                <label style="margin-top: 10px;" class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="create_role_name">角色名称：</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input style="margin-top: 10px;" class="form-control" id="create_role_name" maxlength="20" placeholder="" type="text" name="create_role_name">
				                                    <span class="help-block1" id="create_userN_block" for="create_role_name" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="create_role_name_note"></span>
				                                </div>
				                                <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>
				                           <div class="form-group" id="create_roleE_div">
				                                <label class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="create_role_desc">角色描述：</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input class="form-control" id="create_role_desc" placeholder="" maxlength="40" type="text" name="create_role_desc">
				                                    <span class="help-block1" id="create_role_desc_block" for="create_role_desc" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="create_role_desc_note"></span>
				                                </div>
				                               <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>
				                            <div class="form-group" id="create_roleM_div" name="create_roleM_div">
				                                <label class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="create_role_menu">关联菜单：</label>
				                                <a href="javascript:void(0);" onclick="allMenuChecked(true)" class="btn btn-default">全选</a>
				                               	<a href="javascript:void(0);" onclick="allMenuChecked(false)" class="btn btn-default">全不选</a>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 " id="create_role_modal_menus" style="padding-left: 16%; width: 92%;"></div>
				                                <font style="padding-left: 16%;color:red;width: 100%;text-align: left;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1">*至少选择一项</font>
				                            </div>
				                         </div>
				                      
				                </div>
				                <div class="modal-footer">
				                    <button type="button" id="btn_close" class="btn btn-default" data-dismiss="modal">关闭</button>
				                    <button type="submit" id="btn_role_confirm" class="btn btn-primary" style="border:solid 1px #ccc;">确定</button>
				                </div>
				            </div>
				        </div>
				    </div>
				    </form>
				</div>
				
				
			<div class="modal fade" id="role_edit_modal" tabindex="-1" role="dialog" aria-labelledby="role_edit_modal_label" aria-hidden="true">
				<form id="update_roleForm">
				    <div class="modal-dialog" style="width:1000px">
				        <div class="col-sm-12   col-xs-12 col-md-12 col-lg-12">
				            <div class="modal-content">
				                <div class="modal-header">
				                    <a class="close" href="#"  data-dismiss="modal" aria-hidden="true">&times;</a>
				                    <h3 class="modal-title" id="user_edit_modal_label">编辑角色信息</h3>
				                </div>
				               <div class="modal-body">
				                        <div id="create_user_modal_body1" class="form-horizontal">
				                            <div class="form-group" id="edit_roleN_div">
				                                <label style="margin-top: 10px;" class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="create_role_name">角色名称：</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input style="margin-top: 10px;" class="form-control" id="edit_role_name" maxlength="20" placeholder="" type="text" name="edit_role_name">
				                                    <span class="help-block1" id="edit_userN_block" for="edit_role_name" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="edit_role_name_note"></span>
				                                </div>
				                                <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>
				                           <div class="form-group" id="edit_roleE_div">
				                                <label class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="edit_role_desc">角色描述：</label>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
				                                    <input class="form-control" id="edit_role_desc" placeholder="" maxlength="40" type="text" name="edit_role_desc">
				                                    <span class="help-block1" id="edit_role_desc_block" for="edit_role_desc" style="color:#B94A48"></span>
				                                    <span class="note note-error" id="edit_role_desc_note"></span>
				                                </div>
				                               <font style="margin-top: 8px;color:red;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
				                            </div>
				                            <div class="form-group" id="edit_roleM_div">
				                                <label class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label" for="create_role_menu" >关联菜单：</label>
				                               	<a href="javascript:void(0);" onclick="allMenuChecked(true)" class="btn btn-default">全选</a>
				                               	<a href="javascript:void(0);" onclick="allMenuChecked(false)" class="btn btn-default">全不选</a>
				                                <div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 " id="role_edit_modal_menus" style="padding-left: 16%; width: 92%;"></div>
				                                <font style="padding-left: 16%;color:red;width: 100%;text-align: left;" class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1">*至少选择一项</font>
				                            </div>
				                        </div>
				                </div>
				                <div class="modal-footer">
				                    <button type="button" id="btn_roleE_close" class="btn btn-default" data-dismiss="modal">关闭</button>
				                    <button type="submit" id="btn_role_edit" class="btn btn-primary" style="border:solid 1px #ccc;">确定</button>
				                </div>
				            </div>
				        </div>
				    </div>
				</form>
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
									<h2>角色列表 </h2>
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
													<th data-class="expand"><i class="fa fa-fw fa-user text-muted hidden-md hidden-sm hidden-xs"></i> 描述</th>
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
		<!-- http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js -->
		<script src="<%=basePath%>static_resources/js/google/jquery.min.js"></script>
		<script>
			if (!window.jQuery) {
				document.write('<script src="<%=basePath%>static_resources/js/libs/jquery-2.0.2.min.js"><\/script>');
			}
		</script>
		<!-- http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js -->
		<script src="<%=basePath%>static_resources/js/google/jquery-ui.min.js"></script>
		<script>
			if (!window.jQuery.ui) {
				document.write('<script src="<%=basePath%>static_resources/js/libs/jquery-ui-1.10.3.min.js"><\/script>');
			}
		</script>

		<script src="<%=basePath%>static_resources/js/util/ehualu.date.format.js"></script>
		<script src="<%=basePath%>role/js/role.js"></script>
		
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