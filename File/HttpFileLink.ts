/// <amd-module name="File/HttpFileLink" />
/**
 * Класс - обёртка над http-ссылкой на файл
 * @class
 * @name File/HttpFileLink
 * @public
 * @author Заляев А.В.
 */
class HttpFileLink {
    /**
     * @param {String} fileLink Ссылка на ресурс
     * @param {*} [meta] Дополнительные мета-данные
     * @constructor
     * @name File/HttpFileLink
     */
    constructor(private fileLink: string, private meta?: any) {}
    /**
     * Возвращает ссылку на удалённый ресурс
     * @return {String}
     * @method
     * @name File/HttpFileLink#getLink
     */
    getLink(): string {
    return this.fileLink;
    }
    /**
     * Возвращает дополнительную информацию по файлу
     * @return {*}
     * @method
     * @name File/HttpFileLink#getMeta
     */
    getMeta(): any {
        return this.meta || {};
    }
}
export  = HttpFileLink;
