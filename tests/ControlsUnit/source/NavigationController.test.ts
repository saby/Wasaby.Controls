import 'Core/polyfill/PromiseAPIDeferred';

import {assert} from 'chai';
import {NavigationController} from 'Controls/source';
import {INavigationOptionValue} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import {Query, DataSet} from 'Types/source';
import {
    INavigationPageSourceConfig, INavigationPositionSourceConfig,
    TNavigationDirection,
    TNavigationSource,
    TNavigationView
} from 'Controls/_interface/INavigation';

const fakeNavigationControllerNavigation = (source: TNavigationSource, view: TNavigationView, direction: TNavigationDirection, hasMore: boolean): INavigationOptionValue => {
    return {
        source,
        view,
        viewConfig: {
            pagingMode: 'direct'
        },
        sourceConfig: {
            limit: 5,
            position: 2,
            direction,
            field: 'key',
            pageSize: 3,
            page: 0,
            hasMore
        }
    };
};

const dataFaker = (query?: Query): Array<{ [p: string]: string | number }> => {
    return [
        {key: 1, buyerId: 1, date: '2016-06-01 12:12:45', amount: 96},
        {key: 2, buyerId: 2, date: '2016-06-02 09:01:12', amount: 174},
        {key: 3, buyerId: 1, date: '2016-06-03 10:24:28', amount: 475},
        {key: 4, buyerId: 1, date: '2016-06-02 14:12:45', amount: 96},
        {key: 5, buyerId: 2, date: '2016-06-02 16:01:12', amount: 174},
        {key: 6, buyerId: 1, date: '2016-06-04 13:24:28', amount: 475},
        {key: 7, buyerId: 1, date: '2016-06-05 14:12:45', amount: 96},
        {key: 8, buyerId: 2, date: '2016-06-05 16:01:12', amount: 174},
        {key: 9, buyerId: 1, date: '2016-06-06 17:24:28', amount: 475}
    ];
};

class DataSetFaker {
    private readonly _query: Query;

    constructor(query: Query) {
        this._query = query;
    }

    query(): DataSet {
        return new DataSet({
            rawData: {
                orders: dataFaker(this._query),
                buyers: [],
                total: {
                    dateFrom: '2016-06-01 00:00:00',
                    dateTo: '2016-07-01 00:00:00',
                    amount: 9
                },
                executeDate: '2016-06-27 11:34:57'
            },
            itemsProperty: 'orders',
            keyProperty: 'key'
        });
    }

    static instance = (query?: Query): DataSetFaker => {
        return new DataSetFaker(query);
    };
}

/**
 * @see also tests/ControlsUnit/Controllers/SourceController.test.js
 */
describe('Controls/_source/NavigationController', () => {
    describe('load', () => {
        it('Should build query using PagePaginatorController', () => {
            const navigation = fakeNavigationControllerNavigation('page', 'pages', 'after', false);
            const controller = new NavigationController({navigation});
            const query = controller.buildQuery();
            const meta = query.getMeta();
            assert.equal(meta.navigationType, 'Page');
            assert.equal(query.getLimit(), (navigation.sourceConfig as INavigationPageSourceConfig).pageSize);
            assert.equal(query.getOffset(), 0);

            // TODO change page!
        });
        it('Should build query using PositionPaginatorController', () => {
            const navigation = fakeNavigationControllerNavigation('position', 'infinity', 'after', false);
            const controller = new NavigationController({navigation});
            const query = controller.buildQuery();
            const meta = query.getMeta();
            assert.equal(meta.navigationType, 'Position');
            assert.equal(query.getLimit(), (navigation.sourceConfig as INavigationPositionSourceConfig).limit);
            assert.equal(query.getOffset(), 0);
            const where = query.getWhere();
            assert.equal(where['key>='], (navigation.sourceConfig as INavigationPositionSourceConfig).position);

            // TODO change page!
        });

        it('Should correctly merge query params', () => {
            const navigation = fakeNavigationControllerNavigation('position', 'infinity', 'both', true);
            // инициализируем контроллер
            const controller = new NavigationController({navigation});
            const recordSet: RecordSet = DataSetFaker.instance().query().getAll();
            recordSet.setMetaData({more: {after: true, before: false}, nextPosition: {before: [1], after: [7]}});
            controller.calculateState(recordSet);
            const query = controller.buildQuery();
            const meta = query.getMeta();
            assert.equal(meta.navigationType, 'Position');
            assert.equal(query.getLimit(), (navigation.sourceConfig as INavigationPositionSourceConfig).limit);
            assert.equal(query.getOffset(), 0);
            const where = query.getWhere();
            assert.equal(where['key~'], (navigation.sourceConfig as INavigationPositionSourceConfig).position);

            // TODO change page!

        });
    });
});
