define('Controls-demo/Input/Date/RangeLinkLiteCustom', [
   'Core/Control',
   'Controls/Calendar/Utils',
   'tmpl!Controls-demo/Input/Date/RangeLinkLiteCustom',
   'tmpl!Controls-demo/Input/Date/RangeLinkLiteCustomMonth'
], function(
   BaseControl,
   dateControlsUtils,
   template
) {
   'use strict';

   var ModuleClass = BaseControl.extend({
      _template: template,
      _year: new Date(2017, 0, 1),
      _startValue: new Date(2017, 0, 1),
      _endValue: new Date(2017, 1, 0),

      captionFormatter: function(startValue, endValue, emptyCaption) {
         return dateControlsUtils.formatDateRangeCaption(startValue, endValue, emptyCaption) + ' !';
      }
   });
   return ModuleClass;
});
