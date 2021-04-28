let hx = require('hbuilderx');
const exchangeTools = require('./turnTools.js');
/**
 * @description TextEditor
 */
function textEditor(model, connector) {
	let activeEditor = hx.window.getActiveTextEditor();
	activeEditor.then(function(editor) {
		let selection = editor.selection;
		let word = editor.document.getText(selection);
		let result = '';
		if (model.checkedFormat === '大写') {
			result = exchangeTools.uppercase(word, connector);
		} else if (model.checkedFormat === '小写') {
			result = exchangeTools.lowercase(word, connector);
		} else {
			result = exchangeTools.hump(word, connector);
		}
		editor.edit(editBuilder => {
			editBuilder.replace(selection,result);
		});
	});
}

module.exports = textEditor;
