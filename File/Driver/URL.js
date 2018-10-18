define("File/Driver/URL", ["require", "exports", "Core/detection", "Transport/fetch", "File/Driver/Blob"], function (require, exports, detection, FetchAPI, BlobDriver) {
    "use strict";
    var URLDriver = /** @class */ (function () {
        /**
         * @param {Strign} url URL файла
         */
        function URLDriver(url) {
            this.url = url;
        }
        URLDriver.prototype.download = function (fileParams) {
            if (detection.isMobilePlatform) {
                window.open(this.url, '_self');
                return Promise.resolve();
            }
            return FetchAPI({ url: this.url }).then(function (res) {
                new BlobDriver(res.blob()).download(fileParams);
                return res;
            });
        };
        return URLDriver;
    }());
    return URLDriver;
});
/**
 * Файловый драйвер для скачивания файлов по URL
 * @public
 * @class
 * @author Ибрагимов А.А
 * @implements {File/Driver/Interface}
 * @example
 * <pre>
 * require(['File/Driver/URL'], function(URLDriver) {
 *    var url_document = "/file-transfer/file.pdf"
 *    new URLDriver(url_document).download();
 * }).catch(console.error);      // обработчик ошибки скачивания
 * </pre>
 */ 
