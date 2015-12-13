/**
 * 获取当前jqGrid选中的行数
 * 
 * @param jqGridId
 *            jqGrid的id
 */
function getCheckedSize(jqGridId){
    return $("#" + jqGridId).jqGrid("getGridParam", "selarrrow").length;// selrow
}

/**
 * 一个jqGrid是否被选中
 * 
 * @param jqGridId
 *            jqGrid的id
 */
function isChecked(jqGridId){
    if (getCheckedSize(jqGridId) > 0) {
        return true;
    } else {
        return false;
    }
}
/**
 * 获取target内input的名值对，生成json对象，形如{name:value,name:value}
 */
function getJsonNameValueMap(targert){
	var query = targert.serializeArray();
	json = {};
	for (i in query) {
		json[query[i].name] = query[i].value;
	} 
	return json;
}