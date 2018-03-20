/// <amd-module name="File/utils/ExtensionsError" />
define("File/utils/ExtensionsError", ["require", "exports", "tslib"], function (require, exports, tslib_1) {
    "use strict";
    var DEFAULT_MESSAGE = rk('Выбранный файл неверного типа');
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
    var ExtensionsError = /** @class */ (function (_super) {
        tslib_1.__extends(ExtensionsError, _super);
        function ExtensionsError(message, fileName) {
            var _this = _super.call(this) || this;
            /*
             * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
             */
            Object.setPrototypeOf(_this, ExtensionsError.prototype);
            if (!fileName) {
                fileName = message;
                message = DEFAULT_MESSAGE;
            }
            _this.message = message;
            _this.fileName = fileName;
            return _this;
        }
        return ExtensionsError;
    }(Error));
    return ExtensionsError;
});
