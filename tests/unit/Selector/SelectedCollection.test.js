define(['Controls/lookup'], function(scroll) {
   describe('"Controls/_lookup/SelectedCollection', function() {
      if (typeof window === 'undefined') {
         // Кастыль, дабы избежать работы с версткой
         scroll.Collection._private.getCounterWidth = function(itemsCount, readOnly, itemsLayout) {
            // in mode read only and single line, counter does not affect the collection
            if (readOnly && itemsLayout === 'oneRow') {
               return 0;
            }

            return itemsCount * 10;
         }
      }

      it('getTemplateOptions', function() {
         var
            items = [1, 2, 3, 4],
            items2 = [1, 5, 7],
            self = {
               _options: {
                  items: items
               },
               _onResult: function(){}
            };

         self._templateOptions = scroll.Collection._private.getTemplateOptions(self);
         assert.deepEqual(self._templateOptions.items, items);

         // Проверка на то что список элементов не будет меняться по ссылке
         self._templateOptions.items.push(10);
         assert.notDeepEqual(self._templateOptions.items, items);
      });

      it('isShowCounter', function() {
         assert.isFalse(scroll.Collection._private.isShowCounter(1, 2));
         assert.isFalse(scroll.Collection._private.isShowCounter(2, 2));
         assert.isTrue(scroll.Collection._private.isShowCounter(3, 2));

      });

      it('_afterMount', function() {
         var
            isUpdate = false,
            selectedCollection = new scroll.Collection();

         selectedCollection._counterWidth = 0;
         selectedCollection._items = ['test', 7, 2];
         selectedCollection._options.maxVisibleItems = 5;
         selectedCollection._forceUpdate = function() {
            isUpdate = true;
         };

         selectedCollection._afterMount();
         assert.equal(selectedCollection._counterWidth, 0);
         assert.isFalse(isUpdate);

         selectedCollection._options.maxVisibleItems = 2;
         selectedCollection._afterMount();
         assert.notEqual(selectedCollection._counterWidth, 0);
         assert.isTrue(isUpdate);
      });
   });
});
