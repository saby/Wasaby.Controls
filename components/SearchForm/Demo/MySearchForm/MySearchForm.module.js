define('js!SBIS3.CONTROLS.Demo.MySearchForm', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MySearchForm',
   'js!SBIS3.CONTROLS.DEMO.DemoSearchMemory',
   'css!SBIS3.CONTROLS.Demo.MySearchForm',
   'js!SBIS3.CONTROLS.SearchForm',
   'js!SBIS3.CONTROLS.DataGridView',
   'js!SBIS3.CONTROLS.SuggestView'
], function (CompoundControl, dotTplFn, DemoSuggestMemory) {
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

         var searchTwo = this.getChildControlByName('SearchTwo');

         searchTwo.subscribe('onListReady', function(event, list) {
            list.setDataSource(new DemoSuggestMemory(), true);
         });
      }
   });
   return MySearchForm;
});