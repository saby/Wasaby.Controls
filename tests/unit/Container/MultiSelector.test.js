define([
   'Controls/Container/MultiSelector',
   'WS.Data/Source/Memory'
], function(
   MultiSelector,
   Memory
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
         source = new Memory({
            idProperty: 'id',
            data: items
         }),
         cfg = {
            selectedKeys: [1, 2],
            excludedKeys: [],
            source: source
         },
         cfg1 = {
            selectedKeys: [null],
            excludedKeys: [],
            source: source
         },
         cfg2 = {
            selectedKeys: [null],
            excludedKeys: [1],
            source: source
         };

      it('getSelection', function(done) {
         var instance = new MultiSelector();
         instance._beforeMount(cfg).addCallback(function() {
            var selection = instance.getSelection();
            assert.equal(selection.selected.length, 2);
            assert.equal(selection.selected[0], 1);
            assert.equal(selection.selected[1], 2);
            assert.equal(selection.excluded.length, 0);
            done();
         });
      });

      it('_updateContext', function(done) {
         var count = 0,
            cfg = {
               selectedKeys: [1, 2],
               excludedKeys: [],
               source: source,
               selectionChangeHandler: function() {
                  count++;
               }
            };
         var instance = new MultiSelector(cfg);
         instance.saveOptions(cfg);
         instance._beforeMount(cfg).addCallback(function() {
            assert.equal(count, 1);
            done();
         });
      });

      it('_getChildContext', function(done) {
         var instance = new MultiSelector(cfg);
         var expected = {
            selection: {
               count: 2,
               selectedKeys: [1, 2]
            }
         };
         instance.saveOptions(cfg);
         instance._beforeMount(cfg).addCallback(function() {
            var context = instance._getChildContext();
            assert.equal(context.selection.count, expected.selection.count);
            assert.equal(
               context.selection.selectedKeys.length,
               expected.selection.selectedKeys.length
            );
            assert.equal(
               context.selection.selectedKeys[0],
               expected.selection.selectedKeys[0]
            );
            assert.equal(
               context.selection.selectedKeys[1],
               expected.selection.selectedKeys[1]
            );
            done();
         });
      });

      describe('_selectedTypeChangedHandler', function() {
         var count;

         it('toggleAll', function(done) {
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._selectedTypeChangedHandler([], 'toggleAll');
               count = instance._multiselection.getCount();
               assert.equal(count, 2);
               done();
            });
         });

         it('selectAll', function(done) {
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._selectedTypeChangedHandler([], 'selectAll');
               count = instance._multiselection.getCount();
               assert.equal(count, 4);
               done();
            });
         });

         it('unselectAll', function(done) {
            var instance = new MultiSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._selectedTypeChangedHandler([], 'unselectAll');
               count = instance._multiselection.getCount();
               assert.equal(count, 0);
               done();
            });
         });
      });

      describe('_onListSelectionChange', function() {
         it('first elem click to false', function(done) {
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
