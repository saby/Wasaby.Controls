/// <amd-module name="File/LocalFile" />
/**
 * Класс - обёртка над нативным File/Blob
 * @class
 * @name File/LocalFile
 * @public
 * @author Заляев А.В.
 */
class LocalFile {
    private _name: string;
    /**
     * @param {Blob | File} _data Файл
     * @param {*} [_meta] Дополнительные мета-данные
     * @param {String} [name] Имя файла. Обязательный аргумент, если в качестве данных передался Blob
     * @constructor
     * @name File/LocalFile
     */
    constructor(private _data: Blob | File, private _meta?: any, name?: string) {
        this._name = name || (_data instanceof File && _data.name);
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
    /**
     * Возвращает дополнительную информацию по файлу
     * @return {*}
     * @name File/LocalFile#getMeta
     * @method
     */
    getMeta(): any {
        return this._meta || {};
    }
}
export  = LocalFile;
