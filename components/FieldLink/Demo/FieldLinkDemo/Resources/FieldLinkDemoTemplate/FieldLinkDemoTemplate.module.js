/**
 * Created by am.gerasimov on 19.10.2015.
 */
define('js!SBIS3.CONTROLS.Demo.FieldLinkDemoTemplate', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.FieldLinkDemoTemplate',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'js!SBIS3.CONTROLS.Data.Source.Memory',
   'js!SBIS3.CONTROLS.DataGridView',
   'js!SBIS3.CONTROLS.Button',
   'css!SBIS3.CONTROLS.Demo.FieldLinkDemoTemplate'
], function (CompoundControl, dotTplFn, AdapterSbis, StaticSource) {
   /**
    * SBIS3.CONTROLS.Demo.MySuggestTextBoxDS
    * @class SBIS3.CONTROLS.Demo.MySuggestTextBoxDS
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.MyDataGridView.prototype */{
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            resizable: false
         }
      },
      $constructor: function() {
      },

      init: function() {
         moduleClass.superclass.init.call(this);
         var self = this;
         var dataGrid = this.getChildControlByName('Таблица');
         var dataSource = new StaticSource({
            data: {
               _type: 'recordset',
               d: [
                  [0, 'Инженер-программист'],
                  [1, 'Руководитель группы'],
                  [2, 'Менеджер'],
                  [3, 'Генерал армии'],
                  [4, 'Министр обороны'],
                  [5, 'Бухгалтер']
               ],
               s: [
                  {n: 'Ид', t: 'ЧислоЦелое'},
                  {n: 'Название', t: 'Текст'}
               ]
            },
            idProperty: 'Ид',
            adapter: new AdapterSbis()
         });

         dataGrid.setDataSource(dataSource);
         this.getChildControlByName('SelectButton').subscribe('onActivated', function() {
            self.sendCommand('close', dataGrid.getSelectedKeys());
         })
      }
   });
   return moduleClass;
});
