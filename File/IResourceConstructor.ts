import IResource = require("IResource");

/**
 * Конструктор обёртки над ресурсом
 * @typedef  File/IResourceConstructor
 * @constructor
 * @see File/IResource
 */
type IResourceConstructor = {
    new(...args): IResource;
}

export = IResourceConstructor;
