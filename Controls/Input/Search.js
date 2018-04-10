define('Controls/Input/Search',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'tmpl!Controls/Input/Search/Search',
      'Controls/Input/resources/InputRender/BaseViewModel',
      'css!Controls/Input/Search/Search'
   ],

   function(Control, types, template, BaseViewModel) {
      'use strict';

      /**
       * Строка поиска с кнопкой
       * @class Controls/Input/Search
       * @extends Controls/Input/Text
       * @mixes Controls/Input/interface/ISearch
       * @control
       * @public
       * @category Input
       * @author Золотова Э.Е.
       */

      /**
       * @event Controls/Input/Search#search Происходит при нажатии на кнопку поиска
       */

      /**
       * @name Controls/Input/Search#style
       * @cfg {String} Цвет поля поиска
       * @variant default Серое поле поиска
       * @variant header Белое поле поиска
       */

      var Search = Control.extend({
         _template: template,
         _isFocused: false,

         constructor: function(options) {
            Search.superclass.constructor.apply(this, arguments);
            this._baseViewModel = new BaseViewModel();
         },
   
         _beforeUpdate: function(newOptions) {
            this._baseViewModel.updateOptions({
               value: newOptions.value
            });
         },

         _notifyOnValueChanged: function(value) {
            this._notify('valueChanged', [value]);
            this._applySearch(value);
         },

         _valueChangedHandler: function(event, value) {
            this._notifyOnValueChanged(value);
         },

         //Собственно поиск
         _applySearch: function(value) {
            this._notify('search', [value]);
         },

         _onResetClick: function() {
            this._notifyOnValueChanged('');
         },

         _onSearchClick: function() {
            this._applySearch(this._options.value);
         },

         _keyDownHandler: function(event) {
            if (event.nativeEvent.keyCode == 13) {
               this._applySearch(this._options.value);
            }
         }
      });

      Search.getOptionTypes = function getOptionsTypes() {
         return {
            placeholder: types(String)
         };
      };

      Search.getDefaultOptions = function getDefaultOptions() {
         return {
            placeholder: rk('Найти') + '...',
            style: 'default'
         };
      };

      return Search;
   });
