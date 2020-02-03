import {Control, TemplateFunction} from 'UI/Base';
import {ICrud, DataSet, Query, Remote} from 'Types/source';
import {SourceControl} from 'Controls/list';
import {IOptions} from 'Types/_source/Local';
import {Record} from 'Types/entity';
import {RecordSet} from 'Types/collection';

import * as Template from 'wml!Controls-demo/List/ColumnsView/ColumnsView';

const NUMBER_OF_ITEMS = 100;

/**
 * Генератор данных
 * @param n
 */
const generateRawData = (n: number): any[] => {
    const rawData = [];
    for (let i = 0; i < n; i++) {
        rawData.push({
            id: i,
            title: `${i} item`
        });
    }
    return rawData;
};

class SourceFaker extends Remote {

    private _failed: boolean;

    constructor(options?: IOptions) {
        super(options);
    }

    create(meta?: object): Promise<Record> {
        return undefined;
    }

    destroy(keys: number | string | number[] | string[], meta?: object): Promise<null> {
        return undefined;
    }

    query(query?: Query): Promise<DataSet> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._failed) {
                    reject({
                        name: '400 Bad Request',
                        message: 'Сервер не отдал данные'
                    });
                } else {
                    resolve(new DataSet({
                        rawData: generateRawData(NUMBER_OF_ITEMS),
                        keyProperty: 'id'
                    }));
                }
            }, 2000);
        });
    }

    read(key: number | string, meta?: object): Promise<Record> {
        return undefined;
    }

    update(data: Record | RecordSet, meta?: object): Promise<null> {
        return undefined;
    }

    setFailed(failed: boolean): void {
        this._failed = failed;
    }

    static instance(options?: IOptions, failed?: boolean): SourceFaker {
        const faker = new SourceFaker(options);
        faker.setFailed(failed);
        return faker;
    }
}

/**
 * http://localhost:3000/Controls-demo/app/Controls-demo%2FList%2FRenderContainer%2FIndex
 * http://localhost:3000/Controls-demo/app/Controls-demo%2Flist%2FColumnsView%2FIndex
 */
export default class RenderColumnsViewContainerDemo extends Control {
    protected _template: TemplateFunction = Template;

    protected _children = {
        sourceControl: SourceControl
    };

    protected _itemsSource: ICrud;

    protected _itemActions: any[];

    protected _beforeMount(options?: {}, contexts?: object, receivedState?: void): Promise<void> | void {
        this._itemsSource = new SourceFaker();
        this._itemActions = [
            {
                id: 1,
                icon: 'icon-PhoneNull',
                title: 'phone',
                style: 'success',
                iconStyle: 'success',
                showType: 0,
                handler: (item) => alert(`phone clicked at ${item.getId()}`)
            },
            {
                id: 2,
                icon: 'icon-Edit',
                title: 'fake',
                style: 'danger',
                iconStyle: 'danger',
                showType: 0
            }
        ];
    }
}
