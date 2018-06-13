define("File/LocalFileLink", ["require", "exports", "tslib", "File/ResourceAbstract"], function (require, exports, tslib_1, ResourceAbstract) {
    "use strict";
    /**
     * @typedef {Object} FileInfo Информация о файле
     * @property {String} [name] Имя
     * @property {String} [type]  Тип
     * @property {Boolean} [isDirectory] Является ли директорией
     * @property {Number} [size] Размер
     */
    /**
     * Класс - обёртка над ссылкой на локальный файл
     * @class
     * @extends File/ResourceAbstract
     * @name File/LocalFileLink
     * @public
     * @author Заляев А.В.
     */
    var LocalFileLink = /** @class */ (function (_super) {
        tslib_1.__extends(LocalFileLink, _super);
        /**
         * @param {String} fileLink Ссылка на файл
         * @param {*} [meta] Дополнительные мета-данные
         * @param {FileInfo} [fileInfo] Информация о файле
         * @constructor
         * @name File/LocalFileLink
         */
        function LocalFileLink(fileLink, meta, fileInfo) {
            var _this = _super.call(this) || this;
            _this.fileLink = fileLink;
            _this._fileInfo = fileInfo || {};
            if (!_this._fileInfo.name) {
                /*
                 * Для ссылки на локальный файл, именем является часть пути до него после последнего слеша
                 */
                _this._fileInfo.name = fileLink.replace(/.*(\\|\/)/, "");
            }
            return _this;
        }
        /**
         * Возвращает ссылку на файл, находящийся на локальном устройстве
         * @return {String}
         * @method
         * @name File/LocalFileLink#getLink
         */
        LocalFileLink.prototype.getLink = function () {
            return this.fileLink;
        };
        /**
         * Возвращает информацию о файле, если такая имеется
         * @return {FileInfo}
         */
        LocalFileLink.prototype.getFileInfo = function () {
            return this._fileInfo || {};
        };
        /**
         * Возвращает имя файла
         * @return {String}
         */
        LocalFileLink.prototype.getName = function () {
            return this._fileInfo.name || "";
        };
        return LocalFileLink;
    }(ResourceAbstract));
    return LocalFileLink;
});
