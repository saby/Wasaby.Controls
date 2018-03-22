/// <amd-module name="File/utils/b64toBlob" />
define("File/utils/b64toBlob", ["require", "exports"], function (require, exports) {
    "use strict";
    var b64toBlob;
    /**
     * Получение файла из base64 строки
     * @param {String} data Тело файла в виде base64 строки
     * @param {String} contentType MIME-type
     * @param {Number} [sliceSize]
     * @return {File}
     */
    b64toBlob = function (data, contentType, sliceSize) {
        sliceSize = sliceSize || 512;
        var byteCharacters = atob(data);
        var byteArrays = [];
        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);
            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        return new Blob(byteArrays, {
            type: contentType || ""
        });
    };
    if ((typeof Blob === "undefined") || (typeof Uint8Array === "undefined")) {
        b64toBlob = function (data, contentType, sliceSize) {
            throw new Error("Function is not supported is current platform");
        };
    }
    return b64toBlob;
});
