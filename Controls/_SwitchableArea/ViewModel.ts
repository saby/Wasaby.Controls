define('Controls/SwitchableArea/ViewModel', [
   'Core/core-simpleExtend',
   'Types/chain',
   'Core/core-clone'
],
function(
   SimpleExtend,
   chain,
   cClone
) {
   'use strict';

   var _private = {
      updateLoadStatus: function(selectedKey, self) {
         self._items.find(function(item) {
            return selectedKey === item.id || selectedKey === item.key;
         }).loaded = true;
      },

      updateItems: function(items, self) {
         var loadedItems = [];

         // TODO https://online.sbis.ru/opendoc.html?guid=c206e7a9-9d96-4a20-b386-d44d0f8ef4dc. Запоминаем все загруженные вкладки
         if (self._items) {
            chain.factory(self._items).each(function(item) {
               if (item.get) {
                  if (item.get('loaded')) {
                     loadedItems.push(item.get('id') || item.get('key'));
                  }
               } else {
                  if (item.loaded) {
                     loadedItems.push(item.id || item.key);
                  }
               }
            });
         }

         self._items = cClone(items);

         // TODO https://online.sbis.ru/opendoc.html?guid=c206e7a9-9d96-4a20-b386-d44d0f8ef4dc. Восстанавливаем все загруженные вкладки
         chain.factory(self._items).each(function(item) {
            if (item.get) {
               if (loadedItems.indexOf(item.get('id') || item.get('key')) > -1) {
                  item.set('loaded', true);
               }
            } else {
               if (loadedItems.indexOf(item.id || item.key) > -1) {
                  item.loaded = true;
               }
            }
         });

      }
   };

   var ViewModel = SimpleExtend.extend({
      constructor: function(items, selectedKey) {
         ViewModel.superclass.constructor.apply(this, arguments);
         _private.updateItems(items, this);
         _private.updateLoadStatus(selectedKey, this);
      },
      updateSelectedKey: function(selectedKey) {
         _private.updateLoadStatus(selectedKey, this);
      },
      updateItems: function(items) {
         _private.updateItems(items, this);
      }
   });

   return ViewModel;
});
