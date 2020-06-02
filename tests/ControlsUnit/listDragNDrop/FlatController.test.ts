// tslint:disable:no-empty
// tslint:disable:no-magic-numbers

import { assert } from 'chai';
import { spy } from 'sinon';
import { DndFlatController } from 'Controls/listDragNDrop';
import { ListViewModel } from 'Controls/list';
import { RecordSet } from 'Types/collection';
import { ItemsEntity } from 'Controls/dragnDrop';

describe('Controls/_listDragNDrop/FlatController', () => {
   let controller, model;

   const items = new RecordSet({
      rawData: [
         { id: 1 },
         { id: 2 },
         { id: 3 }
      ],
      keyProperty: 'id'
   });
   const cfg = {
      items,
      keyProperty: 'id'
   }

   beforeEach(() => {
      model = new ListViewModel(cfg);
      controller = new DndFlatController(model);
   });

   it('startDrag', () => {
      const entity = new ItemsEntity( { items: [1] } );
      const setDraggedItemsSpy = spy(controller, 'setDraggedItems');

      controller.startDrag(1, entity);

      assert.isTrue(setDraggedItemsSpy.withArgs(entity, model.getItemBySourceKey(1)).calledOnce);
   });
});