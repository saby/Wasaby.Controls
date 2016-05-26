define('js!SBIS3.CONTROLS.Demo.DataGridView.EditInPlace',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.Demo.DataGridView.EditInPlace',
        'css!SBIS3.CONTROLS.Demo.DataGridView.EditInPlace',
        'js!SBIS3.CONTROLS.DataGridView',
        'js!SBIS3.CONTROLS.NumberTextBox',
        'js!SBIS3.CONTROLS.TextBox'
    ], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyDataGridView
    * @class SBIS3.CONTROLS.Demo.MyDataGridView
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.DataGridView.EditInPlace.prototype */{
      _dotTplFn: dotTplFn
   });
   return moduleClass;
});