import {Browser} from 'Controls/browser';
import {Memory} from 'Types/source';
import {equal} from 'assert';

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

        describe('searchValue on _beforeMount', () => {

            it('searchValue is longer then minSearchLength', () => {
                const options = getBrowserOptions();
                options.searchValue = 'Sash';
                const browser = getBrowser(options);
                browser._beforeMount(options, {});
                equal(browser._searchValue, 'Sash');
            });

        });
    });

});