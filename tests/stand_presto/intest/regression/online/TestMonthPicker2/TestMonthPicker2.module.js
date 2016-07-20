define('js!SBIS3.TestMonthPicker2', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.TestMonthPicker2', 'js!SBIS3.CONTROLS.MonthPicker', 'js!SBIS3.CONTROLS.TextBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.TestMonthPicker2
    * @class SBIS3.TestMonthPicker2
    * @extends $ws.proto.CompoundControl
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.TestMonthPicker2.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
      }
   });

   moduleClass.webPage = {
     outFileName: "regression_month_picker_online_2",
     htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
   };
   return moduleClass;
});