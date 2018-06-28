define("File/ResourceAbstract", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @class
     * @abstract
     * @implements File/IResource
     * @name File/ResourceAbstract
     */
    var ResourceAbstract = /** @class */ (function () {
        function ResourceAbstract() {
        }
        /**
         * Возвращает дополнительную информацию по ресурсу
         * @return {Object}
         * @name File/ResourceAbstract#getMeta
         * @method
         */
        ResourceAbstract.prototype.getMeta = function () {
            if (!this._meta) {
                this._meta = {};
            }
            return this._meta;
        };
        /**
         * Устанавливает дополнительную информацию по ресурсу
         * @param {Object} meta
         * @name File/ResourceAbstract#setMeta
         * @method
         */
        ResourceAbstract.prototype.setMeta = function (meta) {
            this._meta = meta;
        };
        /**
         * Возвращает информацию о файле, если такая имеется
         * @name File/ResourceAbstract#getFileInfo
         * @return {FileInfo}
         */
        ResourceAbstract.prototype.getFileInfo = function () {
            if (!this._info) {
                this._info = {};
            }
            return this._info;
        };
        /**
         * Возвращает имя файла
         * @name File/ResourceAbstract#getName
         * @return {String}
         */
        ResourceAbstract.prototype.getName = function () {
            return this.getFileInfo().name || "";
        };
        return ResourceAbstract;
    }());
    exports.ResourceAbstract = ResourceAbstract;
});
