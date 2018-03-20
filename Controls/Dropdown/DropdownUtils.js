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
         if (instance._items.getIdProperty()) {
            instance._selectedItem = instance._items.getRecordById(selectedKeys);
            instance._icon = instance._selectedItem.get('icon');
         }
      }

      function loadItems(instance, source, selectedKeys) {
         instance._sourceController = new SourceController({
            source: source
         });
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

      function _updateText(item, displayProperty) {
         return getText([item], displayProperty); //По стандарту если есть иконка - текст не отображается
      }

      // function _open() {
      //    var config = {
      //       componentOptions: {
      //          items: this._items
      //       },
      //       target: this._children.popupTarget
      //    };
      //    this._children.DropdownOpener.open(config, this);
      // }
      //
      // function _onResult(args) {
      //    var actionName = args[0];
      //    var event = args[1];
      //    var data = args[2];
      //    switch (actionName) {
      //       case 'itemClick':
      //          this._selectItem.apply(this, data);
      //          this._children.DropdownOpener.close();
      //          break;
      //       case 'footerClick':
      //          this._notify('footerClick', [event]);
      //    }
      // }
      //
      // function _selectItem(item) {
      //    var key = item.get(this._options.keyProperty);
      //    this._notify('selectedKeysChanged', [key]);
      // }

      return {
         _beforeMount: _beforeMount,
         _beforeUpdate: _beforeUpdate,
         _updateText: _updateText,
         _loadItems: loadItems
      };
   }
);