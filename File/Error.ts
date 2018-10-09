/// <amd-module name="File/Error" />
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
 * Ошибка файла
 * @class
 * @name File/Error
 * @public
 * @extends Error
 */
class FileError extends Error {
    public message: string;
    public fileName: string;
    public details: string;
    constructor({
        message,
        fileName,
        details
    }: ErrorParam) {
        super();
        /*
         * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
         */
        Object.setPrototypeOf(this, FileError.prototype);
        this.message = message;
        this.fileName = fileName;
        this.details = details;
    }
}

export = FileError;
