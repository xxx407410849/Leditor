(function () {
    // 替换 html 特殊字符
    function replaceHtmlSymbol(html) {
        if (html == null) {
            return '';
        }
        return html.replace(/</gm, '&lt;').replace(/>/gm, '&gt;').replace(/"/gm, '&quot;').replace(/(\r\n|\r|\n)/g,
            '<br/>');
    };
    // 获取一个 elem.childNodes 的 JSON 数据
	//传入 $('.editor-body')
    function getChildrenJSON($elem) {
        var result = [];
        var $children = $elem[0].childNodes || []; // 注意 childNodes() 可以获取文本节点
        $children.forEach(function (curElem) {
            var elemResult = void 0;
            var nodeType = curElem.nodeType;

            // 文本节点
            if (nodeType === 3) {
                elemResult = curElem.textContent;
                elemResult = replaceHtmlSymbol(elemResult);
            }

            // 普通 DOM 节点
            if (nodeType === 1) {
                elemResult = {};

                // tag
                elemResult.tag = curElem.nodeName.toLowerCase();
                // attr
                var attrData = [];
                var attrList = curElem.attributes || {};
                var attrListLength = attrList.length || 0;
                for (var i = 0; i < attrListLength; i++) {
                    var attr = attrList[i];
                    attrData.push({
                        name: attr.name,
                        value: attr.value
                    });
                }
                elemResult.attrs = attrData;
                // children（递归）
                elemResult.children = getChildrenJSON($(curElem));
            }

            result.push(elemResult);
        });
        return result;
    };
    //进一步判断是否为空选区(空白选区)
    function checkEmpty(Leditor) {
        this.Leditor = Leditor;
        range = Leditor.selection.getRange();
        //判断选区text是否为空白或者null
        if (range.commonAncestorContainer.innerText == null || range.commonAncestorContainer
            .innerText[0].charCodeAt() == 8203) {
            //是否非行首
            if (range.startOffset != 1) return true;
            else return false;
        }
    };

    //框架
    //-----config 
    var headConfig = ["H1", "H2", "H3", "H4", "H5", "H6"];
    var fontColorConfig = ['#000000', '#eeece0', '#1c487f', '#4d80bf', '#c24f4a', '#8baa4a', '#FFFFFF', '#46acc8',
        '#f9963b'
    ];
    var backgroundColorConfig = [];
    var fontSizeConfig = ['xx-small', 'x-small', 'small', 'normal', 'large', 'x-large', 'xx-large'];
    var fontNameConfig = ['宋体', '新宋体', '微软雅黑', '楷体', 'Arial', 'Consolas', 'Tahoma','inherit'];
    var alignConfig = ['left', 'center', 'right'];
	pencilConfig = ['Through','Quote','Under','Line'];
    //存储init的List对象
    var ListElem = [];
    //选框,传入$(elem)
    function chooseList(Leditor, $elem) {
        this.$elem = $elem;
        this._active = false;
        this.Leditor = Leditor;
    };
    chooseList.prototype = {
        constructor: chooseList,
        _init: function _init() {
            var $elem = this.$elem;
            var chooseId = $elem[0].firstElementChild.id;
            var Leditor = this.Leditor;
			console.log(chooseId);
            switch (chooseId) {
				//工具条
				case "pencil":
					if (!hoverCheck[pencil]) {
						console.log(1);
						//加入Dom
						var $ul = $("<ul class='chooseList'></ul>");
						$elem.append($ul);
						//加入li
						pencilConfig.forEach(function (item, index) {
							var $li = $("<li class='chooseItem'></li>");
							//加入Item
							var $chooseItem = $("<span class='"+ item +"'>" + item +"</span>");
							//绑定Item的onClick事件
							//工具条独特
							$chooseItem.on("click", function (e) {
								if (!(typeof (navChooseConstructor[item]) ===
										"function")) {
									return;
								}
								var chooseFn = new navChooseConstructor[item](Leditor);
								//判断是否无选区
								if (Leditor.selection.getRangeElem() == null) {
									return;
								}
								chooseFn.onClick(e);
								//试图改变状态
								if (typeof (chooseFn.changeActive) === "function") {
									chooseFn.changeActive();
								}
							});
							$li.append($chooseItem);
							$ul.append($li);
						});
						//修改css
						$ul.css("width", "100px");
						ListElem.pencil = $ul;
						//得到父节点
						//console.log($elem);
					};
					break;
                //标题
                case "formatBlock":
                    //检查加载情况,失效,定义在后面
                    if (!hoverCheck[formatBlock]) {
                        //加入Dom
                        var $ul = $("<ul class='chooseList'></ul>");
                        $elem.append($ul);
                        //加入li
                        headConfig.forEach(function (item, index) {
                            var $li = $("<li class='chooseItem'></li>");
                            //加入Item
                            var $chooseItem = $("<" + item + ">" + item + "</" + item + ">");
                            //绑定Item的onClick事件
                            $chooseItem.on("click", function (e) {
                                if (!(typeof (navChooseConstructor[chooseId]) ===
                                        "function")) {
                                    return;
                                }
                                var chooseFn = new navChooseConstructor[chooseId](Leditor);
                                //判断是否无选区
                                if (Leditor.selection.getRangeElem() == null) {
                                    return;
                                }
                                chooseFn.onClick(e);
                                //试图改变状态
                                if (typeof (chooseFn.changeActive) === "function") {
                                    chooseFn.changeActive();
                                }
                            });
                            $li.append($chooseItem);
                            $ul.append($li);
                        });
                        //修改css
                        $ul.css("width", "100px");
                        ListElem.formatBlock = $ul;
                        //得到父节点
                        //console.log($elem);
                    };
                    break;
                    //字体
                case "fontName":
                    //检查加载情况,失效,定义在后面
                    if (!hoverCheck[fontName]) {
                        //加入Dom
                        var $ul = $("<ul class='chooseList'></ul>");
                        $elem.append($ul);
                        //加入li
                        fontNameConfig.forEach(function (item, index) {
                            var $li = $("<li class='chooseItem'></li>");
                            //加入Item
                            var $chooseItem = $("<span style= 'font-family: " + item + "'>" + item +
                                "</span>");
                            //绑定Item的onClick事件
                            $chooseItem.on("click", function (e) {
                                if (!(typeof (navChooseConstructor[chooseId]) ===
                                        "function")) {
                                    return;
                                }
                                var chooseFn = new navChooseConstructor[chooseId](Leditor);
                                //判断是否无选区
                                if (Leditor.selection.getRangeElem() == null) {
                                    return;
                                }
                                chooseFn.onClick(e);
                                //试图改变状态
                                if (typeof (chooseFn.changeActive) === "function") {
                                    chooseFn.changeActive();
                                }
                            });
                            $li.append($chooseItem);
                            $ul.append($li);
                        });
                        //修改css
                        $ul.css("width", "100px");
                        $ul.css("font-size", '18px');
                        ListElem.fontName = $ul;
                        //得到父节点
                        //console.log($elem);
                    };
                    break;
                    //字体大小
                case "fontSize":
                    //检查加载情况,失效,定义在后面
                    if (!hoverCheck[fontSize]) {
                        //加入Dom
                        var $ul = $("<ul class='chooseList'></ul>");
                        $elem.append($ul);
                        //加入li
                        fontSizeConfig.forEach(function (item, index) {
                            var $li = $("<li class='chooseItem'></li>");
                            //加入Item
                            var $chooseItem = $("<span style= 'font-size: " + item + "' id = '" +
                                (index + 1) + "'>" + item +
                                "</span>");
                            //绑定Item的onClick事件
                            $chooseItem.on("click", function (e) {
                                if (!(typeof (navChooseConstructor[chooseId]) ===
                                        "function")) {
                                    return;
                                }
                                var chooseFn = new navChooseConstructor[chooseId](Leditor);
                                //判断是否无选区
                                if (Leditor.selection.getRangeElem() == null) {
                                    return;
                                }
                                chooseFn.onClick(e);
                                //试图改变状态
                                if (typeof (chooseFn.changeActive) === "function") {
                                    chooseFn.changeActive();
                                }
                            });
                            $li.append($chooseItem);
                            $ul.append($li);
                        });
                        //修改css
                        $ul.css("width", "120px");
                        //$ul.css("font-size", '18px');
                        ListElem.fontSize = $ul;
                        //得到父节点
                        //console.log($elem);
                    };
                    break;
                case "foreColor":
                    //检查加载情况,失效,定义在后面
                    if (!hoverCheck[foreColor]) {
                        //加入Dom
                        var $ul = $("<ul class='chooseList'></ul>");
                        $elem.append($ul);
                        //加入li
                        fontColorConfig.forEach(function (item, index) {
                            var $li = $("<li class='chooseBlockItem'></li>");
                            //加入Item
                            var $chooseItem = $("<div style= 'background-color: " + item +
                                "' class ='fontColorBlock'></div>");
                            //绑定Item的onClick事件
                            $chooseItem.on("click", function (e) {
                                if (!(typeof (navChooseConstructor[chooseId]) ===
                                        "function")) {
                                    return;
                                }
                                var chooseFn = new navChooseConstructor[chooseId](Leditor);
                                //判断是否无选区
                                if (Leditor.selection.getRangeElem() == null) {
                                    return;
                                }
                                chooseFn.onClick(e);
                                //试图改变状态
                                if (typeof (chooseFn.changeActive) === "function") {
                                    chooseFn.changeActive();
                                }
                            });
                            $li.append($chooseItem);
                            $ul.append($li);
                        });
                        //修改css
                        $ul.css("width", "120px");
                        //$ul.css("font-size", '18px');
                        ListElem.foreColor = $ul;
                        //得到父节点
                        //console.log($elem);
                    };
                    break;
                case "hiliteColor":
                    //检查加载情况,失效,定义在后面
                    if (!hoverCheck[hiliteColor]) {
                        //加入Dom
                        var $ul = $("<ul class='chooseList'></ul>");
                        $elem.append($ul);
                        //加入li
                        //跟fontColor的颜色配置一样
                        fontColorConfig.forEach(function (item, index) {
                            var $li = $("<li class='chooseBlockItem'></li>");
                            //加入Item
                            var $chooseItem = $("<div style= 'background-color: " + item +
                                "' class ='fontColorBlock'></div>");
                            //绑定Item的onClick事件
                            $chooseItem.on("click", function (e) {
                                if (!(typeof (navChooseConstructor[chooseId]) ===
                                        "function")) {
                                    return;
                                }
                                var chooseFn = new navChooseConstructor[chooseId](Leditor);
                                //判断是否无选区
                                if (Leditor.selection.getRangeElem() == null) {
                                    return;
                                }
                                chooseFn.onClick(e);
                                //试图改变状态
                                if (typeof (chooseFn.changeActive) === "function") {
                                    chooseFn.changeActive();
                                }
                            });
                            $li.append($chooseItem);
                            $ul.append($li);
                        });
                        //修改css
                        $ul.css("width", "120px");
                        //$ul.css("font-size", '18px');
                        ListElem.hiliteColor = $ul;
                        //得到父节点
                        //console.log($elem);
                    };
                    break;
                    //无hover样式
                case "code":
                    break;
                case "align":
                    //检查加载情况,失效,定义在后面
                    if (!hoverCheck[align]) {
                        //加入Dom
                        var $ul = $("<ul class='chooseList'></ul>");
                        $elem.append($ul);
                        //加入li
                        alignConfig.forEach(function (item, index) {
                            var $li = $("<li class='chooseItem'></li>");
                            //加入Item
                            var $chooseItem = $("<span id = '" + item +
                                "' style = 'font-size: 16px;line-height: 1 '><i class= 'glyphicon-align-" +
                                item + "'></i>" + item + "</span>");
                            //绑定Item的onClick事件
                            $chooseItem.on("click", function (e) {
                                if (!(typeof (navChooseConstructor[chooseId]) ===
                                        "function")) {
                                    return;
                                }
                                var chooseFn = new navChooseConstructor[chooseId](Leditor);
                                //判断是否无选区
                                if (Leditor.selection.getRangeElem() == null) {
                                    return;
                                }
                                chooseFn.onClick(e);
                                //试图改变状态
                                if (typeof (chooseFn.changeActive) === "function") {
                                    chooseFn.changeActive();
                                }
                            });
                            $li.append($chooseItem);
                            $ul.append($li);
                        });
                        //修改css
                        $ul.css("width", "120px");
                        //$ul.css("font-size", '18px');
                        ListElem.align = $ul;
                        //得到父节点
                        //console.log($elem);
                    };
                    break;
                default:
                    break;
            }
            this._hoverAttach();
        },
        _hoverAttach: function _hoverAttach() {
            $('.chooseItem').on('mouseenter', function () {
                $(this).css('background-color', '#87CEEB');
            });
            $('.chooseItem').on('mouseleave', function () {
                $(this).css('background-color', '#fff');
            });
        }
    };

    //input框
    function Panel(Leditor, $elem) {
        this.Leditor = Leditor;
        this.$elem = $elem;
    }
    Panel.prototype = {
        constructor: Panel,
        _init: function _init() {
            var Leditor = this.Leditor;
            var $elem = this.$elem;
            var $editor = Leditor.editor;
            var chooseId = $elem[0].firstElementChild.id;
            //未有链接正确鉴定
            //var regLink = /(http|ftp|https):\/\/[\w]+(.[\w]+)([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])/ 
            switch (chooseId) {
                case "link":
                    //输入框
                    var $iptctn = $("<div class='ipt-ctn'></div>");
                    var $iptnav = $(
                        "<ul class='ipt-title'><li class='ipt-title-text'>标签</li><i class='glyphicon-remove' id='ipt-close'></i></ul>"
                    );
                    $iptctn.append($iptnav);
                    var $ipt = $(
                        "<div class='ipt-body'><input class='ipt-text' type='text' placeholder='标签文字'/></td>  <input class='ipt-link' type='text' placeholder='http://...'/>   <div class='ipt-btn-body'><div class='ipt-btn'>插入</div></div> </div>"
                    );
                    $ipt.css('width', '300px');
                    $iptctn.append($ipt);
                    $elem.append($iptctn);
                    $('.ipt-close').on('click', function () {
                        $('.ipt-ctn').css('display', 'none');
                        hoverDisplay[chooseId] = false;
                    });
                    $('.ipt-btn').on('click', function () {
                        if (!(typeof (navChooseConstructor[chooseId]) ===
                                "function")) {
                            return;
                        }
                        var chooseFn = new navChooseConstructor[chooseId](Leditor);
                        //判断是否无选区
                        if (Leditor.selection.getRangeElem() == null) {
                            return;
                        }
                        chooseFn.onClick();
                        //试图改变状态
                        if (typeof (chooseFn.changeActive) === "function") {
                            chooseFn.changeActive();
                        }
                        //清空ipt
                        $('.ipt-text').val("");
                        $('.ipt-link').val("");
                        //隐藏ipt
                        $('.ipt-ctn').css("display", "none");
                        hoverDisplay[chooseId] = false;
                    });
                    ListElem.link = $iptctn;
                    break;
                case "pic":
                    //输入框
                    var $iptctn = $("<div class='ipt-pic-ctn'></div>");
                    var $iptnav = $(
                        "<ul class='ipt-pic-title'><li class='ipt-pic-title-text'>图片</li><i class='glyphicon-remove' id='ipt-pic-close'></i></ul>"
                    );
                    $iptctn.append($iptnav);
                    var $ipt = $(
                        "<div class='ipt-pic-body'>  <input class='pic-link' type='text' placeholder='http://...'/>   <div class='ipt-pic-btn-body'><div class='ipt-pic-btn'>插入</div></div> </div>"
                    );
                    $ipt.css('width', '300px');
                    //console.log($($ipt));
                    //判断是否已点击图片
                    //console.log($editor._selectedImg);
                    $iptctn.append($ipt);

                    $elem.append($iptctn);
                    $('.ipt-pic-close').on('click', function () {
                        $('.ipt-pic-ctn').css('display', 'none');
                        hoverDisplay[chooseId] = false;
                    });
                    $('.ipt-pic-btn').on('click', function () {
                        if (!(typeof (navChooseConstructor[chooseId]) ===
                                "function")) {
                            return;
                        }
                        var chooseFn = new navChooseConstructor[chooseId](Leditor);
                        //判断是否无选区
                        if (Leditor.selection.getRangeElem() == null) {
                            return;
                        }
                        chooseFn.onClick();
                        //试图改变状态
                        if (typeof (chooseFn.changeActive) === "function") {
                            chooseFn.changeActive();
                        }
                        //清空ipt
                        //$('.ipt-text').val("");
                        $('.pic-link').val("");
                        //隐藏ipt
                        $('.ipt-pic-ctn').css("display", "none");
                        hoverDisplay[chooseId] = false;
                    });
                    ListElem.pic = $iptctn;
                    break;
                default:
                    break;
            }
        }
    };
	//图片的修改框
    function changePanel(Leditor) {
        this.Leditor = Leditor;
        this._active = false;
    };
    changePanel.prototype = {
        constructor: changePanel,
        _init: function _init() {
            this._bindEvent();
            this._changeAlign();
			this._setStartValue();
        },
        _bindEvent: function _bindEvent() {
            var $alignDisplay = false;
            var $picDisplay = false;
            var Leditor = this.Leditor;
            var $editor = Leditor.editor;
            var $img = $editor._selectedImg;
            $('.btn-align').on('click', function (e) {
                //console.log(1);
                if ($alignDisplay === false) {
                    $('.align-body').css('max-height', '55px');
                    $alignDisplay = true;
                } else {
                    $('.align-body').css('max-height', '0px');
                    $alignDisplay = false;
                }
            });
            $('.btn-pic').on('click', function (e) {
                if ($picDisplay === false) {
                    $('.pic-body').css('max-height', '55px');
                    $picDisplay = true;
                } else {
                    $('.pic-body').css('max-height', '0px');
                    $picDisplay = false;
                }
            });
            $('.show-scope-input').on('blur', function (e) {
                var $scope = $(this).val();
                var $scopeExp = /[0-9]\d*\%$/;
                var $scope1Exp = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/;
                //是百分数
                if ($scopeExp.test($scope)) {
                    //修改图片
                    $img.css('width', $scope);
                    $img.css('height', $scope);
                    //console.log($scope);
                } else if ($scope1Exp.test($scope) || $scope === "1") {
                    //是小数
                    $scope = parseFloat($scope) * 100 + "%";
                    $img.css('width', $scope);
                    $img.css('height', $scope);
                    //console.log($scope);
                } else {
                    return;
                }
            });
            $('.show-hspace-input').on('blur', function (e) {
                var $hspace = $(this).val();
                var $hspaceExp = /[0-9]+px$/;
                var $hspace2Exp = /^0|[1-9]\d*$/
                //是像素
                if ($hspaceExp.test($hspace)) {
                    $img.attr('hspace', $hspace);
                    //console.log($hspace);
                } else if ($hspace2Exp.test($hspace)) {
                    //是整数
                    $hspace = $hspace + "px";
                    $img.attr('hspace', $hspace);
                    //console.log($hspace);
                } else {
                    return;
                }
            });
            $('.show-vspace-input').on('blur', function (e) {
                var $vspace = $(this).val();
                var $vspaceExp = /[0-9]+px$/;
                var $vspace2Exp = /^0|[1-9]\d*$/
                //是像素
                if ($vspaceExp.test($vspace)) {
                    $img.attr('vspace', $vspace);
                    //console.log($vspace);
                } else if ($vspace2Exp.test($vspace)) {
                    //是整数
                    $vspace = $vspace + "px";
                    $img.attr('vspace', $vspace);
                    //console.log($vspace);
                } else {
                    return;
                }
            });
            $('.pic-change-link').on('blur', function (e) {
                var $link = $(this).val();
                //不作鉴定
                if ($link === "") return;
                //console.log($link);
                $img.attr('src', $link);
            });
        },
        _changeAlign: function _changeAlign() {
            var Leditor = this.Leditor;
            var $editor = Leditor.editor;
            var $img = $editor._selectedImg;
            $('.change-btn').on('click', function (e) {
                //来自id值
                var $id = e.target.id;
                $img.css('vertical-align', $id);
            });
        },
        _setStartValue: function _setStartValue() {
            var Leditor = this.Leditor;
            var $editor = Leditor.editor;
            var $img = $editor._selectedImg;
            //得到img中的值
            var $imgAlign = $img.css('vertical-align');
            var $imgScopeH = $img.css('height');
            var $imgScopeW = $img.css('width');
            var $imgHspace = $img.attr('hspace');
            var $imgVspace = $img.attr('vspace');
			
            var $strAlign = null;
			var $percentExp = /[0-9]+\%$/;
            switch ($imgAlign) {
                case "text-top":
                    $strAlign = "顶部文字环绕";
                    break;
                case "text-bottom":
                    $strAlign = "底部文字环绕";
                    break;
                case "middle":
                    $strAlign = "中部文字环绕"
                default:
                    break;
            }
            if ($strAlign != null) $('.show-align-span').text($strAlign);
            //宽高等同
			//皆为百分比
			if(!$percentExp.test($imgScopeH)||!$percentExp.test($imgScopeW)){
				$('.show-scope-input').val('NaP');
			}else{
				if ($imgScopeH === $imgScopeW){
					$('.show-scope-input').val($imgScopeH);
				}
			}
			//留白
			if($imgHspace != null){
				$('.show-hspace-input').val($imgHspace);
			}
			if($imgVspace != null){
				$('.show-vspace-input').val($imgVspace);
			}
			
        }
    };
    //-------------功能
    //粗体
    function Blod(Leditor) {
        this.Leditor = Leditor;
        this.$elem = $('#blod');
        this.type = "click";
        //激活判断
        this._active = false;
    };
    Blod.prototype = {
        constructor: Blod,
        onClick: function onClick(e) {
            var Leditor = this.Leditor;
            var isEmptySelection = Leditor.selection.isEmptyRange();
            //空选区
            if (isEmptySelection) {
                //插入并选中空白
                Leditor.selection.creatEmptyRange();
            }
            Leditor.cmd.do('bold');
            if (isEmptySelection) {
                Leditor.selection.collapseRange();
                Leditor.selection.reSelection();
                return;
            }
            if (checkEmpty(Leditor)) {
                Leditor.selection.collapseRange();
                Leditor.selection.reSelection();
            }
        },
        //修改Active状态
        changeActive: function changeActive() {
            var Leditor = this.Leditor;
            var $elem = this.$elem;
            if (Leditor.cmd.queryCommandState('bold')) {
                this._active = true;
                $elem.addClass('nav-active');
            } else {
                this._active = false;
                $elem.removeClass('nav-active');
            }
        }
    };
	//中横线
	function Through(Leditor) {
		this.Leditor = Leditor;
		this.$elem = $('#strikeThrough');
		this.type = "click";
		//激活判断
		this._active = false;
	};
	Through.prototype = {
		constructor: Through,
		onClick: function onClick(e) {
			var Leditor = this.Leditor;
			var isEmptySelection = Leditor.selection.isEmptyRange();
			//空选区
			if (isEmptySelection) {
				//插入并选中空白
				Leditor.selection.creatEmptyRange();
			}
			Leditor.cmd.do('strikeThrough');
			if (isEmptySelection) {
				Leditor.selection.collapseRange();
				Leditor.selection.reSelection();
				return;
			}
			if (checkEmpty(Leditor)) {
				Leditor.selection.collapseRange();
				Leditor.selection.reSelection();
			}
		},
		//修改Active状态
		changeActive: function changeActive() {
			var Leditor = this.Leditor;
			var $elem = this.$elem;
			if (Leditor.cmd.queryCommandState('strikeThrough')) {
				this._active = true;
				$elem.addClass('nav-active');
			} else {
				this._active = false;
				$elem.removeClass('nav-active');
			}
		}
	};
	//下划线
	function Under(Leditor) {
		this.Leditor = Leditor;
		this.$elem = $('#underline');
		this.type = "click";
		//激活判断
		this._active = false;
	};
	Under.prototype = {
		constructor: Under,
		onClick: function onClick(e) {
			var Leditor = this.Leditor;
			var isEmptySelection = Leditor.selection.isEmptyRange();
			//空选区
			if (isEmptySelection) {
				//插入并选中空白
				Leditor.selection.creatEmptyRange();
			}
			Leditor.cmd.do('underline');
			if (isEmptySelection) {
				Leditor.selection.collapseRange();
				Leditor.selection.reSelection();
				return;
			}
			if (checkEmpty(Leditor)) {
				Leditor.selection.collapseRange();
				Leditor.selection.reSelection();
			}
		},
		//修改Active状态
		changeActive: function changeActive() {
			var Leditor = this.Leditor;
			var $elem = this.$elem;
			if (Leditor.cmd.queryCommandState('Under')) {
				this._active = true;
				$elem.addClass('nav-active');
			} else {
				this._active = false;
				$elem.removeClass('nav-active');
			}
		}
	};
    //标题
	
    function Head(Leditor) {
        this.Leditor = Leditor;
        this.$elem = $('#formatBlock');
        this._active = false;
        this.type = "list";
    };
    Head.prototype = {
        constructor: Head,
        onClick: function onClick(e) {
            var Leditor = this.Leditor;
            //value来自List的nodeName
            var value = e.target.nodeName;
            var reg = /^h/i;
            //判断nodeName合法性
            if (!reg.test(value)) {
                return;
            }
            var $editor = Leditor.editor;
            var $selectionElem = Leditor.selection.getRangeElem();
            //不能选中多行设置head，会合并行并<p>改为<br>
            //若多行选中，则getRangeElem()会返回父元素节点,此时与body节点相同
            //注意判断是否为空选区，空选区时无视选择
            if ($selectionElem[0] == $editor[0] && $selectionElem) {
                return;
            };
            Leditor.cmd.do('formatBlock', value);
        },
        changeActive: function changeActive(e) {
            var Leditor = this.Leditor;
            var $elem = this.$elem;
            var cmdValue = Leditor.cmd.queryCommandValue('formatBlock');
            var reg = /^h/i; //以h开头的不区分大小写
            if (reg.test(cmdValue)) {
                this._active = true;
                $elem.addClass('nav-active');
            } else {
                this._active = false;
                $elem.removeClass('nav-active');
            }
        }
    };
    //文字大小
    function FontSize(Leditor) {
        this.Leditor = Leditor;
        this.$elem = $('#fontSize');
        this._active = false;
        this.type = "list";
    };
    FontSize.prototype = {
        constructor: FontSize,
        onClick: function onClick(e) {
            var Leditor = this.Leditor;
            $editor = Leditor.editor;
            var $elem = this.$elem;
            //得到的是list的value，跟Head不一样
            //html字体size 最高为7
            var value = $(e.target)[0].id;
            //console.log($(e.target)[0].id);
            var isEmptySelection = Leditor.selection.isEmptyRange();
            //空选区
            if (isEmptySelection) {
                //插入并选中空白
                Leditor.selection.creatEmptyRange();
            }
            Leditor.cmd.do('fontSize', value);
            if (isEmptySelection) {
                Leditor.selection.collapseRange();
                Leditor.selection.reSelection();
                return;
            }
            if (checkEmpty(Leditor)) {
                Leditor.selection.collapseRange();
                Leditor.selection.reSelection();
            }
        }
    };

    //字体
    function FontName(Leditor) {
        this.Leditor = Leditor;
        this._active = false;
        this.$elem = $('#fontName');
        this.type = "list";
    };
    FontName.prototype = {
        constructor: FontName,
        onClick: function onClick(e) {
            //此处可使修改文字种类只能用框选的方式修改，而不是开启书写文字的状态
            //注意,若打开修改状态,则会创建空选区,多次创建空选区(转换文字状态)会跳出span元素导致失常(已解决)
            //原因是空白本身不会被选中,判断是否为空选区时,会多次添加空白
            var Leditor = this.Leditor;
            var $elem = this.$elem;
            var value = $(e.target).css('font-family');
            //若需要关闭状态,则注释除执行外下面所有代码
            var isEmptySelection = Leditor.selection.isEmptyRange();
            //空选区
            if (isEmptySelection) {
                //插入并选中空白
                Leditor.selection.creatEmptyRange();
            }
            Leditor.cmd.do('fontName', value);
            if (isEmptySelection) {
                Leditor.selection.collapseRange();
                Leditor.selection.reSelection();
                return;
            }
            if (checkEmpty(Leditor)) {
                Leditor.selection.collapseRange();
                Leditor.selection.reSelection();
            }
        }
    }
    //字体颜色
    function FontColor(Leditor) {
        this.Leditor = Leditor;
        this._active = false;
        this.$elem = $('#foreColor');
        this.type = "listBlock";
    };
    FontColor.prototype = {
        constructor: FontColor,
        onClick: function onClick(e) {
            var Leditor = this.Leditor;
            var $elem = this.$elem;
            var value = $(e.target).css('background-color');
            var isEmptySelection = Leditor.selection.isEmptyRange();
            //空选区
            if (isEmptySelection) {
                //插入并选中空白
                Leditor.selection.creatEmptyRange();
            }
            Leditor.cmd.do('foreColor', value);
            if (isEmptySelection) {
                Leditor.selection.collapseRange();
                Leditor.selection.reSelection();
                return;
            }
            if (checkEmpty(Leditor)) {
                Leditor.selection.collapseRange();
                Leditor.selection.reSelection();
            }
        }
    }
    //斜体
    function Italic(Leditor) {
        this.Leditor = Leditor;
        this._active = false;
        this.$elem = $('#italic');
        this.type = "click";
    };
    Italic.prototype = {
        constructor: Italic,
        onClick: function onClick(e) {
            var Leditor = this.Leditor;
            var $elem = this.$elem;
            var isEmptySelection = Leditor.selection.isEmptyRange();
            //空选区
            if (isEmptySelection) {
                //插入并选中空白
                Leditor.selection.creatEmptyRange();
            }
            Leditor.cmd.do('italic');
            if (isEmptySelection) {
                Leditor.selection.collapseRange();
                Leditor.selection.reSelection();
                return;
            }
            if (checkEmpty(Leditor)) {
                Leditor.selection.collapseRange();
                Leditor.selection.reSelection();
            }
        },
        changeActive: function changeActive(e) {
            var Leditor = this.Leditor;
            var $elem = this.$elem;
            if (Leditor.cmd.queryCommandState('italic')) {
                this._active = true;
            } else {
                this._active = false;
            }
        }
    }
    //字体背景色
    function hiliteColor(Leditor) {
        this._active = false;
        this.Leditor = Leditor;
        this.$elem = $('#hiliteColor');
        this.type = "listBlock";
    };
    hiliteColor.prototype = {
        constructor: hiliteColor,
        onClick: function onClick(e) {
            var Leditor = this.Leditor;
            var $elem = this.$elem;
            var value = $(e.target).css('background-color');
            var isEmptySelection = Leditor.selection.isEmptyRange();
            //空选区
            if (isEmptySelection) {
                //插入并选中空白
                Leditor.selection.creatEmptyRange();
            }
            Leditor.cmd.do('hiliteColor', value);
            if (isEmptySelection) {
                Leditor.selection.collapseRange();
                Leditor.selection.reSelection();
                return;
            }
            if (checkEmpty(Leditor)) {
                Leditor.selection.collapseRange();
                Leditor.selection.reSelection();
            }
        }
    };
    //遍历dom树(深度)
    //废弃深度遍历 2018-6-30
    //注意在dom树中父节点包含了子节点的内容，若遍历到父节点，则无需再遍历子节点，不然会重复加上子节点的内容
    var $htmlStr = "";

    function interator(oParent) {
        //多行选中有子节点，提取子节点值加以处理
        //单行选中直接提取选中节点值
		$htmlStr = "";
        if (oParent.hasChildNodes()) {
            for (var oNode = oParent.firstChild; oNode; oNode = oNode.nextSibling) {
                if (oNode.innerText != null) {
                    if (oNode.nodeName === "P") {
                        $htmlStr = $htmlStr + oNode.innerText.replace(/\u200b/gm, '') + "\n";
                    } else $htmlStr = $htmlStr + oNode.innerText.replace(/\u200b/gm, '');
                }
                //interator(oNode);
            }
        } else $htmlStr = oParent.innerText.replace(/\u200b/gm, '');
        return;
    }
	//引用段
	function Quote(Leditor){
		this.Leditor = Leditor;
		this.type = 'click';
	};
	Quote.prototype = {
		constructor: Quote,
		//直接标注整行
		onClick: function onClick(e){
			var Leditor = this.Leditor;
			var range = Leditor.selection.getRange();
			var $selectionElem = Leditor.selection.getRangeElem();
			var $ElemParentList = $selectionElem.parents();
			if ($selectionElem.nodeName === "blockquote") {
				this.reMove($selectionElem);
				return;
			}
			for (var i = 0; i < $ElemParentList.length; i++) {
				if ($ElemParentList[i].nodeName === "blockquote") {
					this.reMove($selectionElem);
					return;
				}
			}
			var $BlockQuote = $("<blockquote><br></blockquote>");
			$BlockQuote.insertAfter($selectionElem);
		},
		reMove: function reMove($elem){
			var Leditor = this.Leditor;
			var range = Leditor.selection.getRange();
			$($elem).unwarp();
			$($elem).wrap("<p></p>");
		}
	}
	//分割线
	function Line(Leditor){
		this.Leditor = Leditor;
		this.type = 'click';
	}
	Line.prototype = {
		constructor: Line,
		onClick: function onClick(e){
			var Leditor = this.Leditor;
			var range = Leditor.selection.getRange();
			var $selectionElem = Leditor.selection.getRangeElem();
			var $line = $("<div class='article-line'></div>");
			$line.insertAfter($selectionElem);
			//空p
			var $p = $("<p><br></p>");
			//在节点后添加一个空白P
			$p.insertAfter($line);
			Leditor.selection.creatElemRange($p, true);
			Leditor.selection.reSelection();
		}
	}
    //代码段
    //记录顶级pre节点
    var $topParent = void 0;

    function Code(Leditor) {
        this.Leditor = Leditor;
        //this.$elem = $('#codePanel');
        this.type = 'click';
    };
    Code.prototype = {
        constructor: Code,
        onClick: function onClick(e) {

            var Leditor = this.Leditor;
            var $elem = this.$elem;
            //var value = $elem.innerText;
            var range = Leditor.selection.getRange();
            var $startSelection = Leditor.selection.getRange().startContainer;
            var $endSelection = Leditor.selection.getRange().endContainer;
            var $selectionText = Leditor.selection.getText();
            var isSeleEmpty = Leditor.selection.isEmptyRange();
            var $selectionElem = Leditor.selection.getRangeElem();
            //console.log($selectionElem);
            var $ElemParentList = $selectionElem.parents();
            //避免<pre><code><code></pre><code><code>的情况,拒绝跨元素直接处理
            //拒绝偏移量
            //特殊处理,将整个html内容用pre包裹,去掉父节点
            //非空(空白符不是非空状态),处理方式与上述相同,避免顶级元素为p
            //拒绝重复创建代码区
			//选中图片会有奇怪的bug(UNDO)
            if (!($startSelection[0] === $endSelection[0]) || !isSeleEmpty) {
                if ($selectionElem.nodeName === "CODE" || $selectionElem.nodeName === "PRE") {
                    return;
                }
                for (var i = 0; i < $ElemParentList.length; i++) {
                    if ($ElemParentList[i].nodeName === "CODE" || $ElemParentList[i].nodeName === "PRE") {
                        return;
                    }
                }
                //得到选中的dom片段
                var $rangeHTML = range.cloneContents();
                if (!$rangeHTML) {
                    return;
                }
                //删除选中的dom片段
                range.deleteContents();
                //在range处插入处理后的html
                $html = this._changeHTML($rangeHTML);
                //console.log($html);
                range.insertNode($html[0]);
                //储存top父节点
                $topParent = $html[0];
                return;
            }
            //选区为空,插入<pre><code>
			if ($selectionElem.nodeName === "CODE" || $selectionElem.nodeName === "PRE") {
				return;
			}
			for (var i = 0; i < $ElemParentList.length; i++) {
				if ($ElemParentList[i].nodeName === "CODE" || $ElemParentList[i].nodeName === "PRE") {
					return;
				}
			}
            var $PreCode = $("<pre><code><br></code></pre>");
            $topParent = $PreCode;
			$PreCode.insertAfter($selectionElem);
            //range.insertNode($PreCode[0]);
        },
        //这里实际上应当取消标签样式，并解除P标签，并入CODE
        _changeHTML: function _changeHTML($html) {
            var $Pre = $("<pre></pre>");
            var $Code = $("<code></code>");
            //console.log($html.textContent);
            /*console.log($html.textContent);
            for(var i = $html.firstChild ; i ; i = $html.nextSibling){
            	
            	//i.innerHTML = i.innerHTML.replace(/\u200b/gm, '');
            	console.log(i.textContent);
            }*/
            //console.log($html);
            interator($html);
            console.log($htmlStr);
            //单节点情况下，注意type为text的range无法用innerText抽出值
            if ($htmlStr == "") {
                $htmlStr = $html.textContent;
            }
            $Code.append($htmlStr);
            /*var str = $Code[0].innerText;
            console.log(str);
            //str = str.replace(/[\r]/g, "");
            console.log(str);
            //$Code[0].innerText = str;
            console.log($Code);*/
            $Pre.append($Code);
            return $Pre;
        }
    };
    //布局
    function Align(Leditor) {
        this.Leditor = Leditor;
        this.type = "list";
        this._active = false;
    };
    Align.prototype = {
        constructor: Align,
        onClick: function onClick(e) {
            var Leditor = this.Leditor;
            var value = void 0;
            //value来自List的id
            if (e.target.nodeName !== "SPAN") {
                //console.log(e.target.parentElement.id);
                value = e.target.parentElement.id;
            } else value = e.target.id;
            var $editor = Leditor.editor;
            var $selectionElem = Leditor.selection.getRangeElem();
            switch (value) {
                case "left":
                    Leditor.cmd.do('justifyLeft');
                    break;
                case "right":
                    Leditor.cmd.do('justifyRight');
                    break;
                case "center":
                    Leditor.cmd.do('justifyCenter');
                default:
                    break;
            }
            //Leditor.cmd.do('formatBlock', value);
        },
    };
    //超文本链接
    function Link(Leditor) {
        this.Leditor = Leditor;
        this._active = false;
        this.type = 'input-panel';
        this.$elem = $('#link');
    };
    Link.prototype = {
        constructor: Link,
        onClick: function onClick() {
            var Leditor = this.Leditor;
            //得到链接标签与链接
            var textval = $('.ipt-text').val();
            var linkval = $('.ipt-link').val();
            if (linkval === "") linkval = "#";
            //if(!regLink.test(linkval))
            if (textval === "") {
                textval = linkval;
            }
            var $link = $("<a href = '" + linkval + "'>" + textval + "</a>");
            Leditor.cmd.do('insertElem', $link);
        }
    }
    //图片
    function Pic(Leditor) {
        this.Leditor = Leditor;
        this._active = false;
        this.type = 'input-panel';
        this.$elem = $('#pic')
    }
    Pic.prototype = {
        constructor: Pic,
        onClick: function onClick() {
            var Leditor = this.Leditor;
            var $editor = Leditor.editor;
            //var textval = $('.pic-text').val();
            var picval = $('.pic-link').val();
            //不作pic链接鉴定
            if (picval === "") {
                return;
            }
            var $piclink = $("<img src = '" + picval + "'/>");
            $piclink.css('vertical-align', 'text-bottom');
            //$piclink.css('max-height', '100%');
            $piclink.css('cursor', 'pointer');
            Leditor.cmd.do('insertElem', $piclink);
            $editor._selectedImg = $piclink;
        }
    }

    //-------------构架
    //构造函数，Editor本体
    function Body(Leditor) {
        this.Leditor = Leditor;
        this.SpanFlag = false;
    };
    Body.prototype = {
        constructor: Body,
        //初始化
        init: function init() {
            this._bindEvent();
        },
        //清空Editor
        clear: function clear() {
            this.html('<p><br></p>');
        },
        //获取/替换HTML
        html: function html(val) {
            var Leditor = this.Leditor;
            var $editor = Leditor.editor;
            var html = void 0;
            //无选区状态下,会创建空选区&#8203,在得到数据时替换。
            if (val == null) {
                html = $editor.html();
                //替换空选区
                html = html.replace(/\u200b/gm, '');
                //获取HTML
                return html;
            } else {
                $editor.html(val);
                //定位尾部
                Leditor.initSelection();
            }
        },
        //获得JSON,后台接口(I/O)
        GetJSON: function GetJSON() {
            var Leditor = this.Leditor;
            var $editor = Leditor.editor;
            return getChildrenJSON($editor);
        },
        //获得/替换text
        text: function text(val) {
            var Leditor = this.Leditor;
            var $editor = Leditor.editor;
            var text = void 0;
            if (val == null) {
                text = $editor.text();
                text = text.replace(/\u200b/gm, '');
                return text;
            } else {
                $editor.text(val);
                Leditor.initSelection();
            }
        },
        //添加元素
        append: function append(html) {
            var Leditor = this.Leditor;
            var $editor = Leditor.editor;
            $editor.append($(html));
            Leditor.initSelection();
        },
        //绑定事件---DO
        _bindEvent: function _bindEvent() {
            this._saveRange();
            this._enterKey();
            this._delKey();
            this._imgHandle();
        },
        //在任意时候保存选区
        _saveRange: function _saveRange() {
            var Leditor = this.Leditor;
            $editor = Leditor.editor;

            function saveRange() {
                Leditor.selection.saveRange();
                //console.log(window.getSelection().getRangeAt(0));
            };
            //一种是任意按键，触发保存选区
            $editor.on('keyup', function () {
                saveRange();
            });
            //一种是鼠标点击（拖动选区同样触发）
            //当mousedown情况下移出body区域
            //单单点击时，需将range折叠，避免reselection时还原上次选区
            $editor.on('mousedown', function () {
                Leditor.selection.collapseRange();
                $editor.on('mouseleave', saveRange);
            });
            //完成点击，即完成拖动,取消移出事件
            $editor.on('mouseup', function () {
                saveRange();
                $editor.off('mouseleave', saveRange);
            })
        },
        //回车键---//TODO enterKey
        _enterKey: function _enterKey() {
            var Leditor = this.Leditor;
            $editor = Leditor.editor;
            //创建空白P标签,并替换选中元素
            function CreatEmptyPNode($selectionElem) {
                var $p = $("<p><br></p>");
                $p.insertBefore($selectionElem);
                Leditor.selection.creatElemRange($p, true);
                Leditor.selection.reSelection();
                $selectionElem.remove();
            };
            //强制生成以P为顶级节点的节点
            function pCreat(e) {
                var $selectionElem = Leditor.selection.getRangeElem();
                var $parentElem = $selectionElem.parent();
                //在code标签下按回车，输入的是\n，特殊跳出
                if ($parentElem.html() === '<code><br><code>') {
                    CreatEmptyPNode($selectionElem);
                    return;
                }
                //判断是否是顶级标签,父节点不是顶级标签的情况下，即有所修改
                if (!($editor[0] === $parentElem[0])) {
                    return;
                }
                var nodeName = $selectionElem[0].nodeName;
                if (nodeName === "P") {
                    return;
                }
                //正常情况下不会有值
                if ($selectionElem.text()) {
                    return;
                }
                //替换
                CreatEmptyPNode($selectionElem);
            };
            $editor.on('keyup', function (e) {
                //判断回车
                if (e.keyCode != 13) {
                    return;
                }
                pCreat(e);
            });
            //在<pre><code><br></code></pre>下特殊判断
            function codeCreat(e) {
                var $selectionElem = Leditor.selection.getRangeElem();
                if (!$selectionElem) {
                    return;
                }
                var $parentElem = $selectionElem.parent();
                var $parentsElem = $selectionElem.parents();
                var selectionNodeName = $selectionElem[0].nodeName;
                var parentNodeName = $parentElem[0].nodeName;
                //判断是否为span的情况
                for (var i = 0; i < $parentsElem.length; i++) {
                    //span下会生成<pre>标签，阻止
                    if ($parentsElem[i].nodeName === "CODE" || $parentsElem[i].nodeName === "PRE") {
                        if (selectionNodeName === "CODE") this.spanFlag = false;
                        else {
                            this.spanFlag = true;
                            //记录顶级节点
                        }
                    }
                }
                //判断情况是否符合
                //既不是CODE又不是span
                //取消代码空行鉴定
                if (!(selectionNodeName === "CODE") && !this.spanFlag) {
                    Leditor.checkCode = false;
                    return;
                }
                if (this.spanFlag) {
                    //console.log(1);
                    //用code块阻隔span,所以需要两次插入退出样式编辑状态(solve)
                    var $code = $("<code><br></code>");
                    //$topParent.
                    $selectionElem.after($code);
                    Leditor.selection.creatElemRange($code, false, true);
                    Leditor.selection.reSelection();
                    this.spanFlag = false;
                    e.preventDefault();
                    return;
                }
                //ie不支持
                if (!Leditor.cmd.queryCommandSupported('insertHTML')) {
                    return;
                }
                //checkCode判断连续在Code块里回车两次的情况
                if (Leditor.checkCode === true) {
                    var $p = $("<p><br></p>");
                    //在top节点后添加一个空白P
                    $p.insertAfter($topParent);
                    Leditor.selection.creatElemRange($p, true);
                    Leditor.selection.reSelection();

                    Leditor.checkCode = false;
                    //阻止添加Code块的默认回车
                    e.preventDefault();
                    return;
                }
                //若是当下的Range的起始点+1即为整个HTML的长度，则认为添加了一空行（一次回车）,则下次回车跳出
                //存在bug，若选择中间空行，则永不退出(暴力测试)(solve)
                var _startOffset = Leditor.selection.getRange().startOffset;
                Leditor.cmd.do('insertHTML', '\n');
                Leditor.selection.saveRange();
                if (Leditor.selection.getRange().startOffset === _startOffset) {
                    // 没起作用，再来一遍(sovle)
                    Leditor.cmd.do('insertHTML', '\n');
                }

                var selectLength = $selectionElem.html().length;
                /*if (Leditor.selection.getRange().startOffset + 1 === selectLength) {
                    Leditor.checkCode = true;
                }*/
                e.preventDefault();
            }
            $editor.on("keydown", function (e) {
                //不是回车，则取消code空行鉴定
                if (e.keyCode !== 13) {
                    Leditor.checkCode = false;
                    return;
                } else {
                    //code行下特殊鉴定
                    codeCreat(e);
                    //两次连续回车准备跳出代码块
                    Leditor.checkCode = true;
                }
            });
        },
        //退格判定
        _delKey: function _delKey() {
            var Leditor = this.Leditor;
            var $editor = Leditor.editor;
            $editor.on("keydown", function (e) {
                //判断是否是退格键
                if (e.keyCode !== 8) {
                    return;
                }
                var text = $editor.html().toLowerCase().trim();
                //只剩下默认空白P，则阻止删除事件
                if (text === '<p><br><p>') {
                    e.preventDefault();
                    return;
                }
            });
            //删空判定,不允许删空，增加空P
            $editor.on("keyup", function (e) {
                if (e.keyCode !== 8) {
                    return;
                }
                var text = $editor.html().toLowerCase().trim();
                //firefox下 默认添加<br>
                if (!text || text === '<br>') {
                    $p = $("<p><br></p>");
                    //清空，适应firefox
                    $editor.html('');
                    $editor.append($p);
                    Leditor.selection.creatElemRange($p, true);
                    Leditor.selection.reSelection();
                }
            });
        },
        _imgHandle: function _imgHandle() {
            var Leditor = this.Leditor;
            var $editor = Leditor.editor;
            /*var $selectedDiv = $(
                "<div class='tip-ctn'><div class='tip-resize-ctn'><input class='tip-x-ipt' type='text' placeholder='宽'/><input class='tip-y-ipt' type='text' placeholder='高'><div class='tip-resize-btn'>修改</div></div></div>"
            );
            $selectedDiv.css('display', 'none');
            $selectedDiv.css('position', 'absolute');
            $selectedDiv.css('z-index', '10000');*/
            //是否初始化选择框
            //$editor._selectedDivInit = false;
            //$('.editor').append($selectedDiv);
            //console.log($($selectedDiv));
			//初始化选框
			var $changeDiv = $("<div class='pic-changeDiv'></div>");
			//0左上 1左中 2左下 3下中 4下右 5右中 6右上 7 上中
			for(var i = 0 ; i < 8 ; i++){
				var $changeDivHandle = $("<span class='pic-changeHandle"+i+" pic-changeHandle'></span>");
				$changeDiv.append($changeDivHandle);
			}
			//public Elem
			this.$changeDiv = $changeDiv;
            var _this = this;
            $editor.on('click', 'img', function () {
                var $img = $(this);
				var $changeDiv = _this.$changeDiv;
                //记录被选中的img
                $editor._selectedImg = $img;
				//初始化框选
				_this._initSelectedDiv();
				//拖拽事件
				//鼠标按下。鼠标移动。鼠标抬起
                _this._bindEventSelectedDiv();
                //$editor._selectedDivInit = true;

                //创建选区
                Leditor.selection.creatElemRange($img);
                Leditor.selection.reSelection();
                //console.log($img);

            });
            $editor.on('click keyup',function (e) {
                //是否点击图片
                if (e.target.nodeName === 'IMG') {
                    return;
                }
                //取消选框
                $changeDiv.css('display','none');
                $('.editor').append($changeDiv);
                $editor._selectedImg = null;
            });
        },
		//初始化
		_initSelectedDiv: function _initSelectedDiv(){
			var Leditor = this.Leditor;
            var $editor = Leditor.editor;
			var $changeDiv = this.$changeDiv;
			var $img = $editor._selectedImg;
			var $imgx = $img[0].offsetLeft;
			var $imgy = parseInt($img[0].offsetTop) + 50 +"px";
			var $imgw = $img[0].offsetWidth;
			var $imgh = $img[0].offsetHeight;
			//阻止onblur事件
			$changeDiv.attr('unselectable','on');
			//修改display
			$changeDiv.css('display','block');
			//修改光标
			$changeDiv.css('cursor','pointer');
			//根据图片位置修改选框位置
			$changeDiv.css({"width":$imgw,"height":$imgh,"left":$imgx,"top":$imgy,"position":"absolute","border":"1px solid blue"});
			//添加选框
			$('.editor').append($changeDiv);
		},
		//绑定事件
        _bindEventSelectedDiv: function _bindEventSelectedDiv() {
            var Leditor = this.Leditor;
            var $editor = Leditor.editor;
			var $changeDiv = this.$changeDiv;
			var $img = $editor._selectedImg;
			var _this = this;
			//非空
			if($editor._selectedImg === null || $changeDiv === null){
				return;
			}
			//绑定对框选click事件
			$changeDiv.on('click',function(e){
				_this._initSelectedDiv();
			});
			//事件绑定
			$('.pic-changeHandle0').on('mousedown',function(e){
				//记录初始x,y值
				//y往外拉是增大，往内拉是减小
				//x相反
				//console.log(1);
				var $changeDivWidth = parseInt($changeDiv.css('width'));
				var $changeDivHeight = parseInt($changeDiv.css('height'));
				var $mousex = e.clientX;
				var $mousey = e.clientY;
				$('html').on('mousemove',function(e){
					var $mouseCurrentX = e.clientX;
					var $mouseCurrentY = e.clientY;
					//console.log($mouseCurrentX);
					//向左时x减小，右时增大
					$changeDiv.css({"width":$changeDivWidth + $mousex - $mouseCurrentX + "px","height":$changeDivHeight + $mousey - $mouseCurrentY + "px"});
					$img.css({"width":$changeDivWidth + $mousex - $mouseCurrentX + "px","height":$changeDivHeight + $mousey - $mouseCurrentY + "px"});
					
					$('.editor').append($changeDiv);
					//向上时y减小，向下时增大
					});
			});
			
			$('.pic-changeHandle1').on('mousedown',function(e){
				//只判断x轴偏移量
				//console.log(1);
				var $changeDivWidth = parseInt($changeDiv.css('width'));
				var $mousex = e.clientX;
				$('html').on('mousemove',function(e){
					var $mouseCurrentX = e.clientX;
					$changeDiv.css("width",$changeDivWidth + $mousex - $mouseCurrentX + "px");
					$img.css("width",$changeDivWidth + $mousex - $mouseCurrentX + "px");
					$('.editor').append($changeDiv);
				});
			});
			
			$('.pic-changeHandle2').on('mousedown',function(e){
				//y往外拉是减小，往内拉是增大
				//x相同
				var $changeDivWidth = parseInt($changeDiv.css('width'));
				var $changeDivHeight = parseInt($changeDiv.css('height'));
				var $mousex = e.clientX;
				var $mousey = e.clientY;
				$('html').on('mousemove',function(e){
					var $mouseCurrentX = e.clientX;
					var $mouseCurrentY = e.clientY;
					$changeDiv.css({"width":$changeDivWidth + $mousex - $mouseCurrentX + "px","height":$changeDivHeight - $mousey + $mouseCurrentY + "px"});
					$img.css({"width":$changeDivWidth + $mousex - $mouseCurrentX + "px","height":$changeDivHeight - $mousey + $mouseCurrentY + "px"});
					$('.editor').append($changeDiv);
					//
				});
			});
			
			$('.pic-changeHandle3').on('mousedown',function(e){
				//y往里拉是减小，往外是增大
				//只计算y
				var $changeDivHeight = parseInt($changeDiv.css('height'));
				var $mousey = e.clientY;
				$('html').on('mousemove',function(e){
					var $mouseCurrentY = e.clientY;
					$changeDiv.css({"height":$changeDivHeight - $mousey + $mouseCurrentY + "px"});
					$img.css({"height":$changeDivHeight - $mousey + $mouseCurrentY + "px"});
					$('.editor').append($changeDiv);
					//
				});
			});
			
			$('.pic-changeHandle4').on('mousedown',function(e){
				//x往里拉是减小，往外拉是增大
				//y相同
				var $changeDivWidth = parseInt($changeDiv.css('width'));
				var $changeDivHeight = parseInt($changeDiv.css('height'));
				var $mousex = e.clientX;
				var $mousey = e.clientY;
				$('html').on('mousemove',function(e){
					var $mouseCurrentX = e.clientX;
					var $mouseCurrentY = e.clientY;
					$changeDiv.css({"width":$changeDivWidth - $mousex + $mouseCurrentX + "px","height":$changeDivHeight - $mousey + $mouseCurrentY + "px"});
					$img.css({"width":$changeDivWidth - $mousex + $mouseCurrentX + "px","height":$changeDivHeight - $mousey + $mouseCurrentY + "px"});
					$('.editor').append($changeDiv);
					//
				});
			});
			
			$('.pic-changeHandle5').on('mousedown',function(e){
				//x往里拉是减小，往外拉是增大
				//只计算x
				var $changeDivWidth = parseInt($changeDiv.css('width'));
				var $mousex = e.clientX;
				$('html').on('mousemove',function(e){
					var $mouseCurrentX = e.clientX;
					$changeDiv.css({"width":$changeDivWidth - $mousex + $mouseCurrentX + "px"});
					$img.css({"width":$changeDivWidth - $mousex + $mouseCurrentX + "px"});
					$('.editor').append($changeDiv);
					//
				});
			});
			
			$('.pic-changeHandle6').on('mousedown',function(e){
				//x往左拉是减小，往右拉是增大
				//y向下是减小，向上是增大
				var $changeDivWidth = parseInt($changeDiv.css('width'));
				var $changeDivHeight = parseInt($changeDiv.css('height'));
				var $mousex = e.clientX;
				var $mousey = e.clientY;
				$('html').on('mousemove',function(e){
					var $mouseCurrentX = e.clientX;
					var $mouseCurrentY = e.clientY;
					$changeDiv.css({"width":$changeDivWidth - $mousex + $mouseCurrentX + "px","height":$changeDivHeight + $mousey - $mouseCurrentY + "px"});
					$img.css({"width":$changeDivWidth - $mousex + $mouseCurrentX + "px","height":$changeDivHeight + $mousey - $mouseCurrentY + "px"});
					$('.editor').append($changeDiv);
					//
				});
				
			});
			
			$('.pic-changeHandle7').on('mousedown',function(e){
				//y往下拉是减小，往上拉是增大
				//只计算y
				var $changeDivHeight = parseInt($changeDiv.css('height'));
				var $mousey = e.clientY;
				$('html').on('mousemove',function(e){
					var $mouseCurrentY = e.clientY;
					$changeDiv.css({"height":$changeDivHeight + $mousey - $mouseCurrentY + "px"});
					$img.css({"height":$changeDivHeight + $mousey - $mouseCurrentY + "px"});
					$('.editor').append($changeDiv);
					//
				});
			});
			
			$('html').on('mouseup',function(e){
				$('html').off('mousemove');
			});
        }
    };
    //构造函数，选择框
    function Selection(Leditor) {
        this.Leditor = Leditor;
        this._currentRange = null;
    };
    Selection.prototype = {
        constructor: Selection,

        //得到框选
        getRange: function getRange() {
            return this._currentRange;
        },
        //参数 range对象,无参数保存当前选区
        saveRange: function saveRange(_range) {
            if (_range) {
                this._currentRange = _range;
                return;
            }
            //保存当前选区
            var selection = window.getSelection();
            //无选区1
            if (selection.rangeCount === 0) {
                return;
            }
            var range = selection.getRangeAt(0);
            //得到节点
            var $RangeElem = this.getRangeElem(range);

            if (!$RangeElem) {
                return;
            }
            //console.log($RangeElem.parentsUntil('[contenteditable=false]'));
            //判断是否可编辑
            if ($RangeElem.attr('contenteditable') === 'false') {
                return;
            }
            //判断是否在editor-body内
            var Leditor = this.Leditor;
            var $editor = Leditor.editor;
            //阻止特殊情况，这个特殊情况由未折叠引起,已解决
            /*if(range.startOffset == 0 && range.endOffset == 1){
            	range.setStart(range.startContainer,1);
            }*/
            //--------
            //这里不能用children.is() 判断是否包含
            //is会导致重设选区失败，并导致后续选区失效,原因是因为children只返回下一级子元素,is无法鉴定
            if ($editor[0].contains($RangeElem[0])) {
                this._currentRange = range;
            }
        },
        //折叠选区
        collapseRange: function collapseRange(toStart) {
            //默认折叠到末尾,false
            if (toStart == null) {
                toStart = false;
            }
            var range = this._currentRange;
            if (range) {
                range.collapse(toStart);
            }
        },
        //得到选区文字
        getText: function getText() {
            var range = this._currentRange;
            if (range) {
                return this._currentRange.toString();
            } else return '';
        },
        //得到选区的节点
        getRangeElem: function getRangeElem(range) {
            var range = range || this._currentRange;
            var elem = void 0;
            //返回元素节点
            if (range) {
                elem = range.commonAncestorContainer;
                /*//若是元素
                if(elem.nodeType === 1) return $(elem);
                //若不是元素(内容),返回其父节点元素
                else return $(elem.parentNode);*/
                return $(elem.nodeType === 1 ? elem : elem.parentNode);
            }
        },
        //选区判空
        isEmptyRange: function isEmptyRange() {
            var range = this._currentRange;
            var Leditor = this.Leditor;
            if (range && range.startContainer) {
                if (range.startContainer === range.endContainer) {
                    if (range.startOffset === range.endOffset) {
                        if (range.commonAncestorContainer.nodeType == 1) {
                            for (var i = 0; i < range.commonAncestorContainer.children.length; i++) {
                                var $childElem = range.commonAncestorContainer.children[i];
                                if ($childElem.nodeName === "SPAN" && $childElem.innerHTML == "") {
                                    return false;
                                }
                            }
                            return true;
                        }
                        //if(range.commonAncestorContainer.innerText != null){
                        //注意,在空白新行时由于innerText是null所以这里要做一次null判断
                        //当innerText发生改变后，需要再新建一个不可见符至上一个span尾部，选中该符执行操作
                        //这种情况下不会被判空
                        if (range.commonAncestorContainer.innerText == null || range.commonAncestorContainer
                            .innerText[0].charCodeAt() == 8203) {
                            //innerText发生变化判断,尾部添加"&#8203;"
                            if (range.startOffset != 1) {
                                //不能直接innerHTML 原因是会向父元素添加无样式的空符
                                //不能直接innerText 否则这里会添加一个字符串而非字符 使用转义字符添加
                                var str = 8203;
                                str = String.fromCharCode(str);
                                Leditor.cmd.do('insertText', str);
                                //重设选区，选区尾偏移后移一位
                                range.setEnd(range.endContainer, range.endOffset + 1);
                                //console.log(range);
                                this.saveRange(range);
                                this.reSelection();
                                return false;
                            }
                            range.setStart(range.startContainer, range.startOffset - 1);
                            //console.log(range);
                            this.saveRange(range);
                            this.reSelection();
                            return false;
                        }
                        //}
                        return true;

                    }
                }
            }
            return false;
            //true表示空（重合）
        },
        //重载选区
        reSelection: function reSelection() {
            var selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(this._currentRange);
        },
        //创建空白选区
        creatEmptyRange: function creatEmptyRange() {
            var Leditor = this.Leditor;
            var range = this.getRange();
            var elem = void 0;
            //无range被选中
            if (!range) {
                return;
            }
            //range不为空
            if (!this.isEmptyRange()) {
                return;
            }
            //创建空白选区(Webkit)
            try {
                Leditor.cmd.do('insertHTML', "&#8203;");
                //注意,在newline空白行首创建range时,这里会报错
                //原因是选中的Range是元素本身
                //已解决
                //这里需要得到最深节点才能解决问题所在(已解决)
                range.setEnd(range.endContainer, range.endOffset + 1);
                //console.log(range);
                this.saveRange(range);
            } catch (e) {
                //在多次添加空白的情况下会被报错，原因是光标被跳出span定位到了父元素末尾，若加1则超出原span位置长度
                //忽略这种错误
            }
        },
        //根据元素创建Range
        //参数：
        //$elem元素
        //toStart 光标折叠位置 true为开始
        //isContent 是否选中该节点 true为选中 false选中他的父节点(包含于他)，null则不选
        creatElemRange: function creatElemRange($elem, toStart, isContent) {
            if (!$elem.length) {
                return;
            }

            var elem = $elem[0];
            var range = document.createRange();
            if (isContent) {
                range.selectNodeContents(elem);
            } else {
                range.selectNode(elem);
            }

            if (typeof toStart === 'boolean') {
                range.collapse(toStart);
            }
            //存储
            this.saveRange(range);
        }
    };

    //构造函数，控制命令
    function Command(Leditor) {
        this.Leditor = Leditor;
    };
    Command.prototype = {
        constructor: Command,
        //避免混淆,参数 navchoose-id，css参数（--DO?）
        do: function _do(id, value) {
            var Leditor = this.Leditor;
            //styleWithCSS
            if (!Leditor._useStyleWithCSS) {
                document.execCommand('styleWithCSS', null, true);
                Leditor._useStyleWithCSS = true;
            }
            //鉴定选区
            if (!Leditor.selection.getRange()) {
                return;
            }
            //恢复选区
            //console.log(Leditor.selection.getRange());
            Leditor.selection.reSelection();
            //执行操作
            var _id = "_" + id;
            //自定义事件用insertHTML或用Range.insertNode()模拟
            if (this[_id]) {
                this[_id](value);
            } else {
                this._execCommand(id, value);
            }
            //重设至原光标
            //在空白选区状态下失效,原因是span标签的添加会导致span无法定位
            //空白状态下的取消事件是伪取消
            //该问题致使无法同时在空白状态使用某些需要添加空白选区的操作
            //已解决
            Leditor.selection.saveRange();
            Leditor.selection.reSelection();
            //这里Editor发生了改变(TIP)
        },
        _insertHTML: function _insertHTML(html) {
            //IE不支持
            var Leditor = this.Leditor;
            var range = Leditor.selection.getRange();

            if (this.queryCommandSupported('insertHTML')) {
                // W3C
                this._execCommand('insertHTML', html);
            } else if (range.insertNode) {
                // IE
                range.deleteContents();
                range.insertNode($(html)[0]);
            } else if (range.pasteHTML) {
                // IE <= 10
                range.pasteHTML(html);
            }
        },
        //传入节点元素
        _insertElem: function _insertElem($elem) {
            var Leditor = this.Leditor;
            var range = Leditor.selection.getRange();
            range.deleteContents();
            range.insertNode($elem[0]);
        },
        // 封装 document.execCommand
        _execCommand: function _execCommand(id, value) {
            document.execCommand(id, false, value);
        },
        // 封装 document.queryCommandValue
        queryCommandValue: function queryCommandValue(id) {
            return document.queryCommandValue(id);
        },

        // 封装 document.queryCommandState
        queryCommandState: function queryCommandState(id) {
            return document.queryCommandState(id);
        },

        // 封装 document.queryCommandSupported
        queryCommandSupported: function queryCommandSupported(id) {
            return document.queryCommandSupported(id);
        }

    };

    //存储菜单的构造函数
    //跟navChoose的id匹配
    navChooseConstructor = [];
    navChooseConstructor.blod = Blod;
    navChooseConstructor.italic = Italic;
    navChooseConstructor
        .fontSize = FontSize;
    navChooseConstructor.foreColor = FontColor;
    navChooseConstructor.hiliteColor = hiliteColor;
    navChooseConstructor
        .formatBlock = Head;
    navChooseConstructor.fontName = FontName;
    navChooseConstructor.code = Code;
    navChooseConstructor.align = Align;
    navChooseConstructor.link = Link;
    navChooseConstructor.pic = Pic;
	navChooseConstructor.Through = Through;
	navChooseConstructor.Quote = Quote;
	navChooseConstructor.Line = Line;
	navChooseConstructor.Under = Under;
    //-----
    //判断下拉菜单的加载情况
    hoverCheck = [];
    //head
    hoverCheck.formatBlock = false;
    //背景色
    hoverCheck.hiliteColor = false;
    //文字颜色
    hoverCheck.foreColor = false;
    //文字类型
    hoverCheck.fontName = false;
    //文字大小
    hoverCheck.fontSize = false;
    //代码
    hoverCheck.code = false;
    //布局
    hoverCheck.align = false;
    //链接
    hoverCheck.link = false;
    //图片
    hoverCheck.pic = false;
    //图片修改
    hoverCheck.picchange = false;
	//工具条
	hoverCheck.pencil = false;
    //-----
    //判断下拉菜单的display情况
    hoverDisplay = [];
    hoverDisplay.formatBlock = false;
    hoverDisplay.hiliteColor = false;
    hoverDisplay.foreColor = false;
    hoverDisplay.fontName = false;
    hoverDisplay.fontSize = false;
    hoverDisplay.code = false;
    hoverDisplay.align = false;
    hoverDisplay.link = false;
    hoverDisplay.pic = false;
    hoverDisplay.picchange = false;
	hoverDisplay.pencil = false;
    //构造nav
    function Nav(Leditor) {
        this.Leditor = Leditor;
        this.$menu = $('.menu-icon');
    };
    Nav.prototype = {
        constructor: Nav,
        _init: function _init() {
            var _this = this;
            var Leditor = this.Leditor;
            //此处为$(navChoose)
            var $nav = Leditor.navChoose;
            this._bindEvent();
        },
        _bindEvent: function _binEvent() {
            var _this = this;
            var Leditor = this.Leditor;
            $menu = this.$menu;
            var $editor = Leditor.editor;
            for (var i = 0; i < $menu.length; i++) {
                var Leditor = _this.Leditor;
                $($menu[i]).on("click", function (e) {
                    //阻止冒泡
                    e.stopPropagation();
                    //console.log(e);
                    //选择的i标签的id,寻找对应的函数
                    var chooseId = this.firstElementChild.id;
                    //没有找到对应的函数，无功能
                    if (!(typeof (navChooseConstructor[chooseId]) === "function")) {
                        return;
                    }

                    //没有选区
                    if (Leditor.selection.getRangeElem() == null) {
                        return;
                    }
                    var chooseFn = new navChooseConstructor[chooseId](Leditor);
                    //判断是否为输入框
                    //除了i标签与menu-icon之外的所有都return
                    if (e.target.parentNode.className !== "menu-icon" && e.target.nodeName !== "I") {
                        if (e.target.className !== "menu-icon") {
                            return;
                        }
                    }
                    if (chooseFn.type === "input-panel") {
                        //console.log(e);
                        //判断是否点击的pic
                        if (chooseId === "pic") {
                            //判断是否选择图片
                            if ($editor._selectedImg != null) {
                                //图片初始框未加载
                                hoverCheck.pic = false;
                                hoverDisplay.pic = false;
                                //如果已经显示picchange框
                                if (hoverCheck.picchange) {
                                    var $ul = ListElem[chooseId];
                                    if (hoverDisplay.picchange) {
                                        $ul.css('display', 'none');
                                        hoverDisplay.picchange = false;
                                        return;
                                    } else {
                                        $ul.css('display', 'block');
                                        hoverDisplay.picchange = true;
										this.$changePanel._setStartValue();
                                        return;
                                    }
                                }
                                var $img = $editor._selectedImg;
                                var $ipt = $(
                                    "<div class='show-pic-body'><label class='show-align-label'>文字环绕模式:</label><span class='show-align-span'>底部文字环绕</span><label class='show-scope-label' for='show-scope'>等比缩放:</label><input class='show-scope-input' name='show-scope' placeholder='百分比' /><label class='show-space-label' for='show-space'>留白:</label><input class='show-hspace-input' name='show-space' placeholder='左右留白'><input class='show-vspace-input' name='show-space' placeholder='上下留白'></div><ul class='ipt-pic-title'><li class='ipt-pic-title-text'>修改</li></ul><div class='change-pic-body'><div class='ipt-pic-btn-title btn-align'><span class='ipt-pic-btn-title-text'>文字环绕模式</span></div><div class='ipt-pic-change-body align-body'><div class='ipt-change-btn change-btn' id='text-bottom'>底部</div><div class='ipt-change-btn change-btn' id='text-top'>顶部</div><div class='ipt-change-btn change-btn' id='middle'>中央</div></div><div class='ipt-pic-btn-title btn-pic'><span class='ipt-pic-btn-title-text'>图片链接</span></div><div class='ipt-pic-change-body pic-body'><input class='pic-change-link' type='text' placeholder='http://...' /></div></div></div>"
                                );
                                //console.log(1);
                                //取出原先的listElem
                                var $ul = ListElem[chooseId];
                                //移除
                                $ul.remove();
                                var $iptctn = $(
                                    "<div class='ipt-pic-ctn ipt-pic-change-ctn'></div>");
                                var $iptnav = $(
                                    "<ul class='ipt-pic-title'><li class='ipt-pic-title-text'>图片属性</li><i class='glyphicon-remove' id='ipt-pic-change-close'></i></ul>"
                                );
                                $iptctn.append($iptnav);
                                $iptctn.append($ipt);
                                $(this).append($iptctn);
                                //picchange储存
                                ListElem.picchange = $iptctn;
                                //绑定事件
                                this.$changePanel = new changePanel(Leditor);
                                this.$changePanel._init();
                                //pic替换
                                ListElem.pic = $iptctn;
                                hoverDisplay.picchange = true;
                                hoverCheck.picchange = true;
                                return;
                            } else {
                                //未选择图片
                                hoverCheck.picchange = false;
                                hoverDisplay.pichange = false;
                            }
                        }
                        //判断是否已经加载
                        if (hoverCheck[chooseId]) {
                            //得到$ul
                            var $ul = ListElem[chooseId];
                            //显示状态
                            if (hoverDisplay[chooseId]) {
                                $ul.css("display", "none");
                                hoverDisplay[chooseId] = false;
                            } else {
                                //改变状态
                                hoverDisplay[chooseId] = true;
                                $ul.css("display", "block");
                            }
                        } else {
                            if (ListElem[chooseId] != null) ListElem[chooseId].remove();
                            var panel = new Panel(Leditor, $(this));
                            panel._init();
                            hoverCheck[chooseId] = true;
                            hoverDisplay[chooseId] = true;
                        }
                        return;
                    }
                    //判断函数的type是否为click
                    if (!(chooseFn.type == "click")) {
                        return;
                    }
                    //触发事件
                    chooseFn.onClick(e);
                    //寻找是否有changeActive函数，试图修改Active状态
                    //不能比事件执行早，否则状态码返回false,无法执行
                    if (typeof (chooseFn.changeActive) === "function") {
                        chooseFn.changeActive();
                    }
                });
                $($menu[i]).on("mouseenter", function (e) {
                    var chooseId = this.firstElementChild.id;
					//工具条独特加载
					if(chooseId == "pencil"){
						//已被加载触发显示
						//未加载则加载
						console.log(1);
						if (hoverCheck[chooseId]) {
							if (hoverDisplay[chooseId]) {
								return;
							}
							//改变状态
							hoverDisplay[chooseId] = true;
							//得到$ul
							var $ul = ListElem[chooseId];
							$ul.css("display", "block");
						} else {
							var List = new chooseList(Leditor, $(this));
							List._init();
							hoverCheck[chooseId] = true;
							hoverDisplay[chooseId] = true;
						}
						return;
					}
                    if (!(typeof (navChooseConstructor[chooseId]) === "function")) {
                        return;
                    }
                    /*if (Leditor.selection.getRangeElem() == null) {
                        return;
                    }*/
                    var chooseFn = new navChooseConstructor[chooseId](Leditor);
                    //判断函数的type是否为list或者listBlock或者panel
                    if (!(chooseFn.type == "list") && !(chooseFn.type ==
                            "listBlock")) {
                        return;
                    }
                    //已被加载触发显示
                    //未加载则加载
                    if (hoverCheck[chooseId]) {
                        if (hoverDisplay[chooseId]) {
                            return;
                        }
                        //改变状态
                        hoverDisplay[chooseId] = true;
                        //得到$ul
                        var $ul = ListElem[chooseId];
                        $ul.css("display", "block");
                    } else {
                        var List = new chooseList(Leditor, $(this));
                        List._init();
                        hoverCheck[chooseId] = true;
                        hoverDisplay[chooseId] = true;
                    }
                });
                //绑定mouseleave
                $($menu[i]).on("mouseleave", function (e) {
                    var chooseId = this.firstElementChild.id;
                    //list未加载
                    if (!hoverCheck[chooseId]) {
                        return;
                    }
                    //list未显示
                    if (!hoverDisplay[chooseId]) {
                        return;
                    }
                    //$ul不存在
                    if (!ListElem[chooseId]) {
                        return;
                    }
                    //ipt框不应有此绑定
                    if (chooseId === "link" || chooseId === "pic") {
                        return;
                    }
                    var $ul = ListElem[chooseId];
                    $ul.css("display", "none");
                    hoverDisplay[chooseId] = false;
                })
            }
        }
    };
    //构造函数,传入DOM对象 (编辑器,选择框),入口,TIP：这里传入的是$(editor),$(navChoose)
    function Editor(editor, navChoose) {
        if (editor == null) {
            throw new Error('未传入参数，请传入Editorbody');
        }
        this.editor = editor;
        this.navChoose = navChoose;
        this.checkCode = false;
    };

    Editor.prototype = {
        constructor: Editor,
        _initEditor: function _initEditor() {
            var _this = this;
            //编辑器对象，调用用Leditor.editor;
            var Leditor = this.editor;
            var navChoose = this.navChoose;
            //保存编辑器原有数据
            var $children = void 0;
            if (Leditor.children() != null) {
                $children = Leditor.children();
            }
            //记录输入法
            Leditor.on('compositionstart', function () {});
            //输入法结束
            Leditor.on('compositionend', function () {});
        },
        _initBody: function _initBody() {
            this.body = new Body(this);
            this.body.init();
        },
        _initNav: function _initNav() {
            this.nav = new Nav(this);
            this.nav._init();
        },
        //初始化选区,光标定位尾部
        //参数newline为true则光标新建一行
        //注意,newline的<p>元素,无法进行部分操作,原因是未选中内容(已解决)
        initSelection: function initSelection(newline) {
            var Leditor = this.editor;
            var $children = Leditor.children();
            //editor区域无内容
            if (!$children.length) {
                Leditor.append($('<p><br></p>'));
                this.initSelection();
                return;
            }

            var $last = $children.last();

            if (newline) {
                var html = $last.html().toLocaleLowerCase();
                //console.log($last);
                var nodeName = $last[0].nodeName;
                if (html !== '<br>' && html !== '<br\/>' || nodeName !== 'P') {
                    // 最后一个元素不是 <p><br></p>，添加一个空行，重新设置选区
                    Leditor.append($('<p><br></p>'));
                    this.initSelection();
                    return;
                }
            }
            //创建新行
            //-------------
            this.selection.creatElemRange($last, false, true);
            /*var range = this.selection.getRange();
            //原本的偏移量是2,即定位在尾部,由于start与end偏移量重叠,导致无法触发任何事件,这里会重设start
            range.setEnd(range.endContainer, range.endOffset - 1);*/
            this.selection.reSelection();
        },
        //编辑器入口
        creat: function creat() {
            this._initEditor();
            this.cmd = new Command(this);
            this.selection = new Selection(this);
            this._initBody();
            this._initNav();
            this.initSelection();
        }
    };

    //---------
    window.Leditor = Editor;
})();
