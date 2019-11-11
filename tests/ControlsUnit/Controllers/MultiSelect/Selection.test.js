/**
 * Created by kraynovdo on 21.03.2018.
 */
define([
   'Types/collection',
   'Controls/operations',
   'Controls/list',
   'Controls/_operations/MultiSelector/SelectionStrategy/Flat',
   'ControlsUnit/ListData'
], function(
   collection,
   operations,
   list,
   FlatSelectionStrategy,
   ListData
) {
   describe('Controls.operations:Selection', function() {
      function getConfig(config) {
         return Object.assign({
            selectedKeys: [],
            excludedKeys: [],
            items: items,
            keyProperty: 'id',
            listModel: new list.ListViewModel({items: config && config.items || items}),
            selectionStrategy: new FlatSelectionStrategy.default()
         }, config || {});
      }

      let
         cfg,
         selectionInstance,
         items = new collection.RecordSet({
            rawData: ListData.getFlatItems(),
            keyProperty: ListData.KEY_PROPERTY
         });

      it('ctor', function() {
         cfg = getConfig({
            keyProperty: 'qwerty'
         });
         selectionInstance = new operations.Selection(cfg);
         assert.deepEqual(cfg.selectedKeys, selectionInstance.selectedKeys);
         assert.deepEqual(cfg.excludedKeys, selectionInstance.excludedKeys);
         assert.equal('qwerty', selectionInstance._keyProperty);
         assert.equal(selectionInstance._listModel.getItems(), items);

         cfg = getConfig({
            selectedKeys: [1, 2, 3]
         });
         selectionInstance = new operations.Selection(cfg);
         assert.deepEqual(cfg.selectedKeys, selectionInstance.selectedKeys);
         assert.deepEqual(cfg.excludedKeys, selectionInstance.excludedKeys);
         assert.equal(selectionInstance._listModel.getItems(), items);

         cfg = getConfig({
            selectedKeys: [1, 2, 3],
            excludedKeys: [2]
         });
         selectionInstance = new operations.Selection(cfg);
         assert.deepEqual(cfg.selectedKeys, selectionInstance.selectedKeys);
         assert.deepEqual(cfg.excludedKeys, selectionInstance.excludedKeys);
         assert.equal(selectionInstance._listModel.getItems(), items);

         cfg = getConfig({
            selectedKeys: [null],
            excludedKeys: [2]
         });
         selectionInstance = new operations.Selection(cfg);
         assert.deepEqual(cfg.selectedKeys, selectionInstance.selectedKeys);
         assert.deepEqual(cfg.excludedKeys, selectionInstance.excludedKeys);
         assert.equal(selectionInstance._listModel.getItems(), items);
      });

      it('select', function(done) {
         cfg = getConfig();
         selectionInstance = new operations.Selection(cfg);
         selectionInstance.select([1, 2, 3]);
         selectionInstance.updateSelectionForRender();

         assert.deepEqual([1, 2, 3], selectionInstance.selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance.excludedKeys, 'Constructor: wrong field values');
         assert.deepEqual({1: true, 2: true, 3: true}, selectionInstance._listModel._selectedKeys);
         selectionInstance.getCount().then((itemsCount) => {
            assert.equal(3, itemsCount);

            cfg = getConfig({
               selectedKeys: [1, 2, 3]
            });
            selectionInstance = new operations.Selection(cfg);
            selectionInstance.select([4, 5, 6, 7]);
            selectionInstance.updateSelectionForRender();

            assert.deepEqual([1, 2, 3, 4, 5, 6, 7], selectionInstance.selectedKeys, 'Constructor: wrong field values');
            assert.deepEqual([], selectionInstance.excludedKeys, 'Constructor: wrong field values');
            assert.deepEqual({1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true}, selectionInstance._listModel._selectedKeys);
            selectionInstance.getCount().then((itemsCount) => {
               assert.equal(7, itemsCount);

               cfg = getConfig({
                  selectedKeys: [1, 2, 3]
               });
               selectionInstance = new operations.Selection(cfg);
               selectionInstance.select([2, 4]);
               selectionInstance.updateSelectionForRender();

               assert.deepEqual([1, 2, 3, 4], selectionInstance.selectedKeys, 'Constructor: wrong field values');
               assert.deepEqual([], selectionInstance.excludedKeys, 'Constructor: wrong field values');
               assert.deepEqual({1: true, 2: true, 3: true, 4: true}, selectionInstance._listModel._selectedKeys);
               selectionInstance.getCount().then((itemsCount) => {
                  assert.equal(4, itemsCount);

                  cfg = getConfig({
                     selectedKeys: [null],
                     excludedKeys: [2, 3]
                  });
                  selectionInstance = new operations.Selection(cfg);
                  selectionInstance.select([2, 4]);
                  selectionInstance.updateSelectionForRender();

                  assert.deepEqual([null], selectionInstance.selectedKeys, 'Constructor: wrong field values');
                  assert.deepEqual([3], selectionInstance.excludedKeys, 'Constructor: wrong field values');
                  assert.deepEqual({1: true, 2: true, 4: true, 5: true, 6: true, 7: true}, selectionInstance._listModel._selectedKeys);
                  selectionInstance.getCount().then((itemsCount) => {
                     assert.equal(6, itemsCount);

                     cfg = getConfig();
                     selectionInstance = new operations.Selection(cfg);
                     selectionInstance.select([null]);
                     selectionInstance.updateSelectionForRender();

                     assert.deepEqual([null], selectionInstance.selectedKeys, 'Constructor: wrong field values');
                     assert.deepEqual([], selectionInstance.excludedKeys, 'Constructor: wrong field values');
                     assert.deepEqual({1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true}, selectionInstance._listModel._selectedKeys);
                     selectionInstance.getCount().then((itemsCount) => {
                        assert.equal(7, itemsCount);
                        done();
                     });
                  });
               });
            });
         });
      });

      it('unselect', function(done) {
         cfg = getConfig({
            selectedKeys: [1, 2, 3]
         });
         selectionInstance = new operations.Selection(cfg);
         selectionInstance.unselect([1, 3]);
         selectionInstance.updateSelectionForRender();

         assert.deepEqual([2], selectionInstance.selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance.excludedKeys, 'Constructor: wrong field values');
         assert.deepEqual({2: true}, selectionInstance._listModel._selectedKeys);
         selectionInstance.getCount().then((itemsCount) => {
            assert.equal(1, itemsCount);

            cfg = getConfig({
               selectedKeys: [1, 2, 3]
            });
            selectionInstance = new operations.Selection(cfg);
            selectionInstance.unselect([1, 2, 3]);
            selectionInstance.updateSelectionForRender();

            assert.deepEqual([], selectionInstance.selectedKeys, 'Constructor: wrong field values');
            assert.deepEqual([], selectionInstance.excludedKeys, 'Constructor: wrong field values');
            assert.deepEqual({}, selectionInstance._listModel._selectedKeys);
            selectionInstance.getCount().then((itemsCount) => {
               assert.equal(0, itemsCount);

               cfg = getConfig({
                  selectedKeys: [null]
               });
               selectionInstance = new operations.Selection(cfg);
               selectionInstance.unselect([1, 2, 3]);
               selectionInstance.updateSelectionForRender();

               assert.deepEqual([null], selectionInstance.selectedKeys, 'Constructor: wrong field values');
               assert.deepEqual([1, 2, 3], selectionInstance.excludedKeys, 'Constructor: wrong field values');
               assert.deepEqual({4: true, 5: true, 6: true, 7: true}, selectionInstance._listModel._selectedKeys);
               selectionInstance.getCount().then((itemsCount) => {
                  assert.equal(4, itemsCount);

                  cfg = getConfig({
                     selectedKeys: [null],
                     excludedKeys: [2, 3, 4]
                  });
                  selectionInstance = new operations.Selection(cfg);
                  selectionInstance.unselect([1, 2]);
                  selectionInstance.updateSelectionForRender();

                  assert.deepEqual([null], selectionInstance.selectedKeys, 'Constructor: wrong field values');
                  assert.deepEqual([2, 3, 4, 1], selectionInstance.excludedKeys, 'Constructor: wrong field values');
                  assert.deepEqual({5: true, 6: true, 7: true}, selectionInstance._listModel._selectedKeys);
                  selectionInstance.getCount().then((itemsCount) => {
                     assert.equal(3, itemsCount);
                     done();
                  });
               });
            });
         });
      });

      it('remove', function(done) {
         cfg = getConfig({
            selectedKeys: [null],
            excludedKeys: [2, 3, 4]
         });
         selectionInstance = new operations.Selection(cfg);
         selectionInstance.remove([1, 2, 4]);
         selectionInstance.updateSelectionForRender();

         assert.deepEqual([null], selectionInstance.selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([3], selectionInstance.excludedKeys, 'Constructor: wrong field values');
         assert.deepEqual({1: true, 2: true, 5: true, 4: true, 5: true, 6: true, 7: true}, selectionInstance._listModel._selectedKeys);
         selectionInstance.getCount().then((itemsCount) => {
            assert.equal(6, itemsCount);

            cfg = getConfig({
               selectedKeys: [1, 2, 3],
               excludedKeys: [4, 5]
            });
            selectionInstance = new operations.Selection(cfg);
            selectionInstance.remove([2, 3, 5, 7]);
            selectionInstance.updateSelectionForRender();

            assert.deepEqual([1], selectionInstance.selectedKeys, 'Constructor: wrong field values');
            assert.deepEqual([4], selectionInstance.excludedKeys, 'Constructor: wrong field values');
            assert.deepEqual({1: true}, selectionInstance._listModel._selectedKeys);

            selectionInstance.getCount().then((itemsCount) => {
               assert.equal(1, itemsCount);
               done();
            });
         });
      });

      it('selectAll+unselectAll', function() {
         cfg = getConfig({
            selectedKeys: [1, 2, 3]
         });
         selectionInstance = new operations.Selection(cfg);
         selectionInstance.selectAll();
         selectionInstance.updateSelectionForRender();

         assert.deepEqual([null], selectionInstance.selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance.excludedKeys, 'Constructor: wrong field values');
         assert.deepEqual({1: true, 2: true, 3: true, 4: true, 5: true, 6: true, 7: true}, selectionInstance._listModel._selectedKeys);

         cfg = getConfig({
            selectedKeys: [1, 2, 3]
         });
         selectionInstance = new operations.Selection(cfg);
         selectionInstance.unselectAll();
         selectionInstance.updateSelectionForRender();

         assert.deepEqual([], selectionInstance.selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance.excludedKeys, 'Constructor: wrong field values');
         assert.deepEqual({}, selectionInstance._listModel._selectedKeys);
      });

      it('toggleAll', function() {
         cfg = getConfig({
            selectedKeys: [1, 2, 3]
         });
         selectionInstance = new operations.Selection(cfg);
         selectionInstance.toggleAll();
         selectionInstance.updateSelectionForRender();

         assert.deepEqual([null], selectionInstance.selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([1, 2, 3], selectionInstance.excludedKeys, 'Constructor: wrong field values');
         assert.deepEqual({4: true, 5: true, 6: true, 7: true}, selectionInstance._listModel._selectedKeys);

         cfg = getConfig({
            selectedKeys: [null],
            excludedKeys: [1, 2, 3]
         });
         selectionInstance = new operations.Selection(cfg);
         selectionInstance.toggleAll();
         selectionInstance.updateSelectionForRender();

         assert.deepEqual([1, 2, 3], selectionInstance.selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance.excludedKeys, 'Constructor: wrong field values');
         assert.deepEqual({1: true, 2: true, 3: true}, selectionInstance._listModel._selectedKeys);

         cfg = getConfig({
            selectedKeys: [null]
         });
         selectionInstance = new operations.Selection(cfg);
         selectionInstance.toggleAll();
         selectionInstance.updateSelectionForRender();

         assert.deepEqual([], selectionInstance.selectedKeys, 'Constructor: wrong field values');
         assert.deepEqual([], selectionInstance.excludedKeys, 'Constructor: wrong field values');
         assert.deepEqual({}, selectionInstance._listModel._selectedKeys);
      });
   });
});
