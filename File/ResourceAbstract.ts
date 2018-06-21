/// <amd-module name="File/ResourceAbstract" />
import IResource = require("IResource");

export interface FileInfo {
    name?: string;
    size?: number;
    isDirectory?: boolean;
    type?: string;
    [propName: string]: any;
}

/**
 * @typedef {Object} File/FileInfo Информация о файле
 * @property {String} [name] Имя
 * @property {String} [type]  Тип
 * @property {Boolean} [isDirectory] Является ли директорией
 * @property {Number} [size] Размер
 */

/**
 * @class
 * @abstract
 * @implements File/IResource
 * @name File/ResourceAbstract
 */
export abstract class ResourceAbstract implements IResource {
    protected _meta?: object;
    protected _info?: FileInfo;

    /**
     * Возвращает дополнительную информацию по ресурсу
     * @return {Object}
     * @name File/ResourceAbstract#getMeta
     * @method
     */
    getMeta(): object {
        if (!this._meta) {
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

    /**
     * Возвращает информацию о файле, если такая имеется
     * @name File/ResourceAbstract#getFileInfo
     * @return {FileInfo}
     */
    getFileInfo(): FileInfo {
        if (!this._info) {
            this._info = {};
        }
        return this._info;
    }
    /**
     * Возвращает имя файла
     * @name File/ResourceAbstract#getName
     * @return {String}
     */
    getName(): string {
        return this.getFileInfo().name || "";
    }
}
