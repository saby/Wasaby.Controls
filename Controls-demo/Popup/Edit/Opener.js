define('Controls-demo/Popup/Edit/Opener',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/Edit/Opener',
      'WS.Data/Source/Memory',
      'Controls-demo/List/Grid/GridData',
      'wml!Controls-demo/List/Grid/DemoItem',
      'wml!Controls-demo/List/Grid/DemoBalancePrice',
      'wml!Controls-demo/List/Grid/DemoCostPrice',
      'wml!Controls-demo/List/Grid/DemoHeaderCostPrice',
      'wml!Controls-demo/List/Grid/DemoName',
      'wml!Controls-demo/List/Grid/DemoTasksPhoto',
      'wml!Controls-demo/List/Grid/DemoTasksDescr',
      'wml!Controls-demo/List/Grid/DemoTasksReceived',
   ],
   function (Control, template, MemorySource, GridData) {
      'use strict';

      var EditOpener = Control.extend({
         _template: template,
         _addPosition: 0,
         _cancelEdit: false,

         _beforeMount: function(opt, context) {
            this._viewSource = new MemorySource({
               idProperty: 'id',
               data: GridData.catalog.slice(0, 10)
            });

            this.gridColumns = [
               {
                  displayProperty: 'name',
                  width: '1fr',
                  template: 'wml!Controls-demo/List/Grid/DemoName'
               },
               {
                  displayProperty: 'price',
                  width: 'auto',
                  align: 'right',
                  template: 'wml!Controls-demo/List/Grid/DemoCostPrice'
               },
               {
                  displayProperty: 'balance',
                  width: 'auto',
                  align: 'right',
                  template: 'wml!Controls-demo/List/Grid/DemoBalancePrice'
               },
               {
                  displayProperty: 'reserve',
                  width: 'auto',
                  align: 'right'
               },
               {
                  displayProperty: 'costPrice',
                  width: 'auto',
                  align: 'right',
                  template: 'wml!Controls-demo/List/Grid/DemoCostPrice'
               },
               {
                  displayProperty: 'balanceCostSumm',
                  width: 'auto',
                  align: 'right',
                  template: 'wml!Controls-demo/List/Grid/DemoCostPrice'
               }
            ];
            this.gridHeader = [
               {
                  title: ''
               },
               {
                  title: 'Цена',
                  align: 'right'
               },
               {
                  title: 'Остаток',
                  align: 'right'
               },
               {
                  title: 'Резерв',
                  align: 'right'
               },
               {
                  title: 'Себест.',
                  align: 'right',
                  template: 'wml!Controls-demo/List/Grid/DemoHeaderCostPrice'
               },
               {
                  title: 'Сумма остатка',
                  align: 'right'
               }
            ];
         },

         _itemClick: function (event, record) {
            var popupOptions = {
               closeByExternalClick: false,
            };
            this._children.EditOpener.open({record: record}, popupOptions);
         },

         _addRecord: function() {
            this._children.EditOpener.open();
         },

         _beforeSyncRecord: function(event, action, record, additionaData) {
            if (this._cancelEdit) {
               return 'cancel';
            }

            if (additionaData && additionaData.isNewRecord) {
               additionaData.at = this._addPosition;
            }
         }

      });

      return EditOpener;
   }
);
