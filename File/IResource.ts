/**
 * Сущность обёртки над каким-либо ресурсом
 * @typedef File/IResource
 * @see File/LocalFile
 * @see File/LocalFileLink
 * @see File/HttpFileLink
 */
type IResource = {
    /**
     * Возвращает дополнительную информацию по ресурсу
     * @return {Object}
     * @name File/IResource#getMeta
     * @method
     */
    getMeta(): object;
    /**
     * Устанавливает дополнительную информацию по ресурсу
     * @param {Object} meta
     * @name File/IResource#setMeta
     * @method
     */
    setMeta(meta: object): void;
}

export = IResource;
