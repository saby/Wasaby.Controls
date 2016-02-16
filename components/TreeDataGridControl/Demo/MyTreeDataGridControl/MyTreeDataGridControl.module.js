define('js!SBIS3.CONTROLS.Demo.MyTreeDataGridControl', [
   'js!SBIS3.CORE.CompoundControl',
   'js!SBIS3.CONTROLS.ComponentBinder',
   'html!SBIS3.CONTROLS.Demo.MyTreeDataGridControl',
   'html!SBIS3.CONTROLS.Demo.MyTreeDataGridControl/resources/CellTemplate',
   'css!SBIS3.CONTROLS.Demo.MyTreeDataGridControl',
   'js!SBIS3.CONTROLS.TreeDataGridControl',
   'js!SBIS3.CONTROLS.Data.Source.Memory'
], function(CompoundControl, ComponentBinder, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyTreeDataGridControl
    * @class SBIS3.CONTROLS.Demo.MyTreeDataGridControl
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var MyTreeDataGridControl = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyTreeDataGridControl.prototype */{
      _dotTplFn: dotTplFn,

      init: function() {
         MyTreeDataGridControl.superclass.init.call(this);
      }
   });

   return MyTreeDataGridControl;
});