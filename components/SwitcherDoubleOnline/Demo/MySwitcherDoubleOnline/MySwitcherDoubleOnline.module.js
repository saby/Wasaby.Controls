define('js!SBIS3.Controls.Demo.MySwitcherDoubleOnline', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Controls.Demo.MySwitcherDoubleOnline', 'css!SBIS3.Controls.Demo.MySwitcherDoubleOnline', 'js!SBIS3.Engine.SwitcherDoubleOnline'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Controls.Demo.MySwitcherDoubleOnline
    * @class SBIS3.Controls.Demo.MySwitcherDoubleOnline
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Controls.Demo.MySwitcherDoubleOnline.prototype */{
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
   return moduleClass;
});