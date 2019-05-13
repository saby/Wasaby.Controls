define([
   'Controls/List/BaseControl/SelectionController',
   'Types/collection',
   'Types/entity',
   'Controls/Controllers/Multiselect/Selection'
], function(
   SelectionController,
   collection,
   entity,
   Selection
) {
   'use strict';
   describe('Controls.List.BaseControl.SelectionController', function() {
      var
         instance,
         items = [
            {
               'id': 1,
               'Раздел': null,
               'Раздел@': true
            }, {
               'id': 2,
               'Раздел': 1,
               'Раздел@': true
            }, {
               'id': 3,
               'Раздел': 2,
               'Раздел@': false
            }, {
               'id': 4,
               'Раздел': 2,
               'Раздел@': false
            }, {
               'id': 5,
               'Раздел': 1,
               'Раздел@': false
            }, {
               'id': 6,
               'Раздел': null,
               'Раздел@': true
            }, {
               'id': 7,
               'Раздел': null,
               'Раздел@': false
            }
         ],
         rs,
         cfg,
         sandbox;

      beforeEach(function() {
         sandbox = sinon.createSandbox();
         rs = new collection.RecordSet({
            idProperty: 'id',
            rawData: items
         });
         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: rs,
            parentProperty: 'Раздел',
            nodeProperty: 'Раздел@',
            keyProperty: 'id',
            listModel: {
               updateSelection: sandbox.stub()
            }
         };
         instance = new SelectionController();
         instance.saveOptions(cfg);
      });

      afterEach(function() {
         sandbox.restore();
      });

      it('_beforeMount with flat list', async function() {
         var flatListCfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: rs,
            keyProperty: 'id',
            listModel: {
               updateSelection: sandbox.stub()
            }
         };
         var inst = new SelectionController();
         await inst._beforeMount(flatListCfg);
         assert.isTrue(inst._multiselection instanceof Selection);
      });

      it('_afterMount', async function() {
         await instance._beforeMount(cfg);
         const stubNotify = sandbox.stub(instance, '_notify');
         instance._afterMount();
         assert.isTrue(stubNotify.withArgs('listSelectedKeysCountChanged', [0], {bubbling: true}).calledOnce);
         assert.isTrue(stubNotify.withArgs('register', ['selectedTypeChanged', instance, SelectionController._private.selectedTypeChangedHandler], {bubbling: true}).calledOnce);
         assert.isTrue(instance._options.items.hasEventHandlers('onCollectionChange'));
      });

      describe('_beforeUpdate', function() {
         it('change items', async function() {
            await instance._beforeMount(cfg);
            instance._afterMount();
            var newItems = new collection.RecordSet({
               idProperty: 'id',
               rawData: items.slice(0)
            });
            var newCfg = Object.assign({}, cfg);
            newCfg.items = newItems;
            const stubNotify = sandbox.stub(instance, '_notify');
            const stubSetItems = sandbox.stub(instance._multiselection, 'setItems');
            instance._beforeUpdate(newCfg);
            assert.isTrue(stubSetItems.withArgs(newItems).calledOnce);
            assert.isFalse(stubNotify.called);
         });

         it('change selectedKeys', async function() {
            var
               selection,
               newCfg = Object.assign({}, cfg);

            await instance._beforeMount(cfg);
            instance._afterMount();
            const stubNotify = sandbox.stub(instance, '_notify');

            newCfg.selectedKeys = [3, 4];
            instance._beforeUpdate(newCfg);
            selection = instance._multiselection.getSelection();
            assert.deepEqual(selection.selected, newCfg.selectedKeys);
            assert.deepEqual(selection.excluded, newCfg.excludedKeys);
            assert.isTrue(stubNotify.withArgs('selectedKeysChanged', [[3, 4], [3, 4], []]).calledOnce);
            assert.isTrue(stubNotify.withArgs('listSelectedKeysCountChanged', [2], { bubbling: true }).calledOnce);
         });
      });

      describe('onCheckBoxClick', function() {
         var
            selectCalled,
            unselectCalled;

         beforeEach(function() {
            selectCalled = false;
            unselectCalled = false;
         });

         function wrapMultiselectionMethods(inst) {
            var oldSelect = inst._multiselection.select;
            inst._multiselection.select = function(key) {
               oldSelect.call(inst._multiselection, key);
               selectCalled = true;
            };
            var oldUnselect = inst._multiselection.unselect;
            inst._multiselection.unselect = function(key) {
               oldUnselect.call(inst._multiselection, key);
               unselectCalled = true;
            };
         }

         it('select item', async function() {
            await instance._beforeMount(cfg);
            wrapMultiselectionMethods(instance);
            const stubNotify = sandbox.stub(instance, '_notify');
            instance.onCheckBoxClick(1, false);
            assert.isTrue(selectCalled);
            assert.isFalse(unselectCalled);
            assert.isTrue(stubNotify.withArgs('selectedKeysChanged', [[1], [1], []]).calledOnce);
            assert.isTrue(stubNotify.withArgs('listSelectedKeysCountChanged', [5], { bubbling: true }).calledOnce);
         });

         it('unselect item', async function() {
            await instance._beforeMount(cfg);
            wrapMultiselectionMethods(instance);
            instance._options.selectedKeys = [1];
            instance._options.selectedKeysCount = 5;
            instance._multiselection._selectedKeys = [1];
            const stubNotify = sandbox.stub(instance, '_notify');
            instance.onCheckBoxClick(1, true);
            assert.isFalse(selectCalled);
            assert.isTrue(unselectCalled);
            assert.isTrue(stubNotify.withArgs('selectedKeysChanged', [[], [], [1]]).calledOnce);
            assert.isTrue(stubNotify.withArgs('listSelectedKeysCountChanged', [0], { bubbling: true }).calledOnce);
         });

         it('unselect nested item when parent is selected', async function() {
            await instance._beforeMount(cfg);
            wrapMultiselectionMethods(instance);
            instance._options.selectedKeys = [1];
            instance._options.selectedKeysCount = 5;
            instance._multiselection._selectedKeys = [1];
            const stubNotify = sandbox.stub(instance, '_notify');
            instance.onCheckBoxClick(2, true);
            assert.isFalse(selectCalled);
            assert.isTrue(unselectCalled);
            assert.isTrue(stubNotify.withArgs('excludedKeysChanged', [[2], [2], []]).calledOnce);
            assert.isTrue(stubNotify.withArgs('listSelectedKeysCountChanged', [2], { bubbling: true }).calledOnce);
         });
      });

      it('_beforeUnmount', async function() {
         await instance._beforeMount(cfg);
         instance._afterMount();
         const stubNotify = sandbox.stub(instance, '_notify');
         instance._options.listModel.updateSelection = sandbox.stub();
         instance._beforeUnmount();
         assert.isTrue(instance._options.listModel.updateSelection.withArgs({}).calledOnce);
         assert.isNull(instance._multiselection);
         assert.isFalse(instance._options.items.hasEventHandlers('onCollectionChange'));
         assert.isNull(instance._onCollectionChangeHandler);
         assert.isTrue(stubNotify.withArgs('unregister', ['selectedTypeChanged', instance], { bubbling: true }).calledOnce);
      });

      it('_private.selectedTypeChangedHandler', async function() {
         await instance._beforeMount(cfg);
         instance._multiselection.toggleAll = sandbox.stub();
         SelectionController._private.selectedTypeChangedHandler.call(instance, 'toggleAll');
         assert.isTrue(instance._multiselection.toggleAll.calledOnce);
         instance._multiselection.selectAll = sandbox.stub();
         SelectionController._private.selectedTypeChangedHandler.call(instance, 'selectAll');
         assert.isTrue(instance._multiselection.selectAll.calledOnce);
         instance._multiselection.unselectAll = sandbox.stub();
         SelectionController._private.selectedTypeChangedHandler.call(instance, 'unselectAll');
         assert.isTrue(instance._multiselection.unselectAll.calledOnce);
      });

      describe('_onCollectionChange', function() {
         it('remove', async function() {
            await instance._beforeMount(cfg);
            instance._afterMount();
            instance._multiselection.unselect = sandbox.stub();
            instance._options.items.remove(instance._options.items.getRecordById(3));
            assert.isTrue(instance._multiselection.unselect.withArgs([3]).calledOnce);
         });

         it('add', async function() {
            await instance._beforeMount(cfg);
            instance._afterMount();
            instance._multiselection.unselect = sandbox.stub();
            instance._options.items.add(new entity.Record({
               rawData: {
                  'id': 11,
                  'Раздел': null,
                  'Раздел@': true
               }
            }));
            assert.isFalse(instance._multiselection.unselect.called);
         });
      });
   });
});
