/// <amd-module name="File/Error" />

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
class FileError extends Error {
    public message: string;
    public fileName: string;
    public details: string;
    /**
     *
     * @params {String} message Текст ошибки
     * @params {String} fileName Имя файла, вызвавшего ошибку
     * @params {String} details Детальное описание ошибки.
     * @constructor
     * @name File/Error
     */
    constructor({
        message,
        fileName,
        details
    }: ErrorParam) {
        super();
        // tslint:disable-next-line:max-line-length
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, FileError.prototype);
        this.message = message;
        this.fileName = fileName;
        this.details = details;
    }
}

export = FileError;
