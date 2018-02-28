define('Controls-demo/Buttons/demoButtons', [
   'Core/Control',
   'tmpl!Controls-demo/Buttons/demoButtons',
   'Controls/Button'
], function (Control,
             template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,

         _afterMount: function () {
            var elem = document.getElementById('resultViewer');
            elem.style.cssText = 'padding: 0px 12px; color: red; position: fixed; left: 10%; top: 0;';
            this.count = 0;
         },

         clickHandler: function (e) {
            this.count++;
         }
      });
   return ModuleClass;
});