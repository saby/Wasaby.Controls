define("File/Attach/Model", ["require", "exports", "WS.Data/Entity/Model", "WS.Data/Di"], function (require, exports, DataModel, Di) {
    "use strict";
    /**
     * Модуль с результатом загрузки ресурса на сервис
     * @class
     * @name File/Attach/Model
     * @extends WS.Data/Entity/Model
     * @public
     */
    var Model = DataModel.extend({
        /**
         * @cfg {File/IResource} Загружаемый ресурс
         * @name File/Attach/Model#origin
         */
        _$origin: null,
        constructor: function FileModel(options) {
            FileModel.superclass.constructor.call(this, options);
            if (!options.origin) {
                throw new Error('argument "origin" in required');
            }
            this._$origin = options.origin;
        },
        /**
         * Возвращает оригинал загружаемого ресурса
         * @return {File/IResource}
         */
        getOrigin: function () {
            return this._$origin;
        },
        /**
         * Возвращает имя загружаемого ресурса
         * @return {String}
         */
        getName: function () {
            return this._$origin.getName();
        }
    });
    Di.register('file.model', Model);
    return Model;
});
