import {NewSourceController} from 'Controls/dataSource';
import {Memory} from 'Types/source';
import {ok} from 'assert';
import {RecordSet} from 'Types/collection';

const filterByEntries = (item, filter): boolean => {
    return filter.entries ? filter.entries.get('marked').includes(String(item.get('key'))) : true;
};

const filterByRoot = (item, filter): boolean => {
    return item.get('parent') === filter.parent;
};

const items = [
    {
        key: 0,
        title: 'Sasha'
    },
    {
        key: 1,
        title: 'Dmitry'
    },
    {
        key: 2,
        title: 'Aleksey'
    }
];

const hierarchyItems = [
    {
        key: 0,
        title: 'Интерфейсный фреймворк',
        parent: null
    },
    {
        key: 1,
        title: 'Sasha',
        parent: 0
    },
    {
        key: 2,
        title: 'Dmitry',
        parent: 0
    },
    {
        key: 3,
        title: 'Склад',
        parent: null
    },
    {
        key: 4,
        title: 'Michail',
        parent: 3
    }
];

function getMemoryWithHierarchyItems(): Memory {
    return new Memory({
        data: hierarchyItems,
        keyProperty: 'key',
        filter: filterByEntries
    });
}

function getControllerWithHierarchy(additionalOptions: object = {}): NewSourceController {
    const options = {
        source: getMemoryWithHierarchyItems(),
        parentProperty: 'parent',
        filter: {},
        keyProperty: 'key'
    };

    return new NewSourceController({...options, ...additionalOptions});
}

describe('Controls/dataSource:SourceController', () => {

    describe('load', () => {

        it('load with parentProperty',  async () => {
            const controller = getControllerWithHierarchy();
            const loadedItems = await controller.load();
            ok((loadedItems as RecordSet).getCount() === 5);
        });

        it('load with parentProperty and selectedKeys',  async () => {
            const controller = getControllerWithHierarchy({
                selectedKeys: [0],
                excludedKeys: []
            });
            const loadedItems = await controller.load();
            ok((loadedItems as RecordSet).getCount() === 1);
        });

    });
});
