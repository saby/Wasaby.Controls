import 'Core/polyfill/PromiseAPIDeferred';

import {assert, expect} from 'chai';
import {NavigationController} from 'Controls/source';
import {INavigationOptionValue} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import {Remote, Query, DataSet, Memory} from 'Types/source';
import {Record} from 'Types/entity';
import {TNavigationSource, TNavigationView} from 'Controls/_interface/INavigation';
import {IOptions} from 'Types/_source/Local';

export const memoryData = [
    {
        key: 1,
        FIO: 'Шершов Митофан Степанович',
        Address: 'г. Нелидово, ул. Нижнемасловский 2-й Переулок, дом 55',
        Phone: '+79928213283'
    },
    {
        key: 2,
        FIO: 'Человечий Сергей Дмитриевич',
        Address: 'г. Цивильск, ул. Новые Черемушки 24-25 Квартал, дом 34',
        Phone: '+72715671535'
    },
    {
        key: 3,
        FIO: 'Трофимова Тамара Артемовна ',
        Address: 'г. Мещовск, ул. Карачаровское Шоссе, дом 89',
        Phone: '+74782498448'
    },
    {
        key: 4,
        FIO: 'Волков Никандр Эдуардович',
        Address: 'г. Малояз, ул. Щербаковская, дом 69',
        Phone: '+79267829532'
    },
    {
        key: 5,
        FIO: 'Петрова Алла Валентиновна ',
        Address: 'г. Карсун, ул. Можайский 1-й Тупик, дом 87',
        Phone: '+79744222066'
    }
];

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
            limit: 10,
            position: 2,
            direction: 'after',
            field: 'id',
            pageSize: 2,
            page: 0,
            hasMore: false
        }
    };
};

export class FakeNavigationControllerSource extends Remote {

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

/**
 * @see also tests/ControlsUnit/Controllers/SourceController.test.js
 */
describe('Controls/_source/NavigationController', () => {
    const keyProperty: string = 'id';

    describe('load', () => {
        it('Should load data (PagePaginatorController)', () => {
            const source = new FakeNavigationControllerSource();
            const controller = new NavigationController({
                source,
                keyProperty,
                navigation: fakeNavigationControllerNavigation('page', 'pages')
            });
            controller.load()
                .then((recordSet) => {
                    assert.deepEqual(recordSet, fakeNavigationControllerDataSet.getAll());
                })
                .catch((error) => {
                    expect.fail('Data loading unsuccessful');
                });
        });
        it('Should load data (PositionPaginatorController)', () => {
            const source = new FakeNavigationControllerSource();
            const controller = new NavigationController({
                source,
                keyProperty,
                navigation: fakeNavigationControllerNavigation('position', 'infinity')
            });
            controller.load()
                .then((recordSet) => {
                    assert.deepEqual(recordSet, fakeNavigationControllerDataSet.getAll());
                })
                .catch(() => {
                    expect.fail('Data loading unsuccessful');
                });
        });
        it('Should work with Types/source:Memory', () => {
            const source = new Memory({
                keyProperty: 'key',
                data: memoryData
            });
            const controller = new NavigationController({
                source,
                keyProperty: 'key',
                navigation: fakeNavigationControllerNavigation('page', 'pages')
            });
            controller.load()
                .then((recordSet) => {
                    assert.equal(recordSet.at(0).get('key'), memoryData[0].key);
                    assert.equal(recordSet.at(1).get('key'), memoryData[1].key);
                })
                .catch(() => {
                    expect.fail('Data loading unsuccessful');
                });
        });
    });
});
