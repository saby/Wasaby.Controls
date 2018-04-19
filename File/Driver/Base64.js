define("File/Driver/Base64", ["require", "exports", "File/utils/b64toBlob", "File/Driver/Blob"], function (require, exports, base64toblob, BlobDriver) {
    "use strict";
    var Base64 = /** @class */ (function () {
        function Base64(data) {
            if (data.indexOf('data:') === -1) {
                this.base64Data = data;
                return;
            }
            this.contentType = data.substring(data.indexOf(':') + 1, data.indexOf(';'));
            this.base64Data = data.substring(data.indexOf(',') + 1);
        }
        Base64.prototype.download = function (options) {
            var type = (options && options['contentType']) ? options['contentType'] : this.contentType;
            var blob = base64toblob(this.base64Data, type);
            new BlobDriver(blob).download(options);
        };
        return Base64;
    }());
    return Base64;
});
