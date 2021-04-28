/**
 * 字符串边界分割
 * @param {String} str
 */
function strSplit(str) {
	if (!str){
		return [];
	}
	strArr = str.split(/[\b\s\_\-]+/g);
	if (strArr.length == 0) {
		return [];
	}
	if (strArr.length == 1) {
		strArr = str.split(/(?=[A-Z])/);
	}
	if (strArr.length == 1) {
		strArr = str.split('');
	}
	console.log('--strSplit1--:', strArr);
	return strArr.filter((item) => {
		return item != undefined;
	})
}

/**
 * 驼峰写法
 * @param {String} str
 * @param {String} Connector
 */
function hump(str, Connector) {
	var strArr = strSplit(str);
	if (strArr.length === 0) {
		return '';
	}
	var strArrResult = strArr.map((item, index) => {
		if (index == 0) {
			return item.toLowerCase();
		}
		return item.substring(0, 1).toUpperCase() + item.substring(1);
	});
	return strArrResult.join(Connector);
}

/**
 * 大写
 * @param {String} str
 * @param {String} Connector
 */
function uppercase(str, Connector) {
	var strArr = strSplit(str);
	if (strArr.length === 0) {
		return '';
	}
	var strArrResult = strArr.map((item, index) => {
		return item.toUpperCase();
	});
	return strArrResult.join(Connector);
}

/**
 * 小写
 * @param {String} str
 * @param {String} Connector
 */
function lowercase(str, Connector) {
	var strArr = strSplit(str);
	if (strArr.length === 0) {
		return '';
	}
	var strArrResult = strArr.map((item, index) => {
		return item.toLowerCase();
	});
	return strArrResult.join(Connector);
}

module.exports = {
	hump,
	uppercase,
	lowercase
}
