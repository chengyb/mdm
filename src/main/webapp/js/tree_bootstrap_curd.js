var data_infos = null;

/**
 * 当前选中的节点
 */
var current_obj = null;

/**
 * 生成树
 * @param obj
 * @param id
 * @param type: DATAFLOW,METADATA,PLATFORM,SCH_JOB,SCH_JOB_FLOW 
 */
function generateTree(obj,id,type) {
	$.ajax({
		url : '/eSight/admin/dir/findAllTree',
		data : {
			'type' : type,
			'id' : id
		},
		cache : false,
		async : false,
		type : "GET",
		dataType : 'json',
		success : function(result) {
			cid = id;
			if (result.jsonResults != null) {
				var v_jsonResult = result.jsonResults;
				var v_infos = eval(v_jsonResult);
				data_infos = v_infos;
				getcontext(v_infos, "null");
				$(obj).next("ul").append(v_tempcontext);
			}
		}
	});
}

var v_tempcontext = "";
function getcontext(v_infos,v_parentid){
	var v_array=new Array();
	for(var i=0; i<v_infos.length; i++){
		if(v_parentid==v_infos[i].attr.parentid){
			v_array.push(v_infos[i]);
		}
	}
	for(var i=0; i<v_array.length; i++){
		v_tempcontext += "<li style=\"display:none\" id=\"" + v_array[i].attr.id
		+ "\" did=\"" + v_array[i].attr.id
 		+ "\"><span onclick=\"clickTree('"+v_array[i].attr.id+"','" + v_array[i].data + "')\"><i ";
		if(v_array[i].leaf=='false'){//不是叶子节点
			v_tempcontext += "class=\"fa fa-lg fa-plus-circle\"";
			v_tempcontext += "></i> " + v_array[i].data + "</span>";
			
			v_tempcontext += "<ul>";
			getcontext(v_infos,v_array[i].attr.id);
			v_tempcontext += "</ul>";
		}else{
			v_tempcontext += "class=\"icon-leaf\"";
			v_tempcontext += "></i> " + v_array[i].data + "</span>";
		}
		v_tempcontext += "</li>";
	}
}

function getTreeArray(){
	return data_infos;
}

/**
 * 返回this对象
 * @returns
 */
function getCurrentNode(){
	return current_obj;
}

/**
 * 在当前选中的节点下增加子节点
 * @param name 名称
 * @param index 在父节点下的序号
 * @param parentId 父节点id
 * @param type 节点类型
 */
function addNode(name,index,parentId,type){
	$.ajax({
		url : '/eSight/admin/dir/addDir',
		data : {
			'name' : name,
			'index' : index,
			'parentId' : parentId,
			'type' : type
		},
		cache : false,
		async : false,
		type : "GET",
		dataType : 'json',
		success : function(result) {
			if(result.result == "success"){
				var id = result.data.dbid;
				var context = "";
				//当前节点没有子节点时
				if($(current_obj).parent().has("ul").length == 0){
					context = "<ul role=\"group\"><li id=\"" + id + "\" did=\"" + id 
							+ "\" style=\"display: list-item;\"><span onclick=\"clickTree('" + id 
							+ "','" + name 
							+ "')\"><i class=\"icon-leaf\"></i> " + name 
							+ "</span></li></ul>";
					$(current_obj).parent().append(context).addClass("parent_li").attr('role', 'treeitem');
					$(current_obj).children("i").removeClass().addClass("fa fa-lg fa-minus-circle");
				}else{
					//当前节点有子节点且打开
					if($(current_obj).children("i").attr("class").indexOf("fa-minus-circle") > -1){
						context = "<li id=\"" + id + "\" did=\"" + id 
								+ "\" style=\"display: item;\"><span onclick=\"clickTree('" 
								+ id + "','" + name 
								+ "')\"><i class=\"icon-leaf\"></i> " + name 
								+ "</span></li>";
						$(current_obj).parent().children("ul").append(context);
					//当前节点有子节点且关闭
					}else{
						context = "<li id=\"" + id + "\" did=\"" + id 
								+ "\" style=\"display: none;\"><span onclick=\"clickTree('" 
								+ id + "','" + name 
								+ "')\"><i class=\"icon-leaf\"></i> " + name 
								+ "</span></li>";
						$(current_obj).parent().children("ul").append(context);
					}
				}
			}else{
				alert(result.reason);
			}
		},
		error: function (msg) {
            alert("服务器错误!");
        }
	});
	
	
}

/**
 * 删除当前选中节点
 * @param id 节点id
 */
function removeNode(id){
	$.ajax({
		url : '/eSight/admin/dir/delDir',
		data : {
			'id' : id
		},
		cache : false,
		async : false,
		type : "GET",
		dataType : 'json',
		success : function(result) {
			if(result.result == "success"){
				if($(current_obj).parent().siblings().length == 0){
					var pspan = $(current_obj).parent().parent().parent().children("span");
					pspan.html("<i class=\"icon-leaf\"></i>" + pspan.text());
					pspan.parent().removeClass("parent_li");
					$(current_obj).parent().parent().remove();
				}else{
					$(current_obj).parent().remove();
				}
			}else{
				alert(result.reason);
			}
		},
		error: function (msg) {
            alert("服务器错误!");
        }
	});
}

/**
 * 修改当前选中节点的名称
 * @param id 节点id
 * @param newName 节点新名称
 */
function editNodeName(id,newName){
	$.ajax({
		url : '/eSight/admin/dir/renameDir',
		data : {
			'id' : id,
			'name' : newName
		},
		cache : false,
		async : false,
		type : "GET",
		dataType : 'json',
		success : function(result) {
			if(result.result == "success"){
				var html = $(current_obj).html().replace($(current_obj).text(),"");
				html += newName;
				$(current_obj).html(html);
			}else{
				alert(result.reason);
			}
		},
		error: function (msg) {
            alert("服务器错误!");
        }
	});
}

var cutNode = null;
//JQUERY对象
var cutNodeParentLi = null;
function setCutNode(cutnode){
	cutNode = cutnode;
	cutNodeParentLi = $(cutnode).parent().parent().parent();
}
function getCutNode(cutnode){
	return cutNode;
}
jQuery.fn.isChildOf = function(b){ 
	return (this.parents(b).length > 0); 
}; 
	
function isChildOf(a,b){
	return (a.parents(b).length > 0); 
}	
function pasteNode(index){
	if(cutNode == null){
		alert("当前未剪切节点!");
		return;
	}

	if(cutNode == current_obj){
		alert("目标节点不能为剪切节点!");
		return;
	}
	if(isChildOf($(current_obj),"#"+$(cutNode).parent().attr("did"))){
		alert("目标节点不能为被剪切节点的子节点!");
		return;
	}

	//选中span的父节点（li标签）的id
	var id = $(cutNode).parent().attr("id");
	var parentId = $(current_obj).parent().attr("did");
	var parent_Id = $(current_obj).parent().attr("id");
	$.ajax({
		url : '/eSight/admin/dir/moveDir',
		data : {
			'id' : id,
			'parentId' : parentId,
			'index' : index
		},
		cache : false,
		async : false,
		type : "POST",
		dataType : 'json',
		success : function(result) {
			if(result.result == "success"){
				$(current_obj).parent().addClass("parent_li");
				if($(current_obj).parent().has("ul").length == 0){
					$(current_obj).parent().append("<ul role='group'></ul>");
				}
				
				var children = $(current_obj).parent('li.parent_li').find(' > ul > li');
				if(children.is(':visible')){
					$(cutNode).parent().show();
					$(current_obj).children("i").removeClass("icon-leaf").addClass("fa fa-lg fa-minus-circle");
				}else{
					$(cutNode).parent().hide();
					$(current_obj).children("i").removeClass("icon-leaf").addClass("fa fa-lg fa-plus-circle");
				}
				
				$(cutNode).parent().appendTo("#" + parent_Id + " ul:first");
				
				if(cutNodeParentLi.children("ul").children("li").length == 0){
					cutNodeParentLi.children("span").children("i").removeClass("fa fa-lg fa-minus-circle").addClass("icon-leaf");
				}
			}else{
				alert(result.reason);
			}
		},
		error: function (msg) {
            alert("服务器错误!");
        }
	});

}


$(document).ready(function() {
	$('.tree > ul').attr('role', 'tree').find('ul').attr('role', 'group');
	$('.tree').find('li:has(ul)').addClass('parent_li').attr('role', 'treeitem').find(' > span').attr('title', 'Collapse this branch').on('click', function(e) {
		var children = $(this).parent('li.parent_li').find(' > ul > li');
		if (children.is(':visible')) {
			children.hide('fast');
			$(this).attr('title', 'Expand this branch').find(' > i').removeClass().addClass('fa fa-lg fa-plus-circle');
		} else {
			children.show('fast');
			$(this).attr('title', 'Collapse this branch').find(' > i').removeClass().addClass('fa fa-lg fa-minus-circle');
		}
		e.stopPropagation();
	});	
	
	/**
	 * 点击使树节点高亮
	 */
	$(".tree").find("span").on("click",function(){
		$(".tree span").removeClass("pickonspan");
		$(this).addClass("pickonspan");	
		current_obj = this;
		$(".btn-group").children("a").removeClass("disabled").removeClass("btn-default").addClass("btn btn-primary");
	});
	
	$(".tree").on("click","span",function(e){
		$(".tree span").removeClass("pickonspan");
		$(this).addClass("pickonspan");	
		current_obj = this;
		$(".btn-group").children("a").removeClass("disabled").removeClass("btn-default").addClass("btn btn-primary");
		var children = $(this).parent('li.parent_li').find(' > ul > li');
		if (children.is(':visible')) {
			children.hide('fast');
			if($(this).parent().has("ul").length > 0){
				$(this).attr('title', 'Expand this branch').find(' > i').removeClass().addClass('fa fa-lg fa-plus-circle');
			}
		} else {
			children.show('fast');
			if($(this).parent().has("ul").length > 0){
				$(this).attr('title', 'Collapse this branch').find(' > i').removeClass().addClass('fa fa-lg fa-minus-circle');
			}
		}
		e.stopPropagation();
	});
});
