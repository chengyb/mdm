var data_infos = null;
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