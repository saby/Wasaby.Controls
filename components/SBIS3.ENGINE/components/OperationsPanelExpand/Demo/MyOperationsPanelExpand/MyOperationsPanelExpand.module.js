define('js!SBIS3.Engine.Demo.MyOperationsPanelExpand', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.Engine.Demo.MyOperationsPanelExpand',
   'js!SBIS3.Engine.OperationsPanelExpand',
   'css!SBIS3.Engine.Demo.MyOperationsPanelExpand'
], function (CompoundControl, dotTplFn) {
   /**
    * SBIS3.Engine.Demo.MyOperationsPanelExpand
    * @class SBIS3.Engine.Demo.MyOperationsPanelExpand
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var MyOperationsPanelExpand = CompoundControl.extend(/** @lends SBIS3.Engine.Demo.MyOperationsPanelExpand.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      $constructor: function () {
      },

      init: function () {
         MyOperationsPanelExpand.superclass.init.call(this);
      }
   });
   return MyOperationsPanelExpand;
});