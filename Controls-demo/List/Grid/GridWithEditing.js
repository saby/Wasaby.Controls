define('Controls-demo/List/Grid/GridWithEditing', [
   'Core/Control',
   'Controls-demo/List/Grid/GridWithEditingData',
   'tmpl!Controls-demo/List/Grid/GridWithEditing',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/List/Tree/treeEditingTemplate',
   'tmpl!Controls-demo/List/Grid/DemoItem',
   'tmpl!Controls-demo/List/Grid/DemoBalancePrice',
   'tmpl!Controls-demo/List/Grid/DemoCostPrice',
   'tmpl!Controls-demo/List/Grid/DemoHeaderCostPrice',

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

   var showType = {

      // show only in Menu
      MENU: 0,

      // show in Menu and Toolbar
      MENU_TOOLBAR: 1,

      // show only in Toolbar
      TOOLBAR: 2
   };

   var _firstItemActionsArray = [
      {
         id: 5,
         title: 'прочитано',
         showType: showType.TOOLBAR,
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
         showType: showType.MENU_TOOLBAR,
         handler: function() {
            console.log('action profile Click');
         }
      },
      {
         id: 4,
         icon: 'icon-Erase icon-error',
         title: 'delete pls',
         showType: showType.TOOLBAR,
         handler: function() {
            console.log('action delete Click');
         }
      }
   ];
   var _gridColumns = [
      {
         displayProperty: 'name',
         width: '1fr',
         template: 'tmpl!Controls-demo/List/Tree/treeEditingTemplate'
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
         displayProperty: 'description',
         width: '1fr',
         align: 'right',
         template: 'tmpl!Controls-demo/List/Tree/treeEditingTemplate'
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
   var _gridHeader = [
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
         title: 'Описание',
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
   var _tasksColumns = [
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
   var ModuleClass = BaseControl.extend({
         _template: template,
         _itemActions: null,
         _viewSource: null,
         gridData: null,
         gridColumns: null,
         gridHeader: null,
         tasksColumns: null,

         _beforeMount: function() {
            this._itemActions = _firstItemActionsArray;
            this._viewSource = new MemorySource({
               idProperty: 'id',
               data: GridData.catalog
            });
            this.gridData = GridData;
            this.gridColumns = _gridColumns;
            this.gridHeader = _gridHeader;
            this.tasksColumns = _tasksColumns;
         },
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
            console.log(arguments);
         }
      });

   return ModuleClass;
});
