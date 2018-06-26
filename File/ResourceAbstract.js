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
         * @name File/ResourceAbstract#getInfo
         * @return {FileInfo}
         */
        ResourceAbstract.prototype.getInfo = function () {
            if (!this._info) {
                this.setInfo({});
            }
            return this._info;
        };
        ResourceAbstract.prototype.getFileInfo = function () {
            return this.getInfo();
        };
        /**
         * Возвращает информацию о файле
         * @name File/ResourceAbstract#setInfo
         * @param {FileInfo} info
         */
        ResourceAbstract.prototype.setInfo = function (info) {
            this._info = info || {};
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
