define(['Controls/lookup', 'Types/entity'], function(lookup, entity) {
   describe('"Controls/_lookup/SelectedCollection', function() {
      if (typeof window === 'undefined') {
         // Кастыль, дабы избежать работы с версткой
         lookup.Collection._private.getCounterWidth = function(itemsCount, readOnly, itemsLayout) {
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

         self._templateOptions = lookup.Collection._private.getTemplateOptions(self);
         assert.deepEqual(self._templateOptions.items, items);

         // Проверка на то что список элементов не будет меняться по ссылке
         self._templateOptions.items.push(10);
         assert.notDeepEqual(self._templateOptions.items, items);
      });

      it('isShowCounter', function() {
         assert.isFalse(lookup.Collection._private.isShowCounter(1, 2));
         assert.isFalse(lookup.Collection._private.isShowCounter(2, 2));
         assert.isTrue(lookup.Collection._private.isShowCounter(3, 2));

      });

      it('_afterMount', function() {
         var
            isUpdate = false,
            selectedCollection = new lookup.Collection();

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

      it('_itemClick', function() {
         var sandbox = sinon.createSandbox();
         var propagationStopped = false;
         var selectedCollection = new lookup.Collection();
         var model = new entity.Model({
            rawData: {
               id: 'test',
            },
            keyProperty: 'id'
         });
         var currentSelector;
         var event = {
            target: {
               closest: function(cssSelector) {
                  return cssSelector === currentSelector;
               }
            },
            stopPropagation: function() {
               propagationStopped = true;
            }
         };

         sandbox.stub(selectedCollection, '_notify');

         currentSelector = '.js-controls-SelectedCollection__item__caption';
         selectedCollection._itemClick(event, model);
         sinon.assert.calledWith(selectedCollection._notify, 'itemClick', [model]);
         assert.isTrue(propagationStopped);

         currentSelector = '.js-controls-SelectedCollection__item__cross';
         selectedCollection._itemClick(event, model);
         sinon.assert.calledWith(selectedCollection._notify, 'crossClick', [model]);
         assert.isTrue(propagationStopped);

         sandbox.restore();
      });
   });
});
