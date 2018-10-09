define("File/Decorator/isDestroyed", ["require", "exports", "Core/Deferred"], function (require, exports, Deferred) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var getMessage = function (method) { return "method \"" + method + "\" can not be used after destroy component"; };
    /**
     * Декоратор, проверяющий задестроен ли компонент
     * @name File/Decorator/isDestroyed#isDestroyed
     */
    exports.isDestroyed = function (target, propertyKey, descriptor) {
        var origin = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.isDestroyed && this.isDestroyed()) {
                throw new Error(getMessage(propertyKey));
            }
            return origin.apply(this, arguments);
        };
        return descriptor;
    };
    /**
     * Декоратор асинхронной функции, проверяющий задестроен ли компонент
     * @name File/Decorator/isDestroyed#isDestroyedAsync
     */
    exports.isDestroyedAsync = function (target, propertyKey, descriptor) {
        var origin = descriptor.value;
        descriptor.value = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (this.isDestroyed && this.isDestroyed()) {
                return Deferred.fail(getMessage(propertyKey));
            }
            return origin.apply(this, arguments);
        };
        return descriptor;
    };
});
