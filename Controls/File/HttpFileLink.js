define("Controls/File/HttpFileLink", ["require", "exports"], function (require, exports) {
    "use strict";
    /// <amd-module name="Controls/File/HttpFileLink" />
    /**
     * Класс - обёртка над http-ссылкой на файл
     * @class
     * @name Controls/File/HttpFileLink
     * @public
     * @author Заляев А.В.
     */
    var HttpFileLink = /** @class */ (function () {
        /**
         * @param {String} fileLink Ссылка на ресурс
         * @param {*} [meta] Дополнительные мета-данные
         * @constructor
         * @name Controls/File/HttpFileLink
         */
        function HttpFileLink(fileLink, meta) {
            this.fileLink = fileLink;
            this.meta = meta;
        }
        /**
         * Возвращает ссылку на удалённый ресурс
         * @return {String}
         * @method
         * @name Controls/File/HttpFileLink#getLink
         */
        HttpFileLink.prototype.getLink = function () {
            return this.fileLink;
        };
        /**
         * Возвращает дополнительную информацию по файлу
         * @return {*}
         * @method
         * @name Controls/File/HttpFileLink#getMeta
         */
        HttpFileLink.prototype.getMeta = function () {
            return this.meta;
        };
        return HttpFileLink;
    }());
    return HttpFileLink;
});
