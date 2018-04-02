define('Controls/Dropdown/DropdownUtils',
   [
      'Controls/Controllers/SourceController'
   ],
   function (SourceController) {
      'use strict';

      function getText(selectedItems) {
         var text = selectedItems[0].get('title');
         // if (selectedItems.length > 1) {
         //    text += ' и еще' + (selectedItems.length - 1)
         // }
         return text;
      }

      function updateSelectedItem(instance, selectedKeys) {
         if (instance._items.getIdProperty() && selectedKeys) {
            instance._selectedItem = instance._items.getRecordById(selectedKeys);
            instance._icon = instance._selectedItem.get('icon');
         }
      }

      function loadItems(instance, sourceControllerConfig, selectedKeys) {
         instance._sourceController = new SourceController(sourceControllerConfig);
         return instance._sourceController.load().addCallback(function (items) {
            instance._items = items;
            updateSelectedItem(instance, selectedKeys);
            return items;
         });
      }

      function _beforeMount(self, source, selectedKeys, receivedState) {
         if (receivedState) {
            self._items = receivedState;
         }
         else {
            if (source) {
               return loadItems(self, source, selectedKeys);
            }
         }
      }

      function _beforeUpdate(self, newOptions) {
         if (newOptions.selectedKeys && newOptions.selectedKeys !== self._options.selectedKeys) {
            updateSelectedItem(self, newOptions.selectedKeys);
         }
         if (newOptions.source && newOptions.source !== self._options.source) {
            return loadItems(self, newOptions.source, newOptions.selectedKeys);
         }
      }

      function updateText(item, displayProperty) {
         return getText([item], displayProperty); //По стандарту если есть иконка - текст не отображается
      }

      return {
         beforeMount: _beforeMount,
         beforeUpdate: _beforeUpdate,
         updateText: updateText,
         loadItems: loadItems
      };
   }
);