define('Controls/Container/MassSelector/CallbacksContextField', [
   'Core/DataContext'
], function(DataContext) {
   'use strict';

   return DataContext.extend({
      itemsReadyCallback: null,

      constructor: function(itemsReadyCallback) {
         this.itemsReadyCallback = itemsReadyCallback;
      }
   });
});
