define("File/Base64Blob", ["require", "exports", "File/BlobDownloader"], function (require, exports, BlobDownloader) {
    "use strict";
    /**
     * @name File/Base64Blob
     * @public
     * @class
     * @author Ибрагимов А.А
     * @description Класс для работы с файлами в кодировке base64.
     * Преобразовывает base64-строку в Blob, позволяя сохранить его локально
     */
    var Base64File /** @lends Lib/File/Base64File.prototype*/ = /** @class */ (function () {
        /**
         * @name File/Base64File
         * @constructor
         * @param {String} data Base64-строка
         * @param {String} [contentType='application/zip'] Тип файла
         */
        function Base64File(data, contentType) {
            if (contentType === void 0) { contentType = 'application/zip'; }
            if (!data) {
                throw new Error('Argument "data" is required for constructor!');
            }
            if (data.indexOf('data:') === -1) {
                this.base64Data = data;
                this.contentType = contentType;
            }
            else {
                this.base64Data = data.substring(data.indexOf(',') + 1);
                this.contentType = data.substring(data.indexOf(':') + 1, data.indexOf(';'));
            }
            this.blob = this.getBlob();
        }
        /**
         * Конвертирует base64 строку в {@linkhttps://developer.mozilla.org/ru/docs/Web/API/Blob Blob} и возвращает его
         * @public
         * @returns {Blob} Объект Blob
         */
        Base64File.prototype.getBlob = function () {
            var decodedChars = atob(this.base64Data);
            var charCodes = new Array(decodedChars.length);
            var bytesArray = [];
            for (var i = 0; i < decodedChars.length; i++) {
                charCodes[i] = decodedChars.charCodeAt(i);
            }
            bytesArray.push(new Uint8Array(charCodes));
            return new Blob(bytesArray, { type: this.contentType });
        };
        /**
         * @public
         * @method
         * @param {String} [name='unnamed.zip'] Имя файла
         * @description Начинает загрузку Blob'a
         * @example
         * <pre>
         *    require(['File/Base64Blob'], function(Base64File) {
         *       var data = "UGFjaWZpYyBSaW0=";
         *       var blob = new Base64Blob(data);
         *       blob.saveAs('secret.txt');
         *     });
         * </pre>
         */
        Base64File.prototype.saveAs = function (name) {
            if (name === void 0) { name = 'unnamed.zip'; }
            new BlobDownloader(this.blob, name);
        };
        return Base64File;
    }());
    return Base64File;
});
