import {default as Lookup} from 'Controls/_lookup/Lookup';
import {ILookupBaseControllerOptions} from 'Controls/_lookup/BaseControllerClass';
import {assert} from 'chai';
import {Memory} from 'Types/source';

async function getBaseLookup(options: ILookupBaseControllerOptions): Promise<Lookup> {
    const lookup = new Lookup(options);
    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    await lookup._beforeMount(options);
    lookup.saveOptions(options);
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
            const options = {
                source: getSource(),
                selectedKeys: []
            };
            const lookup = await getBaseLookup(options as unknown as ILookupBaseControllerOptions);
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

});
