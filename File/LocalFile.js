define("File/LocalFile", ["require", "exports", "tslib", "File/ResourceAbstract"], function (require, exports, tslib_1, ResourceAbstract) {
    "use strict";
    /**
     * Класс - обёртка над нативным File/Blob
     * @class
     * @extends File/ResourceAbstract
     * @name File/LocalFile
     * @public
     * @author Заляев А.В.
     */
    var LocalFile = /** @class */ (function (_super) {
        tslib_1.__extends(LocalFile, _super);
        /**
         * @param {Blob | File} _data Файл
         * @param {*} [meta] Дополнительные мета-данные
         * @param {String} [name] Имя файла. Обязательный аргумент, если в качестве данных передался Blob
         * @constructor
         * @name File/LocalFile
         */
        function LocalFile(_data, meta, name) {
            var _this = _super.call(this) || this;
            _this._data = _data;
            _this._name = name || (_data instanceof File && _data.name);
            _this._meta = meta;
            if (!_this._name) {
                // Для корректной загрузки Blob через FormData необходимо имя файла
                throw new Error('Argument "name" is required for Blob data');
            }
            return _this;
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
        return LocalFile;
    }(ResourceAbstract));
    return LocalFile;
});
