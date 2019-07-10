define('Controls-demo/Popup/Opener/resources/DialogTpl',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/Opener/resources/DialogTpl',
      'Controls-demo/List/Tree/GridData',
      'Controls-demo/List/Tree/TreeMemory',
      'wml!Controls-demo/List/Tree/DemoContentTemplate'
   ],
   function (Control, template,  GridData, MemorySource) {
      'use strict';

      var PopupPage = Control.extend({
         _template: template,
         _actionClicked: '',
         _groupingKeyCallback: null,
         _itemActions: null,
         _viewSource: null,
         gridData: null,
         gridColumns: null,
         showType: null,
         _beforeMount: function(opts) {
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

                  }
               },
               {
                  id: 1,
                  icon: 'icon-primary icon-PhoneNull',
                  title: 'phone',
                  handler: function(item) {

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

                  }
               },
               {
                  id: 4,
                  icon: 'icon-Erase icon-error',
                  title: 'delete pls',
                  showType: this.showType.TOOLBAR,
                  handler: function() {

                  }
               }
            ];
            this._groupingKeyCallback = function(item, index, displayItem) {
               return item.get('Группа');
            };
         },
         _showAction: function(action, item) {
            if (action.id === 5) {
               return false;
            }

            return true;
         },
         _close: function(){
            this._notify('close', [], {bubbling: true});
         },
         _onActionClick: function(event, action) {
            this._actionClicked = action.title;
         }
      });


      return PopupPage;
   }
);