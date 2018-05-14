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

         loadItems: function(self, source) {
            self._sourceController = new SourceController({
               source: source
            });
            return self._sourceController.load().addCallback(function(items) {
               self._items = items;
               self._items.setIdProperty(self._options.keyProperty);
               return items;
            });
         },

         onResult: function(result) {
            _private._selectItem.apply(this, result.data);
            this._children.DropdownOpener.close();
            this._isOpen = false;
         },

         _selectItem: function(item) {
            this.selectedKeys = getPropValue(item, this._options.keyProperty);
            this._options.value = getPropValue(item, this._options.displayProperty);
            this._simpleViewModel.updateOptions({
               value: this._options.value
            });
            this._notify('valueChanged', [this._options.value]);
         }
      };

      var ComboBox = Control.extend({
         _template: template,
         _isOpen: false,

         constructor: function() {
            ComboBox.superclass.constructor.apply(this, arguments);

            this._onResult = _private.onResult.bind(this);
            this._close = this._close.bind(this);

            this._simpleViewModel = new BaseViewModel({});
         },

         _beforeMount: function(options) {
            return _private.loadItems(this, options.items);
         },

         _beforeUpdate: function() {
            this._simpleViewModel.updateOptions({
               value: this._options.value
            });
         },

         _dropdownOpenHandler: function() {
            if (!this._isOpen) {
               this._isOpen = true;
               var config = {
                  templateOptions: {
                     items: this._items,
                     selectedKeys: this.selectedKeys
                  },
                  target: this._children.Popup
               };
               this._children.DropdownOpener.open(config, this);
            } else {
               this._isOpen = false;
               this._children.DropdownOpener.close();
            }
         },

         _valueChangedHandler: function(e, value) {
            this._notify('valueChanged', [value]);
         },

         _close: function() {
            this._isOpen = false;
            this._forceUpdate();
         }

      });

      ComboBox.getDefaultOptions = function() {
         return {
            readOnly: true,
            placeholder: 'Выберите...'
         };
      };

      return ComboBox;
   });
