/// <amd-module name="Controls/File/Attach/Container/Getter" />
// dependency for types
import IContainer = require("Controls/File/Attach/Container/IContainer");
import {IResourceGetter} from "Controls/File/IResourceGetter";
// real dependency
import Deferred = require("Core/Deferred");

/**
 * Контейнер для работы с различными реализациями {@link Controls/File/IResourceGetter}
 * @class Controls/File/Attach/Container/Getter
 * @private
 * @see Controls/File/ResourceGetter/Base
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
     * @param {Controls/File/IResourceGetter} getter
     * @return {String} Имя модуля
     */
    push(getter: IResourceGetter) {
        this._getters[getter.getType()] = getter;
    }

    /**
     * Метод асинхронного получения экземпляра {@link Controls/File/IResourceGetter}
     * @param {String} name Имя модуля
     * @return {Core/Deferred<Controls/File/IResourceGetter>}
     * @see Controls/File/IResourceGetter#getType
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
     * @see Controls/File/IResourceGetter#getType
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
