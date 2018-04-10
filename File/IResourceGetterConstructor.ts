import IResource = require("File/IResourceGetter");

/**
 * Конструктор сущности получения ресурсов
 * @author Заляев А.В.
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 * @see File/IResourceGetter
 * @name File/IResourceGetterConstructor
 */
type IResourceGetterConstructor = {
    new (...args): IResource;
}

export = IResourceGetterConstructor;
