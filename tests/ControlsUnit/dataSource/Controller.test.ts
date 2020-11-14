import {NewSourceController, ISourceControllerOptions} from 'Controls/dataSource';
import {Memory, PrefetchProxy, DataSet} from 'Types/source';
import {ok, deepStrictEqual} from 'assert';
import {RecordSet} from 'Types/collection';
import {INavigationPageSourceConfig, INavigationOptionValue} from 'Controls/interface';

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

function getPagingNavigation(hasMore: boolean = false): INavigationOptionValue<INavigationPageSourceConfig> {
    return {
        source: 'page',
        sourceConfig: {
            pageSize: 1,
            page: 0,
            hasMore
        }
    };
}

function getControllerWithHierarchy(additionalOptions: object = {}): NewSourceController {
    return new NewSourceController({...getControllerWithHierarchyOptions(), ...additionalOptions});
}

function getController(additionalOptions: object = {}): NewSourceController {
    return new NewSourceController({...getControllerOptions(), ...additionalOptions});
}

describe('Controls/dataSource:SourceController', () => {

    describe('getState', () => {
        it('getState after create controller', () => {
            const root = 'testRoot';
            const parentProperty = 'testParentProperty';
            let hierarchyOptions;
            let controller;
            let controllerState;

            hierarchyOptions = {
                root,
                parentProperty
            };
            controller = new NewSourceController(hierarchyOptions);
            controllerState = controller.getState();
            ok(controllerState.parentProperty === parentProperty);
            ok(controllerState.root === root);

            hierarchyOptions = {
                parentProperty
            };
            controller = new NewSourceController(hierarchyOptions);
            controllerState = controller.getState();
            ok(controllerState.parentProperty === parentProperty);
            ok(controllerState.root === null);
        });
    });

    describe('load', () => {

        it('load with parentProperty',  async () => {
            const controller = getControllerWithHierarchy();
            const loadedItems = await controller.load();
            ok((loadedItems as RecordSet).getCount() === 5);
        });

        it('load call while loading',  async () => {
            const controller = getController();
            let loadPromiseWasCanceled = false;

            controller.load().catch(() => {
                loadPromiseWasCanceled = true;
            });

            await controller.load();
            ok(loadPromiseWasCanceled);
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
            let isChanged;
            options.root = 'testRoot';

            isChanged = controller.updateOptions(options);
            ok(controller._root === 'testRoot');
            ok(isChanged);

            options = {...options};
            options.root = undefined;
            isChanged = controller.updateOptions(options);
            ok(controller._root === 'testRoot');
            ok(!isChanged);
        });

        it('updateOptions with expandedItems',  async () => {
            const controller = getControllerWithHierarchy();
            let options = {...getControllerWithHierarchyOptions()};

            options.expandedItems = [];
            controller.updateOptions(options);
            deepStrictEqual(controller._expandedItems, []);

            options = {...options};
            options.expandedItems = ['testRoot'];
            controller.updateOptions(options);
            deepStrictEqual(controller._expandedItems, ['testRoot']);

            options = {...options};
            delete options.expandedItems;
            controller.updateOptions(options);
            deepStrictEqual(controller._expandedItems, ['testRoot']);
        });
    });

    describe('setItems', () => {

        it('navigation is updated before assign items', () => {
            const controller = getController({
                navigation: getPagingNavigation(true)
            });
            controller.setItems(new RecordSet({
                rawData: items,
                keyProperty: 'key'
            }));
            const controllerItems = controller.getItems();

            let hasMoreResult;
            controllerItems.subscribe('onCollectionChange', () => {
                hasMoreResult = controller.hasMoreData('down');
            });

            let newControllerItems = controllerItems.clone();
            newControllerItems.setMetaData({
                more: false
            });
            controller.setItems(newControllerItems);
            ok(!hasMoreResult);

            newControllerItems = controllerItems.clone();
            newControllerItems.setMetaData({
                more: true
            });
            controller.setItems(newControllerItems);
            ok(hasMoreResult);
        });

    });
});
