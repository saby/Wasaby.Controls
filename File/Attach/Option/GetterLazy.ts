/// <amd-module name="File/Attach/Option/GetterLazy" />
import {Option} from 'File/Attach/Option';

/**
 * Класс конфигурации {@link File/IResourceGetter}, передаваемый в {@link File/Attach},
 * позволяющий регистрировать динамично-загружаемые модули
 * @class File/Attach/Option/GetterLazy
 * @public
 * @see File/Attach
 * @see File/IResourceGetter
 * @author Заляев А.В.
 */
class GetterLazyOption {
    /**
     * @cfg {String} Cсылка на модуль IResourceGetter
     * @name File/Attach/Option/GetterLazy#link
     */

    /**
     * @cfg {String} Тип
     * @name File/Attach/Option/GetterLazy#type
     */

    /**
     * @cfg {Object} Параметры вызова конструктора
     * @name File/Attach/Option/GetterLazy#options
     */

    /**
     *
     * @param {File/IResourceGetter} link Cсылка на модуль IResourceGetter
     * @param {String} type
     * @param {*} [options] Параметры вызова конструктора
     * @constructor
     * @see File/IResourceGetter
     */
    constructor (private link: string, private type: string, protected options?: object) {}

    /**
     * Возвращает тип источника русусрса
     * @return {String}
     * @name File/Attach/Option/GetterLazy#getType
     */
    getType(): string {
        return this.type;
    }

    /**
     * Возвращает ссылку на модуль IResourceGetter
     * @return {String}
     * @name File/Attach/Option/GetterLazy#getGetter
     */
    getLink(): string {
        return this.link;
    }

    /**
     * Возвращает параметры вызова конструктора
     * @return {*}
     * @name File/Attach/GetterLazy#getOptions
     */
    getOptions(): any {
        return this.options || {};
    }
}

export = GetterLazyOption;
