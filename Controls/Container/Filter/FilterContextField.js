/**
 * Поле контекста в котором лежит фильтр раскладки.
 * А так же item'ы для быстрого фильтра и кнопки фильтров.
 * @author Герасимов Александр
 * @class Controls/Container/Filter/FilterContextField
 */
define('Controls/Container/Filter/FilterContextField', ['Core/DataContext'], function(DataContext) {
   'use strict';
      
   return DataContext.extend({
      filter: null,
      filterButtonItems: null,
      fastFilterItems: null,
      historyId: null,
         
      constructor: function(cfg) {
         this.filter = cfg.filter;
         this.filterButtonItems = cfg.filterButtonItems;
         this.fastFilterItems = cfg.fastFilterItems;
         this.historyId = cfg.historyId;
      }
   });
}
);
