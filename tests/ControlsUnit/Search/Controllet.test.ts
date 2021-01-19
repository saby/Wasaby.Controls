import {Controller} from 'Controls/search';
import {Memory} from 'Types/source';
import {ok} from 'assert';

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
        })

    })

});