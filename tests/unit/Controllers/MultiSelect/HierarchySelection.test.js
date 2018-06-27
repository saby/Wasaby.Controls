define([
   'Controls/Controllers/Multiselect/HierarchySelection',
   'WS.Data/Collection/RecordSet'
], function(
   HierarchySelection,
   RecordSet
) {
   'use strict';
   describe('Controls.Controllers.Multiselect.HierarchySelection', function() {
      var
         cfg,
         selection,
         selectionInstance,
         items = [{
            'id': 1,
            'Раздел': null,
            'Раздел@': true
         }, {
            'id': 2,
            'Раздел': 1,
            'Раздел@': true
         }, {
            'id': 3,
            'Раздел': 2,
            'Раздел@': false
         }, {
            'id': 4,
            'Раздел': 2,
            'Раздел@': false
         }, {
            'id': 5,
            'Раздел': 1,
            'Раздел@': false
         }, {
            'id': 6,
            'Раздел': null,
            'Раздел@': true
         }, {
            'id': 7,
            'Раздел': null,
            'Раздел@': false
         }],
         allData = new RecordSet({
            rawData: items,
            idProperty: 'id'
         });

      /*
         1
           2
             3 (лист)
             4 (лист)
           5 (лист)
         6 (пустая папка)
         7 (лист)
       */
      afterEach(function() {
         selectionInstance = null;
         cfg = null;
         selection = null;
      });
      it('constructor', function() {
         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: allData
         };
         selectionInstance = new HierarchySelection(cfg);
         selection = selectionInstance.getSelection();
         assert.deepEqual([], selection.selected);
         assert.deepEqual([], selection.excluded);
         assert.equal(0, selectionInstance.getCount());
      });

      describe('select', function() {
         describe('partialData', function() {
            it('select one node', function() {
               cfg = {
                  selectedKeys: [],
                  excludedKeys: [],
                  items: new RecordSet({
                     rawData: [items[0]],
                     idProperty: 'id'
                  })
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([1]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(1, selectionInstance.getCount());
            });

            it('sequentially select all elements inside node', function() {
               cfg = {
                  selectedKeys: [],
                  excludedKeys: [],
                  items: new RecordSet({
                     rawData: items.slice(0, 4),
                     idProperty: 'id'
                  })
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([3]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([3], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([4]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([3, 4], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(2, selectionInstance.getCount());
            });

            it('sequentially select all elements inside root node', function() {
               cfg = {
                  selectedKeys: [],
                  excludedKeys: [],
                  items: new RecordSet({
                     rawData: [items[0], items[5], items[6]],
                     idProperty: 'id'
                  })
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([1]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([6]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1, 6], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([7]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1, 6, 7], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(3, selectionInstance.getCount());
            });

            it('select root', function() {
               cfg = {
                  selectedKeys: [],
                  excludedKeys: [],
                  items: new RecordSet({
                     rawData: [items[0], items[5], items[6]],
                     idProperty: 'id'
                  })
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([null]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(3, selectionInstance.getCount());
            });
         });

         describe('allData', function() {
            it('select one node', function() {
               cfg = {
                  selectedKeys: [],
                  excludedKeys: [],
                  items: allData,
                  strategy: 'allData'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([6]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([6], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(1, selectionInstance.getCount());
            });

            it('sequentially select all elements inside node', function() {
               cfg = {
                  selectedKeys: [],
                  excludedKeys: [],
                  items: allData,
                  strategy: 'allData'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([3]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([3], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([4]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([2], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(3, selectionInstance.getCount());
            });

            it('sequentially select all elements inside root node', function() {
               cfg = {
                  selectedKeys: [],
                  excludedKeys: [],
                  items: allData,
                  strategy: 'allData'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([1]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([6]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1, 6], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([7]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(7, selectionInstance.getCount());
            });

            it('select root', function() {
               cfg = {
                  selectedKeys: [],
                  excludedKeys: [],
                  items: allData
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([null]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(7, selectionInstance.getCount());
            });
         });
      });

      describe('unselect', function() {
         describe('partialData', function() {
            it('unselect node', function() {
               cfg = {
                  selectedKeys: [1],
                  excludedKeys: [],
                  items: new RecordSet({
                     rawData: [items[0]],
                     idProperty: 'id'
                  })
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(1, selectionInstance.getCount());
               selectionInstance.unselect([1]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(0, selectionInstance.getCount());
            });

            it('unselect node with excluded nested children', function() {
               cfg = {
                  selectedKeys: [1],
                  excludedKeys: [3],
                  items: new RecordSet({
                     rawData: items.slice(0, 4),
                     idProperty: 'id'
                  })
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([3], selection.excluded);
               assert.equal(3, selectionInstance.getCount());
               selectionInstance.unselect([1]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(0, selectionInstance.getCount());
            });

            it('unselect root with excluded nested children', function() {
               cfg = {
                  selectedKeys: [null],
                  excludedKeys: [3],
                  items: allData
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([3], selection.excluded);
               assert.equal(6, selectionInstance.getCount());
               selectionInstance.unselect([null]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(0, selectionInstance.getCount());
            });

            it('unselect child inside selected node', function() {
               cfg = {
                  selectedKeys: [1],
                  excludedKeys: [],
                  items: new RecordSet({
                     rawData: items.slice(0, 4),
                     idProperty: 'id'
                  })
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(4, selectionInstance.getCount());
               selectionInstance.unselect([3]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([3], selection.excluded);
               assert.equal(3, selectionInstance.getCount());
            });
         });

         describe('allData', function() {
            it('unselect node', function() {
               cfg = {
                  selectedKeys: [1],
                  excludedKeys: [],
                  items: allData
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(5, selectionInstance.getCount());
               selectionInstance.unselect([1]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(0, selectionInstance.getCount());
            });

            it('unselect node with excluded nested children', function() {
               cfg = {
                  selectedKeys: [1],
                  excludedKeys: [3],
                  items: allData
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([3], selection.excluded);
               assert.equal(4, selectionInstance.getCount());
               selectionInstance.unselect([1]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(0, selectionInstance.getCount());
            });

            it('unselect root with excluded nested children', function() {
               cfg = {
                  selectedKeys: [null],
                  excludedKeys: [3],
                  items: allData
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([3], selection.excluded);
               assert.equal(6, selectionInstance.getCount());
               selectionInstance.unselect([null]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(0, selectionInstance.getCount());
            });

            it('unselect child inside selected node', function() {
               cfg = {
                  selectedKeys: [1],
                  excludedKeys: [],
                  items: allData
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.equal(5, selectionInstance.getCount());
               selectionInstance.unselect([3]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([3], selection.excluded);
               assert.equal(4, selectionInstance.getCount());
            });
         });
      });
   });
});
