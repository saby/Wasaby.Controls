/*global define*/
define('js!SBIS3.CONTROLS.Demo.MyTabButtons', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MyTabButtons',
   'js!SBIS3.CONTROLS.TabButtons',
   'js!SBIS3.CONTROLS.Button'
], function (CompoundControl, dotTplFn) {

   'use strict';

   /**
    * SBIS3.CONTROLS.Demo.MyTabButtons
    * @class SBIS3.CONTROLS.Demo.MyTabButtons
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var MyTabButtons = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyTabButtons.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      $constructor: function () {
      },

      init: function () {
         MyTabButtons.superclass.init.call(this);
      }
   });
   return MyTabButtons;
});