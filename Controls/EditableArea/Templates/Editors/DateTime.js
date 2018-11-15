define('Controls/EditableArea/Templates/Editors/DateTime',
   [
      'Controls/EditableArea/Templates/Editors/Base'
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
