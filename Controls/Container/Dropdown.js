define('Controls/Container/Dropdown',
   [
      'Core/Control',
      'tmpl!Controls/Container/Dropdown/Dropdown',
      'tmpl!Controls/Input/Dropdown/resources/defaultContentTemplate',
      'Controls/Controllers/SourceController'
   ],

   function(Control, template, defaultContentTemplate, SourceController) {

      /**
          * Container for dropdown lists
          *
          * @class Controls/Container/Dropdown
          * @extends Core/Control
          * @author Золотова Элина
          * @control
          * @public
          */

      'use strict';

      var _private = {
         getText: function(selectedItems) {
            var text = selectedItems[0].get('title');

            // if (selectedItems.length > 1) {
            //    text += ' и еще' + (selectedItems.length - 1)
            // }
            return text;
         },

         loadItems: function(instance, source, selectedKeys) {
            instance._sourceController = new SourceController({
               source: source
            });
            return instance._sourceController.load().addCallback(function(items) {
               instance._items = items;
               _private.updateSelectedItem(instance, selectedKeys);
               return items;
            });
         },

         updateSelectedItem: function(instance, selectedKeys) {
            instance._selectedItem = instance._items.getRecordById(selectedKeys);
            instance._icon = instance._selectedItem.get('icon');
         },

         onResult: function(result) {
            switch (result.action) {
               case 'itemClick':
                  _private.selectItem.apply(this, result.data);
                  this._children.DropdownOpener.close();
                  break;
               case 'footerClick':
                  this._notify('footerClick', [result.event]);
            }
         },

         selectItem: function(item) {
            this._isOpen = false;
            var key = item.get(this._options.keyProperty);
            this._notify('selectedKeysChanged', [key]);
            this._notify('selectedItemChanged', [item]);
         }
      };

      var Dropdown = Control.extend({
         _template: template,
         _defaultContentTemplate: defaultContentTemplate,
         _isOpen: false,

         _beforeMount: function(options, context, receivedState) {
            this._onResult = _private.onResult.bind(this);
            if (receivedState) {
               this._items = receivedState;
               _private.updateSelectedItem(this, options.selectedKeys);
            } else {
               if (options.source) {
                  return _private.loadItems(this, options.source, options.selectedKeys);
               }
            }
         },

         _afterMount: function() {
            this._notify('selectedItemChanged', [this._selectedItem]);
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.selectedKeys && newOptions.selectedKeys !== this._options.selectedKeys) {
               _private.updateSelectedItem(this, newOptions.selectedKeys);
            }
            if (newOptions.source && newOptions.source !== this._options.source) {
               return _private.loadItems(this, newOptions.source, newOptions.selectedKeys);
            }
         },

         _open: function() {
            this._isOpen = true;
            var config = {
               templateOptions: {
                  items: this._items,
                  defaultItemTemplate: this._defaultItemTemplate,
                  width: this._options.width ? this._options.width : undefined
               },
               target: this._options.popupTarget,
               corner: this._options.corner
            };
            this._children.DropdownOpener.open(config, this);
         }
      });

      return Dropdown;
   });
