define('js!SBIS3.CONTROLS.Demo.DataGridView.EditInPlace',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.Demo.DataGridView.EditInPlace',
        'css!SBIS3.CONTROLS.Demo.DataGridView.EditInPlace',
        'js!SBIS3.CONTROLS.DataGridView',
        'js!SBIS3.CONTROLS.NumberTextBox',
        'js!SBIS3.CONTROLS.TextBox',
        'js!SBIS3.CONTROLS.Button',
        'js!SBIS3.CORE.CoreValidators'
    ], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyDataGridView
    * @class SBIS3.CONTROLS.Demo.MyDataGridView
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.DataGridView.EditInPlace.prototype */{
      _dotTplFn: dotTplFn,
      $constructor: function() {
         $ws.single.CommandDispatcher.declareCommand(this, 'save', this._saveFn);
      },
      _saveFn: function() {
         var
            self = this;
         this.getTopParent().finishChildPendingOperations(true)
            .addCallback(function(result) {
               self.sendCommand('close');
            }).
            addErrback(function() {
               $ws.core.alert('Произошла ошибка!')
            });
      }
   });
   return moduleClass;
});