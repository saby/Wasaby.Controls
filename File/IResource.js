/**
 * Сущность обёртки над каким-либо ресурсом
 * @typedef File/IResource
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 */

/**
 * Возвращает дополнительную информацию по ресурсу
 * @return {Object}
 * @name File/IResource#getMeta
 * @method
 */

/**
 * Устанавливает дополнительную информацию по ресурсу
 * @param {Object} meta
 * @name File/IResource#setMeta
 * @method
 */

/**
 * Дополнительная информация о ресурсе
 * @typedef {Object} File/FileInfo
 * @property {String} [name] Имя
 * @property {Number} [size] Размер
 * @property {Boolean} [isDirectory] Является ли директорией
 * @property {String} [type] Тип файла
 */

/**
 * Конструктор обёртки над ресурсом
 * @typedef  File/IResourceConstructor
 * @constructor
 * @see File/IResource
 */
