import 'Core/polyfill/PromiseAPIDeferred';

import {assert} from 'chai';
import {NavigationController} from 'Controls/source';
import {INavigationOptionValue} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import {DataSet} from 'Types/source';
import {
    INavigationPageSourceConfig, INavigationPositionSourceConfig,
    TNavigationDirection,
    TNavigationSource
} from 'Controls/_interface/INavigation';
import {
    Direction,
    IAdditionalQueryParams,
    IAdditionQueryParamsMeta
} from '../../../Controls/_source/interface/IAdditionalQueryParams';
import {getGridData, SourceFaker} from 'Controls-demo/List/Utils/listDataGenerator';

const fakeNavigationControllerNavigation = (source: TNavigationSource, direction?: TNavigationDirection, hasMore?: boolean): INavigationOptionValue => {
    return {
        source,
        sourceConfig: {
            limit: 5,
            position: 2,
            direction,
            field: 'key',
            pageSize: 3,
            page: 0,
            hasMore: hasMore !== undefined ? hasMore : false;
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

/*
 * Это действие в контролах производится контролом пейджера при нажатии на кнопку >> или <<
 * @param currentPage
 * @param direction
 */
const pagerFaker = (currentPage: number): (direction: Direction) => number => {
    let page = currentPage;
    return (direction: Direction) => {
        if (direction === 'down') {
            page++;
        } else if (direction === 'up') {
            page--;
        }
        return page;
    };
};

/**
 * @see also tests/ControlsUnit/Controllers/SourceController.test.js
 */
describe('Controls/_source/NavigationController', () => {
    describe('getQueryParams + source="page"', () => {
        let navigation: INavigationOptionValue;
        let controller: NavigationController;
        let query: IAdditionalQueryParams;
        let queryMeta: IAdditionQueryParamsMeta;

        beforeEach(() => {
            navigation = fakeNavigationControllerNavigation('page');
            controller = new NavigationController({navigation});
        });

        it('should build query using PageQueryParamsController', () => {
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

        it('should correctly calculate next page params', () => {
            query = controller.getQueryParams('down');
            queryMeta = query.meta;
            assert.equal(query.offset, query.limit);
        });

        it('should previous page params', () => {
            const pager = pagerFaker(0);

            // query params for page 0;
            query = controller.getQueryParams();

            // click >>
            query = controller.getQueryParams('down');
            controller.setPageNumber(pager('down'));

            // click <<
            query = controller.getQueryParams('up');

            queryMeta = query.meta;
            assert.equal(query.offset, 0);
        });
    });

    describe('getQueryParams + source="position"', () => {
        let navigation: INavigationOptionValue;
        let controller: NavigationController;
        let query: IAdditionalQueryParams;
        let queryMeta: IAdditionQueryParamsMeta;

        beforeEach(() => {
            navigation = fakeNavigationControllerNavigation('position', 'after', false);
            controller = new NavigationController({navigation});
        });

        it('should build query using PositionQueryParamsController', () => {
            query = controller.getQueryParams();
            queryMeta = query.meta;
            assert.equal(queryMeta.navigationType, 'Position');
            assert.equal(query.limit, (navigation.sourceConfig as INavigationPositionSourceConfig).limit);
            const where = query.filter;
            assert.equal(where['key>='], (navigation.sourceConfig as INavigationPositionSourceConfig).position);
        });

        it('should correctly calculate next page params', () => {
            const recordSet = source.querySync().getAll();
            recordSet.setMetaData({
                more: 100, // valid when INavigationOptionValue.hasMore === false
                total: recordSet.getRawData().length
            });

            // query = controller.getQueryParams('down');
            // queryMeta = query.meta;

            // TODO change page to next!

            // console.log(query);

           // assert.equal(query.offset, query.limit);
        });

        it('should previous page params', () => {
            // TODO change page to prev!
        });

    });

    describe('Should correctly merge query params', () => {
        it('Should correctly merge query params', () => {
            const navigation = fakeNavigationControllerNavigation('position', 'both', true);
            // инициализируем контроллер
            const controller = new NavigationController({navigation});
            return source.query()
                .then((data) => {
                    const recordSet: RecordSet = data.getAll();
                    recordSet.setMetaData({more: {after: true, before: false}, nextPosition: {before: [1], after: [7]}});
                    controller.calculateState(recordSet, null);

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
