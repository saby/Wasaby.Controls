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
         selection = selectionInstance.getSelection();
         assert.deepEqual([], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selection = selectionInstance.getSelection();
         assert.deepEqual([1, 2, 3], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [2],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selection = selectionInstance.getSelection();
         assert.deepEqual([1, 2, 3], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([2], selection.excluded, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: [2],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([2], selection.excluded, 'Constructor: wrong field values');
      });
      
      it('select', function() {
         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([1, 2, 3]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([1, 2, 3], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.equal(3, selectionInstance.getCount());

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([4, 5, 6, 7]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([1, 2, 3, 4, 5, 6, 7], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.equal(7, selectionInstance.getCount());

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([2, 4]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([1, 2, 3, 4], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.equal(4, selectionInstance.getCount());

         cfg = {
            selectedKeys: [null],
            excludedKeys: [2, 3],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([2, 4]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([3], selection.excluded, 'Constructor: wrong field values');
         assert.equal(6, selectionInstance.getCount());

         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([null]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.equal(7, selectionInstance.getCount());
      });

      it('unselect', function() {
         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 3]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([2], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.equal(1, selectionInstance.getCount());

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2, 3]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.equal(0, selectionInstance.getCount());

         cfg = {
            selectedKeys: [null],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2, 3]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3], selection.excluded, 'Constructor: wrong field values');
         assert.equal(4, selectionInstance.getCount());

         cfg = {
            selectedKeys: [null],
            excludedKeys: [2, 3, 4],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([2, 3, 4, 1], selection.excluded, 'Constructor: wrong field values');
         assert.equal(3, selectionInstance.getCount());
      });

      it('selectAll+unselectAll', function() {
         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.selectAll();
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselectAll();
         selection = selectionInstance.getSelection();
         assert.deepEqual([], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
      });

      it('toggleAll', function() {
         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3], selection.excluded, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: [1, 2, 3],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         selection = selectionInstance.getSelection();
         assert.deepEqual([1, 2, 3], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');

         cfg = {
            selectedKeys: [null],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         selection = selectionInstance.getSelection();
         assert.deepEqual([], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
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
