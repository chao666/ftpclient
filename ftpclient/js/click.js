/**
 * Created by jchao on 2017/9/19.
 */
var Click = function () {
    var obj = new Object();
    obj.init = function () {
        /** 右键具体文件显示菜单 **/
        $.contextMenu({
            selector: ".fileAndDir",
            callback: function(menu, options) {
                // 获取点击的文件名称
                var fileName = $(this).children("span").first().text();
                // 保存当前点击的文件路径+名称
                GlobalData.currentFileName = GlobalData.currentPath + "/" + fileName;
                // 文件类型
                var isType = GlobalData.common.isTypeFile(fileName);
                // 是否显示上传功能标志
                // GlobalData.currentUploadFileFlag = true;
                // if (isType === "file") {
                //     // 文件不显示上传标志
                //     GlobalData.currentUploadFileFlag = true;
                // }
                // 获取点击 选择的菜单
                switch (menu) {
                    case "open":
                        // 打开文件夹
                        if (isType === "dir") {
                            // 加载load图标
                            GlobalData.common.showLoadImg();
                            // 显示打开的文件夹列表
                            GlobalData.common.showFileAndDir(GlobalData.currentPath + "/" + fileName);
                        }
                        // 在浏览器打开文件
                        // if (isType === "file") {
                        //     // 文档类型
                        //     if (GlobalData.common.isDocument(fileName)) {
                        //         window.open(url + "getFile/openFileShowBrowser?fileName=" + GlobalData.currentFileName);
                        //         return true;
                        //     }
                        //     // 显示路径
                        //     var subPaths = GlobalData.currentPath.substr(rootPath.length+1);
                        //     var httpUrls = url+"upload/"+ $.trim(subPaths) + "/" + fileName;
                        //     // 图片
                        //     if (GlobalData.common.isImg(fileName)) {
                        //         $("#showImg").attr("src",httpUrls);
                        //         $("#imgModalLabel").html(fileName);
                        //         $("#imgShowModel").modal();
                        //         return true;
                        //     }
                        //     // 音视频
                        //     if (GlobalData.common.isVideo(fileName)) {
                        //         GlobalData.video.src(httpUrls);
                        //         $("#videoShowModel").modal();
                        //         return true;
                        //     }
                        // }
                        break;
                    case "delete":
                        // 回收站不可删除
                        if (GlobalData.currentFileName === (rootPath+"/"+trashFolder)) {
                            GlobalData.common.messageTip("不可删除！");
                            break;
                        }
                        // 删除一般文件
                        GlobalData.currentDeleteFile = true;
                        GlobalData.common.messageTip("确认删除！");
                        break;
                    case "rename":
                        $("#renameFileName").val(fileName);
                        $("#renameFileModal").modal();
                        break;
                    case "cut":
                        GlobalData.currentCutFile = GlobalData.currentFileName;
                        GlobalData.currentPasteFlag = true;
                        break;
                    case "copy":
                        GlobalData.currentCopyFile = GlobalData.currentFileName;
                        GlobalData.currentPasteFlag = true;
                        break;
                    case "download":
                        // 下载文件
                        if (isType === "file") {
                            // var subPath = GlobalData.currentPath.substr(rootPath.length+1);
                            // var httpUrl = url+"upload/"+ $.trim(subPath) + "/" + fileName;
                            // $("#fileDownloadAhref").attr("href",httpUrl);
                            // $("#fileDownload").trigger("click");
                            window.open(url + "getFile/downloadFile?fileName=" + GlobalData.currentFileName);
                        }
                        if (isType === "dir"){
                            GlobalData.common.messageTip("请先进行压缩！再进行下载！");
                        }
                        break;
                    case"upload":
                        // if (isType === "dir") {
                        //     GlobalData.fileUploadPath =  GlobalData.currentPath + "/" + fileName;
                        // }
                        // if (isType === "file") {
                        //     GlobalData.fileUploadPath =  GlobalData.currentPath;
                        // }
                        // $("#fileUpload").trigger("click");
                        var cpath = null;
                        if (GlobalData.ftpCurrentPath === "/" || GlobalData.ftpCurrentPath === "") {
                            cpath = fileName;
                        } else {
                            cpath = GlobalData.ftpCurrentPath + "/" + fileName;
                        }
                        if (GlobalData.ftpCommon.isTypeFile(fileName) !== false) {
                            GlobalData.ftpCommon.messageTip("服务端已有此文件名称！请重名或移动后在进行上传!");
                            return false;
                        }
                        GlobalData.ftpCommon.upload(cpath, GlobalData.currentPath + "/" + fileName);
                        break;
                    case"compress":
                        GlobalData.currentCompressFile = GlobalData.currentFileName;
                        $.ajax({
                            url: url + "file/getFileSize",
                            method: 'POST',
                            datatype:'json',
                            cache:false,
                            data:{
                                filePath: GlobalData.currentCompressFile
                            }
                        }).done(function(data) {
                            if (data.msg === "success") {
                                var size = data.data;
                                var len = size.length-1;
                                var digit = size.substring(0,len );
                                var unit = size.substring(len);
                                if (unit === "M" && digit > 100) {
                                    $("#compressTipModel .modal-body").html("文件过大！压缩需要较长时间！请耐心等待！");
                                    $("#compressTipModel").modal();
                                } else {
                                    $("#compressTipModel .modal-body").html("压缩后的文件保存在左边**压缩文件**夹里！可能需要一点时间！请耐心等待！");
                                    $("#compressTipModel").modal();
                                }
                                return true;
                            }
                            GlobalData.common.messageTip("网络异常！请刷新重试！");
                        }).fail(function () {
                            GlobalData.common.messageTip("网络异常！请刷新重试！");
                            return false;
                        });
                        break;
                    case"decompress":
                        break;
                    default:break;
                }
            },
            items: {
                "open": {name: "Open", icon: "fa-folder-open"},
                "sep1": "---------",
                "delete": {name: "Delete", icon: "delete"},
                "sep2": "---------",
                "rename": {name: "Rename", icon: "fa-eraser"},
                // "sep3": "---------",
                // "cut": {name: "Cut", icon: "cut"},
                // "sep4": "---------",
                // "copy": {name: "Copy", icon: "copy"},
                // "sep5": "---------",
                // "download": {name: "Download", icon: "fa-download"},
                "sep6": "---------",
                /** 上传文件 **/
                "upload": {
                    name: "Upload",
                    icon: "fa-upload"
                    // disabled: function(key, opt) {
                    //     return GlobalData.currentUploadFileFlag;
                    // },
                    // callback: function(key, options) {
                    //     GlobalData.fileUploadPath =  GlobalData.currentPath;
                    //     $("#fileUpload").trigger("click");
                    //     return false;
                    // }
                }
                // "sep7": "---------",
                // "compress": {name: "Compress", icon: "fa-compress"},
                // "sep8": "---------",
                // "decompress": {
                //     name: "Decompress",
                //     icon: "fa-expand",
                //     disabled: function(key, opt) {
                //         return true;
                //     }
                // }
                // "edit": {
                //     name: "Edit",
                //     icon: "fa-edit"
                // }
            }
        });
        /** 右键整体区域 显示菜单 **/
        $.contextMenu({
            selector: "#rightNav",
            items: {
                "create": {
                    name: "Create", icon: "fa-book",
                    items: {
                        /** 创建文件夹 **/
                        "folder": {
                            name: "Folder",
                            icon: "fa-folder-open",
                            callback: function(key, options) {
                                // 是否可以操作
                                if (GlobalData.common.noAllowOperate()) {
                                    GlobalData.currentCreaType = "dir";
                                    $("#createName").val("新建文件夹");
                                    $("#createFileModal").modal();
                                }
                            }
                        },
                        "sep0": "---------",
                        /** 创建文本文件 **/
                        "file": {
                            name: "Text",
                            icon: "fa-file-o",
                            callback: function(key, options) {
                                // 是否可以操作
                                if (GlobalData.common.noAllowOperate()) {
                                    GlobalData.currentCreaType = "file";
                                    $("#createName").val("新建文件.txt");
                                    $("#createFileModal").modal();
                                }
                            }
                        }
                    }
                },
                "sep0": "---------",
                /** 刷新 **/
                "refresh": {
                    name: "Refresh",
                    icon: "fa-refresh",
                    callback: function(key, options) {
                        // 加载load图标
                        GlobalData.common.showLoadImg();
                        // 重新加载页面文件
                        GlobalData.common.showFileAndDir(GlobalData.currentPath);
                    }
                }
                // "sep1": "---------",
                /** 上传文件 **/
                // "upload": {
                //     name: "Upload",
                //     icon: "fa-upload",
                //     callback: function(key, options) {
                //         // 是否可以操作
                //         if (GlobalData.common.noAllowOperate()) {
                //             GlobalData.fileUploadPath =  GlobalData.currentPath;
                //             $("#fileUpload").trigger("click");
                //             // return false;
                //         }
                //     }
                // },
                // "sep2": "---------",
                /** 粘贴文件 **/
                // "paste": {
                //     name: "Paste",
                //     icon: "paste",
                //     callback: function(key, options) {
                //         // 粘贴文件
                //         GlobalData.common.pasteFile();
                //         // // 是否可以操作
                //         // if (!GlobalData.common.noAllowOperate()) {return true;}
                //         // // 加载图标
                //         // GlobalData.common.showLoadImg();
                //         // $.ajax({
                //         //    url: url + "file/" + (GlobalData.currentCutFile !== "" && GlobalData.currentCutFile !== null?"cutFileOrDir":"copyFileOrDir"),
                //         //    method: 'POST',
                //         //    datatype:'json',
                //         //    cache:false,
                //         //    data:{
                //         //        srcFile: (GlobalData.currentCutFile !== "" && GlobalData.currentCutFile !== null?GlobalData.currentCutFile:GlobalData.currentCopyFile),
                //         //        desFile: GlobalData.currentPath
                //         //    }
                //         // }).done(function(data) {
                //         //    if (data.msg === "fail") {
                //         //        if (data.data === "has") {
                //         //            $("#messageTipModel .modal-body").html("粘贴失败！已有该文件名称！请重命名后再粘贴！");
                //         //            $("#messageTipModel").modal();
                //         //            return false;
                //         //        }
                //         //        $("#messageTipModel .modal-body").html("粘贴失败！请刷新重试！");
                //         //        $("#messageTipModel").modal();
                //         //        return false;
                //         //    }
                //         //    // 剪切成功重新加载页面
                //         //    GlobalData.common.showFileAndDir(GlobalData.currentPath);
                //         // }).fail(function () {
                //         //     $("#messageTipModel .modal-body").html("粘贴失败！请刷新重试！");
                //         //     $("#messageTipModel").modal();
                //         //     return false;
                //         // }).done(function () {
                //         //     GlobalData.currentPasteFlag = false;
                //         //     GlobalData.currentCutFile = "";
                //         //     GlobalData.currentCopyFile = "";
                //         //     // 关闭load图标
                //         //     GlobalData.common.closeLoadImg();
                //         // });
                //     },
                //     disabled: function(key, opt) {
                //         return !GlobalData.currentPasteFlag;
                //     }
                // }
            }
        });
        /** 单击文件整体空闲区域处理效果 **/
        $(document).on("click","#rightContent",function () {
            // 取消选择效果
            $(".fileAndDir").css("box-shadow","0 0 0 black");
            // 将当前选中的元素 置为未选中状态 null
            GlobalData.clickStyleFlag = "";
        });
        /** 双击文件处理逻辑 **/
        $(document).on("dblclick",".fileAndDir",function () {
            var fileName = $(this).children("span").first().text();
            var isType = GlobalData.common.isTypeFile(fileName);
            if (isType === "dir") {
                // 加载图标
                GlobalData.common.showLoadImg();
                // 显示文件列表
                GlobalData.common.showFileAndDir(GlobalData.currentPath + "/" + fileName);
                return true;
            }
            // 文档类型
            // if (GlobalData.common.isDocument(fileName)) {
            //     window.open(url + "getFile/openFileShowBrowser?fileName=" + GlobalData.currentPath + "/" + fileName);
            //     return true;
            // }
            // 显示路径
            var subPaths = GlobalData.currentPath.substr(rootPath.length+1);
            var httpUrls = url+"upload/"+ $.trim(subPaths) + "/" + fileName;
            // 图片
            if (GlobalData.common.isImg(fileName)) {
                $("#showImg").attr("src",httpUrls);
                $("#imgModalLabel").html(fileName);
                $("#imgShowModel").modal();
                return true;
            }
            // 音视频
            if (GlobalData.common.isVideo(fileName)) {
                GlobalData.video.src(httpUrls);
                $("#videoShowModel").modal();
                return true;
            }
        });
        /** 单击文件处理效果 **/
        $(document).on("click",".fileAndDir",function () {
            // 获取点击的文件名称
            var fileName = $(this).children("span").first().text();
            // 保存当前点击的文件路径+名称
            GlobalData.currentSeclectFile = GlobalData.currentPath + "/" + fileName;
            $(this).siblings().css("box-shadow","0 0 0 black");
            $(this).css("box-shadow","0 0 5px #1E90FF");
            // 保存当前选中的元素
            GlobalData.clickStyleFlag = $(this);
            // 阻止事件冒泡
            return false;
        });
        /** hover文件处理效果 **/
        $(document).on("mouseenter",".fileAndDir",function () {
            $(this).siblings().css("box-shadow","0 0 0 black");
            $(this).css("box-shadow","0 0 3px black");
            // 上一次选中的元素不进行恢复样式
            if (GlobalData.clickStyleFlag!== undefined && GlobalData.clickStyleFlag !== "" && GlobalData.clickStyleFlag !== null) {
                GlobalData.clickStyleFlag.css("box-shadow","0 0 5px #1E90FF");
            }
            return false;
        });
        /** 删除文件 永久或备份删除 **/
        $(document).on("click","#deleteFile",function () {
            if (GlobalData.currentDeleteFile === false) return false;
            // 加载图标
            GlobalData.common.showLoadImg();
            $.ajax({
                url: url + "file/" + ( GlobalData.currentPath === (rootPath+"/"+trashFolder)?"deleteFileOrDir":"deleteFileThroughBackup"),
                method: 'POST',
                datatype:'json',
                cache:false,
                data:{
                    fileName: GlobalData.currentFileName
                }
            }).done(function(data) {
                if (data.msg === "success") {
                    // 删除成功重新加载页面
                    GlobalData.currentDeleteFile = false;
                    GlobalData.common.showFileAndDir(GlobalData.currentPath);
                    return true;
                }
                GlobalData.currentDeleteFile = false;
                GlobalData.common.messageTip("删除失败！请刷新重试！");
                return false;
            }).fail(function () {
                GlobalData.common.messageTip("删除失败！请刷新重试！");
                return false;
            }).done(function () {
                // 关闭load图标
                GlobalData.common.closeLoadImg();
            });
        });
        /** 撤销删除文件 **/
        $(document).on("click","#cancelDeleteFile",function () {
            GlobalData.currentDeleteFile = false;
        });

        /** 目录级数显示 **/
        $(document).on("click","#free .freeButton",function () {
            GlobalData.currentPath = $(this).attr("name");
            // $(this).nextAll().remove();
            // 加载图标
            GlobalData.common.showLoadImg();
            // 显示文件列表
            GlobalData.common.showFileAndDir(GlobalData.currentPath);
        });

        /** 返回上一级目录 **/
        $(document).on("click","#free .freeUpNext",function () {
            var upCata = $(this).children("input").first().val();
            // console.log(GlobalData.currentPath);
            // console.log(upCata);
            if (GlobalData.currentPath === upCata) {return false;}
            GlobalData.currentPath = upCata;
            // 加载图标
            GlobalData.common.showLoadImg();
            // 显示文件列表
            GlobalData.common.showFileAndDir(GlobalData.currentPath);
        });
        /** 选择左边菜单目录 **/
        $(document).on("click","#leftNav li",function () {
            var folderName = $.trim($(this).text());
            // 加载图标
            GlobalData.common.showLoadImg();
            // 显示文件列表
            GlobalData.common.showFileAndDir(rootPath + "/" + folderName);
        });
        /** 暂停视频播放 **/
        $(document).on("click","#videoPlayerStop",function () {
            // GlobalData.video.src("");
            // 暂停视频播放
            GlobalData.video.pause();
        });
        /** 去掉打开保留的图片地址 **/
        $(document).on("click","#imgShowCancelButton",function () {
            $("#showImg").attr("src","");
        });
        /** 选择服务器的名称 改变连接服务器 **/
        $(document).on("click",".topMenu li",function () {
            var menuName = $(this).children("a").first().text();
            var serverIp = $(this).children("a").first().attr("name");
            $(".topMenuCenter").html(menuName + "<b class='caret'></b>");
            // 改变服务器IP 访问的文件目录
            // url = GlobalServer[serverIp].url;
            // rootPath = GlobalServer[serverIp].rootPath;
            // GlobalData.currentChangeServerFlag = true;
            // console.log(GlobalServer[serverIp].url);
            // console.log(GlobalServer[serverIp].rootPath);
        });
        /** 单击整体区域 取消所有单击的选择效果 **/
        $("#rightNav").on("click",function () {
            $(".fileAndDir").css("box-shadow","0 0 0 black");
        });
        /** 确认压缩文件 **/
        $(document).on("click","#confirmCompressFile",function () {
            // 加载图标
            GlobalData.common.showLoadImg();
            $.ajax({
                url: url + "file/compressFile",
                method: 'POST',
                datatype:'json',
                cache:false,
                data:{
                    srcFilePath: GlobalData.currentCompressFile
                }
            }).done(function(data) {
                if (data.msg === "success") {
                    // 压缩成功重新加载页面
                    GlobalData.common.showFileAndDir(data.data);
                    return true;
                }
                GlobalData.common.messageTip("压缩失败！请刷新重试！");
            }).fail(function () {
                GlobalData.common.messageTip("压缩失败！请刷新重试！");
                return false;
            }).done(function () {
                GlobalData.currentCompressFile = "";
                // 关闭load图标
                GlobalData.common.closeLoadImg();
            });
        });
        /** 复制粘贴 快捷键 **/
        // $(document).keydown(function (event) {
        //     // ctrl+c
        //     if (event.ctrlKey && event.which === 67) {
        //         // 复制文件
        //         if (GlobalData.currentSeclectFile !== "" && GlobalData.currentSeclectFile !== null && GlobalData.currentSeclectFile !== undefined) {
        //             GlobalData.currentCopyFile = GlobalData.currentSeclectFile;
        //         }
        //     }
        //     // ctrl+x
        //     if (event.ctrlKey && event.which === 88) {
        //         // 剪切文件
        //         if (GlobalData.currentSeclectFile !== "" && GlobalData.currentSeclectFile !== null && GlobalData.currentSeclectFile !== undefined) {
        //             GlobalData.currentCutFile = GlobalData.currentSeclectFile;
        //         }
        //     }
        //     // ctrl+v
        //     if (event.ctrlKey && event.which === 86) {
        //         // 粘贴文件
        //         if (GlobalData.currentCutFile !== "" && GlobalData.currentCutFile !== null && GlobalData.currentCutFile !== undefined || (GlobalData.currentCopyFile !== ""&& GlobalData.currentCopyFile !== null && GlobalData.currentCopyFile !== undefined)) {
        //             GlobalData.common.pasteFile();
        //         }
        //     }
        // });
        /** 新建文件 **/
        $("#createName_submit").click(function () {
            var cName = $.trim($("#createName").val());
            var FileName_submit = $("#createName_submit");
            if (cName === "") {
                FileName_submit.attr("data-content","文件名不能为空！");
                FileName_submit.popover('show');
                // $("#createName_submit").attr("data-original-title","文件名不能为空！");
                // $("#createName_submit").tooltip('show');
                return false;
            }
            // 判断文件名的合法性
            var pattern = new RegExp('[\/\\\\"<>\?\*|]');
            if (pattern.test(cName)) {
                FileName_submit.attr("data-content","请输入合法的文件名！");
                FileName_submit.popover('show');
                // $("#createName_submit").attr("data-original-title","请输入合法的文件名！");
                // $("#createName_submit").tooltip('show');
                return false;
            }
            // 新建文本文件 检测后缀是否正确
            if (GlobalData.currentCreaType === "file") {
                var suffix = GlobalData.common.getSuffixName(cName);
                if (suffix !== "txt") {
                    cName = cName + ".txt";
                }
            }
            // 判断是否已存在文件名
            if (GlobalData.common.isTypeFile(cName) !== false) {
                FileName_submit.attr("data-content","文件名已存在！");
                FileName_submit.popover('show');
                // FileName_submit.attr("data-original-title","文件名已存在！");
                // FileName_submit.tooltip('show');
                return false;
            }
            // 加载图标
            GlobalData.common.showLoadImg();
            $.ajax({
                url: url + "file/createFileOrDir",
                method: 'POST',
                datatype:'json',
                cache:false,
                data:{
                    createDir: GlobalData.currentPath,
                    createName: cName,
                    createType: GlobalData.currentCreaType
                }
            }).done(function(data) {
                // 隐藏显示输入框
                // $("#cancelRenameFile").trigger('click');
                // 隐藏显示输入框
                $("#cancel").trigger('click');
                if (data.msg === "success") {
                    if (data.data === null || data.data === "" || data.data === undefined) {
                        GlobalData.common.messageTip("加载页面失败！请刷新！");
                        return true;
                    }
                    // 新建文件夹
                    // if (GlobalData.currentCreaType === "dir") {
                    //     // 成功直接进入新建的文件夹里面
                    //     GlobalData.currentPath = GlobalData.currentPath + "/" + cName;
                    // }
                    // 所有数据 全局数据 供查询文件存在使用
                    GlobalData.currentData = data.data;
                    // 重新显示列表文件
                    GlobalData.common.listFileAndDir(data.data);
                    return true;
                }
                GlobalData.common.messageTip("创建失败！请刷新重试！");
                return false;
            }).fail(function () {
                GlobalData.common.messageTip("网络异常！创建失败！请刷新重试！");
                return false;
            }).done(function () {
                // 关闭load图标
                GlobalData.common.closeLoadImg();
            });
        });
        /** 重命名文件名称 **/
        $("#renameFileName_submit").click(function () {
            // 新的名称
            var cName = $.trim($("#renameFileName").val());
            var FileName_submit = $("#renameFileName_submit");
            if (cName === "") {
                FileName_submit.attr("data-content","文件名不能为空！");
                FileName_submit.popover('show');
                // FileName_submit.attr("data-original-title","文件名不能为空！");
                // FileName_submit.tooltip('show');
                return false;
            }
            // 判断文件名的合法性
            var pattern = new RegExp('[\/\\\\"<>\?\*:|]');
            if (pattern.test(cName)) {
                FileName_submit.attr("data-content","请输入合法的文件名！");
                FileName_submit.popover('show');
                // FileName_submit.attr("data-original-title","请输入合法的文件名！");
                // FileName_submit.tooltip('show');
                return false;
            }
            var orgIndex = GlobalData.currentFileName.lastIndexOf(".");
            var nowIndex = cName.lastIndexOf(".");
            if (orgIndex === -1) {
                if (nowIndex !== -1) {
                    FileName_submit.attr("data-content","重命名文件类型不一致！");
                    FileName_submit.popover('show');
                    // FileName_submit.attr("data-original-title","重命名文件类型不一致！");
                    // FileName_submit.tooltip('show');
                    return false;
                }
            }
            if (orgIndex !== -1) {
                if (GlobalData.currentFileName.substring(orgIndex) !== cName.substring(nowIndex)) {
                    FileName_submit.attr("data-content","重命名文件后缀名不正确！");
                    FileName_submit.popover('show');
                    // FileName_submit.attr("data-original-title","重命名文件后缀名不正确！");
                    // FileName_submit.tooltip('show');
                    return false;
                }
            }
            // 判断是否已存在文件名
            if (GlobalData.common.isTypeFile(cName) !== false) {
                FileName_submit.attr("data-content","文件名已存在！");
                FileName_submit.popover('show');
                // FileName_submit.attr("data-original-title","文件名已存在！");
                // FileName_submit.tooltip('show');
                return false;
            }
            // 加载图标
            GlobalData.common.showLoadImg();
            // 执行重命名
            $.ajax({
                url: url + "file/renameFileOrDir",
                method: 'POST',
                datatype:'json',
                cache:false,
                data:{
                    oldFileName: GlobalData.currentFileName,
                    newName: cName
                }
            }).done(function(data) {
                // 隐藏显示输入框
                $("#cancelRenameFile").trigger('click');
                if (data.msg === "success") {
                    // 成功重新加载页面
                    GlobalData.common.showFileAndDir(GlobalData.currentPath);
                    return true;
                }
                GlobalData.common.messageTip("失败！请刷新重试！");
                return false;
            }).fail(function () {
                GlobalData.common.messageTip("失败！请刷新重试！");
                return false;
            }).done(function () {
                // 关闭load图标
                GlobalData.common.closeLoadImg();
            });
        });
    };
    return obj;
};