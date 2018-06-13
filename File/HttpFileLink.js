define("File/HttpFileLink", ["require", "exports", "tslib", "File/ResourceAbstract"], function (require, exports, tslib_1, ResourceAbstract) {
    "use strict";
    /**
     * Класс - обёртка над http-ссылкой на файл
     * @class
     * @extends File/ResourceAbstract
     * @name File/HttpFileLink
     * @public
     * @author Заляев А.В.
     */
    var HttpFileLink = /** @class */ (function (_super) {
        tslib_1.__extends(HttpFileLink, _super);
        /**
         * @param {String} fileLink Ссылка на ресурс
         * @param {*} [meta] Дополнительные мета-данные
         * @constructor
         * @name File/HttpFileLink
         */
        function HttpFileLink(fileLink, meta) {
            var _this = _super.call(this) || this;
            _this.fileLink = fileLink;
            _this._meta = meta;
            return _this;
        }
        /**
         * Возвращает ссылку на удалённый ресурс
         * @return {String}
         * @method
         * @name File/HttpFileLink#getLink
         */
        HttpFileLink.prototype.getLink = function () {
            return this.fileLink;
        };
        return HttpFileLink;
    }(ResourceAbstract));
    return HttpFileLink;
});
