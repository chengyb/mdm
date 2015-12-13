//验证数字
function isNumber(content,value){
	var reg = /^[0-9]*$/;
	if(!reg.test(value)){
		alert(content + "请填入数字");
	}
}

//验证日期
function isDate(beginValue,endValue){
	if(beginValue > endValue){
		return false;
	}
	return true;
}

//验证是否为空
function isNULL(value){
	if("" == value){
		return false;
	}
	return true;
}

//验证长度
function validateLength(val, min, max){
	if(val.length < min || val.length > max){
		return false;
	}
	return true;
}

//验证只能字母、数字、下划线组成，必须以字母开头
function validateFormat(val){
	var reg = /^[a-zA-Z]+[a-zA-Z0-9_]*$/;
	if(!reg.test(val)){
		return false;
	}
	return true;
}
