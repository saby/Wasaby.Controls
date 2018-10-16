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
 * @author Заляев А.В.
 */
class UploadFolderError extends FileError {
    public maxSize: number;
    constructor(params: ErrorParam) {
        super({
            message: MESSAGE,
            fileName: params.fileName
        });
    }
}

export = UploadFolderError;
