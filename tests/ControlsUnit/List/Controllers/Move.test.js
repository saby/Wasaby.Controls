define("ControlsUnit/List/Mover.test", ["require", "exports", "tslib", "chai", "sinon", "Controls/list", "Types/source", "Types/collection", "Controls/popup", "Core/core-clone", "Controls/_operations/MultiSelector/selectionToRecord"], function (require, exports, tslib_1, chai_1, sinon_1, list_1, source_1, collection_1, popup_1, cClone, selectionToRecord) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe('Controls.List.Mover', function () {
        var items;
        var mover;
        var cfg;
        beforeEach(function () {
            var data = [{
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
            items = new collection_1.RecordSet({
                keyProperty: 'id',
                rawData: cClone(data)
            });
            cfg = {
                parentProperty: 'folder',
                nodeProperty: 'folder@',
                moveDialogTemplate: {},
                items: items,
                source: new source_1.Memory({
                    keyProperty: 'id',
                    data: cClone(data)
                }),
                keyProperty: 'id'
            };
            mover = new list_1.Mover(cfg);
        });
        afterEach(function () {
            mover.destroy();
        });
        it('_beforeMount', function () {
            var options = tslib_1.__assign(tslib_1.__assign({}, cfg), { moveDialogTemplate: {
                    templateName: 'testTemplateName',
                    templateOptions: {
                        testOptions: 'testValueOfOption'
                    }
                } });
            var contextOptions = {
                dataOptions: options
            };
            mover._beforeMount(options, contextOptions);
            chai_1.assert.equal(mover._controller._dialogOptions.template, 'testTemplateName');
            chai_1.assert.deepEqual(mover._controller._dialogOptions.templateOptions, { testOptions: 'testValueOfOption' });
            chai_1.assert.equal(mover._controller._source, cfg.source);
            mover._beforeMount({ moveDialogTemplate: 'testTemplate' }, {});
            chai_1.assert.equal(mover._controller._dialogOptions.template, 'testTemplate');
        });
        it('_beforeUpdate', function () {
            mover._beforeUpdate(tslib_1.__assign(tslib_1.__assign({}, cfg), { moveDialogTemplate: {
                    templateName: 'testTemplateName',
                    templateOptions: {
                        testOptions: 'testValueOfOption1'
                    }
                } }), {
                dataOptions: {}
            });
            chai_1.assert.deepEqual(mover._controller._dialogOptions.templateOptions, { testOptions: 'testValueOfOption1' });
            mover._beforeUpdate(tslib_1.__assign(tslib_1.__assign({}, cfg), { moveDialogTemplate: {
                    templateName: 'testTemplateName',
                    templateOptions: {
                        testOptions: 'testValueOfOption2'
                    }
                } }), {
                dataOptions: {}
            });
            chai_1.assert.deepEqual(mover._controller._dialogOptions.templateOptions, { testOptions: 'testValueOfOption2' });
        });
        describe('mover methods', function () {
            beforeEach(function () {
                var options = tslib_1.__assign(tslib_1.__assign({}, cfg), { moveDialogTemplate: {
                        templateName: function () { return 'testTemplateName'; },
                        templateOptions: {
                            testOptions: 'testValueOfOption'
                        }
                    } });
                var contextOptions = {
                    dataOptions: options
                };
                mover._beforeMount(options, contextOptions);
            });
            it('moveItemsWithDialog', function (done) {
                var items = [1, 2, 3];
                var stubOpenPopup = sinon_1.stub(popup_1.Dialog, 'openPopup');
                // @ts-ignore
                stubOpenPopup.callsFake(function (openArgs) {
                    chai_1.assert.deepEqual(openArgs.templateOptions.movedItems, items);
                    chai_1.assert.equal(openArgs.templateOptions.source, mover._controller._source);
                    chai_1.assert.equal(openArgs.templateOptions.keyProperty, mover._controller._keyProperty);
                });
                mover.moveItemsWithDialog(items)
                    .then(function () {
                    stubOpenPopup.restore();
                    done();
                });
            });
            it('moveItemsWithDialog for newLogic call moveItems', function (done) {
                var params = {
                    selectedKeys: [1, 2, 3],
                    excludedKeys: [11],
                    filter: {
                        testProp: 'testValue'
                    }
                };
                var moveItemsCalled = false;
                var stubOpenPopup = sinon_1.stub(popup_1.Dialog, 'openPopup');
                // @ts-ignore
                stubOpenPopup.callsFake(function (openArgs) {
                    chai_1.assert.deepEqual(openArgs.templateOptions.movedItems, params.selectedKeys);
                    chai_1.assert.equal(openArgs.templateOptions.source, mover._controller._source);
                    chai_1.assert.equal(openArgs.templateOptions.keyProperty, mover._controller._keyProperty);
                    var stubMoveItems = sinon_1.stub(mover, 'moveItems');
                    stubMoveItems.callsFake(function (callingParams) {
                        moveItemsCalled = true;
                        chai_1.assert.deepEqual(callingParams, params);
                    });
                    openArgs.eventHandlers.onResult(4);
                    stubMoveItems.restore();
                    chai_1.assert.isTrue(moveItemsCalled);
                });
                mover.moveItemsWithDialog(params).then(function () {
                    stubOpenPopup.restore();
                    done();
                });
            });
            it('moveItemsWithDialog with search applied', function () {
                var selection = {
                    selected: [1, 2, 3],
                    excluded: [11]
                };
                var filter = {
                    searchParam: 'searchValue'
                };
                var config = tslib_1.__assign(tslib_1.__assign({}, cfg), { searchParam: 'searchParam', filter: filter });
                var stubOpenPopup = sinon_1.stub(popup_1.Dialog, 'openPopup');
                mover._updateMoveController(config, { dataOptions: config });
                // @ts-ignore
                stubOpenPopup.callsFake(function (openArgs) { return 'fake'; });
                return new Promise(function (resolve) {
                    var queryFilter;
                    mover._controller._source.query = function (query) {
                        queryFilter = query.getWhere();
                        return Promise.reject();
                    };
                    mover.moveItemsWithDialog(selection).then(function () {
                        chai_1.assert.isTrue(!queryFilter.searchParam);
                        stubOpenPopup.restore();
                        resolve();
                    });
                });
            });
            it('moveItemsWithDialog is called with items and with search applied', function (done) {
                var items = [1, 2, 3];
                var filter = {
                    searchParam: 'searchValue'
                };
                var openConfig;
                var config = tslib_1.__assign(tslib_1.__assign({}, cfg), { searchParam: 'searchParam', filter: filter });
                mover._updateMoveController(config, { dataOptions: config });
                var stubOpenPopup = sinon_1.stub(popup_1.Dialog, 'openPopup');
                // @ts-ignore
                stubOpenPopup.callsFake(function (openArgs) {
                    chai_1.assert.deepEqual(openArgs.templateOptions.movedItems, items);
                    chai_1.assert.equal(openArgs.templateOptions.source, mover._controller._source);
                    chai_1.assert.equal(openArgs.templateOptions.keyProperty, mover._controller._keyProperty);
                });
                mover.moveItemsWithDialog(items).then(function () {
                    stubOpenPopup.restore();
                    done();
                });
            });
            it('moveItems for newLogic', function () {
                var callMethodCalled = false;
                var params = {
                    selectedKeys: [1, 2, 3],
                    excludedKeys: [11],
                    filter: {
                        testProp: 'testValue'
                    }
                };
                var bindings = {
                    move: 'testMoveMethod',
                    list: 'testListMethod'
                };
                var targetId = 4;
                mover._controller._source.getBinding = function () {
                    return bindings;
                };
                mover._controller._source.call = function (methodName, data) {
                    callMethodCalled = true;
                    chai_1.assert.equal(methodName, bindings.move);
                    chai_1.assert.equal(data.method, bindings.list);
                    chai_1.assert.equal(data.folder_id, targetId);
                    chai_1.assert.equal(data.filter.get('testProp'), 'testValue');
                    chai_1.assert.deepEqual(data.filter.get('selection').getRawData(), selectionToRecord({
                        selected: params.selectedKeys,
                        excluded: params.excludedKeys
                    }, mover._controller._source.getAdapter()).getRawData());
                    return Promise.resolve();
                };
                return mover.moveItems(params, targetId)
                    .then(function () {
                    chai_1.assert.isTrue(callMethodCalled);
                });
            });
            it('moveItemsWithDialog with empty items', function (done) {
                var items = [];
                var spyOpenPopup = sinon_1.spy(popup_1.Dialog, 'openPopup');
                mover.moveItemsWithDialog(items).then(function () {
                    sinon_1.assert.notCalled(spyOpenPopup);
                    spyOpenPopup.restore();
                    done();
                });
            });
            it('moveItemsWithDialog for models', function (done) {
                var movedItems = [1, 2, 3];
                var stubOpenPopup = sinon_1.stub(popup_1.Dialog, 'openPopup');
                // @ts-ignore
                stubOpenPopup.callsFake(function (openArgs) {
                    chai_1.assert.deepEqual(openArgs.templateOptions.movedItems, movedItems);
                    chai_1.assert.equal(openArgs.templateOptions.source, mover._controller._source);
                    chai_1.assert.equal(openArgs.templateOptions.keyProperty, mover._controller._keyProperty);
                });
                mover.moveItemsWithDialog([items.at(0), items.at(1), items.at(2)]).then(function () {
                    stubOpenPopup.restore();
                    done();
                });
            });
            it('beforeItemsMove notify event with params', function (done) {
                var movedItems;
                var item = items.at(0);
                var target = items.at(1);
                mover._notify = function (event, args) {
                    if (event === 'beforeItemsMove') {
                        movedItems = args[0];
                        chai_1.assert.equal(movedItems[0].getId(), item.getId());
                        chai_1.assert.equal(args[1].getId(), target.getId());
                        done();
                    }
                };
                mover.moveItemDown(item);
            });
            it('afterItemsMove notify event with params', function (done) {
                var movedItems;
                var item = items.at(2);
                var target = items.at(1);
                var result = 'custom_result';
                var stubSourceMove = sinon_1.stub(mover._controller._source, 'move');
                stubSourceMove.callsFake(function () {
                    return Promise.resolve(result);
                });
                mover._notify = function (event, args) {
                    if (event === 'afterItemsMove') {
                        movedItems = args[0];
                        chai_1.assert.equal(movedItems[0].getId(), item.getId());
                        chai_1.assert.equal(args[1].getId(), target.getId());
                        chai_1.assert.equal(args[3], 'custom_result');
                    }
                };
                mover.moveItemUp(item).then(function () {
                    stubSourceMove.restore();
                    done();
                });
            });
            it('sortingOrder', function (done) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
                var item, config, stubSourceMove;
                return tslib_1.__generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            item = items.getRecordById(3);
                            config = tslib_1.__assign(tslib_1.__assign({}, cfg), { sortingOrder: 'asc' });
                            mover._updateMoveController(config, { dataOptions: config });
                            stubSourceMove = sinon_1.stub(mover._controller._source, 'move');
                            stubSourceMove.callsFake(function (items, target, options) {
                                chai_1.assert.equal(target, 2);
                                chai_1.assert.equal(options.position, 'before');
                                return Promise.resolve();
                            });
                            return [4 /*yield*/, mover.moveItemUp(item)];
                        case 1:
                            _a.sent();
                            stubSourceMove.callsFake(function (items, target, options) {
                                chai_1.assert.equal(target, 2);
                                chai_1.assert.equal(options.position, 'after');
                                return Promise.resolve();
                            });
                            return [4 /*yield*/, mover.moveItemDown(item)];
                        case 2:
                            _a.sent();
                            //Descending sort.
                            config = tslib_1.__assign(tslib_1.__assign({}, cfg), { sortingOrder: 'desc' });
                            mover._updateMoveController(config, { dataOptions: config });
                            stubSourceMove.callsFake(function (items, target, options) {
                                chai_1.assert.equal(target, 2);
                                chai_1.assert.equal(options.position, 'after');
                                return Promise.resolve();
                            });
                            return [4 /*yield*/, mover.moveItemUp(item)];
                        case 3:
                            _a.sent();
                            stubSourceMove.callsFake(function (items, target, options) {
                                chai_1.assert.equal(target, 2);
                                chai_1.assert.equal(options.position, 'before');
                                return Promise.resolve();
                            });
                            return [4 /*yield*/, mover.moveItemDown(item)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            it('moveItemUp by item', function (done) {
                var item = items.at(2);
                mover._notify = function (event) {
                    if (event === 'afterItemsMove') {
                        chai_1.assert.equal(items.at(1).getId(), item.getId());
                        done();
                    }
                };
                mover.moveItemUp(item);
            });
            it('moveItemUp by id', function (done) {
                mover._notify = function (event) {
                    if (event === 'afterItemsMove') {
                        chai_1.assert.equal(items.at(1).getId(), 3);
                        done();
                    }
                };
                mover.moveItemUp(3);
            });
            it('moveItemUp first item', function () {
                var item = items.at(0);
                mover.moveItemUp(item);
                chai_1.assert.equal(items.at(0).getId(), item.getId());
            });
            it('moveItemDown by item', function (done) {
                var item = items.at(0);
                mover._notify = function (event) {
                    if (event === 'afterItemsMove') {
                        chai_1.assert.equal(items.at(1).getId(), item.getId());
                        done();
                    }
                };
                mover.moveItemDown(item);
            });
            it('moveItemDown by id', function (done) {
                mover._notify = function (event) {
                    if (event === 'afterItemsMove') {
                        chai_1.assert.equal(items.at(1).getId(), 1);
                        done();
                    }
                };
                mover.moveItemDown(1);
            });
            it('moveItemDown last item', function () {
                var item = items.at(4);
                mover.moveItemDown(item);
                chai_1.assert.equal(items.at(4).getId(), item.getId());
            });
            it('moveItems by item', function (done) {
                var item = items.at(0);
                var target = items.at(2);
                mover._notify = function (event) {
                    if (event === 'afterItemsMove') {
                        chai_1.assert.equal(items.at(2).getId(), item.getId());
                        done();
                    }
                };
                mover.moveItems([item], target, 'after');
            });
            it('moveItems by id', function (done) {
                var target = items.at(2);
                mover._notify = function (event) {
                    if (event === 'afterItemsMove') {
                        chai_1.assert.equal(items.at(0).getId(), target.getId());
                        done();
                    }
                };
                mover.moveItems([1, 2], target, 'after');
            });
            it('moveItems not from recordSet', function (done) {
                var moveItems = [6];
                mover._notify = function (event, args) {
                    if (event === 'afterItemsMove') {
                        chai_1.assert.deepEqual(args[0], moveItems);
                        done();
                    }
                };
                mover.moveItems(moveItems, 1, 'on');
            });
            it('moveItems in folder', function (done) {
                mover._notify = function (event) {
                    if (event === 'afterItemsMove') {
                        chai_1.assert.equal(items.getRecordById(4).get('folder'), 1);
                        chai_1.assert.equal(items.getRecordById(5).get('folder'), 1);
                        done();
                    }
                };
                mover.moveItems([4, 5], 1, 'on');
            });
            it('moveItems in folder with change order', function (done) {
                mover._notify = function (event) {
                    if (event === 'afterItemsMove') {
                        chai_1.assert.equal(items.getRecordById(3).get('folder'), 1);
                        done();
                    }
                };
                mover.moveItems([3], 4, 'after');
            });
            it('moveItems in root', function (done) {
                var movedItems = [];
                movedItems.push(items.getRecordById(4));
                movedItems.push(items.getRecordById(5));
                mover._notify = function (event) {
                    if (event === 'afterItemsMove') {
                        chai_1.assert.equal(items.getRecordById(4).get('folder'), null);
                        chai_1.assert.equal(items.getRecordById(5).get('folder'), null);
                        done();
                    }
                };
                mover.moveItems(movedItems, null, 'on');
            });
            it('moveItems in list', function () {
                mover.moveItems([4], 5, 'on');
                chai_1.assert.equal(items.getRecordById(4).get('folder'), 1);
            });
            it('moveItems folder in child folder', function () {
                mover.moveItems([1], 4, 'on');
                chai_1.assert.equal(items.getRecordById(1).get('folder'), null);
            });
            it('moveItems in himself', function () {
                mover.moveItems([1], 1, 'on');
                chai_1.assert.equal(items.getRecordById(1).get('folder'), null);
            });
            it('beforeItemsMove = MoveInItems', function (done) {
                var item = items.at(0);
                var target = items.at(2);
                mover._notify = function (event) {
                    if (event === 'beforeItemsMove') {
                        return Promise.resolve('MoveInItems');
                    }
                };
                mover.moveItems([item], target, 'after')
                    .then(function () {
                    chai_1.assert.equal(items.at(2).getId(), item.getId());
                    mover._controller._source.query()
                        .then(function (dataSet) {
                        chai_1.assert.equal(dataSet.getAll().at(0).getId(), item.getId());
                        done();
                    });
                });
            });
            it('beforeItemsMove = Custom', function (done) {
                var item = items.at(0);
                var target = items.at(2);
                mover._notify = function (event) {
                    if (event === 'beforeItemsMove') {
                        return 'Custom';
                    }
                };
                mover.moveItems([item], target, 'after');
                chai_1.assert.equal(items.at(0).getId(), item.getId());
                mover._controller._source.query()
                    .then(function (dataSet) {
                    chai_1.assert.equal(dataSet.getAll().at(0).getId(), item.getId());
                    done();
                });
            });
            it('move returns deferred', function () {
                var result;
                //dont move moveItemUp
                result = mover.moveItemUp(1);
                chai_1.assert.isTrue(result instanceof Promise);
                //move moveItemUp
                result = mover.moveItemUp(2);
                chai_1.assert.isTrue(result instanceof Promise);
                //dont move moveItemDown
                result = mover.moveItemDown(5);
                chai_1.assert.isTrue(result instanceof Promise);
                //move moveItemDown
                result = mover.moveItemDown(4);
                chai_1.assert.isTrue(result instanceof Promise);
                //move without target moveItems
                result = mover.moveItems([1, 2]);
                chai_1.assert.isTrue(result instanceof Promise);
                //move without items moveItems
                result = mover.moveItems([], 3, 'after');
                chai_1.assert.isTrue(result instanceof Promise);
                //move moveItems
                result = mover.moveItems([1, 2], 3, 'after');
                chai_1.assert.isTrue(result instanceof Promise);
            });
            it('move by selection', function (done) {
                mover._notify = function (event, args) {
                    if (event === 'beforeItemsMove') {
                        chai_1.assert.deepEqual(args[0], [1, 2]);
                    }
                };
                mover.moveItems({
                    selected: [1, 2],
                    excluded: []
                }, 3, 'after').then(function () {
                    done();
                });
            });
            it('getSiblingItem', function () {
                var siblingItem;
                siblingItem = mover._controller.getSiblingItem(items.getRecordById(6), 'before');
                chai_1.assert.equal(siblingItem.getId(), 3);
                siblingItem = mover._controller.getSiblingItem(items.getRecordById(6), 'after');
                chai_1.assert.isNull(siblingItem);
                siblingItem = mover._controller.getSiblingItem(items.getRecordById(3), 'after');
                chai_1.assert.equal(siblingItem.getId(), 6);
                siblingItem = mover._controller.getSiblingItem(items.getRecordById(3), 'before');
                chai_1.assert.equal(siblingItem.getId(), 2);
                siblingItem = mover._controller.getSiblingItem(items.getRecordById(1), 'after');
                chai_1.assert.equal(siblingItem.getId(), 2);
                siblingItem = mover._controller.getSiblingItem(items.getRecordById(1), 'before');
                chai_1.assert.isNull(siblingItem);
                mover._options.root = 1;
                siblingItem = mover._controller.getSiblingItem(items.getRecordById(4), 'after');
                chai_1.assert.equal(siblingItem.getId(), 5);
            });
        });
    });
});
