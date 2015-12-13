var jsTreeHome = basePath + "static_resources/js/jstree";

(function () {
	if (jQuery && jQuery.editDir) {
		return;
	}
	
	(function($){
		//注册元素的jquery扩展--selectDir
		$.fn.editDir = function(settings) {
			
			var defaultSettings = {		//默认参数，可以通过传入的settings重置
				rootTitle : "Root"					//根节点的名称
			};
			
			var opts = $.extend(defaultSettings, settings);
			var dirType = opts.dirType;
			if (dirType == null) {
				alert("没有定义dirType!");
				return false;
			}
			
			this.each(function() {
				$(this)
				// call `.jstree` with the options object
				.jstree(
						{
							// the `plugins` array allows you to configure the active plugins on this instance
							"plugins" : 
								["themes","json_data","ui","crrm","cookies","dnd","search","types","hotkeys","contextmenu", "unique"],
							// each plugin you have included can have its own config object
							"json_data" : { 
								"data" : [
											{
												data : opts.rootTitle, 
												state : "closed",
												attr : {id : 0, rel : "drive"}
											}
										],
								// This tree is ajax enabled - as this is most common, and maybe a bit more complex
								// All the options are almost the same as jQuery's AJAX (read the docs)
								"ajax" : {
									async : false,
									type: 'GET',
									// the URL to fetch the data
									"url" : "/eSight/admin/dir/findRoot",
									// the `data` function is executed in the instance's scope
									// the parameter is the node being loaded 
									// (may be -1, 0, or undefined when loading the root nodes)
									"data" : function (n) { 
										// the result is fed to the AJAX request `data` option
										//alert("getting");
										return {
											type : dirType,
											id : n.attr ? n.attr("id").replace("node_","") : 0
										}; 
									},
									"success" : function (data) {
											if (data.jsonResults != null && data.jsonResults.length > 0) {
												return eval(data.jsonResults);	
											}
											return "";
									}
								}
							},
							// Using types - most of the time this is an overkill
							// read the docs carefully to decide whether you need types
							"types" : {
								// I set both options to -2, as I do not need depth and children count checking
								// Those two checks may slow jstree a lot, so use only when needed
								"max_depth" : -2,
								"max_children" : -2,
								// I want only `drive` nodes to be root nodes 
								// This will prevent moving or creating any other type as a root node
								"valid_children" : [ "drive" ],
								"types" : {
									// The default type
									"default" : {
										// I want this type to have no children (so only leaf nodes)
										// In my case - those are files
										//"valid_children" : "none",
									},
									// The `folder` type
									"folder" : {
										// can have files and other folders inside of it, but NOT `drive` nodes
										"valid_children" : [ "default", "folder" ]
									},
									// The `drive` nodes 
									"drive" : {
										// can have files and folders inside, but NOT other `drive` nodes
										"valid_children" : [ "default", "folder" ],
										"icon" : {
											"image" : jsTreeHome + "/themes/root.png"
										},
										// those prevent the functions with the same name to be used on `drive` nodes
										// internally the `before` event is used
										"start_drag" : false,
										"move_node" : false,
										"delete_node" : false,
										"remove" : false
									}
								}
							},
							// UI & core - the nodes to initially select and open will be overwritten by the cookie plugin

							// the UI plugin - it handles selecting/deselecting/hovering nodes
							"ui" : {
								// this makes the node with ID node_4 selected onload
								"initially_select" : [ "0" ]
							},
							// the core plugin - not many options here
							"core" : { 
								// just open those two nodes up
								// as this is an AJAX enabled tree, both will be downloaded from the server
								//load_open : true
							},
							"unique" : {
								"error_callback" : function (n, p, f) {
									alert("Duplicate node `" + n + "` with function `" + f + "`!");
									//$.jstree.rollback(data.rlbk);
								}
							}
						// it makes sense to configure a plugin only if overriding the defaults
						})
				// EVENTS
				// each instance triggers its own events - to process those listen on the container
				// all events are in the `.jstree` namespace
				// so listen for `function_name`.`jstree` - you can function names from the docs
				.bind("loaded.jstree", function(event, data) {
					// you get two params - event & data - check the core docs for a detailed description
				})
				.bind("open_node.jstree", function (event, data) {
					//var children = data.rslt.obj.children();
					//if (children.length > 0) {
					//	$.each(children, function (i, child) { 
					//		alert(child);
					//	});
					//}
					 //alert($("#" + treeDiv).jstree("_get_children", data.rslt));
				})
				.bind("select_node.jstree", function (event, data) { 
					// `data.rslt.obj` is the jquery extended node that was clicked
					//selectDirId = data.rslt.obj.attr("id");
					//$("#queryForm").submit();
					if (opts.onSelectNode != null)
						opts.onSelectNode(event, data);
				})
				.bind("create.jstree",
						function(e, data) {
					//alert("test:"+data.rslt.parent.attr());
							$.get("/eSight/admin/dir/addDir", {
								//"operation" : "create_node",
								"parentId" : data.rslt.parent.attr("id").replace("node_", ""),
								"index" : data.rslt.position,
								"name" : data.rslt.name,
								//"type" : data.rslt.obj.attr("rel")
								"type" : dirType
							},
									function(r) {
										if (r.errMsg == null || r.errMsg.length == 0) {
											$(data.rslt.obj).attr("id", "node_" + r.id);
										} else {
											alert(r.errMsg);
											$.jstree.rollback(data.rlbk);
										}
									});
						})
				.bind("rename.jstree", function(e, data) {
					$.get("/eSight/admin/dir/renameDir", {
						"id" : data.rslt.obj.attr("id").replace("node_", ""),
						"name" : data.rslt.new_name
					}, function(r) {
						if (r.errMsg != null && r.errMsg.length > 0) {
							alert(r.errMsg);
							$.jstree.rollback(data.rlbk);
						}
					});
				})
				.bind("delete_node.jstree", function(e, data) {
					try {
						$.get("/eSight/admin/dir/delDir", {
							"id" : data.rslt.obj.attr("id").replace("node_", "")
						}, function(r) {
							if (r.errMsg != null && r.errMsg.length > 0) {
								alert(r.errMsg);
								$.jstree.rollback(data.rlbk);
							}
						});
					} catch(err)
					{
						alert(err);
					}
				})
				.bind("move_node.jstree",
						function(e, data) {
							data.rslt.o.each(function(i) {
										$.ajax({
													async : false,
													type : 'POST',
													url : "/eSight/admin/dir/moveDir",
													data : {
														"id" : $(this).attr("id").replace("node_", ""),
														"parentId" : data.rslt.cr === -1 ? 1
																: data.rslt.np.attr("id").replace("node_", ""),
														"index" : data.rslt.cp + i
														//"title" : data.rslt.name,
														//"copy" : data.rslt.cy ? 1 : 0
													},
													success : function(r) {
														if (r.errMsg != null && r.errMsg.length > 0) {
															alert(r.errMsg);
															$.jstree.rollback(data.rlbk);
														} else {
															$(data.rslt.oc).attr("id", "node_" + r.id);
															if (data.rslt.cy
																	&& $(data.rslt.oc).children("UL").length) {
																data.inst.refresh(data.inst._get_parent(data.rslt.oc));
															}
														}
														//$("#analyze").click();
													}
												});
									});
						});
		// INSTANCES
		// 1) you can call most functions just by selecting the container and calling `.jstree("func",`
		setTimeout(function() {
			$("#dirDiv").jstree("set_focus");
		}, 500);
		// with the methods below you can call even private functions (prefixed with `_`)
		// 2) you can get the focused instance using `$.jstree._focused()`. 
		//setTimeout(function() {
		//	$.jstree._focused().select_node("#phtml_1");
		//}, 1000);
		// 3) you can use $.jstree._reference - just pass the container, a node inside it, or a selector
		//setTimeout(function() {
		//	$.jstree._reference("#phtml_1").close_node("#phtml_1");
		//}, 1500);
		// 4) when you are working with an event you can use a shortcut
		$("#dirDiv").bind("open_node.jstree", function(e, data) {
			// data.inst is the instance which triggered this event
			//alert(data.inst);
		});
		//setTimeout(function() {
		//	$.jstree._reference("#phtml_1").open_node("#phtml_1");
		//}, 2500);
			});
			
			
			
		};
	})(jQuery); 

})();