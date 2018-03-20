/// <amd-module name="Controls/File/Attach/Option/ResourceGetter" />

import {IResourceGetter} from "Controls/File/IResourceGetter";
/**
 * Класс конфигурации {@link Controls/File/IResourceGetter}, передаваемый в {@link Controls/File/Attach}
 * @class Controls/File/Attach/Option/ResourceGetter
 * @public
 * @see Controls/File/Attach
 * @see Controls/File/IResourceGetter
 * @author Заляев А.В.
 */
class ResourceGetterOption {
    /**
     * @cfg {String | Controls/File/IResourceGetter} Экземпляр IResourceGetter, либо ссылка на модуль
     * @name Controls/File/Attach/Option/ResourceGetter#getter
     */
    /**
     * @cfg {String} Экземпляр IResourceGetter, либо ссылка на модуль
     * @name Controls/File/Attach/Option/ResourceGetter#name
     */
    /**
     * @cfg {Object} Параметры вызова конструктора
     * @name Controls/File/Attach/Option/ResourceGetter#options
     */
    /**
     *
     * @param {String | Controls/File/IResourceGetter} getter Экземпляр IResourceGetter, либо ссылка на модуль
     * @param {String} name
     * @param {*} [options] Параметры вызова конструктора
     * @constructor
     * @see Controls/File/IResourceGetter
     */
    constructor (private getter: string | IResourceGetter, private name?: string, private options?: any) {}

    /**
     *
     * @return {String}
     * @name Controls/File/Attach/Option/ResourceGetter#getName
     */
    getName(): string {
        return this.name;
    }
    /**
     * Возвращает параметры вызова конструктора
     * @return {*}
     * @name Controls/File/Attach/Option/ResourceGetter#getOptions
     */
    getOptions(): any {
        return this.options;
    }
    /**
     * Возвращает экземпляр IResourceGetter, либо ссылку на модуль
     * @return {String | Controls/File/IResourceGetter}
     * @name Controls/File/Attach/Option/ResourceGetter#getGetter
     */
    getGetter(): string | IResourceGetter {
        return this.getter;
    }
}
export = ResourceGetterOption;