/**
 * Интерфейс сущности получения ресурсов
 * @author Заляев А.В.
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 * @interface
 * @name File/IResourceGetter
 */

/**
 * Возможен ли выбор ресурса
 * @return {Core/Deferred.<Boolean>}
 * @method
 * @name File/IResourceGetter#canExec
 */

/**
 * Осуществляет выбор ресурсов
 * @return {Core/Deferred.<Array.<File/IResource>>}
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 * @method
 * @name File/IResourceGetter#getFiles
 */

/**
 * Возвращает строку - тип ресурса
 * @return {String}
 * @method
 * @name File/IResourceGetter#getType
 */

/**
 * Конструктор сущности получения ресурсов
 * @author Заляев А.В.
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 * @see File/IResourceGetter
 * @name File/IResourceGetterConstructor
 */
