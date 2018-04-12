define("File/BlobDownloader", ["require", "exports", "Core/detection"], function (require, exports, detection) {
    "use strict";
    /**
     * @class File/BlobDownloader
     * @public
     * @author Ибрагимов А.А
     * @description Компонент для загрузки Blob'a
     * @example
     * <pre>
     *    require(['File/BlobDownloader'], function(BlobDownloader) {
     *       var blob = new Blob(['<a id="a"><b id="b">hey!</b></a>'], {type : 'text/html'});
     *       new BlobDownloader(blob, 'index.html');
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
