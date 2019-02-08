define('Controls/Input/Search',
   [
      'Core/Control',
      'wml!Controls/Input/Search/Search',
      'Controls/Input/OldText/OldViewModel',
      'Core/constants',
      'css!theme?Controls/Input/Search/Search'
   ],

   function(Control, template, BaseViewModel, constants) {
      'use strict';

      /**
       * Controls that allows user to enter single-line text.
       * These are functionally identical to text inputs, but may be styled differently.
       *
       * <a href="/materials/demo-ws4-search-container">Demo with Input/Search and List control</a>.
       * <a href="/materials/demo-ws4-filter-search-new">Demo with Filter/Button, Input/Search and List control</a>.
       *
       * @class Controls/Input/Search
       * @mixes Controls/Input/interface/IInputField
       * @mixes Controls/Input/interface/IInputText
       * @mixes Controls/Input/interface/IInputBase
       * @mixes Controls/Input/interface/IPaste
       * @mixes Controls/Input/interface/IInputPlaceholder
       * @mixes Controls/interface/ITooltip
       *
       * @mixes Controls/Input/Search/Styles
       *
       * @control
       * @public
       * @demo Controls-demo/Input/Search/SearchPG
       *
       * @category Input
       * @author Золотова Э.Е.
       */

      /**
       * @event Controls/Input/Search#searchClick Occurs when search button is clicked.
       * @event Controls/Input/resetClick#resetClick Occurs when reset button is clicked.
       */

      var Search = Control.extend({
         _template: template,
         _isFocused: false,

         _beforeMount: function(options) {
            this._baseViewModel = new BaseViewModel({
               value: options.value,
               maxLength: options.maxLength,
               constraint: options.constraint
            });
         },

         _beforeUpdate: function(newOptions) {
            this._baseViewModel.updateOptions({
               value: newOptions.value,
               maxLength: newOptions.maxLength,
               constraint: newOptions.constraint
            });
         },

         _focusOutHandler: function() {
            var value = this._options.value || '';

            // TODO до перехода на новую схему инпутов, Максим делает в январе-феврале
            if (this._options.trim) {
               var trimmedValue = value.trim();

               if (trimmedValue !== value) {
                  this._baseViewModel.updateOptions({
                     value: trimmedValue,
                     maxLength: this._options.maxLength,
                     constraint: this._options.constraint
                  });
                  this._notifyOnValueChanged(trimmedValue);
               }
            }
         },

         _notifyOnValueChanged: function(value) {
            this._notify('valueChanged', [value]);
         },

         _valueChangedHandler: function(event, value) {
            this._notifyOnValueChanged(value);
         },

         _resetClick: function() {
            if (!this._options.readOnly) {
               // move focus from clear button to input
               this.activate();
               this._notify('resetClick');
               this._notifyOnValueChanged('');
            }
         },

         _searchClick: function() {
            if (!this._options.readOnly) {
               // move focus from search button to input
               this.activate();
               this._notify('searchClick');
            }
         },

         _keyUpHandler: function(event) {
            if (event.nativeEvent.which === constants.key.enter) {
               this._searchClick();
            }
         }

      });

      Search.getOptionTypes = function getOptionsTypes() {
         return {

            /* placeholder: types(String) вернуть проверку типов, когда будет поддержка проверки на 2 типа https://online.sbis.ru/opendoc.html?guid=00ca0ce3-d18f-4ceb-b98a-20a5dae21421 */
         };
      };

      Search.getDefaultOptions = function getDefaultOptions() {
         return {
            placeholder: rk('Найти') + '...',
            style: 'default',
            selectOnClick: false
         };
      };

      return Search;
   });
