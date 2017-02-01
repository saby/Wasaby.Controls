define('js!SBIS3.CONTROLS.IListNavigation',
   [],
   function () {
      /**
       * Контроллер, позволяющий связывать компоненты осуществляя базовое взаимодейтсие между ними
       * @author Крайнов Дмитрий
       * @mixin SBIS3.CONTROLS.IListNavigation
       * @public
       */
      var ListNavigation = /** @lends SBIS3.CONTROLS.IListNavigation.prototype */{
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

         analizeResponceParams: function(dataset) {

         }

      };

      return ListNavigation;
   });
