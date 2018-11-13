define('Controls/EditAtPlace/EditAtPlaceTemplate', [
   'Core/IoC',
   'Controls/Templates/Editors/Base'
], function(IoC, Control) {
   'use strict';

   var EditAtPlaceTemplate = Control.extend({
      constructor: function() {
         IoC.resolve('ILogger').warn('Controls/EditAtPlace/EditAtPlaceTemplate', 'Контрол еренесен, используйте Controls/Templates/Editors/Base.');
         EditAtPlaceTemplate.superclass.constructor.apply(this, arguments);
      }
   });

   return EditAtPlaceTemplate;
});
