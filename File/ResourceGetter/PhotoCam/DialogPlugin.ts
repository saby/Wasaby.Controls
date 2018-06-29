/// <amd-module name="File/ResourceGetter/PhotoCam/DialogPlugin" />

import Deferred = require("Core/Deferred");
import axo = require("Core/helpers/axo");
import toBlob = require("File/utils/b64toBlob");
import constants = require("Core/constants");
import DialogAbstract = require("File/ResourceGetter/PhotoCam/DialogAbstract");

const SEC = 1000;
const WAIT_USER_MEDIA = 15;
const CAB_VERSION = "2,4,0,0";

function connectionInnit(connection, localVideo) {
    try {
        connection.setLocalVideoWindow(localVideo);
        connection.createPeerConnection(jsToSafeArray([]), true);
        return true;
    } catch(e) {}

    return false;
}
function jsToSafeArray(array) {
    if (array instanceof Array){
        let dict = axo('Scripting.Dictionary');

        for (let i = 0, length = array.length; i < length; i++){
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
let getMedia = (connection, localVideoElement) => {
    let def = new Deferred();
    let waitUserMediaDone = 0;

    let timerInit = setInterval(function() {
        if (connectionInnit(connection, localVideoElement)) {
            clearInterval(timerInit);
            if (!connection.haveLocalVideoSource) {
                def.errback(DialogAbstract.ERRORS.NO_CAMERA);
            }
            else {
                def.callback(connection);
            }
        } else {
            if(++waitUserMediaDone >= (WAIT_USER_MEDIA)) {
                clearInterval(timerInit);
                def.errback(DialogAbstract.ERRORS.NO_MEDIA);
            }
        }
    }, SEC);
    return def;
};

let DialogPlugin = DialogAbstract.extend({
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
    init() {
        DialogPlugin.superclass.init.call(this);

        let container = this.getContainer();
        this._connection = container.find("#cameraConnection")[0];
    },
    _initUserMedia(): Deferred<void> {
        return getMedia(
            this._connection,
            this._localVideo
        ).addCallback((stream) => {
            this._localVideo.src = window.URL.createObjectURL(stream);
        });
    },
    _destroyMedia() {
        try {
            this._connection.deletePeerConnection();
        } catch (e) {}
        this._connection.remove && this._connection.remove();
        this._localVideo.remove && this._localVideo.remove();
    },
    _getImage(): Deferred<Blob> {
        return new Deferred().callback(toBlob(
            'data:image/png;base64,' + this._localVideo.grabFrameAsBase64PNG(),
            'image/png'
        ));
    }
});

export = DialogPlugin;
