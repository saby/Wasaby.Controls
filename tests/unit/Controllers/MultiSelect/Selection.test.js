/**
 * Created by kraynovdo on 21.03.2018.
 */
define([
   'Controls/Controllers/Multiselect/Selection',
   'WS.Data/Collection/RecordSet'
], function(
   Selection,
   RecordSet
) {
   describe('Controls.Controllers.Multiselect.Selection', function() {
      var
         cfg,
         selection,
         selectionInstance,
         status,
         data = [{
            'id': 1
         }, {
            'id': 2
         }, {
            'id': 3
         }, {
            'id': 4
         }, {
            'id': 3
         }, {
            'id': 6
         }, {
            'id': 7
         }],
         items = new RecordSet({
            rawData: data,
            idProperty: 'id'
         });

      it('ctor', function() {

         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         assert.deepEqual([], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         assert.deepEqual([1, 2, 3], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [2],
            items: items
         };
         selectionInstance = new Selection(cfg);
         assert.deepEqual([1, 2, 3], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([2], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: [2],
            items: items
         };
         selectionInstance = new Selection(cfg);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([2], selectionInstance._excludedKeys, 'Constructor: wrong field values');
      });

      it('select', function() {

         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([1, 2, 3]);
         assert.deepEqual([1, 2, 3], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([4, 5, 6]);
         assert.deepEqual([1, 2, 3, 4, 5, 6], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([2, 4]);
         assert.deepEqual([1, 2, 3, 4], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: [2, 3],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([2, 4]);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([3], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([null]);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
      });

      it('unselect', function() {

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 3]);
         assert.deepEqual([2], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2, 3]);
         assert.deepEqual([], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         cfg = {
            selectedKeys: [null],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2, 3]);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: [2, 3, 4],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2]);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([2, 3, 4, 1], selectionInstance._excludedKeys, 'Constructor: wrong field values');
      });

      it('selectAll+unselectAll', function() {

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.selectAll();
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselectAll();
         assert.deepEqual([], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
      });

      it('toggleAll', function() {

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: [1, 2, 3],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         assert.deepEqual([1, 2, 3], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         assert.deepEqual([], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
      });

      it('getSelection', function() {

         cfg = {
            selectedKeys: [null],
            excludedKeys: [1, 2, 3],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selection = selectionInstance.getSelection();
         assert.deepEqual(cfg.selectedKeys, selection.selected, 'Constructor: wrong field values');
         assert.deepEqual(cfg.excludedKeys, selection.excluded, 'Constructor: wrong field values');
      });

      it('getSelectionStatus', function() {

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         status = selectionInstance.getSelectionStatus(1);
         assert.equal(Selection.SELECTION_STATUS.SELECTED, status);

         status = selectionInstance.getSelectionStatus(4);
         assert.equal(Selection.SELECTION_STATUS.NOT_SELECTED, status);

         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         status = selectionInstance.getSelectionStatus(1);
         assert.equal(Selection.SELECTION_STATUS.NOT_SELECTED, status);

         status = selectionInstance.getSelectionStatus(4);
         assert.equal(Selection.SELECTION_STATUS.NOT_SELECTED, status);

         cfg = {
            selectedKeys: [null],
            excludedKeys: [1, 2, 3],
            items: items
         };
         selectionInstance = new Selection(cfg);
         status = selectionInstance.getSelectionStatus(1);
         assert.equal(Selection.SELECTION_STATUS.NOT_SELECTED, status);

         status = selectionInstance.getSelectionStatus(4);
         assert.equal(Selection.SELECTION_STATUS.SELECTED, status);
      });

      it('setItems', function() {
         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: new RecordSet({
               rawData: [],
               idProperty: 'id'
            })
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.setItems(items);
         assert.deepEqual(selectionInstance._items, items);
      });
   });
});
