define('Controls/EditAtPlace', [
   'Controls/editableArea',
   'Env/Env'
], function(
   editableArea,
   Env
) {
   'use strict';
   /* eslint-disable */
   var _private = {
      beginEdit: function(self, event) {
         Env.IoC.resolve('ILogger').warn('Событие beforeEdit компонента Controls/EditAtPlace было переименовано и будет удалено в версию 3.19.110. Используйте событие beforeBeginEdit компонента Controls/editableArea:View.');
         EditAtPlace.superclass.beginEdit.call(self, event, self._notify('beforeEdit', [self._options.editObject], {
            bubbling: true
         }));
      }
   };

   var EditAtPlace = editableArea.View.extend({
      _beforeMount: function() {
         Env.IoC.resolve('ILogger').warn('Компонент Controls/EditAtPlace был перенесён и будет удалён в версию 3.19.110. Используйте компонент Controls/editableArea:View.');
         EditAtPlace.superclass._beforeMount.apply(this, arguments);
      },

      startEdit: function(event) {
         _private.beginEdit(this, event);
      },

      beginEdit: function(event) {
         _private.beginEdit(this, event);
      }
   });
   /* eslint-enable */
   return EditAtPlace;
});
