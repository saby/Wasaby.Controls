define("File/Error/UploadFolder", ["require", "exports", "tslib", "File/Error"], function (require, exports, tslib_1, FileError) {
    "use strict";
    var MESSAGE = rk('Загрузка папок не поддерживается браузером');
    /**
     * Ошибка невозможности загрузки браузером папки, полученной путём D&D
     * @class
     * @name File/Error/UploadFolder
     * @public
     * @extends File/Error
     * @author Заляев А.В.
     */
    var UploadFolderError = /** @class */ (function (_super) {
        tslib_1.__extends(UploadFolderError, _super);
        function UploadFolderError(params) {
            return _super.call(this, {
                message: MESSAGE,
                fileName: params.fileName
            }) || this;
        }
        return UploadFolderError;
    }(FileError));
    return UploadFolderError;
});
