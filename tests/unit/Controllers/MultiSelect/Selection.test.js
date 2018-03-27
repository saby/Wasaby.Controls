/**
 * Created by kraynovdo on 21.03.2018.
 */
define([
   'Controls/Controllers/Multiselect/Selection'
], function(Selection){
   describe('Controls.Controllers.Multiselect.Selection', function () {

      it('isAllSelection', function () {
         var res;

         res = Selection._private.isAllSelection([]);
         assert.isFalse(res, 'isAllSelection: wrong result');

         res = Selection._private.isAllSelection(null);
         assert.isFalse(res, 'isAllSelection: wrong result');

         res = Selection._private.isAllSelection([1, 2]);
         assert.isFalse(res, 'isAllSelection: wrong result');

         res = Selection._private.isAllSelection([null]);
         assert.isTrue(res, 'isAllSelection: wrong result');
      });

      it('ctor', function () {
         var cfg, selectionInstance;

         cfg = {
            selectedKeys : null,
            excludedKeys : null
         };
         selectionInstance = new Selection(cfg);
         assert.deepEqual([], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [1, 2, 3],
            excludedKeys : null
         };
         selectionInstance = new Selection(cfg);
         assert.deepEqual([1, 2, 3], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [1, 2, 3],
            excludedKeys : [2]
         };
         selectionInstance = new Selection(cfg);
         assert.deepEqual([1, 2, 3], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [null],
            excludedKeys : [2]
         };
         selectionInstance = new Selection(cfg);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([2], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

      });

      it('select', function () {
         var cfg, selectionInstance;

         cfg = {
            selectedKeys : [],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([1, 2, 3]);
         assert.deepEqual([1, 2, 3], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [1, 2, 3],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([4, 5, 6]);
         assert.deepEqual([1, 2, 3, 4, 5, 6], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [1, 2, 3],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([2, 4]);
         assert.deepEqual([1, 2, 3, 4], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [null],
            excludedKeys : [2, 3]
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([2, 4]);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([3], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([null]);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();
      });

      it('unselect', function () {
         var cfg, selectionInstance;

         cfg = {
            selectedKeys : [1, 2, 3],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 3]);
         assert.deepEqual([2], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [1, 2, 3],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2, 3]);
         assert.deepEqual([], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [null],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2, 3]);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [null],
            excludedKeys : [2, 3, 4]
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2]);
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([2, 3, 4, 1], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();
      });

      it('selectAll+unselectAll', function () {
         var cfg, selectionInstance;

         cfg = {
            selectedKeys : [1, 2, 3],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.selectAll();
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [1, 2, 3],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselectAll();
         assert.deepEqual([], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();
      });

      it('toggleAll', function () {
         var cfg, selectionInstance;

         cfg = {
            selectedKeys : [1, 2, 3],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         assert.deepEqual([null], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [null],
            excludedKeys : [1, 2, 3]
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         assert.deepEqual([1, 2, 3], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [null],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         assert.deepEqual([], selectionInstance._selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance._excludedKeys, 'Constructor: wrong field values');
         selectionInstance.destroy();
      });

      it('getSelection', function () {
         var cfg, selectionInstance, selection;

         cfg = {
            selectedKeys : [null],
            excludedKeys : [1, 2, 3]
         };
         selectionInstance = new Selection(cfg);
         selection = selectionInstance.getSelection();
         assert.deepEqual(cfg.selectedKeys, selection.selected, 'Constructor: wrong field values');
         assert.deepEqual(cfg.excludedKeys, selection.excluded, 'Constructor: wrong field values');
         selectionInstance.destroy();
      });

      it('getSelectionStatus', function () {
         var cfg, selectionInstance, status;

         cfg = {
            selectedKeys : [1, 2, 3],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         status = selectionInstance.getSelectionStatus(1);
         assert.deepEqual(1, status, 'Constructor: wrong field values');

         status = selectionInstance.getSelectionStatus(4);
         assert.deepEqual(0, status, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [],
            excludedKeys : []
         };
         selectionInstance = new Selection(cfg);
         selectionInstance = new Selection(cfg);
         status = selectionInstance.getSelectionStatus(1);
         assert.deepEqual(0, status, 'Constructor: wrong field values');

         status = selectionInstance.getSelectionStatus(4);
         assert.deepEqual(0, status, 'Constructor: wrong field values');
         selectionInstance.destroy();

         cfg = {
            selectedKeys : [null],
            excludedKeys : [1, 2, 3]
         };
         selectionInstance = new Selection(cfg);
         selectionInstance = new Selection(cfg);
         status = selectionInstance.getSelectionStatus(1);
         assert.deepEqual(0, status, 'Constructor: wrong field values');

         status = selectionInstance.getSelectionStatus(4);
         assert.deepEqual(1, status, 'Constructor: wrong field values');
         selectionInstance.destroy();
      });
   })
});