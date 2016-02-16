define('js!SBIS3.CONTROLS.Demo.MySuggestTextBox', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.MySuggestTextBox',
   'js!SBIS3.CONTROLS.DEMO.DemoSuggestMemory',
   'css!SBIS3.CONTROLS.Demo.MySuggestTextBox',
   'js!SBIS3.CONTROLS.SuggestTextBox'
], function (CompoundControl, dotTplFn, DemoSuggestMemory) {
   /**
    * SBIS3.CONTROLS.Demo.MySuggestTextBox
    * @class SBIS3.CONTROLS.Demo.MySuggestTextBox
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MySuggestTextBox.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      $constructor: function () {
      },

      init: function () {
         moduleClass.superclass.init.call(this);

         var suggestOne = this.getChildControlByName('simpleSuggest');
         var suggestShowAll = this.getChildControlByName('simpleSuggestShowAll');

         suggestOne.subscribe('onListReady', function(event, list) {
            list.setDataSource(new DemoSuggestMemory(), true);
         });

         suggestShowAll.subscribe('onListReady', function(event, list) {
            list.setDataSource(new DemoSuggestMemory(), true);
         });
      }
   });
   return moduleClass;
});
