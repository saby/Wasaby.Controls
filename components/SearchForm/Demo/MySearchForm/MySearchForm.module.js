define('js!SBIS3.CONTROLS.Demo.MySearchForm', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MySearchForm',
   'css!SBIS3.CONTROLS.Demo.MySearchForm',
   'js!SBIS3.CONTROLS.SearchForm'
], function (CompoundControl, dotTplFn) {
   'use strict';
   /**
    * SBIS3.CONTROLS.Demo.MySearchForm
    * @class SBIS3.CONTROLS.Demo.MySearchForm
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var MySearchForm = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MySearchForm.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      $constructor: function () {
      },

      init: function () {
         MySearchForm.superclass.init.call(this);
      }
   });
   return MySearchForm;
});