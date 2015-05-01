define('js!SBIS3.Demo.Control.MyDataGrid',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.Demo.Control.MyDataGrid',
        'css!SBIS3.Demo.Control.MyDataGrid',
        'js!SBIS3.CONTROLS.DataGrid'
    ], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.Demo.Control.MyDataGrid
    * @class SBIS3.Demo.Control.MyDataGrid
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.Demo.Control.MyDataGrid.prototype */{
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