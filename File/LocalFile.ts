/// <amd-module name="File/LocalFile" />
import {ResourceAbstract} from 'File/ResourceAbstract';
import {FileInfo} from 'File/IResource';

interface Info extends FileInfo {
    path?: string;
}
/**
 * Класс, реализующий интерфейс работы с ресурсами {@link File/IResource},
 * предназначенный для работы с экземплярами нативнымого интерфейса File | Blob
 * @class
 * @extends File/ResourceAbstract
 * @name File/LocalFile
 * @public
 * @author Заляев А.В.
 * @implements {File/IResource}
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
        this._info.size = this._data.size;

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
