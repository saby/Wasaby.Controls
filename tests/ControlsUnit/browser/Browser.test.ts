import {Browser} from 'Controls/browser';
import {Memory} from 'Types/source';
import {equal, deepStrictEqual} from 'assert';

const browserData = [
    {
        id: 0,
        name: 'Sasha'
    },
    {
        id: 1,
        name: 'Aleksey'
    },
    {
        id: 2,
        name: 'Dmitry'
    }
];

function getBrowserOptions(): object {
    return {
        minSearchLength: 3,
        source: new Memory({
            keyProperty: 'id',
            data: browserData
        }),
        searchParam: 'name'
    };
}

function getBrowser(options: object = {}): Browser {
    return new Browser(options);
}

describe('Controls/browser:Browser', () => {

    describe('_beforeMount', () => {

        describe('searchController', () => {

            describe('searchValue on _beforeMount', () => {

                it('searchValue is longer then minSearchLength', () => {
                    const options = getBrowserOptions();
                    options.searchValue = 'Sash';
                    const browser = getBrowser(options);
                    return new Promise((resolve) => {
                        browser._beforeMount(options, {}).then(() => {
                            equal(browser._searchValue, 'Sash');
                            resolve();
                        });
                    });
                });

                it('filter in context without source on _beforeMount', () => {
                    const options = getBrowserOptions();
                    const filter = {
                        testField: 'testValue'
                    };
                    options.source = null;
                    options.filter = filter;

                    const browser = getBrowser(options);
                    browser._beforeMount(options, {});
                    equal(browser._dataOptionsContext.filter, filter);
                    equal(browser._filter, filter);
                    deepStrictEqual(browser._searchController._dataOptions.filter, filter);
                });

            });
        });

    });

    describe('_beforeUpdate', () => {

        describe('searchController', () => {

            it('context in searchController updated', async () => {
                const options = getBrowserOptions();
                const filter = {
                    testField: 'testValue'
                };
                options.filter = filter;
                const browser = getBrowser(options);
                await browser._beforeMount(options);

                browser._beforeUpdate(options);
                deepStrictEqual(browser._searchController._dataOptions.filter, filter);
            });

        });

    });

});
