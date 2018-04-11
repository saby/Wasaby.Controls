define("File/Base64File", ["require", "exports", "File/Downloader/File"], function (require, exports, DownloaderFile) {
    "use strict";
    /**
     * @name Lib/File/Base64File
     * @public
     * @class
     * @author Ибрагимов А.А
     * @description Класс для работы с файлами в кодировке base64.
     * Преобразовывает base64-строку в File
     */
    var Base64File /** @lends Lib/File/Base64File.prototype*/ = /** @class */ (function () {
        /**
         * @name Lib/File/Base64File
         * @constructor
         * @param {String} data Base64 строка
         * @param {String} [contentType='application/zip'] Тип файла
         * @param {String} [name='file.zip'] Имя файла
         */
        function Base64File(data, contentType, name) {
            if (contentType === void 0) { contentType = 'application/zip'; }
            if (name === void 0) { name = 'file.zip'; }
            this.name = name;
            if (data.indexOf('data:') === -1) {
                this.base64Data = data;
                this.contentType = contentType;
            }
            else {
                this.base64Data = data.substring(data.indexOf(',') + 1);
                this.contentType = data.substring(data.indexOf(':') + 1, data.indexOf(';'));
            }
            this.file = this.getFile();
        }
        /**
         * Начинает загрузку файла
         * @public
         */
        Base64File.prototype.download = function () {
            new DownloaderFile(this.file);
        };
        /**
         * Конвертирует base64 строку в {@link https://developer.mozilla.org/en-US/docs/Web/API/File File} и возвращает его
         * @public
         * @returns {File} Объект File
         */
        Base64File.prototype.getFile = function () {
            var decodedChars = atob(this.base64Data);
            var charCodes = new Array(decodedChars.length);
            var bytesArray = [];
            for (var i = 0; i < decodedChars.length; i++) {
                charCodes[i] = decodedChars.charCodeAt(i);
            }
            bytesArray.push(new Uint8Array(charCodes));
            return new File([new Blob(bytesArray, { type: this.contentType })], this.name);
        };
        return Base64File;
    }());
    return Base64File;
});
