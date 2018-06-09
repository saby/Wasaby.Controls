/// <amd-module name="File/ResourceAbstract" />
define("File/ResourceAbstract", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * @class
     * @abstract
     * @implements File/IResource
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
            if (this._meta) {
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
        return ResourceAbstract;
    }());
    return ResourceAbstract;
});
