/**
 * Created by jchao on 2017/9/28.
 */
var Scroll = function () {
    var obj = new Object();
    obj.init = function () {
        // 滚动条初始化
        $(".scollContent").mCustomScrollbar({
            axis: "y",
            theme: "dark"
        });
    };

    return obj;
};