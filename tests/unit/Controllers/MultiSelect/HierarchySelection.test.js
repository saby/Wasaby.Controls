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
         allData;

      /*
         1
           2
             3 (лист)
             4 (лист)
           5 (лист)
         6 (пустая папка)
         7 (лист)
       */
      beforeEach(function() {
         allData = new RecordSet({
            rawData: items.slice(),
            idProperty: 'id'
         });
      });
      afterEach(function() {
         selectionInstance = null;
         cfg = null;
         selection = null;
         allData = null;
      });
      it('constructor', function() {
         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: allData,
            keyProperty: 'id'
         };
         selectionInstance = new HierarchySelection(cfg);
         selection = selectionInstance.getSelection();
         assert.deepEqual([], selection.selected);
         assert.deepEqual([], selection.excluded);
         assert.equal(0, selectionInstance.getCount());
      });

      describe('select', function() {
         describe('allData', function() {
            it('select one node', function() {
               cfg = {
                  selectedKeys: [],
                  excludedKeys: [],
                  items: allData,
                  keyProperty: 'id'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([6]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([6], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([6], selectionInstance.getSelectedKeysForRender());
               assert.equal(1, selectionInstance.getCount());
            });

            it('select child of excluded node', function() {
               cfg = {
                  selectedKeys: [1],
                  excludedKeys: [2],
                  items: allData,
                  keyProperty: 'id'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([2], selection.excluded);
               assert.deepEqual([1, 5], selectionInstance.getSelectedKeysForRender());
               assert.equal(2, selectionInstance.getCount());
               selectionInstance.select([4]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1, 4], selection.selected);
               assert.deepEqual([2], selection.excluded);
               assert.deepEqual([1, 4, 5], selectionInstance.getSelectedKeysForRender());
               assert.equal(3, selectionInstance.getCount());
            });

            it('sequentially select all elements inside node', function() {
               cfg = {
                  selectedKeys: [],
                  excludedKeys: [],
                  items: allData,
                  keyProperty: 'id'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([3]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([3], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([1, 2, 3], selectionInstance.getSelectedKeysForRender());
               selectionInstance.select([4]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([3, 4], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([1, 2, 3, 4], selectionInstance.getSelectedKeysForRender());
               assert.equal(2, selectionInstance.getCount());
            });

            it('sequentially select all elements inside root node', function() {
               cfg = {
                  selectedKeys: [],
                  excludedKeys: [],
                  items: allData,
                  keyProperty: 'id'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               selectionInstance.select([1]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([1, 2, 3, 4, 5], selectionInstance.getSelectedKeysForRender());
               selectionInstance.select([6]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1, 6], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([1, 2, 3, 4, 5, 6], selectionInstance.getSelectedKeysForRender());
               selectionInstance.select([7]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1, 6, 7], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([1, 2, 3, 4, 5, 6, 7], selectionInstance.getSelectedKeysForRender());
               assert.equal(7, selectionInstance.getCount());
            });

            it('select root', function() {
               cfg = {
                  selectedKeys: [],
                  excludedKeys: [],
                  items: allData,
                  keyProperty: 'id'
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
               assert.deepEqual([1, 2, 3, 4, 5, 6, 7], selectionInstance.getSelectedKeysForRender());
            });

            it('select previously excluded child', function() {
               cfg = {
                  selectedKeys: [null],
                  excludedKeys: [2, 5],
                  items: allData,
                  keyProperty: 'id'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([2, 5], selection.excluded);
               assert.deepEqual([1, 6, 7], selectionInstance.getSelectedKeysForRender());
               assert.equal(3, selectionInstance.getCount());
               selectionInstance.select([2]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([5], selection.excluded);
               assert.deepEqual([1, 2, 3, 4, 6, 7], selectionInstance.getSelectedKeysForRender());
               assert.equal(6, selectionInstance.getCount());
               selectionInstance.select([5]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([1, 2, 3, 4, 5, 6, 7], selectionInstance.getSelectedKeysForRender());
               assert.equal(7, selectionInstance.getCount());
            });
         });
      });

      describe('unselect', function() {
         describe('allData', function() {
            it('unselect node', function() {
               cfg = {
                  selectedKeys: [1],
                  excludedKeys: [],
                  items: allData,
                  keyProperty: 'id'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([1, 2, 3, 4, 5], selectionInstance.getSelectedKeysForRender());
               assert.equal(5, selectionInstance.getCount());
               selectionInstance.unselect([1]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([], selectionInstance.getSelectedKeysForRender());
               assert.equal(0, selectionInstance.getCount());
            });

            it('unselect nested node', function() {
               cfg = {
                  selectedKeys: [2],
                  excludedKeys: [],
                  items: allData,
                  keyProperty: 'id'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([2], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([1, 2, 3, 4], selectionInstance.getSelectedKeysForRender());
               assert.equal(3, selectionInstance.getCount());
               selectionInstance.unselect([2]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([], selectionInstance.getSelectedKeysForRender());
               assert.equal(0, selectionInstance.getCount());
            });

            it('unselect node with excluded nested children', function() {
               cfg = {
                  selectedKeys: [1],
                  excludedKeys: [3],
                  items: allData,
                  keyProperty: 'id'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([3], selection.excluded);
               assert.deepEqual([1, 2, 4, 5], selectionInstance.getSelectedKeysForRender());
               assert.equal(4, selectionInstance.getCount());
               selectionInstance.unselect([1]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([], selectionInstance.getSelectedKeysForRender());
               assert.equal(0, selectionInstance.getCount());
            });

            it('unselect root with excluded nested children', function() {
               cfg = {
                  selectedKeys: [null],
                  excludedKeys: [3],
                  items: allData,
                  keyProperty: 'id'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([3], selection.excluded);
               assert.deepEqual([1, 2, 4, 5, 6, 7], selectionInstance.getSelectedKeysForRender());
               assert.equal(6, selectionInstance.getCount());
               selectionInstance.unselect([null]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([], selectionInstance.getSelectedKeysForRender());
               assert.equal(0, selectionInstance.getCount());
            });

            it('unselect child inside selected node', function() {
               cfg = {
                  selectedKeys: [1],
                  excludedKeys: [],
                  items: allData,
                  keyProperty: 'id'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([1, 2, 3, 4, 5], selectionInstance.getSelectedKeysForRender());
               assert.equal(5, selectionInstance.getCount());
               selectionInstance.unselect([5]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([5], selection.excluded);
               assert.deepEqual([1, 2, 3, 4], selectionInstance.getSelectedKeysForRender());
               assert.equal(4, selectionInstance.getCount());
               selectionInstance.unselect([2]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([5, 2], selection.excluded);
               assert.deepEqual([1], selectionInstance.getSelectedKeysForRender());
               assert.equal(1, selectionInstance.getCount());
            });

            it('sequentially unselect all children inside selected root', function() {
               cfg = {
                  selectedKeys: [null],
                  excludedKeys: [],
                  items: allData,
                  keyProperty: 'id'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([1, 2, 3, 4, 5, 6, 7], selectionInstance.getSelectedKeysForRender());
               assert.equal(7, selectionInstance.getCount());
               selectionInstance.unselect([7]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([7], selection.excluded);
               assert.deepEqual([1, 2, 3, 4, 5, 6], selectionInstance.getSelectedKeysForRender());
               assert.equal(6, selectionInstance.getCount());
               selectionInstance.unselect([6]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([7, 6], selection.excluded);
               assert.deepEqual([1, 2, 3, 4, 5], selectionInstance.getSelectedKeysForRender());
               assert.equal(5, selectionInstance.getCount());
               selectionInstance.unselect([5]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([7, 6, 5], selection.excluded);
               assert.deepEqual([1, 2, 3, 4], selectionInstance.getSelectedKeysForRender());
               assert.equal(4, selectionInstance.getCount());
               selectionInstance.unselect([4]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([7, 6, 5, 4], selection.excluded);
               assert.deepEqual([1, 2, 3], selectionInstance.getSelectedKeysForRender());
               assert.equal(3, selectionInstance.getCount());
               selectionInstance.unselect([3]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([7, 6, 5, 4, 3], selection.excluded);
               assert.deepEqual([1, 2], selectionInstance.getSelectedKeysForRender());
               assert.equal(2, selectionInstance.getCount());
               selectionInstance.unselect([2]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([7, 6, 5, 2], selection.excluded);
               assert.deepEqual([1], selectionInstance.getSelectedKeysForRender());
               assert.equal(1, selectionInstance.getCount());
               selectionInstance.unselect([1]);
               selection = selectionInstance.getSelection();
               assert.deepEqual([null], selection.selected);
               assert.deepEqual([7, 6, 1], selection.excluded);
               assert.deepEqual([], selectionInstance.getSelectedKeysForRender());
               assert.equal(0, selectionInstance.getCount());
            });

            it('unselect removed item', function() {
               cfg = {
                  selectedKeys: [1],
                  excludedKeys: [],
                  items: allData,
                  keyProperty: 'id'
               };
               selectionInstance = new HierarchySelection(cfg);
               selection = selectionInstance.getSelection();
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([1, 2, 3, 4, 5], selectionInstance.getSelectedKeysForRender());
               assert.equal(5, selectionInstance.getCount());
               selectionInstance._items.remove(selectionInstance._items.getRecordById(2));
               selectionInstance.unselect([2]);
               assert.deepEqual([1], selection.selected);
               assert.deepEqual([], selection.excluded);
               assert.deepEqual([1, 5], selectionInstance.getSelectedKeysForRender());
               assert.equal(2, selectionInstance.getCount());
            });
         });
      });

      describe('getSelectedKeysForRender', function() {
         it('duplicate ids', function() {
            var itemsWithDuplicateIds = items.slice();
            itemsWithDuplicateIds.push({
               'id': 1,
               'Раздел': null,
               'Раздел@': true
            });
            cfg = {
               selectedKeys: [1],
               excludedKeys: [],
               items: new RecordSet({
                  rawData: itemsWithDuplicateIds,
                  idProperty: 'id'
               }),
               keyProperty: 'id'
            };
            selectionInstance = new HierarchySelection(cfg);
            selection = selectionInstance.getSelection();
            assert.deepEqual([1], selection.selected);
            assert.deepEqual([], selection.excluded);
            assert.deepEqual([1, 2, 3, 4, 5], selectionInstance.getSelectedKeysForRender());
         });
      });
   });
});
