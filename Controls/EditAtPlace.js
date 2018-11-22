define('Controls/EditAtPlace', [
   'Controls/EditableArea',
   'Core/IoC'
], function(
   EditableArea,
   IoC
) {
   'use strict';

   var _private = {
      beginEdit: function(self, event) {
         IoC.resolve('ILogger').warn('Событие beforeEdit компонента Controls/EditAtPlace было переименовано и будет удалено в версию 3.19.110. Используйте событие beforeBeginEdit компонента Controls/EditableArea.');
         EditAtPlace.superclass.beginEdit.call(self, event, self._notify('beforeEdit', [self._options.editObject], {
            bubbling: true
         }));
      }
   };

   var EditAtPlace = EditableArea.extend({
      _beforeMount: function() {
         IoC.resolve('ILogger').warn('Компонент Controls/EditAtPlace был перенесён и будет удалён в версию 3.19.110. Используйте компонент Controls/EditableArea.');
         EditAtPlace.superclass._beforeMount.apply(this, arguments);
      },

      startEdit: function(event) {
         _private.beginEdit(this, event);
      },

      beginEdit: function(event) {
         _private.beginEdit(this, event);
      }
   });

   return EditAtPlace;
});
