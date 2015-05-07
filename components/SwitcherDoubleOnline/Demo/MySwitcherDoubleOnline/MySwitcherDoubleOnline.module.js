define('js!SBIS3.CONTROLSs.Demo.MySwitcherDoubleOnline', ['js!SBIS3.CORE.CompoundControl', 'html!SBIS3.CONTROLSs.Demo.MySwitcherDoubleOnline', 'css!SBIS3.CONTROLSs.Demo.MySwitcherDoubleOnline', 'js!SBIS3.Engine.SwitcherDoubleOnline'], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MySwitcherDoubleOnline
    * @class SBIS3.CONTROLSs.Demo.MySwitcherDoubleOnline
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MySwitcherDoubleOnline.prototype */{
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