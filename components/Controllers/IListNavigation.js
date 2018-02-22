define('SBIS3.CONTROLS/Controllers/IListNavigation',
   [],
   function () {
      /**
       * Контроллер, позволяющий связывать компоненты осуществляя базовое взаимодейтсие между ними
       * @author Крайнов Д.О.
       * @mixin SBIS3.CONTROLS/Controllers/IListNavigation
       * @public
       */
      var ListNavigation = /** @lends SBIS3.CONTROLS/Controllers/IListNavigation.prototype */{
         $protected: {
            _options: {
               type: 'pages',
               config: {}
            }
         },

         $constructor: function() {

         },

         prepareQueryParams: function(projection, direction) {

         },

         analyzeResponseParams: function(dataset) {

         }

      };

      return ListNavigation;
   });
