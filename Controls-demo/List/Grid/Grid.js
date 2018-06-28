define('Controls-demo/List/Grid/Grid', [
   'Core/Control',
   'Controls-demo/List/Grid/GridData',
   'tmpl!Controls-demo/List/Grid/Grid',
   'WS.Data/Source/Memory',
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
], function (BaseControl, GridData, template, MemorySource) {

   'use strict';

   var showType = {

      //show only in Menu
      MENU: 0,

      //show in Menu and Toolbar
      MENU_TOOLBAR: 1,

      //show only in Toolbar
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

   var

      ModuleClass = BaseControl.extend({
         _template: template,

         _showAction: function(action, item) {
            if (item.get('id') === '471329') {
               if (action.id === 2 || action.id === 3) {
                  return false;
               } else {
                  return true;
               }

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
         },
         _itemActions: _firstItemActionsArray,

         _viewSource: new MemorySource({
            idProperty: 'id',
            data: GridData.catalog
         }),

         gridData: GridData,
         gridColumns: [
            {
               displayProperty: 'name',
               width: '1fr'
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
         ],
         gridHeader: [
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
         ],

         tasksColumns: [
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
         ]
      });
   return azazaza;

   return ModuleClass;
});