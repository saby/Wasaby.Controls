define('Controls-demo/Input/VDomInputs/VDomInputs', [
   'Core/Control',
   'tmpl!Controls-demo/Input/VDomInputs/VDomInputs'
], function(Control, template) {

   'use strict';

   var VDomListView = Control.extend({
      _template: template

   });
   return VDomListView;
});