define('Controls-demo/OperationsPanel/Print', [
   'Core/Control',
   'tmpl!Controls-demo/OperationsPanel/Print/Print',
   'WS.Data/Source/Memory',
   'Core/SessionStorage'
], function(
   Control,
   template,
   Memory,
   SessionStorage
) {
   'use strict';

   var data = [];
   for (var i = 0; i < 100; i++) {
      data[i] = {
         id: i,
         title: 'заголовок' + i,
         info: 'инфо' + i
      };
   }

   var Print = Control.extend({
      _template: template,
      _query: null,
      _showPrintDialog: false,
      _source: new Memory({
         data: data
      }),

      _clickHandler: function(e, type) {
         var params = {
            columns: [
               {
                  field: 'title',
                  title: 'Заголовок'
               },
               {
                  field: 'info',
                  title: 'Описание'
               }
            ],
            name: 'имя'
         };

         this._children[type].print(this._query, params);
      },

      _togglePrintDialog: function(e, value) {
         this._showPrintDialog = value;
         SessionStorage.set('autoTestConfig', {showPrintReportForTests: value});
      }
   });

   return Print;
});
