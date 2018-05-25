/// <amd-module name="File/Error/MaxSize" />
import FileError = require('File/Error');

const MESSAGE = rk('Размер выбранного файла превышает максимально допустимый');

let getDetails = (fileName, size) => rk(`Файл ${fileName} превышает допустимый размер ${size}МБ`);
/**
 * @cfg {String} Максимально допустимый размер файла
 * @name File/Error/MaxSize#maxSize
 */

type ErrorParam = {
    fileName: string;
    maxSize: number;
    message?: string;
    details?: string;
}

/**
 * Ошибка превышения заданного размера выбранного файла
 * @class
 * @name File/Error/MaxSize
 * @public
 * @extends File/Error
 */
class MaxSizeError extends FileError {
    public maxSize: number;
    constructor(params: ErrorParam) {
        super({
            message: params.message || MESSAGE,
            details: params.details || getDetails(params.fileName, params.maxSize),
            fileName: params.fileName
        });
        /*
         * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
         */
        Object.setPrototypeOf(this, MaxSizeError.prototype);
        this.maxSize = params.maxSize;
    }
}

export = MaxSizeError;
