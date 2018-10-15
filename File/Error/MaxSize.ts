/// <amd-module name="File/Error/MaxSize" />
import FileError = require('File/Error');
import format = require('Core/helpers/String/format');
import 'i18n!File/Error/MaxSize';

const MESSAGE = rk('Размер выбранного файла превышает максимально допустимый');
const DETAILS = rk('Файл $fileName$s$ превышает допустимый размер $size$d$МБ');

let getDetails = (fileName, size) => format({fileName, size}, DETAILS);
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
 * @author Заляев А.В.
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
