define("File/LocalFileLink", ["require", "exports"], function (require, exports) {
    "use strict";
    /// <amd-module name="File/LocalFileLink" />
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
     * @name File/LocalFileLink
     * @public
     * @author Заляев А.В.
     */
    var LocalFileLink = /** @class */ (function () {
        /**
         * @param {String} fileLink Ссылка на файл
         * @param {*} [meta] Дополнительные мета-данные
         * @param {FileInfo} [fileInfo] Информация о файле
         * @constructor
         * @name File/LocalFileLink
         */
        function LocalFileLink(fileLink, meta, fileInfo) {
            this.fileLink = fileLink;
            this.meta = meta;
            this._fileInfo = fileInfo || {};
            if (!this._fileInfo.name) {
                /*
                 * Для ссылки на локальный файл, именем является часть пути до него после последнего слеша
                 */
                this._fileInfo.name = fileLink.replace(/.*(\\|\/)/, "");
            }
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
         * Возвращает дополнительную информацию по файлу
         * @return {*}
         * @method
         * @name File/LocalFileLink#getMeta
         */
        LocalFileLink.prototype.getMeta = function () {
            return this.meta || {};
        };
        /**
         * Возвращает информацию о файле, если такая имеется
         * @return {FileInfo}
         * @method
         * @name File/LocalFileLink#getFileInfo
         */
        LocalFileLink.prototype.getFileInfo = function () {
            return this._fileInfo || {};
        };
        /**
         * Возвращает имя файла
         * @return {String}
         * @method
         * @name File/LocalFileLink#getName
         */
        LocalFileLink.prototype.getName = function () {
            return this._fileInfo.name || "";
        };
        return LocalFileLink;
    }());
    return LocalFileLink;
});
