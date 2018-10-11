define("File/Error/UnknownType", ["require", "exports", "tslib", "File/Error"], function (require, exports, tslib_1, FileError) {
    "use strict";
    var MESSAGE = rk('Неизвестный тип файла');
    /**
     * Ошибка, когда не смогли определить тип файла
     * @class
     * @name File/Error/UnknownType
     * @public
     * @extends File/Error
     */
    var UnknownTypeError = /** @class */ (function (_super) {
        tslib_1.__extends(UnknownTypeError, _super);
        function UnknownTypeError(params) {
            return _super.call(this, {
                message: MESSAGE,
                fileName: params.fileName
            }) || this;
        }
        return UnknownTypeError;
    }(FileError));
    return UnknownTypeError;
});
