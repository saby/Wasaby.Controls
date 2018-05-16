define("File/Error/UnknownType", ["require", "exports", "tslib", "File/Error"], function (require, exports, tslib_1, FileError) {
    "use strict";
    var MESSAGE = rk('Неизвестный тип файла');
    /**
     * Ошибка превышения заданного размера выбранного файла
     * @class
     * @name File/Error/UnknownType
     * @public
     * @extends File/Error
     */
    var UnknownTypeError = /** @class */ (function (_super) {
        tslib_1.__extends(UnknownTypeError, _super);
        function UnknownTypeError(params) {
            var _this = _super.call(this, {
                message: MESSAGE,
                fileName: params.fileName
            }) || this;
            /*
             * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
             */
            Object.setPrototypeOf(_this, UnknownTypeError.prototype);
            return _this;
        }
        return UnknownTypeError;
    }(FileError));
    return UnknownTypeError;
});
