import Deferred = require("Core/Deferred")
import {IResource} from "File/IResource";

/**
 * Интерфейс сущности получения ресурсов
 * @author Заляев А.В.
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 * @name File/IResourceGetter
 */
export type IResourceGetter = {
    /**
     * Возможен ли выбор ресурса
     * @return {Core/Deferred.<Boolean>}
     * @method
     * @name File/IResourceGetter#canExec
     */
    canExec(): Deferred<boolean>;
    /**
     * Осуществляет выбор ресурсов
     * @return {Core/Deferred.<Array.<File/IResource>>}
     * @see File/LocalFile
     * @see File/LocalFileLink
     * @see File/HttpFileLink
     * @method
     * @name File/IResourceGetter#getFiles
     */
    getFiles(): Deferred<Array<IResource>>;
    /**
     * Возвращает строку - тип ресурса
     * @return {String}
     * @method
     * @name File/IResourceGetter#getType
     */
    getType(): string;
    destroy(): void;
    isDestroyed(): boolean;
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
export type IResourceGetterConstructor = {
    new (...args): IResource;
}
