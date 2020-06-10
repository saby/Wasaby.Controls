import {assert} from 'chai';
import {Memory} from 'Types/source';
import {Record} from 'Types/entity';
import {RecordSet} from 'Types/collection';
import {NavigationController} from 'Controls/source';

const dataPrev = [
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

const data = [
    {
        id : 4,
        title : 'Четвертый',
        type: 1
    },
    {
        id : 5,
        title : 'Пятый',
        type: 2
    },
    {
        id : 6,
        title : 'Шестой',
        type: 2
    }
];

const dataNext = [
    {
        id : 7,
        title : 'Седьмой',
        type: 1
    },
    {
        id : 8,
        title : 'Восьмой',
        type: 2
    },
    {
        id : 9,
        title : 'Девятый',
        type: 2
    }
];

const defFilter = {a: 'a', b: 'b'};
const defSorting = [{x: 'DESC'}, {y: 'ASC'}];
const TEST_PAGE_SIZE = 10;

describe('Controls/_source/NavigationController', () => {
    describe('Page navigation', () => {
        describe('Without config', () => {
            it('getQueryParams root', () => {
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

            it('getQueryParams root + forward', () => {
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: 0,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true
                    }
                });

                const params = nc.getQueryParams({filter: defFilter, sorting: defSorting}, null, 'forward');
                assert.equal(TEST_PAGE_SIZE, params.limit, 'Wrong query params');
                assert.equal(TEST_PAGE_SIZE, params.offset, 'Wrong query params');
            });

            it('getQueryParams root + backward', () => {
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: 2,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true
                    }
                });

                const params = nc.getQueryParams({filter: defFilter, sorting: defSorting}, null, 'backward');
                assert.equal(TEST_PAGE_SIZE, params.limit, 'Wrong query params');
                assert.equal(TEST_PAGE_SIZE, params.offset, 'Wrong query params');
            });

            it('updateQueryProperties root', () => {
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: 0,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true
                    }
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id'
                });

                const params = nc.updateQueryProperties(rs);
                assert.equal(1, params.nextPage, 'Wrong query properties');
                assert.equal(-1, params.prevPage, 'Wrong query properties');
            });

            it('updateQueryProperties root + forward, without config', () => {
                const START_PAGE = 0;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true
                    }
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id'
                });

                const params = nc.updateQueryProperties(rs, null, undefined, 'forward');
                assert.equal(START_PAGE + 2, params.nextPage, 'Wrong query properties');
                assert.equal(START_PAGE - 1, params.prevPage, 'Wrong query properties');
            });

            it('updateQueryProperties root + backward, without config', () => {
                const START_PAGE = 2;
                const nc = new NavigationController({
                    navigationType: 'page',
                    navigationConfig: {
                        page: START_PAGE,
                        pageSize: TEST_PAGE_SIZE,
                        hasMore: true
                    }
                });

                const rs = new RecordSet({
                    rawData: data,
                    keyProperty: 'id'
                });

                const params = nc.updateQueryProperties(rs, null, undefined, 'backward');
                assert.equal(START_PAGE + 1, params.nextPage, 'Wrong query properties');
                assert.equal(START_PAGE - 2, params.prevPage, 'Wrong query properties');
            });
        });

    });
    describe('Position navigation', () => {
        describe('Without config', () => {
            it('getQueryParams root bothways', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: 1,
                        field: 'id',
                        direction: 'bothways',
                        limit: 3
                    }
                });

                const params = nc.getQueryParams({filter: defFilter, sorting: defSorting});
                assert.equal(1, params.filter['id~'], 'Wrong query params');
            });

            it('getQueryParams root forward', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: 1,
                        field: 'id',
                        direction: 'forward',
                        limit: 3
                    }
                });

                const params = nc.getQueryParams({filter: defFilter, sorting: defSorting});
                assert.equal(1, params.filter['id>='], 'Wrong query params');
            });

            it('getQueryParams root backward', () => {
                const nc = new NavigationController({
                    navigationType: 'position',
                    navigationConfig: {
                        position: 1,
                        field: 'id',
                        direction: 'backward',
                        limit: 3
                    }
                });

                const params = nc.getQueryParams({filter: defFilter, sorting: defSorting});
                assert.equal(1, params.filter['id<='], 'Wrong query params');
            });
        });
    }
});
