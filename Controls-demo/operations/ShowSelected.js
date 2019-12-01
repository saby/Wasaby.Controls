define('Controls-demo/operations/ShowSelected', [
   'Core/Control',
   'wml!Controls-demo/operations/ShowSelected',
   'Controls-demo/operations/ShowSelectedMemory',

   // Зависит от другой демки, надо переписать
   'Controls-demo/OperationsPanel/Demo/Data',
   'wml!Controls-demo/OperationsPanel/Demo/PersonInfo',
   'css!Controls-demo/OperationsPanel/Demo/Demo'
], function(Control, template, ShowSelectedMemory, Data) {
   'use strict';

   return Control.extend({
      _template: template,
      _gridColumns: null,
      _viewSource: null,

      _beforeMount: function() {
         this._gridColumns = [{
            template: 'wml!Controls-demo/OperationsPanel/Demo/PersonInfo'
         }];
         this._viewSource = new ShowSelectedMemory({
            keyProperty: 'id',
            data: Data.employees
         });
      },

      _dataLoadCallback: function() {
         var entryPath = Data.employees.map(function(employeeData) {
            return {
               id: employeeData.id,
               parent: employeeData['Раздел']
            }
         });

         this.items.setMetaData({
            ENTRY_PATH: entryPath
         });
      }
   });
});
