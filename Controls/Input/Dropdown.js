define('Controls/Input/Dropdown',
   [
      'Core/Control',
      'tmpl!Controls/Input/Dropdown/Dropdown',
      'tmpl!Controls/Input/Dropdown/resources/defaultContentTemplate',
      'WS.Data/Utils',
      'css!Controls/Input/Dropdown/Dropdown'
   ],
   function(Control, template, defaultContentTemplate, Utils) {

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

      var getPropValue = Utils.getItemPropertyValue.bind(Utils);

      var DropdownList = Control.extend({
         _template: template,
         _defaultContentTemplate: defaultContentTemplate,
         _text: '',

         _afterMount: function() {
            this._popupTarget = this._children.popupTarget;
         },

         _selectedItemChangedHandler: function(event, item) {
            this._text = getPropValue(item, this._options.displayProperty || 'title');
            this._icon = item.get('icon');
            this._notify('selectedKeysChanged', [getPropValue(item, this._options.keyProperty)]);
         }
      });

      return DropdownList;
   }
);
