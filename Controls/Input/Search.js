define('Controls/Input/Search',
   [
      'Core/Control',
      'WS.Data/Type/descriptor',
      'tmpl!Controls/Input/Search/Search',
      'Controls/Input/resources/InputRender/SimpleViewModel',
      'css!Controls/Input/Search/Search'
   ],

   function (Control, types, template, SimpleViewModel) {
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
       * @event Controls/Input/Search#reset Происходит при нажатии на кнопку отмена (крестик)
       */

      var Search = Control.extend({
         _template: template,

         constructor: function (options) {
            Search.superclass.constructor.apply(this, arguments);
            this._simpleViewModel = new SimpleViewModel();
         },

         _valueChangedHandler: function (event, value) {
            this._notify('valueChanged', [value], {bubling: true});
         },

         //Собственно поиск
         _applySearch: function () {
            this._notify('search', {bubling: true});
         },

         _onResetClick: function () {
            this._notify('valueChanged', ['']);
            this._notify('reset', {bubling: true});
         },

         _onSearchClick: function () {
            this._applySearch();
         },

         _keyDownHandler: function (event) {
            if (event.nativeEvent.keyCode == 13) {
               this._applySearch();
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
            placeholder: rk('Найти')+'...'
         };
      };

      return Search;
   });