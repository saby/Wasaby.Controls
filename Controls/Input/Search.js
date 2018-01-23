define('Controls/Input/Search',
   [
      'Core/Control',
      'Core/helpers/Function/forAliveOnly',
      'WS.Data/Type/descriptor',
      'tmpl!Controls/Input/Search/Search',
      'Controls/Input/resources/InputRender/SimpleViewModel',
      'css!Controls/Input/Search/Search'
   ],

   function (Control, forAliveOnly, types, template, SimpleViewModel) {
      'use strict';

      /**
       * Строка поиска с кнопкой
       * @class Controls/Input/Search
       * @extends Controls/Input/Text
       * @mixes Controls/Input/interface/ISearch
       * @control
       * @public
       * @category Input
       */

      /**
       * @event Controls/Input/Search#search Происходит при нажатии на кнопку поиска
       */

      var Search = Control.extend({

         constructor: function (options) {
            Search.superclass.constructor.apply(this, arguments);
            this._simpleViewModel = new SimpleViewModel();
         },

         _valueChangedHandler: function (event, value) {
            this._notify('valueChanged', [value]);
            if (value) {
               if (String(value).length >= this._options.minSearchLength) {
                  this._startSearch(String(value));
               }
               else {
                  this._clearSearchDelay();
                  this._notify('reset');
               }
            }
         },

         _startSearch: function (text) {
            this._clearSearchDelay();
            this._searchDelay = setTimeout(forAliveOnly(function () {
               this._applySearch(text);
            }, this), this._options.searchDelay);
            this._notify('search');
         },

         //Сбросить таймер
         _clearSearchDelay: function () {
            if (this._searchDelay) {
               clearTimeout(this._searchDelay);
               this._searchDelay = null;
            }
         },

         //Собственно поиск
         _applySearch: function () {

            /* Если поиск запущен, то надо отменить поиск с задержкой */
            this._clearSearchDelay();
            this._notify('search');
         },

         _onResetClick: function () {
            this._clearSearchDelay();
            this._notify('valueChanged', ['']);
         },

         _onSearchClick: function () {
            this._applySearch();
         },

         _keyDownHandler: function (event) {
            if (event.nativeEvent.keyCode == 13) {
               this._applySearch();
            }
         },

         _template: template
      });

      Search.getOptionTypes = function getOptionsTypes() {
         return {
            minSearchLength: types(Number),
            searchDelay: types(Number)
         };
      };

      Search.getDefaultOptions = function getDefaultOptions() {
         return {
            minSearchLength: 3,
            searchDelay: 500
         };
      };

      return Search;
   });