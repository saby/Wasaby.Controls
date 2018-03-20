define("Controls/File/LocalFileLink", ["require", "exports"], function (require, exports) {
    "use strict";
    /// <amd-module name="Controls/File/LocalFileLink" />
    /**
     * Класс - обёртка над ссылкой на локальный файл
     * @class
     * @name Controls/File/LocalFileLink
     * @public
     * @author Заляев А.В.
     */
    var LocalFileLink = /** @class */ (function () {
        /**
         * @param {String} fileLink Ссылка на файл
         * @param {*} [meta] Дополнительные мета-данные
         * @constructor
         * @name Controls/File/LocalFileLink
         */
        function LocalFileLink(fileLink, meta) {
            this.fileLink = fileLink;
            this.meta = meta;
        }
        /**
         * Возвращает ссылку на файл, находящийся на локальном устройстве
         * @return {String}
         * @method
         * @name Controls/File/LocalFileLink#getLink
         */
        LocalFileLink.prototype.getLink = function () {
            return this.fileLink;
        };
        /**
         * Возвращает дополнительную информацию по файлу
         * @return {*}
         * @method
         * @name Controls/File/LocalFileLink#getMeta
         */
        LocalFileLink.prototype.getMeta = function () {
            return this.meta;
        };
        return LocalFileLink;
    }());
    return LocalFileLink;
});
