import {assert} from 'chai';
import {stub, spy, assert as sinonAssert} from 'sinon';
import {Logger} from 'UI/Utils';
import {Mover} from 'Controls/list';
import {Memory} from 'Types/source';
import {RecordSet} from 'Types/collection';
import {Confirmation, Dialog} from 'Controls/popup';
import * as cClone from 'Core/core-clone';
import * as selectionToRecord from 'Controls/_operations/MultiSelector/selectionToRecord';

describe('Controls.List.Mover', () => {
    let items;
    let mover;
    let cfg;
    let stubLogger;

    before(() => {
        stubLogger = stub(Logger, 'warn');
    });

    after(() => {
        stubLogger.restore();
    });

    beforeEach(() => {
        let data = [{
            id: 1,
            folder: null,
            'folder@': true
        }, {
            id: 2,
            folder: null,
            'folder@': null
        }, {
            id: 3,
            folder: null,
            'folder@': null
        }, {
            id: 4,
            folder: 1,
            'folder@': true
        }, {
            id: 5,
            folder: 1,
            'folder@': null
        }, {
            id: 6,
            folder: null,
            'folder@': null
        }];

        items = new RecordSet({
            keyProperty: 'id',
            rawData: cClone(data)
        });

        cfg = {
            parentProperty: 'folder',
            nodeProperty: 'folder@',
            moveDialogTemplate: {},
            items: items,
            source: new Memory({
                keyProperty: 'id',
                data: cClone(data)
            }),
            keyProperty: 'id'
        }

        mover = new Mover(cfg);
    });

    afterEach(function () {
        mover.destroy();
    });

    it('_beforeMount', function () {
        const options = {
            ...cfg,
            moveDialogTemplate: {
                templateName: 'testTemplateName',
                templateOptions: {
                    testOptions: 'testValueOfOption'
                }
            }
        };
        const contextOptions = {
            dataOptions: options
        };
        mover._beforeMount(options, contextOptions);

        assert.equal(mover._controller._dialogOptions.template, 'testTemplateName');
        assert.deepEqual(mover._controller._dialogOptions.templateOptions, {testOptions: 'testValueOfOption'});
        assert.equal(mover._controller._source, cfg.source);

        mover._beforeMount({moveDialogTemplate: 'testTemplate'}, {});
        assert.equal(mover._controller._dialogOptions.template, 'testTemplate');
    });

    it('_beforeUpdate', function () {
        mover._beforeUpdate({
            ...cfg,
            moveDialogTemplate: {
                templateName: 'testTemplateName',
                templateOptions: {
                    testOptions: 'testValueOfOption1'
                }
            }
        }, {
            dataOptions: {}
        });

        assert.deepEqual(mover._controller._dialogOptions.templateOptions, {testOptions: 'testValueOfOption1'});

        mover._beforeUpdate({
            ...cfg,
            moveDialogTemplate: {
                templateName: 'testTemplateName',
                templateOptions: {
                    testOptions: 'testValueOfOption2'
                }
            }
        }, {
            dataOptions: {}
        });

        assert.deepEqual(mover._controller._dialogOptions.templateOptions, {testOptions: 'testValueOfOption2'});
    });

    describe('mover methods', () => {
        beforeEach(() => {
            const options = {
                ...cfg,
                moveDialogTemplate: {
                    templateName: () => 'testTemplateName',
                    templateOptions: {
                        testOptions: 'testValueOfOption'
                    }
                }
            };
            const contextOptions = {
                dataOptions: options
            };
            mover._beforeMount(options, contextOptions);
        });

        it('moveItemsWithDialog', function (done) {
            const items = [1, 2, 3];
            const stubOpenPopup = stub(Dialog, 'openPopup');

            // @ts-ignore
            stubOpenPopup.callsFake((openArgs: any) => {
                assert.deepEqual(openArgs.templateOptions.movedItems, items);
                assert.equal(openArgs.templateOptions.source, mover._controller._source);
                assert.equal(openArgs.templateOptions.keyProperty, mover._controller._keyProperty);
            })

            mover.moveItemsWithDialog(items)
                .then(() => {
                    stubOpenPopup.restore();
                    done();
                });
        });

        it('moveItemsWithDialog for newLogic call moveItems', (done) => {
            const params = {
                selectedKeys: [1, 2, 3],
                excludedKeys: [11],
                filter: {
                    testProp: 'testValue'
                }
            };
            let moveItemsCalled = false;
            const stubOpenPopup = stub(Dialog, 'openPopup');

            // @ts-ignore
            stubOpenPopup.callsFake((openArgs: any) => {
                assert.deepEqual(openArgs.templateOptions.movedItems, params.selectedKeys);
                assert.equal(openArgs.templateOptions.source, mover._controller._source);
                assert.equal(openArgs.templateOptions.keyProperty, mover._controller._keyProperty);

                const stubMoveItems = stub(mover, 'moveItems');
                stubMoveItems.callsFake((callingParams) => {
                    moveItemsCalled = true;
                    assert.deepEqual(callingParams, params);
                });
                openArgs.eventHandlers.onResult(4);
                stubMoveItems.restore();
                assert.isTrue(moveItemsCalled);
            })

            mover.moveItemsWithDialog(params).then(() => {
                stubOpenPopup.restore();
                done();
            });
        });

        it('moveItemsWithDialog with search applied', () => {
            const selection = {
                selected: [1, 2, 3],
                excluded: [11]
            };
            const filter = {
                searchParam: 'searchValue'
            };
            const config = {...cfg, searchParam: 'searchParam', filter};
            const stubOpenPopup = stub(Dialog, 'openPopup');
            mover._updateMoveController(config, {dataOptions: config});

            // @ts-ignore
            stubOpenPopup.callsFake((openArgs: any) => 'fake');

            return new Promise((resolve) => {
                let queryFilter;
                mover._controller._source.query = (query) => {
                    queryFilter = query.getWhere();
                    return Promise.reject();
                };
                mover.moveItemsWithDialog(selection).then(() => {
                    assert.isTrue(!queryFilter.searchParam);
                    stubOpenPopup.restore();
                    resolve();
                });
            });
        });

        it('moveItemsWithDialog is called with items and with search applied', (done) => {
            const items = [1, 2, 3];
            const filter = {
                searchParam: 'searchValue'
            };
            let openConfig;

            const config = {...cfg, searchParam: 'searchParam', filter};
            mover._updateMoveController(config, {dataOptions: config});
            const stubOpenPopup = stub(Dialog, 'openPopup');

            // @ts-ignore
            stubOpenPopup.callsFake((openArgs: any) => {
                assert.deepEqual(openArgs.templateOptions.movedItems, items);
                assert.equal(openArgs.templateOptions.source, mover._controller._source);
                assert.equal(openArgs.templateOptions.keyProperty, mover._controller._keyProperty);
            })

            mover.moveItemsWithDialog(items).then(() => {
                stubOpenPopup.restore();
                done();
            });
        });

        it('moveItems for newLogic', function () {
            let callMethodCalled = false;
            const params = {
                selectedKeys: [1, 2, 3],
                excludedKeys: [11],
                filter: {
                    testProp: 'testValue'
                }
            };
            const bindings = {
                move: 'testMoveMethod',
                list: 'testListMethod'
            };
            const targetId = 4;
            mover._controller._source.getBinding = () => {
                return bindings;
            };
            mover._controller._source.call = (methodName, data) => {
                callMethodCalled = true;
                assert.equal(methodName, bindings.move);
                assert.equal(data.method, bindings.list);
                assert.equal(data.folder_id, targetId);
                assert.equal(data.filter.get('testProp'), 'testValue');
                assert.deepEqual(data.filter.get('selection').getRawData(),
                    selectionToRecord({
                        selected: params.selectedKeys,
                        excluded: params.excludedKeys
                    }, mover._controller._source.getAdapter()).getRawData()
                );
                return Promise.resolve();
            };

            return mover.moveItems(params, targetId)
                .then(() => {
                    assert.isTrue(callMethodCalled);
                });
        });

        it('moveItemsWithDialog with empty items', function (done) {
            const items = [];
            const spyOpenPopup = spy(Dialog, 'openPopup');
            const stubOpenConfirmation = stub(Confirmation, 'openPopup');
            // @ts-ignore
            stubOpenConfirmation.callsFake((args: any) => {
                assert(args.message, 'Нет записей для обработки команды');
            });
            mover.moveItemsWithDialog(items).then(() => {
                sinonAssert.notCalled(spyOpenPopup);
                spyOpenPopup.restore();
                stubOpenConfirmation.restore();
                done();
            });
        });

        it('moveItemsWithDialog for models', (done) => {
            const movedItems = [1, 2, 3];
            const stubOpenPopup = stub(Dialog, 'openPopup');

            // @ts-ignore
            stubOpenPopup.callsFake((openArgs: any) => {
                assert.deepEqual(openArgs.templateOptions.movedItems, movedItems);
                assert.equal(openArgs.templateOptions.source, mover._controller._source);
                assert.equal(openArgs.templateOptions.keyProperty, mover._controller._keyProperty);
            });
            mover.moveItemsWithDialog([items.at(0), items.at(1), items.at(2)]).then(() => {
                stubOpenPopup.restore();
                done();
            });
        });

        it('beforeItemsMove notify event with params', (done) => {
            let movedItems;
            const item = items.at(0);
            const target = items.at(1);
            mover._notify = (event, args) => {
                if (event === 'beforeItemsMove') {
                    movedItems = args[0];
                    assert.equal(movedItems[0].getId(), item.getId());
                    assert.equal(args[1].getId(), target.getId());
                    done();
                }
            };
            mover.moveItemDown(item);
        });

        it('afterItemsMove notify event with params', (done) => {
            let movedItems;
            const item = items.at(2);
            const target = items.at(1)
            const result = 'custom_result';

            const stubSourceMove = stub(mover._controller._source, 'move');
            stubSourceMove.callsFake(() => {
                return Promise.resolve(result);
            });
            mover._notify = (event, args) => {
                if (event === 'afterItemsMove') {
                    movedItems = args[0];
                    assert.equal(movedItems[0].getId(), item.getId());
                    assert.equal(args[1].getId(), target.getId());
                    assert.equal(args[3], 'custom_result');
                }
            };
            mover.moveItemUp(item).then(() => {
                stubSourceMove.restore();
                done();
            });
        });

        describe('sortingOrder', () => {
            let item;
            let stubSourceMove;
            before(() => {
                item = items.getRecordById(3);
                stubSourceMove = stub(mover._controller._source, 'move');
            });

            after(() => {
                stubSourceMove.restore()
            });

            describe('Ascending sort', () => {
                before(() => {
                    let config = {...cfg, sortingOrder: 'asc'};
                    mover._updateMoveController(config, {dataOptions: config});
                })

                it('should move up', (done) => {
                    stubSourceMove.callsFake((items, target, options) => {
                        assert.equal(target, 2);
                        assert.equal(options.position, 'before');
                        return Promise.resolve();
                    });
                    mover.moveItemUp(item).then(() => {done()})
                })

                it('should move down', (done) => {
                    stubSourceMove.callsFake((items, target, options) => {
                        assert.equal(target, 2);
                        assert.equal(options.position, 'after');
                        return Promise.resolve();
                    });
                    mover.moveItemDown(item).then(() => {done()});
                });
            });

            describe('Descending sort', () => {
                before(() => {
                    let config = {...cfg, sortingOrder: 'desc'};
                    mover._updateMoveController(config, {dataOptions: config});
                })

                it('should move up', (done) => {
                    stubSourceMove.callsFake((items, target, options) => {
                        assert.equal(target, 2);
                        assert.equal(options.position, 'after');
                        return Promise.resolve();
                    });
                    mover.moveItemUp(item).then(() => { done(); });
                });

                it('should move down', (done) => {
                    stubSourceMove.callsFake((items, target, options) => {
                        assert.equal(target, 2);
                        assert.equal(options.position, 'before');
                        return Promise.resolve();
                    });
                    mover.moveItemDown(item).then(() => { done(); });
                });
            });
        });

        it('moveItemUp by item', (done) => {
            const item = items.at(2);

            mover._notify = (event) => {
                if (event === 'afterItemsMove') {
                    assert.equal(items.at(1).getId(), item.getId());
                    done();
                }
            };
            mover.moveItemUp(item);
        });

        it('moveItemUp by id', (done) => {
            mover._notify = (event) => {
                if (event === 'afterItemsMove') {
                    assert.equal(items.at(1).getId(), 3);
                    done();
                }
            };
            mover.moveItemUp(3);
        });

        it('moveItemUp first item', () => {
            const item = items.at(0);

            mover.moveItemUp(item);
            assert.equal(items.at(0).getId(), item.getId());
        });

        it('moveItemDown by item', (done) => {
            const item = items.at(0);

            mover._notify = (event) => {
                if (event === 'afterItemsMove') {
                    assert.equal(items.at(1).getId(), item.getId());
                    done();
                }
            };
            mover.moveItemDown(item);
        });

        it('moveItemDown by id', (done) => {
            mover._notify = (event) => {
                if (event === 'afterItemsMove') {
                    assert.equal(items.at(1).getId(), 1);
                    done();
                }
            };
            mover.moveItemDown(1);
        });

        it('moveItemDown last item', () => {
            const item = items.at(4);

            mover.moveItemDown(item);
            assert.equal(items.at(4).getId(), item.getId());
        });

        it('moveItems by item', (done) => {
            const item = items.at(0);
            const target = items.at(2);

            mover._notify = (event) => {
                if (event === 'afterItemsMove') {
                    assert.equal(items.at(2).getId(), item.getId());
                    done();
                }
            };

            mover.moveItems([item], target, 'after');
        });

        it('moveItems by id', (done) => {
            const target = items.at(2);

            mover._notify = (event) => {
                if (event === 'afterItemsMove') {
                    assert.equal(items.at(0).getId(), target.getId());
                    done();
                }
            };

            mover.moveItems([1, 2], target, 'after');
        });

        it('moveItems not from recordSet', (done) => {
            const moveItems = [6];

            mover._notify = (event, args) => {
                if (event === 'afterItemsMove') {
                    assert.deepEqual(args[0], moveItems);
                    done();
                }
            };

            mover.moveItems(moveItems, 1, 'on');
        });

        it('moveItems in folder', (done) => {
            mover._notify = (event) => {
                if (event === 'afterItemsMove') {
                    assert.equal(items.getRecordById(4).get('folder'), 1);
                    assert.equal(items.getRecordById(5).get('folder'), 1);
                    done();
                }
            };

            mover.moveItems([4, 5], 1, 'on');
        });

        it('moveItems in folder with change order', (done) => {
            mover._notify = (event) => {
                if (event === 'afterItemsMove') {
                    assert.equal(items.getRecordById(3).get('folder'), 1);
                    done();
                }
            };

            mover.moveItems([3], 4, 'after');
        });

        it('moveItems in root', (done) => {
            const movedItems = [];
            movedItems.push(items.getRecordById(4));
            movedItems.push(items.getRecordById(5));

            mover._notify = (event) => {
                if (event === 'afterItemsMove') {
                    assert.equal(items.getRecordById(4).get('folder'), null);
                    assert.equal(items.getRecordById(5).get('folder'), null);
                    done();
                }
            };

            mover.moveItems(movedItems, null, 'on');
        });

        it('moveItems in list', () => {
            mover.moveItems([4], 5, 'on');
            assert.equal(items.getRecordById(4).get('folder'), 1);
        });

        it('moveItems folder in child folder', () => {
            mover.moveItems([1], 4, 'on');
            assert.equal(items.getRecordById(1).get('folder'), null);
        });

        it('moveItems in himself', () => {
            mover.moveItems([1], 1, 'on');
            assert.equal(items.getRecordById(1).get('folder'), null);
        });

        it('beforeItemsMove = MoveInItems', (done) => {
            const item = items.at(0);
            const target = items.at(2);

            mover._notify = (event) => {
                if (event === 'beforeItemsMove') {
                    return Promise.resolve('MoveInItems');
                }
            };

            mover.moveItems([item], target, 'after')
                .then(() => {
                    assert.equal(items.at(2).getId(), item.getId());
                    mover._controller._source.query()
                        .then((dataSet) => {
                            assert.equal(dataSet.getAll().at(0).getId(), item.getId());
                            done();
                        });
                });
        });

        it('beforeItemsMove = Custom', (done) => {
            const item = items.at(0);
            const target = items.at(2);

            mover._notify = (event) => {
                if (event === 'beforeItemsMove') {
                    return 'Custom';
                }
            };

            mover.moveItems([item], target, 'after');
            assert.equal(items.at(0).getId(), item.getId());
            mover._controller._source.query()
                .then((dataSet) => {
                    assert.equal(dataSet.getAll().at(0).getId(), item.getId());
                    done();
                });
        });

        it('move returns deferred', () => {
            let result;

            //dont move moveItemUp
            result = mover.moveItemUp(1);
            assert.isTrue(result instanceof Promise);

            //move moveItemUp
            result = mover.moveItemUp(2);
            assert.isTrue(result instanceof Promise);

            //dont move moveItemDown
            result = mover.moveItemDown(5);
            assert.isTrue(result instanceof Promise);

            //move moveItemDown
            result = mover.moveItemDown(4);
            assert.isTrue(result instanceof Promise);

            //move without target moveItems
            result = mover.moveItems([1, 2]);
            assert.isTrue(result instanceof Promise);

            //move without items moveItems
            result = mover.moveItems([], 3, 'after');
            assert.isTrue(result instanceof Promise);

            //move moveItems
            result = mover.moveItems([1, 2], 3, 'after');
            assert.isTrue(result instanceof Promise);
        });

        it('move by selection', (done) => {
            mover._notify = (event, args) => {
                if (event === 'beforeItemsMove') {
                    assert.deepEqual(args[0], [1, 2]);
                }
            };

            mover.moveItems({
                selected: [1, 2],
                excluded: []
            }, 3, 'after').then(() => {
                done();
            });
        });

        it('getSiblingItem', () => {
            let siblingItem;

            siblingItem = mover._controller.getSiblingItem(items.getRecordById(6), 'before');
            assert.equal(siblingItem.getId(), 3);
            siblingItem = mover._controller.getSiblingItem(items.getRecordById(6), 'after');
            assert.isNull(siblingItem);

            siblingItem = mover._controller.getSiblingItem(items.getRecordById(3), 'after');
            assert.equal(siblingItem.getId(), 6);
            siblingItem = mover._controller.getSiblingItem(items.getRecordById(3), 'before');
            assert.equal(siblingItem.getId(), 2);

            siblingItem = mover._controller.getSiblingItem(items.getRecordById(1), 'after');
            assert.equal(siblingItem.getId(), 2);
            siblingItem = mover._controller.getSiblingItem(items.getRecordById(1), 'before');
            assert.isNull(siblingItem);

            mover._options.root = 1;
            siblingItem = mover._controller.getSiblingItem(items.getRecordById(4), 'after');
            assert.equal(siblingItem.getId(), 5);
        });
    });
});
