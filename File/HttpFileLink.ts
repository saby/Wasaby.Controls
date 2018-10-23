/// <amd-module name="File/HttpFileLink" />
import {ResourceAbstract, FileInfo} from 'File/ResourceAbstract';

/**
 * Класс, реализующий интерфейс работы с ресурсами {@link File/IResource},
 * предназначенный для работы с файлами, находящимися на удалённом сервере
 * @class
 * @extends File/ResourceAbstract
 * @name File/HttpFileLink
 * @public
 * @author Заляев А.В.
 * @implements {File/IResource}
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
