// js Файл только чтобы подцепилось автодокой

/**
 * Интерфейс сущности получения ресурсов
 * @author Заляев А.В.
 * @see Controls/File/LocalFile
 * @see Controls/File/LocalFileLink
 * @see Controls/File/HttpFileLink
 * @interface
 * @name Controls/File/IResourceGetter
 */
/**
 * Возможен ли выбор ресурса
 * @return {Core/Deferred<Boolean>}
 * @method
 * @name Controls/File/IResourceGetter#canExec
 */
/**
 * Осуществляет выбор ресурсов
 * @return {Core/Deferred<Array<IFileData>>}
 * @see Controls/File/LocalFile
 * @see Controls/File/LocalFileLink
 * @see Controls/File/HttpFileLink
 * @method
 * @name Controls/File/IResourceGetter#getFiles
 */
/**
 * Возвращает строку - тип ресурса
 * @return {String}
 * @method
 * @name Controls/File/IResourceGetter#getType
 */

/**
 * Конструктор сущности получения ресурсов
 * @author Заляев А.В.
 * @see Controls/File/LocalFile
 * @see Controls/File/LocalFileLink
 * @see Controls/File/HttpFileLink
 * @see Controls/File/IResourceGetter
 * @constructor
 * @name IResourceGetterConstructor
 */