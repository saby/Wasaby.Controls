import {assert} from 'chai';
import {NavigationController} from 'Controls/source';
import {INavigationOptionValue} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import {ICrud, Query, DataSet} from 'Types/source';
import {Record} from 'Types/entity';

import * as Deferred from 'Core/Deferred';

export class FakeSource implements ICrud {

    readonly '[Types/_source/ICrud]': boolean;

    create(meta?: object): Promise<Record> {
        return undefined;
    }

    destroy(keys: number | string | number[] | string[], meta?: object): Promise<null> {
        return undefined;
    }

    query(query?: Query): Promise<DataSet> {
        return Deferred.fail({
            canceled: false,
            processed: false,
            _isOfflineMode: false
        });
    }

    read(key: number | string, meta?: object): Promise<Record> {
        return undefined;
    }

    update(data: Record | RecordSet, meta?: object): Promise<null> {
        return undefined;
    }
}

describe('Controls/_source/NavigationController', () => {
    beforeEach(() => {

    });

    describe('load', () => {
        it('Should load data with PagePaginatorController', () => {
            const navigation: INavigationOptionValue = {
                source: 'page',
                view: 'pages',
                viewConfig: {
                    pagingMode: 'direct'
                },
                sourceConfig: {
                    pageSize: 2,
                    page: 0
                }
            };
            const controller = new NavigationController({
                source: new FakeSource(),
                keyProperty: 'key',
                navigation
            });

        });
        it('Should load data with PositionPaginatorController', () => {

        });
    });
});
