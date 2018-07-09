define('Controls/Input/Dropdown',
   [
      'Core/Control',
      'tmpl!Controls/Input/Dropdown/Dropdown',
      'tmpl!Controls/Input/Dropdown/resources/defaultContentTemplate',
      'WS.Data/Utils',
      'WS.Data/Chain',
      'Controls/Input/Dropdown/Util',
      'css!Controls/Input/Dropdown/Dropdown'
   ],
   function(Control, template, defaultContentTemplate, Utils, Chain, dropdownUtils) {

      /**
       * Input for selection from the list of options.
       *
       * @class Controls/Input/Dropdown
       * @extends Core/Control
       * @mixes Controls/interface/ISource
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/interface/ISingleSelectable
       * @mixes Controls/Input/interface/IDropdownEmptyText
       * @control
       * @public
       * @category Input
       * @demo Controls-demo/Dropdown/MenuVdom
       */

      'use strict';

      var getPropValue = Utils.getItemPropertyValue.bind(Utils);

      var _private = {
         getSelectedKeys: function(items, keyProperty) {
            var keys = [];
            Chain(items).each(function(item) {
               keys.push(getPropValue(item, keyProperty));
            });
            return keys;
         }
      };

      var DropdownList = Control.extend({
         _template: template,
         _defaultContentTemplate: defaultContentTemplate,
         _text: '',

         _selectedItemsChangedHandler: function(event, items) {
            this._isEmptyItem = getPropValue(items[0], this._options.keyProperty) === null;
            if (this._isEmptyItem) {
               this._text = dropdownUtils.prepareEmpty(this._options.emptyText);
            } else {
               this._text = getPropValue(items[0], this._options.displayProperty || 'title');
            }

            if (items.length > 1) {
               this._text += ' и еще' + (items.length - 1);
            }
            this._icon = items[0].get('icon');
            this._notify('selectedKeysChanged', [_private.getSelectedKeys(items, this._options.keyProperty)]);
         }
      });

      return DropdownList;
   }
);
