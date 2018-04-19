define("File/Driver/URL", ["require", "exports", "Core/detection"], function (require, exports, detection) {
    "use strict";
    /**
     * @public
     * @class File/Driver/URL
     * @author Ибрагимов А.А
     * @description Файловый драйвер для скачивания файлов по URL
     * <pre>
     * require(['File/Driver/URL'], function(URLDriver) {
     *    var url_document = "/file-transfer/file.pdf"
     *    new URLDriver(url_document).download();
     * });
     * </pre>
     */
    var URL = /** @class */ (function () {
        /**
         * @constructor
         * @param {Strign} url URL файла
         */
        function URL(url) {
            this.url = url;
        }
        /**
         * @public
         * @method
         * @description Начинает загрузку файла
         */
        URL.prototype.download = function () {
            if (detection.isMobilePlatform) {
                window.open(this.url, '_self');
                return;
            }
            if (detection.firefox || detection.safari) {
                this.downloadByIframe(this.url);
                return;
            }
            this.downloadByA(this.url);
        };
        URL.prototype.downloadByA = function (url) {
            var link = document.createElement('a');
            link.href = url;
            link.download = url;
            document.body.appendChild(link).click();
        };
        URL.prototype.downloadByIframe = function (url) {
            var iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.setAttribute('style', 'width:0px; height:0px; display:none; border:0px;');
            document.body.appendChild(iframe);
        };
        return URL;
    }());
    return URL;
});
