/// <amd-module name="File/Error/Extension" />
import FileError = require('File/Error');
import format = require('Core/helpers/String/format');
import 'i18n!File/Error/Extension';

const MESSAGE = rk('Выбранный файл неверного типа');
const DETAILS_FORMAT_TYPE = rk('Ожидались файлы формата $type$s$');
const DETAILS_FORMAT_EXTENSIONS = rk('Ожидались файлы c расширением:');

let getDetails = (extensions) => {
    if (['audio', 'video', 'image'].indexOf(extensions) >= 0) {
        return format({
            type: rk(extensions, 'FileError'),
        }, DETAILS_FORMAT_TYPE);
    }
    return DETAILS_FORMAT_EXTENSIONS + ' ' + extensions;
};
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
 * @author Заляев А.В.
 */
class ExtensionsError extends FileError {
    public extensions: string;
    constructor(params: ErrorParam) {
        super({
            message: MESSAGE,
            details: getDetails(params.extensions),
            fileName: params.fileName
        });
        this.extensions = params.extensions;
    }
}

export = ExtensionsError;
