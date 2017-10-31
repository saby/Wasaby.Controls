/**
 * Created by kraynovdo on 29.08.2017.
 */
define('js!Controls/List/Controllers/INavigation', [],
function() {
   /**
    *
    * @author Крайнов Дмитрий
    * @public
    */
   return {
      prepareSource: function() {

      },

      prepareQueryParams: function(projection, direction) {
         throw new Error('Method prepareQueryParams must be implemented');
      },

      calculateState: function(list, direction) {
         throw new Error('Method calculateState must be implemented');
      },

      hasMoreData: function(direction) {
         throw new Error('Method hasMoreData must be implemented');
      }
   };
});
