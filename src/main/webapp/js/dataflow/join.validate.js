
$(function() {
	
	$("#joinNodeForm").validate({
		rules : {
			reduce : {
				required : true,
				digits : true,
				range: [1, 999999]
			}
		},
		messages : {
			reduce : {
				required : "请输入reduce",
				digits : "reduce必须为大于0小于999999的整数",
				range: "reduce必须为大于0小于999999的整数"
			}
		}
	});
	
});