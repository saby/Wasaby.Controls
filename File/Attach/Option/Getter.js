define("File/Attach/Option/Getter", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Класс конфигурации {@link File/IResourceGetter}, передаваемый в {@link File/Attach}
     * @class File/Attach/Option/ResourceGetter
     * @public
     * @see File/Attach
     * @see File/IResourceGetter
     * @author Заляев А.В.
     */
    var GetterOption = /** @class */ (function () {
        /**
         * @cfg {File/IResourceGetter} Экземпляр IResourceGetter
         * @name File/Attach/Option/ResourceGetter#getter
         */
        /**
         *
         * @param {File/IResourceGetter} getter Экземпляр IResourceGetter
         * @constructor
         * @see File/IResourceGetter
         */
        function GetterOption(getter) {
            this.getter = getter;
        }
        /**
         * Возвращает экземпляр IResourceGetter
         * @return {File/IResourceGetter}
         * @name File/Attach/Option/ResourceGetter#getGetter
         */
        GetterOption.prototype.getGetter = function () {
            return this.getter;
        };
        return GetterOption;
    }());
    return GetterOption;
});
