define("File/Error/MaxSize", ["require", "exports", "tslib", "File/Error", "Core/helpers/String/format", "i18n!File/Error/MaxSize"], function (require, exports, tslib_1, FileError, format) {
    "use strict";
    var MESSAGE = rk('Размер выбранного файла превышает максимально допустимый');
    var DETAILS = rk('Файл $fileName$s$ превышает допустимый размер $size$d$МБ');
    var getDetails = function (fileName, size) { return format({ fileName: fileName, size: size }, DETAILS); };
    /**
     * Ошибка превышения заданного размера выбранного файла
     * @class
     * @name File/Error/MaxSize
     * @public
     * @extends File/Error
     * @author Заляев А.В.
     */
    var MaxSizeError = /** @class */ (function (_super) {
        tslib_1.__extends(MaxSizeError, _super);
        function MaxSizeError(params) {
            var _this = _super.call(this, {
                message: params.message || MESSAGE,
                details: params.details || getDetails(params.fileName, params.maxSize),
                fileName: params.fileName
            }) || this;
            _this.maxSize = params.maxSize;
            return _this;
        }
        return MaxSizeError;
    }(FileError));
    return MaxSizeError;
});
