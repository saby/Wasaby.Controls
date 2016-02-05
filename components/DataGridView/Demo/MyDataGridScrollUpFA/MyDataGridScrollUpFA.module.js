define('js!SBIS3.CONTROLS.Demo.MyDataGridScrollUpFA',
    [
        'js!SBIS3.CORE.CompoundControl',
        'html!SBIS3.CONTROLS.Demo.MyDataGridScrollUpFA',
        'css!SBIS3.CONTROLS.Demo.MyDataGridScrollUpFA',
        'js!SBIS3.CONTROLS.DataGridView',
       'js!SBIS3.CONTROLS.Button'
    ], function(CompoundControl, dotTplFn) {
   /**
    * SBIS3.CONTROLS.Demo.MyDataGridScrollUpFA
    * @class SBIS3.CONTROLS.Demo.MyDataGridScrollUpFA
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyDataGridScrollUpFA.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
      },

      init: function() {
         var bigColls = [];
         for (var i = 0; i < 150; i++) {
            bigColls.push({
               'id' : i,
               'title' : 'Title ' + (i + 1),
               'flag': !!(Math.round(Math.random())), // 0 || 1
               'par' : null //Потом исправить
            });
         }
         moduleClass.superclass.init.call(this);
         var dataGrid = this.getChildControlByName('Таблица');
         dataGrid.setItems(bigColls);
      }
   });
   return moduleClass;
});