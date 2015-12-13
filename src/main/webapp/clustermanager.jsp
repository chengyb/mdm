<%@page import="com.ehualu.esight.user.dao.hibernate.User"%>
<%@page import="com.ehualu.esight.menu.MenuProcessor"%>
<%@page import="com.ehualu.esight.menu.dao.hibernate.Menu"%>
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
					<li>首页</li><li>监控</li><li>集群管理</li>
				</ol>
				<!-- end breadcrumb -->
			</div>
			<!-- END RIBBON -->

			<!-- MAIN CONTENT -->
			<div id="content">
				<div class="row">
					<div class="col-xs-12 col-sm-7 col-md-7 col-lg-4">
						<h1 class="page-title txt-color-blueDark"><i class="fa-fw fa fa-home"></i> 监控 <span>> 集群管理</span></h1>
					</div>
				</div>
				<!-- operation button begin-->
				<div class="row margin-bottom-5 col-sm-12 col-xs-12 col-md-12 col-lg-12">
				    <a id="btn_db_table_refresh" class="btn btn-default" href="javascript:location.reload();"><i class="fa fa-refresh"></i></a>
				</div>
				<!-- operation button end-->				
				<!-- widget grid -->
				<section id="widget-grid" class="">
					<div class="row">
						<article class="col-sm-12 col-md-12">
							<div class="jarviswidget jarviswidget-color-darken" id="wid-id-1" data-widget-editbutton="false" data-widget-fullscreenbutton="false" data-widget-colorbutton="false" data-widget-deletebutton="false">
								<header>
									<span class="widget-icon"> <i class="fa fa-tasks fa-lg txt-color-darken"></i> </span>
									<h2>集群状态</h2>
								</header>
								<div>
						  			<div id="file_table">
										<table id="dt_basic" class="table table-bordered table-striped table-condensed table-hover" width="100%">
											<thead>
												<tr>	
													<th data-class="expand"><i class="fa fa-fw fa-user text-muted hidden-md hidden-sm hidden-xs"></i>主机名称</th>
													<th data-hide="phone,tablet"><i class="fa fa-fw fa-calendar txt-color-blue hidden-md hidden-sm hidden-xs"></i>ip地址</th>
													<th data-hide="phone,tablet"><i class="fa fa-fw fa-calendar txt-color-blue hidden-md hidden-sm hidden-xs"></i> 总大小</th>
													<th data-hide="phone,tablet"><i class="fa fa-fw fa-calendar txt-color-blue hidden-md hidden-sm hidden-xs"></i> dfs使用大小</th>
													<th data-hide="phone,tablet"><i class="fa fa-fw fa-calendar txt-color-blue hidden-md hidden-sm hidden-xs"></i> 非dfs使用大小</th>
													<th data-hide="phone,tablet"><i class="fa fa-fw fa-calendar txt-color-blue hidden-md hidden-sm hidden-xs"></i> block数目</th>
													<th data-hide="phone,tablet"><i class="fa fa-fw fa-calendar txt-color-blue hidden-md hidden-sm hidden-xs"></i> 状态</th>
												</tr>
											</thead>
										</table>
									</div>
								</div>
							</div>
						</article>
					</div>
					
				
					</div>

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

		<!-- Demo purpose only -->
		<script src="<%=basePath%>static_resources/js/demo.min.js"></script>

		<!-- MAIN APP JS FILE -->
		<script src="<%=basePath%>static_resources/js/app.min.js"></script>

		<!-- ENHANCEMENT PLUGINS : NOT A REQUIREMENT -->
		
		
		<!-- PAGE RELATED PLUGIN(S) -->
		<script src="<%=basePath%>static_resources/js/plugin/datatables/jquery.dataTables.min.js"></script>
		<script src="<%=basePath%>static_resources/js/plugin/datatables/dataTables.colVis.min.js"></script>
		<script src="<%=basePath%>static_resources/js/plugin/datatables/dataTables.tableTools.min.js"></script>
		<script src="<%=basePath%>static_resources/js/plugin/datatables/dataTables.bootstrap.min.js"></script>
		<script src="<%=basePath%>static_resources/js/plugin/datatable-responsive/datatables.responsive.min.js"></script>
		
		<script>
			$(document).ready(function() {

				// DO NOT REMOVE : GLOBAL FUNCTIONS!
				pageSetUp();
				
				/*BEGIN MENU -- ADD BY TIANLI*/
				var cn = "<%=request.getParameter("cn")%>";
				$("#" + cn).addClass("active");
				$("#" + cn).parent().css("display", "block");
				$("#" + cn).parent().parent().addClass("open");
				/*END MENU -- ADD BY TIANLI*/

				/*
				 * PAGE RELATED SCRIPTS
				 */

				$(".js-status-update a").click(function() {
					var selText = $(this).text();
					var $this = $(this);
					$this.parents('.btn-group').find('.dropdown-toggle').html(selText + ' <span class="caret"></span>');
					$this.parents('.dropdown-menu').find('li').removeClass('active');
					$this.parent().addClass('active');
				});

				
				// initialize sortable
				$(function() {
					$("#sortable1, #sortable2").sortable({
						handle : '.handle',
						connectWith : ".todo",
						update : countTasks
					}).disableSelection();
				});

				// check and uncheck
				$('.todo .checkbox > input[type="checkbox"]').click(function() {
					var $this = $(this).parent().parent().parent();

					if ($(this).prop('checked')) {
						$this.addClass("complete");

						// remove this if you want to undo a check list once checked
						//$(this).attr("disabled", true);
						$(this).parent().hide();

						// once clicked - add class, copy to memory then remove and add to sortable3
						$this.slideUp(500, function() {
							$this.clone().prependTo("#sortable3").effect("highlight", {}, 800);
							$this.remove();
							countTasks();
						});
					} else {
						// insert undo code here...
					}

				})
				// count tasks
				function countTasks() {

					$('.todo-group-title').each(function() {
						var $this = $(this);
						$this.find(".num-of-tasks").text($this.next().find("li").size());
					});

				}

				/*
				* RUN PAGE GRAPHS
				*/
				function getTableContent(targeUrl){
					var result;
					$.ajax({
				        url: targeUrl,
				        data: '',
				        cache: false,
				        async: false,
				        type: "GET",
				        dataType: 'json',
				        success: function(objs){
				        	result=objs;
				        }
				    });
					return result;
				}
				
				function formatSizeUnits(bytes){
					if      (bytes>=1000000000000) {bytes=(bytes/1000000000000).toFixed(2)+' TB';}
					else if      (bytes>=1000000000) {bytes=(bytes/1000000000).toFixed(2)+' GB';}
			        else if (bytes>=1000000)    {bytes=(bytes/1000000).toFixed(2)+' MB';}
			        else if (bytes>=1000)       {bytes=(bytes/1000).toFixed(2)+' KB';}
			        else if (bytes>1)           {bytes=bytes+' bytes';}
			        else if (bytes==1)          {bytes=bytes+' byte';}
			        else                        {bytes='0 byte';}
			        return bytes;
			}
				
				var myTable;
				function initTable(){
					var targetUrl = "http://10.2.171.6:50070/dfsnodelist.jsp?whatNodes=LIVE";
					var ldata = getTableContent(targetUrl);
					targetUrl = "http://10.2.171.6:50070/dfsnodelist.jsp?whatNodes=DEAD";
					var data = ldata.concat(getTableContent(targetUrl));
					myTable=$('#dt_basic').dataTable( {
						"bSort": false,
						"bPaginate": true,
						"data": data,
						/* "aoColumnDefs": [
							              {	  "targets": [ 1 ],
							                  "visible": false
							                  }
							           ], */
						"aoColumns":  [ {
							"mData" : "name"
						}, {
							"mData" : "url"
						},{
							"mData" : "total_size"
						},{
							"mData" : "dfs_used_size"
						},{
							"mData" : "non_dfs_used_size"
						}, {
							"mData" : "block_number"
						},{
							"mData" : "status"
						}],
						
						//行的回调函数
						 "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull) {
							var tds = $(nRow).find("td");
							for(var i=0; i<tds.length; i++){
								if(i==1){
									var str = aData.url;
									var patt1 = /\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}/g;
									var result = str.match(patt1);
									$(tds[i]).empty().append(result);
								}
								if(i==2){
									$(tds[i]).empty().append(formatSizeUnits(aData.total_size));
								}
								if(i==3) $(tds[3]).empty().append(formatSizeUnits(aData.dfs_used_size));
								if(i==4) $(tds[4]).empty().append(formatSizeUnits(aData.non_dfs_used_size));
								if(i==6) {
									if (aData.status == "In Service") $(tds[i]).empty().append("服务中");
									else $(tds[i]).empty().append("未启动");
								}
							} 
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
				initTable();
				/* 
				$("#dt_basic").on("click","tr",function(event){
				    if (myTable.fnGetData(this)["type"] == "dir"){
						var url = myTable.fnGetData(this)["url"];
				    	var data = getTableContent(url);
				    	myTable.fnClearTable();
				    	myTable.fnAddData(data);
				    	myTable.fnDraw();
				    }
				    if (myTable.fnGetData(this)["type"] == "file"){
				    	var url = myTable.fnGetData(this)["url"];
				    	var data = getTableContent(url);
				    	$("#file_name").html(data["name"]);
				    	$("#file_content").html(data["content"]);
				    	$("#file_content_modal").modal('toggle');
				    }
				}); */
			})

		</script>

		<%-- <!-- Your GOOGLE ANALYTICS CODE Below -->
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

		</script> --%>

	</body>

</html>