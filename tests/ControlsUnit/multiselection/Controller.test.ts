// tslint:disable:no-empty
// tslint:disable:no-magic-numbers

import { assert } from 'chai';
import { FlatSelectionStrategy, SelectionController } from 'Controls/multiselection';
import { ListViewModel } from 'Controls/list';
import { RecordSet } from 'Types/collection';
import { spy } from 'sinon';
import { SearchGridViewModel} from 'Controls/treeGrid';

describe('Controls/_multiselection/Controller', () => {
   const items = new RecordSet({
      rawData: [
         { id: 1 },
         { id: 2 },
         { id: 3 }
      ],
      keyProperty: 'id'
   });

   const strategy = new FlatSelectionStrategy({items});

   let controller, model;

   beforeEach(() => {
      model = new ListViewModel({
         items,
         keyProperty: 'id'
      });

      controller = new SelectionController({
         model,
         strategy,
         selectedKeys: [],
         excludedKeys: []
      });
   });

   describe('update', () => {
      it('model changed', () => {
         model =  new ListViewModel({
            items,
            keyProperty: 'id'
         });

         const setSelectedItemsSpy = spy(model, 'setSelectedItems');

         controller.update({
            model,
            selectedKeys: [],
            excludedKeys: [],
            strategyOptions: { items: model.getItems() }
         }, false, false);

         assert.isTrue(setSelectedItemsSpy.called);
      });

      it('selection changed', () => {
         const setSelectedItemsSpy = spy(model, 'setSelectedItems');
         controller.update({
            model,
            selectedKeys: [1],
            excludedKeys: [],
            strategyOptions: { items: model.getItems() }
         }, false, false);
         assert.isTrue(setSelectedItemsSpy.called);
      });
   });

   it('restoreSelection', () => {
      controller = new SelectionController({
         model,
         strategy,
         selectedKeys: [1],
         excludedKeys: []
      });
      model.setItems(items);

      const notifyLaterSpy = spy(model, '_notifyLater');

      controller.restoreSelection();

      assert.isFalse(notifyLaterSpy.called);
      assert.isTrue(model.getItemBySourceKey(1).isSelected());
      assert.equal(controller._strategy._items, items);
   });

   describe('toggleItem', () => {
      it ('toggle', () => {
         const setSelectedItemsSpy = spy(model, 'setSelectedItems');
         controller.toggleItem(1);
         assert.isTrue(setSelectedItemsSpy.called);
      });

      it('toggle breadcrumbs', () => {
         model = new SearchGridViewModel({
            items: new RecordSet({
               rawData: [{
                  id: 1,
                  parent: null,
                  nodeType: true,
                  title: 'test_node'
               }, {
                  id: 2,
                  parent: 1,
                  nodeType: null,
                  title: 'test_leaf'
               }],
               keyProperty: 'id'
            }),
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: 'nodeType',
            columns: [{}]
         });
         controller = new SelectionController({
            model,
            strategy,
            selectedKeys: [],
            excludedKeys: []
         });

         const setSelectedItemsSpy = spy(model, 'setSelectedItems');
         controller.toggleItem(2);
         assert.isTrue(setSelectedItemsSpy.called);
      });
   });

   describe('clearSelection', () => {
      it('not empty model', () => {
         const setSelectedItemsSpy = spy(model, 'setSelectedItems');
         const result = controller.clearSelection();
         assert.isTrue(setSelectedItemsSpy.called);
         assert.deepEqual(result, {
            selectedKeysDiff: {
               added: [],
               removed: [],
               keys: []
            },
            excludedKeysDiff: {
               added: [],
               removed: [],
               keys: []
            },
            selectedCount: 0,
            isAllSelected: false
         });
      });

      it('clearSelection and empty model', () => {
         model.setItems(new RecordSet({
            rawData: [],
            keyProperty: 'id'
         }));

         const result = controller.clearSelection();
         assert.deepEqual(result, {
            selectedKeysDiff: {
               added: [],
               removed: [],
               keys: []
            },
            excludedKeysDiff: {
               added: [],
               removed: [],
               keys: []
            },
            selectedCount: 0,
            isAllSelected: false
         });
      });
   });

   it('isAllSelected', () => {
      const isAllSelectedSpy = spy(strategy, 'isAllSelected');
      controller.isAllSelected();
      assert.isTrue(isAllSelectedSpy.called);
   });

   it('selectAll', () => {
      const setSelectedItemsSpy = spy(model, 'setSelectedItems');
      controller.selectAll();
      assert.isTrue(setSelectedItemsSpy.called);
   });

   it('toggleAll', () => {
      const setSelectedItemsSpy = spy(model, 'setSelectedItems');
      controller.toggleAll();
      assert.isTrue(setSelectedItemsSpy.called);
   });

   it('unselectAll', () => {
      const setSelectedItemsSpy = spy(model, 'setSelectedItems');
      controller.unselectAll();
      assert.isTrue(setSelectedItemsSpy.called);
   });

   it('handleAddItems', () => {
      const setSelectedItemsSpy = spy(model, 'setSelectedItems');
      controller.handleAddItems([]);
      assert.isTrue(setSelectedItemsSpy.called);
   });

   it('handleRemoveItems', () => {
      const setSelectedItemsSpy = spy(model, 'setSelectedItems');
      controller.handleRemoveItems([]);
      assert.isTrue(setSelectedItemsSpy.called);
   });

   it('handleReset', () => {
      controller = new SelectionController({
         model,
         strategy,
         selectedKeys: [null],
         excludedKeys: [null]
      });

      const setSelectedItemsSpy = spy(model, 'setSelectedItems');
      controller.handleReset([], null, true);
      assert.isTrue(setSelectedItemsSpy.called);
   });

   it('with limit', () => {
      controller.setLimit(2);

      let result = controller.selectAll();
      assert.equal(result.selectedCount, 2);

      result = controller.toggleItem(3);
      assert.equal(result.selectedCount, 3);
   });
});
