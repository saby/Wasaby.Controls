define("File/Downloader/File", ["require", "exports", "File/Downloader/URL"], function (require, exports, DownloaderURL) {
    "use strict";
    /**
     * @class File/Downloader/File
     * @public
     * @author Ибрагимов А.А
     * @description Компонент для инициализации загрузки файла
     * @remark Класс-обертка над {@link File/Downloader/URL}
     * @example
     * <pre>
     *    require(['File/Downloader/File'], function(DownloaderFile) {
     *       var file = new File(['foo'], 'foo.txt');
     *       new DownloaderFile(file);
     *    });
     * </pre>
     */
    var DownloaderFile = /** @class */ (function () {
        /**
         * @name  File/Downloader/File
         * @constructor
         * @param {File} file экземпляр {@link https://developer.mozilla.org/en-US/docs/Web/API/File File}
         */
        function DownloaderFile(file) {
            /**
             * Значение имени файла по умолчанию
             * @private
             */
            this.filename = 'file.zip';
            var url = URL.createObjectURL(file);
            new DownloaderURL(url, file.name || this.filename);
            URL.revokeObjectURL(url);
        }
        return DownloaderFile;
    }());
    return DownloaderFile;
});
