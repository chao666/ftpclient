/**
 * Created by jchao on 2017/10/17.
 */
var FTP = function () {
  var obj = new Object();
  obj.init = function () {
      this.showFtpFileAndDir(ftpRootPath);
  };
  obj.showFtpFileAndDir = function (pathParm) {
      var param = (pathParm === null || pathParm === "" || pathParm === undefined)?ftpRootPath:pathParm;
      var that = this;
      // 显示页面文件列表
      $.ajax({
          url: ftpUrl + "ftp/listFilesAndDirs",
          method: 'GET',
          datatype:'json',
          cache:false,
          data:{
              pathName: param
          }
      }).done(function(data) {
          if (data.msg === "success") {
              // console.log(data.data);
              // 显示页面文件列表
              that.listFtpFileAndDir(data.data);
              return true;
          }
          that.messageTip("网络失败！请确认访问的服务器是否安装或开启！请刷新重试！");
          return false;
      }).fail(function () {
          that.messageTip("网络异常！加载失败！请确认访问的服务器是否安装或开启！请刷新重试！");
          return false;
      }).done(function () {
          // 关闭load图标
          GlobalData.common.closeLoadImg();
      });
  };
  obj.ftpRenameOrMoveFile = function (from, to) {
      if (from === undefined || from === "" || from === null) return false;
      if (to === undefined || to === "" || to === null) return false;
      var that = this;
      // 显示页面文件列表
      $.ajax({
          url: ftpUrl + "ftp/rename",
          method: 'POST',
          datatype:'json',
          cache:false,
          data:{
              from: from,
              to: to
          }
      }).done(function(data) {
          var resData = data.data;
          if (resData === null || resData === "" || resData === undefined) {
              that.messageTip("操作失败！请检查是否已有操作的相同文件！");
              return false;
          }
          if (data.msg === "success") {
              console.log(resData);
              // 显示页面文件列表
              that.listFtpFileAndDir(resData);
              return true;
          }
          that.messageTip("网络失败！请刷新重试！");
          return false;
      }).fail(function () {
          that.messageTip("网络异常！加载失败！请确认访问的服务是否安装或开启！请刷新重试！");
          return false;
      }).done(function () {
          GlobalData.ftpCurrentPath = "";
          GlobalData.ftpCurrentCutFile = "";
          // 关闭load图标
          GlobalData.common.closeLoadImg();
      });
  };
  obj.listFtpFileAndDir = function (res) {
      if (res === undefined || res === "" || res === null) return false;
      // 保存当前显示的所有文件信息
      GlobalData.ftpCurrentData = res;
      var rightContentId = $("#leftContent");
      // var leftNavId = $("#leftNav ul");
      rightContentId.html("");
      for (var path in res) {
          // 保存当前显示的文件根路径
          GlobalData.ftpCurrentPath = path;
          // 重新渲染横目录层次列表
          this.ftpListCataLog(path);
          if (res.length < 1) return false;
          // 左边菜单栏home
          // if (rootPath === path) {
          //     // 左边菜单栏
          //     leftNavId.html("");
          //     leftNavId.append("<li class='menuHome active' style='color: #1E90ff;'><span class='glyphicon glyphicon-home'></span>&nbsp;&nbsp;/</li>");
          // }
          // 渲染页面
          //for(var fileAndDir in res[path]) {
          //if (fileAndDir === "dir") {
          var pFileAndDir = res[path]["dir"];
          var file = null;
          for (file in pFileAndDir) {
              var fa = 'fa fa-folder-open fa-5x';
              // 显示左边文件层次目录
              // 回收站图标
              // if (rootPath === path && pFileAndDir[file] === "回收站") {
              //     // leftNavId.prepend("<li><a href='javascript:;'><i class='fa fa-trash fa-1x'></i>&nbsp;回收站</a></li>");
              //     continue;
              // }
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
              rightContentId.append("<div title='" +pFileAndDir[file]+ "' class='ftpFileAndDir col-xs-2 col-sm-2 col-md-2 col-lg-2'>"+
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
              var suffix = GlobalData.common.getSuffixName(pFileAndDir[file]);
              if (suffix in GlobalType) {
                  rightContentId.append("<div title='" +pFileAndDir[file]+ "' class='ftpFileAndDir col-xs-2 col-sm-2 col-md-2 col-lg-2'>"+
                      "<input type='hidden' value='file' name='' />"+
                      "<i class='"+ GlobalType[suffix] +"' style='color: #1E90ff;'></i>"+
                      "<span class='fileName'>"+ pFileAndDir[file] +"</span>"+
                      "</div>"
                  );
              } else {
                  rightContentId.append("<div title='" +pFileAndDir[file]+ "' class='ftpFileAndDir col-xs-2 col-sm-2 col-md-2 col-lg-2'>"+
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
      // this.closeLoadImg();
      return true;
  };
  obj.ftpListCataLog = function (path) {
      if (path === undefined || path === "" || path === null) {return false;}
      if (path === "/") {
          // 移除上一次加载的层次结构
          $("#rightfree .freePathLevel").remove();
          return true;
      }
      var cataLog = path.split("/");
      console.log(cataLog);
      // 保存目录根路径
      // var cata = ftpRootPath;
      var iLen = 1;
      // 根路径情况
      // if (rootPath !== "/") {iLen = rootPath.substr(1).split("/").length;}
      // 设置根路径
      $("#rightfree .freeRootPath input").attr("name",ftpRootPath);
      // 返回上一级根路径
      $("#rightfree .freeUpNext input").val(ftpRootPath);
      // 移除上一次加载的层次结构
      $("#rightfree .freePathLevel").remove();
      // 目录层次长度
      var lenCata = cataLog.length;
      var cata = cataLog[0];
      $("#rightfree").append("<div class='freePathLevel'><i class='fa fa-caret-right fa-1x'></i></div><div class='freePathLevel'>"
          + "<input class='freeButton' type='button' name = '"+ cata +"' value='"+ cata +"'/></div>"
      );
      // 重新渲染目录层次结构
      for (var i = iLen;i < lenCata;i++) {
          // 返回上一级
          if ((i-1) === (lenCata-2)) {$("#rightfree .freeUpNext input").val(cata);}
          cata = cata + "/" + cataLog[i];
          $("#rightfree").append("<div class='freePathLevel'><i class='fa fa-caret-right fa-1x'></i></div><div class='freePathLevel'>"
              + "<input class='freeButton' type='button' name = '"+ cata +"' value='"+ cataLog[i] +"'/></div>"
          );
      }
  };
  /**  新建文件夹 **/
  obj.mkDir = function (pathName) {
      if (pathName === undefined || pathName === "" || pathName === null) {return false;}
      $.ajax({
          url: ftpUrl + "ftp/mkDir",
          method: 'POST',
          datatype: 'json',
          cache: false,
          data:{
              pathName: pathName
          }
      }).done(function(data) {
          if (data.msg === "success" && data.data) {
              $("#ftpCancel").trigger('click');
              // console.log(data.data);
              // // 显示本地页面文件列表
              GlobalData.ftpCommon.showFtpFileAndDir(GlobalData.ftpCommon.ftpCurrentPath);
              return true;
          }
          GlobalData.ftpCommon.messageTip("网络失败！添加失败！请刷新重试！");
          return false;
      }).fail(function () {
          GlobalData.ftpCommon.messageTip("网络异常！加载失败！请确认访问的服务是否安装或开启！请刷新重试！");
          return false;
      }).done(function () {
          // GlobalData.ftpCurrentPath = "";
          // GlobalData.ftpCurrentCutFile = "";
          // // 关闭load图标
          GlobalData.common.closeLoadImg();
      });
  };
  /** 拖拽文件 **/
  obj.drag = function () {
        var that = this;
        // 使能拖动事件
        $(".ftpFileAndDir").draggable({
            accept: ".ftpFileAndDir",
            // 是否返回原位置
            revert: true,
            // 是否有滚动条则滚动
            scroll: false,
            zIndex: 10000000000,
            containment: ".ftpContainer",
            /**cursor: "crosshair",**/
            start: function (event, ui) {
                var cpath = null;
                GlobalData.ftpCurrentMoveFilename = $(this).children("span").first().text();
                if (GlobalData.ftpCurrentPath === "/" || GlobalData.ftpCurrentPath === "") {
                    cpath = GlobalData.ftpCurrentMoveFilename;
                } else {
                    cpath = GlobalData.ftpCurrentPath + "/" + GlobalData.ftpCurrentMoveFilename;
                }
                // 获取拖拽当前的文件名称
                GlobalData.ftpCurrentCutFile = cpath;
                console.log(GlobalData.ftpCurrentCutFile);
            }
        });
        // 放置在元素上的事件
        $(".ftpFileAndDir").droppable({
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
                    var cpath = null;
                    if (GlobalData.ftpCurrentPath === "/" || GlobalData.ftpCurrentPath === "") {
                        cpath = fileName;
                    } else {
                        cpath = GlobalData.ftpCurrentPath + "/" + fileName;
                    }
                    // 改变当前移动进的文件路径
                    // GlobalData.ftpCurrentPath = cpath + "/" + GlobalData.ftpCurrentMoveFilename;
                    // 进行移动文件
                    // console.log(cpath + "/" + GlobalData.ftpCurrentMoveFilename);
                    that.ftpRenameOrMoveFile(GlobalData.ftpCurrentCutFile,cpath + "/" + GlobalData.ftpCurrentMoveFilename);
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
  // 判断文件的类型 文件或文件夹
  obj.isTypeFile = function (fileName) {
      if (fileName === null || fileName === "" || fileName === undefined) return false;
      var res =  GlobalData.ftpCurrentData;
      for (var path in res) {
          for(var fileAndDir in res[path]) {
              if (fileAndDir === "dir") {
                  var pFileAndDir = res[path][fileAndDir];
                  for (var file in pFileAndDir) {
                      if (pFileAndDir[file] === fileName) {
                          return "dir";
                      }
                  }
              }
              if (fileAndDir === "file") {
                  var pFileAndDir = res[path][fileAndDir];
                  for (var file in pFileAndDir) {
                      if (pFileAndDir[file] === fileName) {
                          return "file";
                      }
                  }
              }
          }
      }
      return false;
  };
  obj.download = function (remote, local) {
      if (remote === undefined || remote === null || remote === "") {return true;}
      if (local === undefined || local === null || local === "") {return true;}
      // 显示页面文件列表
      $.ajax({
          url: ftpUrl + "ftp/download",
          method: 'POST',
          datatype:'json',
          cache:false,
          data:{
              remote: remote,
              local: local
          }
      }).done(function(data) {
          if (data.msg === "success") {
              console.log(data.data);
              // // 显示本地页面文件列表
              GlobalData.common.showFileAndDir(GlobalData.common.currentPath);
              // that.listFtpFileAndDir(data.data);
              return true;
          }
          GlobalData.ftpCommon.messageTip("网络失败！请刷新重试！");
          return false;
      }).fail(function () {
          GlobalData.ftpCommon.messageTip("网络异常！加载失败！请确认访问的服务是否安装或开启！请刷新重试！");
          return false;
      }).done(function () {
          // GlobalData.ftpCurrentPath = "";
          // GlobalData.ftpCurrentCutFile = "";
          // // 关闭load图标
          GlobalData.common.closeLoadImg();
      });
  };
  obj.upload = function (remote, local) {
      if (remote === undefined || remote === null || remote === "") {return true;}
      if (local === undefined || local === null || local === "") {return true;}
      // 显示页面文件列表
      $.ajax({
          url: ftpUrl + "ftp/upload",
          method: 'POST',
          datatype:'json',
          cache:false,
          data:{
              remote: remote,
              local: local
          }
      }).done(function(data) {
          if (data.msg === "success") {
              console.log(data.data);
              // // 刷新显示服务端页面文件列表
              GlobalData.ftpCommon.showFtpFileAndDir(GlobalData.ftpCurrentPath);
              // that.listFtpFileAndDir(data.data);
              return true;
          }
          GlobalData.ftpCommon.messageTip("网络失败！请刷新重试！");
          return false;
      }).fail(function () {
          GlobalData.ftpCommon.messageTip("网络异常！加载失败！请确认访问的服务是否安装或开启！请刷新重试！");
          return false;
      }).done(function () {
          // GlobalData.ftpCurrentPath = "";
          // GlobalData.ftpCurrentCutFile = "";
          // // 关闭load图标
          GlobalData.common.closeLoadImg();
      });
  };
  /** 消息提示 **/
  obj.messageTip = function (message) {
    if (message === undefined || message === null || message === "") {return true;}
    // 关闭load图标
    GlobalData.common.closeLoadImg();
    $("#ftpMessageTipModel .modal-body").html(message);
    $("#ftpMessageTipModel").modal();
  };
  return obj;
};