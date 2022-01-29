const hx = require('hbuilderx');
const {transformEditorText, textEditorReplace} = require('./textEditor.js');
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
			height: 520
        }
    }, {
        enableScripts: true
    });
    let webview = webviewDialog.webView;
		let bootstarpCss = path.join(__dirname, "../lib/bootstarp.css");
		let vueJs = path.join(__dirname, "../lib/vue@2.6.12.js");
    webview.html =`
        		<!DOCTYPE html>
        		<html>
        			<head>
        				<meta charset="utf-8" />
        				<meta name="viewport" content="width=device-width, initial-scale=1">
        				<title>转呀转 UI</title>
        			</head>
        			<body>
        				<!-- 引入样式 -->
        				<link rel="stylesheet" href="${bootstarpCss}">
        				<style>
        					body{
        						width:100%;
        						height:100%;
        						overflow-x: hidden;
        						overflow-y: auto;
        					}
        					.row{
        						box-sizing: border-box;
        					}
        					.selction_text{
        						display: inline-block;
        						line-height: 2.4em;
        						color: #666;
        					}
        					.result_example{
        						color: green;
        					}
        				</style>
        				<div id="app">
        					<div class="row px-2 pb-3 mt-3 mb-3 border-bottom">
        						<div class="col-12 mb-3">格式选择：</div>
        						<div class="col-12">
        							<div class="form-check form-check-inline"  v-for="(item,index) in formatOptions" :key="item">
        							  <input class="form-check-input" type="radio" :value="item" v-model="checkedFormat" :id="'format'+index">
        							  <label class="form-check-label" :for="'format'+index">{{item}}</label>
        							</div>
        						</div>
        					</div>
        					<div class="row px-2 pb-3 mb-4 mb-3 border-bottom">
        						<div class="col-12 mb-3">连接符选择：</div>
        						<div class="col-12">
        							<div class="form-check form-check-inline"  v-for="(item,index) in linksTypeOptions" :key="item">
        							  <input class="form-check-input" type="radio" :value="item" v-model="checkedLinksType" :id="'link'+index">
        							  <label class="form-check-label" :for="'link'+index">{{item}}</label>
        							</div>
        						</div>
        					</div>
        					<div class="row px-2">
        						<div class="col-12" v-if="selection">
        							<div class="mb-3 row">
        							    <label class="col-3 col-form-label">原始变量:</label>
        							    <div class="col-9">
        							      <span class="selction_text">{{selection}}</span>
        							    </div>
        							  </div>
        						</div>
        						<div class="col-12" v-if="result">
        							<div class="row">
        							    <label for="result" class="col-3 col-form-label">转换结果:</label>
        							    <div class="col-9">
        							      <input type="text" class="form-control" id="result" v-model="result">
        							    </div>
        							  </div>
        						</div>
        					</div>
        				</div>
        				<script src="${vueJs}"></script>
        				<script>
        					var formatOptions = ['大写', '小写', '小写驼峰', '大写驼峰'];
        					var linksTypeOptions = ['无', '空格','下划线', '中划线'];
        				  var turnModel = new Vue({
        				      el: '#app',
        				      data() {
        				        return {
        									checkedFormat: '',
        									checkedLinksType: '无',
        									formatOptions: formatOptions,
        									linksTypeOptions: linksTypeOptions,
        									selection: '', // 当前选中的变量
        									result: ''
        								}
        				      },
        					  computed:{
        						 //  result() {
        							// 	let testa = 'aa';
        							// 	let testb = 'bb';
        							// 	if (this.checkedFormat === '大写') {
        							// 		testa = 'AA';
        							// 		testb = 'BB';
        							// 	} else if(this.checkedFormat === '小写') {
        							// 		testa = 'aa';
        							// 		testb = 'bb';
        							// 	} else if(this.checkedFormat === '小写驼峰'){
        							// 		testa = 'aa';
        							// 		testb = 'Bb';
        							// 	} else {
        							// 		testa = 'Aa';
        							// 		testb = 'Bb';
        							// 	}
        							// 	if (this.checkedLinksType === '无') {
        							// 		connector = '';
        							// 	} else if (this.checkedLinksType === '空格') {
        							// 		connector =  ' ';
        							// 	} else if (this.checkedLinksType === '下划线') {
        							// 		connector =  '_';
        							// 	} else if (this.checkedLinksType === '中划线') {
        							// 		connector =  '-';
        							// 	}
        							// 	return testa + connector + testb;
        							// },
        							connector() {
        								if (this.checkedLinksType === '无') {
        									return '';
        								} else if (this.checkedLinksType === '空格') {
        									return ' ';
        								} else if (this.checkedLinksType === '下划线') {
        									return  '_';
        								} else if (this.checkedLinksType === '中划线') {
        									return  '-';
        								}
        							}
        						},
        						watch: {
        								/**
        								 * 监听格式变化
        								 */
        								checkedFormat() {
        									this.transformAction();
        								},

        								/**
        								 * 监听连接符变化
        								 */
        								checkedLinksType() {
        									this.transformAction();
        								}
        							},
        							methods:{
        							/**
        							 * 调用转换方法
        							 */
        								transformAction() {
        									if (!hbuilderx) {
        										return;
        									}
        									hbuilderx.postMessage({
        										command: 'transform',
        										model: {
        											checkedFormat: turnModel.checkedFormat,
        											checkedLinksType: turnModel.checkedLinksType
        										},
        										connector: turnModel.connector
        									});
        								},
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
        											data: turnModel.result
        										});
        									}else if(button == '取消'){
        										//TODO 处理取消逻辑
        										 hbuilderx.postMessage({
        											command: 'cancel'
        										});
        									}
        								}
        								if(msg.command === 'result' ) {
        									turnModel.selection = msg.selection;
        									turnModel.result = msg.result;
        								}
        							});
        							setTimeout(() => {
        								turnModel.checkedFormat = '大写';
        							}, 300);
        						}
        						window.addEventListener("hbuilderxReady", initReceive);
        				  </script>
        			</body>
        		</html>
    `;

    webview.onDidReceiveMessage((msg) => {
			if (msg.command == 'cancel') {
					webviewDialog.close();
			} else if(msg.command == 'transform') {
				let model = msg.model;
				let connector = msg.connector;
				transformEditorText(model, connector , function(selection, result) {
					webview.postMessage({
						command: "result",
						selection: selection,
						result: result
					});
				});
			} else if (msg.command == 'sure') {
				let result = msg.data;
				textEditorReplace(result);
				setTimeout(() => {
					webviewDialog.close();
				}, 300);
			}
    });

    webviewDialog.show();
};

module.exports = WebviewDialog;
