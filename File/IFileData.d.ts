/**
 * Сущность обёртки над каким-либо ресурсом
 * @typedef File/IFileData
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 */
declare type IFileData = {
    getMeta(): any;
}
