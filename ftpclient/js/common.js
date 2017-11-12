/**
 * Created by jchao on 2017/9/15.
 */
/**
 * common.js
 * 共用全局变量
 */
/** 全局公共对象 **/
var common = function() {
    var obj = new Object();
    // 初始化添加公共功能方法
    obj.init = function() {
        // 根据浏览器窗口设置显示高度
        this.setShowHeight();
        // 列表显示 渲染页面
        this.showFileAndDir(rootPath);
    };
    // 邮箱验证
    obj.validEmail = function(email) {
        if (email === undefined || email === "" || email === null) {
            return false;
        }
        var pattern = new RegExp('^([a-zA-Z0-9_\\-.]){1,30}@(([a-zA-Z0-9_-])+[.]{1})+([a-zA-Z]){2,10}$');
        return pattern.test(email);
    };
    // 手机号验证
    obj.validTelephone = function(tel) {
        if (tel === undefined || tel === "" || tel === null) {
            return false;
        }
        var pattern = new RegExp('^(13|15|17|18|14|19|16)[\\d]{9}$');
        return pattern.test(tel);
    };
    obj.validIp = function (ip) {
        if (ip === undefined || ip === "" || ip === null) {
            return false;
        }
        var pattern = new RegExp('([0-9]{1,3}[.]){3}[0-9]{1,3}$');
        return pattern.test(ip);
    };
    // 获取cookie
    obj.getCookie = function(username) {
        var name = username + "=";
        var cary = document.cookie.split(';');
        for(var i=0; i<cary.length; i++) {
            var c = cary[i].trim();
            if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
        }
        return "";
    };
    // 设置cookie
    obj.setCookie = function(cookieName,cookieValue,expiredays) {
        var d = new Date();
        d.setTime(d.getTime()+(expiredays*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = cookieName + "=" + cookieValue + "; " + expires;
    };
    // 本地存储数据
    obj.localStorageObj = function(keyStr, objValue) {
        if (window.localStorage) {
            localStorage.setItem(keyStr, JSON.stringify(objValue));
        } else {
            this.setCookie(keyStr,JSON.stringify(objValue),1);
        }
    };
    // 获取本地存储的数据
    obj.getLocalStorageObj = function(keyStr) {
        return window.localStorage? JSON.parse(localStorage.getItem(keyStr)): JSON.parse(this.getCookie(keyStr));
    };
    // 清除所有本地存储的数据
    obj.localStorageClear = function() {
        localStorage.clear();
    };
    // 移除某个数据根据key
    obj.getLocalStorageRemoveItem = function(keyStr) {
        localStorage.removeItem(keyStr);
    };
    // 文件的后缀名 不带点
    obj.getSuffixName = function (fileName) {
       var index = fileName.lastIndexOf(".");
       if (index === -1)return fileName;
       // 返回不带点的后缀名
       return fileName.substring(parseInt(index)+1);
    };
    // 显示文件列表
    obj.showFileAndDir = function (pathParm) {
        var param = (pathParm === null || pathParm === "" || pathParm === undefined)?rootPath:pathParm;
        var that = this;
        // 显示页面文件列表
        $.ajax({
            url: url + "file/listFilesAndDirs",
            method: 'POST',
            datatype:'json',
            cache:false,
            data:{
                folderPath: param
            }
        }).done(function(data) {
            if (data.msg === "success") {
                // 显示页面文件列表
                that.listFileAndDir(data.data);
                return true;
            }
            that.messageTip("网络失败！请刷新重试！");
            return false;
        }).fail(function () {
            that.messageTip("网络异常！加载失败！请确认访问的服务是否安装或开启！请刷新重试！");
            return false;
        }).done(function () {
            // 关闭load图标
            GlobalData.common.closeLoadImg();
        });
    };
    // 根据请求的结果数据 重新进行渲染页面
    obj.listFileAndDir = function (res) {
        var that = this;
        if (res === undefined || res === "" || res === null) return false;
        // 保存当前显示的所有文件信息
        GlobalData.currentData = res;
        var rightContentId = $("#rightContent");
        // var leftNavId = $("#leftNav ul");
        rightContentId.html("");
        for (var path in res) {
            // 保存当前显示的文件根路径
            GlobalData.currentPath = path;
            // 重新渲染横目录层次列表
            that.listCatalog(path);
            // 左边菜单栏home
            // if (rootPath === path) {
            //     // 左边菜单栏
            //     leftNavId.html("");
            //     leftNavId.append("<li class='menuHome active' style='color: #1E90ff;'><span class='glyphicon glyphicon-home'></span>&nbsp;&nbsp;/</li>");
            // }
            // 渲染页面
            //for(var fileAndDir in res[path]) {
            //if (fileAndDir === "dir") {
            if (res.length < 1) return false;
            var pFileAndDir = res[path]["dir"];
            var file = null;
            for (file in pFileAndDir) {
                var fa = 'fa fa-folder-open fa-5x';
                // 显示左边文件层次目录
                // 回收站图标
                if (rootPath === path && pFileAndDir[file] === "回收站") {
                    // leftNavId.prepend("<li><a href='javascript:;'><i class='fa fa-trash fa-1x'></i>&nbsp;回收站</a></li>");
                    continue;
                }
                // 压缩文件图标
                // if (rootPath === path && pFileAndDir[file] === "压缩文件") {
                //     leftNavId.prepend("<li><a href='javascript:;'><i class='fa fa-file-zip-o fa-1x'></i>&nbsp;压缩文件</a></li>");
                //     continue;
                // }
                // 左边菜单 层次目录图标 并根据是否切换服务端进行刷新目录层次
                // if (rootPath === path && !GlobalData.currentChangeServerFlag) {
                //     leftNavId.append("<li><a href='javascript:;' title='" +pFileAndDir[file]+ "'><i class='fa fa-folder-open fa-1x'></i>&nbsp;"+pFileAndDir[file]+"</a></li>");
                // }
                // 显示右边文件列表
                rightContentId.append("<div title='" +pFileAndDir[file]+ "' class='fileAndDir col-xs-2 col-sm-2 col-md-2 col-lg-2'>"+
                    "<input type='hidden' value='dir' name='' />"+
                    "<i class= '"+ fa +"' style='color: #1E90ff;'></i>"+
                    "<span class='fileName'>"+ pFileAndDir[file] +"</span>"+
                    "</div>"
                );
            }
            //}
            //if (fileAndDir === "file") {
            pFileAndDir = res[path]["file"];
            for (file in pFileAndDir) {
                var suffix = that.getSuffixName(pFileAndDir[file]);
                if (suffix in GlobalType) {
                    rightContentId.append("<div title='" +pFileAndDir[file]+ "' class='fileAndDir col-xs-2 col-sm-2 col-md-2 col-lg-2'>"+
                        "<input type='hidden' value='file' name='' />"+
                        "<i class='"+ GlobalType[suffix] +"' style='color: #1E90ff;'></i>"+
                        "<span class='fileName'>"+ pFileAndDir[file] +"</span>"+
                        "</div>"
                    );
                } else {
                    rightContentId.append("<div title='" +pFileAndDir[file]+ "' class='fileAndDir col-xs-2 col-sm-2 col-md-2 col-lg-2'>"+
                        "<input type='hidden' value='file' name='' />"+
                        "<i class='fa fa-file-text-o fa-5x' style='color: #1E90ff;'></i>"+
                        "<span class='fileName'>"+ pFileAndDir[file] +"</span>"+
                        "</div>"
                    );
                }
            }
            //}
            //}
        }
        // 添加拖拽事件
        this.drag();
        // 加载提示
        this.closeLoadImg();
        return true;
    };
    // 判断文件的类型 文件或文件夹
    obj.isTypeFile = function (fileName) {
        if (fileName === null || fileName === "" || fileName === undefined) return false;
        var res =  GlobalData.currentData;
        for (var path in res) {
            for(var fileAndDir in res[path]) {
                if (fileAndDir === "file") {
                    var pFileAndDir = res[path][fileAndDir];
                    for (var file in pFileAndDir) {
                        if (pFileAndDir[file] === fileName) {
                            return "file";
                        }
                    }
                }
                if (fileAndDir === "dir") {
                    var pFileAndDir = res[path][fileAndDir];
                    for (var file in pFileAndDir) {
                        if (pFileAndDir[file] === fileName) {
                            return "dir";
                        }
                    }
                }
            }
        }
        return false;
    };
    obj.isImg = function (fileName) {
        var suffix = GlobalData.common.getSuffixName(fileName);
        return (suffix === "jpg" || suffix === "jpeg" || suffix === "bmp" || suffix === "gif" || suffix === "png");
    };
    obj.isVideo = function (fileName) {
        var suffix = GlobalData.common.getSuffixName(fileName);
        return (suffix === "ogg" || suffix === "ogv" || suffix === "mp4" || suffix === "webm" || suffix === "rmvb" || suffix === "avi");
    };
    obj.isDocument = function (fileName) {
        var suffix = GlobalData.common.getSuffixName(fileName);
        return (suffix === "txt" ||suffix === "doc" || suffix === "docx" || suffix === "pdf" || suffix === "ppt" || suffix === "pptx" || suffix === "xls" || suffix === "xlsx" || suffix === "log" || suffix === "properties");
    };
    obj.getFileHttpUrl =function (fileName) {
        // 显示路径
        var subPaths = GlobalData.currentPath.substr(rootPath.length+1);
        return url+"upload/"+ $.trim(subPaths) + "/" + fileName;
    };
    obj.showLoadImg = function () {
        // 加载提示
        $("#load_mask").show();
    };
    obj.closeLoadImg = function () {
        // 关闭加载提示
        $("#load_mask").hide();
    };
    obj.drag = function () {
        var that = this;
        // 使能拖动事件
        $(".fileAndDir").draggable({
            accept: ".fileAndDir",
            // 是否返回原位置
            revert: true,
            // 是否有滚动条则滚动
            scroll: false,
            zIndex: 10000000000,
            containment: ".ftpContainer",
            /**cursor: "crosshair",**/
            start: function (event, ui) {
                // 获取拖拽当前的文件名称
                GlobalData.currentCutFile = GlobalData.currentPath + "/" +$(this).children("span").first().text();
            }
        });
        // 放置在元素上的事件
        $(".fileAndDir").droppable({
            // 经过在元素上的事件
            over: function (event, ui) {
                // 放置在移动的文件夹上的效果提示
                var fileName = $(this).children("span").first().text();
                if (that.isTypeFile(fileName) === "dir") {
                    $(this).siblings().css("box-shadow","0 0 0 black");
                    $(this).css("box-shadow","0 0 5px #F01F1C");
                }
            },
            // 放置在上面的事件
            drop: function (event, ui) {
                var fileName = $(this).children("span").first().text();
                if (that.isTypeFile(fileName) === "dir") {
                    // 改变当前移动进的文件路径
                    GlobalData.currentPath = GlobalData.currentPath + "/" + fileName;
                    // 进行移动文件
                    // console.log(GlobalData.currentCutFile);
                    // console.log( GlobalData.currentPath);
                    // 进行移动处理
                    that.pasteFile();
                }
            }
            // 离开时事件
            // out: function (event, ui) {
            //
            // },
            // 取消拖拽事件
            // deactivate: function (event, ui) {
            //
            // }
        });
    };
    /** 粘贴 文件 **/
    obj.pasteFile = function () {
        var that = this;
        // 是否可以操作
        if (!this.noAllowOperate()) {return true;}
        // 加载图标
        this.showLoadImg();
        $.ajax({
            url: url + "file/" + (GlobalData.currentCutFile !== "" && GlobalData.currentCutFile !== null?"cutFileOrDir":"copyFileOrDir"),
            method: 'POST',
            datatype:'json',
            cache:false,
            data:{
                srcFile: (GlobalData.currentCutFile !== "" && GlobalData.currentCutFile !== null?GlobalData.currentCutFile:GlobalData.currentCopyFile),
                desFile: GlobalData.currentPath
            }
        }).done(function(data) {
            if (data.msg === "fail") {
                if (data.data === "has") {
                    that.messageTip("操作失败！已有该文件名称！请重命名后再粘贴！");
                    return false;
                }
                that.messageTip("操作失败！请刷新重试！");
                return false;
            }
            // 剪切成功重新加载页面
            GlobalData.common.showFileAndDir(GlobalData.currentPath);
        }).fail(function () {
            that.messageTip("网络异常！操作失败！请刷新重试！");
            return false;
        }).done(function () {
            GlobalData.currentPasteFlag = false;
            GlobalData.currentCutFile = "";
            GlobalData.currentCopyFile = "";
            // 关闭load图标
            GlobalData.common.closeLoadImg();
        });
    };
    // 两个固定目录不允许操作
    obj.noAllowOperate = function () {
        // var recovery = rootPath+"/回收站";
        // var compress = rootPath+"/压缩文件";
        // var reLen = recovery.length;
        // var coLen = compress.length;
        // if (GlobalData.currentPath.substring(0,reLen) === recovery || GlobalData.currentPath.substring(0,coLen) === compress) {
        //     $("#messageTipModel .modal-body").html("此目录不允许写操作！");
        //     $("#messageTipModel").modal();
        //     return false;
        // }
        return true;
    };
    // 根据浏览器的宽度动态调整主窗口的高度
    obj.setShowHeight = function () {
        var height = $(window).height();
        var contentHeight = height - 200;
        $(".ftpContainer").height(contentHeight);
        $("#rightNav").height(contentHeight);
        $("#leftNav").height(contentHeight);
    };
    // 左边目录层次显示
    obj.listCatalog = function (path) {
        if (path === "/") {return true;}
        var cataLog = path.substr(1).split("/");
        // 保存目录根路径
        var cata = rootPath;
        var iLen = 0;
        // 根路径情况
        if (rootPath !== "/") {iLen = rootPath.substr(1).split("/").length;}
        // 设置根路径
        $("#free .freeRootPath input").attr("name",rootPath);
        // 返回上一级根路径
        $("#free .freeUpNext input").val(rootPath);
        // 移除上一次加载的层次结构
        $("#free .freePathLevel").remove();
        // 目录层次长度
        var lenCata = cataLog.length;
        // 重新渲染目录层次结构
        for (var i = iLen;i < lenCata;i++) {
            // 返回上一级
            if ((i-1) === (lenCata-2)) {$("#free .freeUpNext input").val(cata);}
            cata = cata + "/" + cataLog[i];
            $("#free").append("<div class='freePathLevel'><i class='fa fa-caret-right fa-1x'></i></div><div class='freePathLevel'>"
                + "<input class='freeButton' type='button' name = '"+ cata +"' value='"+ cataLog[i] +"'/></div>"
            );
        }
    };
    /** 消息提示 **/
    obj.messageTip = function (message) {
        if (message === undefined || message === null || message === "") {return true;}
        // 关闭load图标
        this.closeLoadImg();
        $("#messageTipModel .modal-body").html(message);
        $("#messageTipModel").modal();
    };
    // 查看使用的操作系统
    obj.getOS = function () {
        var sUserAgent = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac) return "Mac";
        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        if (isLinux) return "Linux";
        if (isWin) {
            // var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            // if (isWin2K) return "Win2000";
            // var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
            // if (isWinXP) return "WinXP";
            // var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            // if (isWin2003) return "Win2003";
            // var isWinVista= sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            // if (isWinVista) return "WinVista";
            // var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            // if (isWin7) return "Win7";
            return "Window";
        }
        return "other";
    };
    return obj;
};