define("File/LocalFile", ["require", "exports"], function (require, exports) {
    "use strict";
    /// <amd-module name="File/LocalFile" />
    /**
     * Класс - обёртка над нативным File/Blob
     * @class
     * @name File/LocalFile
     * @public
     * @author Заляев А.В.
     */
    var LocalFile = /** @class */ (function () {
        /**
         * @param {Blob | File} _data Файл
         * @param {*} [_meta] Дополнительные мета-данные
         * @param {String} [name] Имя файла. Обязательный аргумент, если в качестве данных передался Blob
         * @constructor
         * @name File/LocalFile
         */
        function LocalFile(_data, _meta, name) {
            this._data = _data;
            this._meta = _meta;
            this._name = name || (_data instanceof File && _data.name);
            if (!this._name) {
                // Для корректной загрузки Blob через FormData необходимо имя файла
                throw new Error('Argument "name" is required for Blob data');
            }
        }
        /**
         * Возвращает файл
         * @return {File | Blob}
         * @name File/LocalFile#getData
         * @method
         */
        LocalFile.prototype.getData = function () {
            return this._data;
        };
        /**
         * Возвращает имя файла
         * @return {String}
         */
        LocalFile.prototype.getName = function () {
            return this._name;
        };
        /**
         * Возвращает дополнительную информацию по файлу
         * @return {*}
         * @name File/LocalFile#getMeta
         * @method
         */
        LocalFile.prototype.getMeta = function () {
            return this._meta || {};
        };
        return LocalFile;
    }());
    return LocalFile;
});
