<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%	String tp = request.getContextPath();
	String tbp = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ tp + "/";
%>
<!DOCTYPE html>
<html lang="en-us">
<head>
	<meta charset="utf-8">
	<title>易云大数据分布式计算平台</title>
	<meta name="description" content="">
	<meta name="author" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
	<link rel="stylesheet" type="text/css" media="screen" href="<%=tbp%>static_resources/css/esight.style.css">
	<script src="<%=tbp%>js/tree_bootstrap_curd.js"></script>
</head>
<body class="">
	
	<!-- tree button demo begin -->
	<!-- <div class="btn-group">
		<a class="btn btn-default disabled" href="javascript:void(0);">更多操作</a>
		<a class="btn btn-default disabled dropdown-toggle"
			data-toggle="dropdown" href="javascript:void(0);"><span
			class="caret"></span></a>
		<ul class="dropdown-menu" style="min-width: 104px;">
			<li><a id="btn_tree_create" data-toggle="modal"
				data-target="#add_tree_modal" href="#">新增节点</a></li>
			<li><a id="btn_tree_rename" data-toggle="modal"
				data-target="#edit_tree_modal" href="#">节点改名</a></li>
			<li><a id="btn_tree_delete" href="#">删除节点</a></li>
			<li><a id="btn_tree_cut" href="#">剪切节点</a></li>
			<li><a id="btn_tree_paste" href="#">粘贴节点</a></li>
			<li class="divider"></li> 
				<li><a href="javascript:void(0);">Separated link</a></li>
		</ul>
	</div> -->
	<!-- tree button demo end -->
	
	<!-- tree demo begin -->
	<!-- <div class="tree smart-form" id="tree_div"
		style="width: 20%; float: left;">
		<ul>
			<li id="tree_root_li" did="0"><span id="tree_root" onclick="clickTree('0')"><i
					class="fa fa-lg fa-folder-open"></i> 目录树</span>
				<ul></ul></li>
		</ul>
	</div> -->
	<!-- tree demo end -->
	
	
	<!-- tree add/edit begin -->
	<div class="modal fade" id="add_tree_modal" tabindex="-1" role="dialog"
		aria-labelledby="tree_oper_modal_label" aria-hidden="true">
		<div class="modal-dialog">
			<div class="col-sm-12 col-xs-12 col-md-12 col-lg-12">
				<div class="modal-content">
					<div class="modal-header">
						<a class="close" href="#" data-dismiss="modal" aria-hidden="true">&times;</a>
						<h3 class="modal-title" id="add_tree_modal_label">新增</h3>
					</div>
					<div class="modal-body">
						<div id="add-tree-wizard" class="form-horizontal">
							<div class="form-group" id="add_tree_div">
								<label style="margin-top: 10px;"
									class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label"
									for="add_tree_name">名称：</label>
								<div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
									<input style="margin-top: 10px;" class="form-control"
										id="add_tree_name" maxlength="20" placeholder="" type="text"
										name="dbName"> <span class="help-block1"
										id="add_tree_block" for="add_tree_name" style="color:#B94A48"></span>
									<span class="note note-error" id="add_tree_note" style="color:red"></span>
								</div>
								<font style="margin-top: 8px;color:red;"
									class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
							</div>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" id="btn_add_tree_close"
							class="btn btn-default" data-dismiss="modal">关闭</button>
						<button type="button" id="btn_add_tree_confirm"
							class="btn btn-primary" style="border:solid 1px #ccc;">确定</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	<div class="modal fade" id="edit_tree_modal" tabindex="-1" role="dialog"
		aria-labelledby="tree_oper_modal_label" aria-hidden="true">
		<div class="modal-dialog">
			<div class="col-sm-12 col-xs-12 col-md-12 col-lg-12">
				<div class="modal-content">
					<div class="modal-header">
						<a class="close" href="#" data-dismiss="modal" aria-hidden="true">&times;</a>
						<h3 class="modal-title" id="edit_tree_modal_label">改名</h3>
					</div>
					<div class="modal-body">
						<div id="edit_tree_wizard" class="form-horizontal">
							<div class="form-group" id="edit_tree_div">
								<label style="margin-top: 10px;"
									class="col-md-2 col-xs-2 col-sm-2 col-lg-2  control-label"
									for="edit_tree_name">新名称：</label>
								<div class="col-md-9 col-xs-9 col-sm-9 col-lg-9 ">
									<input style="margin-top: 10px;" class="form-control"
										id="edit_tree_name" maxlength="20" placeholder="" type="text"
										name="treeName"> <span class="help-block1"
										id="edit_tree_block" for="edit_tree_name" style="color:#B94A48"></span>
									<span class="note note-error" id="edit_tree_note"></span>
								</div>
								<font style="margin-top: 8px;color:red;"
									class="control-label col-md-1 col-xs-1 col-sm-1 col-lg-1  text-center">*</font>
							</div>
						</div>
					</div>
	
					<div class="modal-footer">
						<button type="button" id="btn_edit_tree_close"
							class="btn btn-default" data-dismiss="modal">关闭</button>
						<button type="button" id="btn_edit_tree_confirm"
							class="btn btn-primary" style="border:solid 1px #ccc;">确定</button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- tree add/edit end -->
	
	<!-- tree javascript begin -->
	<script type="text/javascript">
		//var treeType = "METADATA";
		//generateTree($("#tree_root"), 0, treeType);
		//树节点点击事件
	/* 	function clickTree(id) {
			console.log(id);
		} */
		//增加树节点
		$("#btn_add_tree_confirm").on("click", function() {
			var cn = getCurrentNode();
			var name = $("#add_tree_name").val();
			if(name == "" || name == null){
				$("#add_tree_note").html("*名称不能为空");
				return;
			}
			$("#add_tree_note").html("");
			var index = $(cn).parent().children("ul").length;
			var parentId = $(cn).parent().attr("did");
			addNode(name, index, parentId, treeType);
			$("#btn_add_tree_close").click();
		});
		//删除树节点
		$("#btn_tree_delete").on("click", function() {
			if(confirm("确认要删除该目录吗？")){
				var cn = getCurrentNode();
				removeNode($(cn).parent().attr("did"));	
			}
		});
		//编辑节点名称
		$("#btn_edit_tree_confirm").on("click", function() {
			var cn = getCurrentNode();
			editNodeName($(cn).parent().attr("did"), $("#edit_tree_name").val());
			$("#btn_edit_tree_close").click();
		});
		//剪切节点
		$("#btn_tree_cut").on("click", function() {
			var cutn = getCurrentNode();
			setCutNode(cutn);
		});
		//粘贴节点
		$("#btn_tree_paste").on("click", function() {
			var index = 0;
			pasteNode(index);
		});
	</script>
	<!-- tree javascript end -->
</body>