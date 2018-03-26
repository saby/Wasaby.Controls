/// <amd-module name="File/Attach/Option/ResourceGetter" />
define("File/Attach/Option/ResourceGetter", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Класс конфигурации {@link File/IResourceGetter}, передаваемый в {@link File/Attach}
     * @class File/Attach/Option/ResourceGetter
     * @public
     * @see File/Attach
     * @see File/IResourceGetter
     * @author Заляев А.В.
     */
    var ResourceGetterOption = /** @class */ (function () {
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
         * @param {String | File/IResourceGetter} getter Экземпляр IResourceGetter, либо ссылка на модуль
         * @param {String} name
         * @param {*} [options] Параметры вызова конструктора
         * @constructor
         * @see File/IResourceGetter
         */
        function ResourceGetterOption(getter, name, options) {
            this.getter = getter;
            this.name = name;
            this.options = options;
        }
        /**
         *
         * @return {String}
         * @name File/Attach/Option/ResourceGetter#getName
         */
        ResourceGetterOption.prototype.getName = function () {
            return this.name;
        };
        /**
         * Возвращает параметры вызова конструктора
         * @return {*}
         * @name File/Attach/Option/ResourceGetter#getOptions
         */
        ResourceGetterOption.prototype.getOptions = function () {
            return this.options;
        };
        /**
         * Возвращает экземпляр IResourceGetter, либо ссылку на модуль
         * @return {String | File/IResourceGetter}
         * @name File/Attach/Option/ResourceGetter#getGetter
         */
        ResourceGetterOption.prototype.getGetter = function () {
            return this.getter;
        };
        return ResourceGetterOption;
    }());
    return ResourceGetterOption;
});
