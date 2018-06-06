define(['Controls/Container/MassSelector'], function(MassSelector) {
   'use strict';
   describe('Controls.Container.MassSelector', function() {
      var cfg = {
            selectedKeys: [1, 2],
            excludedKeys: []
         },
         cfg1 = {
            selectedKeys: [],
            excludedKeys: []
         },
         cfg2 = {
            selectedKeys: [null],
            excludedKeys: []
         },
         cfg3 = {
            selectedKeys: [null],
            excludedKeys: [1]
         },
         items = [
            {
               getId: function() {
                  return 0;
               }
            },
            {
               getId: function() {
                  return 1;
               }
            },
            {
               getId: function() {
                  return 2;
               }
            },
            {
               getId: function() {
                  return 3;
               }
            }
         ];

      //расширяю items чтобы не уеплять наши структуры в демку
      items.subscribe = function() {};
      items.unsubscribe = function() {};

      it('getSelection', function() {
         var instance = new MassSelector();
         instance._beforeMount(cfg);
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
         var instance = new MassSelector(cfg);
         instance.saveOptions(cfg);
         instance._beforeMount(cfg);
         assert.equal(count, 1);
      });

      it('_getChildContext', function() {
         var instance = new MassSelector(cfg);
         var expected = {
            selection: {
               count: 2,
               selectedKeys: [1, 2]
            }
         };
         instance.saveOptions(cfg);
         instance._beforeMount(cfg);
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
      });

      describe('_updateCount', function() {
         var count;

         var instance = new MassSelector();

         it('number count', function() {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            count = instance._count;
            assert.equal(count, 2);
         });

         it('zero count', function() {
            instance.saveOptions(cfg1);
            instance._beforeMount(cfg1);
            count = instance._count;
            assert.equal(count, 0);
         });

         it('all', function() {
            instance.saveOptions(cfg2);
            instance._beforeMount(cfg2);
            count = instance._count;
            assert.equal(count, 'all');
         });

         it('part', function() {
            instance.saveOptions(cfg3);
            instance._beforeMount(cfg3);
            count = instance._count;
            assert.equal(count, 'part');
         });
      });

      it('_itemsReadyCallback', function() {
         var instance = new MassSelector();

         instance.saveOptions(cfg);
         instance._beforeMount(cfg);
         instance._itemsReadyCallback(items);
         assert.equal(instance._items, items);
      });

      describe('_updateSelectedKeys', function() {
         var selectedKeys;

         var instance = new MassSelector();
         it('selected count', function() {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._updateSelectedKeys();
            selectedKeys = instance._selectedKeys;
            assert.equal(selectedKeys.length, 2);
            assert.equal(selectedKeys[0], 1);
            assert.equal(selectedKeys[1], 2);
         });

         it('selected zero', function() {
            instance.saveOptions(cfg1);
            instance._beforeMount(cfg1);
            instance._updateSelectedKeys();
            selectedKeys = instance._selectedKeys;
            assert.equal(selectedKeys.length, 0);
         });

         it('selected all items', function() {
            instance.saveOptions(cfg2);
            instance._beforeMount(cfg2);
            instance._itemsReadyCallback(items);
            instance._updateSelectedKeys();
            selectedKeys = instance._selectedKeys;
            assert.equal(selectedKeys.length, 4);
         });

         it('selected part items', function() {
            instance.saveOptions(cfg3);
            instance._beforeMount(cfg3);
            instance._itemsReadyCallback(items);
            instance._updateSelectedKeys();
            selectedKeys = instance._selectedKeys;
            assert.equal(selectedKeys.length, 3);
         });
      });

      describe('_selectedTypeChangedHandler', function() {
         var count;
         var instance = new MassSelector();
         instance.saveOptions(cfg);
         instance._beforeMount(cfg);
         instance._itemsReadyCallback(items);

         count = instance._count;
         assert.equal(count, 2);

         it('toggleAll', function() {
            instance._selectedTypeChangedHandler([], 'toggleAll');
            count = instance._count;
            assert.equal(count, 'part');
         });

         it('selectAll', function() {
            instance._selectedTypeChangedHandler([], 'selectAll');
            count = instance._count;
            assert.equal(count, 'all');
         });

         it('unselectAll', function() {
            instance._selectedTypeChangedHandler([], 'unselectAll');
            count = instance._count;
            assert.equal(count, 0);
         });
      });

      describe('_afterItemsRemoveHandler', function() {
         var count;
         var instance = new MassSelector();
         instance.saveOptions(cfg);
         instance._beforeMount(cfg);

         count = instance._count;
         assert.equal(count, 2);

         it('1 key', function() {
            instance._afterItemsRemoveHandler([], [1]);
            count = instance._count;
            assert.equal(count, 1);
         });

         it('2 key', function() {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._afterItemsRemoveHandler([], [1, 2]);
            count = instance._count;
            assert.equal(count, 0);
            cfg = {
               selectedKeys: [1, 2],
               excludedKeys: []
            };
         });
      });

      describe('_onCheckBoxClickHandler', function() {
         var selectedKeys, count;

         var instance = new MassSelector();
         it('first elem click to false', function() {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._onCheckBoxClickHandler({}, 1, 1);
            selectedKeys = instance._selectedKeys;
            assert.equal(selectedKeys.length, 1);
            assert.equal(selectedKeys[0], 2);
            cfg = {
               selectedKeys: [1, 2],
               excludedKeys: []
            };
         });

         it('second elem click to false', function() {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._onCheckBoxClickHandler({}, 2, 1);
            selectedKeys = instance._selectedKeys;
            assert.equal(selectedKeys.length, 1);
            assert.equal(selectedKeys[0], 1);
            cfg = {
               selectedKeys: [1, 2],
               excludedKeys: []
            };
         });

         it('another elem click to true', function() {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._onCheckBoxClickHandler({}, 50, 0);
            selectedKeys = instance._selectedKeys;
            assert.equal(selectedKeys.length, 3);
            assert.equal(selectedKeys[2], 50);
            cfg = {
               selectedKeys: [1, 2],
               excludedKeys: []
            };
         });



         it('selected all click to false', function() {
            instance.saveOptions(cfg2);
            instance._beforeMount(cfg2);
            instance._itemsReadyCallback(items);
            instance._onCheckBoxClickHandler({}, 3, 1);
            selectedKeys = instance._selectedKeys;
            count = instance._count;
            assert.equal(selectedKeys.length, 3);
            assert.equal(count, 'part');
         });


         it('selected part click to true', function() {
            instance.saveOptions(cfg3);
            instance._beforeMount(cfg3);
            instance._itemsReadyCallback(items);
            instance._onCheckBoxClickHandler({}, 1, 0);
            selectedKeys = instance._selectedKeys;
            count = instance._count;
            assert.equal(selectedKeys.length, 4);
            assert.equal(count, 'all');
         });
      });
   });
});
