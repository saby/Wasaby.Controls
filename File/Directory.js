define("File/Directory", ["require", "exports", "tslib", "File/ResourceAbstract"], function (require, exports, tslib_1, ResourceAbstract_1) {
    "use strict";
    /**
     * Класс - обёртка над директорией
     * @class
     * @extends File/ResourceAbstract
     * @name File/Directory
     * @public
     * @author Заляев А.В.
     */
    var Directory = /** @class */ (function (_super) {
        tslib_1.__extends(Directory, _super);
        /**
         * @param {String} name Имя директории
         * @param {Object} [meta] Дополнительные мета-данные
         * @param {Number} [size] Дополнительные мета-данные
         * @param {File/FileInfo} [info] Объект с информацией о файле.
         * @param {File/IResource} [entries] Содержимое директории.
         * @constructor
         * @name File/Directory
         */
        function Directory(_a) {
            var name = _a.name, size = _a.size, entries = _a.entries, meta = _a.meta;
            var _this = _super.call(this) || this;
            if (!name) {
                throw new Error('Argument "name" is required');
            }
            _this._info = {
                size: size,
                name: name,
                isDirectory: true
            };
            _this.__entries = entries || [];
            _this._meta = meta || {};
            return _this;
        }
        /**
         * Возвращает содержимоё директории
         * @return {File | Blob}
         * @name File/Directory#getData
         * @method
         */
        Directory.prototype.getEntries = function () {
            return this.__entries.slice();
        };
        Directory.prototype.push = function (entry) {
            var info = entry.getFileInfo();
            info.path = this.getName() + '/' + (info.path || entry.getName());
            entry.setInfo(info);
            this.__entries.push(entry);
        };
        return Directory;
    }(ResourceAbstract_1.ResourceAbstract));
    return Directory;
});
