define([
   'Controls/Container/MassSelector',
   'WS.Data/Source/Memory'
], function(
   MassSelector,
   Memory
) {
   'use strict';
   describe('Controls.Container.MassSelector', function() {
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
         var instance = new MassSelector();
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
         var instance = new MassSelector(cfg);
         instance.saveOptions(cfg);
         instance._beforeMount(cfg).addCallback(function() {
            assert.equal(count, 1);
            done();
         });
      });

      it('_getChildContext', function(done) {
         var instance = new MassSelector(cfg);
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
            var instance = new MassSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._selectedTypeChangedHandler([], 'toggleAll');
               count = instance._multiselection.getCount();
               assert.equal(count, 2);
               done();
            });
         });

         it('selectAll', function(done) {
            var instance = new MassSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._selectedTypeChangedHandler([], 'selectAll');
               count = instance._multiselection.getCount();
               assert.equal(count, 4);
               done();
            });
         });

         it('unselectAll', function(done) {
            var instance = new MassSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._selectedTypeChangedHandler([], 'unselectAll');
               count = instance._multiselection.getCount();
               assert.equal(count, 0);
               done();
            });
         });
      });

      describe('_afterItemsRemoveHandler', function() {
         var count;

         it('1 key', function(done) {
            var instance = new MassSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._afterItemsRemoveHandler([], [1]);
               count = instance._multiselection.getCount();
               assert.equal(count, 1);
               done();
            });
         });

         it('2 key', function(done) {
            var instance = new MassSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._afterItemsRemoveHandler([], [1, 2]);
               count = instance._multiselection.getCount();
               assert.equal(count, 0);
               done();
            });
         });
      });

      describe('_onCheckBoxClickHandler', function() {
         var selectedKeys, excludedKeys;

         it('first elem click to false', function(done) {
            var instance = new MassSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._onCheckBoxClickHandler({}, 1, true);
               selectedKeys = instance._multiselection.getSelection().selected;
               assert.equal(selectedKeys.length, 1);
               assert.equal(selectedKeys[0], 2);
               done();
            });
         });

         it('second elem click to false', function(done) {
            var instance = new MassSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._onCheckBoxClickHandler({}, 2, true);
               selectedKeys = instance._multiselection.getSelection().selected;
               assert.equal(selectedKeys.length, 1);
               assert.equal(selectedKeys[0], 1);
               done();
            });
         });

         it('another elem click to true', function(done) {
            var instance = new MassSelector();
            instance.saveOptions(cfg);
            instance._beforeMount(cfg).addCallback(function() {
               instance._onCheckBoxClickHandler({}, 50, false);
               selectedKeys = instance._multiselection.getSelection().selected;
               assert.equal(selectedKeys.length, 3);
               assert.equal(selectedKeys[2], 50);
               done();
            });
         });

         it('selected all click to false', function(done) {
            var instance = new MassSelector();
            instance.saveOptions(cfg1);
            instance._beforeMount(cfg1).addCallback(function() {
               instance._onCheckBoxClickHandler({}, 3, true);
               selectedKeys = instance._multiselection.getSelection().selected;
               excludedKeys = instance._multiselection.getSelection().excluded;
               assert.equal(selectedKeys.length, 1);
               assert.isNull(selectedKeys[0]);
               assert.equal(excludedKeys.length, 1);
               assert.equal(excludedKeys[0], 3);
               done();
            });
         });

         it('selected part click to true', function(done) {
            var instance = new MassSelector();
            instance.saveOptions(cfg2);
            instance._beforeMount(cfg2).addCallback(function() {
               instance._onCheckBoxClickHandler({}, 1, false);
               selectedKeys = instance._multiselection.getSelection().selected;
               excludedKeys = instance._multiselection.getSelection().excluded;
               assert.equal(selectedKeys.length, 1);
               assert.isNull(selectedKeys[0]);
               assert.equal(excludedKeys.length, 0);
               done();
            });
         });
      });
   });
});
