/**
 * Context field for container options
 * @author Герасимов Александр
 * @class Controls/Container/ContextContainerOptions
 */
define('Controls/Container/Data/ContextOptions', ['Core/DataContext'], function(DataContext) {
   'use strict';
   
   return DataContext.extend({
      constructor: function(options) {
         for (var i in options) {
            if (options.hasOwnProperty(i)) {
               this[i] = options[i];
            }
         }
      }
   });
});
