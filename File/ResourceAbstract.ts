/// <amd-module name="File/ResourceAbstract" />

import IResource = require("IResource");

/**
 * @class
 * @abstract
 * @implements File/IResource
 */
abstract class ResourceAbstract implements IResource {
    protected _meta: object;
    /**
     * Возвращает дополнительную информацию по ресурсу
     * @return {Object}
     * @name File/ResourceAbstract#getMeta
     * @method
     */
    getMeta(): object {
        if (this._meta) {
            this._meta = {};
        }
        return this._meta;
    }
    /**
     * Устанавливает дополнительную информацию по ресурсу
     * @param {Object} meta
     * @name File/ResourceAbstract#setMeta
     * @method
     */
    setMeta(meta: object) {
        this._meta = meta;
    }
}

export = ResourceAbstract;
