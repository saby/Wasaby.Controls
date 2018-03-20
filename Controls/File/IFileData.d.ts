/**
 * Сущность обёртки над каким-либо ресурсом
 * @typedef Controls/File/IFileData
 * @see Controls/File/LocalFile
 * @see Controls/File/LocalFileLink
 * @see Controls/File/HttpFileLink
 */
declare type IFileData = {
    getMeta(): any;
}
