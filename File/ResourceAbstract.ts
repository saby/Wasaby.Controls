/// <amd-module name="File/ResourceAbstract" />
import {IResource, FileInfo} from 'File/IResource';

/**
 * Абстрактный класс, реализующий интерфейс работы с ресурсами {@link File/IResource}
 * @class
 * @abstract
 * @implements {File/IResource}
 * @name File/ResourceAbstract
 * @author Заляев А.В.
 */
export abstract class ResourceAbstract implements IResource {
    protected _meta?: object;
    protected _info: FileInfo;

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
     * @name File/ResourceAbstract#getInfo
     * @return {FileInfo}
     */
    getInfo(): FileInfo {
        if (!this._info) {
            this.setInfo({});
        }
        return this._info;
    }
    getFileInfo(): FileInfo {
        return this.getInfo();
    }

    /**
     * Возвращает информацию о файле
     * @name File/ResourceAbstract#setInfo
     * @param {FileInfo} info
     */
    setInfo(info: Partial<FileInfo>) {
        this._info = info || {};
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
