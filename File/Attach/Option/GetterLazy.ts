/// <amd-module name="File/Attach/Option/GetterLazy" />
import {Option} from 'File/Attach/Option';
/**
 * Класс конфигурации {@link File/IResourceGetter}, передаваемый в {@link File/Attach}
 * @class File/Attach/Option/ResourceGetter
 * @public
 * @see File/Attach
 * @see File/IResourceGetter
 * @author Заляев А.В.
 */
export class GetterLazy extends Option {
    /**
     * @cfg {String | File/IResourceGetter} Экземпляр IResourceGetter, либо ссылка на модуль
     * @name File/Attach/Option/ResourceGetter#getter
     */
    /**
     * @cfg {String} Экземпляр IResourceGetter, либо ссылка на модуль
     * @name File/Attach/Option/ResourceGetter#name
     */
    /**
     * @cfg {Object} Параметры вызова конструктора
     * @name File/Attach/Option/ResourceGetter#options
     */
    /**
     *
     * @param {File/IResourceGetter} link Экземпляр IResourceGetter, либо ссылка на модуль
     * @param {String} type
     * @param {*} [options] Параметры вызова конструктора
     * @constructor
     * @see File/IResourceGetter
     */
    constructor (private link: string, private type: string, protected options?: object) {
        super();
    }

    /**
     *
     * @return {String}
     * @name File/Attach/Option/ResourceGetter#getName
     */
    getType(): string {
        return this.type;
    }
    /**
     * Возвращает экземпляр IResourceGetter, либо ссылку на модуль
     * @return {String | File/IResourceGetter}
     * @name File/Attach/Option/ResourceGetter#getGetter
     */
    getLink(): string {
        return this.link;
    }
}
