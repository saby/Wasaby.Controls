define("File/Error/MaxSize", ["require", "exports", "tslib", "File/Error"], function (require, exports, tslib_1, FileError) {
    "use strict";
    var MESSAGE = rk('Размер выбранного файла превышает максимально допустимый');
    var getDetails = function (fileName, size) { return rk("\u0424\u0430\u0439\u043B " + fileName + " \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0435\u0442 \u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 " + size + "\u041C\u0411"); };
    /**
     * Ошибка превышения заданного размера выбранного файла
     * @class
     * @name File/Error/MaxSize
     * @public
     * @extends File/Error
     */
    var MaxSizeError = /** @class */ (function (_super) {
        tslib_1.__extends(MaxSizeError, _super);
        function MaxSizeError(params) {
            var _this = _super.call(this, {
                message: MESSAGE,
                details: getDetails(params.fileName, params.maxSize),
                fileName: params.fileName
            }) || this;
            /*
             * https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
             */
            Object.setPrototypeOf(_this, MaxSizeError.prototype);
            _this.maxSize = params.maxSize;
            return _this;
        }
        return MaxSizeError;
    }(FileError));
    return MaxSizeError;
});
