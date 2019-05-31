define('Controls-demo/Popup/Opener/resources/StackTemplateHeader',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/Opener/resources/StackTemplateHeader',
      'Controls-demo/List/Tree/GridData',
      'Controls-demo/List/Tree/TreeMemory',
      'Types/source',
      'Controls/Constants',
      'css!Controls-demo/Popup/Opener/resources/StackHeader',
      'wml!Controls-demo/List/Tree/DemoContentTemplate'
   ],
   function (Control, template, GridData, MemorySource, Source) {
      'use strict';

      var PopupPage = Control.extend({
         _template: template,
         _actionClicked: '',
         _groupingKeyCallback: null,
         _itemActions: null,
         SelectedKey1: '1',
         _viewSource: null,
         gridData: null,
         gridColumns: null,
         showType: null,
         _source1: null,
         _beforeMount: function(opts) {
            this._source1 = new Source.Memory({
               idProperty: 'id',
               data: [
                  {
                     id: '1',
                     title: 'Document',
                     align: 'left',
                     isMainTab: true
                  },
                  {
                     id: '2',
                     title: 'Files',
                     align: 'left'
                  },
                  {
                     id: '3',
                     title: 'Orders',
                     align: 'left'
                  },
                  {
                     id: '4',
                     title: 'Productions'
                  },
                  {
                     id: '5',
                     title: 'Employees'
                  },
                  {
                     id: '6',
                     title: 'Groups'
                  },
                  {
                     id: '7',
                     title: 'Photos'
                  },
                  {
                     id: '8',
                     title: 'Videos'
                  }
               ]
            });
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
