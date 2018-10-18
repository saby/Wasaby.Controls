/// <amd-module name="File/Error" />
import classicExtend = require('Core/core-classicExtend');

/**
 * @cfg {String} Текст ошибки
 * @name File/Error#message
 */
/**
 * @cfg {String} Имя файла, вызвавшего ошибку
 * @name File/Error#fileName
 */
/**
 * @cfg {String} Детальное описание ошибки.
 * @name File/Error#details
 */

type ErrorParam = {
    fileName: string;
    message: string;
    details?: string;
}
/**
 * Базовый класс ошибки, возникающий при работе с ресурсами
 * @class
 * @name File/Error
 * @public
 * @extends Error
 * @author Заляев А.В.
 */
class FileError {
    public name = 'FileError';
    public message: string;
    public fileName: string;
    public details: string;
    public stack: string;
    /**
     *
     * @param {String} message Текст ошибки
     * @param {String} fileName Имя файла, вызвавшего ошибку
     * @param {String} details Детальное описание ошибки.
     * @constructor
     */
    constructor({
        message,
        fileName,
        details
    }: ErrorParam) {
        this.message = message;
        this.fileName = fileName;
        this.details = details;
        this.stack = new Error().stack;
    }
}
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

export = FileError;
