/**
 * Поле контекста в котором лежит значения поиска в раскладке.
 * @author Герасимов Александр
 * @class Controls/Layout/Search/SearchContextField
 */
define('Controls/Layout/Search/SearchContextField', ['Core/DataContext'], function(DataContext) {
      'use strict';
      
      return DataContext.extend({
         searchValue: '',
         
         constructor: function(searchValue) {
            this.searchValue = searchValue;
         }
      });
   }
);