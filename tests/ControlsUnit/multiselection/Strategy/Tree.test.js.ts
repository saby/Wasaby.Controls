// tslint:disable:no-magic-numbers

import { assert } from 'chai';
import { TreeSelectionStrategy } from 'Controls/multiselection';
import { relation } from 'Types/entity';
import { ListData } from 'ControlsUnit/ListData';
import { RecordSet } from 'Types/collection';

describe('Controls/_multiselection/SelectionStrategy/Tree', () => {
   const hierarchy = new relation.Hierarchy({
      keyProperty: ListData.KEY_PROPERTY,
      parentProperty: ListData.PARENT_PROPERTY,
      nodeProperty: ListData.NODE_PROPERTY,
      declaredChildrenProperty: ListData.HAS_CHILDREN_PROPERTY
   });

   const strategy = new TreeSelectionStrategy({
      nodesSourceControllers: ListData.getNodesSourceController(),
      selectDescendants: false,
      selectAncestors: false,
      hierarchyRelation: hierarchy,
      rootId: null,
      items: new RecordSet({
         keyProperty: ListData.KEY_PROPERTY,
         rawData: ListData.getItems()
      })
   });

   const strategyWithDescendantsAndAncestors = new TreeSelectionStrategy({
      nodesSourceControllers: ListData.getNodesSourceController(),
      selectDescendants: true,
      selectAncestors: true,
      hierarchyRelation: hierarchy,
      rootId: null,
      items: new RecordSet({
         keyProperty: ListData.KEY_PROPERTY,
         rawData: ListData.getItems()
      })
   });

   beforeEach(() => {
      strategy._rootId = null;
      strategyWithDescendantsAndAncestors._rootId = null;
      delete strategy.items.getMetaData().ENTRY_PATH;
   });

   describe('select', () => {
      it('not selected', () => {
         let selection = { selected: [], excluded: [] };
         selection = strategy.select(selection, [6]);
         assert.deepEqual(selection.selected, [6]);
         assert.deepEqual(selection.excluded, []);

         selection = { selected: [], excluded: [] };
         selection = strategy.select(selection, [1]);
         assert.deepEqual(selection.selected, [1]);
         assert.deepEqual(selection.excluded, []);

         selection = { selected: [], excluded: [] };
         selection = strategy.select(selection, [2]);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, []);

         selection = { selected: [], excluded: [2] };
         selection = strategy.select(selection, [2]);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);
      });

      it('has selected', () => {
         let selection = { selected: [3, 4], excluded: [] };
         selection = strategyWithDescendantsAndAncestors.select(selection, [2]);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, []);

         selection = { selected: [3, 4], excluded: [] };
         selection = strategy.select(selection, [2]);
         assert.deepEqual(selection.selected, [3, 4, 2]);
         assert.deepEqual(selection.excluded, []);
      });
   });

   describe('unselect', () => {
      it('selected node', () => {
         // выбран узел, в котором выбраны дети
         let selection = { selected: [2, 3], excluded: [] };
         selection = strategy.unselect(selection, [2]);
         assert.deepEqual(selection.selected, [3]);
         assert.deepEqual(selection.excluded, []);

         // выбран узел, в котором выбраны дети
         selection = { selected: [2, 3], excluded: [] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, [2]);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);

         // выбран узел, в котором исключены дети
         selection = { selected: [2], excluded: [3] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, [2]);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);

         // выбран узел, в котором исключены дети
         selection = { selected: [2], excluded: [3] };
         selection = strategy.unselect(selection, [2]);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, [3]);

         // выбран узел без родителей и детей
         selection = { selected: [6], excluded: [] };
         selection = strategy.unselect(selection, [6]);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);

         // выбран узел со всеми детьми
         selection = { selected: [2], excluded: [] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, [3]);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, [3]);

         // снимаем выбор с последнего ребенка
         selection = { selected: [2], excluded: [3] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, [4]);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);

         // при снятии выбора с оследнего выбранного ребенка, снимаем выбор со всех родителей
         selection = { selected: [1, 2], excluded: [3] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, [4]);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);
      });

      it('selected all', () => {
         let selection = { selected: [null], excluded: [null] };
         selection = strategyWithDescendantsAndAncestors.unselect(selection, [4]);
         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null, 4]);
      });
   });

   describe('selectAll', () => {
      it('not selected', () => {
         // выбрали все в корневом узле
         let selection = { selected: [], excluded: [] };
         selection = strategy.selectAll(selection);
         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null]);

         // провалились в узел 2 и выбрали все
         strategy._rootId = 2;
         selection = { selected: [], excluded: [] };
         selection = strategy.selectAll(selection);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, [2]);
      });

      it('selected one', () => {
         let selection = { selected: [1], excluded: [] };
         selection = strategy.selectAll(selection);
         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null]);
      });

      it('selected all, but one', () => {
         let selection = { selected: [null], excluded: [null, 2] };
         selection = strategy.selectAll(selection);
         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null]);
      });
   });

   describe('unselectAll', () => {
      it('without ENTRY_PATH', () => {
         let selection = { selected: [1, 6], excluded: [3, 5] };
         selection = strategy.unselectAll(selection);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);
      });

      it('with ENTRY_PATH', () => {
         // если есть ENTRY_PATH то удаляется только текущий корень и его дети
         strategy._items.getMetaData().ENTRY_PATH = {};
         strategy._rootId = 2;
         let selection = { selected: [2, 5], excluded: [2, 3] };
         selection = strategy.unselectAll(selection);
         assert.deepEqual(selection.selected, [5]);
         assert.deepEqual(selection.excluded, []);
      });
   });

   describe('toggleAll', () => {
      it('selected current node', () => {
         strategy._rootId = 2;
         let selection = { selected: [2], excluded: [2] };
         selection = strategy.toggleAll(selection);
         assert.deepEqual(selection.selected, []);
         assert.deepEqual(selection.excluded, []);
      });

      it('selected some items', () => {
         let selection = { selected: [1, 5], excluded: [] };
         selection = strategy.toggleAll(selection);
         assert.deepEqual(selection.selected, [null]);
         assert.deepEqual(selection.excluded, [null, 1, 5]);
      });

      it('selected all, but few', () => {
         let selection = { selected: [null], excluded: [null, 2] };
         selection = strategy.toggleAll(selection);
         assert.deepEqual(selection.selected, [2]);
         assert.deepEqual(selection.excluded, []);
      });
   });

   describe('getSelectionForModel', () => {
      it('not selected', () => {
         const selection = { selected: [], excluded: [] };
         const res = strategy.getSelectionForModel(selection);
         assert.deepEqual(res.get(true), []);
         assert.deepEqual(res.get(null), []);
         assert.deepEqual(res.get(false), ListData.getItems());
      });

      it('selected one', () => {
         // выбрали только лист и выбрались все его родители
         let selection = { selected: [3], excluded: [] };
         let res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(res.get(true), [ ListData.getItems()[2] ]);
         assert.deepEqual(res.get(null), [ ListData.getItems()[1], ListData.getItems()[0]]);
         assert.deepEqual(res.get(false), ListData.getItems().filter((it) => !(it.id in [1, 2, 3])) );

         // выбрали лист и выбрался только он
         selection = { selected: [3], excluded: [] };
         res = strategy.getSelectionForModel(selection);
         assert.deepEqual(res.get(true), [ ListData.getItems()[2] ]);
         assert.deepEqual(res.get(null), [ ]);
         assert.deepEqual(res.get(false), ListData.getItems().filter((it) => it.id !== 3) );

         // выбрали узел с родителями и с детьми, выбрался узел, дети и родители
         selection = { selected: [2], excluded: [] };
         res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(res.get(true), ListData.getItems().filter((it) => it.id in [2, 3, 4]) );
         assert.deepEqual(res.get(null), [ ListData.getItems()[0] ]);
         assert.deepEqual(res.get(false), ListData.getItems().filter((it) => !(it.id in [1, 2, 3, 4])) );

         // выбрали узел с родителями и с детьми, выбрался только узел
         selection = { selected: [2], excluded: [] };
         res = strategy.getSelectionForModel(selection);
         assert.deepEqual(res.get(true), [ ListData.getItems()[1] ] );
         assert.deepEqual(res.get(null), [ ]);
         assert.deepEqual(res.get(false), ListData.getItems().filter((it) => it.id !== 2) );

         // выбрали узел с родителями и с детьми и некоторые дети исключены
         selection = { selected: [2], excluded: [3] };
         res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(res.get(true), ListData.getItems().filter((it) => it.id in [2, 4]) );
         assert.deepEqual(res.get(null), [ ListData.getItems()[0] ]);
         assert.deepEqual(res.get(false), ListData.getItems().filter((it) => !(it.id in [1, 2, 4])) );
      });

      it('selected all, but one', () => {
         const selection = { selected: [null], excluded: [null, 2] };
         const res = strategy.getSelectionForModel(selection);
         assert.deepEqual(res.get(true), ListData.getItems().filter((it) => !(it.id in [2, 3, 4])) );
         assert.deepEqual(res.get(null), [ ]);
         assert.deepEqual(res.get(false), ListData.getItems().filter((it) => it.id in [2, 3, 4]) );
      });
   });

   describe('getCount', () => {
      it('not selected', () => {
         const selection = { selected: [], excluded: [] };
         const count = strategy.getCount(selection, false);
         const countWithDescAndAnc = strategyWithDescendantsAndAncestors.getCount(selection, false);
         assert.equal(count, 0);
         assert.equal(countWithDescAndAnc, 0);
      });

      it('selected one', () => {
         const selection = { selected: [2], excluded: [] };
         const count = strategy.getCount(selection, false);
         const countWithDescAndAnc = strategyWithDescendantsAndAncestors.getCount(selection, false);
         assert.equal(count, 1);
         assert.equal(countWithDescAndAnc, 3);
      });

      it('selected one and has more data', () => {
         const selection = { selected: [1], excluded: [] };
         const count = strategy.getCount(selection, true);
         const countWithDescAndAnc = strategyWithDescendantsAndAncestors.getCount(selection, true);
         assert.equal(count, null);
         assert.equal(countWithDescAndAnc, null);
      });

      it('selected all, but one', () => {
         const selection = { selected: [null], excluded: [null, 2] };
         const count = strategy.getCount(selection, false);
         const countWithDescAndAnc = strategyWithDescendantsAndAncestors.getCount(selection, false);
         assert.equal(count, 1);
         assert.equal(countWithDescAndAnc, 4);
      });

      it('selected all, but one and has more data', () => {
         const selection = { selected: [null], excluded: [null, 2] };
         const count = strategy.getCount(selection, true);
         const countWithDescAndAnc = strategyWithDescendantsAndAncestors.getCount(selection, true);
         assert.equal(count, null);
         assert.equal(countWithDescAndAnc, null);
      });
   });

   describe('cases of go inside node and out it', () => {
      it('select node and go inside it', () => {
         let selection = { selected: [], excluded: [] };
         selection = strategyWithDescendantsAndAncestors.select(selection, [2]);
         strategyWithDescendantsAndAncestors._rootId = 2;
         const res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(res.get(true), ListData.getItems().filter((it) => it.id in [2, 3, 4]) );
         assert.deepEqual(res.get(null), [ ]);
         assert.deepEqual(res.get(false), ListData.getItems().filter((it) => !(it.id in [1, 2, 3, 4])) );
      });

      it('select all being inside node and go out it', () => {
         let selection = { selected: [], excluded: [] };
         strategyWithDescendantsAndAncestors._rootId = 1;
         selection = strategyWithDescendantsAndAncestors.selectAll(selection);
         strategyWithDescendantsAndAncestors._rootId = null;
         const res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(res.get(true), [ ] );
         assert.deepEqual(res.get(null), [ ]);
         assert.deepEqual(res.get(false), [ListData.getItems()] );
      });

      it('select leaf being inside node and go out it', () => {
         let selection = { selected: [], excluded: [] };
         strategyWithDescendantsAndAncestors._rootId = 1;
         selection = strategyWithDescendantsAndAncestors.select(selection, [5]);
         strategyWithDescendantsAndAncestors._rootId = null;
         const res = strategyWithDescendantsAndAncestors.getSelectionForModel(selection);
         assert.deepEqual(res.get(true), [ ListData.getItems()[4] ] );
         assert.deepEqual(res.get(null), [ ListData.getItems()[0] ]);
         assert.deepEqual(res.get(false), ListData.getItems().filter((it) => !(it.id in [1, 4])) );
      });
   });
});
