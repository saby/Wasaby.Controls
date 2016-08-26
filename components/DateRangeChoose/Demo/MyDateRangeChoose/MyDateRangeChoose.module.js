define('js!SBIS3.CONTROLS.Demo.MyDateRangeChoose',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.CONTROLS.Demo.MyDateRangeChoose',
     'css!SBIS3.CONTROLS.Demo.MyDateRangeChoose',
     'js!SBIS3.CONTROLS.DateRangeChoose'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyDateRangeChoose
    * @class SBIS3.CONTROLS.Demo.MyDateRangeChoose
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyDateRangeChoose.prototype */{
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