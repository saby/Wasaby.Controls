/**
 * Created by am.gerasimov on 19.10.2015.
 */
define('js!SBIS3.CONTROLS.Demo.FieldLinkDemoSelectingCompany', [
   'js!SBIS3.CORE.CompoundControl',
   'html!SBIS3.CONTROLS.Demo.FieldLinkDemoSelectingCompany',
   'js!SBIS3.CONTROLS.SbisJSONStrategy',
   'js!SBIS3.CONTROLS.StaticSource',
   'js!SBIS3.CONTROLS.DataGridView',
   'js!SBIS3.CONTROLS.Button',
   'css!SBIS3.CONTROLS.Demo.FieldLinkDemoSelectingCompany'
], function (CompoundControl, dotTplFn, SbisJSONStrategy, StaticSource) {
   /**
    * SBIS3.CONTROLS.Demo.FieldLinkDemoSelectingCompany
    * @class SBIS3.CONTROLS.Demo.FieldLinkDemoSelectingCompany
    * @extends $ws.proto.CompoundControl
    * @control
    */
   var moduleClass = CompoundControl.extend(/** @lends SBIS3.CONTROLS.Demo.FieldLinkDemoSelectingCompany.prototype */{
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
                  [0, 'ООО Тензор'],
                  [1, 'ОАО РЖД'],
                  [2, 'Правительство РФ'],
                  [3, 'НПО Весёлый шарик'],
                  [4, 'ОАО РЖД Ярославль']
               ],
               s: [
                  {n: 'Ид', t: 'ЧислоЦелое'},
                  {n: 'Название', t: 'Текст'}
               ]
            },
            keyField: 'Ид',
            strategy: new SbisJSONStrategy()
         });

         dataGrid.setDataSource(dataSource);
         this.getChildControlByName('SelectButton').subscribe('onActivated', function() {
            self.sendCommand('close', dataGrid.getSelectedKeys());
         })
      }
   });
   return moduleClass;
});
