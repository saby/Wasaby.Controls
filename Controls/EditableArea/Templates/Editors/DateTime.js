define('Controls/EditableArea/Templates/Editors/DateTime',
   [
      'Controls/EditableArea/Templates/Editors/Base'
   ],
   function(Base) {
      'use strict';

      var DateTime = Base.extend({
         _prepareValueForEditor: function(value) {
            return value.toLocaleDateString('ru-RU', {year: '2-digit', month: 'numeric', day: 'numeric'});
         }
      });

      return DateTime;
   }
);
