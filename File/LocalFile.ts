/// <amd-module name="File/LocalFile" />
import {ResourceAbstract, FileInfo} from 'File/ResourceAbstract';

interface Info extends FileInfo {
    path?: string;
}
/**
 * Класс - обёртка над нативным File/Blob
 * @class
 * @extends File/ResourceAbstract
 * @name File/LocalFile
 * @public
 * @author Заляев А.В.
 */
class LocalFile extends ResourceAbstract {
    /**
     * @param {Blob | File} _data Файл
     * @param {*} [_meta] Дополнительные мета-данные
     * @param {String | File/FileInfo} [info] Объект с информацией о файле, либо строка с именем файла.
     * Имя файла является обязательным аргументом, если в качестве данных передался Blob
     * @constructor
     * @name File/LocalFile
     */
    constructor(
        private _data: Blob | File,
        protected _meta?: any,
        info?: string | Info
    ) {
        super();
        this._info = typeof info == 'string'? {
            name: info
        }: info || {};
        this._info.name = this._info.name || (_data instanceof File && _data.name);

        if (!this._info.name) {
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
}
export  = LocalFile;
