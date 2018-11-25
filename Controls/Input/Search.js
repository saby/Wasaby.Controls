define('Controls/Input/Search',
   [
      'Core/Control',
      'wml!Controls/Input/Search/Search',
      'Controls/Input/resources/InputRender/BaseViewModel',
      'Core/constants',
      'css!theme?Controls/Input/Search/Search'
   ],

   function(Control, template, BaseViewModel, constants) {
      'use strict';

      /**
       * Search input.
       *
       * <a href="/materials/demo-ws4-search-container">Demo with Input/Search and List control</a>.
       * <a href="/materials/demo-ws4-filter-search-new">Demo with Filter/Button, Input/Search and List control</a>.
       *
       * @class Controls/Input/Search
       * @extends Controls/Input/Text
       * @mixes Controls/Input/interface/ISearch
       * @control
       * @public
       * @category Input
       * @author Золотова Э.Е.
       */

      /**
       * @event Controls/Input/Search#search Occurs when search button is clicked.
       */

      /**
       * @name Controls/Input/Search#style
       * @cfg {String} Field style.
       * @variant default Gray field.
       * @variant header White field.
       */

      var Search = Control.extend({
         _template: template,
         _isFocused: false,

         _beforeMount: function(options) {
            this._baseViewModel = new BaseViewModel({
               value: options.value
            });
         },
   
         _beforeUpdate: function(newOptions) {
            this._baseViewModel.updateOptions({
               value: newOptions.value
            });
         },

         _notifyOnValueChanged: function(value) {
            this._notify('valueChanged', [value]);
         },

         _valueChangedHandler: function(event, value) {
            this._notifyOnValueChanged(value);
         },

         _resetClick: function() {
            //move focus from clear button to input
            this.activate();
            this._notify('resetClick');
            this._notifyOnValueChanged('');
         },

         _searchClick: function() {
            //move focus from search button to input
            this.activate();
            this._notify('searchClick');
         },
   
         _keyUpHandler: function(event) {
            if (event.nativeEvent.which === constants.key.enter) {
               this._searchClick();
            }
         }
         
      });

      Search.getOptionTypes = function getOptionsTypes() {
         return {

            /*placeholder: types(String) вернуть проверку типов, когда будет поддержка проверки на 2 типа https://online.sbis.ru/opendoc.html?guid=00ca0ce3-d18f-4ceb-b98a-20a5dae21421*/
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
