define('js!SBIS3.Demo.Control.MySwitcherDoubleOnline', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.Demo.Control.MySwitcherDoubleOnline', 'css!SBIS3.Demo.Control.MySwitcherDoubleOnline', 'js!SBIS3.Engine.SwitcherDoubleOnline'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MySwitcherDoubleOnline
    * @class SBIS3.Demo.Control.MySwitcherDoubleOnline
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MySwitcherDoubleOnline.prototype */{
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