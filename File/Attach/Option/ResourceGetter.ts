/// <amd-module name="File/Attach/Option/ResourceGetter" />

import {IResourceGetter} from "File/IResourceGetter";
/**
 * Класс конфигурации {@link File/IResourceGetter}, передаваемый в {@link File/Attach}
 * @class File/Attach/Option/ResourceGetter
 * @public
 * @see File/Attach
 * @see File/IResourceGetter
 * @author Заляев А.В.
 */
class ResourceGetterOption {
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
     * @param {String | File/IResourceGetter} getter Экземпляр IResourceGetter, либо ссылка на модуль
     * @param {String} name
     * @param {*} [options] Параметры вызова конструктора
     * @constructor
     * @see File/IResourceGetter
     */
    constructor (private getter: string | IResourceGetter, private name?: string, private options?: any) {}

    /**
     *
     * @return {String}
     * @name File/Attach/Option/ResourceGetter#getName
     */
    getName(): string {
        return this.name;
    }
    /**
     * Возвращает параметры вызова конструктора
     * @return {*}
     * @name File/Attach/Option/ResourceGetter#getOptions
     */
    getOptions(): any {
        return this.options;
    }
    /**
     * Возвращает экземпляр IResourceGetter, либо ссылку на модуль
     * @return {String | File/IResourceGetter}
     * @name File/Attach/Option/ResourceGetter#getGetter
     */
    getGetter(): string | IResourceGetter {
        return this.getter;
    }
}
export = ResourceGetterOption;