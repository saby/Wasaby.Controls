define([
   'Controls/List/BaseControl/SelectionController',
   'WS.Data/Collection/RecordSet',
   'WS.Data/Entity/Record',
   'Controls/Controllers/Multiselect/Selection'
], function(
   SelectionController,
   RecordSet,
   Record,
   Selection
) {
   'use strict';
   describe('Controls.List.BaseControl.SelectionController', function() {
      var
         instance,
         eventQueue,
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
         cfg;

      beforeEach(function() {
         rs = new RecordSet({
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
               updateSelection: function() {

               }
            }
         };
         instance = new SelectionController();
         instance._notify = mockNotify();
         instance.saveOptions(cfg);
         eventQueue = [];
      });

      function mockNotify(returnValue) {
         return function(eventName, eventArgs, eventOptions) {
            eventQueue.push({
               eventName: eventName,
               eventArgs: eventArgs,
               eventOptions: eventOptions
            });
            return returnValue;
         };
      }

      it('_beforeMount with flat list', function(done) {
         var flatListCfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: rs,
            keyProperty: 'id',
            listModel: {
               updateSelection: function() {

               }
            }
         };
         var inst = new SelectionController();
         inst._beforeMount(flatListCfg).addCallback(function() {
            assert.isTrue(inst._multiselection instanceof Selection);
            done();
         });
      });

      it('_afterMount', function(done) {
         instance._beforeMount(cfg).addCallback(function() {
            instance._afterMount();
            assert.equal(eventQueue.length, 2);
            var firstEvent = eventQueue[0];
            assert.equal(firstEvent.eventName, 'selectedKeysCountChanged');
            assert.equal(firstEvent.eventArgs[0], 0);
            var secondEvent = eventQueue[1];
            assert.equal(secondEvent.eventName, 'register');
            assert.equal(secondEvent.eventArgs[0], 'selectedTypeChanged');
            assert.equal(secondEvent.eventArgs[1], instance);
            assert.isTrue(typeof secondEvent.eventArgs[2] === 'function');
            assert.isTrue(secondEvent.eventOptions.bubbling);
            assert.isTrue(instance._options.items.hasEventHandlers('onCollectionChange'));
            done();
         });
      });

      describe('_beforeUpdate', function() {
         it('change items', function(done) {
            instance._beforeMount(cfg).addCallback(function() {
               instance._afterMount();
               eventQueue = [];
               var newItems = new RecordSet({
                  idProperty: 'id',
                  rawData: items.slice(0)
               });
               var newCfg = Object.assign({}, cfg);
               newCfg.items = newItems;
               instance._multiselection.setItems = function() {
                  assert.deepEqual(newItems, arguments[0]);
               };
               instance._beforeUpdate(newCfg);
               assert.equal(eventQueue.length, 0);
               done();
            });
         });

         it('change selectedKeys', function(done) {
            var
               selection,
               newCfg = Object.assign({}, cfg);

            instance._beforeMount(cfg).addCallback(function() {
               instance._afterMount();
               eventQueue = [];

               newCfg.selectedKeys = [3, 4];
               instance._beforeUpdate(newCfg);
               selection = instance._multiselection.getSelection();
               assert.deepEqual(selection.selected, newCfg.selectedKeys);
               assert.deepEqual(selection.excluded, newCfg.excludedKeys);
               var firstEvent = eventQueue[0];
               assert.equal(firstEvent.eventName, 'selectedKeysChanged');
               assert.deepEqual(firstEvent.eventArgs[0], [3, 4]);
               assert.deepEqual(firstEvent.eventArgs[1], [3, 4]);
               assert.deepEqual(firstEvent.eventArgs[2], []);
               var secondEvent = eventQueue[1];
               assert.equal(secondEvent.eventName, 'selectedKeysCountChanged');
               assert.deepEqual(secondEvent.eventArgs[0], 2);
               done();
            });
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

         it('select item', function(done) {
            instance._beforeMount(cfg).addCallback(function() {
               wrapMultiselectionMethods(instance);
               instance.onCheckBoxClick(1, false);
               assert.isTrue(selectCalled);
               assert.isFalse(unselectCalled);
               assert.equal(eventQueue.length, 2);
               var firstEvent = eventQueue[0];
               assert.equal(firstEvent.eventName, 'selectedKeysChanged');
               assert.deepEqual(firstEvent.eventArgs[0], [1]);
               assert.deepEqual(firstEvent.eventArgs[1], [1]);
               assert.deepEqual(firstEvent.eventArgs[2], []);
               var secondEvent = eventQueue[1];
               assert.equal(secondEvent.eventName, 'selectedKeysCountChanged');
               assert.deepEqual(secondEvent.eventArgs[0], 5);
               done();
            });
         });

         it('unselect item', function(done) {
            instance._beforeMount(cfg).addCallback(function() {
               wrapMultiselectionMethods(instance);
               instance._options.selectedKeys = [1];
               instance._options.selectedKeysCount = 5;
               instance._multiselection._selectedKeys = [1];
               instance.onCheckBoxClick(1, true);
               assert.isFalse(selectCalled);
               assert.isTrue(unselectCalled);
               assert.equal(eventQueue.length, 2);
               var firstEvent = eventQueue[0];
               assert.equal(firstEvent.eventName, 'selectedKeysChanged');
               assert.deepEqual(firstEvent.eventArgs[0], []);
               assert.deepEqual(firstEvent.eventArgs[1], []);
               assert.deepEqual(firstEvent.eventArgs[2], [1]);
               var secondEvent = eventQueue[1];
               assert.equal(secondEvent.eventName, 'selectedKeysCountChanged');
               assert.deepEqual(secondEvent.eventArgs[0], 0);
               done();
            });
         });

         it('unselect nested item when parent is selected', function(done) {
            instance._beforeMount(cfg).addCallback(function() {
               wrapMultiselectionMethods(instance);
               instance._options.selectedKeys = [1];
               instance._options.selectedKeysCount = 5;
               instance._multiselection._selectedKeys = [1];
               instance.onCheckBoxClick(2, true);
               assert.isFalse(selectCalled);
               assert.isTrue(unselectCalled);
               assert.equal(eventQueue.length, 2);
               var firstEvent = eventQueue[0];
               assert.equal(firstEvent.eventName, 'excludedKeysChanged');
               assert.deepEqual(firstEvent.eventArgs[0], [2]);
               assert.deepEqual(firstEvent.eventArgs[1], [2]);
               assert.deepEqual(firstEvent.eventArgs[2], []);
               var secondEvent = eventQueue[1];
               assert.equal(secondEvent.eventName, 'selectedKeysCountChanged');
               assert.deepEqual(secondEvent.eventArgs[0], 2);
               done();
            });
         });
      });

      it('_beforeUnmount', function(done) {
         instance._beforeMount(cfg).addCallback(function() {
            instance._afterMount();
            eventQueue = [];
            instance._beforeUnmount();
            assert.isNull(instance._multiselection);
            assert.isFalse(instance._options.items.hasEventHandlers('onCollectionChange'));
            assert.isNull(instance._onCollectionChangeHandler);
            assert.equal(eventQueue.length, 1);
            var firstEvent = eventQueue[0];
            assert.equal(firstEvent.eventName, 'unregister');
            assert.equal(firstEvent.eventArgs[0], 'selectedTypeChanged');
            assert.equal(firstEvent.eventArgs[1], instance);
            assert.isTrue(firstEvent.eventOptions.bubbling);
            done();
         });
      });

      it('_private.selectedTypeChangedHandler', function(done) {
         instance._beforeMount(cfg).addCallback(function() {
            var toggleAllCalled, unselectAllCalled, selectAllCalled;
            instance._multiselection.toggleAll = function() {
               toggleAllCalled = true;
            };
            SelectionController._private.selectedTypeChangedHandler.call(instance, 'toggleAll');
            assert.isTrue(toggleAllCalled);
            instance._multiselection.selectAll = function() {
               selectAllCalled = true;
            };
            SelectionController._private.selectedTypeChangedHandler.call(instance, 'selectAll');
            assert.isTrue(selectAllCalled);
            instance._multiselection.unselectAll = function() {
               unselectAllCalled = true;
            };
            SelectionController._private.selectedTypeChangedHandler.call(instance, 'unselectAll');
            assert.isTrue(unselectAllCalled);
            done();
         });
      });

      describe('_onCollectionChange', function() {
         it('remove', function(done) {
            instance._beforeMount(cfg).addCallback(function() {
               instance._afterMount();
               eventQueue = [];
               instance._multiselection.unselect = function(removed) {
                  assert.deepEqual([3], removed);
               };
               instance._options.items.remove(instance._options.items.getRecordById(3));
               done();
            });
         });

         it('add', function(done) {
            instance._beforeMount(cfg).addCallback(function() {
               instance._afterMount();
               eventQueue = [];
               instance._multiselection.unselect = function() {
                  throw new Error('unselect shouldn\'t be called after adding.');
               };
               instance._options.items.add(new Record({
                  rawData: {
                     'id': 11,
                     'Раздел': null,
                     'Раздел@': true
                  }
               }));
               done();
            });
         });
      });
   });
});
