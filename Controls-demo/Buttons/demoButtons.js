define('Controls-demo/Buttons/demoButtons', [
   'Core/Control',
   'tmpl!Controls-demo/Buttons/demoButtons',
   'css!Controls-demo/Buttons/demoButtons',
   'Controls/Button'
], function (Control,
             template) {
   'use strict';


   var ModuleClass = Control.extend(
      {
         _template: template,
         count:0,
         _addButtonIcon: '',
         clickHandler: function (e) {
            this.count++;
         }
      });
   return ModuleClass;
});