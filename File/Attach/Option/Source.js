define("File/Attach/Option/Source", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Класс конфигурации ISource, передаваемый в Attach
     * @class
     * @name File/Attach/Option/Source
     * @public
     * @see File/Attach
     * @author Заляев А.В.
     */
    var SourceOption = /** @class */ (function () {
        /**
         * @cfg {String} source Ссылка на модуль источника данных ISource
         * @see File/Attach/Source
         */
        /**
         * @cfg {FunctionConstructor} resourceType Конструктор обёртки над ресурсом
         * @see File/LocalFile
         * @see File/LocalFileLink
         * @see File/HttpFileLink
         */
        /**
         * @cfg {Object} options Объект параметров для конструктора ISource
         * @see File/Attach/Source
         */
        function SourceOption(source, resourceType, options) {
            this.source = source;
            this.resourceType = resourceType;
            this.options = options;
        }
        /**
         * Возвращает ссылку на модуль с регестрируемым источником данных
         * @return {string}
         * @name File/Attach/Option/Source#getSourceName
         */
        SourceOption.prototype.getSourceName = function () {
            return this.source;
        };
        /**
         * Параметры вызова конструктора
         * @return {*}
         * @name File/Attach/Option/Source#getOptions
         */
        SourceOption.prototype.getOptions = function () {
            return this.options;
        };
        /**
         * Возвращает конструктор ресурса, для которого будет зарегестрирован источник
         * @return {File/IResourceConstructor}
         * @name File/Attach/Option/Source#getResourceType
         */
        SourceOption.prototype.getResourceType = function () {
            return this.resourceType;
        };
        return SourceOption;
    }());
    return SourceOption;
});
