define('js!SBIS3.CONTROLS.IFilterItem', function () {

   return {

      $protected: {
         _options: {
            filter: null
         }
      },

      setFilter: function() {
         throw new Error('Method must be implemented');
      },
      getFilter: function() {
         throw new Error('Method must be implemented');
      }
   };

});