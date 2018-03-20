import Deferred = require("Core/Deferred")
import {IFileData} from "File/IFileData";
/**
 * Интерфейс сущности получения ресурсов
 * @author Заляев А.В.
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 * @name File/IResourceGetter
 */
declare type IResourceGetter = {
    /**
     * Возможен ли выбор ресурса
     * @return {Core/Deferred<Boolean>}
     * @method
     * @name File/IResourceGetter#canExec
     */
    canExec(): Deferred<boolean>;
    /**
     * Осуществляет выбор ресурсов
     * @return {Core/Deferred<Array<File/IFileData>>}
     * @see File/LocalFile
     * @see File/LocalFileLink
     * @see File/HttpFileLink
     * @method
     * @name File/IResourceGetter#getFiles
     */
    getFiles(): Deferred<Array<IFileData>>;
    /**
     * Возвращает строку - тип ресурса
     * @return {String}
     * @method
     * @name File/IResourceGetter#getType
     */
    getType(): string;
    destroy(): void;
    isDestroy(): boolean;
}
/**
 * Конструктор сущности получения ресурсов
 * @author Заляев А.В.
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 * @see File/IResourceGetter
 * @name File/IResourceGetterConstructor
 */
declare type IResourceGetterConstructor = {
    new (...args): IResourceGetter;
}
