/// <amd-module name="File/HttpFileLink" />
import ResourceAbstract = require("File/ResourceAbstract");
/**
 * Класс - обёртка над http-ссылкой на файл
 * @class
 * @extends File/ResourceAbstract
 * @name File/HttpFileLink
 * @public
 * @author Заляев А.В.
 */
class HttpFileLink extends ResourceAbstract {
    /**
     * @param {String} fileLink Ссылка на ресурс
     * @param {*} [meta] Дополнительные мета-данные
     * @constructor
     * @name File/HttpFileLink
     */
    constructor(private fileLink: string, meta?: object) {
        super();
        this._meta = meta;
    }
    /**
     * Возвращает ссылку на удалённый ресурс
     * @return {String}
     * @method
     * @name File/HttpFileLink#getLink
     */
    getLink(): string {
        return this.fileLink;
    }
}
export  = HttpFileLink;
