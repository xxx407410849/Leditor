#Leditor
#轻量级的富文本编辑器
- 所见即所得---jquery开发(boostrap提供webfont)
- 符合大部分文本编辑器的UI操作(WPS等)，简单易用
- 注释完整，适合大部分学习者学习
- ![](read_files/1.jpg)
- 求请star

##下载

- 直接下载demo[](https://github.com/xxx407410849/Leditor)
- 注意完整下载所有文件夹

##使用

- 在项目中添加Leditor.css
- 在HTML中添加
```
		<div class="editor">
			<div class="editor-nav">
				<div class="menu-icon">
					<i class="glyphicon-font" id="fontName"></i>
				</div>
				<div class="menu-icon">
					<i class="glyphicon-bold" id="blod"></i>
				</div>
				<div class="menu-icon">
					<i class="glyphicon-pencil" id="pencil"></i>
				</div>
				<div class="menu-icon">
					<i class="glyphicon-italic" id="italic"></i>
				</div>
				<div class="menu-icon">
					<i class="glyphicon-text-size" id="fontSize"></i>
				</div>
				<div class="menu-icon">
					<i class="glyphicon-text-color" id="foreColor"></i>
				</div>
				<div class="menu-icon">
					<i class="glyphicon-text-background" id="hiliteColor"></i>
				</div>
				<div class="menu-icon">
					<i class="glyphicon-header" id="formatBlock"></i>
				</div>
				<div class="menu-icon">
					<i class="glyphicon-console" id="code"></i>
				</div>
				<div class="menu-icon">
					<i class="glyphicon-align-justify" id="align"></i>
				</div>
				<div class="menu-icon">
					<i class="glyphicon-picture" id="pic"></i>
				</div>
				<div class="menu-icon">
					<i class="glyphicon-link" id="link"></i>
				</div>
			</div>
			<div class="editor-body" contenteditable="true">
				<p>欢迎使用Leditor</p>
			</div>
		</div>
```
- 引入jquery.js与boostrap.css
- 引入Leditor.js
- HTML中添加
```
	var E = window.Leditor;
	var editor = new E($('.editor-body'),$('.editor-nav'));
	editor.creat();
```
- 请参照demo

##demo

- 下载 [](https://github.com/xxx407410849/Leditor) 完整文件
- 直接运行即可

##关于作者

- 作者是一个大学生，如有修改意见以及Bug反馈请直接在 [github issues](https://github.com/xxx407410849/Leditor/issues) 提交问题
- 给我颗星星就是最好的奖励和支持,以及推进我修改的动力哦
- 若有其他事务联系请发送邮件至 407410849@qq.com