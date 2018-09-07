define('Controls-demo/List/Tree/Tree', [
   'Core/Control',
   'Controls-demo/List/Tree/GridData',
   'wml!Controls-demo/List/Tree/Tree',
   'Controls-demo/List/Tree/TreeMemory',
   'Controls/Constants',
   'css!Controls-demo/List/Tree/Tree',
   'Controls/Container/Scroll',
   'Controls/TreeGrid',
   'wml!Controls-demo/List/Tree/DemoContentTemplate'
], function(BaseControl, GridData, template, MemorySource, ControlsConstants) {
   'use strict';
   var
      ModuleClass = BaseControl.extend({
         _template: template,
         _actionClicked: '',
         _itemsGroup: null,
         _itemActions: null,
         _viewSource: null,
         gridData: null,
         gridColumns: null,
         showType: null,
         _beforeMount: function() {
            this.gridColumns = [
               {
                  displayProperty: 'Наименование',
                  width: '1fr',
                  template: 'wml!Controls-demo/List/Tree/DemoContentTemplate'
               }
            ];
            this.showType = {
               // show only in Menu
               MENU: 0,
               // show in Menu and Toolbar
               MENU_TOOLBAR: 1,
               // show only in Toolbar
               TOOLBAR: 2
            };
            this.gridData = GridData;
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
            this._itemsGroup = {
               method: function(item, index, displayItem) {
                  return item.get('Группа');
               },
               template: ''
            };
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
         _onActionClick: function(event, action) {
            this._actionClicked = action.title;
         }
      });

   return ModuleClass;
});
