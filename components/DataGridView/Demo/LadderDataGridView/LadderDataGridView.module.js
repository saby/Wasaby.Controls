define('js!SBIS3.CONTROLS.Demo.LadderDataGridView', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.LadderDataGridView',
   'js!SBIS3.CONTROLS.DataGridView'
], function(
   CompoundControl,
   dotTplFn
) {
   /**
    * SBIS3.CONTROLS.Demo.LadderDataGridView
    * @class SBIS3.CONTROLS.Demo.LadderDataGridView
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.LadderDataGridView.prototype */{
      _dotTplFn: dotTplFn,
      init: function() {
         moduleClass.superclass.init.call(this);
      }
   });
   return moduleClass;
});