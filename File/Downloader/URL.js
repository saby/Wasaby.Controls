define("File/Downloader/URL", ["require", "exports", "Core/detection"], function (require, exports, detection) {
    "use strict";
    /**
     * @class File/Downloader/URL
     * @public
     * @author Ибрагимов А.А
     * @description Компонент для инициализации загрузки файла.
     * @param {String} url url-адрес файла
     * @example
     * <pre>
     *    require(['File/Downloader/URL'], function(DownloaderURL) {
     *       new DownloaderURL('https://example.com/folder/filename');
     *    });
     * </pre>
     */
    var DownloaderURL = /** @class */ (function () {
        /**
         * @class File/Downloader/URL
         * @constructor
         * @param {String} URL Адрес файла
         * @param {String} [filename=URL] Имя файла
         */
        function DownloaderURL(url, filename) {
            if (detection.isMobilePlatform) {
                this.downloadForMobile(url);
                return;
            }
            if (detection.firefox || detection.safari) {
                this.downloadByIframe(url);
                return;
            }
            this.downloadByA(url, filename || url);
        }
        /**
         * @protected
         * @method
         * @description Загрузка через невидимый <b>iframe</b> для FireFox и Safari
         */
        DownloaderURL.prototype.downloadByIframe = function (url) {
            var iframe = document.createElement('iframe');
            iframe.src = url;
            iframe.setAttribute('style', 'width:0px; height:0px; display:none; border:0px;');
            document.body.appendChild(iframe);
        };
        /**
         * @protected
         * @method
         * @description Загрузка через невидимый <b>a</b> для остальных браузеров
         */
        DownloaderURL.prototype.downloadByA = function (url, filename) {
            var link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link).click();
        };
        /**
         * @protected
         * @method
         * @description Загрузка для мобильных браузеров
         */
        DownloaderURL.prototype.downloadForMobile = function (url) {
            window.open(url, '_self');
        };
        return DownloaderURL;
    }());
    return DownloaderURL;
});
