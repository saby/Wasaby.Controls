/// <amd-module name="File/Attach/Lazy" />
import Base = require("File/Attach/Base");
import GetterContainerLazy = require("File/Attach/Container/GetterLazy");
import SourceContainerLazy = require("File/Attach/Container/SourceLazy");
import {IResourceGetter} from "File/IResourceGetter";
import {IResourceConstructor} from "File/IResource";
import {IGetterContainerLazy, ISourceContainerLazy} from 'File/Attach/IContainer';

/**
 * Класс, наследник Attach/Base, позволяющий регестрировать
 * динамично подгружаемые экземпляры {@link File/IResourceGetter} и {@link File/Attach/Source}
 * @public
 * @class File/Attach/Lazy
 * @extends File/Attach/Base
 * @author Заляев А.В.
 */
class Lazy extends Base {
    protected _getterContainer: IGetterContainerLazy;
    protected _sourceContainer: ISourceContainerLazy;
    constructor(opt){
        super(opt);
        this._getterContainer = new GetterContainerLazy();
        this._sourceContainer = new SourceContainerLazy();
    }
    /**
     * Ленивая регестрация экземпляров IResourceGetter, для получения файлов
     * @param {String} name Имя модуля
     * @param {String} link Сылка на модуль
     * @param {*} [options] Параметры вызова конструктора
     * @void
     */
    registerLazyGetter(name: string, link: string, options?) {
        return this._getterContainer.register(name, link, options);
    }
    /**
     * Ленивая регестрация ISource
     * @param {File/IResourceConstructor} fileType Конструктор обёртки над ресурсом
     * @param {String} link Ссылка на источник данных
     * @param {*} [options] Параметры вызова конструктора обёртки
     * @void
     */
    registerLazySource(fileType: IResourceConstructor, link: string, options?: any) {
        return this._sourceContainer.register(fileType, link, options);
    }
}

export = Lazy;
