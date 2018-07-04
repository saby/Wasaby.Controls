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

      it('_updateContext', function() {
         var count = 0,
            cfg = {
               selectedKeys: [1, 2],
               excludedKeys: [],
               selectionChangeHandler: function() {
                  count++;
               }
            };
         var instance = new MultiSelector(cfg);
         instance.saveOptions(cfg);
         instance._beforeMount(cfg, context);
         assert.equal(count, 1);
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

      describe('_afterItemsRemoveHandler', function() {
         var count;

         it('1 key', function() {
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg, context);
            instance._afterItemsRemoveHandler([], [1]);
            count = instance._multiselection.getCount();
            assert.equal(count, 1);
         });

         it('2 key', function() {
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg, context);
            instance._afterItemsRemoveHandler([], [1, 2]);
            count = instance._multiselection.getCount();
            assert.equal(count, 0);
         });
      });

      describe('_onCheckBoxClickHandler', function() {
         var selectedKeys, excludedKeys;

         it('first elem click to false', function() {
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg, context);
            instance._onCheckBoxClickHandler({}, 1, true);
            selectedKeys = instance._multiselection.getSelection().selected;
            assert.equal(selectedKeys.length, 1);
            assert.equal(selectedKeys[0], 2);
         });

         it('second elem click to false', function() {
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg, context);
            instance._onCheckBoxClickHandler({}, 2, true);
            selectedKeys = instance._multiselection.getSelection().selected;
            assert.equal(selectedKeys.length, 1);
            assert.equal(selectedKeys[0], 1);
         });

         it('another elem click to true', function() {
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg, context);
            instance._onCheckBoxClickHandler({}, 50, false);
            selectedKeys = instance._multiselection.getSelection().selected;
            assert.equal(selectedKeys.length, 3);
            assert.equal(selectedKeys[2], 50);
         });

         it('selected all click to false', function() {
            var instance = new MultiSelector();
            instance.saveOptions(cfg1);
            instance._beforeMount(cfg1, context);
            instance._onCheckBoxClickHandler({}, 3, true);
            selectedKeys = instance._multiselection.getSelection().selected;
            excludedKeys = instance._multiselection.getSelection().excluded;
            assert.equal(selectedKeys.length, 1);
            assert.isNull(selectedKeys[0]);
            assert.equal(excludedKeys.length, 1);
            assert.equal(excludedKeys[0], 3);
         });

         it('selected part click to true', function() {
            var instance = new MultiSelector();
            instance.saveOptions(cfg2);
            instance._beforeMount(cfg2, context);
            instance._onCheckBoxClickHandler({}, 1, false);
            selectedKeys = instance._multiselection.getSelection().selected;
            excludedKeys = instance._multiselection.getSelection().excluded;
            assert.equal(selectedKeys.length, 1);
            assert.isNull(selectedKeys[0]);
            assert.equal(excludedKeys.length, 0);
         });
      });
   });
});
