import {ControllerClass} from 'Controls/search';
import {Memory} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {assert} from 'chai';
import {createSandbox} from 'sinon';

function getMemorySource(): Memory {
    return new Memory({
        data: [
            {
                id: 0,
                title: 'test'
            },
            {
                id: 1,
                title: 'test1'
            },
            {
                id: 2,
                title: 'test'
            },
            {
                id: 3,
                title: 'test2'
            }
        ]
    });
}

function getDefaultOptions() {
    return {
        searchParam: 'test',
        searchValue: '',
        minSearchLength: 3,
        searchDelay: 50,
        sorting: [],
        filter: {},
        keyProperty: 'id',
        source: getMemorySource(),
        navigation: {
            source: 'page',
            view: 'page',
            sourceConfig: {
                pageSize: 2,
                page: 0,
                hasMore: false
            }
        },
        loadingChangedCallback: () => {},
        filterChangedCallback: () => {},
        itemsChangedCallback: () => {}
    };
}

describe('Controls/search:ControllerClass', () => {
    let sandbox;

    beforeEach(() => {
        sandbox = createSandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it('isSearchValueChanged', () => {
        const searchController = new ControllerClass(getDefaultOptions(), {});
        searchController._searchValue = 'test';
        assert.isFalse(searchController._isSearchValueChanged('test'));

        searchController._searchValue = 'еуые';
        assert.isTrue(searchController._isSearchValueChanged('test'));

        searchController._inputSearchValue = 'test';
        assert.isFalse(searchController._isSearchValueChanged('test'));
    });

    it('isSearchValueShort', () => {
        const searchController = new ControllerClass(getDefaultOptions(), {});
        assert.isFalse(searchController._isSearchValueShort('test', 3));
        assert.isTrue(searchController._isSearchValueShort('te', 3));
        assert.isTrue(searchController._isSearchValueShort(undefined, 3));
    });

    it('destroy', () => {
        const searchController = new ControllerClass(getDefaultOptions(), {});
        const stub = sandbox.stub(searchController._getSearchController(getDefaultOptions()), 'abort');
        searchController.destroy();
        stub.withArgs(true);
    });

    it('_startSearch', async () => {
        const searchController = new ControllerClass(getDefaultOptions(), {});
        let errorProcessed = false;
        const error = new Error('error');
        error.canceled = true;
        searchController._getSearchController = () => {
            return {
                search: () => {
                    return Promise.resolve(error);
                }
            };
        };
        searchController._options.dataLoadErrback = () => {
            errorProcessed = true;
        };
        await searchController._startSearch('testValue');
        assert.isFalse(errorProcessed);
    });

    it('_setPath', () => {
        const newPath = 'test';
        const searchController = new ControllerClass(getDefaultOptions(), {});
        searchController._setPath(newPath);
        assert.equal(searchController._path, newPath);
    });

    it('isSearchValueEmpty', () => {
        const searchController = new ControllerClass(getDefaultOptions(), {});

        assert.isTrue(!!searchController._isSearchValueEmpty('', ''));
        assert.isFalse(!!searchController._isSearchValueEmpty('  ', ''));
        searchController._options.searchValueTrim = true;
        assert.isTrue(!!searchController._isSearchValueEmpty('  ', ''));
        assert.isFalse(!!searchController._isSearchValueEmpty('', 'test'));
        assert.isFalse(!!searchController._isSearchValueEmpty('test', ''));
    });

    it('filter updated on search errback', async () => {
        const options = getDefaultOptions();
        const searchController = new ControllerClass(options, {dataOptions: {}});
        let filter;

        options.filterChangedCallback = (newFilter) => {
            filter = newFilter;
        };
        searchController._searchErrback({}, {testField: 'testValue'});
        assert.deepEqual(filter, {testField: 'testValue'});
    });

    describe('constructor', () => {

        it('searchValueChangedCallback is not called on constructor', () => {
            let searchValueChangedCallbackCalled = false;
            const options = getDefaultOptions();
            options.searchValueChangedCallback = () => {
                searchValueChangedCallbackCalled = true;
            }
            options.searchValue = 'test';
            new ControllerClass(options, {});
            assert.isFalse(searchValueChangedCallbackCalled);
        });
    });

    it('update with switchedReturn', () => {
        const searchController = new ControllerClass(getDefaultOptions(), {});
        const options = {
            searchParam: 'title',
            searchValue: 'еуые',
            source: getMemorySource(),
            keyProperty: 'id',
            loadingChangedCallback: () => {},
            itemsChangedCallback: () => {}
        };
        const context = {
            dataOptions: {
                source: options.source
            }
        };

        searchController._options.searchDelay = 0;
        searchController._needStartSearchBySearchValueChanged = () => true;
        searchController._isNeedRecreateSearchControllerOnOptionsChanged = () => false;
        searchController._updateSearchParams = () => {};

        searchController.update(options, context).then(() => {
            assert.equal(searchController._searchValue, 'tst');
            assert.equal(searchController._misspellValue, 'test');
        });
    });

    it('update with new root', () => {
        const searchOptions = {...getDefaultOptions(), ...{ root: 'startRoot', searchValue: 'search'}};
        let searchStarted = false;
        const options = {
            searchValue: '',
            root: 'newRoot'
        };
        const searchController = new ControllerClass(searchOptions, {});
        searchController._dataOptions = {};
        const context = {
            dataOptions: {
                source: getMemorySource()
            }
        };
        searchController._startSearch = () => {
            searchStarted = true;
        };

        searchController.update(options, context);
        assert.equal(searchController._searchValue, '');
        assert.isFalse(searchStarted);
    });

    it('update with new viewMode', () => {
        const searchController = new ControllerClass(getDefaultOptions(), {});
        const options = {
            viewMode: 'test'
        };
        const context = {
            dataOptions: {
                source: getMemorySource()
            }
        };

        searchController._viewMode = 'search';
        searchController._dataOptions = {};

        searchController.update(options, context);
        assert.equal(searchController._viewMode, 'search');
    });

    describe('search', () => {
        it('search with searchStartCallback', () => {
            const options = getDefaultOptions();
            let isSearchStarted = false;
            let dataLoadCallbackCalled = false;

            options.searchStartCallback = () => {
                isSearchStarted = true;
            };
            options.dataLoadCallback = () => {
                dataLoadCallbackCalled = true;
            };
            const searchController = new ControllerClass(options, {});
            searchController._dataOptions = options;

            return new Promise((resolve) => {
                searchController.search('test', true).then(() => {
                    assert.isTrue(isSearchStarted);
                    assert.isTrue(dataLoadCallbackCalled);
                    resolve();
                });
            });
        });

        it('root is added to filter', async () => {
            const options = getDefaultOptions();
            let searchFilter;

            options.parentProperty = 'parent';
            options.searchStartCallback = (filter) => {
                searchFilter = filter;
            };
            const searchController = new ControllerClass(options, {});
            searchController._dataOptions = options;
            searchController._root = 'testRoot';
            searchController._path = new RecordSet({
                rawData: [
                    {
                        key: 'testKey',
                        parent: 'testParent'
                    }
                ],
                keyProperty: 'key'
            });

            await searchController.search('test', true);
            assert.isTrue(searchFilter.parent === 'testParent');
        });
    });
});
