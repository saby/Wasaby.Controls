define(
   [
      'Controls/Popup/Manager/Container',
      'WS.Data/Collection/List',
      'Core/helpers/random-helpers'
   ],

   function (Container, List, Random) {
      'use strict';
      describe('Controls/Popup/Manager/Container', function () {
         var
            id,
            items = new List(),
            popupContainer = new Container();

         it('add popupItem', function(){
            id = Random.randomId('popup-');
            items.add({
               id: id,
               popupOptions: {}
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
      });
   }
);