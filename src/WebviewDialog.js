const hx = require('hbuilderx');
const textEditor = require('./textEditor.js');
const path = require('path');

/**
 * @description hx.window.createWebViewDialog
 */
function WebviewDialog() {
    let webviewDialog = hx.window.createWebViewDialog({
        modal: false,
        title: "选择转换方式",
        description: "自由选择组合转换格式",
        dialogButtons: ["确定", "取消"],
        size: {
			width: 580,
			height: 470
        }
    }, {
        enableScripts: true
    });
    let webview = webviewDialog.webView;
		let bootstarpCss = path.join(__dirname, "../lib/bootstarp.css");
		let vueJs = path.join(__dirname, "../lib/vue@2.6.12.js");
    webview.html =`
        		<body>
        			<!-- 引入样式 -->
        			<link rel="stylesheet" href="${bootstarpCss}">
        			<style>
        				body{
        					width:100%;
        					height:100%;
        					overflow: hidden;
        				}
        				.row{
        					box-sizing: border-box;
        				}
        				.result_example{
        					color: green;
        				}
        			</style>
        			<div id="app">
        				<div class="row px-2 pb-3 mt-4 mb-3 border-bottom">
        					<div class="col-12 h5 mb-3">格式选择：</div>
        					<div class="col-12">
        						<div class="form-check form-check-inline"  v-for="(item,index) in formatOptions" :key="item">
        						  <input class="form-check-input" type="radio" :value="item" v-model="checkedFormat" :id="'format'+index">
        						  <label class="form-check-label" :for="'format'+index">{{item}}</label>
        						</div>
        					</div>
        				</div>
        				<div class="row px-2 pb-3 mb-4 mb-3 border-bottom">
        					<div class="col-12 h5 mb-3">连接符选择：</div>
        					<div class="col-12">
        						<div class="form-check form-check-inline"  v-for="(item,index) in linksTypeOptions" :key="item">
        						  <input class="form-check-input" type="radio" :value="item" v-model="checkedLinksType" :id="'link'+index">
        						  <label class="form-check-label" :for="'link'+index">{{item}}</label>
        						</div>
        					</div>
        				</div>
        				<div class="row px-2">
        					<div class="col-12"><p>转换结果演示： <span class="result_example">{{result}}</span></p></div>
        				</div>
        			</div>
        			<script src="${vueJs}"></script>
        			<script>
        				var formatOptions = ['大写', '小写', '小写驼峰', '大写驼峰'];
        				var linksTypeOptions = ['无', '空格','下划线', '中划线'];
								let connector = '';
        			  var turnModel = new Vue({
        			      el: '#app',
        			      data() {
        			        return {
        								checkedFormat: '大写',
        								checkedLinksType: '无',
        								formatOptions: formatOptions,
        								linksTypeOptions: linksTypeOptions
        							}
        			      },
        				  computed:{
        					  result() {
        							let testa = 'aa';
        							let testb = 'bb';
        							if (this.checkedFormat === '大写') {
        								testa = 'AA';
        								testb = 'BB';
        							} else if(this.checkedFormat === '小写') {
        								testa = 'aa';
        								testb = 'bb';
        							} else if(this.checkedFormat === '小写驼峰'){
        								testa = 'aa';
        								testb = 'Bb';
        							} else {
        								testa = 'Aa';
        								testb = 'Bb';
        							}
        							if (this.checkedLinksType === '无') {
        								connector = '';
        							} else if (this.checkedLinksType === '空格') {
        								connector =  ' ';
        							} else if (this.checkedLinksType === '下划线') {
        								connector =  '_';
        							} else if (this.checkedLinksType === '中划线') {
        								connector =  '-';
        							}
        							return testa + connector + testb;
        							}
        						}
        			    });
        					function initReceive() {
        						hbuilderx.onDidReceiveMessage((msg)=>{
        							if(msg.type == 'DialogButtonEvent'){
        								let button = msg.button;
        								if(button == '确定'){
        									//TODO 处理表单提交
        									 hbuilderx.postMessage({
        										command: 'sure',
        										model: {
        											checkedFormat: turnModel.checkedFormat,
        											checkedLinksType: turnModel.checkedLinksType
        										},
        										connector: connector
        									});
        								}else if(button == '取消'){
        									//TODO 处理取消逻辑
        									 hbuilderx.postMessage({
        										command: 'cancel'
        									});
        								}
        							}
        						});
        					}
        					window.addEventListener("hbuilderxReady", initReceive);
        			  </script>
        		</body>
    `;

    webview.onDidReceiveMessage((msg) => {
        if (msg.command == 'cancel') {
            webviewDialog.close();
        } else if (msg.command == 'sure') {
			let model = msg.model;
			let connector = msg.connector;
			textEditor(model, connector);
			setTimeout(() => {
				webviewDialog.close();
			}, 300);
		}
    });

    webviewDialog.show();
};

module.exports = WebviewDialog;
