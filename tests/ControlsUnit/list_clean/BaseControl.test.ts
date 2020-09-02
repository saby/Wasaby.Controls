import {assert} from 'chai';
import {BaseControl, ListViewModel} from 'Controls/list';
import * as Env from 'Env/Env';
import {RecordSet} from 'Types/collection';

describe('Controls/list_clean/BaseControl', () => {
    // https://online.sbis.ru/opendoc.html?guid=9a6f0437-ea6d-4d7f-b163-25dc8f244c64
    describe('BaseControl created _inertialScrolling', () => {
        const baseControlCfg = {
            viewName: 'Controls/List/ListView',
            keyProperty: 'id',
            viewModelConstructor: ListViewModel,
            items: new RecordSet({
                keyProperty: 'id',
                rawData: []
            })
        };
        let baseControl;

        beforeEach(() => {
            Env.detection.isMobileIOS = true;
            baseControl = new BaseControl(baseControlCfg);
        });

        afterEach(() => {
            baseControl.destroy();
            baseControl = undefined;
            if (typeof window === 'undefined') {
                Env.detection.isMobileIOS = undefined;
            } else {
                Env.detection.isMobileIOS = false;
            }
        });

        it('_inertialScrolling == null', () => {
            baseControl._beforeMount(baseControlCfg);
            baseControl._container = {getElementsByClassName: () => ([{clientHeight: 100, offsetHeight: 0}])};
            baseControl._afterMount();
            assert.isFalse(!!baseControl._inertialScrolling);
        });
        it('created _inertialScrolling', () => {
            baseControl._beforeMount(baseControlCfg);
            baseControl._container = {getElementsByClassName: () => ([{clientHeight: 100, offsetHeight: 0}])};
            baseControl._afterMount();
            baseControl.scrollMoveSyncHandler();
            assert.isTrue(!!baseControl._inertialScrolling);
        });
    });
    describe('BaseControl watcher groupHistoryId', () => {

        const GROUP_HISTORY_ID_NAME: string = 'MY_NEWS';

        const baseControlCfg = {
            viewName: 'Controls/List/ListView',
            keyProperty: 'id',
            viewModelConstructor: ListViewModel,
            items: new RecordSet({
                keyProperty: 'id',
                rawData: []
            })
        };
        let baseControl;

        beforeEach(() => {
            baseControl = new BaseControl(baseControlCfg);
        });

        afterEach(() => {
            baseControl.destroy();
            baseControl = undefined;
        });

        it('CollapsedGroup empty', () => {
            baseControl._beforeMount(baseControlCfg);
            baseControl._container = {getElementsByClassName: () => ([{clientHeight: 100, offsetHeight: 0}])};
            baseControl._afterMount();
            assert.isFalse(!!baseControl._listViewModel.getCollapsedGroups());
        });
        it('is CollapsedGroup', () => {
            let cfgClone = {...baseControlCfg};
            // cfgClone.groupHistoryId = GROUP_HISTORY_ID_NAME;
            cfgClone.collapsedGroups = [];
            baseControl._beforeMount(cfgClone);
            baseControl._container = {getElementsByClassName: () => ([{clientHeight: 100, offsetHeight: 0}])};
            baseControl._afterMount();
            assert.isTrue(!!baseControl._listViewModel.getCollapsedGroups());
        });
        it('updated CollapsedGroups', async () => {
            const cfgClone = {...baseControlCfg};
            baseControl.saveOptions(baseControlCfg);
            await baseControl._beforeMount(baseControlCfg);
            baseControl._beforeUpdate(baseControlCfg);
            baseControl._afterUpdate(baseControlCfg);
            baseControl._container = {getElementsByClassName: () => ([{clientHeight: 100, offsetHeight: 0}])};
            cfgClone.groupHistoryId = GROUP_HISTORY_ID_NAME;
            cfgClone.collapsedGroups = [];
            baseControl._beforeUpdate(cfgClone);
            assert.isTrue(!!baseControl._listViewModel.getCollapsedGroups());
        });
    });
    describe('BaseControl watcher selected', () => {
        const baseControlCfg = {
            viewName: 'Controls/List/ListView',
            keyProperty: 'id',
            viewModelConstructor: ListViewModel,
            items: new RecordSet({
                keyProperty: 'id',
                rawData: []
            }),
            viewModelConfig: {
                items: new RecordSet({
                    keyProperty: 'id',
                    rawData: [
                        {
                            id: 1,
                            title: 'Первый',
                            type: 1
                        },
                        {
                            id: 2,
                            title: 'Второй',
                            type: 2
                        }
                    ]
                }),
                keyProperty: 'id'
            },
            selectedKeys: [],
            excludedKeys: []
        };
        let baseControl;

        beforeEach(() => {
            baseControl = new BaseControl(baseControlCfg);
            baseControl._listViewModel = new ListViewModel(baseControlCfg.viewModelConfig);
        });

        afterEach(() => {
            baseControl.destroy();
            baseControl = undefined;
        });
        it('should create selection controller', async () => {
            const cfgClone = {...baseControlCfg};
            cfgClone.selectedKeys = [1];
            cfgClone.multiSelectVisibility = 'hidden';
            await baseControl._beforeMount(baseControlCfg);
            baseControl._container = {getElementsByClassName: () => ([{clientHeight: 100, offsetHeight: 0}])};
            baseControl._afterMount();
            assert.isNull(baseControl._selectionController);
            await baseControl._beforeUpdate(cfgClone);
            assert.isNull(baseControl._selectionController);
        });
        it('should create selection controller', async () => {
            const cfgClone = {...baseControlCfg};
            cfgClone.selectedKeys = [1];
            cfgClone.multiSelectVisibility = 'hidden';
            cfgClone.selectedKeysCount = null;
            baseControl.saveOptions(cfgClone);
            await baseControl._beforeMount(cfgClone);
            baseControl._container = {getElementsByClassName: () => ([{clientHeight: 100, offsetHeight: 0}])};
            baseControl._afterMount();
            baseControl._listViewModel = new ListViewModel(baseControlCfg.viewModelConfig);
            baseControl._createSelectionController();
            assert.isFalse(!baseControl._listViewModel || !baseControl._listViewModel.getCollection());
            assert.isNotNull(baseControl._selectionController);
        });
    });
    describe('beforeUnmount', () => {
        let baseControl;
        const baseControlCfg = {
            viewName: 'Controls/List/ListView',
            keyProperty: 'id',
            viewModelConstructor: ListViewModel,
            items: new RecordSet({
                keyProperty: 'id',
                rawData: []
            })
        };
        beforeEach(() => {
            baseControl = new BaseControl(baseControlCfg);
        });
        afterEach(() => {
            baseControl.destroy();
            baseControl = undefined;
        });
        it('reset editInPlace before model', async () => {
            let eipReset = false;
            let modelDestroyed = false;

            baseControl.saveOptions(baseControlCfg);
            await baseControl._beforeMount(baseControlCfg);
            baseControl._editInPlace = {
                reset: () => {
                    assert.isFalse(modelDestroyed, 'model is destroyed before editInPlace');
                    eipReset = true;
                }
            };
            baseControl._listViewModel.destroy = () => {
                modelDestroyed = true;
            }
            baseControl._beforeUnmount();
            assert.isTrue(eipReset, 'editInPlace is not reset');
            assert.isTrue(modelDestroyed, 'model is not destroyed');

        });
    });
    describe('BaseControl enterHandler', ()=>{
        it('is enterHandler', function() {
            let notified = false;
            let notifiedCount = 0;// Количество событий
            BaseControl._private.enterHandler({
                _options: {
                    useNewModel: false
                },
                getViewModel: function() {
                    return {
                        getMarkedItem: function() {
                            return null;
                        }
                    };
                },
                _notify: function(e, item, options) {
                    notified = true;
                }
            });
            assert.isFalse(notified);
            assert.isFalse(!!notifiedCount);

            const myMarkedItem = { qwe: 123 };
            const mockedEvent = {
                target: 'myTestTarget',
                isStopped: function() {
                    return false;
                }
            };

            BaseControl._private.enterHandler({
                _options: {
                    useNewModel: false
                },
                getViewModel: function() {
                    return {
                        getMarkedItem: function() {
                            return {
                                getContents: function() {
                                    return myMarkedItem;
                                }
                            };
                        }
                    };
                },
                _notify: function(e, args, options) {
                    notified = true;
                    notifiedCount++;
                    assert.isTrue(e === 'itemClick' || e === 'itemActivate');
                    assert.deepEqual(args, [myMarkedItem, mockedEvent]);
                    assert.deepEqual(options, { bubbling: true });
                }
            }, mockedEvent);
            assert.isTrue(notified);
            assert.isTrue(notifiedCount === 2);
        });
    })
});
