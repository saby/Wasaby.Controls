/// <amd-module name="Controls/File/Attach/Option/ResourceGetter" />
define("Controls/File/Attach/Option/ResourceGetter", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Класс конфигурации {@link Controls/File/IResourceGetter}, передаваемый в {@link Controls/File/Attach}
     * @class Controls/File/Attach/Option/ResourceGetter
     * @public
     * @see Controls/File/Attach
     * @see Controls/File/IResourceGetter
     * @author Заляев А.В.
     */
    var ResourceGetterOption = /** @class */ (function () {
        /**
         * @cfg {String | Controls/File/IResourceGetter} Экземпляр IResourceGetter, либо ссылка на модуль
         * @name Controls/File/Attach/Option/ResourceGetter#getter
         */
        /**
         * @cfg {String} Экземпляр IResourceGetter, либо ссылка на модуль
         * @name Controls/File/Attach/Option/ResourceGetter#name
         */
        /**
         * @cfg {Object} Параметры вызова конструктора
         * @name Controls/File/Attach/Option/ResourceGetter#options
         */
        /**
         *
         * @param {String | Controls/File/IResourceGetter} getter Экземпляр IResourceGetter, либо ссылка на модуль
         * @param {String} name
         * @param {*} [options] Параметры вызова конструктора
         * @constructor
         * @see Controls/File/IResourceGetter
         */
        function ResourceGetterOption(getter, name, options) {
            this.getter = getter;
            this.name = name;
            this.options = options;
        }
        /**
         *
         * @return {String}
         * @name Controls/File/Attach/Option/ResourceGetter#getName
         */
        ResourceGetterOption.prototype.getName = function () {
            return this.name;
        };
        /**
         * Возвращает параметры вызова конструктора
         * @return {*}
         * @name Controls/File/Attach/Option/ResourceGetter#getOptions
         */
        ResourceGetterOption.prototype.getOptions = function () {
            return this.options;
        };
        /**
         * Возвращает экземпляр IResourceGetter, либо ссылку на модуль
         * @return {String | Controls/File/IResourceGetter}
         * @name Controls/File/Attach/Option/ResourceGetter#getGetter
         */
        ResourceGetterOption.prototype.getGetter = function () {
            return this.getter;
        };
        return ResourceGetterOption;
    }());
    return ResourceGetterOption;
});
