define("File/Error/Extension", ["require", "exports", "tslib", "File/Error"], function (require, exports, tslib_1, FileError) {
    "use strict";
    var MESSAGE = rk('Выбранный файл неверного типа');
    var getExtensions = function (extensions) {
        switch (extensions) {
            case 'audio': {
                return rk('формата аудио');
            }
            case 'video': {
                return rk('формата видео');
            }
            case 'image': {
                return rk('формата изображений');
            }
            default: {
                return rk('c расширением') + ': ' + extensions;
            }
        }
    };
    var getDetails = function (extensions) { return (rk('Ожидались файлы') + ' ' + getExtensions(extensions)); };
    /**
     * Ошибка несоответствия типа выбранного файла
     * @class
     * @name File/Error/Extension
     * @public
     * @extends File/Error
     */
    var ExtensionsError = /** @class */ (function (_super) {
        tslib_1.__extends(ExtensionsError, _super);
        function ExtensionsError(params) {
            var _this = _super.call(this, {
                message: MESSAGE,
                details: getDetails(params.extensions),
                fileName: params.fileName
            }) || this;
            /*
             * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
             */
            Object.setPrototypeOf(_this, ExtensionsError.prototype);
            _this.extensions = params.extensions;
            return _this;
        }
        return ExtensionsError;
    }(FileError));
    return ExtensionsError;
});
