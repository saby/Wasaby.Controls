import {ICrud, Memory, PrefetchProxy} from 'Types/source';
import {deepStrictEqual} from "assert";

import {DataLoader} from 'Controls/_dataSource/error';

const data = [
    {key: 1, title: 'Ярославль'},
    {key: 2, title: 'Москва'},
    {key: 3, title: 'Санкт-Петербург'}
];

describe('Controls/_dataSource/_error/DataLoader', () => {
    let memory: Memory;

    describe('load', () => {
        it('load function is', async () => {
            memory = new Memory({
                data: [...data],
                keyProperty: 'id'
            });

            const {sources} = await DataLoader.load([{source: memory}], 2000);
            const {source}: { source: ICrud | PrefetchProxy } = sources[0];
            if (source instanceof PrefetchProxy) {
                const {query} = source.getData();
                const rawData = query.getRawData();
                deepStrictEqual(rawData, data, 'Wrong responce data');
            }
        });
    });
});
