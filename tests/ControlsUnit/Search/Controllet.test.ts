import {Controller} from 'Controls/search';
import {Memory} from 'Types/source';
import {ok} from 'assert';
import {assert} from 'chai';

describe('Controls/search:Controller', () => {

    describe('_beforeUpdate', () => {

        it('root is changed', () => {
            const source = new Memory();
            let options = {
                source,
                keyProperty: 'id',
                root: 'testRoot'
            };
            const searchController = new Controller(options);
            searchController._beforeMount(options, {dataOptions: {}});
            searchController.saveOptions(options);

            ok(searchController._root === 'testRoot');

            options = {...options};
            options.root = 'testRoot2';
            searchController._beforeUpdate(options, {dataOptions: {}});
            ok(searchController._root === 'testRoot2');
        });

        it('searchValue wasn\'t changed', () => {
            const source = new Memory();
            const options = {
                source,
                keyProperty: 'id',
                root: 'testRoot',
                searchValue: 'testValue',
                sourceController: 'sourceController'
            };
            let searchControllerUpdated = false;
            const searchController = new Controller(options);

            searchController._options = options;
            searchController._searchController = {
                update: () => {
                    searchControllerUpdated = true;
                }
            };
            searchController._searchValue = 'testValue';
            searchController._beforeUpdate(options, {dataOptions: {}});
            assert.isFalse(searchControllerUpdated);
        });

        it('searchValue was changed', () => {
            const source = new Memory();
            const options = {
                source,
                keyProperty: 'id',
                root: 'testRoot',
                searchValue: 'testValue',
                sourceController: 'sourceController'
            };
            let searchControllerUpdated = false;

            const searchController = new Controller(options);
            searchController._beforeMount(options, {dataOptions: {}});

            searchController._searchController = {
                update: () => {
                    searchControllerUpdated = true;
                }
            };
            options.searchValue = 'newValue';

            searchController._beforeUpdate(options, {dataOptions: {}});
            assert.isTrue(searchControllerUpdated);
        });

        it('_searchValue not equal newOptions.searchValue', () => {
            const source = new Memory();
            const options = {
                source,
                keyProperty: 'id',
                root: 'testRoot',
                searchValue: 'testValue',
                sourceController: 'sourceController'
            };
            let searchControllerUpdated = false;

            const searchController = new Controller(options);
            searchController._beforeMount(options, {dataOptions: {}});

            searchController._searchController = {
                update: () => {
                    searchControllerUpdated = true;
                }
            };
            searchController._searchValue = 'newValue';

            searchController._beforeUpdate(options, {dataOptions: {}});
            assert.isTrue(searchControllerUpdated);
        });
    });
});
