import {assert} from 'chai';
import {NavigationController} from 'Controls/source';
import {INavigationOptionValue} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import {ICrud, Query, DataSet} from 'Types/source';
import {Record} from 'Types/entity';

// import * as Deferred from 'Core/Deferred';
import {TNavigationSource, TNavigationView} from 'Controls/_interface/INavigation';

export const fakeNavigationControllerDataSet = new DataSet({
    rawData: {
        orders: [
            {id: 1, buyerId: 1, date: '2016-06-02 14:12:45', amount: 96},
            {id: 2, buyerId: 2, date: '2016-06-02 17:01:12', amount: 174},
            {id: 3, buyerId: 1, date: '2016-06-03 10:24:28', amount: 475}
        ],
        buyers: [
            {id: 1, email: 'tony@stark-industries.com', phone: '555-111-222'},
            {id: 2, email: 'steve-rogers@avengers.us', phone: '555-222-333'}
        ],
        total: {
            dateFrom: '2016-06-01 00:00:00',
            dateTo: '2016-07-01 00:00:00',
            amount: 745,
            deals: 3,
            completed: 2,
            paid: 2,
            awaited: 1,
            rejected: 0
        },
        executeDate: '2016-06-27 11:34:57'
    },
    itemsProperty: 'orders',
    keyProperty: 'id'
});

export const fakeNavigationControllerNavigation = (source: TNavigationSource, view: TNavigationView): INavigationOptionValue => {
    return {
        source,
        view,
        viewConfig: {
            pagingMode: 'direct'
        },
        sourceConfig: {
            pageSize: 2,
            page: 0
        }
    };
};

export class FakeNavigationControllerSource implements ICrud {

    readonly '[Types/_source/ICrud]': boolean;

    create(meta?: object): Promise<Record> {
        return undefined;
    }

    destroy(keys: number | string | number[] | string[], meta?: object): Promise<null> {
        return undefined;
    }

    query(query?: Query): Promise<DataSet> {
        // return Deferred.fail({
        //     canceled: false,
        //     processed: false,
        //     _isOfflineMode: false
        // });
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(fakeNavigationControllerDataSet);
            }, 2000);
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
    let source: FakeNavigationControllerSource;
    const keyProperty: string = 'id';

    beforeEach(() => {
        source = new FakeNavigationControllerSource();
    });

    describe('load', () => {
        it('Should load data (PagePaginatorController)', () => {
            const controller = new NavigationController({
                source,
                keyProperty,
                navigation: fakeNavigationControllerNavigation('page', 'pages')
            });
            controller.load().then((dataSet) => {
                assert.deepEqual(dataSet, fakeNavigationControllerDataSet.getAll());
            });
        });
        it('Should load data (PositionPaginatorController)', () => {
            const controller = new NavigationController({
                source,
                keyProperty,
                navigation: fakeNavigationControllerNavigation('position', 'infinity')
            });
            controller.load().then((dataSet) => {
                assert.deepEqual(dataSet, fakeNavigationControllerDataSet.getAll());
            });
        });
    });
});
