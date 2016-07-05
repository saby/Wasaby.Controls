define('js!SBIS3.TestComboBox2', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.TestComboBox2', 'js!SBIS3.CONTROLS.ComboBox', 'js!SBIS3.CONTROLS.TextBox'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.TestComboBox2
    * @class SBIS3.TestComboBox2
    * @extends $ws.proto.CompoundControl
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.TestComboBox2.prototype */{
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
     outFileName: "regression_combo_box_online_2",
     htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
   };
   return moduleClass;
});