	//获取数据类型，用于显示下拉列表
	function getDataType(data){
		var response = typeof(data) == "string"?jQuery.parseJSON(data):data;
		return response;
	}
	
	//字段列表的新增、修改、删除的处理
	function process(){
		var t1 = JSON.stringify($("#fieldsTable").jqGrid("getRowData"));
		//var cols = $("#fieldsTable").jqGrid("getRowData");
			//JSON.parse(t1);
		var tableId = $("#rowId").val();
		var tableData = $("#tables").jqGrid("getRowData", tableId);//获取对应的表信息
		var rowData = {
				tableName:tableData["tableName"],
				tableNameMaping:tableData["tableNameMaping"],
				comment:tableData["comment"],
				flag:"",
				cause:"",
				col:t1
		}
		$("#tables").jqGrid('setRowData', tableId, rowData);
	}
	
	//对批量新增字段表的新增、修改和删除操作的处理
	function batchProcess(){
		var addFields = JSON.stringify($("#addfieldsTable").jqGrid("getRowData"));
			//$.toJSON($("#addfieldsTable").jqGrid("getRowData"));
		//将批量新增字段表中的数据存放在隐藏字段中
		$("#filedsJson").val(addFields);
	}
	
	//获取表单数据
	function getFormData(formObj){
		var data = formObj.serializeArray();
		json = {};
		for (i in data) {
			json[data[i].name] = data[i].value;
		} 
		return json;
	}