import 'Core/polyfill/PromiseAPIDeferred';

import {assert} from 'chai';
import {NavigationController} from 'Controls/source';
import {INavigationOptionValue} from 'Controls/interface';
import {RecordSet} from 'Types/collection';
import {DataSet} from 'Types/source';
import {
    INavigationPageSourceConfig, INavigationPositionSourceConfig,
    TNavigationDirection
} from 'Controls/_interface/INavigation';
import {
    Direction,
    IAdditionalQueryParams,
    IAdditionQueryParamsMeta
} from 'Controls/_source/interface/IAdditionalQueryParams';
import {getGridData, SourceFaker} from 'Controls-demo/List/Utils/listDataGenerator';

const fakePageNavigationConfig = (hasMore?: boolean): INavigationOptionValue<INavigationPageSourceConfig> => {
    return {
        source: 'page',
        sourceConfig: {
            pageSize: 3,
            page: 0,
            hasMore: hasMore !== undefined ? hasMore : false
        } as INavigationPageSourceConfig
    };
};

const fakePositionNavigationConfig = (direction?: TNavigationDirection): INavigationOptionValue<INavigationPositionSourceConfig> => {
    return {
        source: 'position',
        sourceConfig: {
            limit: 5,
            position: 55,
            direction: direction ? direction : 'after',
            field: 'key'
        } as INavigationPositionSourceConfig
    };
};

const NUMBER_OF_ITEMS = 50;

class DataFaker {
    _rawData: any[];
    _source: SourceFaker;

    constructor() {
        this._rawData = this._initRawData(0);
        this._source = this._initSource(this._rawData);
    }

    private _initRawData(startIndex: number = 0): any[] {
        return getGridData(NUMBER_OF_ITEMS, {
            buyerId: {
                value: 0,
                type: 'number'
            },
            amount: {
                value: 0,
                type: 'number'
            }
        }, 'key', startIndex);
    }

    private _initSource(rawData: any[]): SourceFaker {
        return SourceFaker.instance({}, new DataSet({
            rawData,
            keyProperty: 'key'
        }), false);
    }

    getRawData(): any[] {
        return this._rawData;
    }

    getSource(reset?: boolean, startIndex: number = 0): SourceFaker {
        if (reset) {
            this._rawData = this._initRawData(startIndex);
            this._source = this._initSource(this._rawData);
        }
        return this._source;
    }
}

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

/*
 * считает последнее значение ключевого поля от выбранного набора данных
 * @param rs
 * @param direction
 */
const lastKey = (rs: RecordSet, direction?: Direction): number => {
    return rs.at(rs.getCount() - 1).getKey() + (direction === 'up' ? 1 : 0);
};

/**
 * @see also tests/ControlsUnit/Controllers/SourceController.test.js
 */
describe('Controls/_source/NavigationController', () => {
    let source: DataFaker;

    let recordSet: RecordSet;
    let moreRecordSet: RecordSet;
    let more2RecordSet: RecordSet;

    beforeEach(() => {
        source = new DataFaker();
        recordSet = source.getSource().querySync().getAll();
        moreRecordSet = source.getSource(true, lastKey(recordSet, 'up')).querySync().getAll();
        more2RecordSet = source.getSource(true, lastKey(moreRecordSet, 'up')).querySync().getAll();
    });

    describe('getQueryParams + source="page"', () => {
        let navigation: INavigationOptionValue<INavigationPageSourceConfig>;
        let controller: NavigationController;
        let query: IAdditionalQueryParams;
        let queryMeta: IAdditionQueryParamsMeta;

        beforeEach(() => {
            navigation = fakePageNavigationConfig();
            controller = new NavigationController({navigation});
        });

        it('should build query using PageQueryParamsController', () => {
            query = controller.getQueryParams();
            queryMeta = query.meta;
            assert.equal(queryMeta.navigationType, 'Page');
            assert.equal(query.limit, navigation.sourceConfig.pageSize);
            assert.equal(query.offset, 0);
        });

        it('should correctly set particular page number', () => {
            navigation.sourceConfig.page = 1;
            controller.setConfig(navigation.sourceConfig);
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
            navigation.sourceConfig.page = pager('down');
            controller.setConfig(navigation.sourceConfig);

            // click <<
            query = controller.getQueryParams('up');

            queryMeta = query.meta;
            assert.equal(query.offset, 0);
        });
    });

    describe('getQueryParams + source="position" + direction="after"', () => {
        let navigation: INavigationOptionValue<INavigationPositionSourceConfig>;
        let controller: NavigationController;
        let query: IAdditionalQueryParams;

        beforeEach(() => {
            navigation = fakePositionNavigationConfig('after');
            controller = new NavigationController({navigation});
        });

        it('should build query using PositionQueryParamsController', () => {
            query = controller.getQueryParams();
            const queryMeta = query.meta;
            assert.equal(queryMeta.navigationType, 'Position');
            assert.equal(query.limit, navigation.sourceConfig.limit);
            const where = query.filter;
            assert.equal(where['key>='], navigation.sourceConfig.position);
        });

        it('should correctly build params for first query', () => {
            recordSet.setMetaData({
                /*
                 * valid when INavigationOptionValue.direction !== 'both'
                 * OR calculateState.direction is set
                 */
                more: true
            });
            controller.calculateState(recordSet, null);
            query = controller.getQueryParams();
            const where = query.filter;
            assert.equal(where['key>='], navigation.sourceConfig.position);
        });

        it('should correctly calculate next page params', () => {
            recordSet.setMetaData({
                /*
                 * valid anyway
                 */
                more: more2RecordSet
            });
            controller.calculateState(recordSet, 'down');
            query = controller.getQueryParams('down');
            const where = query.filter;
            assert.equal(where['key>='], more2RecordSet.getCount() - 1);
        });
    });

    describe('getQueryParams + source="position" + direction="both"', () => {
        let navigation: INavigationOptionValue<INavigationPositionSourceConfig>;
        let controller: NavigationController;
        let query: IAdditionalQueryParams;

        beforeEach(() => {
            navigation = fakePositionNavigationConfig('both');
            controller = new NavigationController({navigation});
        });

        it('Should correctly calculate query params', () => {
            let where;
            moreRecordSet.setMetaData({
                more: {
                    /*
                     * valid when INavigationOptionValue.direction === 'both'
                     * and calculateState.direction isn't set
                     */
                    after: true, before: true
                }
            });
            controller.calculateState(moreRecordSet, null);

            // when we want to go next before current position
            query = controller.getQueryParams('up');
            where = query.filter;
            assert.equal(where['key<='], lastKey(recordSet, 'up'));

            // when we want to go next after current position
            query = controller.getQueryParams('down');
            where = query.filter;
            assert.equal(where['key>='], lastKey(moreRecordSet, 'down'));

            // when we want to calculate params for current position
            query = controller.getQueryParams();
            where = query.filter;
            assert.equal(where['key~'], navigation.sourceConfig.position);
        });

        it('should correctly calculate previous page params', () => {
            moreRecordSet.setMetaData({
                more: {
                    /*
                     * valid when INavigationOptionValue.direction === 'both'
                     * and calculateState.direction isn't set
                     */
                    after: true, before: true
                }
            });
            controller.calculateState(moreRecordSet, null);
            more2RecordSet.setMetaData({
                /*
                 * valid when INavigationOptionValue.direction !== 'both'
                 * OR calculateState.direction is set
                 */
                more: true
            });
            controller.calculateState(more2RecordSet, 'up');
            query = controller.getQueryParams('up');
            const where = query.filter;
            assert.equal(where['key<='], lastKey(moreRecordSet, 'up'));
        });
    });

    describe('getQueryParams + filter + sort', () => {
        let navigation: INavigationOptionValue<INavigationPositionSourceConfig | INavigationPageSourceConfig>;
        let controller: NavigationController;
        let query: IAdditionalQueryParams;

        it('Should correctly merge query params + source="position" + direction="after"', () => {
            navigation = fakePositionNavigationConfig('after');
            controller = new NavigationController({navigation});
            recordSet.setMetaData({
                /*
                 * valid when INavigationOptionValue.direction !== 'both'
                 * OR calculateState.direction is set
                 */
                more: true
            });
            controller.calculateState(recordSet, null);
            const sorting = [{amount: false}, {buyerId: true}];
            query = controller.getQueryParams(null, {
                'buyerId>': 2
            }, sorting);

            const where = query.filter;
            assert.equal(where['buyerId>'], 2);
            assert.equal(where['key>='], (navigation.sourceConfig as INavigationPositionSourceConfig).position);
            assert.equal(query.sorting[1], sorting[1]);
        });
    });
});
