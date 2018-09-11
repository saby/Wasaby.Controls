define('Controls/Popup/PopupContext', ['Core/DataContext'], function(DataContext) {
   'use strict';

   return DataContext.extend({
      constructor: function(cfg) {
         for (var i in cfg) {
            if (cfg.hasOwnProperty(i)) {
               this[i] = cfg[i];
            }
         }
      }
   });
});
