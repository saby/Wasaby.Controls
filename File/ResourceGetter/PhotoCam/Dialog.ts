/// <amd-module name="File/ResourceGetter/PhotoCam/Dialog" />

import DialogAbstract = require("File/ResourceGetter/PhotoCam/DialogAbstract");
import Deferred = require("Core/Deferred");

let lastStream: MediaStream;
let getMedia = (constraints: MediaStreamConstraints): Deferred<MediaStream> => {
    let def = new Deferred({
        cancelCallback(){
            if (lastStream) {
                stopStream(lastStream);
                lastStream = null;
            }
        }
    });
    if (!navigator) {
        return def.errback(DialogAbstract.ERRORS.NO_MEDIA);
    }
    let callback = (stream: MediaStream) => {
        if (def.isReady()){
            stopStream(stream);
        }
        if (!stream.getVideoTracks().length) { // нет камеры
            stopStream(stream);
            def.errback(DialogAbstract.ERRORS.NO_MEDIA);
        } else {
            lastStream = stream;
            def.callback(stream);
        }
    };
    let errback = (error: Error) => {
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
let stopStream = (stream?: MediaStream) => {
    stream = stream || lastStream;
    if (!stream) {
        return;
    }
    if (stream.stop) {
        stream.stop();
    } else if (stream.getTracks) {
        stream.getTracks()[0].stop();
    }
};
let processStreamError = (error) => {
    if ((error.name === "PermissionDismissedError") ||
        (error.name === "PermissionDeniedError") ||
        (error === "PERMISSION_DENIED")
    ) {
        return DialogAbstract.ERRORS.permissionDenied;
    }
    if (error.name === "DevicesNotFoundError") {
        return DialogAbstract.ERRORS.NO_CAMERA;
    }
    return DialogAbstract.ERRORS.NO_MEDIA;
};

let Dialog = DialogAbstract.extend({
    $protected: {
      _options: {
          isVideoSupported: true
      }
    },
    _initUserMedia(): Deferred<MediaStream> {
        return getMedia({
            'audio': false,
            'video': true
        }).addCallback((stream) => {
            // Старые браузеры не поддерживают srcObject
            if ("srcObject" in this._localVideo) {
                this._localVideo.srcObject = stream;
            } else {
                // Новые будут отказываться от такого способа
                this._localVideo.src = URL.createObjectURL(stream);
            }
        });
    },
    _destroyMedia() {
        stopStream();
    },
    _getImage(): Deferred<Blob> {
        let def = new Deferred();
        let canvas: HTMLCanvasElement = this.getContainer().find('canvas')[0];

        canvas.width = this._localVideo.videoWidth;
        canvas.height = this._localVideo.videoHeight;

        let ctx = canvas.getContext('2d');
        ctx.drawImage(this._localVideo, 0, 0);

        canvas.toBlob((blob: Blob) => {
            def.callback(blob);
        }, 'image/png');
        return def;
    }
});

export = Dialog;
