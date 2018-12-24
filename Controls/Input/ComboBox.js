define('Controls/Input/ComboBox',
   [
      'Core/Control',
      'wml!Controls/Input/ComboBox/ComboBox',
      'Controls/Input/resources/InputRender/BaseViewModel',
      'WS.Data/Utils',
      'Controls/Dropdown/Util',
      'Controls/Utils/tmplNotify',
      'css!theme?Controls/Input/ComboBox/ComboBox'
   ],

   function(Control, template, BaseViewModel, Utils, dropdownUtils, tmplNotify) {
      /**
       * Control "ComboBox"
       * @class Controls/Input/ComboBox
       * @extends Core/Control
       * @mixes Controls/interface/ISource
       * @mixes Controls/interface/IItemTemplate
       * @mixes Controls/interface/ISingleSelectable
       * @mixes Controls/Input/interface/IDropdownEmptyText
       * @mixes Controls/Input/interface/IInputDropdown
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/interface/IDropdown
       * @css @margin-top_ComboBox-popup Offset on the top for pop-up.
       * @control
       * @public
       * @category Input
       * @author Золотова Э.Е.
       * @demo Controls-demo/Input/ComboBox/ComboBox
       * @demo Controls-demo/Combobox/ComboboxVDom
       */

      /**
       * @name Controls/Input/Dropdown#contentTemplate
       * @cfg {Function} Template that will be render calling element.
       */

      'use strict';

      var getPropValue = Utils.getItemPropertyValue.bind(Utils);

      var _private = {
         popupVisibilityChanged: function(state) {
            this._isOpen = state;
            this._forceUpdate();
         }
      };

      var ComboBox = Control.extend({
         _template: template,
         _isOpen: false,
         _notifyHandler: tmplNotify,

         _beforeMount: function(options) {
            this._onClose = _private.popupVisibilityChanged.bind(this, false);
            this._onOpen = _private.popupVisibilityChanged.bind(this, true);
            this._placeholder = options.placeholder;
            this._value = options.value;
            this._simpleViewModel = new BaseViewModel({
               value: this._value
            });
            this._setText = this._setText.bind(this);
         },

         _afterMount: function() {
            this._corner = {
               vertical: 'bottom'
            };
            this._width = this._container.offsetWidth;
            this._forceUpdate();
         },

         _beforeUpdate: function() {
            if (this._width !== this._container.offsetWidth) {
               this._width = this._container.offsetWidth;
            }
         },

         _selectedItemsChangedHandler: function(event, selectedItems) {
            var key = getPropValue(selectedItems[0], this._options.keyProperty);
            this._setText(selectedItems);
            this._notify('valueChanged', [this._value]);
            this._notify('selectedKeyChanged', [key]);
            this._isOpen = false;
         },

         _setText: function(selectedItems) {
            this._isEmptyItem = getPropValue(selectedItems[0], this._options.keyProperty) === null || selectedItems[0] === null;
            if (this._isEmptyItem) {
               this._value = '';
               this._placeholder = dropdownUtils.prepareEmpty(this._options.emptyText);
            } else {
               this._value = getPropValue(selectedItems[0], this._options.displayProperty);
               this._placeholder = this._options.placeholder;
            }
            this._simpleViewModel.updateOptions({
               value: this._value
            });
         }

      });

      ComboBox.getDefaultOptions = function() {
         return {
            placeholder: rk('Выберите...')
         };
      };

      ComboBox._private = _private;

      return ComboBox;
   });
