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
         data = [{
            'id': 1
         }, {
            'id': 2
         }, {
            'id': 3
         }, {
            'id': 4
         }, {
            'id': 5
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
            items: items,
            keyProperty: 'qwerty'
         };
         selectionInstance = new Selection(cfg);
         selection = selectionInstance.getSelection();
         assert.equal(cfg.selectedKeys, selection.selected);
         assert.equal(cfg.excludedKeys, selection.excluded);
         assert.equal('qwerty', selectionInstance._options.keyProperty);
         assert.equal(selectionInstance._items, items);

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selection = selectionInstance.getSelection();
         assert.equal(cfg.selectedKeys, selection.selected);
         assert.equal(cfg.excludedKeys, selection.excluded);
         assert.equal(selectionInstance._items, items);

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [2],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selection = selectionInstance.getSelection();
         assert.equal(cfg.selectedKeys, selection.selected);
         assert.equal(cfg.excludedKeys, selection.excluded);
         assert.equal(selectionInstance._items, items);

         cfg = {
            selectedKeys: [null],
            excludedKeys: [2],
            items: items
         };
         selectionInstance = new Selection(cfg);
         selection = selectionInstance.getSelection();
         assert.equal(cfg.selectedKeys, selection.selected);
         assert.equal(cfg.excludedKeys, selection.excluded);
         assert.equal(selectionInstance._items, items);
      });

      it('select', function() {
         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([1, 2, 3]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([1, 2, 3], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.equal(3, selectionInstance.getCount());
         assert.deepEqual([1, 2, 3], selectionInstance.getSelectedKeysForRender());

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([4, 5, 6, 7]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([1, 2, 3, 4, 5, 6, 7], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.equal(7, selectionInstance.getCount());
         assert.deepEqual([1, 2, 3, 4, 5, 6, 7], selectionInstance.getSelectedKeysForRender());

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([2, 4]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([1, 2, 3, 4], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.equal(4, selectionInstance.getCount());
         assert.deepEqual([1, 2, 3, 4], selectionInstance.getSelectedKeysForRender());

         cfg = {
            selectedKeys: [null],
            excludedKeys: [2, 3],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([2, 4]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([3], selection.excluded, 'Constructor: wrong field values');
         assert.equal(6, selectionInstance.getCount());
         assert.deepEqual([1, 2, 4, 5, 6, 7], selectionInstance.getSelectedKeysForRender());

         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.select([null]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.equal(7, selectionInstance.getCount());
         assert.deepEqual([1, 2, 3, 4, 5, 6, 7], selectionInstance.getSelectedKeysForRender());
      });

      it('unselect', function() {
         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 3]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([2], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.equal(1, selectionInstance.getCount());
         assert.deepEqual([2], selectionInstance.getSelectedKeysForRender());

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2, 3]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.equal(0, selectionInstance.getCount());
         assert.deepEqual([], selectionInstance.getSelectedKeysForRender());

         cfg = {
            selectedKeys: [null],
            excludedKeys: [],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2, 3]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3], selection.excluded, 'Constructor: wrong field values');
         assert.equal(4, selectionInstance.getCount());
         assert.deepEqual([4, 5, 6, 7], selectionInstance.getSelectedKeysForRender());

         cfg = {
            selectedKeys: [null],
            excludedKeys: [2, 3, 4],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselect([1, 2]);
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([2, 3, 4, 1], selection.excluded, 'Constructor: wrong field values');
         assert.equal(3, selectionInstance.getCount());
         assert.deepEqual([5, 6, 7], selectionInstance.getSelectedKeysForRender());
      });

      it('selectAll+unselectAll', function() {
         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.selectAll();
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3, 4, 5, 6, 7], selectionInstance.getSelectedKeysForRender());

         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.unselectAll();
         selection = selectionInstance.getSelection();
         assert.deepEqual([], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance.getSelectedKeysForRender());
      });

      it('toggleAll', function() {
         cfg = {
            selectedKeys: [1, 2, 3],
            excludedKeys: [],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         selection = selectionInstance.getSelection();
         assert.deepEqual([null], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3], selection.excluded, 'Constructor: wrong field values');
         assert.deepEqual([4, 5, 6, 7], selectionInstance.getSelectedKeysForRender());

         cfg = {
            selectedKeys: [null],
            excludedKeys: [1, 2, 3],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         selection = selectionInstance.getSelection();
         assert.deepEqual([1, 2, 3], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3], selectionInstance.getSelectedKeysForRender());

         cfg = {
            selectedKeys: [null],
            excludedKeys: [],
            items: items,
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.toggleAll();
         selection = selectionInstance.getSelection();
         assert.deepEqual([], selection.selected, 'Constructor: wrong field values');
         assert.deepEqual([], selection.excluded, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance.getSelectedKeysForRender());
      });

      it('setItems', function() {
         cfg = {
            selectedKeys: [],
            excludedKeys: [],
            items: new RecordSet({
               rawData: [],
               idProperty: 'id'
            }),
            keyProperty: 'id'
         };
         selectionInstance = new Selection(cfg);
         selectionInstance.setItems(items);
         assert.equal(selectionInstance._items, items);
      });
   });
});
