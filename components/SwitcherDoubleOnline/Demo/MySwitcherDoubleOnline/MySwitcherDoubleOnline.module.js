define('js!SBIS3.CONTROLS.Demo.MySwitcherDoubleOnline', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLS.Demo.MySwitcherDoubleOnline', 'css!SBIS3.CONTROLS.Demo.MySwitcherDoubleOnline', 'js!SBIS3.Engine.SwitcherDoubleOnline'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MySwitcherDoubleOnline
    * @class SBIS3.CONTROLS.Demo.MySwitcherDoubleOnline
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MySwitcherDoubleOnline.prototype */{
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