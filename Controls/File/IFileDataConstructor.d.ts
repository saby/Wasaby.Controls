/**
 * Конструктор обёртки над ресурсом
 * @typedef  Controls/File/IFileDataConstructor
 * @constructor
 * @see Controls/File/IFileData
 */
declare type IFileDataConstructor = {
    new(...args): IFileData;
}