import {NewSourceController, ISourceControllerOptions} from 'Controls/dataSource';
import {Memory, PrefetchProxy, DataSet} from 'Types/source';
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
    },
    {
        key: 3,
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

function getMemory(): Memory {
    return new Memory({
        data: items,
        keyProperty: 'key'
    });
}

function getPrefetchProxy(): PrefetchProxy {
    return new PrefetchProxy({
        target: getMemory(),
        data: {
            query: new DataSet({
                rawData: items.slice(0, 2),
                keyProperty: 'key'
            })
        }
    });
}

function getControllerOptions(): ISourceControllerOptions {
    return {
        source: getMemory(),
        filter: {},
        keyProperty: 'key'
    };
}

function getControllerWithHierarchyOptions(): ISourceControllerOptions {
    return {
        source: getMemoryWithHierarchyItems(),
        parentProperty: 'parent',
        filter: {},
        keyProperty: 'key'
    };
}

function getMemoryWithHierarchyItems(): Memory {
    return new Memory({
        data: hierarchyItems,
        keyProperty: 'key',
        filter: filterByEntries
    });
}

function getControllerWithHierarchy(additionalOptions: object = {}): NewSourceController {
    return new NewSourceController({...getControllerWithHierarchyOptions(), ...additionalOptions});
}

function getController(additionalOptions: object = {}): NewSourceController {
    return new NewSourceController({...getControllerOptions(), ...additionalOptions});
}

describe('Controls/dataSource:SourceController', () => {

    describe('load', () => {

        it('load with parentProperty',  async () => {
            const controller = getControllerWithHierarchy();
            const loadedItems = await controller.load();
            ok((loadedItems as RecordSet).getCount() === 5);
        });

        it('load with parentProperty and selectedKeys',  async () => {
            let controller = getControllerWithHierarchy({
                selectedKeys: [0],
                excludedKeys: []
            });
            let loadedItems = await controller.load();
            ok((loadedItems as RecordSet).getCount() === 1);

            controller = getControllerWithHierarchy({
                selectedKeys: [0]
            });
            loadedItems = await controller.load();
            ok((loadedItems as RecordSet).getCount() === 1);
        });

        it('load with prefetchProxy in options',  async () => {
            const controller = getController({
                source: getPrefetchProxy(),
                navigation: {
                    source: 'page',
                    sourceConfig: {
                        pageSize: 2,
                        hasMore: false
                    }
                }
            });

            let loadedItems = await controller.load();
            ok((loadedItems as RecordSet).getCount() === 2);
            ok((loadedItems as RecordSet).at(0).get('title') === 'Sasha');

            loadedItems = await controller.load('down');
            ok((loadedItems as RecordSet).getCount() === 2);
            ok((loadedItems as RecordSet).at(0).get('title') === 'Aleksey');
        });
    });

    describe('updateOptions', () => {
        it('updateOptions with root',  async () => {
            const controller = getControllerWithHierarchy();
            let options = {...getControllerWithHierarchyOptions()};
            options.root = 'testRoot';

            controller.updateOptions(options);
            ok(controller._root === 'testRoot');

            options = {...getControllerWithHierarchyOptions()};
            options.root = undefined;
            controller.updateOptions(options);
            ok(controller._root === 'testRoot');
        });
    });
});
