/**
 * Created by jchao on 2017/9/23.
 */
/** 解决Jquery $ 冲突问题 **/
// $.noConflict();
// jQuery(document).ready(function ($) {
//
// });
// 页面结构完成后加载 全局初始化
$(document).ready(function() {
    /** 文件操作 **/
    // 实例化全局对象 初始化公共全局方法
    GlobalData.common = new common();
    GlobalData.common.init();
    // 初始化所有定义的对象
    // new Index().init();
    // 文件操作类
    // new FileUtil().init();
    // 音视频播放类
    GlobalData.video = new Player().init();
    // 拖动文件处理类
    new Drag().init();
    // 滚动条处理类
    new Scroll().init();
    // 初始化所有定义的点击事件
    new Click().init();

    /** FTP操作 **/
    // FTP服务端
    GlobalData.ftpCommon = new FTP();
    GlobalData.ftpCommon.init();
    // FTP点击事件
    new ftpClick().init();
});