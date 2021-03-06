import {DataLoader, ILoadDataResult, ILoadDataConfig, ILoadDataCustomConfig} from 'Controls/dataSource';
import {Memory} from 'Types/source';
import {ok, deepStrictEqual} from 'assert';
import {useFakeTimers} from 'sinon';

function getDataArray(): object[] {
    return [
        {
            id: 0,
            title: 'Sasha'
        },
        {
            id: 1,
            title: 'Sergey'
        },
        {
            id: 2,
            title: 'Dmitry'
        },
        {
            id: 3,
            title: 'Andrey'
        },
        {
            id: 4,
            title: 'Aleksey'
        }
    ];
}

function getSource(): Memory {
    return new Memory({
        data: getDataArray(),
        keyProperty: 'id'
    });
}

function getDataLoader(): DataLoader {
    return new DataLoader();
}

describe('Controls/dataSource:loadData', () => {

    it('loadData', async() => {
        const loadDataConfig = {
            source: getSource()
        };
        const loadDataResult = await getDataLoader().load([loadDataConfig]);

        ok(loadDataResult.length === 1);
        ok(loadDataResult[0].data.getCount() === 5);
        deepStrictEqual(loadDataResult[0].data.getRawData(), getDataArray());
    });

    it('loadData with filter', async () => {
        const loadDataConfig = {
            source: getSource(),
            filter: {
                title: 'Sasha'
            }
        };
        const loadDataResult = await getDataLoader().load([loadDataConfig]);

        ok(loadDataResult.length === 1);
        ok(loadDataResult[0].data.getCount() === 1);
    });

    it('loadData with several configs', async () => {
        const loadDataConfig = {
            source: getSource()
        };
        const loadDataConfigWithFilter = {
            source: getSource(),
            filter: {
                title: 'Sasha'
            }
        };
        const loadDataResult = await getDataLoader().load([loadDataConfig, loadDataConfigWithFilter]);

        ok(loadDataResult.length === 2);
        ok(loadDataResult[0].data.getCount() === 5);
        ok(loadDataResult[1].data.getCount() === 1);
    });

    it('loadData with filterButtonSource', async () => {
        const loadDataConfigWithFilter = {
            type: 'list',
            source: getSource(),
            filter: {},
            filterButtonSource: [
                {
                    name: 'title', value: 'Sasha', textValue: 'Sasha'
                }
            ]
        } as ILoadDataConfig;
        const loadDataResult = await getDataLoader().load<ILoadDataResult>([loadDataConfigWithFilter]);

        ok(loadDataResult.length === 1);
        ok((loadDataResult[0]).data.getCount() === 1);
        deepStrictEqual(
            (loadDataResult[0]).filter,
            {
                title: 'Sasha'
            }
        );
    });

    it('load with custom loader', async () => {
        const loadDataConfigCustomLoader = {
            type: 'custom',
            loadDataMethod: () => Promise.resolve({ testField: 'testValue' })
        } as ILoadDataCustomConfig;
        const loadDataResult = await getDataLoader().load([loadDataConfigCustomLoader]);

        ok(loadDataResult.length === 1);
        deepStrictEqual(loadDataResult[0], { testField: 'testValue' });
    });

    it('load with filterHistoryLoader', async () => {
        const historyItem = {
            name: 'title', value: 'Sasha', textValue: 'Sasha'
        };
        const loadDataConfigCustomLoader = {
            type: 'list',
            source: getSource(),
            filter: {},
            filterButtonSource: [
                {
                    name: 'title', value: '', textValue: ''
                }
            ],
            filterHistoryLoader: () => Promise.resolve({
                historyItems: [{...historyItem}],
                filter: {
                    city: 'Yaroslavl'
                }
            })
        };
        const loadDataResult = await getDataLoader().load([loadDataConfigCustomLoader]);

        deepStrictEqual(
            (loadDataResult[0] as ILoadDataResult).filter,
            {
                title: 'Sasha',
                city: 'Yaroslavl'
            }
        );
        deepStrictEqual(loadDataResult[0].historyItems, [{...historyItem}]);
    });

    it('loadEvery', async () => {
        const loadDataConfigs = [{source: getSource()}, {source: getSource()}];
        const loadDataPromises = getDataLoader().loadEvery(loadDataConfigs);
        const loadResults = await Promise.all(loadDataPromises);

        ok(loadDataPromises.length === 2);
        ok(loadResults.length === 2);
    });

});
