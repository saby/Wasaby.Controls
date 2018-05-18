/**
 * Context field for Suggest options
 */
define('Controls/Layout/Suggest/_SuggestOptionsField', ['Core/DataContext'], function(DataContext) {
   
   'use strict';
      
      return DataContext.extend({
         constructor: function(options) {
            this.options = options;
         }
      });
   }
);
