import {assert} from 'chai';
import {Memory} from 'Types/source';
import {Record} from 'Types/entity';
import {RecordSet} from 'Types/collection';
import {NavigationController} from 'Controls/source';

const data = [
    {
        id : 1,
        title : 'Первый',
        type: 1
    },
    {
        id : 2,
        title : 'Второй',
        type: 2
    },
    {
        id : 3,
        title : 'Третий',
        type: 2
    }
];
const defFilter = {a: 'a', b: 'b'};
const defSorting = [{x: 'DESC'}, {y: 'ASC'}];
const TEST_PAGE_SIZE = 10;

describe('Controls/_source/NavigationController', () => {
    describe('Page navigation', () => {
        it('getQueryParams root, without config', () => {
            const nc = new NavigationController({
                navigationType: 'page',
                navigationConfig: {
                    page: 0,
                    pageSize: TEST_PAGE_SIZE,
                    hasMore: true
                }
            });

            const params = nc.getQueryParams({filter: defFilter, sorting: defSorting});
            assert.equal(TEST_PAGE_SIZE, params.limit, 'Wrong query params');
            assert.equal(0, params.offset, 'Wrong query params');
        });

        it('getQueryParams root + forward, without config', () => {
            const nc = new NavigationController({
                navigationType: 'page',
                navigationConfig: {
                    page: 0,
                    pageSize: TEST_PAGE_SIZE,
                    hasMore: true
                }
            });

            const params = nc.getQueryParams({filter: defFilter, sorting: defSorting});
            assert.equal(TEST_PAGE_SIZE, params.limit, 'Wrong query params');
            assert.equal(0, params.offset, 'Wrong query params');
        });
    });

});
