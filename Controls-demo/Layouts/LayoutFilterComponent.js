define('Controls-demo/Layouts/LayoutFilterComponent', [
   'Core/Control',
   'wml!Controls-demo/Layouts/LayoutFilterComponent/LayoutFilterComponent',
   'Controls/Toggle/Switch'

], function (BaseControl, template) {
   'use strict';
   
   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         _switchValue: false,
   
         constructor: function(cfg) {
            ModuleClass.superclass.constructor.call(this, cfg);
            console.log(cfg);
         },
         
         _switchValueHandler: function(event, value) {
            var filter = {};
            if (this._switchValue) {
               filter.title = 'Sasha';
            }
            this._notify('filterChanged', [filter], {bubbling: true});
         }
         
         
      });
   return ModuleClass;
});