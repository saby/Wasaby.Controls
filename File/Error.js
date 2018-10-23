define("File/Error", ["require", "exports", "Core/core-classicExtend"], function (require, exports, classicExtend) {
    "use strict";
    /**
     * Базовый класс ошибки, возникающий при работе с ресурсами
     * @class
     * @name File/Error
     * @public
     * @extends Error
     * @author Заляев А.В.
     */
    var FileError = /** @class */ (function () {
        /**
         *
         * @param {String} message Текст ошибки
         * @param {String} fileName Имя файла, вызвавшего ошибку
         * @param {String} details Детальное описание ошибки.
         * @constructor
         */
        function FileError(_a) {
            var message = _a.message, fileName = _a.fileName, details = _a.details;
            this.name = 'FileError';
            this.message = message;
            this.fileName = fileName;
            this.details = details;
            this.stack = new Error().stack;
        }
        return FileError;
    }());
    /**
     * Error - является не совсем честным конструктором и при использовании записи эквивалентны
     * 1) var e = new Error('');
     * 2) var e = Error('');
     *
     * и typescript наследование от ошибки работает не совсем корректно:
     * class myError extends Error;
     * let e = new MyError();
     * e instanseof Error // => true
     * e instanseof MyError // => false
     *
     * Для решения этой проблемы предлагается после вызова super() использовать конструкцию вида:
     * Object.setPrototypeOf(this, MyError.prototype);
     *
     * Но такой подход не работает в IE т.к. setPrototypeOf там назначается через полифил и работает через __proto__,
     * который не работает в IE
     *
     * Поэтому наследуем FileError от ошибки через classicExtend.
     * При этом потеряем поле stack, которое присвоем себе из экземпляра ошибки, созданой в конструкторе FileError
     * И все наследники FileError могут быть наследованы без хака с setPrototypeOf
     */
    // tslint:disable-next-line:max-line-length
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    classicExtend(FileError, Error);
    return FileError;
});
