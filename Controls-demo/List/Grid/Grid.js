define('Controls-demo/List/Grid/Grid', [
   'Core/Control',
   'Controls-demo/List/Grid/GridData',
   'tmpl!Controls-demo/List/Grid/Grid',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/List/Grid/DemoItem',
   'tmpl!Controls-demo/List/Grid/DemoBalancePrice',
   'tmpl!Controls-demo/List/Grid/DemoCostPrice',
   'tmpl!Controls-demo/List/Grid/DemoHeaderCostPrice',
   'tmpl!Controls-demo/List/Grid/DemoName',
   'tmpl!Controls-demo/List/Grid/DemoTasksPhoto',
   'tmpl!Controls-demo/List/Grid/DemoTasksDescr',
   'tmpl!Controls-demo/List/Grid/DemoTasksReceived',
   'Controls/Render/Money/Money',
   'css!Controls-demo/List/Grid/Grid',
   'Controls/Container/Scroll',
   'Controls/Grid',
   'Controls/Render/Money/Money'
], function(BaseControl, GridData, template, MemorySource) {
   'use strict';
   var

      ModuleClass = BaseControl.extend({
         _template: template,
         _actionClicked: '',
         _itemActions: null,
         _viewSource: null,
         gridData: null,
         gridColumns: null,
         gridHeader: null,
         tasksColumns: null,
         showType: null,
         _showAction: function(action, item) {
            if (item.get('id') === '471329') {
               if (action.id === 2 || action.id === 3) {
                  return false;
               }
               return true;
            }
            if (action.id === 5) {
               return false;
            }
            if (item.get('id') === '448390') {
               return false;
            }

            return true;
         },
         _onActionClick: function(event, action, item) {
            this._actionClicked = action.title;
         },
         _beforeMount: function() {
            this.showType = {

               // show only in Menu
               MENU: 0,

               // show in Menu and Toolbar
               MENU_TOOLBAR: 1,

               // show only in Toolbar
               TOOLBAR: 2
            };
            this._viewSource = new MemorySource({
               idProperty: 'id',
               data: GridData.catalog
            });
            this._itemActions = [
               {
                  id: 5,
                  title: 'прочитано',
                  showType: this.showType.TOOLBAR,
                  handler: function() {
                     console.log('action read Click');
                  }
               },
               {
                  id: 1,
                  icon: 'icon-primary icon-PhoneNull',
                  title: 'phone',
                  handler: function(item) {
                     console.log('action phone Click ', item);
                  }
               },
               {
                  id: 2,
                  icon: 'icon-primary icon-EmptyMessage',
                  title: 'message',
                  handler: function() {
                     alert('Message Click');
                  }
               },
               {
                  id: 3,
                  icon: 'icon-primary icon-Profile',
                  title: 'profile',
                  showType: this.showType.MENU_TOOLBAR,
                  handler: function() {
                     console.log('action profile Click');
                  }
               },
               {
                  id: 4,
                  icon: 'icon-Erase icon-error',
                  title: 'delete pls',
                  showType: this.showType.TOOLBAR,
                  handler: function() {
                     console.log('action delete Click');
                  }
               }
            ];
            this.gridColumns = [
               {
                  displayProperty: 'name',
                  width: '1fr',
                  template: 'tmpl!Controls-demo/List/Grid/DemoName'
               },
               {
                  displayProperty: 'price',
                  width: 'auto',
                  align: 'right',
                  template: 'tmpl!Controls-demo/List/Grid/DemoCostPrice'
               },
               {
                  displayProperty: 'balance',
                  width: 'auto',
                  align: 'right',
                  template: 'tmpl!Controls-demo/List/Grid/DemoBalancePrice'
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
                  template: 'tmpl!Controls-demo/List/Grid/DemoCostPrice'
               },
               {
                  displayProperty: 'balanceCostSumm',
                  width: 'auto',
                  align: 'right',
                  template: 'tmpl!Controls-demo/List/Grid/DemoCostPrice'
               }
            ];
            this.gridData = GridData;
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
                  template: 'tmpl!Controls-demo/List/Grid/DemoHeaderCostPrice'
               },
               {
                  title: 'Сумма остатка',
                  align: 'right'
               }
            ];
            this.tasksColumns = [
               {
                  template: 'tmpl!Controls-demo/List/Grid/DemoTasksPhoto',
                  width: 'auto'
               },
               {
                  template: 'tmpl!Controls-demo/List/Grid/DemoTasksDescr',
                  width: '1fr'
               },
               {
                  template: 'tmpl!Controls-demo/List/Grid/DemoTasksReceived',
                  width: 'auto'
               }
            ];
         }
      });

   return ModuleClass;
});
