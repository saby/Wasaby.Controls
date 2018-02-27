define('Controls-demo/Input/VDomInputs', [
   'Core/Control',
   'tmpl!Controls-demo/Input/VDomInputs',
   'Controls-demo/Input/Number',
   'Controls-demo/Input/Text',
   'Controls-demo/Input/Area',
   'WS.Data/Source/Memory'
], function(Control, template) {

   'use strict';

   var VDomListView = Control.extend({
      _template: template

   });

   return VDomListView;
});