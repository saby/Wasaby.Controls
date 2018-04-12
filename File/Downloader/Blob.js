define("File/Downloader/Blob", ["require", "exports", "File/Downloader/URL", "Core/detection"], function (require, exports, DownloaderURL, detection) {
    "use strict";
    /**
     * @class File/Downloader/Blob
     * @public
     * @author Ибрагимов А.А
     * @description Компонент для инициализации загрузки файла
     * @remark Класс-обертка над {@link File/Downloader/URL}
     * @example
     * <pre>
     *    require(['File/Downloader/Blob'], function(DownloaderFile) {
     *       var file = new Blob(['<a id="a"><b id="b">hey!</b></a>'], {type : 'text/html'});
     *       new DownloaderFile(file);
     *    });
     * </pre>
     */
    var DownloaderFile = /** @class */ (function () {
        /**
         * @name  File/Downloader/Blob
         * @constructor
         * @param {Blob} blob экземпляр   {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob Blob}
         * @param {String} [name='unnamed.zip'] Имя файла
         */
        function DownloaderFile(blob, name) {
            if (name === void 0) { name = 'unnamed.zip'; }
            if (detection.isIE) {
                window.navigator.msSaveOrOpenBlob(blob, name);
                return;
            }
            var url = URL.createObjectURL(new File([blob], name));
            new DownloaderURL(url, name);
            URL.revokeObjectURL(url);
        }
        return DownloaderFile;
    }());
    return DownloaderFile;
});
