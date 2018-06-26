/**
 * Created by kraynovdo on 21.03.2018.
 */
define([
   'Controls/Controllers/Multiselect/Selection'
], function(Selection) {
   describe('Controls.Controllers.Multiselect.Selection', function() {


      it('ctor', function() {
         var cfg, selectionInstance;

         cfg = {
            selectedKeys: null,
            excludedKeys: null
         };
         selectionInstance = new Selection(cfg);
         assert.deepEqual([], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: null
         };
         selectionInstance = new Selection(cfg);
         assert.deepEqual([1, 2, 3], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [2]
         };
         selectionInstance = new Selection(cfg);
         assert.deepEqual([1, 2, 3], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: [2]
         };
         selectionInstance = new Selection(cfg);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([2], selectionInstance._excludedKeys, 'Constructor: wrong field values');
      });

      it('select', function() {
         var cfg, selectionInstance;

         cfg = {
            selectedKeys: [],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([1, 2, 3]);
         assert.deepEqual([1, 2, 3], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([4, 5, 6]);
         assert.deepEqual([1, 2, 3, 4, 5, 6], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([2, 4]);
         assert.deepEqual([1, 2, 3, 4], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: [2, 3]
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([2, 4]);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([3], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([null]);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
      });

      it('unselect', function() {
         var cfg, selectionInstance;

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 3]);
         assert.deepEqual([2], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2, 3]);
         assert.deepEqual([], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         cfg = {
            selectedKeys: [null],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2, 3]);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: [2, 3, 4]
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2]);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([2, 3, 4, 1], selectionInstance._excludedKeys, 'Constructor: wrong field values');
      });

      it('selectAll+unselectAll', function() {
         var cfg, selectionInstance;

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.selectAll();
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselectAll();
         assert.deepEqual([], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
      });

      it('toggleAll', function() {
         var cfg, selectionInstance;

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: [1, 2, 3]
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         assert.deepEqual([1, 2, 3], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         assert.deepEqual([], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
      });

      it('getSelection', function() {
         var cfg, selectionInstance, selection;

         cfg = {
            selectedKeys: [null],
            excludedKeys: [1, 2, 3]
         };
         selectionInstance = new Selection(cfg);
         selection = selectionInstance.getSelection();
         assert.deepEqual(cfg.selectedKeys, selection.selected, 'Constructor: wrong field values');
         assert.deepEqual(cfg.excludedKeys, selection.excluded, 'Constructor: wrong field values');
      });

      it('getSelectionStatus', function() {
         var cfg, selectionInstance, status;

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         status = selectionInstance.getSelectionStatus(1);
         assert.equal(Selection.SELECTION_STATUS.SELECTED, status);

         status = selectionInstance.getSelectionStatus(4);
         assert.equal(Selection.SELECTION_STATUS.NOT_SELECTED, status);

         cfg = {
            selectedKeys: [],
            excludedKeys: []
         };
         selectionInstance = new Selection(cfg);
         status = selectionInstance.getSelectionStatus(1);
         assert.equal(Selection.SELECTION_STATUS.NOT_SELECTED, status);

         status = selectionInstance.getSelectionStatus(4);
         assert.equal(Selection.SELECTION_STATUS.NOT_SELECTED, status);

         cfg = {
            selectedKeys: [null],
            excludedKeys: [1, 2, 3]
         };
         selectionInstance = new Selection(cfg);
         status = selectionInstance.getSelectionStatus(1);
         assert.equal(Selection.SELECTION_STATUS.NOT_SELECTED, status);

         status = selectionInstance.getSelectionStatus(4);
         assert.equal(Selection.SELECTION_STATUS.SELECTED, status);
      });
   });
});
