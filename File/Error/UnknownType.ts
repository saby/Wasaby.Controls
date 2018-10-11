/// <amd-module name="File/Error/UnknownType" />
import FileError = require('File/Error');

const MESSAGE = rk('Неизвестный тип файла');

type ErrorParam = {
    fileName: string;
}

/**
 * Ошибка невозможности определения типа файла
 * @class
 * @name File/Error/UnknownType
 * @public
 * @extends File/Error
 * @author Заляев А.В.
 */
class UnknownTypeError extends FileError {
    public maxSize: number;
    constructor(params: ErrorParam) {
        super({
            message: MESSAGE,
            fileName: params.fileName
        });
    }
}

export = UnknownTypeError;
