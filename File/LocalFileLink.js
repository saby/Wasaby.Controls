define("File/LocalFileLink", ["require", "exports", "tslib", "File/ResourceAbstract"], function (require, exports, tslib_1, ResourceAbstract_1) {
    "use strict";
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
         * @param {*} [_meta] Дополнительные мета-данные
         * @param {FileInfo} [_info] Информация о файле
         * @constructor
         * @name File/LocalFileLink
         */
        function LocalFileLink(fileLink, _meta, _info) {
            var _this = _super.call(this) || this;
            _this.fileLink = fileLink;
            _this._meta = _meta;
            _this._info = _info;
            _this._fileInfo = _this._fileInfo || {};
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
        return LocalFileLink;
    }(ResourceAbstract_1.ResourceAbstract));
    return LocalFileLink;
});
