define([
   'Controls/_lookup/LookupMultiSelector/LookupView',
   'Types/entity',
   'Types/collection'
], function(LookupView, entity, collection) {
   function getItems(countItems) {
      for (var items = []; countItems; countItems--) {
         items.push(new entity.Model({
            rawData: {id: countItems},
            idProperty: 'id'
         }));
      }

      return new collection.List({
         items: items
      });
   }

   describe('Controls/_lookup/LookupMultiSelector/LookupView', function() {
      it('getAvailableWidthCollection', function() {
         var
            placeholderWidth = 35,
            fieldWrapperWidth = 145,
            lookupView = new LookupView();

         // Избавимся от работы с версткой
         LookupView._private.getPlaceholderWidth = function() {
            return placeholderWidth;
         };
         lookupView._getFieldWrapperWidth = function() {
            return  fieldWrapperWidth;
         };

         assert.equal(LookupView._private.getAvailableWidthCollection(lookupView, {
            items: getItems(3),
            maxVisibleItems: 3
         }), fieldWrapperWidth);
         assert.equal(LookupView._private.getAvailableWidthCollection(lookupView, {
            items: getItems(2),
            maxVisibleItems: 3
         }), fieldWrapperWidth - placeholderWidth);
      });

      it('_calculatingSizes', function() {
         var lookupView = new LookupView();

         lookupView._calculatingSizes({
            maxVisibleItems: 5,
            items: getItems(2)
         });
         assert.equal(lookupView._maxVisibleItems, 2);
         // Остальная часть проверяется в getAvailableWidthCollection
      });

      it('_isInputVisible', function() {
         var lookupView = new LookupView();

         lookupView._options.items = getItems(5);
         lookupView._options.maxVisibleItems = 5;
         assert.isFalse(lookupView._isInputVisible(lookupView._options));

         lookupView._options.maxVisibleItems = 6;
         assert.isTrue(lookupView._isInputVisible(lookupView._options));

         lookupView._options.readOnly = true;
         assert.isFalse(lookupView._isInputVisible(lookupView._options));
      });

      it('_isNeedUpdate', function() {
         var lookupView = new LookupView();

         assert.isTrue(lookupView._isNeedUpdate());

         lookupView._options.readOnly = true;
         assert.isFalse(lookupView._isNeedUpdate());
      });

      it('_isNeedCalculatingSizes', function() {
         var lookupView = new LookupView();

         assert.isFalse(lookupView._isNeedCalculatingSizes({
            items: getItems(0)
         }));

         assert.isTrue(lookupView._isNeedCalculatingSizes({
            items: getItems(5)
         }));

         assert.isFalse(lookupView._isNeedCalculatingSizes({
            items: getItems(5),
            readOnly: true
         }));
      });
   });
});