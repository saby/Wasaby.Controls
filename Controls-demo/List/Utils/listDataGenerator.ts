import {DataSet, Query, Remote} from 'Types/source';
import {IOptions as ILocalSourceOptions} from 'Types/_source/Local';
import {Record} from 'Types/entity';
import {RecordSet} from 'Types/collection';
import {fetch} from 'Browser/Transport';

interface IField {
    type: 'string' | 'number'; // TODO add date, Incremental etc
    randomData?: boolean;
    addId?: boolean;
    value?: any;
}
interface INumberField {
}
interface IStringField {
    wordsCount: number;
}

interface IItemPrototype {
    [key: string]: string | number | (IField & (INumberField|IStringField));
}

/* Позволяет сгенерировать список данных по заданному объекту-шаблону
 * @param itemsCount кол-во записей
 * @param itemProto шаблон для создания элементов
 * @param idProperty название ключевого поля
 */
function getListData(itemsCount: number, itemProto: IItemPrototype = null, idProperty: string = 'id'): any[] {
    const data = [];
    for (let i = 0; i < itemsCount; i++) {
        data.push(itemProto === null ? {[idProperty]: i} : _createItemByProto(itemProto, i, idProperty));
    }
    return data;
}

/* генерирует один элемент по шаблону
 * @param itemProto шаблон для создания элементов
 * @param id значение ключевого поля
 * @param idProperty название ключевого поля
 * @private
 */
function _createItemByProto(itemProto: IItemPrototype, id: number, idProperty: string = 'id'): {[p: string]: any} {
    const outItem: {[p: string]: any} = {};
    const isNeedId = itemProto && (itemProto[idProperty] === undefined);

    Object.keys(itemProto).forEach((key) => {
        const item: IField | string | number = itemProto[key];
        if (typeof item === 'object' && (item.type || item.value)) {
            const value = item.value !== undefined ? item.value : '';
            if (item.type === 'string') {
                if (item.randomData) {
                    outItem[key] = repeatText(Math.round(0.5 + Math.random() * 5));
                } else if (item.addId) {
                    outItem[key] = `${value}_${id}`;
                } else {
                    outItem[key] = value;
                }
            } else if (item.type === 'number') {
                outItem[key] = isNaN(value) ? 0 : value;
            } else {
                outItem[key] = item;
            }
        } else {
            outItem[key] = item;
        }
    });

    if (isNeedId) {
        outItem[idProperty] = id;
    }

    return outItem;
}

/*
 * Генерирует примитивный текст "рыбы"
 * @param count
 */
function repeatText(count: number): string {
    let result = '';
    for (let i = 0; i < count; i++) {
        result += 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc posuere nulla ex, consectetur lacinia odio blandit sit amet. ';
    }
    return result.trim();
}

/**
 * Генератор n данных вида {id, title}
 * @param n
 */
export const generateRawData = (n: number): any[] => {
    return getListData(n, {
        id: 'Id',
        title: {
            type: 'string',
            addId: true
        }
    });
};

/**
 * Генератор фейковых данных с поддержкой принудительного возврата ошибки 403
 * SourceFaker.instance(options: ILocalSourceOptions, rawData: any[], mustFall: boolean)
 */
export class SourceFaker extends Remote {

    private readonly _timeOut: number;
    private _failed: boolean;
    private _rawData: any[] | DataSet;

    constructor(options?: ILocalSourceOptions) {
        super(options);
        this._timeOut = 500;
    }

    create(meta?: object): Promise<Record> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._failed) {
                    reject(this._generateError('create'));
                } else {
                    const _record = new Record();
                    _record.setRawData(meta);
                    resolve(_record);
                }
            }, this._timeOut);
        });
    }

    destroy(keys: number | string | number[] | string[], meta?: object): Promise<null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._failed) {
                    reject(this._generateError('destroy'));
                } else {
                    resolve(null);
                }
            }, this._timeOut);
        });
    }

    query(query?: Query): Promise<DataSet> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._failed) {
                    reject(this._generateError('query'));
                } else {
                    resolve(this.querySync());
                }
            }, this._timeOut);
        });
    }

    read(key: number | string, meta?: object): Promise<Record> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._failed) {
                    reject(this._generateError('read'));
                } else {
                    const _record = new Record();
                    const _data = this.getRawData();
                    _record.setRawData(_data[4]);
                    resolve(_record);
                }
            }, this._timeOut);
        });
    }

    update(data: Record | RecordSet, meta?: object): Promise<null> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._failed) {
                    reject(this._generateError('update'));
                } else {
                    resolve(null);
                }
            }, this._timeOut);
        });
    }

    /*
     * Устанавливает флаг "Всегда возвращать ошибку"
     * @param failed
     */
    setFailed(failed: boolean): void {
        this._failed = failed;
    }

    /*
     * Устанавливает данные в "чистом" виде или DataSet
     * @param data
     */
    setData(data: any[] | DataSet): void {
        this._rawData = data;
    }

    /*
     * Синхронно возвращает DataSet
     */
    querySync(): DataSet {
        if (this._rawData instanceof DataSet) {
            return this._rawData;
        }
        return new DataSet({
            rawData: this._rawData,
            keyProperty: 'id'
        });
    }

    /*
     * Синхронно возвращает данные в "чистом" виде
     */
    getRawData(): any[] {
        if (this._rawData instanceof DataSet) {
            return this._rawData.getRawData();
        }
        return this._rawData;
    }

    private _generateError(action: string): fetch.Errors.HTTP {
        return new fetch.Errors.HTTP({
            url: `localhost/${action}`,
            httpError: 403,
            name: '403 Access Restricted',
            message: 'Доступ ограничен'
        });
    }

    /*
     * Используйте этот метод вместо конструктора
     * @param options {
     *      filter:  (item: adapter.IRecord, query: object) => boolean;
     *      options: {debug: boolean};
     *      adapter?: string | adapter.IAdapter;
     *      model?: string | Function;
     *      listModule?: string | Function;
     *      keyProperty?: string;
     *      dataSetMetaProperty?: string;
     * }
     * @param data данные в "чистом" виде или DataSet
     * @param failed флаг "Всегда возвращать ошибку"
     */
    static instance(options?: ILocalSourceOptions, data?: any[] | DataSet, failed?: boolean): SourceFaker {
        const faker = new SourceFaker(options);
        faker.setData(data || getListData(100, {
            title: {
                value: 'Заголовок',
                type: 'string',
                addId: true
            },
            text: {
                type: 'string',
                randomData: true
            }
        }));
        faker.setFailed(failed);
        return faker;
    }
}

export {
    IField,
    IItemPrototype,
    INumberField,
    IStringField,
    getListData,
    getListData as getGridData
};
