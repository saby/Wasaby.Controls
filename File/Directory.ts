/// <amd-module name="File/Directory" />
import {ResourceAbstract} from 'File/ResourceAbstract';
import LocalFile = require('File/LocalFile');
import {FileInfo} from 'File/IResource';

type Entry = Directory | LocalFile;
type Entries = Array<Entry>;

type DirectoryConfig = {
    name: string;
    info?: FileInfo;
    entries?: Entries,
    meta?: any,
}
/**
 * Класс - обёртка над директорией
 * @class
 * @extends File/ResourceAbstract
 * @name File/Directory
 * @public
 * @author Заляев А.В.
 */
class Directory extends ResourceAbstract {
    private readonly __entries: Entries;
    /**
     * @param {String} name Имя директории
     * @param {Object} [meta] Дополнительные мета-данные
     * @param {File/FileInfo} [info] Объект с информацией о файле.
     * @param {File/IResource} [entries] Содержимое директории.
     * @constructor
     * @name File/Directory
     */
    constructor({
        name,
        info,
        entries,
        meta
    }: DirectoryConfig) {
        super();
        if (!name) {
            throw new Error('Argument "name" is required');
        }
        this._info = {
            ...info,
            size: 0,
            name,
            isDirectory: true
        };
        this.__entries = entries || [];
        /*
         * Подсчёт размера содержимого папки
         * Необходимо чтобы при загрузке бросать событие с корректным процентом загруженности
         */
        this.__entries.forEach((entry) => {
            this._info.size += entry.getInfo().size || 0;
        });
        this._meta = meta || {};
    }
    /**
     * Возвращает содержимоё директории
     * @return {File | Blob}
     * @name File/Directory#getData
     * @method
     */
    getEntries(): Array<Entry> {
        return [...this.__entries]
    }
    push(entry: Entry) {
        let info = entry.getFileInfo();
        info.path = this.getName() + '/' + (info.path || entry.getName());
        entry.setInfo(info);
        this.__entries.push(entry);
        this._info.size += info.size;
    }
}
export  = Directory;
