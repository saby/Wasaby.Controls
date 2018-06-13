/// <amd-module name="File/LocalFile" />
import ResourceAbstract = require("File/ResourceAbstract");

/**
 * Класс - обёртка над нативным File/Blob
 * @class
 * @extends File/ResourceAbstract
 * @name File/LocalFile
 * @public
 * @author Заляев А.В.
 */
class LocalFile extends ResourceAbstract {
    private readonly _name: string;
    /**
     * @param {Blob | File} _data Файл
     * @param {*} [meta] Дополнительные мета-данные
     * @param {String} [name] Имя файла. Обязательный аргумент, если в качестве данных передался Blob
     * @constructor
     * @name File/LocalFile
     */
    constructor(private _data: Blob | File, meta?: any, name?: string) {
        super();
        this._name = name || (_data instanceof File && _data.name);
        this._meta = meta;
        if (!this._name) {
            // Для корректной загрузки Blob через FormData необходимо имя файла
            throw new Error('Argument "name" is required for Blob data');
        }
    }
    /**
     * Возвращает файл
     * @return {File | Blob}
     * @name File/LocalFile#getData
     * @method
     */
    getData(): File | Blob {
        return this._data;
    }

    /**
     * Возвращает имя файла
     * @return {String}
     */
    getName(): string {
        return this._name;
    }
}
export  = LocalFile;
