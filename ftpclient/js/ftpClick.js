/**
 * Created by jchao on 2017/10/19.
 */
var ftpClick = function () {
  var obj = new Object();
  obj.init = function () {
      /** 双击文件处理逻辑 **/
      $(document).on("dblclick",".ftpFileAndDir",function () {
          var fileName = $(this).children("span").first().text();
          var isType =  GlobalData.ftpCommon.isTypeFile(fileName);
          var filePathName = null;
          if (isType === "dir") {
              // 加载图标
              GlobalData.common.showLoadImg();
              if (GlobalData.ftpCurrentPath === "/" || GlobalData.ftpCurrentPath === "") {
                  filePathName = fileName;
              } else {
                  filePathName = GlobalData.ftpCurrentPath + "/" + fileName;
              }
              // 显示文件列表
              GlobalData.ftpCommon.showFtpFileAndDir(filePathName);
              return true;
          }
          // 文档类型
          // if (GlobalData.common.isDocument(fileName)) {
          //     window.open(url + "getFile/openFileShowBrowser?fileName=" + GlobalData.currentPath + "/" + fileName);
          //     return true;
          // }
          // 显示路径
          // var subPaths = GlobalData.currentPath.substr(rootPath.length+1);
          // var httpUrls = url+"upload/"+ $.trim(subPaths) + "/" + fileName;
          // 图片
          // if (GlobalData.common.isImg(fileName)) {
          //     $("#showImg").attr("src",httpUrls);
          //     $("#imgModalLabel").html(fileName);
          //     $("#imgShowModel").modal();
          //     return true;
          // }
          // 音视频
          // if (GlobalData.common.isVideo(fileName)) {
          //     GlobalData.video.src(httpUrls);
          //     $("#videoShowModel").modal();
          //     return true;
          // }
      });
      /** 目录级数显示 **/
      $(document).on("click","#rightfree .freeButton",function () {
          GlobalData.ftpCurrentPath = $(this).attr("name");
          // $(this).nextAll().remove();
          // 加载图标
          GlobalData.common.showLoadImg();
          // 显示文件列表
          GlobalData.ftpCommon.showFtpFileAndDir(GlobalData.ftpCurrentPath);
      });
      /** 返回上一级目录 **/
      $(document).on("click","#rightfree .freeUpNext",function () {
          var upCata = $(this).children("input").first().val();
          // console.log(GlobalData.currentPath);
          // console.log(upCata);
          if (GlobalData.ftpCurrentPath === upCata) {return false;}
          GlobalData.ftpCurrentPath = upCata;
          // 加载图标
          GlobalData.common.showLoadImg();
          // 显示文件列表
          GlobalData.ftpCommon.showFtpFileAndDir(GlobalData.ftpCurrentPath);
      });
      /** 单击文件整体空闲区域处理效果 **/
      $(document).on("click","#leftContent",function () {
          // 取消选择效果
          $(".ftpFileAndDir").css("box-shadow","0 0 0 black");
          // 将当前选中的元素 置为未选中状态 null
          GlobalData.ftpClickStyleFlag = "";
      });
      /** 单击文件处理效果 **/
      $(document).on("click",".ftpFileAndDir",function () {
          // 获取点击的文件名称
          // var fileName = $(this).children("span").first().text();
          // 保存当前点击的文件路径+名称
          // GlobalData.currentSeclectFile = GlobalData.currentPath + "/" + fileName;
          $(this).siblings().css("box-shadow","0 0 0 black");
          $(this).css("box-shadow","0 0 5px #1E90FF");
          // 保存当前选中的元素
          GlobalData.ftpClickStyleFlag = $(this);
          // 阻止事件冒泡
          return false;
      });
      /** hover文件处理效果 **/
      $(document).on("mouseenter",".ftpFileAndDir",function () {
          $(this).siblings().css("box-shadow","0 0 0 black");
          $(this).css("box-shadow","0 0 3px black");
          // 上一次选中的元素不进行恢复样式
          if (GlobalData.ftpClickStyleFlag!== undefined && GlobalData.ftpClickStyleFlag !== "" && GlobalData.ftpClickStyleFlag !== null) {
              GlobalData.ftpClickStyleFlag.css("box-shadow","0 0 5px #1E90FF");
          }
          return false;
      });
  };
    /** 删除文件 **/
    $(document).on("click","#ftpDeleteFile",function () {
        if (GlobalData.ftpCurrentDeleteFile === false) return false;
        // 加载图标
        GlobalData.common.showLoadImg();
        $.ajax({
            url: ftpUrl + "ftp/delete",
            method: 'POST',
            datatype:'json',
            cache:false,
            data:{
                pathname: GlobalData.ftpCurrentFileName
            }
        }).done(function(data) {
            console.log(data.data);
            if (data.msg === "success") {
                // 删除成功重新加载页面
                GlobalData.ftpCurrentDeleteFile = false;
                GlobalData.ftpCommon.showFtpFileAndDir(GlobalData.ftpCurrentPath);
                return true;
            }
            GlobalData.ftpCurrentDeleteFile = false;
            GlobalData.ftpCommon.messageTip("删除失败！请刷新重试！");
            return false;
        }).fail(function () {
            GlobalData.ftpCommon.messageTip("删除失败！请刷新重试！");
            return false;
        }).done(function () {
            // 关闭load图标
            GlobalData.common.closeLoadImg();
        });
    });
    $("#loginButton").click(function () {
        $("#ftpLoginModal").modal();
    });
    $("#ftpLogin_submit").click(function () {
        var loginServer = $.trim($("#loginServerName").val());
        var loginName =  $.trim($("#loginServerUsername").val());;
        var loginPassword = $.trim($("#loginServerPassword").val());
        var loginPort = $.trim($("#loginServerPort").val());
        if (GlobalData.common.validIp(loginServer) === false) {
            $("#ftpLogin_submit").attr("data-content","主机格式不正确！");
            $("#ftpLogin_submit").popover('show');
            return false;
        }
        $("#ftpLoginCancel").click();
        $.ajax({
            url: ftpUrl + "ftp/loginFtpServer",
            method: 'POST',
            datatype:'json',
            cache:false,
            data:{
                loginServer: loginServer,
                loginName: loginName,
                loginPassword: loginPassword,
                loginPort: loginPort
            }
        }).done(function(data) {
            console.log(data.data);
            if (data.msg === "success") {
                // 重新加载数据
                GlobalData.ftpCommon.showFtpFileAndDir("");
                return true;
            }
            GlobalData.ftpCommon.messageTip("网络异常！请刷新重试！");
            return false;
        }).fail(function () {
            GlobalData.ftpCommon.messageTip("网络异常！请刷新重试！");
            return false;
        }).done(function () {
            // 关闭load图标
            GlobalData.common.closeLoadImg();
        });
    });
    /** 撤销删除文件 **/
    $(document).on("click","#ftpCancelDeleteFile",function () {
        GlobalData.ftpCurrentDeleteFile = false;
    });
    /**  新建文件夹 **/
    $("#ftpCreateName_submit").click(function () {
        var pName = $.trim($("#ftpCreateName").val());
        var FileName_submit = $("#ftpCreateName_submit");
        if (pName === "") {
            FileName_submit.attr("data-content","文件名不能为空！");
            FileName_submit.popover('show');
            // $("#createName_submit").attr("data-original-title","文件名不能为空！");
            // $("#createName_submit").tooltip('show');
            return false;
        }
        // 判断文件名的合法性
        var pattern = new RegExp('[\/\\\\"<>\?\*|]');
        if (pattern.test(pName)) {
            FileName_submit.attr("data-content","请输入合法的文件名！");
            FileName_submit.popover('show');
            // $("#createName_submit").attr("data-original-title","请输入合法的文件名！");
            // $("#createName_submit").tooltip('show');
            return false;
        }
        // 判断是否已存在文件名
        if (GlobalData.ftpCommon.isTypeFile(pName) !== false) {
            FileName_submit.attr("data-content","文件名已存在！");
            FileName_submit.popover('show');
            // FileName_submit.attr("data-original-title","文件名已存在！");
            // FileName_submit.tooltip('show');
            return false;
        }
        var fName = null;
        if (GlobalData.ftpCurrentPath === "/" || GlobalData.ftpCurrentPath === "") {
            fName = pName;
        } else {
            fName = GlobalData.ftpCurrentPath + "/" + pName;
        }
        // 加载图标
        GlobalData.common.showLoadImg();
        // 执行重命名
        GlobalData.ftpCommon.mkDir(fName);
    });
    /** 重命名文件名称 **/
    $("#ftpRenameFileName_submit").click(function () {
        // 新的名称
        var cName = $.trim($("#ftpRenameFileName").val());
        var FileName_submit = $("#ftpRenameFileName_submit");
        if (cName === "") {
            FileName_submit.attr("data-content","文件名不能为空！");
            FileName_submit.popover('show');
            return false;
        }
        // 判断文件名的合法性
        var pattern = new RegExp('[\/\\\\"<>\?\*:|]');
        if (pattern.test(cName)) {
            FileName_submit.attr("data-content","请输入合法的文件名！");
            FileName_submit.popover('show');
            // FileName_submit.attr("data-original-title","请输入合法的文件名！");
            // FileName_submit.tooltip("show");
            return false;
        }
        var orgIndex = GlobalData.ftpRenameFileName.lastIndexOf(".");
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
            if (GlobalData.ftpRenameFileName.substring(orgIndex) !== cName.substring(nowIndex)) {
                FileName_submit.attr("data-content","重命名文件后缀名不正确！");
                FileName_submit.popover('show');
                // FileName_submit.attr("data-original-title","重命名文件后缀名不正确！");
                // FileName_submit.tooltip('show');
                return false;
            }
        }
        // 判断是否已存在文件名
        if (GlobalData.ftpCommon.isTypeFile(cName) !== false) {
            FileName_submit.attr("data-content","文件名已存在！");
            FileName_submit.popover('show');
            // FileName_submit.attr("data-original-title","文件名已存在！");
            // FileName_submit.tooltip('show');
            return false;
        }
        var from = null;
        var to = null;
        if (GlobalData.ftpCurrentPath === "/" || GlobalData.ftpCurrentPath === "") {
            from = GlobalData.ftpRenameFileName;
            to = cName;
        } else {
            from = GlobalData.ftpCurrentPath + "/" + GlobalData.ftpRenameFileName;
            to = GlobalData.ftpCurrentPath + "/" + cName;
        }
        // 加载图标
        GlobalData.common.showLoadImg();
        // 执行重命名
        GlobalData.ftpCommon.ftpRenameOrMoveFile(from,to);
    });
  /** 右键具体文件显示菜单 **/
  $.contextMenu({
      selector: ".ftpFileAndDir",
      callback: function(menu, options) {
          // 获取点击的文件名称
          var fileName = $(this).children("span").first().text();
          // 文件类型
          var isType = GlobalData.ftpCommon.isTypeFile(fileName);
          // 由于 服务端为相对路径 判断当前路径
          var cpath = null;
          if (GlobalData.ftpCurrentPath === "/" || GlobalData.ftpCurrentPath === "") {
              cpath = fileName;
              // 保存当前点击的文件路径
              GlobalData.ftpCurrentFileName = fileName;
          } else {
              cpath = GlobalData.ftpCurrentPath + "/" + fileName;
              // 保存当前点击的文件路径+名称
              GlobalData.ftpCurrentFileName = GlobalData.ftpCurrentPath + "/" + fileName;
          }
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
                      GlobalData.ftpCommon.showFtpFileAndDir(cpath);
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
                  // if (GlobalData.currentFileName === (rootPath+"/"+trashFolder)) {
                  //     GlobalData.common.messageTip("不可删除！");
                  //     break;
                  // }
                  // 删除一般文件
                  GlobalData.ftpCurrentDeleteFile = true;
                  GlobalData.ftpCommon.messageTip("确认删除！");
                  break;
              case "rename":
                  $("#ftpRenameFileName").val(fileName);
                  $("#ftpRenameFileModal").modal();
                  GlobalData.ftpRenameFileName = fileName;
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
                  // if (isType === "file") {
                  //     // var subPath = GlobalData.currentPath.substr(rootPath.length+1);
                  //     // var httpUrl = url+"upload/"+ $.trim(subPath) + "/" + fileName;
                  //     // $("#fileDownloadAhref").attr("href",httpUrl);
                  //     // $("#fileDownload").trigger("click");
                  //     window.open(url + "getFile/downloadFile?fileName=" + GlobalData.currentFileName);
                  // }
                  // if (isType === "dir"){
                  //     GlobalData.common.messageTip("请先进行压缩！再进行下载！");
                  // }
                  if (GlobalData.common.isTypeFile(fileName) !== false) {
                      GlobalData.ftpCommon.messageTip("本地已有此文件！请重名或移动后再进行下载文件！");
                      return false;
                  }
                  GlobalData.ftpCommon.download(GlobalData.ftpCurrentFileName, GlobalData.currentPath + "/" + fileName);
                  break;
              case"upload":
                  if (isType === "dir") {
                      GlobalData.fileUploadPath =  GlobalData.currentPath + "/" + fileName;
                  }
                  if (isType === "file") {
                      GlobalData.fileUploadPath =  GlobalData.currentPath;
                  }
                  $("#fileUpload").trigger("click");
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
          "sep5": "---------",
          "download": {name: "Download", icon: "fa-download"}
          // "sep6": "---------",
          /** 上传文件 **/
          // "upload": {
          // name: "Upload",
          // icon: "fa-upload",
          // disabled: function(key, opt) {
          //     return GlobalData.currentUploadFileFlag;
          // }
          // callback: function(key, options) {
          //     GlobalData.fileUploadPath =  GlobalData.currentPath;
          //     $("#fileUpload").trigger("click");
          //     return false;
          // }
          // },
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
        selector: "#leftContent",
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
                            // if (GlobalData.common.noAllowOperate()) {
                            //     GlobalData.currentCreaType = "dir";
                                $("#ftpCreateName").val("新建文件夹");
                                $("#ftpCreateFileModal").modal();
                            // }
                        }
                    }
                    // "sep0": "---------",
                    /** 创建文本文件 **/
                    // "file": {
                    //     name: "Text",
                    //     icon: "fa-file-o",
                    //     callback: function(key, options) {
                    //         // 是否可以操作
                    //         if (GlobalData.common.noAllowOperate()) {
                    //             GlobalData.currentCreaType = "file";
                    //             $("#createName").val("新建文件.txt");
                    //             $("#createFileModal").modal();
                    //         }
                    //     }
                    // }
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
                    GlobalData.ftpCommon.showFtpFileAndDir(GlobalData.ftpCurrentPath);
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
  return obj;
};