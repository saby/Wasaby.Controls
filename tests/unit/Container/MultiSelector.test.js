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
         },
         cfg2 = {
            selectedKeys: [null],
            excludedKeys: [1]
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

      it('_beforeUpdate', function() {
         var instance = new MultiSelector();
         instance._multiselection = {
            setItems: function(items) {
               assert.deepEqual(context.dataOptions.items, items);
            }
         };
         instance._beforeUpdate(cfg, context);
         assert.deepEqual(context.dataOptions.items, instance._items);
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
         var count;

         it('toggleAll', function() {
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg, context);
            instance._selectedTypeChangedHandler([], 'toggleAll');
            count = instance._multiselection.getCount();
            assert.equal(count, 2);
         });

         it('selectAll', function() {
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg, context);
            instance._selectedTypeChangedHandler([], 'selectAll');
            count = instance._multiselection.getCount();
            assert.equal(count, 4);
         });

         it('unselectAll', function() {
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg, context);
            instance._selectedTypeChangedHandler([], 'unselectAll');
            count = instance._multiselection.getCount();
            assert.equal(count, 0);
         });
      });

      describe('_onListSelectionChange', function() {
         it('first elem click to false', function(done) {
            //TODO: щас поправлю
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._multiselection.unselect = function(removed) {
                  assert.deepEqual([3, 4], removed);
               };
               instance._multiselection.select = function(added) {
                  assert.deepEqual([1, 2], added);
               };
               instance._onListSelectionChange({}, {added: [1, 2], removed: [3, 4]});
               done();
            });
         });
      });
   });
});
