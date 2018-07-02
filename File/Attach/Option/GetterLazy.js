define("File/Attach/Option/GetterLazy", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Класс конфигурации {@link File/IResourceGetter}, передаваемый в {@link File/Attach},
     * позволяющий регистрировать динамично-загружаемые модули
     * @class File/Attach/Option/GetterLazy
     * @public
     * @see File/Attach
     * @see File/IResourceGetter
     * @author Заляев А.В.
     */
    var GetterLazyOption = /** @class */ (function () {
        /**
         * @cfg {String} Cсылка на модуль IResourceGetter
         * @name File/Attach/Option/GetterLazy#link
         */
        /**
         * @cfg {String} Тип
         * @name File/Attach/Option/GetterLazy#type
         */
        /**
         * @cfg {Object} Параметры вызова конструктора
         * @name File/Attach/Option/GetterLazy#options
         */
        /**
         *
         * @param {File/IResourceGetter} link Cсылка на модуль IResourceGetter
         * @param {String} type
         * @param {*} [options] Параметры вызова конструктора
         * @constructor
         * @see File/IResourceGetter
         */
        function GetterLazyOption(link, type, options) {
            this.link = link;
            this.type = type;
            this.options = options;
        }
        /**
         * Возвращает тип источника русусрса
         * @return {String}
         * @name File/Attach/Option/GetterLazy#getType
         */
        GetterLazyOption.prototype.getType = function () {
            return this.type;
        };
        /**
         * Возвращает ссылку на модуль IResourceGetter
         * @return {String}
         * @name File/Attach/Option/GetterLazy#getGetter
         */
        GetterLazyOption.prototype.getLink = function () {
            return this.link;
        };
        /**
         * Возвращает параметры вызова конструктора
         * @return {*}
         * @name File/Attach/GetterLazy#getOptions
         */
        GetterLazyOption.prototype.getOptions = function () {
            return this.options || {};
        };
        return GetterLazyOption;
    }());
    return GetterLazyOption;
});
