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
		let elementUiCss = path.join(__dirname, "../lib/index.css");
		let elementUiJs = path.join(__dirname, "../lib/index.js");
		let vueJs = path.join(__dirname, "../lib/vue@2.6.12.js");
    webview.html =`
        	<body>
        		<!-- 引入样式 -->
        		<link rel="stylesheet" href="${elementUiCss}">
        		<style>
        			.row_item{
        				margin-bottom: 10px;
        			}
        			.checked_form_item{
        				margin-bottom: 0;
        			}
        			.result_example{
        				color: green;
        			}
        		</style>
        		<div id="app">
        			<el-form label-position="top" label-width="120px" :model="formCheckedModel">
        				<el-row class="row_item" :gutter="10">
        				  <el-col :span="24">
        					  <el-form-item class="checked_form_item" label="格式选择： ">
        						<el-radio-group v-model="formCheckedModel.checkedFormat">
        							<el-radio v-for="item in formatOptions" :label="item" border>{{item}}</el-radio>
        						</el-radio-group>
        					  </el-form-item>
        				  </el-col>
        				 </el-row>
        				 <el-row class="row_item" :gutter="10">
        				  <el-col :span="24">
        					  <el-form-item class="checked_form_item" label="连接符选择： ">
        						<el-radio-group v-model="formCheckedModel.checkedLinksType">
        							<el-radio v-for="item in linksTypeOptions" :label="item" border>{{item}}</el-radio>
        						</el-radio-group>
        					  </el-form-item>
        				  </el-col>
        				</el-row>
        				<el-row class="row_item" :gutter="10">
        					<el-col :span="24">
        						<p>转换结果演示： <span class="result_example">{{result}}</span></p>
        					</el-col>
        				</el-row>
        			</el-form>
        		</div>
        		<script src="${vueJs}"></script>
        		<!-- 引入组件库 -->
        		<script src="${elementUiJs}"></script>
        		<script>
        			var formatOptions = ['大写', '小写', '驼峰'];
        			var linksTypeOptions = ['无', '空格','下划线', '中划线'];
					let connector = '';
        		    var turnModel = new Vue({
        		      el: '#app',
        		      data: function() {
        		        return {
        					formCheckedModel: {
        						checkedFormat: '大写',
        						checkedLinksType: '无'
        					},
        					formatOptions: formatOptions,
        					linksTypeOptions: linksTypeOptions
        				}
        		      },
        			  computed:{
        				  result() {
        					let {checkedFormat, checkedLinksType} = this.formCheckedModel;
        					let testa = 'aa';
        					let testb = 'bb';
        					if (checkedFormat === '大写') {
        						testa = 'AA';
        						testb = 'BB';
        					} else if(checkedFormat === '小写') {
        						testa = 'aa';
        						testb = 'bb';
        					} else {
        						testa = 'aa';
        						testb = 'Bb';
        					}
        					if (checkedLinksType === '无') {
        						connector = '';
        					} else if (checkedLinksType === '空格') {
        						connector =  ' ';
        					} else if (checkedLinksType === '下划线') {
        						connector =  '_';
        					} else if (checkedLinksType === '中划线') {
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
									model: turnModel.formCheckedModel,
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
