let hx = require('hbuilderx');
const exchangeTools = require('./turnTools.js');
/**
 * @param result 用于替换的结果
 * @description TextEditor
 */
function textEditorReplace(result) {
	let activeEditor = hx.window.getActiveTextEditor();
	activeEditor.then(function(editor) {
		let selection = editor.selection;
		editor.edit(editBuilder => {
			editBuilder.replace(selection,result);
		});
	});
}

/**
 * 转换文本
 * @param {Object} cb
 */
function transformEditorText(model, connector, cb) {
	let activeEditor = hx.window.getActiveTextEditor();
	activeEditor.then(function(editor) {
		let selection = editor.selection;
		let word = editor.document.getText(selection).trim();
		let result = '';
		if (model.checkedFormat === '大写') {
			result = exchangeTools.uppercase(word, connector);
		} else if (model.checkedFormat === '小写') {
			result = exchangeTools.lowercase(word, connector);
		} else {
			const type = model.checkedFormat === '小写驼峰' ? 'lower' : 'upper'
			result = exchangeTools.hump(word, connector, type);
		}
		cb(word, result);
	});
}

module.exports = {
	textEditorReplace,
	transformEditorText
};
