/// <amd-module name="File/utils/ExtensionsError" />

const DEFAULT_MESSAGE = rk('Выбранный файл неверного типа');
/**
 * @cfg {String} Имя файла, вызвавшего ошибку
 * @name File/utils/ExtensionsError#fileName
 */

/**
 * Ошибка несоответствия типа выбранного файла
 * @class
 * @name File/utils/ExtensionsError
 * @public
 * @extends Error
 */
class ExtensionsError extends Error {
    public message: string;
    public fileName: string;
    constructor(message: string, fileName?: string) {
        super();
        /*
         * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
         */
        Object.setPrototypeOf(this, ExtensionsError.prototype);
        if (!fileName) {
            fileName = message;
            message = DEFAULT_MESSAGE;
        }
        this.message = message;
        this.fileName = fileName;
    }
}

export = ExtensionsError;
