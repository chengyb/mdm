
var feildGrid = function(url, girdTitle, girdPaper, feildGrid, feildListName, editable, addable, delable, hiddenNames, visibleNames) {
	
	this.url = url;
	this.girdTitle = girdTitle;
	this.girdPaper = girdPaper;
	this.feildGrid = feildGrid;
	this.feildListName = feildListName;
	this.editable = editable;
	this.addable = addable;
	this.delable = delable;
	this.hiddenNames = hiddenNames;
	this.visibleNames = visibleNames;
	
	//根据url刷新表格数据
	this.reloadData = function (url) {
		feildGrid.jqGrid("setGridParam", {
			url : url
		}).trigger('reloadGrid');
	};
	
	this.clearData = function() {
		feildGrid.jqGrid("clearGridData");
	};
	
	var dataTypes;
	var roundingModes;
	
	var dimensions;
	
	$.ajax({
         url: loadDataTypeUrl,
         type: "POST",
         dataType: "json",
         async: false,
         data :{},
         success: function(data){
         	var split = "";
         	$.each(data.data, function(key, value){
         		dataTypes += split + key + ":" + value;
         		split = ";";
         	});
         },
         error: function(){
             alert("获取数据类型失败！");
         }
    });
	
	$.ajax({
        url: loadRoundingModeUrl,
        type: "POST",
        dataType: "json",
        async: false,
        data :{},
        success: function(data){
        	var split = "";
        	$.each(data.data, function(key, value){
        		roundingModes += split + key + ":" + value;
        		split = ";";
        	});
        },
        error: function(){
            alert("获取舍位类型失败！");
        }
    });
	
	$.ajax({
        url: loadDimensionUrl,
        type: "POST",
        dataType: "json",
        async: false,
        data :{},
        success: function(data){
        	var split = "";
        	$.each(data.data, function(key, value){
        		dimensions += split + key + ":" + value;
        		split = ";";
        	});
        },
        error: function(){
            alert("获取维度数据失败！");
        }
    });
	 
	var columns = [ {
		name : "index",
		index : "index",
		label : "序号",
		align : "right",
		width : 60,
		sortable : false
	}, {
		name : "name",
		index : "name",
		label : "名称",
		cellEdit : true,
		editable : editable,
		sortable : false
	}, {
		name : "value",
		index : "value",
		label : "值",
		editable : true,
		sortable : false
	}, {
		name : "type",
		index : "type",
		label : "类型",
		editable : editable,
		edittype:"select",
		editoptions:{value:dataTypes},
		sortable : false
	}, {
		name : "visible",
		index : "visible",
		label : "是否输出",
		editable : editable,
		edittype : "checkbox",
		editoptions : {value:"Yes:No"},
		sortable : false
	}, {
		name : "toEnv",
		index : "toEnv",
		label : "加入环境变量",
		editable : editable,
		edittype : "checkbox",
		editoptions : {value:"Yes:No"},
		sortable : false
	}, {
		name : "format",
		index : "format",
		label : "格式化",
		editable : editable,
		sortable : false
	}, {
		name : "length",
		index : "length",
		label : "长度",
		editable : editable,
		sortable : false
	},{
		name : "scale",
		index : "scale",
		label : "精度",
		editable : editable,
		sortable : false
	}, {
		name : "roundingMode",
		index : "roundingMode",
		label : "舍位方式",
		editable : editable,
		edittype:"select",
		editoptions:{value:roundingModes},
		sortable : false
	}, {
		name : "defaultValue",
		index : "defaultValue",
		label : "默认值",
		editable : editable,
		sortable : false
	}, {
		name : "dimension",
		index : "dimension",
		label : "维度",
		editable : editable,
		edittype:"select",
		editoptions : {
			value:dimensions,
			dataEvents: [{ type: 'change', fn: onDimensionChange }]
		},
		sortable : false,
		editrules : {edithidden:true},
		hidden : false
	}, {
		name : "dimensionFromCol",
		index : "dimensionFromCol",
		label : "维度主值",
		editable : editable,
		edittype:"select",
		editoptions : {value:":"},
		sortable : false,
		editrules : {edithidden:true},
		hidden : true
	}, {
		name : "dimensionToCol",
		index : "dimensionToCol",
		label : "维度目标值",
		editable : editable,
		edittype:"select",
		editoptions : {value:":"},
		sortable : false,
		editrules : {edithidden:true},
		hidden : true
	} ];
	
	var lastsel2;
	
	var jqGridOptions = {
		datatype : "json",
		mtype : "GET",
		height : 350,
		url : url,
		autowidth : true,
		colModel : columns,
		jsonReader : {
			root : feildListName, // (2)
			repeatitems : false
		// (4)
		},
		rowNum: -1,   
		pager : girdPaper,
		caption : girdTitle,
		shrinkToFit : true,
		pgbuttons : false,
		pginput : false,
		editurl : "/"
		
		/**
		viewrecords : true,
		
		onSelectRow : function(id) {
			if (id) {
				if (lastsel2 != null) {
					feildGrid.jqGrid('saveRow', lastsel2, false,
							'clientArray');
				}
				feildGrid.jqGrid('restoreRow', lastsel2);
				lastsel2 = null;
			}
		},

		ondblClickRow : function(id) {
			if (id) {
				if (lastsel2 != null) {
					feildGrid.jqGrid('saveRow', lastsel2, false,
							'clientArray');
				}
				feildGrid.jqGrid('restoreRow', lastsel2);
				feildGrid.jqGrid('editRow', id, true, false, false, 'clientArray');
				lastsel2 = id;
			}
		}
		*/
	};
	feildGrid.jqGrid(jqGridOptions);
	
	//拖拽
	feildGrid.jqGrid('sortableRows',{ update: function(event, ui) { resetTableIndex(feildGrid);}});
	
	/**
	 * 当维度变化，联动维度列
	 */
	function onDimensionChange(e) {
		var dimensionVal = $("#dimension").val();
		$("#dimensionFromCol").empty();
		$("#dimensionToCol").empty();
		if (dimensionVal == null || dimensionVal == "undefined" || dimensionVal == "")
			return;
		$.ajax({
	        url: loadDimensionColUrl,
	        type: "POST",
	        dataType: "json",
	        async: false,
	        data :{"dimensionVal" : dimensionVal},
	        success: function(data){
	        	var split = "";
	        	$.each(data.dimensionCols, function(key, value){
	        		 $("<option value='" + key + "'>" + value + "</option>").appendTo("#dimensionFromCol");
	        		 $("<option value='" + key + "'>" + value + "</option>").appendTo("#dimensionToCol");
	        	});
	        },
	        error: function(){
	            alert("获取维度数据失败！");
	        }
	    });
	}
	
	function resetTableIndex(feildGrid) {
		var dataIds = feildGrid.jqGrid('getDataIDs');
		for (var i = 0; i < dataIds.length; i++) {
			var dataId = dataIds[i];
			feildGrid.jqGrid('setCell', dataId, "index",feildGrid.jqGrid('getInd', dataId));
		}
	};
	
	//提交前调用，防止编辑途中提交出错
	this.restoreAll = function () {
		var dataIds = feildGrid.jqGrid('getDataIDs');
		for (var i = 0; i < dataIds.length; i++) {
			var dataId = dataIds[i];
			feildGrid.jqGrid('restoreRow', dataId);
		}
	};
	
	function genId() {
		var time = (new Date()).getTime();
		return time;
	}
	
	
	function setButton() {
		feildGrid.jqGrid('navGrid', girdPaper, {
			add : addable,
			del : delable,
			search : false,
			edit : true,
			refresh : false,
			editfunc : function() {
				var rowid = feildGrid.jqGrid('getGridParam', 'selrow');
				var properties = {
					onclickSubmit : function(params, posdata) {
						feildGrid.jqGrid('setRowData', rowid, posdata);
						return posdata;
					},
					closeAfterEdit : true,
					reloadAfterSubmit : false,
					beforeShowForm : function(formid) {
						var dimensionVal = $("#dimension").val();
						$("#dimensionFromCol").empty();
						$("#dimensionToCol").empty();
						if (dimensionVal == null || dimensionVal == "undefined" || dimensionVal == "")
							return;
						var dimensionFromColVal = feildGrid.jqGrid('getCell', rowid, "dimensionFromCol");
						var dimensionToColVal = feildGrid.jqGrid('getCell', rowid, "dimensionToCol");
						$.ajax({
					        url: loadDimensionColUrl,
					        type: "POST",
					        dataType: "json",
					        async: false,
					        data :{"dimensionVal" : dimensionVal},
					        success: function(data){
					        	var split = "";
					        	$.each(data.dimensionCols, function(key, value){
					        		var fromSelected = key == dimensionFromColVal ? "selected" : "";
					        		var toSelected = key == dimensionToColVal ? "selected" : "";
					        		 $("<option value='" + key + "' " + fromSelected + ">" + value + "</option>").appendTo("#dimensionFromCol");
					        		 $("<option value='" + key + "' " + toSelected + ">" + value + "</option>").appendTo("#dimensionToCol");
					        	});
					        },
					        error: function(){
					            alert("获取维度数据失败！");
					        }
					    });
					}
				};
				feildGrid.jqGrid('editGridRow', rowid, properties);
			},
			delfunc : function() {
				var row = feildGrid.jqGrid('getGridParam', 'selrow');
				var suc =feildGrid.jqGrid('delRowData', row);
				if (suc) {
					resetTableIndex(feildGrid);
				}
			}
		}, {
		}, {
			// add option
			reloadAfterSubmit : false,
			afterSubmit : processAddEdit,
			afterComplete : function(response, postdata, formid) {
				var row = feildGrid.jqGrid('getGridParam', 'selrow');
				if (row == null) {
					var len = feildGrid.jqGrid('getDataIDs').length;
					postdata.index = len;
					feildGrid.jqGrid('setRowData', postdata.id, postdata);
				} else {
					feildGrid.jqGrid('delRowData', postdata.id);
					feildGrid.jqGrid('addRowData', postdata.id, postdata, 'after', row);
					resetTableIndex(feildGrid);
				}
			},
			addedrow : "last",
			clearAfterAdd : true
		});
	}
	function processAddEdit(response, postdata) {
		var success = true;
		var message = "";
		var new_id = genId();
		if (postdata.type == 'undefinedString')
			postdata.type = 'String';
		if (postdata.roundingMode == 'undefined')
			postdata.roundingMode = '';
		return [ success, message, new_id ];
	}
	
	setButton();
};