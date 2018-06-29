/// <amd-module name="File/Attach/Container/Getter" />
// dependency for types
import IContainer = require("File/Attach/Container/IContainer");
import {IResourceGetter} from 'File/IResourceGetter';
// real dependency
import Deferred = require("Core/Deferred");

/**
 * Контейнер для работы с различными реализациями {@link File/IResourceGetter}
 * @class File/Attach/Container/Getter
 * @private
 * @see File/ResourceGetter/Base
 * @author Заляев А.В.
 */
class GetterContainer implements IContainer<IResourceGetter> {
    /**
     * Экземпляры IResourceGetter
     * @private
     */
    private _getters: HashMap<IResourceGetter>;

    constructor() {
        this._getters = Object.create(null);
    }

    /**
     * Регестрирует источник ресурсов
     * @param {File/IResourceGetter} getter
     * @return {String} Имя модуля
     */
    push(getter: IResourceGetter) {
        this._getters[getter.getType()] = getter;
    }

    /**
     * Метод асинхронного получения экземпляра {@link File/IResourceGetter}
     * @param {String} name Имя модуля
     * @return {Core/Deferred.<File/IResourceGetter>}
     * @see File/IResourceGetter#getType
     */
    get(name: string): Deferred<IResourceGetter> {
        if (this._getters[name]) {
            return Deferred.success(this._getters[name]);
        }
        return Deferred.fail(`ResourceGetter <${name}> is not registered`);
    }

    /**
     * Зарегестрирован ли источник ресурсов в контейнере
     * @param {String} name Имя источника
     * @return {Boolean}
     * @see File/IResourceGetter#getType
     */
    has(name: string): boolean {
        return !!this._getters[name]
    }
    destroy() {
        for (let name in this._getters) {
            this._getters[name].destroy();
            delete this._getters[name]
        }
    }
}

export = GetterContainer;
