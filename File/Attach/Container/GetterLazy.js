define("File/Attach/Container/GetterLazy", ["require", "exports", "tslib", "Core/Deferred", "Core/moduleStubs", "File/Attach/Container/Getter"], function (require, exports, tslib_1, Deferred, moduleStubs, GetterContainer) {
    "use strict";
    /**
     * Контейнер для работы с различными реализациями {@link File/IResourceGetter},
     * позволяющий работать посредством ленивой подгрузки
     * @class File/Attach/Container/GetterLazy
     * @private
     * @see File/IResourceGetter
     * @author Заляев А.В.
     */
    var GetterContainerLazy = /** @class */ (function (_super) {
        tslib_1.__extends(GetterContainerLazy, _super);
        function GetterContainerLazy() {
            var _this = _super.call(this) || this;
            _this._links = Object.create(null);
            _this._options = Object.create(null);
            return _this;
        }
        /**
         * Метод асинхронного получения экземпляра IResourceGetter
         * @param {String} name Имя модуля
         * @return {Core/Deferred.<File/IResourceGetter>}
         * @see File/IResourceGetter#getType
         */
        GetterContainerLazy.prototype.get = function (name) {
            var _this = this;
            return _super.prototype.get.call(this, name).addErrback(function (error) {
                if (!_this._links[name]) {
                    return error;
                }
                return moduleStubs.require("optional!" + _this._links[name]);
            }).addCallback(function (_a) {
                var ResourceGetter = _a[0];
                delete _this._links[name];
                if (!ResourceGetter) {
                    return Deferred.fail("ResourceGetter \"" + name + "\" is not supported in this project");
                }
                var getter = new ResourceGetter(_this._options[name]);
                if (getter.getType() !== name) {
                    return Deferred.fail("The name \"" + name + "\" is incorrectly specified when registering a dynamic dependency \"" + getter.getType() + "\"");
                }
                _this.push(getter);
                return getter;
            });
        };
        /**
         * Зарегестрирован ли источник ресурсов в контейнере
         * @param {String} name Имя источника
         * @return {Boolean}
         * @see File/IResourceGetter
         */
        GetterContainerLazy.prototype.has = function (name) {
            return _super.prototype.has.call(this, name) || !!this._links[name];
        };
        /**
         * Регистрация ссылки для последующей ленивой загрузки
         * @param {String} name Имя модуля
         * @param {String} link Ссылка на модуль
         * @param {} options Параметры для конструирования
         * @see File/IResourceGetter
         */
        GetterContainerLazy.prototype.register = function (name, link, options) {
            this._links[name] = link;
            this._options[name] = options;
        };
        GetterContainerLazy.prototype.destroy = function () {
            for (var name_1 in this._links) {
                delete this._links[name_1];
                delete this._options[name_1];
            }
            _super.prototype.destroy.call(this);
        };
        return GetterContainerLazy;
    }(GetterContainer));
    return GetterContainerLazy;
});
