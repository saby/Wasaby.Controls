// tslint:disable:no-empty
// tslint:disable:no-magic-numbers

import { assert } from 'chai';
import { spy } from 'sinon';
import { MarkerController } from "Controls/marker";
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
      controller = new MarkerController({ model, markerVisibility: 'visible', markedKey: undefined })
   });

   describe('constructor', () => {
      it('not pass markedKey', () => {
         controller = new MarkerController({ model, markerVisibility: 'visible', markedKey: undefined })
         assert.equal(controller._markedKey, 1);
         assert.equal(model.getMarkedKey(), 1);
      });

      it('pass markedKey', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 1})
         assert.equal(controller._markedKey, 1);
         assert.equal(controller._markerVisibility, 'visible');
         assert.equal(model.getMarkedKey(), 1);
      });
   });

   describe('update', () => {
      it('change marked key', () => {
         const result = controller.update({model: model, markedKey: 2})
         assert.equal(model.getMarkedKey(), 2);
         assert.equal(result, 2);
      })

      it('pass null if markedKey was set', () => {
         let result = controller.setMarkedKey(1);
         assert.equal(model.getMarkedKey(), 1);
         assert.equal(result, 1);

         result =  controller.update({
            model: model,
            markerVisibility: 'visible',
            markedKey: null
         });
         assert.equal(result, 1);
         assert.equal(model.getMarkedKey(), 1);
      });

      it('pass null if markedKey was not set', () => {
         const result = controller.update({
            model: model,
            markerVisibility: 'visible',
            markedKey: null
         })
         assert.equal(result, 1);
         assert.equal(model.getMarkedKey(), 1);
      });

      it('marker was reset in model', () => {
         let result = controller.setMarkedKey(2);
         assert.equal(result, 2);
         assert.equal(model.getMarkedKey(), 2);

         // сбрасываем маркер в модели
         model.setMarkedKey(2, false);
         assert.isNull(model.getMarkedKey());

         result = controller.update({
            model: model,
            markerVisibility: 'visible',
            markedKey: 2
         });
         assert.equal(result, 2);
         assert.equal(model.getMarkedKey(), 2);
      });
   });

   describe('setMarkedKey', () => {
      it('same key', () => {
         controller._markedKey = 2;
         const result = controller.setMarkedKey(2);
         assert.equal(result, 2);
      });

      it('same key which not exists in model', () => {
         controller._markedKey = 4;
         const result = controller.setMarkedKey(4);
         assert.equal(result, 1);
      });

      it('null', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

         const result = controller.setMarkedKey(null);
         assert.equal(result, 1);
         assert.equal(model.getMarkedKey(), 1);
      });

      it('undefined', () => {
         controller = new MarkerController({model: model, markerVisibility: 'onactivated', markedKey: 2});

         let result = controller.setMarkedKey(undefined);
         assert.equal(result, undefined);
         assert.equal(model.getMarkedKey(), undefined);

         const setMarkedKeySpy = spy(model, 'setMarkedKey');
         result = controller.setMarkedKey(undefined);
         assert.equal(result, undefined);
         assert.equal(model.getMarkedKey(), undefined);
         assert.isFalse(setMarkedKeySpy.called);
      });

      it('change key', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 1});

         const result = controller.setMarkedKey(2);
         assert.equal(result, 2);
         assert.equal(model.getMarkedKey(), 2);
      });

      it('not exist item by key', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

         const result = controller.setMarkedKey(4);
         assert.equal(result, 1);
         assert.equal(model.getMarkedKey(), 1);
      });

      it('not exists item and onActivated visibility', () => {
         controller = new MarkerController({model: model, markerVisibility: 'onactivated', markedKey: undefined});

         const result = controller.setMarkedKey(4);
         assert.equal(result, undefined);
         assert.equal(model.getMarkedKey(), undefined);
      });
   });

   describe('restoreMarker', () => {
      it('markerVisibility = onactivated', () => {
         controller = new MarkerController({model, markerVisibility: 'onactivated', markedKey: 1});
         model.setItems(items);

         const notifyLaterSpy = spy(model, '_notifyLater');

         controller.restoreMarker();

         assert.isFalse(notifyLaterSpy.called, 'restoreMarker не должен уведомлять о простановке маркера');
         assert.isTrue(model.getItemBySourceKey(1).isMarked());
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

         const notifyLaterSpy = spy(model, '_notifyLater');

         controller.restoreMarker();

         assert.isFalse(notifyLaterSpy.called, 'restoreMarker не должен уведомлять о простановке маркера');
         assert.isTrue(model.getItemBySourceKey(2).isMarked());
      });
   });

   it('move marker next', () => {
      controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

      const result = controller.moveMarkerToNext();
      assert.equal(result, 3);
      assert.equal(model.getMarkedKey(), 3);
   });

   it('move marker prev', () => {
      controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

      const result = controller.moveMarkerToPrev();
      assert.equal(result, 1);
      assert.equal(model.getMarkedKey(), 1);
   });

   describe('setMarkerOnFirstVisibleItem', () => {
      const getBCR = function() {
         return { height: 30 };
      };
      const htmlItems = [
         { getBoundingClientRect: getBCR },
         { getBoundingClientRect: getBCR },
         { getBoundingClientRect: getBCR },
      ];

      it('offset 0', () => {
         const result = controller.setMarkerOnFirstVisibleItem(htmlItems, 0);
         assert.equal(result, 1);
         assert.equal(model.getMarkedKey(), 1);
      });

      it('offset 1', () => {
         const result = controller.setMarkerOnFirstVisibleItem(htmlItems, 1);
         assert.equal(result, 2);
         assert.equal(model.getMarkedKey(), 2);
      });

      it('offset 29', () => {
         const result = controller.setMarkerOnFirstVisibleItem(htmlItems, 29);
         assert.equal(result, 2);
         assert.equal(model.getMarkedKey(), 2);
      });

      it ('offset 30', () => {
         const result = controller.setMarkerOnFirstVisibleItem(htmlItems, 30);
         assert.equal(result, 2);
         assert.equal(model.getMarkedKey(), 2);
      });

      it ('offset 31', () => {
         const result = controller.setMarkerOnFirstVisibleItem(htmlItems, 31);
         assert.equal(result, 3);
         assert.equal(model.getMarkedKey(), 3);
      });

      it ('offset 31 and start index 2', () => {
         model.getStartIndex = () => { return 2; }
         const result = controller.setMarkerOnFirstVisibleItem(htmlItems, 31);
         assert.equal(result, 3);
         assert.equal(model.getMarkedKey(), 3);
      });
   });

   describe('handlerRemoveItems', () => {
      it('exists next item', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

         model.setItems(new RecordSet({
               rawData: [
                  {id: 1},
                  {id: 3}
               ],
               keyProperty: 'id'
            }));

         const result = controller.handleRemoveItems(1);
         assert.equal(result, 3);
         assert.equal(model.getMarkedKey(), 3);
      });

      it('exists prev item, but not next', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

         model.setItems(new RecordSet({
            rawData: [
               {id: 1},
               {id: 2}
            ],
            keyProperty: 'id'
         }));

         const result = controller.handleRemoveItems(2);
         assert.equal(result, 2);
         assert.equal(model.getMarkedKey(), 2);
      });

      it('not exists next and prev', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

         model.setItems(new RecordSet({
            rawData: [],
            keyProperty: 'id'
         }));

         const result = controller.handleRemoveItems(0);
         assert.equal(result, undefined);
         assert.equal(model.getMarkedKey(), undefined);
      });
   });

   it('should work with breadcrumbs', () => {
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
         }),
         keyProperty: 'id',
         parentProperty: 'parent',
         nodeProperty: 'nodeType',
         columns: [{}]
      });

      controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});
      assert.equal(model.getMarkedKey(), 2);

      controller.moveMarkerToNext();
      assert.equal(model.getMarkedKey(), 4);

      controller.moveMarkerToPrev();
      assert.equal(model.getMarkedKey(), 2);


      controller.setMarkedKey(4);
      assert.equal(model.getMarkedKey(), 4);

      model.setItems(new RecordSet({
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
      }));
      controller.handleRemoveItems(2);
      assert.equal(model.getMarkedKey(), 2);
   });
});
