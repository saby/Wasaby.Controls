/// <amd-module name="File/Attach/Model" />
import DataModel = require("WS.Data/Entity/Model");
import Di = require("WS.Data/Di");
import {IResource} from "File/IResource";
import {IFileModel} from "File/Attach/IModel";

/**
 * Модуль с результатом загрузки ресурса на сервис
 * @class
 * @name File/Attach/Model
 * @extends WS.Data/Entity/Model
 * @public
 */
let Model: IFileModel = DataModel.extend({

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
    getOrigin(): IResource {
       return this._$origin;
    },

    /**
     * Возвращает имя загружаемого ресурса
     * @return {String}
     */
    getName(): string {
        return this._$origin.getName();
    }
});

Di.register('file.model', Model);

export = Model;
