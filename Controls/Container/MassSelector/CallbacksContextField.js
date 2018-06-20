define('Controls/Container/MassSelector/CallbacksContextField', [
   'Core/DataContext'
], function(DataContext) {
   'use strict';

   return DataContext.extend({
      itemsReadyCallback: null,
      selectionCallback: null,

      constructor: function(itemsReadyCallback, selectionCallback) {
         this.itemsReadyCallback = itemsReadyCallback;
         this.selectionCallback = selectionCallback;
      }
   });
});
