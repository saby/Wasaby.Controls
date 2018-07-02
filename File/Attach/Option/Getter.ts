/// <amd-module name="File/Attach/Option/Getter" />
import {IResourceGetter} from 'File/IResourceGetter';
/**
 * Класс конфигурации {@link File/IResourceGetter}, передаваемый в {@link File/Attach}
 * @class File/Attach/Option/ResourceGetter
 * @public
 * @see File/Attach
 * @see File/IResourceGetter
 * @author Заляев А.В.
 */
class GetterOption {
    /**
     * @cfg {File/IResourceGetter} Экземпляр IResourceGetter
     * @name File/Attach/Option/ResourceGetter#getter
     */
    /**
     *
     * @param {File/IResourceGetter} getter Экземпляр IResourceGetter
     * @constructor
     * @see File/IResourceGetter
     */
    constructor (private getter: IResourceGetter) {}
    /**
     * Возвращает экземпляр IResourceGetter
     * @return {File/IResourceGetter}
     * @name File/Attach/Option/ResourceGetter#getGetter
     */
    getGetter(): IResourceGetter {
        return this.getter;
    }
}
export = GetterOption;
