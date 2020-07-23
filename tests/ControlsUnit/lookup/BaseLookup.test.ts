import {default as Lookup} from 'Controls/_lookup/Lookup';
import {ILookupBaseControllerOptions} from 'Controls/_lookup/BaseControllerClass';
import {assert} from 'chai';
import {Memory} from 'Types/source';
import {Model} from 'Types/entity';
import {stub} from 'sinon';
import {SyntheticEvent} from 'Vdom/Vdom';

async function getBaseLookup(options?: ILookupBaseControllerOptions): Promise<Lookup> {
    const lookupOptions = options || {
        source: getSource(),
        selectedKeys: []
    };
    const lookup = new Lookup(lookupOptions);
    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    await lookup._beforeMount(lookupOptions);
    lookup.saveOptions(lookupOptions);
    return lookup;
}

function getSource(): Memory {
    const data = [
        {
            id: 0,
            title: 'Sasha'
        },
        {
            id: 1,
            title: 'Aleksey'
        },
        {
            id: 2,
            title: 'Dmitry'
        }
    ];

    return new Memory({
        data,
        keyProperty: 'id'
    });
}

describe('Controls/lookup:Input', () => {

    describe('_beforeMount', () => {

        it('with source and without selectedKeys', async () => {
            const lookup = await getBaseLookup();
            assert.deepStrictEqual(lookup._items.getCount(), 0);
        });

        it('without source and without selectedKeys', async () => {
            const options = {
                source: null,
                selectedKeys: []
            };
            const lookup = await getBaseLookup(options as unknown as ILookupBaseControllerOptions);
            assert.deepStrictEqual(lookup._items.getCount(), 0);
        });

    });

    describe('handlers', () => {

        it('addItem', async () => {
            const lookup = await getBaseLookup();
            lookup._addItem(new Model());
            assert.deepStrictEqual(lookup._items.getCount(), 1);
        });

    });

});
