define('js!SBIS3.CONTROLSs.Demo.MyDataGrid',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLSs.Demo.MyDataGrid',
        'css!SBIS3.CONTROLSs.Demo.MyDataGrid',
        'js!SBIS3.CONTROLS.DataGrid'
    ], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLSs.Demo.MyDataGrid
    * @class SBIS3.CONTROLSs.Demo.MyDataGrid
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLSs.Demo.MyDataGrid.prototype */{
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