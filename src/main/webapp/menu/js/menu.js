//每条菜单的id
var dbid = "";
//1-10的正则表达式
var regu = /^[1-9|10]$/;
var re = new RegExp(regu);

//按钮控制
function submitOparation(obj){
    var obj_checked = obj.checked;
    $("input[name='checkbox-inline']:checkbox").attr("checked", false);
    obj_checked?obj.checked=true:obj.checked=false;
    
    if (obj_checked) {
    	dbid = obj.value;
        $("#btn_menu_edit, #btn_menu_delete").removeClass("btn-default").removeClass("disabled").addClass("btn-primary");
    } else {
    	dbid = "";
    	$("#btn_menu_edit, #btn_menu_delete").addClass("btn-default").addClass("disabled").removeClass("btn-primary");
    }
}

//判断是否选中一行菜单记录
function isCheck() {
    var checkedNumbers = $('input[name="checkbox-inline"]').filter(':checked');
    if (dbid == "" || !checkedNumbers.length) {
        alert("请先选中一行！");
        return;
    }
}


//刷新列表
$("#btn_menu_refresh").click(function() {
	location.reload();
});


//初始化数据表格
function initTable(){
	$('#dt_basic').dataTable( {
		"bServerSide": true,
		"bSort": false,
		"bPaginate": true, //翻页功能
		"sPaginationType": "full_numbers",
		"sAjaxSource": "/eSight/admin/menu/listMenu",
		"aoColumns":  [ {
			"data" : null
		},{   
			"data": null
		},{   
			"data": null
		},{
			"data" : "name"
		}, {
			"data" : "nameEn"
		} , {
			"data" : "urlPath"
		} , {
			"data" : "description"
		}],
		//行的回调函数
		"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
			var pName = "";
			var pDbid = "";
			if(null != aData.parent && null != aData.parent.name) {
				pName = aData.parent.name;
				pDbid = aData.parent.dbid;
			}
			if(null == aData.name) aData.name = "";
			if(null == aData.nameEn) aData.nameEn = "";
			if(null == aData.urlPath) aData.urlPath = "";
			if(null == aData.description) aData.description = "";
			var str = "";
			str += "<td><label class='checkbox'><input type='checkbox' name='checkbox-inline' onclick='submitOparation(this)' value='" + aData.dbid + "'/><i></i></label></td>";
			if(pDbid  == ""){
				str += "<td>一级菜单</td>";
			}else if(pDbid == "-1"){
				str += "<td>二级菜单</td>";
			}else{
				str += "<td>三级菜单</td>";
			}
			str += 
			"<td id='"+pDbid+"'>" + pName + "</td>" +
			"<td>" + aData.name + "</td>" +
			"<td>" + aData.nameEn + "</td>" +
			"<td>" + aData.urlPath + "</td>" +
			"<td>" + aData.description + "</td>";
			
			$(nRow).empty().append(str);	
			submitOparation($(aData).find("checkbox"));
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

//打开"新增"页面，联动展示菜单
function showMenu(){
	var content = '<select class="form-control" id="parentLevel" onchange="">';
	if("two" == $("#level").val()){
		content += '<option value="-1">--根菜单--</option></select>';
		$("#sub_menu").html(content);
	}else{
		$.ajax({
			url : '/eSight/admin/menu/subMenu',
			data : '',
			cache : false,
			async : true,
			type : "GET",
			dataType : 'json',
			success : function(result) {
				if("success" == result.result){
					var data = result.data;
					for(var i=0; i<data.length; i++){
						content += '<option value="'+data[i].dbid+'">'+data[i].name+'</option>';
					}
					content += '</select>';
					$("#sub_menu").html(content);
				}
			}
		});
	}
}


//添加用户
$("#btn_menu_confirm").click(function() {
	//var selectedVal = $("#add_parentLevel").find("option:selected").val();
	//form校验规则
	$("#addMenuForm").validate({
        rules: {
        	add_level: {  required: true },
        	add_parentLevel:{ required: true },
        	add_create_menu_name:{ required: true },
        	add_create_menu_urlPath:{ required: true },
			
        },
        messages: {
        	add_level: '<font style="color: #ee8262;">必填字段</font>',
        	add_parentLevel: '<font style="color:#ee8262;">必填字段</font>',
        	add_create_menu_name: '<font style="color: #ee8262;">必填字段</font>',
        	add_create_menu_urlPath: '<font style="color: #ee8262;">必填字段</font>',
        	
		},
        invalidHandler : function(){
            return false;
         },
        submitHandler : function(){
    $.ajax({
        url: '/eSight/admin/menu/addMenu/',
        data: {
            "parentId": $("#add_parentLevel").val(),
            "name": $("#add_create_menu_name").val(),
            "nameEn": $("#create_menu_nameEn").val(),
            "urlPath": $("#add_create_menu_urlPath").val(),
            "description": $("#create_menu_description").val(),
        },
        cache: false,
        async: true,
        type: "POST",
        dataType: 'json',
        success: function(result) {
            $("#btn_close").click();
            if (result.result == "success") {
            	location.reload();
            } else {
                alert("添加失败！");
            }

        }
    });
	 return false;//阻止表单提交

      }
	});
	});

//添加界面
$("#btn_menu_create").click(function() {
    $("em").children("font").text("");
});



//点击"编辑",打开菜单编辑界面
$("#btn_menu_edit").click(function() {
	var td = $(":checkbox:checked").parent().parent().parent().children("td:eq(2)");//找出父级菜单名称的td
	console.log(td.attr("id"));
    isCheck();
    $.ajax({
        url: '/eSight/admin/menu/' + dbid,
        data: '',
        cache: false,
        async: true,
        type: "GET",
        dataType: 'json',
        success: function(resultObj) {
            	console.log(resultObj);
            	var content = '<select class="form-control" id="edit_two_level" name="edit_two_level">';
            	if(dbid == '-1'){//根菜单
            		content += '<option value="">--无父菜单--</option></select>';
            		$("#two_menu").html(content);
            	}else if(td.attr("id") == '-1'){//父级菜单是根菜单
            		content += '<option value="-1">--根菜单--</option></select>';
            		$("#two_menu").html(content);
            	}else{
	            	//展示二级菜单
	            	$.ajax({
	        			url : '/eSight/admin/menu/subMenu',
	        			data : '',
	        			cache : false,
	        			async : true,
	        			type : "GET",
	        			dataType : 'json',
	        			success : function(result) {
	        				if("success" == result.result){
	        					var data = result.data;
	        					for(var i=0; i<data.length; i++){
	        						if(td.attr("id") == data[i].dbid){//当选择的菜单id和请求的id一样时,则selected
	        							content += '<option value="'+data[i].dbid+'" selected>'+data[i].name+'</option>';
	        						}else{
	        							content += '<option value="'+data[i].dbid+'">'+data[i].name+'</option>';
	        						}
	        					}
	        					content += '</select>';
	        					$("#two_menu").html(content);
	        				}
	        			}
	        		});
            	}
            	$("#edit_menu_name").val(resultObj.name);
            	$("#edit_menu_nameEn").val(resultObj.nameEn);
            	$("#edit_menu_urlPath").val(resultObj.urlPath);
            	$("#edit_menu_description").val(resultObj.description);
            	$("em").children("font").text("");
        }
    });
});

//点击"确定",编辑菜单
$("#btn_menu_confirm").click(function(){
	//form校验规则
	$("#editMenuForm").validate({
        rules: {
        	edit_two_level: {  required: true },
        	edit_menu_name:{ required: true },
        	edit_menu_urlPath:{ required: true },
			
        },
        messages: {
        	edit_two_level: '<font style="color: #ee8262;">必填字段</font>',
        	edit_menu_name: '<font style="color: #ee8262;">必填字段</font>',
        	edit_menu_urlPath: '<font style="color: #ee8262;">必填字段</font>',
        	
		},
        invalidHandler : function(){
            return false;
         },
        submitHandler : function(){
	$.ajax({
        url: '/eSight/admin/menu/editMenu/',
        data: {
            "parentId": $("#edit_two_level").val(),
            "dbid" : dbid,
            "name": $("#edit_menu_name").val(),
            "nameEn": $("#edit_menu_nameEn").val(),
            "urlPath": $("#edit_menu_urlPath").val(),
            "description": $("#edit_menu_description").val(),
        },
        cache: false,
        async: true,
        type: "POST",
        dataType: 'json',
        success: function(result) {
            $("#btn_userD_close").click();
            if (result.result == "success") {
            	location.reload();
            } else {
//                alert("编辑失败！");
            }
        }
      
    });
        }
//         return false;//阻止表单提交
 });
});


//删除菜单
$("#btn_menu_delete").click(function() {
    isCheck();
    var td = $(":checkbox:checked").parent().parent().parent().children("td:eq(2)");//找出父级菜单名称的td
    
    $.ajax({
        url: '/eSight/admin/menu/' + dbid,
        data: '',
        cache: false,
        async: true,
        type: "GET",
        dataType: 'json',
        success: function(resultObj) {
        	if( (td.attr("id") == '-1'&&resultObj.children.length!=0) || dbid == '-1'){//父菜单是根菜单且有孩子的菜单不能删,根菜单不能删
            	confirm("无法删除,请重新选择三级菜单");
            }else{
        		var r = confirm("确认要删除?");
        		if (r == false) {
        			return;
        		}
        		$.ajax({
        			url : '/eSight/admin/menu/delete/' + dbid,
        			data : '',
        			cache : false,
        			async : true,
        			type : "DELETE",
        			dataType : 'json',
        			success : function(result) {
        				if (result.result == "success") {
        					location.reload();
        				} else {
        					alert("删除失败！");
        				}
        			}
        		});
            }
        }
    });
});



/*$("#create_menu_name").blur(function(){
	console.log($("#create_menu_name").val());
	if(!isNumber($("#create_menu_name").val())){
		alert("输入数字");
	}
});*/