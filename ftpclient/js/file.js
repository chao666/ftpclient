/**
 * Created by jchao on 2017/9/22.
 */
/** 文件操作类 **/
var FileUtil = function () {
  var obj = new Object();
  obj.init = function () {
      // 文件上传
      $("#fileUpload").fileinput({
          browseLabel: "上传文件",
          allowedFileExtensions:["jpg","jpeg","bmp","gif","png","txt","rar","zip","gz","tar","pdf","doc","docx","ppt","pptx","xls","xlsx","ogg","ogv","mp4","webm","rmvb","avi","log","properties","xml","java","jar"],
          // 是否显示标题
          showCaption: true,
          // 是否显示删除按钮
          showRemove: true,
          // 是否显示取消按钮
          showCancel: false,
          // 异步上传
          uploadAsync: true,
          // 是否预览
          showBrowse: true,
          // 是否显示上传按钮
          showUpload: true,
          // 是否显示关闭符号
          showClose: false,
          // 是否预览
          showPreview: false,
          uploadUrl: url + "file/manyFileUpload",
          maxFileSize: 102400,
          maxFilesNum: 10,
          progressThumbClass: "",
          progressUploadThreshold:"",
          progressErrorClass: "",
          uploadExtraData: function () {
              return {
                  "uploadPath": (GlobalData.fileUploadPath === "" || GlobalData.fileUploadPath === null || GlobalData.fileUploadPath === undefined)?GlobalData.currentPath: GlobalData.fileUploadPath
              }
          }
      });
      // 文件上传后回调函数
      $(document).on("fileuploaded",function (event,data,previewId,index) {
          // $("#fileUpServer .fileinput-remove").trigger("click");
          if (data.response.msg === "success") {
              // 成功后重新加载文件列表
              // 加载图标
              var upPath = (GlobalData.fileUploadPath === "" || GlobalData.fileUploadPath === null || GlobalData.fileUploadPath === undefined)?GlobalData.currentPath: GlobalData.fileUploadPath;
              GlobalData.common.showLoadImg();
              // 显示文件列表
              GlobalData.common.showFileAndDir(upPath);
              return true;
          }
          GlobalData.common.messageTip("上传失败！请检查文件大小是否小于100Mb！否则刷新重试！");
      });
      // 选择文件后立即执行
      // $("#fileUpload").on("filebatchselected",function (event,files) {
      //    $('#fileId').fileinput('upload');//上传操作
      // });
      // 点击删除后立即执行
      // $('#fileUpload').on('filesuccessremove', function(event, id) {
      //     $('#fileId').fileinput('refresh');//文件框刷新操作
      // });
  };

  return obj;
};