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
         * @name File/Base64Blob
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
            this.blob = this.createBlob();
        }
        /**
         * Возвращает {@link https://developer.mozilla.org/ru/docs/Web/API/Blob Blob}, созданный из base64-строки
         * @public
         * @method
         * @returns {Blob} Объект Blob
         */
        Base64File.prototype.getBlob = function () {
            return this.blob;
        };
        /**
         * @public
         * @method
         * @param {String} [name='unnamed.zip'] Имя файла
         * @description Начинает загрузку Blob'a
         * @example
         * <pre>
         *    require(['File/Base64Blob'], function(Base64Blob) {
         *        var base64_data = "UGFjaWZpYyBSaW0=";
         *        var blob = new Base64Blob(base64_data);
         *       blob.saveAs('secret.txt');
         *     });
         * </pre>
         */
        Base64File.prototype.saveAs = function (name) {
            if (name === void 0) { name = 'unnamed.zip'; }
            new BlobDownloader(this.blob, name);
        };
        /**
         * Конвертирует base64 строку в Blob и возвращает его
         * @private
         * @returns {Blob} Объект Blob
         */
        Base64File.prototype.createBlob = function () {
            var decodedChars = atob(this.base64Data);
            var charCodes = new Array(decodedChars.length);
            var bytesArray = [];
            for (var i = 0; i < decodedChars.length; i++) {
                charCodes[i] = decodedChars.charCodeAt(i);
            }
            bytesArray.push(new Uint8Array(charCodes));
            return new Blob(bytesArray, { type: this.contentType });
        };
        return Base64File;
    }());
    return Base64File;
});
