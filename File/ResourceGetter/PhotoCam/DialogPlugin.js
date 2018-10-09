/// <amd-module name="File/ResourceGetter/PhotoCam/DialogPlugin" />
define("File/ResourceGetter/PhotoCam/DialogPlugin", ["require", "exports", "Core/Deferred", "Core/helpers/axo", "File/utils/b64toBlob", "Core/constants", "File/ResourceGetter/PhotoCam/DialogAbstract"], function (require, exports, Deferred, axo, toBlob, constants, DialogAbstract) {
    "use strict";
    var SEC = 1000;
    var WAIT_USER_MEDIA = 15;
    var CAB_VERSION = "2,4,0,0";
    function connectionInnit(connection, localVideo) {
        try {
            connection.setLocalVideoWindow(localVideo);
            connection.createPeerConnection(jsToSafeArray([]), true);
            return true;
        }
        catch (e) { }
        return false;
    }
    function jsToSafeArray(array) {
        if (array instanceof Array) {
            var dict = axo('Scripting.Dictionary');
            for (var i = 0, length_1 = array.length; i < length_1; i++) {
                dict.add(i, jsToSafeArray(array[i]));
            }
            return dict.Items();
        }
        return array;
    }
    /**
     *
     * @param {HTMLObjectElement} connection
     * @param {HTMLObjectElement} localVideoElement
     * @return {Core/Deferred.<MediaStream>}
     */
    var getMedia = function (connection, localVideoElement) {
        var def = new Deferred();
        var waitUserMediaDone = 0;
        var timerInit = setInterval(function () {
            if (connectionInnit(connection, localVideoElement)) {
                clearInterval(timerInit);
                if (!connection.haveLocalVideoSource) {
                    def.errback(DialogAbstract.ERRORS.NO_CAMERA);
                }
                else {
                    def.callback(connection);
                }
            }
            else {
                if (++waitUserMediaDone >= (WAIT_USER_MEDIA)) {
                    clearInterval(timerInit);
                    def.errback(DialogAbstract.ERRORS.NO_MEDIA);
                }
            }
        }, SEC);
        return def;
    };
    var DialogPlugin = DialogAbstract.extend({
        $protected: {
            _options: {
                isVideoSupported: false,
                errorText: "Object not available! Did you forget to build and register the server?",
                codebase: constants.resourceRoot + 'IEMedia/iewebrtc.cab#Version=' + CAB_VERSION,
                classId: {
                    video: "CLSID:B9579B0A-B9DA-4526-9655-FB9D2C5C31B6",
                    connection: "CLSID:D33F6834-B6C5-46D5-A094-E1D6CE8EE702"
                }
            }
        },
        init: function () {
            DialogPlugin.superclass.init.call(this);
            var container = this.getContainer();
            this._connection = container.find("#cameraConnection")[0];
        },
        _initUserMedia: function () {
            var _this = this;
            return getMedia(this._connection, this._localVideo).addCallback(function (stream) {
                _this._localVideo.src = window.URL.createObjectURL(stream);
            });
        },
        _destroyMedia: function () {
            try {
                this._connection.deletePeerConnection();
            }
            catch (e) { }
            this._connection.remove && this._connection.remove();
            this._localVideo.remove && this._localVideo.remove();
        },
        _getImage: function () {
            return new Deferred().callback(toBlob('data:image/png;base64,' + this._localVideo.grabFrameAsBase64PNG(), 'image/png'));
        }
    });
    return DialogPlugin;
});
