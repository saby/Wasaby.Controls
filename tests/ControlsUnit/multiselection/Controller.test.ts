// tslint:disable:no-magic-numbers
// tslint:disable:no-empty

import { assert } from 'chai';
import { SelectionController } from 'Controls/multiselection';
import { Record } from 'Types/entity';

describe('Controls/_multiselection/Controller', () => {
   const model = {
      items: [],
      flag: false,
      setSelectedItems(): void {
         this.flag = true;
      },
      getHasMoreData(): boolean { return false; },
      getCollection(): number[] { return this.items; },
      getItemBySourceKey(): object {
         return {
            isSelected(): boolean { return false; }
         };
      }
   };

   const strategy = {
      unselect(): void {},
      select(): void {},
      update(): void {},
      selectAll(): void {},
      toggleAll(): void {},
      unselectAll(): void {},
      getCount(): void {},
      getSelectionForModel(): void {}
   };

   let controller;

   beforeEach(() => {
      model.items = [];
      model.flag = false;
      controller = new SelectionController({
         model,
         strategy,
         selectedKeys: [],
         excludedKeys: []
      });
   });

   it('constructor', () => {
      controller = new SelectionController({
         model,
         strategy,
         selectedKeys: [],
         excludedKeys: []
      });
      assert.equal(model.flag, true);
   });

   describe('update', () => {
      it('model changed', () => {
         controller.update({
            model: {
               items: [],
               flag: false,
               setSelectedItems(): void { this.flag = true; },
               getHasMoreData(): boolean { return false; },
               getCollection(): number[] { return this.items; },
               getItemBySourceKey(): object {
                  return {
                     isSelected(): boolean {
                        return false;
                     }
                  };
               }
            },
            selectedKeys: [],
            excludedKeys: [],
            strategyOptions: {}
         });
         assert.equal(controller._model.flag, true);
      });

      it('items changed', () => {
         model.items = [1, 2, 3];
         controller.update({
            model,
            selectedKeys: [],
            excludedKeys: [],
            strategyOptions: {}
         });
         assert.equal(controller._model.flag, true);
      });

      it('selection changed', () => {
         controller.update({
            model,
            selectedKeys: [1],
            excludedKeys: [],
            strategyOptions: {}
         });
         assert.equal(controller._model.flag, true);
      });
   });

   it('toggleItem', () => {
      controller.toggleItem(1);
      assert.equal(model.flag, true);
   });

   it('selectAll', () => {
      controller.selectAll();
      assert.equal(model.flag, true);
   });

   it('toggleAll', () => {
      controller.toggleAll();
      assert.equal(model.flag, true);
   });

   it('unselectAll', () => {
      controller.unselectAll();
      assert.equal(model.flag, true);
   });

   it('handleAddItems', () => {
      controller.handleAddItems([ new Record({ rawData: { id: 1 } }) ]);
      assert.equal(model.flag, true);
   });

   it('handleRemoveItems', () => {
      controller.handleRemoveItems([ new Record({ rawData: { id: 2 } }) ]);
      assert.equal(model.flag, true);
   });

   it('handleReset', () => {
      controller.handleReset([ new Record() ]);
      assert.equal(model.flag, true);
   });
});
