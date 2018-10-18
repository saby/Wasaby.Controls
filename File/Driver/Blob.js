define("File/Driver/Blob", ["require", "exports", "Core/detection"], function (require, exports, detection) {
    "use strict";
    /**
     * Файловый драйвер для скачивания Blob файлов
     * @public
     * @class
     * @implements {File/Driver/Interface}
     * @author Ибрагимов А.А
     */
    var BlobDriver = /** @class */ (function () {
        function BlobDriver(promiseBlob) {
            this.promiseBlob = promiseBlob;
            this.name = 'no_name_blob';
        }
        BlobDriver.prototype.download = function (fileParams) {
            var _this = this;
            return this.promiseBlob.then(function (blob) { return _this._downloadBlob(blob, fileParams); });
        };
        BlobDriver.prototype._downloadBlob = function (blob, options) {
            var name = (options) ? options['name'] : this.name;
            if (detection.isIE) {
                window.navigator.msSaveOrOpenBlob(blob, name);
                return;
            }
            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            link.href = url;
            link.download = name;
            document.body.appendChild(link).click();
            URL.revokeObjectURL(url);
        };
        return BlobDriver;
    }());
    return BlobDriver;
});
