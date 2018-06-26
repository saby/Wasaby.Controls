define(['Controls/Container/MassSelector'], function(MassSelector) {
   'use strict';
   describe('Controls.Container.MassSelector', function() {
      var
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
         ],
         cfg = {
            selectedKeys: [1, 2],
            excludedKeys: [],
            items: items
         },
         cfg1 = {
            selectedKeys: [],
            excludedKeys: [],
            items: items
         },
         cfg2 = {
            selectedKeys: [null],
            excludedKeys: [],
            items: items
         },
         cfg3 = {
            selectedKeys: [null],
            excludedKeys: [1],
            items: items
         };

      //расширяю items чтобы не цеплять наши структуры в демку
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

      describe('сount', function() {
         var count;

         var instance = new MassSelector();

         it('number count', function() {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            count = instance._multiselection.getCount();
            assert.equal(count, 2);
         });

         it('zero count', function() {
            instance.saveOptions(cfg1);
            instance._beforeMount(cfg1);
            count = instance._multiselection.getCount();
            assert.equal(count, 0);
         });

         it('all', function() {
            instance.saveOptions(cfg2);
            instance._beforeMount(cfg2);
            count = instance._multiselection.getCount();
            assert.equal(count, 'all');
         });

         it('part', function() {
            instance.saveOptions(cfg3);
            instance._beforeMount(cfg3);
            count = instance._multiselection.getCount();
            assert.equal(count, 'part');
         });
      });

      describe('_selectedTypeChangedHandler', function() {
         var count;
         var instance = new MassSelector();
         instance.saveOptions(cfg);
         instance._beforeMount(cfg);

         count = instance._multiselection.getCount();
         assert.equal(count, 2);

         it('toggleAll', function() {
            instance._selectedTypeChangedHandler([], 'toggleAll');
            count = instance._multiselection.getCount();
            assert.equal(count, 'part');
         });

         it('selectAll', function() {
            instance._selectedTypeChangedHandler([], 'selectAll');
            count = instance._multiselection.getCount();
            assert.equal(count, 'all');
         });

         it('unselectAll', function() {
            instance._selectedTypeChangedHandler([], 'unselectAll');
            count = instance._multiselection.getCount();
            assert.equal(count, 0);
         });
      });

      describe('_afterItemsRemoveHandler', function() {
         var count;
         var instance = new MassSelector();
         instance.saveOptions(cfg);
         instance._beforeMount(cfg);

         count = instance._multiselection.getCount();
         assert.equal(count, 2);

         it('1 key', function() {
            instance._afterItemsRemoveHandler([], [1]);
            count = instance._multiselection.getCount();
            assert.equal(count, 1);
         });

         it('2 key', function() {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._afterItemsRemoveHandler([], [1, 2]);
            count = instance._multiselection.getCount();
            assert.equal(count, 0);
         });
      });

      describe('_onCheckBoxClickHandler', function() {
         var selectedKeys, count, excludedKeys;

         var instance = new MassSelector();
         it('first elem click to false', function() {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._onCheckBoxClickHandler({}, 1, true);
            selectedKeys = instance._multiselection.getSelection().selected;
            assert.equal(selectedKeys.length, 1);
            assert.equal(selectedKeys[0], 2);
         });

         it('second elem click to false', function() {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._onCheckBoxClickHandler({}, 2, true);
            selectedKeys = instance._multiselection.getSelection().selected;
            assert.equal(selectedKeys.length, 1);
            assert.equal(selectedKeys[0], 1);
         });

         it('another elem click to true', function() {
            instance.saveOptions(cfg);
            instance._beforeMount(cfg);
            instance._onCheckBoxClickHandler({}, 50, false);
            selectedKeys = instance._multiselection.getSelection().selected;
            assert.equal(selectedKeys.length, 3);
            assert.equal(selectedKeys[2], 50);
         });



         it('selected all click to false', function() {
            instance.saveOptions(cfg2);
            instance._beforeMount(cfg2);
            instance._onCheckBoxClickHandler({}, 3, true);
            selectedKeys = instance._multiselection.getSelection().selected;
            excludedKeys = instance._multiselection.getSelection().excluded;
            count = instance._multiselection.getCount();
            assert.equal(selectedKeys.length, 1);
            assert.isNull(selectedKeys[0]);
            assert.equal(excludedKeys.length, 1);
            assert.equal(excludedKeys[0], 3);
            assert.equal(count, 'part');
         });


         it('selected part click to true', function() {
            instance.saveOptions(cfg3);
            instance._beforeMount(cfg3);
            instance._onCheckBoxClickHandler({}, 1, false);
            selectedKeys = instance._multiselection.getSelection().selected;
            excludedKeys = instance._multiselection.getSelection().excluded;
            count = instance._multiselection.getCount();
            assert.equal(selectedKeys.length, 1);
            assert.isNull(selectedKeys[0]);
            assert.equal(excludedKeys.length, 0);
            assert.equal(count, 'all');
         });
      });
   });
});
