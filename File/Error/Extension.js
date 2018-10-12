define("File/Error/Extension", ["require", "exports", "tslib", "File/Error", "Core/helpers/String/format", "i18n!File/Error/Extension"], function (require, exports, tslib_1, FileError, format) {
    "use strict";
    var MESSAGE = rk('Выбранный файл неверного типа');
    var DETAILS_FORMAT_TYPE = rk('Ожидались файлы формата $type$s$');
    var DETAILS_FORMAT_EXTENSIONS = rk('Ожидались файлы c расширением:');
    var getDetails = function (extensions) {
        if (['audio', 'video', 'image'].indexOf(extensions) >= 0) {
            return format({
                type: rk(extensions, 'FileError'),
            }, DETAILS_FORMAT_TYPE);
        }
        return DETAILS_FORMAT_EXTENSIONS + ' ' + extensions;
    };
    /**
     * Ошибка несоответствия типа выбранного файла
     * @class
     * @name File/Error/Extension
     * @public
     * @extends File/Error
     * @author Заляев А.В.
     */
    var ExtensionsError = /** @class */ (function (_super) {
        tslib_1.__extends(ExtensionsError, _super);
        function ExtensionsError(params) {
            var _this = _super.call(this, {
                message: MESSAGE,
                details: getDetails(params.extensions),
                fileName: params.fileName
            }) || this;
            _this.extensions = params.extensions;
            return _this;
        }
        return ExtensionsError;
    }(FileError));
    return ExtensionsError;
});
