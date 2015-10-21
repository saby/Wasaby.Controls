/**
 * Created by as.suhoruchkin on 02.04.2015.
 */
define('js!SBIS3.CONTROLS.MoveDialogTemplate', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.MoveDialogTemplate',
   'js!SBIS3.CONTROLS.Button',
   'js!SBIS3.CONTROLS.TreeDataGridView'
], function(Control, dotTplFn) {

   var MoveDialogTemplate = Control.extend({
      _dotTplFn: dotTplFn,

      $protected: {
         _options: {
            name: 'moveDialog',
            autoHeight: false,
            width: '400px',
            height: '400px',
            resizable: false
         }
      },
      $constructor: function() {
         this._container.removeClass('ws-area');
      }
   });

   return MoveDialogTemplate;
});