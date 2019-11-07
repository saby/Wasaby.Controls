define([
   'Controls/operations',
   'Controls/treeGrid',
   'ControlsUnit/ListData',
   'Types/collection',
   'Types/entity',
], function(operations, treeGrid, ListData, collection, entity) {
   'use strict';

   describe('Controls.operations:TreeSelectionStrategy', function() {
      let
         treeStrategy,
         recordSet, model,
         selectedKeys = [],
         excludedKeys = [],
         hierarchyRelation = new entity.relation.Hierarchy({
            keyProperty: ListData.KEY_PROPERTY,
            parentProperty: ListData.PARENT_PROPERTY,
            nodeProperty: ListData.NODE_PROPERTY,
            declaredChildrenProperty: ListData.HAS_CHILDREN_PROPERTY
         });

      beforeEach(function() {
         selectedKeys = [];
         excludedKeys = [];
         recordSet = new collection.RecordSet({
            keyProperty: ListData.KEY_PROPERTY,
            rawData: ListData.getItems()
         });
         model = new treeGrid.ViewModel({columns: [], items: recordSet});
         treeStrategy = new operations.TreeSelectionStrategy();
      });

      it('select', function() {
         let selectResult = treeStrategy.select([], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selected, []);
         assert.deepEqual(selectResult.excluded, []);

         selectResult = treeStrategy.select([1, 2, 9], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selected, [1, 2, 9]);
         assert.deepEqual(selectResult.excluded, []);

         selectedKeys = [];
         excludedKeys = [1, 6, 9];
         selectResult = treeStrategy.select([1, 2, 9], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selected, [2]);
         assert.deepEqual(selectResult.excluded, [6]);
      });

      it('unSelect', function() {
         let selectResult = treeStrategy.unSelect([3, 4], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selected, []);
         assert.deepEqual(selectResult.excluded, []);

         // 2 - родитедль 3 и 4
         selectedKeys = [2];
         selectResult = treeStrategy.unSelect([3, 4], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selected, [2]);
         assert.deepEqual(selectResult.excluded, []);

         excludedKeys = [2];
         selectResult = treeStrategy.unSelect([3, 4], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selected, [2]);
         assert.deepEqual(selectResult.excluded, [2, 3, 4]);


         selectedKeys = [1, 2, 3, 4];
         excludedKeys = [9];
         selectResult = treeStrategy.unSelect([3, 4, 5], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selected, [1, 2]);
         assert.deepEqual(selectResult.excluded, [9]);
      });

      it('isAllSelected', function() {
         assert.isFalse(treeStrategy.isAllSelected(null, selectedKeys, excludedKeys));

         selectedKeys = [null];
         assert.isFalse(treeStrategy.isAllSelected(null, selectedKeys, excludedKeys));

         excludedKeys = [null];
         assert.isTrue(treeStrategy.isAllSelected(null, selectedKeys, excludedKeys));

         assert.isFalse(treeStrategy.isAllSelected(1, selectedKeys, excludedKeys));

         selectedKeys = [1];
         excludedKeys = [1];
         assert.isTrue(treeStrategy.isAllSelected(1, selectedKeys, excludedKeys));
      });

      describe('getCount', function() {
         it('without selection', function() {
            return treeStrategy.getCount(selectedKeys, excludedKeys, model, 0, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, 0);
            });
         });

         it('with selected items', function() {
            return treeStrategy.getCount([1, 2, 10, 15], excludedKeys, model, 0, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, 4);
            });
         });

         it('with selected and excluded items', function() {
            return treeStrategy.getCount([1, 2, 10], [3, 4], model, 0, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, 3);
            });
         });

         it('select root', function() {
            model.getItems().setMetaData({more: false});
            return treeStrategy.getCount([null], [null], model, 0, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, 3);
            });
         });

         it('select root with excluded', function() {
            // Дети корня 1,6,7
            model.getItems().setMetaData({more: 3});
            return treeStrategy.getCount([null], [null, 1, 7, 10], model, 0, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, 1);
            });
         });

         it('with not loaded selected root', function() {
            return treeStrategy.getCount([null], [null], model, 0, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, null);
            });
         });

         it('with not loaded node', function() {
            return treeStrategy.getCount([10], [10], model, 0, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, null);
            });
         });
      });

      describe('getSelectionForModel', function() {
         it('without selection', function() {
            let selectionForModel = treeStrategy.getSelectionForModel(selectedKeys, excludedKeys, model, 0, '', hierarchyRelation);
            assert.deepEqual(selectionForModel, new Map());
         });

         it('with selected items', function() {
            let selectionForModel = treeStrategy.getSelectionForModel([1, 2, 10], excludedKeys, model, 0, '', hierarchyRelation);
            assert.deepEqual(selectionForModel, new Map([[1, true], [2, true]]));
         });

         it('with selected and excluded items', function() {
            let selectionForModel = treeStrategy.getSelectionForModel([1, 4], [4], model, 0, '', hierarchyRelation);
            assert.deepEqual(selectionForModel, new Map([[1, true]]));
         });

         it('select root', function() {
            let selectionForModel = treeStrategy.getSelectionForModel([null], [null], model, 0, '', hierarchyRelation);
            assert.deepEqual(selectionForModel, new Map([[1, true], [6, true], [7, true]]));
         });

         it('select root', function() {
            let selectionForModel = treeStrategy.getSelectionForModel([null], [null, 6, 7, 10], model, 0, '', hierarchyRelation);
            assert.deepEqual(selectionForModel, new Map([[1, true]]));
         });
      });
   });
});
