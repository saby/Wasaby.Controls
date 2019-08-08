define(['Controls/lookupPopup',
   'Types/entity',
   'Types/collection'
], function(lookupPopup, entity, collection) {

   describe('Controls/_lookupPopup/SelectedCollection/Popup', function() {
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
            scPopup = new lookupPopup.Collection();

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
            scPopup = new lookupPopup.Collection();

         scPopup._options.clickCallback = function(){};
         scPopup._notify = function(eventType) {
            if (eventType === 'close') {
               callCloseInfoBox = true;
            }
         };

         scPopup._itemClick();
         assert.isTrue(callCloseInfoBox);
      });
   });
});
