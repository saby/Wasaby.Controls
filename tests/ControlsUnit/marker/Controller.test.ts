/*
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
         })
      },
      getItemBySourceKey(key: number): object {
         return this.items.find((it) => it.id === key);
      },
      getNextItemKey(key: number): number {
         key++;
         return key > 3 ? 1 : key;
      },
      getPreviousItemKey(key: number): number {
         return --key;
      },
      getFirstItem(): object {
         return {id: 1, marked: false, getId() { return this.id; }};
      },
      getCount(): number {
         return this.items.length;
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

   it('constructor', () => {
      controller = new MarkerController({model: model})
      assert.equal(controller._markedKey, undefined);
      assert.deepEqual(model.items, [
         {id: 1, marked: false},
         {id: 2, marked: false},
         {id: 3, marked: false}
      ]);

      controller = new MarkerController({model: model, markerVisibility: 'visible', markedKey: 1})
      assert.equal(controller._markedKey, 1);
      assert.equal(controller._markerVisibility, 'visible');
      assert.deepEqual(model.items, [
         {id: 1, marked: true},
         {id: 2, marked: false},
         {id: 3, marked: false}
      ]);
   });

   describe('update', () => {
      it('change marked key', () => {
         controller._markerVisibility = 'visible';
         controller.update({model: model, markedKey: 2})
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: true},
            {id: 3, marked: false}
         ]);
      })
   });

   describe('setMarkedKey', () => {
      it('same key', () => {
         controller._markedKey = 2;
         controller.setMarkedKey(2);
         assert.equal(controller._markedKey, 2);
      });

      it('null', () => {
         controller._markerVisibility = 'visible';
         controller._markedKey = 2;
         controller._model.items = [
            {id: 1, marked: false},
            {id: 2, marked: true},
            {id: 3, marked: false}
         ];

         controller.setMarkedKey(null);

         assert.equal(controller._markedKey, 1);
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ]);
      });

      it('change key', () => {
         controller._markerVisibility = 'visible';
         controller._markedKey = 1;
         controller._model.items = [
            {id: 1, marked: true},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ];

         controller.setMarkedKey(2);

         assert.equal(controller._markedKey, 2);
         assert.deepEqual(model.items, [
            {id: 1, marked: false},
            {id: 2, marked: true},
            {id: 3, marked: false}
         ]);
      });

      it('not exist item by key', () => {
         controller._markerVisibility = 'visible';
         controller._markedKey = 2;
         controller._model.items = [
            {id: 1, marked: false},
            {id: 2, marked: true},
            {id: 3, marked: false}
         ];

         controller.setMarkedKey(4);

         assert.equal(controller._markedKey, 1);
         assert.deepEqual(model.items, [
            {id: 1, marked: true},
            {id: 2, marked: false},
            {id: 3, marked: false}
         ]);
      });
   });

   it('move marker next', () => {
      controller._markerVisibility = 'visible';
      controller._markedKey = 2;
      controller._model.items = [
         {id: 1, marked: false},
         {id: 2, marked: true},
         {id: 3, marked: false}
      ];

      controller.moveMarkerToNext();

      assert.equal(controller._markedKey, 3);
      assert.deepEqual(model.items, [
         {id: 1, marked: false},
         {id: 2, marked: false},
         {id: 3, marked: true}
      ]);
   });
   it('move marker prev', () => {
      controller._markerVisibility = 'visible';
      controller._markedKey = 2;
      controller._model.items = [
         {id: 1, marked: false},
         {id: 2, marked: true},
         {id: 3, marked: false}
      ];

      controller.moveMarkerToPrev();

      assert.equal(controller._markedKey, 1);
      assert.deepEqual(model.items, [
         {id: 1, marked: true},
         {id: 2, marked: false},
         {id: 3, marked: false}
      ]);
   });
});
*/
