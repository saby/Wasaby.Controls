/**
 * Context field for filter panel options
 */
define('Controls/Filter/Button/Panel/Wrapper/_FilterPanelOptions', ['Core/DataContext'], function(DataContext) {

   'use strict';

   return DataContext.extend({
      constructor: function(options) {
         this.options = options;
      }
   });
});
