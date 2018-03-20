import {IFileData} from "File/IFileData";
/**
 * Конструктор обёртки над ресурсом
 * @typedef  File/IFileDataConstructor
 * @constructor
 * @see File/IFileData
 */
declare type IFileDataConstructor = {
    new(...args): IFileData;
}