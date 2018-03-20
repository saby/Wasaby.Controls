import Deferred = require("Core/Deferred")
/**
 * Интерфейс сущности получения ресурсов
 * @author Заляев А.В.
 * @see Controls/File/LocalFile
 * @see Controls/File/LocalFileLink
 * @see Controls/File/HttpFileLink
 * @name Controls/File/IResourceGetter
 */
declare type IResourceGetter = {
    /**
     * Возможен ли выбор ресурса
     * @return {Core/Deferred<Boolean>}
     * @method
     * @name Controls/File/IResourceGetter#canExec
     */
    canExec(): Deferred<boolean>;
    /**
     * Осуществляет выбор ресурсов
     * @return {Core/Deferred<Array<Controls/File/IFileData>>}
     * @see Controls/File/LocalFile
     * @see Controls/File/LocalFileLink
     * @see Controls/File/HttpFileLink
     * @method
     * @name Controls/File/IResourceGetter#getFiles
     */
    getFiles(): Deferred<Array<IFileData>>;
    /**
     * Возвращает строку - тип ресурса
     * @return {String}
     * @method
     * @name Controls/File/IResourceGetter#getType
     */
    getType(): string;
    destroy(): void;
    isDestroy(): boolean;
}
/**
 * Конструктор сущности получения ресурсов
 * @author Заляев А.В.
 * @see Controls/File/LocalFile
 * @see Controls/File/LocalFileLink
 * @see Controls/File/HttpFileLink
 * @see Controls/File/IResourceGetter
 * @name Controls/File/IResourceGetterConstructor
 */
declare type IResourceGetterConstructor = {
    new (...args): IResourceGetter;
}
