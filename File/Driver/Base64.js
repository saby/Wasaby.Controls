define("File/Driver/Base64", ["require", "exports", "File/utils/b64toBlob", "File/Driver/Blob"], function (require, exports, base64toblob, BlobDriver) {
    "use strict";
    var Base64Driver = /** @class */ (function () {
        /**
         * @param {String} base64string Строка в формате base64
         * */
        function Base64Driver(base64string) {
            if (base64string.indexOf('data:') === -1) {
                this.base64Data = base64string;
                return;
            }
            this.contentType = base64string.substring(base64string.indexOf(':') + 1, base64string.indexOf(';'));
            this.base64Data = base64string.substring(base64string.indexOf(',') + 1);
        }
        /**
         * Начинает загрузку файла
         * @param {FileParams} fileParams Параметры загрузки
         * @returns {Promise<void | Error>} Promise<void | Error>
         */
        Base64Driver.prototype.download = function (fileParams) {
            var type = (fileParams && fileParams['contentType']) ? fileParams['contentType'] : this.contentType;
            var blob;
            try {
                blob = base64toblob(this.base64Data, type);
            }
            catch (e) {
                return Promise.reject(new Error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043A\u043E\u043D\u0432\u0435\u0440\u0442\u0430\u0446\u0438\u0438 Base64 \u0441\u0442\u0440\u043E\u043A\u0438 \u0432 Blob!\n" + e.message));
            }
            return new BlobDriver(Promise.resolve(blob)).download(fileParams);
        };
        return Base64Driver;
    }());
    return Base64Driver;
});
/**
 * @class File/Driver/Base64
 * @public
 * @author Ибрагимов А.А
 * @description Файловый драйвер для скачивания файлов в кодировке base64
 * <pre>
 * require(['File/Driver/Base64'], function(Base64Driver) {
 *    var base64_text = "wqtXZWVrcyBvZiBjb2RpbmcgY2FuIHNhdmUgeW91IGhvdXJzIG9mIHBsYW5uaW5nwrssDQogdW5rbm93biBhcnRpc3Qu";
 *    new Base64Driver(base64_text).download({
 *       name: 'phrase.txt',          // Имя, под которым файл будет сохранен (необязательно)
 *       contentType: 'text/plain'    // Тип контента (необязательно)
 *     }).catch(console.error);       // обработчик ошибок преобразования
 * });
 * </pre>
 */
