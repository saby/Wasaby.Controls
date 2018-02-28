/**
 * Поле контекста в котором лежит фильтр раскладки.
 * @author Герасимов Александр
 * @class Controls/Layout/Filter/FilterContextField
 */
define('Controls/Layout/Filter/FilterContextField', ['Core/DataContext'], function(DataContext) {
      'use strict';
      
      return DataContext.extend({
         filter: {},
         
         constructor: function(filter) {
            this.filter = filter;
         }
      });
   }
);