define('Controls-demo/Input/Dropdown/Dropdown', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'Controls-demo/Input/Dropdown//historySourceDropdown',
   'wml!Controls-demo/Input/Dropdown/Dropdown',
   'wml!Controls-demo/Input/Dropdown/itemTemplateDropdown',
   'css!Controls-demo/Input/Dropdown/Dropdown',
   'wml!Controls-demo/Input/Dropdown/contentTemplateDropdown',
   'wml!Controls-demo/Input/Dropdown/contentTemplateDropdownSub',
   'wml!Controls-demo/Input/Dropdown/itemTemplateDropdownSub',
   'wml!Controls-demo/Input/Dropdown/contentTemplateDropdownIcon',
   'wml!Controls-demo/Input/Dropdown/headTemplateDropdown',
   'wml!Controls-demo/Input/Dropdown/footerTemplateDropdown',
   'wml!Controls-demo/Input/Dropdown/StackTemplateDdl'
], function(Control, Memory, historySource, template) {

   'use strict';

   var DropdownDemo = Control.extend({
      _template: template,
      _simpleItems: null,
      _subItems: null,
      _hierarchyItems: null,
      _iconItems: null,
      _myTemplateItems: null,
      _emptyItems: null,
      _titleItems: null,
      _duplicateItems: null,
      _footerItems: null,
      _defaultItems: null,
      _selectedKeysSimple: null,
      _selectedKeysSub: null,
      _selectedKeysHierarchy: null,
      _selectedKeysEmpty: null,
      _selectedKeysIcon: null,
      _selectedKeysScroll: null,
      _selectedKeysMyTemplate: null,
      _selectedKeysTitle: null,
      _selectedKeysDuplicate: null,
      _selectedKeysFooter: null,
      _selectedKeysReadOnly: null,
      _selectedKeys0: null,
      _selectedKeys1: null,
      _selectedKeys2: null,
      _historySource: null,
      _selectedKeysHistory: null,

      _beforeMount: function() {
         this._simpleItems = [
            {id: 1, title: 'All directions'},
            {id: 2, title: 'Incoming'},
            {id: 3, title: 'Outgoing'}
         ];

         this._subItems = [
            {id: 1, title: 'In any state', text: 'In any state'},
            {id: 2, title: 'In progress', text: 'In progress'},
            {id: 3, title: 'Completed', text: 'Completed'},
            {id: 4, title: 'positive', text: 'Completed positive', myTemplate: 'wml!Controls-demo/Input/Dropdown/itemTemplateDropdownSub'},
            {id: 5, title: 'negative', text: 'Completed negative', myTemplate: 'wml!Controls-demo/Input/Dropdown/itemTemplateDropdownSub'},
            {id: 6, title: 'Deleted', text: 'Deleted'},
            {id: 7, title: 'Drafts', text: 'Drafts'}
         ];

         this._hierarchyItems = [
            {id: 1, title: 'Task in development', parent: null, '@parent': false},
            {id: 2, title: 'Error in development', parent: null, '@parent': false},
            {id: 3, title: 'Application', parent: null, '@parent': false},
            {id: 4, title: 'Assignment', parent: null, '@parent': true},
            {id: 5, title: 'Approval', parent: null, '@parent': false},
            {id: 6, title: 'Working out', parent: null, '@parent': false},
            {id: 7, title: 'Assignment for accounting', parent: 4, '@parent': false},
            {id: 8, title: 'Assignment for delivery', parent: 4, '@parent': false},
            {id: 9, title: 'Assignment for logisticians', parent: 4, '@parent': false}
         ];

         this._iconItems = [
            {id: 1, title: 'In the work', icon: 'icon-small icon-Trade icon-primary'},
            {id: 2, title: 'It is planned', icon: 'icon-16 icon-Sandclock icon-primary'},
            {id: 3, title: 'Completed', icon: 'icon-small icon-Successful icon-done'},
            {id: 4, title: 'Not done', icon: 'icon-small icon-Decline icon-error'}
         ];

         this._myTemplateItems = [
            {id: 1, title: 'Subdivision'},
            {id: 2, title: 'Separate unit', icon: 'icon-size icon-16 icon-Company icon-primary',
               comment: 'A territorially separated subdivision with its own address. For him, you can specify a legal entity'},
            {id: 3, title: 'Working group', icon: 'icon-size icon-16 icon-Groups icon-primary',
               comment: 'It is not a full-fledged podcasting, it serves for grouping. As a unit, the employees will have a higher department or office'}
         ];

         this._emptyItems = [
            {id: 1, title: 'Yaroslavl'},
            {id: 2, title: 'Moscow'},
            {id: 3, title: 'St-Petersburg'}
         ];

         this._titleItems = [
            {id: 1, title: 'Name', icon: 'icon-small icon-TrendUp icon-primary'},
            {id: 2, title: 'Date of change', icon: 'icon-small icon-TrendDown icon-primary'}
         ];

         this._duplicateItems = [
            {id: 1, title: 'Payment of tax'},
            {id: 2, title: 'Payment to the supplier'},
            {id: 3, title: 'Settlements with suppliers and buyers'},
            {id: 4, title: 'Settlements with employees'},
            {id: 5, title: 'Transfers of money'},
            {id: 6, title: 'Taxes and payments to the budget'},
            {id: 7, title: 'Loans and credits'}
         ];

         this._footerItems = [
            {id: 1, title: 'Trading'},
            {id: 2, title: 'Software development'},
            {id: 3, title: 'Beauty saloon'}
         ];

         this._defaultItems = [
            {
               id: '1',
               title: 'Запись 1'
            },
            {
               id: '2',
               title: 'Запись 2'
            },
            {
               id: '3',
               title: 'Запись 3'
            },
            {
               id: '4',
               title: 'It is not a full-fledged podcasting, it serves for grouping'
            },
            {
               id: '5',
               title: 'Запись 5'
            },
            {
               id: '6',
               title: 'Запись 6'
            },
            {
               id: '7',
               title: 'Запись 7'
            },
            {
               id: '8',
               title: 'Запись 8'
            }
         ];
         this._historySource = historySource.createMemory();
         this._selectedKeysSimple = [1];
         this._selectedKeysSub = [1];
         this._selectedKeysHierarchy = [8];
         this._selectedKeysEmpty = [2];
         this._selectedKeysIcon = [1];
         this._selectedKeysScroll = [4];
         this._selectedKeysMyTemplate = [1];
         this._selectedKeysTitle = [1];
         this._selectedKeysDuplicate = [4];
         this._selectedKeysFooter = [1];
         this._selectedKeysReadOnly = ['4'];
         this._selectedKeys0 = ['1'];
         this._selectedKeys1 = ['1'];
         this._selectedKeys2 = ['1'];
         this._selectedKeysHistory = [1];
      },
      _createMemory: function(items) {
         return new Memory({
            idProperty: 'id',
            data: items
         });
      },
      _getDefaultMemory: function() {
         return this._createMemory(this._defaultItems);
      },

      _getMultiData: function() {
         var items = [];
         for (var i = 1; i < 16; i++) {
            items.push({
               id: i,
               title: (i < 10 ? '0' + i : i) + ':00'
            });
         }
         return this._createMemory(items);
      },

      footerClickHandler: function() {
         this._children.stack.open({
            opener: this._children.stackButton
         });
      }
   });
   return DropdownDemo;
});
