define('Controls-demo/List/Tree/Tree', [
   'Core/Control',
   'Controls-demo/List/Tree/GridData',
   'tmpl!Controls-demo/List/Tree/Tree',
   'Controls-demo/List/Tree/TreeMemory',
   'Controls/Constants',
   'css!Controls-demo/List/Tree/Tree',
   'Controls/Container/Scroll',
   'Controls/TreeGrid',
   'tmpl!Controls-demo/List/Tree/DemoContentTemplate'
], function(BaseControl, GridData, template, MemorySource, ControlsConstants) {

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
         _itemsGroup: {
            method: function(item, index, displayItem) {
               return item.get('Группа');
            },
            template: ''
         },

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
               displayProperty: 'Наименование',
               width: '1fr',
               template: 'tmpl!Controls-demo/List/Tree/DemoContentTemplate'
            }
         ]
      });

   return ModuleClass;
});
