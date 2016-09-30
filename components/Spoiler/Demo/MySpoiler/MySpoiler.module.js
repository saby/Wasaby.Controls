define('js!SBIS3.CONTROLS.Demo.MySpoiler',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.CONTROLS.Demo.MySpoiler',
     'css!SBIS3.CONTROLS.Demo.MySpoiler',
     'js!SBIS3.CONTROLS.Spoiler'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MySpoiler
    * @class SBIS3.CONTROLS.Demo.MySpoiler
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MySpoiler.prototype */{
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