define('Controls/Input/ComboBox',
   [
      'Core/Control',
      'tmpl!Controls/Input/ComboBox/ComboBox',
      'Controls/Input/resources/InputRender/BaseViewModel',
      'Controls/Controllers/SourceController',
      'WS.Data/Utils',
      'css!Controls/Input/ComboBox/ComboBox'
   ],

   function(Control, template, BaseViewModel, SourceController, Utils) {

      /**
       * Control "ComboBox"
       * @class Controls/Input/ComboBox
       * @extends Core/Control
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/ISingleSelectable
       * @mixes Controls/Input/interface/IDropdownEmptyValue
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/Input/interface/IValidation
       * @mixes Controls/Input/interface/IInputTag
       * @control
       * @public
       * @category Input
       * @author Золотова Э.Е.
       */

      'use strict';

      var getPropValue = Utils.getItemPropertyValue.bind(Utils);

      var _private = {
         close: function() {
            this._isOpen = false;
            this._forceUpdate();
         }
      };

      var ComboBox = Control.extend({
         _template: template,
         _popupTarget: null,
         _isOpen: false,

         _beforeMount: function(options) {
            this._onClose = _private.close.bind(this);
            this._selectedKey = options.selectedKey;
            this._value = options.value;
            this._simpleViewModel = new BaseViewModel({
               value: this._value
            });
         },

         _afterMount: function() {
            this._popupTarget = this._container;
            this._corner = {
               vertical: 'bottom'
            };
            this._width = this._container.offsetWidth;
         },

         _mouseDownHandler: function() {
            this._isOpen = !this._isOpen;
         },

         _selectedItemChangedHandler: function(event, selectedItem) {
            this._value = getPropValue(selectedItem, this._options.displayProperty);
            this._simpleViewModel.updateOptions({
               value: this._value
            });
            this._notify('valueChanged', [this._value]);
            this._notify('selectedKeyChanged', [getPropValue(selectedItem, this._options.keyProperty)]);
            this._isOpen = false;
         }

      });

      ComboBox.getDefaultOptions = function() {
         return {
            editable: false,
            placeholder: 'Выберите...'
         };
      };

      return ComboBox;
   });
