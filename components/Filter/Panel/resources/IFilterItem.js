define('SBIS3.CONTROLS/Filter/Panel/resources/IFilterItem', function () {

   return {

      $protected: {
         _options: {
            value: null,
            textValue: ''
         }
      },

      setValue: function() {
         throw new Error('Method must be implemented');
      },
      getValue: function() {
         throw new Error('Method must be implemented');
      },
      setTextValue: function() {
         throw new Error('Method must be implemented');
      },
      getTextValue: function() {
         throw new Error('Method must be implemented');
      }
   };

});