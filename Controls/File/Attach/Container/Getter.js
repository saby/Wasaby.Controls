define("Controls/File/Attach/Container/Getter", ["require", "exports", "Core/Deferred"], function (require, exports, Deferred) {
    "use strict";
    /**
     * Контейнер для работы с различными реализациями {@link Controls/File/IResourceGetter}
     * @class Controls/File/Attach/Container/Getter
     * @private
     * @see Controls/File/ResourceGetter/Base
     * @author Заляев А.В.
     */
    var GetterContainer = /** @class */ (function () {
        function GetterContainer() {
            this._getters = Object.create(null);
        }
        /**
         * Регестрирует источник ресурсов
         * @param {Controls/File/IResourceGetter} getter
         * @return {String} Имя модуля
         */
        GetterContainer.prototype.push = function (getter) {
            this._getters[getter.getType()] = getter;
        };
        /**
         * Метод асинхронного получения экземпляра {@link Controls/File/IResourceGetter}
         * @param {String} name Имя модуля
         * @return {Core/Deferred<Controls/File/IResourceGetter>}
         * @see Controls/File/IResourceGetter#getType
         */
        GetterContainer.prototype.get = function (name) {
            if (this._getters[name]) {
                return Deferred.success(this._getters[name]);
            }
            return Deferred.fail("ResourceGetter <" + name + "> is not registered");
        };
        /**
         * Зарегестрирован ли источник ресурсов в контейнере
         * @param {String} name Имя источника
         * @return {Boolean}
         * @see Controls/File/IResourceGetter#getType
         */
        GetterContainer.prototype.has = function (name) {
            return !!this._getters[name];
        };
        GetterContainer.prototype.destroy = function () {
            for (var name_1 in this._getters) {
                this._getters[name_1].destroy();
                delete this._getters[name_1];
            }
        };
        return GetterContainer;
    }());
    return GetterContainer;
});
