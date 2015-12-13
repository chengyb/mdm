var jsTreeHome = basePath + "static_resources/js/jstree";

(function () {
	if (jQuery && jQuery.selectDir) {
		return;
	}
	
	(function($){
		//注册元素的jquery扩展--selectDir
		$.fn.selectDir = function(settings) {
			var defaultSettings = {		//默认参数，可以通过传入的settings重置
				dialogSetting : {		//框体的参数，参见jqueryUI的dialog配置说明
					autoOpen : false,					//自动打开
					height : 500,						//高
					width : 350,						//宽
					modal : true,						//是否是modal窗口
					buttons : {							//按钮
						Submit : settings.submitFunc == null ? function() {			//提交，可以自定义函数
							var selectNodes = $("#" + treeDiv).jstree("get_selected");
							if (selectNodes.length > 0) {
								var selectedId = selectNodes.attr("id");
								var selectedName = $("#" + treeDiv).jstree("get_text", selectNodes);
								if (dirIdHolder != null)
									$("#" + dirIdHolder).val(selectedId);
								if (dirNameHolder != null)
									$("#" + dirNameHolder).val(selectedName);
								$(this).dialog("close");
							} else {
								alert("还没有选择记录！");
								return false;
							}
						} : settings.submitFunc,
						Cancel : function() {			//取消并关闭
							$(this).dialog("close");
						}
					}
				},
				treeSetting : {							//目录树的参数
					rootTitle : "Root",					//根节点的名称
					enableCheckBox : false,				//是否显示checkbox
					checkbox : {						//checkbox的配置，参见jstree的checkbox plugin说明。当enableCheckBox=true时生效
						checked_parent_open : true,		//是否自动选择父节点
						two_state : false				//是否只有选中和不选中两种状态（还有全选和取消全选状态）
					}
				}
			};
			
			var opts = $.extend(defaultSettings, settings);
			//是否以弹出对话框的形式显示
			var isDialog = opts.isDialog;
			//外部保存所选目录id
			var dirIdHolder = opts.dirIdHolder;
			var dirNameHolder = opts.dirNameHolder;
			//树div的名称
			var treeDiv = opts.treeDiv;
			//目录的类型，必填
			var dirType = opts.dirType;
			if (treeDiv == null) {
				alert("没有定义treeDiv!");
				return false;
			}
			if (dirType == null) {
				alert("没有定义dirType!");
				return false;
			}
			if(isDialog == null || isDialog != false){				
				this.each(function() {
					// init dialog
					$(this).dialog(opts.dialogSetting);
				});
			}
			
			var treeSetting = {
					// the `plugins` array allows you to configure the
					// active plugins on this instance
					"plugins" : [ "themes", "json_data", "ui", "cookies", "types" ],
					// each plugin you have included can have its own
					// config
					// object
					"json_data" : {
						"data" : [ {
							data : opts.treeSetting.rootTitle,
							state : "closed",
							attr : {
								id : 0,
								rel : "drive"
							}
						} ],
						// This tree is ajax enabled - as this is most
						// common, and maybe a bit more complex
						// All the options are almost the same as
						// jQuery's
						// AJAX (read the docs)
						"ajax" : {
							async : false,
							type : 'GET',
							// the URL to fetch the data
							"url" : "/eSight/admin/dir/findRoot",
							// the `data` function is executed in the
							// instance's scope
							// the parameter is the node being loaded
							// (may be -1, 0, or undefined when loading
							// the
							// root nodes)
							"data" : function(n) {
								// the result is fed to the AJAX request
								// `data` option
								// alert("getting");
								return {
									type : dirType,
									id : n.attr ? n.attr("id").replace("node_", "") : 0
								};
							},
							"success" : function(data) {
								if (data.jsonResults != null
										&& data.jsonResults.length > 0) {
									return eval(data.jsonResults);
								}
								return "";
							}
						}
					},
					// Using types - most of the time this is an
					// overkill
					// read the docs carefully to decide whether you
					// need
					// types
					"types" : {
						// I set both options to -2, as I do not need
						// depth
						// and children count checking
						// Those two checks may slow jstree a lot, so
						// use
						// only when needed
						"max_depth" : -2,
						"max_children" : -2,
						// I want only `drive` nodes to be root nodes
						// This will prevent moving or creating any
						// other
						// type as a root node
						"valid_children" : [ "drive" ],
						"types" : {
							// The default type
							"default" : {
							// I want this type to have no children (so
							// only
							// leaf nodes)
							// In my case - those are files
							// "valid_children" : "none",
							},
							// The `drive` nodes
							"drive" : {
								// can have files and folders inside,
								// but
								// NOT other `drive` nodes
								"valid_children" : [ "default",
										"folder" ],
								"icon" : {
									"image" : jsTreeHome
											+ "/themes/root.png"
								},
								// those prevent the functions with the
								// same
								// name to be used on `drive` nodes
								// internally the `before` event is used
								"check_node" : false,
								"start_drag" : false,
								"move_node" : false,
								"delete_node" : false,
								"remove" : false
							}
						}
					},
					// UI & core - the nodes to initially select and
					// open
					// will be overwritten by the cookie plugin

					// the UI plugin - it handles
					// selecting/deselecting/hovering nodes
					"ui" : {
						// this makes the node with ID node_4 selected
						// onload
						"initially_select" : [ "0" ]
					},
					// the core plugin - not many options here
					"core" : {
					// just open those two nodes up
					// as this is an AJAX enabled tree, both will be
					// downloaded from the server
					// load_open : true
					}
				// it makes sense to configure a plugin only if
				// overriding
				// the defaults
					
					
				};
			
			if (opts.treeSetting.enableCheckBox) {
				treeSetting.plugins.push("checkbox");
				treeSetting.checkbox = opts.treeSetting.checkbox;
			}
			
			$("#" + treeDiv).jstree(treeSetting)
			.bind("open_node.jstree", function (event, data) {
				if(opts.treeSetting.openNodeFunc != null) {
					opts.treeSetting.openNodeFunc.call(null, event, data);
				}
			}).bind("select_node.jstree", function (event, data) { 
				// `data.rslt.obj` is the jquery extended node that was clicked
				//selectDirId = data.rslt.obj.attr("id");
				//$("#queryForm").submit();
				if (opts.treeSetting.onSelectNode != null)
					opts.treeSetting.onSelectNode(event, data);
			});
			// INSTANCES
			// 1) you can call most functions just by selecting the container and
			// calling `.jstree("func",`
			setTimeout(function() {
				$("#" + treeDiv).jstree("set_focus");
			}, 500);
		};
	})(jQuery); 

})();
