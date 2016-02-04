define('js!SBIS3.CONTROLS.Demo.MyTabControl', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MyTabControl',
   'js!SBIS3.CONTROLS.TabControl',
   'js!SBIS3.CONTROLS.Link'
], function (CompoundControl, dotTplFn) {
   'use strict';
   /**
    * SBIS3.CONTROLS.Demo.MyTabControl
    * @class SBIS3.CONTROLS.Demo.MyTabControl
    * @extends $ws.proto.CompoundControl
    */
   var MyTabControl = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyTabControl.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      $constructor: function () {
      },

      init: function () {
         MyTabControl.superclass.init.call(this);
      }
   });
   return MyTabControl;
});