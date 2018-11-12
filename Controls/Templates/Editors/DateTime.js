define('Controls/Templates/Editors/DateTime',
   [
      'Controls/Templates/Editors/Base'
   ],
   function(Base) {
      'use strict';

      var DateTime = Base.extend({
         _prepareValueForEditor: function(value) {
            return value.toLocaleDateString();
         }
      });

      return DateTime;
   }
);
