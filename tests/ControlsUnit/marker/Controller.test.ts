// tslint:disable:no-empty
// tslint:disable:no-magic-numbers

import { assert } from 'chai';
import { MarkerController } from 'Controls/marker';
import { ListViewModel } from 'Controls/list';
import { RecordSet } from 'Types/collection';
import { SearchGridViewModel } from 'Controls/treeGrid';

describe('Controls/marker/Controller', () => {
   let controller, model, items;

   beforeEach(() => {
      items = new RecordSet({
         rawData: [
            {id: 1},
            {id: 2},
            {id: 3}
         ],
         keyProperty: 'id'
      });
      model = new ListViewModel({
         items
      });
      controller = new MarkerController({ model, markerVisibility: 'visible', markedKey: undefined });
   });

   describe('updateOptions', () => {
      it('change options', () => {
          const newModel = new ListViewModel({
              items
          });
          controller.updateOptions({
              model: newModel, markerVisibility: 'onactivated'
          });

          assert.equal(controller._model, newModel);
          assert.equal(controller._markerVisibility, 'onactivated');
      });
   });

    describe('applyMarkedKey', () => {
        it('same key', () => {
            controller = new MarkerController({model, markerVisibility: 'visible', markedKey: 1});
            model.setItems(new RecordSet({
                rawData: [
                    {id: 1},
                    {id: 2},
                    {id: 3}
                ],
                keyProperty: 'id'
            }));

            assert.isFalse(model.getItemBySourceKey(1).isMarked());
            controller.applyMarkedKey(1);
            assert.isTrue(model.getItemBySourceKey(1).isMarked());
        });

        it('another key', () => {
            controller.applyMarkedKey(1);
            assert.isTrue(model.getItemBySourceKey(1).isMarked());
            assert.isFalse(model.getItemBySourceKey(2).isMarked());

            controller.applyMarkedKey(2);
            assert.isFalse(model.getItemBySourceKey(1).isMarked());
            assert.isTrue(model.getItemBySourceKey(2).isMarked());
        });
    });

   describe('calculateMarkedKey', () => {
      it('same key', () => {
          controller.applyMarkedKey(2);
         const result = controller.calculateMarkedKey();
         assert.equal(result, 2);
      });

      it('same key which not exists in model', () => {
         controller.applyMarkedKey(4);
         const result = controller.calculateMarkedKey();
         assert.equal(result, 1);
      });

      it('null', () => {
         controller = new MarkerController({model, markerVisibility: 'visible', markedKey: null});

         const result = controller.calculateMarkedKey();
         assert.strictEqual(result, 1);
      });

      it('undefined', () => {
         controller = new MarkerController({model, markerVisibility: 'onactivated', markedKey: undefined});

         const result = controller.calculateMarkedKey();
         assert.strictEqual(result, null);
      });

      it('not exist item by key', () => {
         controller = new MarkerController({model, markerVisibility: 'visible', markedKey: 4});

         const result = controller.calculateMarkedKey();
         assert.equal(result, 1);
      });

      it('not exists item and onActivated visibility', () => {
         controller = new MarkerController({model, markerVisibility: 'onactivated', markedKey: 4});

         const result = controller.calculateMarkedKey();
         assert.equal(result, null);
      });

      it('onactivated', () => {
         controller = new MarkerController({model, markerVisibility: 'onactivated', markedKey: 3});

         let result = controller.calculateMarkedKey();
         assert.equal(result, 3);

         controller.applyMarkedKey(result);
         assert.isTrue(model.getItemBySourceKey(3).isMarked());

         // markedKey не должен сброситсья, если список пустой
         model.setItems(new RecordSet({
            rawData: [],
            keyProperty: 'id'
         }));

         controller.updateOptions({model, markerVisibility: 'onactivated'});
         result = controller.calculateMarkedKey();
         assert.equal(result, 3);

         model.setItems(new RecordSet({
            rawData: [
               {id: 1},
               {id: 2}
            ],
            keyProperty: 'id'
         }));

         controller.updateOptions({model, markerVisibility: 'onactivated'});
         result = controller.calculateMarkedKey();
         assert.equal(result, null);
      });

      it('markerVisibility = visible and not exists item with marked key', () => {
         controller = new MarkerController({model, markerVisibility: 'visible', markedKey: 1});
         model.setItems(new RecordSet({
            rawData: [
               {id: 2},
               {id: 3}
            ],
            keyProperty: 'id'
         }));

         const result = controller.calculateMarkedKey();
         assert.equal(result, 2);
      });

      it('markerVisibility = onactivated and not exists item with marked key', () => {
         controller = new MarkerController({model, markerVisibility: 'onactivated', markedKey: 1});
         model.setItems(new RecordSet({
            rawData: [
               {id: 2},
               {id: 3}
            ],
            keyProperty: 'id'
         }));

         const result = controller.calculateMarkedKey();
         assert.equal(result, null);
      });
   });

   it('calculateNextMarkedKey', () => {
      controller = new MarkerController({model, markerVisibility: 'visible', markedKey: 2});

      const result = controller.calculateNextMarkedKey();
      assert.equal(result, 3);
   });

   it('calculatePrevMarkedKey', () => {
      controller = new MarkerController({model, markerVisibility: 'visible', markedKey: 2});

      const result = controller.calculatePrevMarkedKey();
      assert.equal(result, 1);
   });

   describe('calculateFirstVisibleItemKey', () => {
      const getBCR = () => ({ height: 30 });
      const htmlItems = [
         { getBoundingClientRect: getBCR },
         { getBoundingClientRect: getBCR },
         { getBoundingClientRect: getBCR }
      ];

      it('offset 0', () => {
         const result = controller.calculateFirstVisibleItemKey(htmlItems, 0);
         assert.equal(result, 1);
      });

      it('offset 1', () => {
         const result = controller.calculateFirstVisibleItemKey(htmlItems, 1);
         assert.equal(result, 2);
      });

      it('offset 29', () => {
         const result = controller.calculateFirstVisibleItemKey(htmlItems, 29);
         assert.equal(result, 2);
      });

      it ('offset 30', () => {
         const result = controller.calculateFirstVisibleItemKey(htmlItems, 30);
         assert.equal(result, 2);
      });

      it ('offset 31', () => {
         const result = controller.calculateFirstVisibleItemKey(htmlItems, 31);
         assert.equal(result, 3);
      });

      it ('offset 31 and start index 2', () => {
         model.getStartIndex = () => 2;
         const result = controller.calculateFirstVisibleItemKey(htmlItems, 31);
         assert.equal(result, 3);
      });
   });

   describe('calculateMarkedKeyAfterRemove', () => {
      it('exists current marked item', () => {
         controller = new MarkerController({model, markerVisibility: 'visible', markedKey: 2});

         model.setItems(new RecordSet({
            rawData: [
               {id: 2},
               {id: 3}
            ],
            keyProperty: 'id'
         }));

         const result = controller.calculateMarkedKeyAfterRemove(0);
         assert.equal(result, 2);
      });

      it('exists next item', () => {
         controller = new MarkerController({model, markerVisibility: 'visible', markedKey: 2});

         model.setItems(new RecordSet({
               rawData: [
                  {id: 1},
                  {id: 3}
               ],
               keyProperty: 'id'
            }));

         const result = controller.calculateMarkedKeyAfterRemove(1);
         assert.equal(result, 3);
      });

      it('exists prev item, but not next', () => {
         controller = new MarkerController({model, markerVisibility: 'visible', markedKey: 2});

         model.setItems(new RecordSet({
            rawData: [
               {id: 1},
               {id: 2}
            ],
            keyProperty: 'id'
         }));

         const result = controller.calculateMarkedKeyAfterRemove(2);
         assert.equal(result, 2);
      });

      it('not exists next and prev', () => {
         controller = new MarkerController({model, markerVisibility: 'visible', markedKey: 2});

         model.setItems(new RecordSet({
            rawData: [],
            keyProperty: 'id'
         }));

         const result = controller.calculateMarkedKeyAfterRemove(0);
         assert.equal(result, null);
      });
   });

   it('resetMarkedState', () => {
      const item1 = model.getItemBySourceKey(1);
      const item2 = model.getItemBySourceKey(2);
      item1.setMarked(true);
      item2.setMarked(true);

      assert.isTrue(item1.isMarked());
      assert.isTrue(item2.isMarked());

      controller.resetMarkedState([item1, item2]);

      assert.isFalse(item1.isMarked());
      assert.isFalse(item2.isMarked());
   });

   it('should work with breadcrumbs', () => {
      const items = new RecordSet({
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
         },
         {
            id: 3,
            parent: null,
            nodeType: true,
            title: 'test_node'
         }, {
            id: 4,
            parent: 3,
            nodeType: null,
            title: 'test_leaf'
         }],
         keyProperty: 'id'
      });

      const model = new SearchGridViewModel({
         items,
         keyProperty: 'id',
         parentProperty: 'parent',
         nodeProperty: 'nodeType',
         columns: [{}]
      });

      const controller = new MarkerController({model, markerVisibility: 'visible', markedKey: 2});
      let result = controller.calculateMarkedKey();
      controller.applyMarkedKey(result);
      assert.equal(controller.getMarkedKey(), 2);

      result = controller.calculateNextMarkedKey();
      assert.equal(result, 3);

      result = controller.calculatePrevMarkedKey();
      assert.equal(result, 1);

      controller.applyMarkedKey(4);
      result = controller.calculateMarkedKey();
      assert.equal(result, 4);

      items.removeAt(2);
      items.removeAt(2);

      result = controller.calculateMarkedKeyAfterRemove(2);
      assert.equal(result, 2);
   });
});
