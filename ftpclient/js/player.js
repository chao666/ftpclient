/**
 * Created by jchao on 2017/9/23.
 */
var Player = function () {
    var obj = new Object();
    obj.init = function () {
        return this.video();
    };
    obj.video = function() {
        var video =  videojs("videoPlayer");
        video.poster();
        return video;
    };
    return obj;
};