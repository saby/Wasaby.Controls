/**
 * Дополнительная информация о ресурсе
 * @typedef {Object} File/FileInfo
 * @property {String} [name] Имя
 * @property {Number} [size] Размер
 * @property {Boolean} [isDirectory] Является ли директорией
 * @property {String} [type] Тип файла
 */
export interface FileInfo {
    name?: string;
    size?: number;
    isDirectory?: boolean;
    type?: string;
    [propName: string]: any;
}

/**
 * Сущность обёртки над каким-либо ресурсом
 * @typedef File/IResource
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 */
export type IResource = {
    /**
     * Возвращает дополнительную информацию по ресурсу, необходимую для конкретного сервиса
     * @return {Object}
     * @name File/IResource#getMeta
     * @method
     */
    getMeta(): object;
    /**
     * Устанавливает дополнительную информацию по ресурсу, необходимую для конкретного сервиса
     * @param {Object} meta
     * @name File/IResource#setMeta
     * @method
     */
    setMeta(meta: object): void;

    /**
     * Возвращает информацию о файле, если такая имеется
     * @name File/IResource#getFileInfo
     * @return {File/FileInfo}
     */
    getFileInfo(): FileInfo;

    /**
     * Возвращает имя файла
     * @name File/IResource#getName
     * @return {String}
     */
    getName(): string;
}

/**
 * Конструктор обёртки над ресурсом
 * @typedef  File/IResourceConstructor
 * @constructor
 * @see File/IResource
 */
export type IResourceConstructor = {
    new(...args): IResource;
}
