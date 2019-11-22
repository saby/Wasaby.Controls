define('Controls-demo/Input/Dropdown/Dropdown', [
   'Core/Control',
   'wml!Controls-demo/Input/Dropdown/Dropdown',
   'Types/source',
   'Controls-demo/Input/Dropdown/historySourceDropdown',
   'Controls/Constants',
   'wml!Controls-demo/Input/Dropdown/itemTemplateDropdown',
   'css!Controls-demo/Input/Dropdown/Dropdown',
   'Controls/dropdown',
   'wml!Controls-demo/Input/Dropdown/itemTemplateDropdownSub',
   'wml!Controls-demo/Input/Dropdown/contentTemplateDropdownIcon',
   'wml!Controls-demo/Input/Dropdown/footerTemplateDropdown',
   'wml!Controls-demo/Input/Dropdown/footerHierarchyItem',
   'wml!Controls-demo/Input/Dropdown/StackTemplateDdl'
], function(Control, template, source, historySource, ControlsConstants) {

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
      _hierarchyFooterItems: null,
      _defaultItems: null,
      _historySource: null,
      _selectedKeysHistoryMulti: null,
      _emptyItems2: null,
      _longItems: null,
      _multiSelectItems: null,
      _groupItems: null,
      _groupTextItems: null,
      _groupHierarchyItems: null,
      _oneItem: null,
      _itemsWithDescription: null,
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
      _selectedKeysFooterHierarchy: null,
      _selectedKeysReadOnly: null,
      _selectedKeys0: null,
      _selectedKeys1: null,
      _selectedKeys2: null,
      _selectedKeysHistory: null,
      _historySourceMulti: null,
      _selectedKeysEmpty2: null,
      _selectedKeysLong: null,
      _selectedKeysMultiSelect: null,
      _selectedKeysMultiSelect2: null,
      _selectedKeysMultiSelect3: null,
      _selectedKeysMultiSelect4: null,
      _selectedKeysMultiSelect5: null,
      _selectedKeysGroup: null,
      _selectedKeysGroupText: null,
      _selectedKeysGroupHierarchy: null,
      _selectedKeyOneItem: null,
      _selectedKeysOneEmpty: null,
      _selectedKeysWithDescription: null,


      _beforeMount: function() {
         this._simpleItems = [
            {id: 1, title: 'All directions'},
            {id: 2, title: 'Incoming'},
            {id: 3, title: 'Outgoing'}
         ];
         this._oneItem = [
            {id: 1, title: 'All directions'}
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
            {id: 1, title: 'In the work', icon: 'icon-Trade'},
            {id: 2, title: 'It is planned', icon: 'icon-Sandclock'},
            {id: 3, title: 'Completed', iconStyle: 'success', icon: 'icon-Successful'},
            {id: 4, title: 'Not done', iconStyle: 'danger', icon: 'icon-Decline'}
         ];

         this._myTemplateItems = [
            {id: 1, title: 'Subdivision'},
            {id: 2, title: 'Separate unit', iconStyle: 'secondary', icon: 'icon-size icon-16 icon-Company',
               comment: 'A territorially separated subdivision with its own address. For him, you can specify a legal entity'},
            {id: 3, title: 'Working group', icon: 'icon-size icon-16 icon-Groups icon-primary',
               comment: 'It is not a full-fledged podcasting, it serves for grouping. As a unit, the employees will have a higher department or office'}
         ];

         this._emptyItems = [
            {id: 1, title: 'Yaroslavl'},
            {id: 2, title: 'Moscow'},
            {id: 3, title: 'St-Petersburg'}
         ];

         this._emptyItems2 = [
            {id: 1, title: 'Yaroslavl'},
            {id: 2, title: 'Moscow'},
            {id: 3, title: 'St-Petersburg'}
         ];

         this._titleItems = [
            {id: 1, title: 'Name', icon: 'icon-small icon-TrendUp'},
            {id: 2, title: 'Date of change', icon: 'icon-small icon-TrendDown'}
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

         this._hierarchyFooterItems = [
            {id: 1, title: 'Task in development', parent: null, '@parent': false},
            {id: 2, title: 'Error in development', parent: null, '@parent': false},
            {id: 3, title: 'Application', parent: null, '@parent': false},
            {id: 4, title: 'Assignment', parent: null, '@parent': true},
            {id: 5, title: 'Approval', parent: null, '@parent': false},
            {id: 6, title: 'Coordination', parent: null, '@parent': true},
            {id: 7, title: 'Working out', parent: null, '@parent': false},
            {id: 8, title: 'Assignment for accounting', parent: 4, '@parent': false},
            {id: 9, title: 'Assignment for delivery', parent: 4, '@parent': false},
            {id: 10, title: 'Assignment for logisticians', parent: 4, '@parent': false},
            { id: 11, title: 'Coordination', parent: 6 },
            { id: 12, title: 'Negotiate the discount', parent: 6 },
            { id: 13, title: 'Coordination of change prices', parent: 6 },
            { id: 14, title: 'Matching new dish', parent: 6}
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
         this._longItems = [
            { id: 1, title: 'At work, found an employee' },
            { id: 2, title: 'At work, the client said' },
            { id: 3, title: 'On the test bench' }
         ];
         this._multiSelectItems = [
            { id: 1, title: 'Banking and financial services, credit' },
            { id: 2, title: 'Gasoline, diesel fuel, light oil products', comment: 'comment' },
            { id: 3, title: 'Transportation, logistics, customs' },
            { id: 4, title: 'Oil and oil products', comment: 'comment' },
            { id: 5, title: 'Pipeline transportation services', comment: 'comment' },
            { id: 6, title: 'Services in tailoring and repair of clothes, textiles' },
            { id: 7, title: 'Computers and components, computing, office equipment' }
         ];
         this._groupItems = [
            { id: 1, title: 'Add', icon: 'icon-small icon-Bell' },
            {
               id: 2, title: 'Vacation', iconStyle: 'success', icon: 'icon-small icon-Vacation', group: '2'
            },
            {
               id: 3, title: 'Time off', icon: 'icon-small icon-SelfVacation', group: '2'
            },
            {
               id: 4, title: 'Hospital', icon: 'icon-small icon-Sick', group: '2'
            },
            {
               id: 5, title: 'Business trip', icon: 'icon-small icon-statusDeparted', group: '2'
            }
         ];
         this._groupTextItems = [
            { id: 1, title: 'Project', group: 'Select' },
            { id: 2, title: 'Work plan', group: 'Select' },
            { id: 3, title: 'Task', group: 'Select' },
            { id: 4, title: 'Merge request', group: 'Create' },
            { id: 5, title: 'Meeting', group: 'Create' },
            { id: 6, title: 'Video meeting', group: 'Create' }
         ];
         this._groupHierarchyItems = [
            {id: 1, title: 'Task in development', parent: null, '@parent': false},
            {id: 2, title: 'Error in development', parent: null, '@parent': false},
            {id: 3, title: 'Application', parent: null, '@parent': false, group: '1'},
            {id: 4, title: 'Assignment', parent: null, '@parent': true, group: '1'},
            {id: 5, title: 'Approval', parent: null, '@parent': false, group: '1'},
            {id: 6, title: 'Coordination', parent: null, '@parent': true},
            {id: 7, title: 'Working out', parent: null, '@parent': false, group: '1'},
            {id: 8, title: 'Assignment for accounting', parent: 4, '@parent': false},
            {id: 9, title: 'Assignment for delivery', parent: 4, '@parent': false},
            {id: 10, title: 'Assignment for logisticians', parent: 4, '@parent': false, group: '3'},
            { id: 11, title: 'Coordination', parent: 6, group: 'coord' },
            { id: 12, title: 'Negotiate the discount', parent: 6, group: 'coord' },
            { id: 13, title: 'Coordination of change prices', parent: 6, group: 'coord' },
            { id: 14, title: 'Matching new dish', parent: 6, group: 'coord' }
         ];
         this._itemsWithDescription = [
            { id: 1, title: 'adaptive', description: 'infrequently used accordion sections are hidden' },
            { id: 2, title: 'full', description: 'all accordion sections are visible' }
         ];
         this._historySource = historySource.createMemory();
         this._historySourceMulti = historySource.createMemory();
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
         this._selectedKeysFooterHierarchy = [1];
         this._selectedKeysReadOnly = ['4'];
         this._selectedKeys0 = ['1'];
         this._selectedKeys1 = ['1'];
         this._selectedKeys2 = ['1'];
         this._selectedKeysHistory = [1];
         this._selectedKeysHistoryMulti = [1];
         this._selectedKeysEmpty2 = [2];
         this._selectedKeysLong = [2];
         this._selectedKeysMultiSelect = [1];
         this._selectedKeysMultiSelect2 = [6, 7];
         this._selectedKeysMultiSelect3 = [];
         this._selectedKeysMultiSelect4 = [1];
         this._selectedKeysMultiSelect5 = [1];
         this._selectedKeysGroup = [1];
         this._selectedKeysGroupText = [1];
         this._selectedKeysGroupHierarchy = [1];
         this._selectedKeyOneItem = [1];
         this._selectedKeysOneEmpty = [1];
         this._selectedKeysWithDescription = [1];
      },
      _createMemory: function(items) {
         return new source.Memory({
            keyProperty: 'id',
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
      },

      _groupingKeyCallback: function(item) {
         if (item.get('group') === 'hidden' || !item.get('group')) {
            return ControlsConstants.view.hiddenGroup;
         }
         return item.get('group');
      }
   });
   return DropdownDemo;
});
