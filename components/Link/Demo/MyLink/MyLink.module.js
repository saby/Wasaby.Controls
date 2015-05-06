define('js!SBIS3.Controls.Demo.MyLink',
    ['js!SBIS3.CORE.CompoundControl',
     'html!SBIS3.Controls.Demo.MyLink',
     'css!SBIS3.Controls.Demo.MyLink',
     'js!SBIS3.CONTROLS.Link'],
    function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Controls.Demo.MyLink
    * @class SBIS3.Controls.Demo.MyLink
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Controls.Demo.MyLink.prototype */{
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