// tslint:disable:no-empty
// tslint:disable:no-magic-numbers

import { assert } from 'chai';
import { MarkerController } from "Controls/marker";

describe('Controls/marker/Controller', () => {
   const model = {
      items: [
         {id: 1, marked: false},
         {id: 2, marked: false},
         {id: 3, marked: false}
      ],
      setMarkedKey(key: number, status: boolean): void {
         this.items.forEach((it) => {
            if (it.id === key) {
               it.marked = status;
            }
         });
      },
      getItemBySourceKey(key: number): object {
         return this.items.find((it) => it.id === key);
      },
      getNextByKey(key: number): object {
         return {
            getContents(): object {
               return {
                  getKey(): number { return key + 1; }
               };
            }
         };
      },
      getPrevByKey(key: number): object {
         return {
            getContents(): object {
               return {
                  getKey(): number { return key - 1; }
               };
            }
         };
      },
      getNextByIndex(index: number): object {
         return index === 1 ? {
            getContents(): object {
               return {
                  getKey(): number { return 3; }
               };
            }
         } : null;
      },
      getPrevByIndex(index: number): object {
         return index === 2 ? {
            getContents(): object {
               return {
                  getKey(): number { return 2; }
               };
            }
         } : null;
      },
      getFirstItem(): object {
         return {id: 1, marked: false, getKey(): number { return this.id; }};
      },
      getCount(): number {
         return this.items.length;
      },
      getStartIndex(): number { return 0; },
      getStopIndex(): number { return 3; },
      getValidItemForMarker(index: number): object {
         if (index > 2) {
            return null;
         }

         return {
            getContents(): object {
               return {
                  getKey(): number {
                     // у нас ключи нумеруются с 1 по порядку
                     return index + 1;
                  }
               };
            }
         }
      }
   };

   let controller;

   beforeEach(() => {
      model.items = [
         {id: 1, marked: false},
         {id: 2, marked: false},
         {id: 3, marked: false}
      ];
      controller = new MarkerController({model: model, markerVisibility: 'visible'})
   });

   describe('constructor', () => {
      it('not pass markedKey', () => {
         controller = new MarkerController({model: model})
         assert.equal(controller._markedKey, undefined);
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ]);
      });

      it('pass markedKey', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 1})
         assert.equal(controller._markedKey, 1);
         assert.equal(controller._markerVisibility, 'visible');
         assert.deepEqual(model.items, [
            {id: 1, marked: true},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ]);
      });
   });

   describe('update', () => {
      it('change marked key', () => {
         controller.update({model: model, markedKey: 2})
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: true},
            {id: 3, marked: false}
         ]);
      })

      it('pass null if markedKey was set', () => {
         controller.setMarkedKey(1);
         assert.equal(controller._markedKey, 1);
         assert.deepEqual(model.items, [
            {id: 1, marked: true},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ]);

         controller.update({
            model: model,
            markerVisibility: 'visible',
            markedKey: null
         })
         assert.equal(controller._markedKey, 1);
         assert.deepEqual(model.items, [
            {id: 1, marked: true},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ]);
      });

      it('pass null if markedKey was not set', () => {
         controller.update({
            model: model,
            markerVisibility: 'visible',
            markedKey: null
         })
         assert.equal(controller._markedKey, 1);
         assert.deepEqual(model.items, [
            {id: 1, marked: true},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ]);
      });
   });

   describe('setMarkedKey', () => {
      it('same key', () => {
         controller._markedKey = 2;
         controller.setMarkedKey(2);
         assert.equal(controller._markedKey, 2);
      });

      it('null', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

         controller.setMarkedKey(null);

         assert.equal(controller._markedKey, 1);
         assert.deepEqual(model.items, [
            {id: 1, marked: true},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ]);
      });

      it('change key', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 1});

         controller.setMarkedKey(2);

         assert.equal(controller._markedKey, 2);
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: true},
            {id: 3, marked: false}
         ]);
      });

      it('not exist item by key', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

         controller.setMarkedKey(4);

         assert.equal(controller._markedKey, 1);
         assert.deepEqual(model.items, [
            {id: 1, marked: true},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ]);
      });

      it('not exists item and onActivated visibility', () => {
         controller = new MarkerController({model: model, markerVisibility: 'onActivated'});

         controller.setMarkedKey(4);

         assert.equal(controller._markedKey, undefined);
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ]);
      });
   });

   it('move marker next', () => {
      controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

      controller.moveMarkerToNext();

      assert.equal(controller._markedKey, 3);
      assert.deepEqual(model.items, [
         {id: 1, marked: false},
         {id: 2, marked: false},
         {id: 3, marked: true}
      ]);
   });

   it('move marker prev', () => {
      controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

      controller.moveMarkerToPrev();

      assert.equal(controller._markedKey, 1);
      assert.deepEqual(model.items, [
         {id: 1, marked: true},
         {id: 2, marked: false},
         {id: 3, marked: false}
      ]);
   });

   describe('handlerRemoveItems', () => {
      it('exists next item', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

         model.items.splice(1, 1);
         controller.handleRemoveItems(1);

         assert.equal(controller._markedKey, 3);
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 3, marked: true}
         ]);
      });

      it('exists prev item, but not next', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

         model.items.splice(2, 1);
         controller.handleRemoveItems(2);

         assert.equal(controller._markedKey, 2);
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: true}
         ]);
      });

      it('not exists next and prev', () => {
         controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 2});

         model.items.splice(0, 3);
         controller.handleRemoveItems(0);

         assert.equal(controller._markedKey, null);
         assert.deepEqual(model.items, []);
      });
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
         controller.setMarkerOnFirstVisibleItem(htmlItems, 0);
         assert.equal(controller._markedKey, 1);
         assert.deepEqual(model.items, [
            {id: 1, marked: true},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ]);
      });

      it('offset 1', () => {
         controller.setMarkerOnFirstVisibleItem(htmlItems, 1);
         assert.equal(controller._markedKey, 2);
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: true},
            {id: 3, marked: false}
         ]);
      });

      it('offset 29', () => {
         controller.setMarkerOnFirstVisibleItem(htmlItems, 29);
         assert.equal(controller._markedKey, 2);
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: true},
            {id: 3, marked: false}
         ]);
      });

      it ('offset 30', () => {
         controller.setMarkerOnFirstVisibleItem(htmlItems, 30);
         assert.equal(controller._markedKey, 2);
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: true},
            {id: 3, marked: false}
         ]);
      });

      it ('offset 31', () => {
         controller.setMarkerOnFirstVisibleItem(htmlItems, 31);
         assert.equal(controller._markedKey, 3);
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: false},
            {id: 3, marked: true}
         ]);
      });

      it ('offset 31 and start index 2', () => {
         model.getStartIndex = () => { return 2; }
         controller.setMarkerOnFirstVisibleItem(htmlItems, 31);
         assert.equal(controller._markedKey, undefined);
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ]);
      });
   });
});
