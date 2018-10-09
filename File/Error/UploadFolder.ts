/// <amd-module name="File/Error/UploadFolder" />
import FileError = require('File/Error');

const MESSAGE = rk('Загрузка папок не поддерживается браузером');

type ErrorParam = {
    fileName: string;
}

/**
 * Ошибка невозможности загрузки браузером папки, полученной путём D&D
 * @class
 * @name File/Error/UploadFolder
 * @public
 * @extends File/Error
 */
class UploadFolderError extends FileError {
    public maxSize: number;
    constructor(params: ErrorParam) {
        super({
            message: MESSAGE,
            fileName: params.fileName
        });
        /*
         * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
         */
        Object.setPrototypeOf(this, UploadFolderError.prototype);
    }
}

export = UploadFolderError;
