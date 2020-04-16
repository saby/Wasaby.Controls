define([
   'Controls/operations',
   'Controls/treeGrid',
   'ControlsUnit/ListData',
   'Types/collection',
], function(operations, treeGrid, ListData, collection) {
   'use strict';

   describe('Controls.operations:TreeSelectionStrategy', function() {
      let
         flatStrategy,
         recordSet, model,
         selection = {
            selected: [],
            excluded: []
         };

      beforeEach(function() {
         selection = {
            selected: [],
            excluded: []
         };
         recordSet = new collection.RecordSet({
            keyProperty: ListData.KEY_PROPERTY,
            rawData: ListData.getItems()
         });
         model = new treeGrid.ViewModel({columns: [], items: recordSet});
         flatStrategy = new operations.FlatSelectionStrategy();
      });

      it('select', function() {
         flatStrategy.select(selection, [], model);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);

         flatStrategy.select(selection, [1, 2, 9], model);
         assert.deepEqual(selection.selected, [1, 2, 9]);
         assert.deepEqual(selection.excluded, []);

         selection.selected = [];
         selection.excluded = [1, 6, 9];
         flatStrategy.select(selection, [1, 2, 9], model);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, [6]);
      });

      it('unSelect', function() {
         flatStrategy.unSelect(selection, [3, 4], model);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);

         // 2 - родитедль 3 и 4
         selection.selected = [2];
         flatStrategy.unSelect(selection, [3, 4], model);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, []);

         selection.excluded = [2];
         flatStrategy.unSelect(selection, [3, 4], model);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, [2, 3, 4]);


         selection.selected = [1, 2, 3, 4];
         selection.excluded = [9];
         flatStrategy.unSelect(selection, [3, 4, 5], model);
         assert.deepEqual(selection.selected, [1, 2]);
         assert.deepEqual(selection.excluded, [9]);
      });

      describe('getCount', function() {
         describe('selectDescendants: false, selectAncestors: false', () => {
            it('without selection', function() {
               assert.equal(flatStrategy.getCount(selection, model, {}), 0);
            });

            it('with selected items', function() {
               selection.selected = [1, 2, 5, 10, 15];
               assert.equal(flatStrategy.getCount(selection, model, {}), 5);
            });

            it('with selected and excluded items', function() {
               selection.selected = [1, 2, 10];
               selection.excluded = [3, 4];
               assert.equal(flatStrategy.getCount(selection, model, {}), 3);
            });

            it('select root', function() {
               selection.selected = [null];
               selection.excluded = [null];
               assert.equal(flatStrategy.getCount(selection, model, {}), 3);

            });

            it('select root with excluded', function() {
               // Дети корня 1,6,7
               selection.selected = [null];
               selection.excluded = [null, 1, 7, 10];
               assert.equal(flatStrategy.getCount(selection, model, {}), 1);
            });

            it('with not loaded selected root', function() {
               selection.selected = [null];
               selection.excluded = [null];
               assert.equal(flatStrategy.getCount(selection, model, {}), 3);
            });

            it('with not loaded node', function() {
               selection.selected = [10];
               selection.excluded = [10];
               assert.equal(flatStrategy.getCount(selection, model, {}), null);
            });
         });
      });

      describe('getSelectionForModel', function() {
         it('without selection', function() {
            let selectionForModel = flatStrategy.getSelectionForModel(selection, model, 0, '');
            assert.deepEqual(selectionForModel, new Map());
         });

         it('with selected items', function() {
            selection.selected = [1, 2, 10];
            let selectionForModel = flatStrategy.getSelectionForModel(selection, model, 0, '');
            assert.deepEqual(selectionForModel, new Map([[1, true], [2, true]]));
         });

         it('with selected and excluded items', function() {
            selection.selected = [1, 4];
            selection.excluded = [4];
            let selectionForModel = flatStrategy.getSelectionForModel(selection, model, 0, '');
            assert.deepEqual(selectionForModel, new Map([[1, true]]));
         });

         it('select root', function() {
            selection.selected = [null];
            selection.excluded = [null];
            let selectionForModel = flatStrategy.getSelectionForModel(selection, model, 0, '');
            assert.deepEqual(selectionForModel, new Map([[1, true], [2, true], [3, true], [4, true], [5, true], [6, true], [7, true]]));
         });

         it('select root with excluded', function() {
            selection.selected = [null];
            selection.excluded = [null, 6, 7, 10];
            let selectionForModel = flatStrategy.getSelectionForModel(selection, model, 0, '');
            assert.deepEqual(selectionForModel, new Map([[1, true], [2, true], [3, true], [4, true], [5, true]]));
         });
      });
   });
});
