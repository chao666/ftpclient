/**
 * Created by jchao on 2017/11/1.
 */
/** 文件全局网址变量 后面需要加斜杠 / **/
var url = "http://192.168.17.89:9090/";
// FTP_IP
var ftpIP = "192.168.17.89";
// FTP服务器url
var ftpUrl = "http://"+ ftpIP + ":9090/";
// 默认访问本地根目录 应与JAVA端配置一致 后面不能加 /
var rootPath = "/usr/fileManage";/** Windows格式：D:\\ **/
// FTP默认服务端根目录
var ftpRootPath = "/";
/** 两个特殊目录 仅用在本地使用 **/
// 垃圾箱名称 应与服务端配置一致
var trashFolder = "回收站";
var compressFolder = "压缩文件";
// 动态获取访问网址
// url = window.location.protocol + "//" + window.location.host + "/";
// 全局变量
var GlobalData = {
    // 公用全局对象变量
    common: "",
    // ftp公用全局对象变量
    ftpCommon:"",
    // 存储当前显示的所有文件以及文件夹数据
    currentData: "",
    // 存储当前显示所在路径
    currentPath: "",
    // 存储当前剪切的文件
    currentCutFile: "",
    // 存储当前复制的文件
    currentCopyFile: "",
    // 是否有下载的文件标志
    currentDownloadFlag: "",
    // 是否有黏贴的文件标志
    currentPasteFlag: false,
    // 当前创建类型
    currentCreateType: "",
    // 当前文件的名称
    currentFileName: "",
    // 当前压缩的文件名称
    currentCompressFile:"",
    // 当前解压的文件名称
    currentDecompressFile:"",
    // 当前选中的文件
    currentSeclectFile: "",
    // 加载提示标志
    currentLoadFlag: false,
    // 是否有删除文件的标志
    currentDeleteFile: false,
    // 当前上传文件标志
    currentUploadFileFlag: false,
    // 当前服务端选择是否改变标志
    currentChangeServerFlag: false,
    // 点击选中样式标志
    clickStyleFlag: "",
    // 文件上传的目录
    fileUploadPath: "",
    // 音视频播放对象
    video: "",
    // FTP当前路径
    ftpCurrentPath:"",
    // 存储当前显示的所有文件以及文件夹数据
    ftpCurrentData: "",
    // 当前移动文件 要移动到 服务端还是客户端
    ftpMoveServerClient: "",
    // 点击选中样式标志
    ftpClickStyleFlag: "",
    // 当前移动文件名全称 123.jpg
    ftpCurrentMoveFilename:"",
    // FTP当前移动的文件路径全称
    ftpCurrentCutFile:"",
    // 删除文件标志
    ftpCurrentDeleteFile: false,
    // ftp当前文件
    ftpCurrentFileName:"",
    // 记录重命名文件的原文件名称
    ftpRenameFileName:""
};
// 文件类型 对应的图标
var GlobalType = {
    txt: "fa fa-file-text-o fa-5x",
    log: "fa fa-file-text-o fa-5x",
    jpeg: "fa fa-picture-o fa-5x",
    bmp: "fa fa-picture-o fa-5x",
    gif: "fa fa-picture-o fa-5x",
    png: "fa fa-picture-o fa-5x",
    jpg: "fa fa-picture-o fa-5x",
    pdf: "fa fa-file-pdf-o fa-5x",
    docx: "fa fa-file-word-o fa-5x",
    doc: "fa fa-file-word-o fa-5x",
    zip: "fa fa-file-zip-o fa-5x",
    rar: "fa fa-file-zip-o fa-5x",
    gz: "fa fa-file-zip-o fa-5x",
    tar: "fa fa-file-zip-o fa-5x",
    xz: "fa fa-file-zip-o fa-5x",
    iso: "fa fa-file-zip-o fa-5x",
    ppt: "fa fa-file-powerpoint-o fa-5x",
    pptx: "fa fa-file-powerpoint-o fa-5x",
    xls: "fa fa-file-excel-o fa-5x",
    xlsx: "fa fa-file-excel-o fa-5x",
    mp4: "fa fa-video-camera fa-5x",
    ogv: "fa fa-video-camera fa-5x",
    ogg: "fa fa-video-camera fa-5x",
    webm: "fa fa-video-camera fa-5x",
    rmvb: "fa fa-music fa-5x",
    mp3: "fa fa-music fa-5x",
    wav: "fa fa-music fa-5x",
    avi: "fa fa-music fa-5x",
    trash: "fa fa-trash-o fa-5x",
    '7z': "fa fa-file-zip-o fa-5x"
};
// 禁止页面iframe
if (window.top !== window.self) {
    window.top.location = window.location;
}
// 页面所有内容加载完成
window.onload = function() {

};
// 检测窗口改变 调整显示窗口
$(window).resize(function () {
    // 动态根据浏览器显示高度 调整文件列表显示高度
    GlobalData.common.setShowHeight();
});