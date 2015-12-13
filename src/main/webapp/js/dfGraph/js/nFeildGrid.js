
/**
 * Column feild编辑表格类
 * @param feildGridOption
 * @returns {feildGrid}
 */
function feildGrid(feildGridOption) {
	
	var grid = this;
	
	//外部div
	var ___continerDiv = feildGridOption.continerDiv;
	
	//条件的json定义
	this.conJson = feildGridOption.conJson;
	
	//维度校验json定义
	this.dimensionValidateJson = feildGridOption.dimensionValidateJson;
	
	//字段校验的定义				
	this.validateRules = feildGridOption.validateRules;
	
	//打开条件对话框的函数，只在使用iframe的时候定义
	this.openCondDialogFunc = feildGridOption.openCondDialogFunc;
	
	//表格高度
	this.girdHeight = feildGridOption.girdHeight == null ? 350 : feildGridOption.girdHeight;
	
	//表格宽度
	this.girdWidth = feildGridOption.girdWidth;
	
	//刷新表格的URL
	this.url = feildGridOption.url;
	
	//表格的标题
	this.girdTitle = feildGridOption.girdTitle;
	
	//表格的paper
	this.girdPaper = feildGridOption.girdPaper;
	
	//表格对象
	this.feildGridObj = feildGridOption.feildGridObj;
	
	//在刷新表格进行ajax请求时，对应action中的属性名
	this.feildListName = feildGridOption.feildListName;
	
	//是否能编辑
	this.editable = feildGridOption.editable == null ? true : feildGridOption.editable;

	//是否能增加行
	this.addable = feildGridOption.addable == null ? true : feildGridOption.addable;

	//是否能删除行
	this.delable = feildGridOption.delable == null ? true : feildGridOption.delable;

	//隐藏列名称集合
	this.hiddenNames = feildGridOption.hiddenNames == null ? new Array() : feildGridOption.hiddenNames;
	
	this.dialogDrag = feildGridOption.dialogDrag == null ? true : feildGridOption.dialogDrag;
	
	//显示列名称集合
	//this.visibleNames = feildGridOption.visibleNames == null ? new Array() : feildGridOption.visibleNames;
	
	var dataTypes="";
	var roundingModes;
	var dimensions;
	var javaValues;
	var funcs;
	var ifOpenDimensionValidation = true;
	
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
             alert(_errDataType);
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
            alert(_errRoundingmode);
        }
    });
	
	$.ajax({
        url: loadDimensionUrl,
        type: "POST",
        dataType: "json",
        async: false,
        data :{},
        success: function(data){
        	dimensionstemp = data;
        	
        	var split = "";
        	$.each(data.data, function(key, value){
        		dimensions += split + key + ":" + value;
        		split = ";";
        	});
        },
        error: function(){
            alert(_errDimession);
        }
    });
	
	$.ajax({
        url: loadJavaValueUrl,
        type: "POST",
        dataType: "json",
        async: false,
        data :{},
        success: function(data){
        	var split = "";
        	$.each(data.data, function(key, value){
        		javaValues += split + key + ":" + value;
        		split = ";";
        	});
        },
        error: function(){
            alert(_errJavaValue);
        }
    });
	
	$.ajax({
        url: loadFuncUrl,
        type: "POST",
        dataType: "json",
        async: false,
        data :{},
        success: function(data){
        	var split = "";
        	$.each(data.data, function(key, value){
        		funcs += split + key + ":" + value;
        		split = ";";
        	});
        },
        error: function(){
            alert(_errFunc);
        }
    });
	 
	var columns = [ {
		name : "index",
		index : "index",
		label : _feild_index,
		align : "right",
		width : 60,
		sortable : false
	}, {
		name : "name",
		index : "name",
		label : _feild_name,
		cellEdit : true,
		editable : (jQuery.inArray("name", this.hiddenNames) < 0),
		sortable : false,
		hidden : (jQuery.inArray("name", this.hiddenNames) > -1),
		editrules : {
			required : true,
			custom : true,
			custom_func : function (value, colname) {
				//jquery grid调用此方法使用了call函数，所以能够使用this获取到表格对象
				var rowDatas = $(this).jqGrid('getRowData');
				var selrow = $(this).jqGrid('getGridParam', 'selrow');
				var isRight = true;
				$.each(rowDatas, function(i, rowData) {
					if (value == rowData.name) {
						if (selrow != null && selrow.index != rowData.index)
							return false;
						isRight = false;
						return false;
					}
				});
				if (!isRight)
					return [false, _errFeildExist];
				return [true,""];
			}
		}
	}, {
		name : "value",
		index : "value",
		label : _feild_value,
		editable : (jQuery.inArray("value", this.hiddenNames) < 0),
		edittype : "textarea",
		editoptions : {rows : "4", cols : "35"},
		formoptions : {elmsuffix : "<button onclick=\"__openScriptTest('" + ___continerDiv.attr("id") + "');\">" + _feild_test_button + "</button>"},
		sortable : false,
		hidden : (jQuery.inArray("value", this.hiddenNames) > -1)
	}, {
		name : "type",
		index : "type",
		label : _feild_type,
		editable : (jQuery.inArray("type", this.hiddenNames) < 0),
		edittype:"select",
		editoptions:{value:dataTypes},
		sortable : false,
		hidden : (jQuery.inArray("type", this.hiddenNames) > -1)
	}, {
		name : "visible",
		index : "visible",
		label : _feild_visible,
		editable : (jQuery.inArray("visible", this.hiddenNames) < 0),
		edittype : "checkbox",
		editoptions : {value:"Yes:No"},
		sortable : false,
		hidden : (jQuery.inArray("visible", this.hiddenNames) > -1)
	}, {
		name : "isKey",
		index : "isKey",
		label : _feild_iskey,
		editable : (jQuery.inArray("isKey", this.hiddenNames) < 0),
		edittype : "checkbox",
		editoptions : {value:"Yes:No"},
		sortable : false,
		hidden : (jQuery.inArray("isKey", this.hiddenNames) > -1)
	}, {
		name : "sortIndex",
		index : "sortIndex",
		label : _feild_sortindex,
		formoptions : {label : _feild_sortindex, elmsuffix : _feild_sortIndex },
		editable : (jQuery.inArray("sortIndex", this.hiddenNames) < 0),
		edittype : "text",
		editrules : {integer:true, maxValue:"1000"},
		sortable : false,
		hidden : (jQuery.inArray("sortIndex", this.hiddenNames) > -1)
	}, {
		name : "onIndex",
		index : "onIndex",
		label : _feild_onindex,
		editable : (jQuery.inArray("onIndex", this.hiddenNames) < 0),
		sortable : false,
		hidden : (jQuery.inArray("onIndex", this.hiddenNames) > -1)
	}, {
		name : "func",
		index : "func",
		label : _feild_func,
		editable : (jQuery.inArray("func", this.hiddenNames) < 0),
		edittype:"select",
		editoptions:{
			value:funcs,
			dataEvents: [{ type: 'change', fn: onFuncChange }]
			},
		sortable : false,
		hidden : (jQuery.inArray("func", this.hiddenNames) > -1)
	}, {
		name : "toEnv",
		index : "toEnv",
		label : _feild_toenv,
		editable : (jQuery.inArray("toEnv", this.hiddenNames) < 0),
		edittype : "checkbox",
		editoptions : {value:"Yes:No"},
		sortable : false,
		hidden : (jQuery.inArray("toEnv", this.hiddenNames) > -1)
	}, {
		name : "format",
		index : "format",
		label : _feild_format,
		editable : (jQuery.inArray("format", this.hiddenNames) < 0),
		sortable : false,
		hidden : (jQuery.inArray("format", this.hiddenNames) > -1)
	}, {
		name : "length",
		index : "length",
		label : _feild_length,
		editable : (jQuery.inArray("length", this.hiddenNames) < 0),
		sortable : false,
		hidden : (jQuery.inArray("length", this.hiddenNames) > -1)
	},{
		name : "scale",
		index : "scale",
		label : _feild_scale,
		editable : (jQuery.inArray("scale", this.hiddenNames) < 0),
		sortable : false,
		hidden : (jQuery.inArray("scale", this.hiddenNames) > -1)
	}, {
		name : "roundingMode",
		index : "roundingMode",
		label : _feild_roundingmode,
		editable : (jQuery.inArray("roundingMode", this.hiddenNames) < 0),
		edittype:"select",
		editoptions:{value:roundingModes},
		sortable : false,
		hidden : (jQuery.inArray("roundingMode", this.hiddenNames) > -1)
	}, {
		name : "defaultValue",
		index : "defaultValue",
		label : _feild_defaultvalue,
		editable : (jQuery.inArray("defaultValue", this.hiddenNames) < 0),
		sortable : false,
		hidden : (jQuery.inArray("defaultValue", this.hiddenNames) > -1)
	}, {
		name : "dimension",
		index : "dimension",
		label : _feild_dimension,
		editable : (jQuery.inArray("dimension", this.hiddenNames) < 0),
		edittype:"select",
		editoptions : {
			value:dimensions,
			dataEvents: [{ type: 'change', fn: onDimensionChange }]
		},
		sortable : false,
		editrules : {edithidden:true},
		hidden : (jQuery.inArray("dimension", this.hiddenNames) > -1)
	}, {
		name : "dimensionFromCol",
		index : "dimensionFromCol",
		label : _feild_dimensionFrom,
		editable : (jQuery.inArray("dimension", this.hiddenNames) < 0),
		edittype:"select",
		editoptions : {value:":"},
		sortable : false,
		editrules : {edithidden:true},
		hidden : true
	}, {
		name : "dimensionToCol",
		index : "dimensionToCol",
		label : _feild_dimensionTo,
		editable : (jQuery.inArray("dimension", this.hiddenNames) < 0),
		edittype:"select",
		editoptions : {value:":"},
		sortable : false,
		editrules : {edithidden:true},
		hidden : true
	}, {
		name : "javaValue",
		index : "javaValue",
		label : _feild_javaValue,
		editable : (jQuery.inArray("javaValue", this.hiddenNames) < 0),
		sortable : false,
		hidden : (jQuery.inArray("javaValue", this.hiddenNames) > -1),
		edittype:"select",
		formatter:"select",
		editoptions:{
					value : javaValues,
					dataEvents: [{ type: 'change', fn: onJavaValueChange }]
					},
		editrules : {required : false}
	},{
		name : "javaValueParam",
		index : "javaValueParam",
		label : _feild_javaValueParam,
		editable : (jQuery.inArray("_feild_javaValueParam", this.hiddenNames) < 0),
		formoptions : {elmsuffix : _feild_javaValueParamSuffix},
		sortable : false,
		editrules : {edithidden:true},
		hidden : (jQuery.inArray("value", this.hiddenNames) > -1)
	}];
	
	var lastsel2;
	
	var jqGridOptions = {
		datatype : "json",
		mtype : "GET",
		height : this.girdHeight,
		url : this.url,
		autowidth : true,
		colModel : columns,
		jsonReader : {
			root : this.feildListName,
			repeatitems : false
		},
		rowNum: -1,
		pager : this.girdPaper,
		caption : this.girdTitle,
		shrinkToFit : true,
		pgbuttons : false,
		pginput : false,
		editurl : loadDataTypeUrl
	};
	if (this.girdWidth != null) {
		jqGridOptions.width = this.girdWidth;
		jqGridOptions.autowidth = false;
	}
	this.feildGridObj.jqGrid(jqGridOptions);
	
	
	/**
	 * 当函数变换，联动类型选择
	 */
	function onFuncChange() {
		var funcVal = $(window.parent.document).find("#func").val();
		if ('COUNT' == funcVal) {
			$(window.parent.document).find("#type").val("Long").attr("disabled", "disabled");
			$(window.parent.document).find("#value").val(null);
		} else {
			$(window.parent.document).find("#type").removeAttr("disabled");
		}
	}
	
	/**
	 * 当维度变化，联动维度列
	 */
	function onDimensionChange(e) {
		var dimensionVal = $(window.parent.document).find("#dimension").val();
		$(window.parent.document).find("#dimensionFromCol").empty();
		$(window.parent.document).find("#dimensionToCol").empty();
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
	        	$.each(data.data, function(key, value){
	        		 $("<option value='" + key + "'>" + value + "</option>").appendTo($(window.parent.document).find("#dimensionFromCol"));
	        		 $("<option value='" + key + "'>" + value + "</option>").appendTo($(window.parent.document).find("#dimensionToCol"));
	        	});
	        },
	        error: function(){
	            alert(_errDimession);
	        }
	    });
	}
	
	
	/**
	 * 当列转换自定义类变化，联动其参数
	 */
	function onJavaValueChange(e) {
		var javaValueVal = $(window.parent.document).find("#javaValue").val();
		$("#javaValueParam").val("");
		if (javaValueVal == null || javaValueVal == "undefined" || javaValueVal == "")
			return;
		$.ajax({
	        url: loadJavaValueParamUrl,
	        type: "POST",
	        dataType: "json",
	        async: false,
	        data :{"javaValueVal" : javaValueVal},
	        success: function(data){
	        	alert(data.javaValueParams);
	        },
	        error: function(){
	            alert(_errJavaValueParam);
	        }
	    });
	}
	
	function resetTableIndex(feildGridObj) {
		var dataIds = feildGridObj.jqGrid('getDataIDs');
		for (var i = 0; i < dataIds.length; i++) {
			var dataId = dataIds[i];
			feildGridObj.jqGrid('setCell', dataId, "index", i);
		}
	};
	
	function genId() {
		var time = (new Date()).getTime();
		return time;
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
	
	/**
	 * 校验名称不能重复
	 * @param value
	 * @param colname
	 * @returns {Array}
	 */
	function nameCheck(value, colname) {
		//if (value < 0 && value >20) 
		//   return [false,"Please enter value between 0 and 20"];
		//else 
		return [true,""];
	}
	
	this.feildGridObj.jqGrid('navGrid', this.girdPaper, {
		feildGridObj : this.feildGridObj,
		add : this.addable,
		del : this.delable,
		search : false,
		edit : this.editable,
		refresh : false,
		editfunc : this.editFunc,
		delfunc : function() {
			var row = this.feildGridObj.jqGrid('getGridParam', 'selrow');
			var suc = this.feildGridObj.jqGrid('delRowData', row);
			if (suc) {
				resetTableIndex(this.feildGridObj);
			}
		}
	}, {
	}, {
		// add option
		feildGridObj : this.feildGridObj,
		reloadAfterSubmit : false,
		afterSubmit : processAddEdit,
		modal : true,
		zIndex : 5000,
		drag : this.dialogDrag,
		afterComplete : function(response, postdata, formid) {
			var row = this.feildGridObj.jqGrid('getGridParam', 'selrow');
			if (row == null) {
				var len = this.feildGridObj.jqGrid('getDataIDs').length;
				postdata.index = len - 1;
				this.feildGridObj.jqGrid('setRowData', postdata.id, postdata);
			} else {
				this.feildGridObj.jqGrid('delRowData', postdata.id);
				this.feildGridObj.jqGrid('addRowData', postdata.id, postdata, 'after', row);
				resetTableIndex(this.feildGridObj);
			}
		},
		addedrow : "last",
		clearAfterAdd : true
	}).jqGrid("navButtonAdd", this.girdPaper, {
		  //caption 为标题字段
		  caption : '',
		  title:_field_validate_title,
		  buttonicon:'ui-icon-validate',
		  
		  //下边栏按钮点击事件
		  onClickButton: function( e) { showValidateRulesPanel (e, grid , ___continerDiv) }
	
	}).jqGrid("navButtonAdd", this.girdPaper, {
		caption : '',
		title : _domesionvalitation_title,
		buttonicon:'ui-icon-domesionvalitation',
		onClickButton :	function openPage4ValDimension(e) {
			var condItem = "";
			
			var jStr = JSON.stringify(grid.dimensionValidateJson);

			if(jStr == "{}"){
				var addbutton = "<button onclick=\"__addDimensionValidate();\">" + _field_add_rule_title + "</button>";
				
				condItem = addbutton;
			} else {
				if(ifOpenDimensionValidation == true) {
					
					
					$.each(grid.dimensionValidateJson.dimensionValidations, function(key, value){
						
						
							var tempdimension = value.dimension;
							var tempdimensionValue = value.dimensionValue;
							
							var expressionStrName = "<tr><td><input name=\"expressionStrName\" type=\"text\" value=\"" + value.validateName + "\"/></td>";
							
							var expressionStr = "<td><input name=\"expressionStr\" type=\"text\" value=\"" + value.validateVal + "\"/></td>";
							
							var dimensionSelect = "<td><select name=\"dimensionselect\" onchange=\"dimensionChangeforValidate($(this).parent().parent())\">";
							
							$.each(dimensionstemp.dimensions, function(key, value){
								if(tempdimension == value) {
									dimensionSelect += "<option selected value=\"" +value+ "\">" + value + "</option>";
								} else {
									dimensionSelect += "<option value=\"" +value+ "\">" +value+ "</option>";
								}
				        	});
							
							dimensionSelect += "</select></td>";
						
							if(tempdimensionValue != "" && typeof(tempdimensionValue) != "undefined" && tempdimensionValue != null) {
								dimensionValuesInit(tempdimension, tempdimensionValue);
							}
							
							var addbutton = "<button onclick=\"__addDimensionValidate();\">" + _field_add_rule_title + "</button>";
							
							var removeButton = "<td><button onclick=\"__removeDimensionValidate($(this).parent().parent());\">" + _field_del_rule_title + "</button></td></tr>";
			        		
			        		
							if(key == 0){
								condItem += addbutton + expressionStrName + expressionStr + dimensionSelect + selectValuesInit + removeButton;
							} else {
								condItem += expressionStrName + expressionStr + dimensionSelect + selectValuesInit + removeButton;
							}
		        	});
					
				}
			}


			var dialogConfId = "__dialog-con2_" + ___continerDiv.attr("id");

			var dialogConf =
				"<div id=\"" + dialogConfId + "\" title=\"" + _domesionvalitation_title + "\">" +
				"<table id=\"dimensionTable\">" + "<tr><td>" + dimensionvalidate_validatename + "</td><td>" + dimensionvalidate_expressionvalue + "</td><td>" + dimensionvalidate_dimension + "</td><td>" + dimensionvalidate_dimensionvalue + "</td></tr>" +
				condItem +
				"</table>" +
				"</div>";

			if(ifOpenDimensionValidation == true) {
				ifOpenDimensionValidation = false;
				___continerDiv.after(dialogConf);
			}

			var dialogDivObj = $(window.parent.document).find("#" + dialogConfId);

			var buttons = {};
			buttons["提交"] = function() {
				var jsonTemp = {};
				jsonTemp.dimensionValidations = new Array();
				
				$("tr",$("#dimensionTable")).each(function (index, value ) {
					if(index > 0) {
						if($(value).find("input[name='expressionStrName']").val() != '' &&
						   $(value).find("input[name='expressionStr']").val() != '' &&
						   $(value).find("select[name='dimensionselect']").val() != '' &&
						   $(value).find("select[name='dimensionValueSelect']").val() != '') {
							
						   jsonTemp.dimensionValidations.push({ validateName : $(value).find("input[name='expressionStrName']").val(),
																validateVal : $(value).find("input[name='expressionStr']").val(),
                                                                dimension : $(value).find("select[name='dimensionselect']").val(),
                                                                dimensionValue : $(value).find("select[name='dimensionValueSelect']").val() });
						}
					}
				});
			
				grid.dimensionValidateJson = jsonTemp;
				
			
				if (window.parent.closeCondDialog != null)
					window.parent.closeCondDialog(dialogDivObj.attr("id"));
				else
					dialogDivObj.dialog("close");
			};
			buttons["取消"] = function() {
				if (window.parent.closeCondDialog != null)
					window.parent.closeCondDialog(dialogDivObj.attr("id"));
				else
					dialogDivObj.dialog("close");
			};
			
			
			
			var dialogOption = {
					autoOpen: false,
					height: 300,
					width: 700,
					modal: true,
					buttons: buttons
				};
			if (window.parent.openCondDialog != null)
				window.parent.openCondDialog(dialogDivObj.attr("id"), dialogOption);
			else {
				dialogDivObj.dialog(dialogOption);
				dialogDivObj.dialog("open");
			}
		}
	}).jqGrid("navButtonAdd", this.girdPaper, {
		caption : '',
		title : _feild_con_title,
		buttonicon:'ui-icon-condition',
		onClickButton :	function openPage4Con(e) {
			var condItem;
			if (grid.conJson == null || grid.conJson.condRel == null || grid.conJson.length == 0) {
				condItem = __getCondSelect(0, true);
			} else {
				//var conJson = grid.conJson;
				condItem = __initCondHtml(grid.conJson, 0);
			}
			var dialogConfId = "__dialog-con_" + ___continerDiv.attr("id");
			var dialogConf =
				"<div id=\"" + dialogConfId + "\" title=\"" + _feild_con_title + "\">" +
				"<table>" + 
					condItem +
				"</table>" +
				"</div>";
			___continerDiv.after(dialogConf);
			//var dialogDivObj = window.parent.jQuery("#" + dialogConfId);
			var dialogDivObj = $(window.parent.document).find("#" + dialogConfId);
			var buttons = {};
			buttons["提交"] = function() {
				var rootTr = $(this).find("tr:nth-child(1)");
				var jsonTemp = {};
				jsonTemp.condRel = rootTr.find("select").val();
				jsonTemp.level = 0;
				var stack = [jsonTemp];
				var nextTr = rootTr.next("tr");
				var correntTr = rootTr;
				var correntJson = jsonTemp;
				while (nextTr.length > 0) {
					if (nextTr.find("select").length > 0) {
						var nextJson = new Object();
						nextJson.condRel = nextTr.find("select").val();
						nextJson.level = parseInt(nextTr.attr("level"));
						if (nextJson.level > correntJson.level) {
							if (correntJson.children == null)
								correntJson.children = new Array();
							correntJson.children.push(nextJson);
						} else if (nextJson.level == correntJson.level) {
							stack[stack.length - 2].children.push(nextJson);
						} else if (nextJson.level < correntJson.level) {
							while (stack.length - 1 > nextJson.level) {
								stack.pop();
							}
							stack[stack.length - 2].children.push(nextJson);
						}
						stack[nextJson.level] = nextJson;
						correntJson = nextJson;
					} else if (nextTr.find("input").length > 0) {
						var val = nextTr.find("input").val();
						if (val != null && val.length > 0) {
							var nextJson = new Object();
							nextJson.level = parseInt(nextTr.attr("level"));
							if (nextJson.level == correntJson.level + 1) {
								if (correntJson.cons == null)
									correntJson.cons = new Array();
								correntJson.cons.push({ con : val });
							} else if (nextJson.level < correntJson.level + 1) {
								while (stack.length > nextJson.level) {
									stack.pop();
								}
								if (stack[stack.length - 1].cons == null)
									stack[stack.length - 1].cons = new Array();
								stack[stack.length - 1].cons.push({ con : val });
								correntJson = stack[stack.length - 1];
							}
						}
					}
					nextTr = nextTr.next("tr");
				}
				grid.conJson = jsonTemp;
				//$(this).dialog("close");
				//$(this).uiDialog.hide();
				if (window.parent.closeCondDialog != null)
					window.parent.closeCondDialog(dialogDivObj.attr("id"));
				else
					dialogDivObj.dialog("close");
				//this.dialogDivObj.dialog("close");
			};
			buttons["取消"] = function() {
				if (window.parent.closeCondDialog != null)
					window.parent.closeCondDialog(dialogDivObj.attr("id"));
				else
					dialogDivObj.dialog("close");
				//$(this).dialog("close");
			};
			var dialogOption = {
					//dialogDivObj : dialogDivObj,
					autoOpen: false,
					height: 300,
					//zIndex: 2147483640,
					width: 350,
					modal: true,
					buttons: buttons
				};
			if (window.parent.openCondDialog != null)
				window.parent.openCondDialog(dialogDivObj.attr("id"), dialogOption);
			else {
				dialogDivObj.dialog(dialogOption);
				//dialogDivObj.dialog("moveToTop");
				dialogDivObj.dialog("open");
			}
		}
	});
	
	//拖拽
	this.feildGridObj.jqGrid('sortableRows', {
		update : function(event, ui) {
			resetTableIndex(ui.item.parent().parent());
		}
	});
	
}

function __openScriptTest(continerDivId) {
	var condItem = "<tr><td>" + _param_name + "</td><td>" + _param_value + "</td><td><button onclick=\"__addTestParam($(this).parent().parent());\">+</button></td></tr>";
	condItem += "<tr><td>script</td><td colspan=2 ><textarea rows=5 cols=20 testscript=1  ></textarea></td></tr>";
	condItem += "<tr><td>" + _feild_result + "</td><td colspan=2 ><label scriptresult=1  ></label></td></tr>";
	var dialogScriptTestId = "__dialog-script-test_" +continerDivId;
	var old = $(window.parent.document).find("#" + dialogScriptTestId);
	if (old != null)
		old.remove();
	var dialogScriptTest =
		"<div id=\"" + dialogScriptTestId + "\" >" +
		"<table>" + 
			condItem +
		"</table>" +
		"</div>";
	$(window.parent.document).find("#" + continerDivId).after(dialogScriptTest);
	var dialogDivObj = $(window.parent.document).find("#" + dialogScriptTestId);
	var buttons = {};
	
	buttons["提交"] = function() {
		var testParamJson = "{ ";
		var paramKey = null;
		var split = "";
		var valid = true;
		$(window.parent.document).find("#" + dialogScriptTestId).find("input[testparam=1]").each(function(i, inputParam) {
			if (paramKey == null) {
				paramKey = $(inputParam).val();
				if (paramKey == null || paramKey.length == 0) {
					alert(_feild_key_empty);
					valid = false;
					return;
				}
			} else {
				testParamJson += split + paramKey + " : \"" + $(inputParam).val() + "\"";
				split = ", ";
				paramKey = null;
			}
		});
		if (!valid) {
			return false;
		}
		
		testParamJson += " }";
		
		$.ajax({
	        url: testScriptUrl,
	        type: "POST",
	        dataType: "json",
	        async: false,
	        data :{
	        	params : testParamJson,
				script : $(window.parent.document).find("#" + dialogScriptTestId).find("textarea[testscript=1]").val()
	        },
	        success: function(data){
	        	if (data.errMsg != null) {
	        		alert(_faild + data.errMsg);
	        		$(window.parent.document).find("#" + dialogScriptTestId).find("label[scriptresult=1]").text(data.errMsg);
	        	} else {
	        		alert(_success);
	        		$(window.parent.document).find("#" + dialogScriptTestId).find("label[scriptresult=1]").text(data.value);
	        	}
	        },
	        error: function(){
	            alert(_errFunc);
	        }
	    });
		
	};
	
	buttons["取消"] = function() {
		if (window.parent.closeCondDialog != null)
			window.parent.closeCondDialog(dialogDivObj.attr("id"));
		else
			dialogDivObj.dialog("close");
	};
	
	var dialogOption = {
			autoOpen: false,
			height: 300,
			width: 350,
			modal: true,
			buttons: buttons
		};
	if (window.parent.openCondDialog != null)
		window.parent.openCondDialog(dialogDivObj.attr("id"), dialogOption);
	else {
		dialogDivObj.dialog(dialogOption);
		dialogDivObj.dialog("open");
	}
}

function __addTestParam(parent) {
	parent.after("<tr><td><input type='text' testparam=1 ></input></td><td><input type='text' testparam=1></input></td><td><button onclick=\"__removeTestParam($(this).parent().parent());\">-</button></td></tr>");
}

function __removeTestParam(testParam) {
	testParam.remove();
}

var __removeConButton = "<button onclick=\"__removeCond($(this).parent().parent());\">-</button>";

function __initCondHtml(cond, level) {
	var html = __getCondSelect(level, level == 0, cond.condRel);
	if (cond.cons != null) {
		for (var i = 0; i < cond.cons.length; i++) {
			var con = cond.cons[i];
			html += __getCondInput(level + 1, con.con);
		}
	}
	if (cond.children != null) {
		for (var i = 0; i < cond.children.length; i++) {
			var child = cond.children[i];
			html += __initCondHtml(child, level + 1);
		}
	}
	return html;
}

function __initCondJson() {
	if (next.find("select") != null) {
		if (corrent.children == null)
			corrent.children = new Array();
		corrent.children.push({ rel : root.find("select").val()});
		stack[next.attr("level")] = next;
		corrent = next;
	} else if (next.find("input") != null) {
		var val = next.find("input").val();
		if (val != null && val.length > 0) {
			if (corrent.cons == null)
				corrent.cons = new Array();
			corrent.cons.push({ con : val });
		}
	}
	next = next.next("tr");
	if (next == null) {
		var last = stack.pop();
		if (last != root) {
			next = last;
		}
	}
}

/** 
 * 显示添加校验规则的界面
 */
function showValidateRulesPanel ( e, grid,  targetContainer) {
	//校验规则填写区域的id
    var validateRuleAreaId = "validateRuleAreaId";
    //校验按钮的id
    var addNewValidateRuleBtnId = "addNewValidateRuleId";
    
	/**生成弹出框界面的html内容 */
	var condItem;
	if (grid.validateRules == null ||  ( grid.validateRules.length && grid.validateRules.length ==0 ) ) {
		condItem = composeFieldValidate (addNewValidateRuleBtnId, validateRuleAreaId);
	} else {
		condItem = composeFieldValidate ( addNewValidateRuleBtnId, validateRuleAreaId, grid.validateRules)
	}
	
	/**下面到下一个空行的为前任遗物， 照抄就行 */
	var dialogConfId = "__dialog-con_validate_rule" + targetContainer.attr("id");
	var dialogConf = "<div id='" + dialogConfId + "' title='" + _field_validate_title + "'>" 
		               + "<table id='" + validateRuleAreaId + "'>" + condItem + "</table>" 
		             + "</div>";			
	
	/**将拼接的html 字符串插入到窗口中 */
	if ( document.getElementById (dialogConfId) == null) {
		targetContainer.after(dialogConf);
	}
		
	//添加新的校验规则的按钮
	var addNewRuleBtn = $( "#" + addNewValidateRuleBtnId );
	//存放校验规则的区域
	var validateRuleArea = $("#" + validateRuleAreaId );
	
	//添加校验规则按钮事件
	$( addNewRuleBtn).bind( 'click',  function() { addNewValidateRule( validateRuleArea)}  );
	
	//var dialogDivObj = window.parent.jQuery("#" + dialogConfId);
	var dialogDivObj = $(window.parent.document).find("#" + dialogConfId);
	
	//对话框中底边栏按钮
	var buttons = {};
	//提交事件
	buttons["提交 "] = function() {
		var ruleValues = [];
		 $("tr", validateRuleArea).each (function ( tmpIndex, tmpValue ) {
			 if ( tmpIndex ==0 ) return;
			var ruleName= $(tmpValue).find("input[name='validteName']").val()  ;
		    var tmpRuleValue = $(tmpValue).find("textArea[name='validateRuleValue']").val() ;
		    ruleValues.push ( [ruleName, tmpRuleValue]);
		});
		
		//将变量保存到从源窗口传递过来的参数中
        grid.validateRules = ruleValues;
        
		if (window.parent.closeCondDialog != null)
			window.parent.closeCondDialog(dialogDivObj.attr("id"));
		else
			dialogDivObj.dialog("close");
	};
	
	//这个函数下边的抄下来就可以了
	buttons["取消"] = function() {
		if (window.parent.closeCondDialog != null)
			window.parent.closeCondDialog(dialogDivObj.attr("id"));
		else
			dialogDivObj.dialog("close");
	};
	
	var dialogOption = {
			autoOpen: false,
			height: 300,
			width: 600,
			modal: true,
			buttons: buttons
	    };
	
	//显示弹出界面
	showDialog ( dialogDivObj, dialogOption);
	
}

// 显示弹出界面
function showDialog ( _dialogDom, _dialogOption) {
	
	if (window.parent.openCondDialog != null)
		window.parent.openCondDialog( _dialogDom.attr("id"), _dialogOption);
	else {
		_dialogDom.dialog( _dialogOption);
		_dialogDom.dialog("open");
	}
}
/** 生成校验界面内容 
 * 
 * @param addNewValidateBtnId 添加校验的按钮的id
 * @param composeFieldValidateAreaId   校验内容区域的容器id
 * @param validateRules  校验的内容
 * @returns
 */
function composeFieldValidate ( addNewValidateBtnId, composeFieldValidateAreaId,  validateRules) {
	
	var validateContent = new Array();
	validateContent.push ( "<tr><td><input type='button' value='" +  _field_add_rule_title +"' " 
			+ "id='" + addNewValidateBtnId+"' /> </td></tr>")

	if ( validateRules && validateRules.length ) {
		var rulesCount = validateRules.length -1;
		for ( ; rulesCount >-1 ; rulesCount--) validateContent.push ( getValateRuleContent ( validateRules [ rulesCount]));
		
	}
	return validateContent.join ("" );
}

/**获取每一条校验规则的html */
function getValateRuleContent ( tmpContent) { 
    var isFillForm = tmpContent && tmpContent.length && tmpContent.length==2 ;
	return "<tr ><th width='10%' style='padding-top:2px'>" + _field_rule_name_title +"</th>"
	+ "<td width='20%'><input type='text' name='validteName' length='20px' value='" + (isFillForm?  tmpContent [0] :"" ) + "' /></td>" 
	+ "<td width='10%'>" + _field_rule_value_title + "</td>"
	+"<td><TextArea cols='30' rows='5' name='validateRuleValue' >" + (isFillForm?  tmpContent [1] :"" )+ "</TextArea></td>" 
	+ "<td align='center' valign='bottom' ><input type='button' value=' " + _field_del_rule_title+ "' onclick='this.parentNode.parentNode.parentNode.removeChild ( this.parentNode.parentNode)' /></td></tr>";

	 
}

/**校验按钮调用方法 */
function addNewValidateRule ( varValidateArea) {
	$(varValidateArea).append ( getValateRuleContent() );
}

function __getCondSelect(level, root, val) {
	var sp = "";
	for (var i = 0; i <= level; i++) {
		sp += "&nbsp;&nbsp;";
	}
	var andSelected = "";
	var orSelected = "";
	if (val != null) {
		if ("AND" == val)
			andSelected = "selected";
		else if ("OR" == val)
			orSelected = "selected";
	}
	var addSub = "<button onclick=\"__addSubCond($(this).parent().parent());\">+{}</button>";
	var addCond = "<button onclick=\"__addCond($(this).parent().parent());\">+</button>";
	var condSelect = "<select><option " + andSelected + ">AND</option><option " + orSelected + ">OR</option></select>";
	condSelect += addSub;
	condSelect += addCond;
	if (!root)
		condSelect += __removeConButton;
	condSelect = "<tr level=\"" + level + "\"><td>" + sp + condSelect + "</td></tr>";
	return condSelect;
}

function __removeCond(con) {
	var next = con.next();
	while (next != null && next.attr('level') > con.attr('level')) {
		next.remove();
		next = con.next();
	}
	con.remove();
}

function __getCondInput(level, val) {
	var sp = "";
	for (var i = 0; i <= level; i++) {
		sp += "&nbsp;&nbsp;";
	}
	val = val == null ? "" : val;
	var condInput = "<tr level=\"" + level + "\"><td>" + sp + "<input type=\"text\" value=\"" + val + "\" size=\"25\" />";
	condInput += __removeConButton;
	condInput += "</td></tr>";
	return condInput;
}

function __addSubCond(parent) {
	var level = parent.attr('level') == null ? 0 : parent.attr('level');
	level = parseInt(level);
	parent.after(__getCondSelect(level + 1));
}

function __addDimensionValidate() {
	
	var expressionStrName = "<tr><td><input name=\"expressionStrName\" type=\"text\" /></td>";
	
	var expressionStr = "<td><input name=\"expressionStr\" type=\"text\" /></td>";
	
	var dimensionSelect = "<td><select name=\"dimensionselect\" onchange='dimensionChangeforValidate($(this).parent().parent())'>";
	
	$.each(dimensionstemp.dimensions, function(key, value){
		dimensionSelect += "<option value=\"" +value+ "\">" +value+ "</option>";
	});
	
	dimensionSelect += "</select></td>";
	
	var dimensionValueSelect = "<td><select name=\"dimensionValueSelect\"></select></td>";
	
	var removeButton = "<td><button onclick=\"__removeDimensionValidate($(this).parent().parent());\">" + _field_del_rule_title + "</button></td></tr>";
	
	condItem = expressionStrName + expressionStr + dimensionSelect + dimensionValueSelect + removeButton;
	$("#dimensionTable").append(condItem);
}

function __removeDimensionValidate(parent) {
	parent.remove();
}

function __addCond(parent) {
	var level = parent.attr('level') == null ? 0 : parent.attr('level');
	level = parseInt(level);
	parent.after(__getCondInput(level + 1));
}

/**
 * 重新根据url读取表格数据
 * @param url
 */
feildGrid.prototype.reloadData = function (url, feildListName) {
	this.feildGridObj.jqGrid("setGridParam", {
		datatype : "json",
		mtype : "GET",
		url : url,
		jsonReader : {
			root : feildListName,
			repeatitems : false
		}
	}).trigger('reloadGrid');
};

/**
 * 清空表格数据
 */
feildGrid.prototype.clearData = function() {
	this.feildGridObj.jqGrid("clearGridData");
};

/**
 * 提交前调用，防止编辑途中提交出错
 */
feildGrid.prototype.restoreAll = function () {
	var dataIds = this.feildGridObj.jqGrid('getDataIDs');
	for (var i = 0; i < dataIds.length; i++) {
		var dataId = dataIds[i];
		this.feildGridObj.jqGrid('restoreRow', dataId);
	}
};

/**
 * 表格编辑函数
 */
feildGrid.prototype.editFunc = function() {
	var rowid = this.feildGridObj.jqGrid('getGridParam', 'selrow');
	var feildGridObj = this.feildGridObj;
	var properties = {
		feildGridObj : feildGridObj,
		onclickSubmit : function(params, posdata) {
			this.feildGridObj.jqGrid('setRowData', rowid, posdata);
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
			var dimensionFromColVal = feildGridObj.jqGrid('getCell', rowid, "dimensionFromCol");
			var dimensionToColVal = feildGridObj.jqGrid('getCell', rowid, "dimensionToCol");
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
		            alert(_errDimession);
		        }
		    });
		}
	};
	feildGridObj.jqGrid('editGridRow', rowid, properties);
};




function dimensionChangeforValidate(parent) {
	
	var dimensionVal = parent.find("select[name='dimensionselect']").val();
	
	parent.find("select[name='dimensionValueSelect']").empty();
	if (dimensionVal == null || dimensionVal == "undefined" || dimensionVal == "")
		return;
	$.ajax({
        url: loadDimensionColUrl,
        type: "POST",
        dataType: "json",
        async: false,
        data :{"dimensionVal" : dimensionVal},
        success: function(data){
        	$.each(data.dimensionCols, function(key, value){
        		$("<option value='" + key + "'>" + value + "</option>").appendTo(parent.find("select[name='dimensionValueSelect']"));
        	});
        },
        error: function(){
            alert(_errDimession);
        }
    });
}



function dimensionValuesInit(dimension, dimensionValue) {
	if((typeof(feildGrid.ifOpenDimensionValidation) == "undefined" || feildGrid.ifOpenDimensionValidation) && dimension !="") {
		$.ajax({
	        url: loadDimensionColUrl,
	        type: "POST",
	        dataType: "json",
	        async: false,
	        data :{"dimensionVal" : dimension},
	        success: function(data){
	        	selectValuesInit = "<td><select name=\"dimensionValueSelect\">"
	        	
	        	$.each(data.dimensionCols, function(key, value){
	        		if(key == dimensionValue) {
	        			selectValuesInit += "<option selected value='" + key + "'>" + value + "</option>";
	        		} else {
	        			selectValuesInit += "<option value='" + key + "'>" + value + "</option>";
	        		}
	        	});
	        	
	        	selectValuesInit += "</select></td>";
	        },
	        error: function(){
	            selectValuesInit = "<td><select name=\"dimensionValueSelect\"></select></td>";
	        }
	    });
	} else {
		selectValuesInit = "<td><select name=\"dimensionValueSelect\"></select></td>";
	} 
}

var selectValuesInit;

var dimensionstemp;
