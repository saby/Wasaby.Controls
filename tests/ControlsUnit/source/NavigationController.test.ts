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
import {
    IAdditionalQueryParams,
    IAdditionQueryParamsMeta
} from '../../../Controls/_source/interface/IAdditionalQueryParams';
import {getGridData, SourceFaker} from 'Controls-demo/List/Utils/listDataGenerator';

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

const NUMBER_OF_ITEMS = 100;

const rawData = getGridData(NUMBER_OF_ITEMS, {
    buyerId: {
        value: 0,
        type: 'number'
    },
    amount: {
        value: 96,
        type: 'number'
    }
}, 'key');

const source = SourceFaker.instance({}, new DataSet({
    rawData,
    keyProperty: 'key'
}), false);

/**
 * @see also tests/ControlsUnit/Controllers/SourceController.test.js
 */
describe('Controls/_source/NavigationController', () => {
    describe('getQueryParams + view="pages" + source="pages"', () => {
        let navigation: INavigationOptionValue;
        let controller: NavigationController;
        let query: IAdditionalQueryParams;
        let queryMeta: IAdditionQueryParamsMeta;

        beforeEach(() => {
            navigation = fakeNavigationControllerNavigation('page', 'pages', 'after', false);
            controller = new NavigationController({navigation});
        });

        it('should build query using PagePaginatorController', () => {
            query = controller.getQueryParams();
            queryMeta = query.meta;
            assert.equal(queryMeta.navigationType, 'Page');
            assert.equal(query.limit, (navigation.sourceConfig as INavigationPageSourceConfig).pageSize);
            assert.equal(query.offset, 0);
        });

        it('should correctly set particular page number', () => {
            controller.setPageNumber(1);
            query = controller.getQueryParams();
            queryMeta = query.meta;
            assert.equal(query.offset, query.limit);
        });

        it('should correctly go to the next page', () => {
            query = controller.getQueryParams('down');
            queryMeta = query.meta;
            assert.equal(query.offset, query.limit);
        });

        // it('should correctly go to the previous page', () => {
        //     const dataSet = source.querySync();
        //     const recordSet = dataSet.getAll();
        //     recordSet.setMetaData({
        //         more: 100 // valid when INavigationOptionValue.hasMore === false
        //     });
        //     controller.calculateState(recordSet);
        //     query = controller.getQueryParams('down');
        //
        //     controller.calculateState(recordSet, 'down');
        //     query = controller.getQueryParams('down');
        //
        //     controller.calculateState(recordSet, 'down');
        //     query = controller.getQueryParams('up');
        //
        //     queryMeta = query.meta;
        //     assert.equal(query.offset, query.limit);
        // });
        // TODO change page to prev!

    });
    describe('getQueryParams', () => {
        it('Should build query using PagePaginatorController + view="infinity"', () => {
            const navigation = fakeNavigationControllerNavigation('page', 'infinity', 'after', false);
            const controller = new NavigationController({navigation});
            const query = controller.getQueryParams();
            const meta = query.meta;
            assert.equal(meta.navigationType, 'Page');
            assert.equal(query.limit, (navigation.sourceConfig as INavigationPageSourceConfig).pageSize);
            assert.equal(query.offset, 0);

            // TODO change page to next!
            // TODO change page to prev!
            // TODO change page to particular page!
        });
        it('Should build query using PositionPaginatorController', () => {
            const navigation = fakeNavigationControllerNavigation('position', 'infinity', 'after', false);
            const controller = new NavigationController({navigation});
            const query = controller.getQueryParams();
            const meta = query.meta;
            assert.equal(meta.navigationType, 'Position');
            assert.equal(query.limit, (navigation.sourceConfig as INavigationPositionSourceConfig).limit);
            const where = query.filter;
            assert.equal(where['key>='], (navigation.sourceConfig as INavigationPositionSourceConfig).position);

            // TODO change page to next!
            // TODO change page to prev!
            // TODO change page to particular position!
        });

        it('Should correctly merge query params', () => {
            const navigation = fakeNavigationControllerNavigation('position', 'infinity', 'both', true);
            // инициализируем контроллер
            const controller = new NavigationController({navigation});
            return source.query()
                .then((data) => {
                    const recordSet: RecordSet = data.getAll();
                    recordSet.setMetaData({more: {after: true, before: false}, nextPosition: {before: [1], after: [7]}});
                    controller.calculateState(recordSet);

                    const query = controller.getQueryParams();
                    const meta = query.meta;
                    assert.equal(meta.navigationType, 'Position');
                    assert.equal(query.limit, (navigation.sourceConfig as INavigationPositionSourceConfig).limit);
                    const where = query.filter;
                    assert.equal(where['key~'], (navigation.sourceConfig as INavigationPositionSourceConfig).position);

                    // TODO change page to next!
                    // TODO change page to prev!
                    // TODO change page to particular!
                })
                .catch((e) => {
                    assert.isNotTrue(true, 'This query should not throw any errors!');
                });
        });
    });
});
