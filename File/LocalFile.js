define("File/LocalFile", ["require", "exports", "tslib", "File/ResourceAbstract"], function (require, exports, tslib_1, ResourceAbstract_1) {
    "use strict";
    /**
     * Класс, реализующий интерфейс работы с ресурсами {@link File/IResource},
     * предназначенный для работы с экземплярами нативнымого интерфейса File | Blob
     * @class
     * @extends File/ResourceAbstract
     * @name File/LocalFile
     * @public
     * @author Заляев А.В.
     * @implements {File/IResource}
     */
    var LocalFile = /** @class */ (function (_super) {
        tslib_1.__extends(LocalFile, _super);
        /**
         * @param {Blob | File} _data Файл
         * @param {*} [_meta] Дополнительные мета-данные
         * @param {String | File/FileInfo} [info] Объект с информацией о файле, либо строка с именем файла.
         * Имя файла является обязательным аргументом, если в качестве данных передался Blob
         * @constructor
         * @name File/LocalFile
         */
        function LocalFile(_data, _meta, info) {
            var _this = _super.call(this) || this;
            _this._data = _data;
            _this._meta = _meta;
            _this._info = typeof info == 'string' ? {
                name: info
            } : info || {};
            _this._info.name = _this._info.name || (_data instanceof File && _data.name);
            _this._info.size = _this._data.size;
            if (!_this._info.name) {
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
        return LocalFile;
    }(ResourceAbstract_1.ResourceAbstract));
    return LocalFile;
});
