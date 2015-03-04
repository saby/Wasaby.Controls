define('js!SBIS3.DemoCode.MyLink',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.DemoCode.MyLink',
     'css!SBIS3.DemoCode.MyLink',
     'js!SBIS3.CONTROLS.Link'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.DemoCode.MyLink
    * @class SBIS3.DemoCode.MyLink
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.DemoCode.MyLink.prototype */{
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