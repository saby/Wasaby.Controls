define("File/Attach/Option/GetterLazy", ["require", "exports", "tslib", "File/Attach/Option"], function (require, exports, tslib_1, Option_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Класс конфигурации {@link File/IResourceGetter}, передаваемый в {@link File/Attach}
     * @class File/Attach/Option/ResourceGetter
     * @public
     * @see File/Attach
     * @see File/IResourceGetter
     * @author Заляев А.В.
     */
    var GetterLazy = /** @class */ (function (_super) {
        tslib_1.__extends(GetterLazy, _super);
        /**
         * @cfg {String | File/IResourceGetter} Экземпляр IResourceGetter, либо ссылка на модуль
         * @name File/Attach/Option/ResourceGetter#getter
         */
        /**
         * @cfg {String} Экземпляр IResourceGetter, либо ссылка на модуль
         * @name File/Attach/Option/ResourceGetter#name
         */
        /**
         * @cfg {Object} Параметры вызова конструктора
         * @name File/Attach/Option/ResourceGetter#options
         */
        /**
         *
         * @param {File/IResourceGetter} link Экземпляр IResourceGetter, либо ссылка на модуль
         * @param {String} type
         * @param {*} [options] Параметры вызова конструктора
         * @constructor
         * @see File/IResourceGetter
         */
        function GetterLazy(link, type, options) {
            var _this = _super.call(this) || this;
            _this.link = link;
            _this.type = type;
            _this.options = options;
            return _this;
        }
        /**
         *
         * @return {String}
         * @name File/Attach/Option/ResourceGetter#getName
         */
        GetterLazy.prototype.getType = function () {
            return this.type;
        };
        /**
         * Возвращает экземпляр IResourceGetter, либо ссылку на модуль
         * @return {String | File/IResourceGetter}
         * @name File/Attach/Option/ResourceGetter#getGetter
         */
        GetterLazy.prototype.getLink = function () {
            return this.link;
        };
        return GetterLazy;
    }(Option_1.Option));
    exports.GetterLazy = GetterLazy;
});
