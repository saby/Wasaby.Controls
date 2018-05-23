define('Controls/Input/Dropdown',
   [
      'Core/Control',
      'tmpl!Controls/Input/Dropdown/Dropdown',
      'tmpl!Controls/Input/Dropdown/resources/defaultContentTemplate',
      'Controls/Controllers/SourceController',
      'Controls/Input/Dropdown/Util',
      'css!Controls/Input/Dropdown/Dropdown'
   ],
   function(Control, template, defaultContentTemplate, SourceController, dropdownUtil) {

      /**
       * Input for selection from the list of options.
       *
       * @class Controls/Input/Dropdown
       * @extends Core/Control
       * @mixes Controls/interface/ISource
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/interface/ISingleSelectable
       * @mixes Controls/Input/interface/IDropdownEmptyValue
       * @control
       * @public
       * @category Input
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
         }
      };

      var DropdownList = Control.extend({
         _template: template,
         _defaultContentTemplate: defaultContentTemplate,
         constructor: function(config) {
            DropdownList.superclass.constructor.apply(this, arguments);
            this._onResult = this._onResult.bind(this);
         },
         _beforeMount: function(options, context, receivedState) {
            if (receivedState) {
               this._items = receivedState;
               _private.updateSelectedItem(this, options.selectedKeys);
            } else {
               if (options.source) {
                  return _private.loadItems(this, options.source, options.selectedKeys);
               }
            }
         },
         _beforeUpdate: function(newOptions) {
            if (newOptions.selectedKeys && newOptions.selectedKeys !== this._options.selectedKeys) {
               _private.updateSelectedItem(this, newOptions.selectedKeys);
            }
            if (newOptions.source && newOptions.source !== this._options.source) {
               return _private.loadItems(this, newOptions.source, newOptions.selectedKeys);
            }
         },
         _updateText: function(item, displayProperty) {
            return _private.getText([item], displayProperty); //По стандарту если есть иконка - текст не отображается
         },
         _open: function() {
            dropdownUtil.open(this, this._children.popupTarget);
         },
         _onResult: function(result) {
            switch (result.action) {
               case 'itemClick':
                  this._selectItem.apply(this, result.data);
                  this._children.DropdownOpener.close();
                  break;
               case 'footerClick':
                  this._notify('footerClick', [result.event]);
            }
         },
         _selectItem: function(item) {
            var key = item.get(this._options.keyProperty);
            this._notify('selectedKeysChanged', [key]);
         }
      });

      return DropdownList;
   }
);
