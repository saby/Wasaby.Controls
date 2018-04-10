/**
 * Сущность обёртки над каким-либо ресурсом
 * @typedef File/IResource
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 */
type IResource = {
    getMeta(): any;
}

export = IResource;
