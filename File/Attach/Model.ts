/// <amd-module name="File/Attach/Model" />
import DataModel = require("WS.Data/Entity/Model");
import Di = require("WS.Data/Di");
import {IResource} from "File/IResource";

export type IFileModel = DataModel & {
    getOrigin(): IResource;
    getName(): string;
}

/**
 * Модуль с результатом загрузки ресурса на сервис
 * @class
 * @name File/Attach/Model
 * @extends WS.Data/Entity/Model
 * @public
 */
export let Model: IFileModel = DataModel.extends({

    /**
     * @cfg {File/IResource} Загружаемый ресурс
     * @name File/Attach/Model#origin
     */
    _$origin: null,
    constructor: function FileModel(options) {
        FileModel.superclass.constructor.call(this, options);
        if (this._options.origin) {
            throw new Error('argument "origin" in required');
        }
        this._$origin = this._options.origin;
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
