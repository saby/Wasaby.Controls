define("File/Attach/Option", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-module name="File/Attach/Option" />
    /**
     * Класс конфигурации передаваемый в {@link File/Attach}
     * @class File/Attach/Option
     * @public
     * @abstract
     * @see File/Attach
     * @author Заляев А.В.
     */
    var Option = /** @class */ (function () {
        function Option() {
        }
        /**
         * Возвращает параметры вызова конструктора
         * @return {*}
         * @name File/Attach/Option#getOptions
         */
        Option.prototype.getOptions = function () {
            return this.options;
        };
        return Option;
    }());
    exports.Option = Option;
});
