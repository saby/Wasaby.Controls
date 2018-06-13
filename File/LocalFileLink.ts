/// <amd-module name="File/LocalFileLink" />
import ResourceAbstract = require("File/ResourceAbstract");
type FileInfo = {
    name: string;
    size: number;
    isDirectory: boolean;
    type: string;
}

/**
 * @typedef {Object} FileInfo Информация о файле
 * @property {String} [name] Имя
 * @property {String} [type]  Тип
 * @property {Boolean} [isDirectory] Является ли директорией
 * @property {Number} [size] Размер
 */
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
     * @param {*} [meta] Дополнительные мета-данные
     * @param {FileInfo} [fileInfo] Информация о файле
     * @constructor
     * @name File/LocalFileLink
     */
    constructor(private fileLink: string, meta?: any, fileInfo?: Partial<FileInfo>) {
        super();
        this._fileInfo = fileInfo || {};
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
    /**
     * Возвращает информацию о файле, если такая имеется
     * @return {FileInfo}
     */
    getFileInfo(): Partial<FileInfo> {
        return this._fileInfo || {};
    }
    /**
     * Возвращает имя файла
     * @return {String}
     */
    getName(): string {
        return this._fileInfo.name || "";
    }
}
export  = LocalFileLink;
