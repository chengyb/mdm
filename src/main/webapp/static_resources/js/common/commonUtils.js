//对数组columns删除里面动态的属性
function removeDynamicProp(columns) {
	for ( var i = 0; i < columns.length; i++) {
		if (columns[i].isDynamic == "true") {
			columns.splice(i, 1);
			i--;
		}
	}
}