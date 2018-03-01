define('Controls-demo/Layouts/LayoutFilterComponent', [
   'Core/Control',
   'tmpl!Controls-demo/Layouts/LayoutFilterComponent/LayoutFilterComponent',
   'Controls/Toggle/Switch'

], function (BaseControl, template) {
   'use strict';
   
   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         _switchValue: false,
         
         _beforeUpdate: function() {
            var filter = {};
            if (this._switchValue) {
               filter.title = 'Sasha';
            }
            this._notify('filterChanged', [filter], {bubbling: true});
         }
         
         
      });
   return ModuleClass;
});