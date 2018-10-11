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
        this.maxSize = params.maxSize;
    }
}

export = MaxSizeError;
