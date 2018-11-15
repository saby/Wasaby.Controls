define('Controls/EditableArea/Templates/Editors/Base', [
   'Core/IoC',
   'Controls/EditableArea/Templates/Editors/Base'
], function(IoC, Control) {
   'use strict';

   var EditAtPlaceTemplate = Control.extend({
      constructor: function() {
         IoC.resolve('ILogger').warn('Controls/EditableArea/Templates/Editors/Base', 'Контрол перенесен, используйте Controls/EditableArea/Templates/Editors/Base.');
         EditAtPlaceTemplate.superclass.constructor.apply(this, arguments);
      }
   });

   return EditAtPlaceTemplate;
});
