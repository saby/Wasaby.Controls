define([
   'Controls/Container/MultiSelector',
   'WS.Data/Collection/RecordSet'
], function(
   MultiSelector,
   RecordSet
) {
   'use strict';
   describe('Controls.Container.MultiSelector', function() {
      var
         items = [
            {
               id: 0
            },
            {
               id: 1
            },
            {
               id: 2
            },
            {
               id: 3
            }
         ],
         context = {
            dataOptions: {
               items: new RecordSet({
                  idProperty: 'id',
                  rawData: items
               })
            }
         },
         cfg = {
            selectedKeys: [1, 2],
            excludedKeys: []
         },
         cfg1 = {
            selectedKeys: [null],
            excludedKeys: []
         };

      it('getSelection', function() {
         var instance = new MultiSelector();
         instance._beforeMount(cfg, context);
         var selection = instance.getSelection();
         assert.equal(selection.selected.length, 2);
         assert.equal(selection.selected[0], 1);
         assert.equal(selection.selected[1], 2);
         assert.equal(selection.excluded.length, 0);
      });

      describe('_beforeUpdate', function() {
         it('change items', function() {
            var instance = new MultiSelector();
            instance._createMultiselection(cfg, context);
            instance._beforeUpdate(cfg, context);
            assert.deepEqual(context.dataOptions.items, instance._items);
         });

         it('change selectedKeys', function() {
            var
               instance = new MultiSelector(),
               newCfg = {
                  selectedKeys: [3, 4],
                  excludedKeys: cfg.excludedKeys
               },
               selection;
            instance._beforeMount(cfg, context);
            instance._beforeUpdate(newCfg, context);
            selection = instance._multiselection.getSelection();
            assert.deepEqual(selection.selected, newCfg.selectedKeys);
            assert.deepEqual(selection.excluded, newCfg.excludedKeys);
         });

         it('change excludedKeys', function() {
            var
               instance = new MultiSelector(),
               newCfg = {
                  selectedKeys: cfg1.selectedKeys,
                  excludedKeys: [3, 4]
               },
               selection;
            instance._beforeMount(cfg1, context);
            instance._beforeUpdate(newCfg, context);
            selection = instance._multiselection.getSelection();
            assert.deepEqual(selection.selected, newCfg.selectedKeys);
            assert.deepEqual(selection.excluded, newCfg.excludedKeys);
         });
      });

      it('_getChildContext', function() {
         var instance = new MultiSelector(cfg);
         var expected = {
            selection: {
               count: 2,
               selectedKeys: [1, 2]
            }
         };
         instance.saveOptions(cfg);
         instance._beforeMount(cfg, context);
         var childContext = instance._getChildContext();
         assert.equal(childContext.selection.count, expected.selection.count);
         assert.equal(
            childContext.selection.selectedKeys.length,
            expected.selection.selectedKeys.length
         );
         assert.equal(
            childContext.selection.selectedKeys[0],
            expected.selection.selectedKeys[0]
         );
         assert.equal(
            childContext.selection.selectedKeys[1],
            expected.selection.selectedKeys[1]
         );
      });

      describe('_selectedTypeChangedHandler', function() {
         var instance, events;

         beforeEach(function() {
            events = [];
            instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg, context);
            instance._notify = function(event, eventArgs) {
               events.push({
                  event: event,
                  eventArgs: eventArgs
               });
            };
         });

         afterEach(function() {
            instance = null;
            events = null;
         });

         it('toggleAll', function() {
            instance._selectedTypeChangedHandler([], 'toggleAll');
            assert.equal(instance._multiselection.getCount(), 2);
            assert.equal(events[0].event, 'selectedKeysChanged');
            assert.deepEqual(events[0].eventArgs, [[null], [null], [1, 2]]);
            assert.equal(events[1].event, 'excludedKeysChanged');
            assert.deepEqual(events[1].eventArgs, [[1, 2], [1, 2], []]);
         });

         it('selectAll', function() {
            instance._selectedTypeChangedHandler([], 'selectAll');
            assert.equal(instance._multiselection.getCount(), 4);
            assert.equal(events.length, 1);
            assert.equal(events[0].event, 'selectedKeysChanged');
            assert.deepEqual(events[0].eventArgs, [[null], [null], [1, 2]]);
         });

         it('unselectAll', function() {
            instance._selectedTypeChangedHandler([], 'unselectAll');
            assert.equal(instance._multiselection.getCount(), 0);
            assert.equal(events.length, 1);
            assert.equal(events[0].event, 'selectedKeysChanged');
            assert.deepEqual(events[0].eventArgs, [[], [], [1, 2]]);
         });
      });

      describe('_onListSelectionChange', function() {
         it('first elem click to false', function() {
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg, context);
            instance._multiselection.unselect = function(removed) {
               assert.deepEqual([3, 4], removed);
            };
            instance._multiselection.select = function(added) {
               assert.deepEqual([1, 2], added);
            };
            instance._onListSelectionChange({}, [], [1, 2], [3, 4]);
         });
      });
   });
});
