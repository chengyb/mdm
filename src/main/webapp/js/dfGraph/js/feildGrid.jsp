<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<script type="text/javascript">

var loadDataTypeUrl = "/eSight/admin/df/selectlist/loadDataType";

var loadRoundingModeUrl = "/eSight/admin/df/selectlist/loadRoundingMode";

var loadDimensionUrl = "/eSight/admin/df/selectlist/loadDimension";

var loadJavaValueUrl = "/eSight/admin/df/selectlist/loadJavaValue";

var loadDimensionColUrl = "/eSight/admin/df/selectlist/loadDimensionCol";

var loadJavaValueParamUrl = "/eSight/admin/df/selectlist/loadJavaValueParam";

var loadFuncUrl = "/eSight/admin/df/selectlist/loadFunc";

var testScriptUrl = "/eSight/admin/df/selectlist/testScript";


var _errDataType = 'Load data type faild!';
var _errRoundingmode = 'Load rounding mode faild!';
var _errDimession = 'Load dimession faild!';
var _errJavaValue = 'Load udf col converter faild!';
var _errJavaValueParam = 'Load udf col converter param faild!';
var _errFunc = 'Load func faild!';
var _errFeildExist = 'This name is already exist!';

var _feild_index = '序号';
var _feild_name = '名称';
var _feild_value = '值';
var _feild_javaValue = 'java';
var _feild_javaValueParam = 'java入参';
var _feild_type = '类型';
var _feild_visible = '是否输出';
var _feild_iskey = '是否为键值';
var _feild_sortindex = '排序级别';
var _feild_onindex = '关联序号';
var _feild_func = '函数';
var _feild_toenv = '加入环境';
var _feild_format = '格式化';
var _feild_length = '长度';
var _feild_scale = '精度';
var _feild_roundingmode = '舍位方式';
var _feild_defaultvalue = '默认值';
var _feild_dimension = '维度';
var _feild_dimensionFrom = '维度主值';
var _feild_dimensionTo = '维度目标值';

var _feild_sortIndex = '数值从大到小(空表示不排序)';
var _feild_javaValueParamSuffix = "以,分隔，列引用使用#";

var _feild_con_title = '过滤条件';
var _domesionvalitation_title = '维度验证';


var _field_validate_title='校验规则';
var _field_del_rule_title='删除校验';
var _field_add_rule_title='添加';
var _field_rule_name_title='校验名称';
var _field_rule_value_title='设置校验值';

var _param_name = 'param name';
var _param_value = 'udf.param.value';

var _feild_test_button = '测试';

var _feild_key_empty = 'test.key.empty';

var _success = 'success';
var _faild = 'err';

var i18n_submit = 'button_ok';
var i18n_cancel = 'button cancel';

var dimensionvalidate_validatename = 'validatename';
var dimensionvalidate_expressionvalue = 'expressionvalue';
var dimensionvalidate_dimension = 'dimension';
var dimensionvalidate_dimensionvalue = 'dimensionvalue';

</script>