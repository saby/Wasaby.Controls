/// <amd-module name="File/LocalFileLink" />
import {ResourceAbstract, FileInfo} from 'File/ResourceAbstract';
/**
 * Класс - обёртка над ссылкой на локальный файл
 * @class
 * @extends File/ResourceAbstract
 * @name File/LocalFileLink
 * @public
 * @author Заляев А.В.
 */
class LocalFileLink extends ResourceAbstract {
    private readonly _fileInfo: Partial<FileInfo>;
    /**
     * @param {String} fileLink Ссылка на файл
     * @param {*} [_meta] Дополнительные мета-данные
     * @param {FileInfo} [_info] Информация о файле
     * @constructor
     * @name File/LocalFileLink
     */
    constructor(
        private fileLink: string,
        protected _meta?: any,
        protected _info?: FileInfo
    ) {
        super();
        this._fileInfo = this._fileInfo || {};
        if (!this._fileInfo.name) {
            /*
             * Для ссылки на локальный файл, именем является часть пути до него после последнего слеша
             */
            this._fileInfo.name = fileLink.replace(/.*(\\|\/)/, "");
        }
    }
    /**
     * Возвращает ссылку на файл, находящийся на локальном устройстве
     * @return {String}
     * @method
     * @name File/LocalFileLink#getLink
     */
    getLink(): string {
        return this.fileLink;
    }
}
export  = LocalFileLink;
