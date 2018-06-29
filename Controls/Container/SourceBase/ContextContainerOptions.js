/**
 * Context field for container options
 * @author Герасимов Александр
 * @class Controls/Container/ContextContainerOptions
 */
define('Controls/Container/SourceBase/ContextContainerOptions', ['Core/DataContext'], function(DataContext) {
   'use strict';
   
   return DataContext.extend({
      containerOptions: null,
      
      constructor: function(options) {
         for (var i in options) {
            if (options.hasOwnProperty(i)) {
               this[i] = options[i];
            }
         }
      }
   });
});
