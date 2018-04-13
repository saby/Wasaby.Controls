define('Controls-demo/Input/VDomInputs/VDomInputs', [
   'Core/Control',
   'tmpl!Controls-demo/Input/VDomInputs/VDomInputs',
   'WS.Data/Source/Memory'
], function(Control, template) {

   'use strict';

   var VDomListView = Control.extend({
      _template: template

   });

   return VDomListView;
});