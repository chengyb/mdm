/**
 * 用来校验一个单词只包含字母、下划线、数字。数字不能开头。符合java变量的命名规范
 */
jQuery.validator.addMethod("javaVar", function(value, element) {
	return this.optional(element) || /^[a-zA-Z_][a-zA-Z0-9_]*$/i.test(value);
}, "只能输入字母下划线数字，不能数字开头");