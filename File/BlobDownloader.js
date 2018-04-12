define("File/BlobDownloader", ["require", "exports", "Core/detection"], function (require, exports, detection) {
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
    var BlobDownloader = /** @class */ (function () {
        /**
         * @name  File/BlobDownloader
         * @constructor
         * @param {Blob} blob экземпляр {@link https://developer.mozilla.org/en-US/docs/Web/API/Blob Blob}
         * @param {String} [name='unnamed.zip'] Имя файла
         */
        function BlobDownloader(blob, name) {
            if (name === void 0) { name = 'unnamed.zip'; }
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
        }
        return BlobDownloader;
    }());
    return BlobDownloader;
});
