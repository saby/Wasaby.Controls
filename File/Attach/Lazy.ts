/// <amd-module name="File/Attach/Lazy" />
import Base = require("File/Attach/Base");
import CoreExtend = require('Core/core-simpleExtend');
import GetterContainerLazy = require("File/Attach/Container/GetterLazy");
import SourceContainerLazy = require("File/Attach/Container/SourceLazy");

/**
 * Класс, наследник Attach/Base, позволяющий регестрировать
 * динамично подгружаемые экземпляры {@link File/IResourceGetter} и {@link File/Attach/Source}
 * @public
 * @class File/Attach/Lazy
 * @extends File/Attach/Base
 * @author Заляев А.В.
 */
let Lazy  = CoreExtend.extend(Base, {
    constructor(){
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
    registerLazyGetter(name: string, link: string, options?) {
        return this._getterContainer.register(name, link, options);
    },
    /**
     * Ленивая регестрация ISource
     * @param {Function} fileType Конструктор обёртки над ресурсом
     * @param {String} link Ссылка на источник данных
     * @param {*} [options] Параметры вызова конструктора обёртки
     * @void
     */
    registerLazySource(fileType: Function, link: string, options?: any) {
        return this._sourceContainer.register(fileType, link, options);
    }
});
export = Lazy;
