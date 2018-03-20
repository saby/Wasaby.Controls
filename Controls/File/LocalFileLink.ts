/// <amd-module name="Controls/File/LocalFileLink" />
/**
 * Класс - обёртка над ссылкой на локальный файл
 * @class
 * @name Controls/File/LocalFileLink
 * @public
 * @author Заляев А.В.
 */
class LocalFileLink {
    /**
     * @param {String} fileLink Ссылка на файл
     * @param {*} [meta] Дополнительные мета-данные
     * @constructor
     * @name Controls/File/LocalFileLink
     */
    constructor(private fileLink: string, private meta?: any) {}
    /**
     * Возвращает ссылку на файл, находящийся на локальном устройстве
     * @return {String}
     * @method
     * @name Controls/File/LocalFileLink#getLink
     */
    getLink(): string {
    return this.fileLink;
    }
    /**
     * Возвращает дополнительную информацию по файлу
     * @return {*}
     * @method
     * @name Controls/File/LocalFileLink#getMeta
     */
    getMeta(): any {
        return this.meta;
    }
}
export  = LocalFileLink;
