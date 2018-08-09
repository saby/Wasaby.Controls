define('Controls-demo/Date/MonthView', [
   'Core/Control',
   'tmpl!Controls-demo/Date/MonthView',
   'Controls/Date/MonthView'
], function(
   BaseControl,
   template
) {
   'use strict';

   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         _month: new Date(2017, 0, 1),

         constructor: function() {
            ModuleClass.superclass.constructor.apply(this, arguments);
         },

         _changeMonth: function(event, dMonth) {
            this._month = new Date(this._month.getFullYear(), this._month.getMonth() + dMonth, 1);
            this._forceUpdate();
         }
      });
   return ModuleClass;
});