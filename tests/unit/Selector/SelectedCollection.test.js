define(['Controls/Selector/SelectedCollection'], function(SelectedCollection) {
   var CLICKABLE_CLASS = 'controls-SelectedCollection__item__caption-clickable';

   describe('Controls/Selector/SelectedCollection', function() {
      if (typeof window === 'undefined') {
         // Кастыль, дабы избежать работы с версткой
         SelectedCollection._private.getCounterWidth = function(itemsCount, readOnly, itemsLayout) {
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
               _options: {},
               _onResult: function(){}
            };

         self._templateOptions = SelectedCollection._private.getTemplateOptions(self, {
            items: items
         });
         assert.deepEqual(self._templateOptions.items, items);

         // Проверка на то что список элементов не будет меняться по ссылке
         self._templateOptions.items.push(10);
         assert.notDeepEqual(self._templateOptions.items, items);

         // Проверка что items не будут перезаписаны, если не подверглись изменениям(self._options.items === newOptions.items)
         self._options.items = items;
         self._templateOptions.items = items2;
         self._templateOptions = SelectedCollection._private.getTemplateOptions(self, self._options);
         assert.deepEqual(self._templateOptions.items, items2);
      });

      it('isShowCounter', function() {
         assert.isFalse(SelectedCollection._private.isShowCounter(1, 2));
         assert.isFalse(SelectedCollection._private.isShowCounter(2, 2));
         assert.isTrue(SelectedCollection._private.isShowCounter(3, 2));

      });

      it('_afterMount', function() {
         var
            isUpdate = false,
            selectedCollection = new SelectedCollection();

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

      it('onResult', function() {
         var callCloseInfoBox = false;
         var selectedCollection = new SelectedCollection();
         var mouseEvent = {
            target: {
               classList: ['item-collection']
            }
         };

         selectedCollection._children.infoBox = {
            close: function() {
               callCloseInfoBox = true;
            }
         };

         SelectedCollection._private.onResult.call(selectedCollection, 'itemClick', null, mouseEvent);
         assert.isFalse(callCloseInfoBox);

         mouseEvent.target.classList.push(CLICKABLE_CLASS);
         SelectedCollection._private.onResult.call(selectedCollection, 'itemClick', null, mouseEvent);
         assert.isTrue(callCloseInfoBox);

         callCloseInfoBox = false;
         SelectedCollection._private.onResult.call(selectedCollection, 'crossClick', null, mouseEvent);
         assert.isFalse(callCloseInfoBox);
      });
   });
});