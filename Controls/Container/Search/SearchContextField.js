/**
 * Context field for search value
 * @author Герасимов Александр
 * @class Controls/Container/Search/SearchContextField
 */
define('Controls/Container/Search/SearchContextField', ['Core/DataContext'], function(DataContext) {
   'use strict';
      
   return DataContext.extend({
      searchValue: '',
         
      constructor: function(searchValue) {
         this.searchValue = searchValue;
      }
   });
}
);
