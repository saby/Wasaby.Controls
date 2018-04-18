define("File/Driver/Blob", ["require", "exports", "Core/detection"], function (require, exports, detection) {
    "use strict";
    var Blob = /** @class */ (function () {
        function Blob(blob) {
            this.blob = blob;
        }
        Blob.prototype.save = function (name) {
            if (detection.isIE) {
                window.navigator.msSaveOrOpenBlob(this.blob, name);
                return;
            }
            var url = URL.createObjectURL(this.blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = name;
            document.body.appendChild(link).click();
            URL.revokeObjectURL(url);
        };
        return Blob;
    }());
    return Blob;
});
