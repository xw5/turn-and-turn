const hx = require("hbuilderx");
const WebviewDialog = require('./src/WebviewDialog.js');

//该方法将在插件激活的时候调用
function activate(context) {
	// TextEditor Api: 调起转换选择弹窗
	let turn_and_turn = hx.commands.registerCommand('turn_and_turn',() => {
	    WebviewDialog();
	});
	//订阅销毁钩子，插件禁用的时候，自动注销该command。
	context.subscriptions.push(turn_and_turn);
};

//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

};

module.exports = {
	activate,
	deactivate
}
