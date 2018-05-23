/// <amd-module name="File/Error/Extension" />
import FileError = require('File/Error');

const MESSAGE = rk('Выбранный файл неверного типа');

let getExtensions = (extensions) => {
    switch (extensions){
        case 'audio': {
            return rk('формата аудио')
        }
        case 'video': {
            return rk('формата видео')
        }
        case 'image': {
            return rk('формата изображений')
        }
        default: {
            return rk('c расширением') + ': ' + extensions
        }
    }
};
let getDetails = (extensions) => (rk('Ожидались файлы') + ' ' + getExtensions(extensions));
/**
 * @cfg {String} Имя файла, вызвавшего ошибку
 * @name File/Error/Extension#extensions
 */

type ErrorParam = {
    extensions: string;
    fileName: string;
}

/**
 * Ошибка несоответствия типа выбранного файла
 * @class
 * @name File/Error/Extension
 * @public
 * @extends File/Error
 */
class ExtensionsError extends FileError {
    public extensions: string;
    constructor(params: ErrorParam) {
        super({
            message: MESSAGE,
            details: getDetails(params.extensions),
            fileName: params.fileName
        });
        /*
         * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
         */
        Object.setPrototypeOf(this, ExtensionsError.prototype);
        this.extensions = params.extensions;
    }
}

export = ExtensionsError;
