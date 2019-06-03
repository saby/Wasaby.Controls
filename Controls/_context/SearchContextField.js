
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
