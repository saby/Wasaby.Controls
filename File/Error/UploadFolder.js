define("File/Error/UploadFolder", ["require", "exports", "tslib", "File/Error"], function (require, exports, tslib_1, FileError) {
    "use strict";
    var MESSAGE = rk('Загрузка папок не поддерживается браузером');
    /**
     * Ошибка превышения заданного размера выбранного файла
     * @class
     * @name File/Error/UploadFolder
     * @public
     * @extends File/Error
     */
    var UploadFolderError = /** @class */ (function (_super) {
        tslib_1.__extends(UploadFolderError, _super);
        function UploadFolderError(params) {
            var _this = _super.call(this, {
                message: MESSAGE,
                fileName: params.fileName
            }) || this;
            /*
             * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
             */
            Object.setPrototypeOf(_this, UploadFolderError.prototype);
            return _this;
        }
        return UploadFolderError;
    }(FileError));
    return UploadFolderError;
});
