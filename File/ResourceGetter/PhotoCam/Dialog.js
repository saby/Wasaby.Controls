/// <amd-module name="File/ResourceGetter/PhotoCam/Dialog" />
define("File/ResourceGetter/PhotoCam/Dialog", ["require", "exports", "File/ResourceGetter/PhotoCam/DialogAbstract", "Core/Deferred"], function (require, exports, DialogAbstract, Deferred) {
    "use strict";
    var lastStream;
    var getMedia = function (constraints) {
        var def = new Deferred({
            cancelCallback: function () {
                if (lastStream) {
                    stopStream(lastStream);
                    lastStream = null;
                }
            }
        });
        if (!navigator) {
            return def.errback(DialogAbstract.ERRORS.NO_MEDIA);
        }
        var callback = function (stream) {
            if (def.isReady()) {
                stopStream(stream);
            }
            if (!stream.getVideoTracks().length) {
                stopStream(stream);
                def.errback(DialogAbstract.ERRORS.NO_MEDIA);
            }
            else {
                lastStream = stream;
                def.callback(stream);
            }
        };
        var errback = function (error) {
            def.errback(processStreamError(error));
        };
        // Для новых браузеров, включая IOS11+
        if (navigator.mediaDevices) {
            navigator.mediaDevices.getUserMedia(constraints).then(callback, errback);
            return def;
        }
        // Для остальных.
        // на момент написания имеет большую поддержку, но помечен как deprecated и от него отказываются
        navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
        if (!navigator.getUserMedia) {
            return def.errback(DialogAbstract.ERRORS.NO_MEDIA);
        }
        navigator.getUserMedia(constraints, callback, errback);
        return def;
    };
    /**
     * Завершает работу MediaStream.
     * @param {MediaStream} [stream] Закрываемый стрим. Если не передан, то закрываем последний открытый
     */
    var stopStream = function (stream) {
        stream = stream || lastStream;
        if (!stream) {
            return;
        }
        if (stream.stop) {
            stream.stop();
        }
        else if (stream.getTracks) {
            stream.getTracks()[0].stop();
        }
    };
    var processStreamError = function (error) {
        if ((error.name === "PermissionDismissedError") ||
            (error.name === "PermissionDeniedError") ||
            (error === "PERMISSION_DENIED")) {
            return DialogAbstract.ERRORS.permissionDenied;
        }
        if (error.name === "DevicesNotFoundError") {
            return DialogAbstract.ERRORS.NO_CAMERA;
        }
        return DialogAbstract.ERRORS.NO_MEDIA;
    };
    var Dialog = DialogAbstract.extend({
        $protected: {
            _options: {
                isVideoSupported: true
            }
        },
        _initUserMedia: function () {
            var _this = this;
            return getMedia({
                'audio': false,
                'video': true
            }).addCallback(function (stream) {
                // Старые браузеры не поддерживают srcObject
                if ("srcObject" in _this._localVideo) {
                    _this._localVideo.srcObject = stream;
                }
                else {
                    // Новые будут отказываться от такого способа
                    _this._localVideo.src = URL.createObjectURL(stream);
                }
            });
        },
        _destroyMedia: function () {
            stopStream();
        },
        _getImage: function () {
            var def = new Deferred();
            var canvas = this.getContainer().find('canvas')[0];
            canvas.width = this._localVideo.videoWidth;
            canvas.height = this._localVideo.videoHeight;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(this._localVideo, 0, 0);
            canvas.toBlob(function (blob) {
                def.callback(blob);
            }, 'image/png');
            return def;
        }
    });
    return Dialog;
});
