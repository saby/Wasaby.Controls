define("Controls/File/Attach/Lazy", ["require", "exports", "Controls/File/Attach/Base", "Core/core-simpleExtend", "Controls/File/Attach/Container/GetterLazy", "Controls/File/Attach/Container/SourceLazy"], function (require, exports, Base, CoreExtend, GetterContainerLazy, SourceContainerLazy) {
    "use strict";
    /**
     * Класс, наследник Attach/Base, позволяющий регестрировать динамично подгружаемые экземпляры {@link Controls/File/IResourceGetter} и {@link WS.Data/Source/ISource}
     * @public
     * @class Controls/File/Attach/Lazy
     * @extends Controls/File/Attach/Base
     * @author Заляев А.В.
     */
    var Lazy = CoreExtend.extend(Base, {
        constructor: function () {
            Lazy.superclass.constructor.apply(this, arguments);
            this._getterContainer = new GetterContainerLazy();
            this._sourceContainer = new SourceContainerLazy();
        },
        /**
         * Ленивая регестрация экземпляров IResourceGetter, для получения файлов
         * @param {String} name Имя модуля
         * @param {String} link Сылка на модуль
         * @param {*} [options] Параметры вызова конструктора
         * @void
         */
        registerLazyGetter: function (name, link, options) {
            return this._getterContainer.register(name, link, options);
        },
        /**
         * Ленивая регестрация ISource
         * @param {Function} fileType Конструктор обёртки над ресурсом
         * @param {String} link Ссылка на источник данных
         * @param {*} [options] Параметры вызова конструктора обёртки
         * @void
         */
        registerLazySource: function (fileType, link, options) {
            return this._sourceContainer.register(fileType, link, options);
        }
    });
    return Lazy;
});
