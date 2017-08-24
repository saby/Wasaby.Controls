define('js!WSControls/Lists/Controllers/PageNavigation',
   ['Core/Abstract'],
   function (Abstract) {
      /**
       *
       * @author Крайнов Дмитрий
       * @public
       */
      var PageNavigation = Abstract.extend({

         constructor: function(cfg) {

         },

         prepareQueryParams: function(projection, direction) {

         },

         analyzeResponseParams: function(list, direction) {

         },

         hasMoreData: function(direction) {

         }

      });

      return PageNavigation;
   });
