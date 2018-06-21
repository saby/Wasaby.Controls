/// <amd-module name="File/HttpFileLink" />
import {ResourceAbstract, FileInfo} from 'File/ResourceAbstract';
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
     * @param {*} [_meta] Дополнительные мета-данные
     * @param {FileInfo} [_info] Информация о файле
     * @constructor
     * @name File/HttpFileLink
     */
    constructor(
        private fileLink: string,
        protected _meta: object,
        protected _info: FileInfo
    ) {
        super();
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

export = HttpFileLink;
