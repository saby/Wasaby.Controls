define("File/Attach/Container/SourceLazy", ["require", "exports", "tslib", "File/Attach/Container/Source", "Core/Deferred", "Core/moduleStubs"], function (require, exports, tslib_1, SourceContainer, Deferred, moduleStubs) {
    "use strict";
    /**
     * Фильтрует массив обёрток над ISource по типу файла
     * @param {Array<Wrapper>} array
     * @param {File/IFileData} file
     * @return {Wrapper}
     * @private
     * @author Заляев А.В.
     */
    var instanceFilter = function (array, file) {
        return array.filter(function (wrapper) {
            return file instanceof wrapper.fileType;
        })[0];
    };
    /**
     * Класс для хранения экземпляров ISource по типам отправляеммых ресурсов
     * @class File/Attach/Container/SourceLazy
     * @extends File/Attach/Container/Source
     * @author Заляев А.В.
     * @private
     */
    var SourceContainerLazy = /** @class */ (function (_super) {
        tslib_1.__extends(SourceContainerLazy, _super);
        function SourceContainerLazy() {
            var _this = _super.call(this) || this;
            _this._lazyWrappers = [];
            _this._createWrappers = [];
            return _this;
        }
        /**
         * Ленивая егистрация источников данных для загрузки определённого типа ресурса
         * @param {File/IFileDataConstructor} fileType конструктор обёртки над ресурсом
         * @param {String} link Ссылка на источник данных
         * @param {*} options Параметры вызова конструктора обёртки
         * @see File/LocalFile
         * @see File/LocalFileLink
         * @see File/HttpFileLink
         */
        SourceContainerLazy.prototype.register = function (fileType, link, options) {
            this._lazyWrappers.push({
                fileType: fileType,
                link: link,
                options: options
            });
        };
        /**
         * Зарегестрирован ли для текущего ресурса источник данных
         * @param {File/IFileData} file
         * @return {boolean}
         * @see File/LocalFile
         * @see File/LocalFileLink
         * @see File/HttpFileLink
         */
        SourceContainerLazy.prototype.has = function (file) {
            return _super.prototype.has.call(this, file) || !!this._getLazyWrapper(file);
        };
        /**
         * Возвращает источник данных для ресурса
         * @param {File/IFileData} file
         * @return {Core/Deferred<ISource>}
         * @see File/LocalFile
         * @see File/LocalFileLink
         * @see File/HttpFileLink
         */
        SourceContainerLazy.prototype.get = function (file) {
            var _this = this;
            return _super.prototype.get.call(this, file).addErrback(function (error) {
                var lazyWrapper = _this._getLazyWrapper(file);
                if (!lazyWrapper) {
                    return error;
                }
                return _this._createSource(lazyWrapper);
            });
        };
        /**
         * Возвращает список зарегестрированый обёрток
         * @return {Array<File/IFileDataConstructor>}
         * @see File/LocalFile
         * @see File/LocalFileLink
         * @see File/HttpFileLink
         */
        SourceContainerLazy.prototype.getRegisteredResource = function () {
            return _super.prototype.getRegisteredResource.call(this).concat(this._lazyWrappers.map(function (wrapper) {
                return wrapper.fileType;
            }));
        };
        SourceContainerLazy.prototype._getLazyWrapper = function (file) {
            return instanceFilter(this._lazyWrappers, file);
        };
        SourceContainerLazy.prototype._createSource = function (wrapper) {
            var _this = this;
            var createWrapper = instanceFilter(this._createWrappers, wrapper.fileType);
            if (createWrapper) {
                return createWrapper.source.createDependent();
            }
            // Подгружаем и сохраняем инстанс ISource
            return moduleStubs.require("optional!" + wrapper.link).addCallback(function (modules) {
                if (!modules[0]) {
                    return Deferred.fail("FileSource \"" + wrapper.link + "\" is not supported in this project");
                }
                var source = new modules[0](wrapper.options);
                _this.push(source, wrapper.fileType);
                return source;
            }).addBoth(function (result) {
                // убираем найденную обёрку из списка ленивых
                _this._lazyWrappers = _this._lazyWrappers.filter(function (w) {
                    return w !== wrapper;
                });
                // так же чистим список ожидающх
                _this._createWrappers = _this._createWrappers.filter(function (w) {
                    return w !== createWrapper;
                });
                return result;
            });
        };
        SourceContainerLazy.prototype.destroy = function () {
            this._lazyWrappers = [];
            this._createWrappers = [];
            _super.prototype.destroy.call(this);
        };
        return SourceContainerLazy;
    }(SourceContainer));
    return SourceContainerLazy;
});
