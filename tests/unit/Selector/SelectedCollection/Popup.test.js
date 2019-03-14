define(['Controls/Selector/SelectedCollection/Popup',
   'Types/entity',
   'Types/collection'
], function(SelectedCollectionPopup, entity, collection) {

   var CLICKABLE_CLASS = 'controls-SelectedCollection__item__caption-clickable';

   describe('Controls/Selector/SelectedCollection/Popup', function() {
      it('_crossClick', function() {
         var
            item = new entity.Model({
               rawData: {id: 1},
               idProperty: 'id'
            }),
            item2 = new entity.Model({
               rawData: {id: 2},
               idProperty: 'id'
            }),
            scPopup = new SelectedCollectionPopup();

         scPopup._options.clickCallback = function(){};
         scPopup._items = new collection.List({
            items: [item, item2]
         });

         scPopup._crossClick(null, item);
         assert.equal(scPopup._items.at(0), item2);
         assert.equal(scPopup._items.getCount(), 1);

         scPopup._crossClick(null, item2);
         assert.equal(scPopup._items.getCount(), 0);
      });

      it('_itemClick', function() {
         var
            callCloseInfoBox = false,
            scPopup = new SelectedCollectionPopup(),
            mouseEvent = {
               target: {
                  classList: ['item-collection']
               }
            };

         scPopup._notify = function(eventType) {
            if (eventType === 'close') {
               callCloseInfoBox = true;
            }
         };

         scPopup._itemClick(null, null, mouseEvent);
         assert.isFalse(callCloseInfoBox);

         mouseEvent.target.classList.push(CLICKABLE_CLASS);
         scPopup._itemClick(null, null, mouseEvent);
         assert.isTrue(callCloseInfoBox);
      });
   });
});
