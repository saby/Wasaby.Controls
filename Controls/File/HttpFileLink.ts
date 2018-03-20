/// <amd-module name="Controls/File/HttpFileLink" />
/**
 * Класс - обёртка над http-ссылкой на файл
 * @class
 * @name Controls/File/HttpFileLink
 * @public
 * @author Заляев А.В.
 */
class HttpFileLink {
    /**
     * @param {String} fileLink Ссылка на ресурс
     * @param {*} [meta] Дополнительные мета-данные
     * @constructor
     * @name Controls/File/HttpFileLink
     */
    constructor(private fileLink: string, private meta?: any) {}
    /**
     * Возвращает ссылку на удалённый ресурс
     * @return {String}
     * @method
     * @name Controls/File/HttpFileLink#getLink
     */
    getLink(): string {
    return this.fileLink;
    }
    /**
     * Возвращает дополнительную информацию по файлу
     * @return {*}
     * @method
     * @name Controls/File/HttpFileLink#getMeta
     */
    getMeta(): any {
        return this.meta;
    }
}
export  = HttpFileLink;
