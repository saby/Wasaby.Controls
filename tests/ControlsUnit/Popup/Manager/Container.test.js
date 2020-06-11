define(
   [
      'Controls/popup',
      'Types/collection',
      'Core/helpers/Number/randomId'
   ],

   function (popupMod, collection, randomId) {
      'use strict';
      describe('Controls/_popup/Manager/Container', function () {
         var
            id,
            items = new collection.List(),
            popupContainer = new popupMod.Container();

         it('add popupItem', function(){
            id = randomId('popup-');
            items.add({
               id: id,
               popupOptions: {},
               controller: {}
            });
            popupContainer.setPopupItems(items);
            assert.equal(popupContainer._popupItems.getCount(), 1);
         });

         it('set overlay', function(){
            popupContainer.setOverlay(3);
            assert.equal(popupContainer._overlayId, 3);
         });

         it('remove popupItem', function(){
            items.removeAt(0);
            popupContainer.setPopupItems(items);
            assert.equal(popupContainer._popupItems.getCount(), 0);
         });

         it('getItems', () => {
            const Container = new popupMod.Container();
            const list = new collection.List();
            const getItem = (popupId, TYPE) => {
               return {
                  id: popupId,
                  controller: {
                     TYPE
                  }
               };
            };
            list.add(getItem(0, 'InfoBox'));
            list.add(getItem(1, 'Stack'));
            list.add(getItem(2, 'Dialog'));
            list.add(getItem(3, 'Sticky'));
            list.add(getItem(4, 'Stack'));
            list.add(getItem(5, 'Dialog'));

            const containerItems = Container._getItems(list);
            const order = [5, 4, 2, 1, 0, 3];
            const containerOrder = [];
            containerItems.each((element) => {
               containerOrder.push(element.id);
            });
            assert.deepEqual(order, containerOrder);
            Container.destroy();
         });
      });
   }
);
