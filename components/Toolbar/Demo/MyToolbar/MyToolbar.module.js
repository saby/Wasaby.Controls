define('js!SBIS3.CONTROLS.Demo.MyToolbar', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MyToolbar',
   'js!SBIS3.CONTROLS.Toolbar',
   'js!SBIS3.CONTROLS.Button'
], function (CompoundControl, dotTplFn) {
   'use strict';
   /**
    * SBIS3.CONTROLS.Demo.MyToolbar
    * @class SBIS3.CONTROLS.Demo.MyToolbar
    * @extends $ws.proto.CompoundControl
    * @control
    * @public
    */
   var MyToolbar = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyToolbar.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      $constructor: function () {
      },

      init: function () {
         MyToolbar.superclass.init.call(this);
      }
   });
   return MyToolbar;
});