define("File/Attach/Lazy", ["require", "exports", "tslib", "File/Attach/Base", "File/Attach/Container/GetterLazy", "File/Attach/Container/SourceLazy"], function (require, exports, tslib_1, Base, GetterContainerLazy, SourceContainerLazy) {
    "use strict";
    /**
     * Класс, наследник Attach/Base, позволяющий регестрировать
     * динамично подгружаемые экземпляры {@link File/IResourceGetter} и {@link File/Attach/Source}
     * @public
     * @class File/Attach/Lazy
     * @extends File/Attach/Base
     * @author Заляев А.В.
     */
    var Lazy = /** @class */ (function (_super) {
        tslib_1.__extends(Lazy, _super);
        function Lazy(opt) {
            var _this = _super.call(this, opt) || this;
            _this._getterContainer = new GetterContainerLazy();
            _this._sourceContainer = new SourceContainerLazy();
            return _this;
        }
        /**
         * Ленивая регестрация экземпляров IResourceGetter, для получения файлов
         * @param {String} name Имя модуля
         * @param {String} link Сылка на модуль
         * @param {*} [options] Параметры вызова конструктора
         * @void
         */
        Lazy.prototype.registerLazyGetter = function (name, link, options) {
            return this._getterContainer.register(name, link, options);
        };
        /**
         * Ленивая регестрация ISource
         * @param {File/IResourceConstructor} fileType Конструктор обёртки над ресурсом
         * @param {String} link Ссылка на источник данных
         * @param {*} [options] Параметры вызова конструктора обёртки
         * @void
         */
        Lazy.prototype.registerLazySource = function (fileType, link, options) {
            return this._sourceContainer.register(fileType, link, options);
        };
        return Lazy;
    }(Base));
    return Lazy;
});
