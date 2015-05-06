define('js!SBIS3.Controls.Demo.MyDataGrid',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.Controls.Demo.MyDataGrid',
        'css!SBIS3.Controls.Demo.MyDataGrid',
        'js!SBIS3.CONTROLS.DataGrid'
    ], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Controls.Demo.MyDataGrid
    * @class SBIS3.Controls.Demo.MyDataGrid
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Controls.Demo.MyDataGrid.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
      }
   });
   return moduleClass;
});