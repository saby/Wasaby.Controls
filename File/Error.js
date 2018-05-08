/// <amd-module name="File/Error" />
/**
 * @cfg {String} Текст ошибки
 * @name File/Error#message
 */
/**
 * @cfg {String} Имя файла, вызвавшего ошибку
 * @name File/Error#fileName
 */
/**
 * @cfg {String} Детальное описание ошибки.
 * @name File/Error#details
 */
define("File/Error", ["require", "exports", "tslib"], function (require, exports, tslib_1) {
    "use strict";
    /**
     * Ошибка файла
     * @class
     * @name File/Error
     * @public
     * @extends Error
     */
    var FileError = /** @class */ (function (_super) {
        tslib_1.__extends(FileError, _super);
        function FileError(_a) {
            var message = _a.message, fileName = _a.fileName, details = _a.details;
            var _this = _super.call(this) || this;
            /*
             * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
             */
            Object.setPrototypeOf(_this, FileError.prototype);
            _this.message = message;
            _this.fileName = fileName;
            _this.details = details;
            return _this;
        }
        return FileError;
    }(Error));
    return FileError;
});
