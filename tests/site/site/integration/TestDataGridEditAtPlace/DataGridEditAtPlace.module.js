define('js!TestDataGridEditAtPlace', 
		[
         'js!SBIS3.CORE.CompoundControl', 
         'html!TestDataGridEditAtPlace',
         'js!SBIS3.CONTROLS.ListView',
         'js!SBIS3.CONTROLS.Record',
         'js!SBIS3.CONTROLS.StaticSource',
         'js!SBIS3.CONTROLS.SbisServiceSource',
         'js!SBIS3.CONTROLS.ArrayStrategy',
         'js!SBIS3.CONTROLS.DataSet',
         'js!SBIS3.CONTROLS.DataGrid',
         'js!SBIS3.CONTROLS.OperationsPanel',
         'js!SBIS3.CONTROLS.OperationDelete',
         'js!SBIS3.CORE.SwitcherDouble',
         'js!SBIS3.CONTROLS.TextBox',
         'js!SBIS3.CONTROLS.FilterButtonNew',
         'js!SBIS3.CONTROLS.DropDownList',
         'js!SBIS3.CORE.FieldLink',
         'css!TestDataGridEditAtPlace'
      ], function (CompoundControl, dotTplFn, ListView, Record, StaticSource, SbisServiceSource, ArrayStrategy, DataSet, DataGrid, OperationsPanel, SwitcherDouble){

   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {
            
         }
      },
      $constructor: function() {
         
      },

      init: function() {
         var self = this;
         var setDS = function (ds) {
            var tmpTestDataGridEditAtPlaceBL = self.getChildControlByName('ТипНоменклатуры');
            tmpTestDataGridEditAtPlaceBL.removeItemsSelectionAll();
            tmpTestDataGridEditAtPlaceBL.setDataSource(ds);
         };
         
         var bigColls = [];
         bigColls.push({
            '@ЗаметкаРедактированиеПоМесту': 0,
            'Содержимое': 'Данные загружены через StaticSource',
            'Завершена': true,
            'withoutNDS': false
         });
         
         for (var i = 1; i < 15; i++){
            if (i % 2 === 0) {
               bigColls.push({
                  '@ЗаметкаРедактированиеПоМесту': i,
                  'Содержимое': (i + 1) + ' заметка',
                  'Завершена': true,
                  'withoutNDS': false
                  //'Завершена': !!(Math.round(Math.random())), // 0 || 1
                  //'withoutNDS': !!(Math.round(Math.random()))
               });
            } else {
               bigColls.push({
                  '@ЗаметкаРедактированиеПоМесту': i,
                  'Содержимое': (i + 1) + ' заметка',
                  'Завершена': false,
                  'withoutNDS': true
               });
            }
         }
         var   arrayStrategy = new ArrayStrategy(),
               ds1 = new SbisServiceSource({service: 'ЗаметкаРедактированиеПоМесту'}),
               ds2 = new StaticSource({
                  data: bigColls,
                  keyField: '@ЗаметкаРедактированиеПоМесту',
                  strategy: arrayStrategy
               });
               
         moduleClass.superclass.init.call(this);
         
         setDS(ds1);

         this.getChildControlByName('SwitcherDoubleOnline').subscribe('onStateChanged', function(eventObject, state, replace, force) {         
            if (state === true) {
               setDS(ds1);
            } else {
               setDS(ds2);
            }
         });
         
         var   data = this.getChildControlByName('ТипНоменклатуры');
         
         data.reload({});
      }
		
   });
   
   moduleClass.webPage = {
      outFileName: "integration_datagrid_edit_at_place", 
      htmlTemplate: "/intest/pageTemplates/onlineTemplate.html"
   };
   
   return moduleClass;
});