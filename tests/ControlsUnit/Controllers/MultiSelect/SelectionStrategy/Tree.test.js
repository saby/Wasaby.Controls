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
         assert.deepEqual(selectResult.selectedKeys, []);
         assert.deepEqual(selectResult.excludedKeys, []);

         selectResult = treeStrategy.select([1, 2, 9], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selectedKeys, [1, 2, 9]);
         assert.deepEqual(selectResult.excludedKeys, []);

         selectedKeys = [];
         excludedKeys = [1, 6, 9];
         selectResult = treeStrategy.select([1, 2, 9], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selectedKeys, [2]);
         assert.deepEqual(selectResult.excludedKeys, [6]);
      });

      it('unSelect', function() {
         let selectResult = treeStrategy.unSelect([3, 4], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selectedKeys, []);
         assert.deepEqual(selectResult.excludedKeys, []);

         // 2 - родитедль 3 и 4
         selectedKeys = [2];
         selectResult = treeStrategy.unSelect([3, 4], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selectedKeys, [2]);
         assert.deepEqual(selectResult.excludedKeys, []);

         excludedKeys = [2];
         selectResult = treeStrategy.unSelect([3, 4], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selectedKeys, [2]);
         assert.deepEqual(selectResult.excludedKeys, [2, 3, 4]);


         selectedKeys = [1, 2, 3, 4];
         excludedKeys = [9];
         selectResult = treeStrategy.unSelect([3, 4, 5], selectedKeys, excludedKeys, model, hierarchyRelation);
         assert.deepEqual(selectResult.selectedKeys, [1, 2]);
         assert.deepEqual(selectResult.excludedKeys, [9]);
      });

      it('isAllSelected', function() {
         assert.isFalse(treeStrategy.isAllSelected(selectedKeys, excludedKeys, model));

         selectedKeys = [null];
         assert.isFalse(treeStrategy.isAllSelected(selectedKeys, excludedKeys, model));

         excludedKeys = [null];
         assert.isTrue(treeStrategy.isAllSelected(selectedKeys, excludedKeys, model));

         model._model.setRoot(1);
         assert.isFalse(treeStrategy.isAllSelected(selectedKeys, excludedKeys, model));

         selectedKeys = [1];
         excludedKeys = [1];
         assert.isTrue(treeStrategy.isAllSelected(selectedKeys, excludedKeys, model));
      });

      describe('getCount', function() {
         it('without selection', function() {
            return treeStrategy.getCount(selectedKeys, excludedKeys, model, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, 0);
            });
         });

         it('with selected items', function() {
            return treeStrategy.getCount([1, 2, 10, 15], excludedKeys, model, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, 4);
            });
         });

         it('with selected and excluded items', function() {
            return treeStrategy.getCount([1, 2, 10], [3, 4], model, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, 3);
            });
         });

         // Для select root надо проверку что все записи загружены
         // + тесты добавить сценарий с незагруежнным узлом что null.
         it('select root', function() {
            model.getItems().setMetaData({more: false});
            return treeStrategy.getCount([null], [null], model, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, 3);
            });
         });

         it('select root with excluded', function() {
            // Дети корня 1,6,7
            model.getItems().setMetaData({more: 3});
            return treeStrategy.getCount([null], [null, 1, 7, 10], model, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, 1);
            });
         });

         it('with not loaded selected root', function() {
            return treeStrategy.getCount([null], [null], model, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, null);
            });
         });

         it('with not loaded node', function() {
            return treeStrategy.getCount([10], [10], model, hierarchyRelation).then((itemsCount) => {
               assert.equal(itemsCount, null);
            });
         });
      });

      describe('getSelectionForModel', function() {
         it('without selection', function() {
            let selectionForModel = treeStrategy.getSelectionForModel(selectedKeys, excludedKeys, model, hierarchyRelation);
            assert.deepEqual(selectionForModel, {});
         });

         it('with selected items', function() {
            let selectionForModel = treeStrategy.getSelectionForModel([1, 2, 10], excludedKeys, model, hierarchyRelation);
            assert.deepEqual(selectionForModel, {1: true, 2: true});
         });

         it('with selected and excluded items', function() {
            let selectionForModel = treeStrategy.getSelectionForModel([1, 4], [4], model, hierarchyRelation);
            assert.deepEqual(selectionForModel, {1: true});
         });

         it('select root', function() {
            let selectionForModel = treeStrategy.getSelectionForModel([null], [null], model, hierarchyRelation);
            assert.deepEqual(selectionForModel, {1: true, 6: true, 7: true});
         });

         it('select root', function() {
            let selectionForModel = treeStrategy.getSelectionForModel([null], [null, 6, 7, 10], model, hierarchyRelation);
            assert.deepEqual(selectionForModel, {1: true});
         });
      });
   });
});
