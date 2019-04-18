define('Controls-demo/FilterView/FilterView',
   [
      'Core/Control',
      'wml!Controls-demo/FilterView/FilterView',
      'Types/source',

      'css!Controls-demo/FilterView/FilterView'
   ],

   function(Control, template, sourceLib) {

      'use strict';
      var FilterView = Control.extend({

         _template: template,
         _items: null,

         _beforeMount: function() {
            this._items = [
               {
                  id: 'document',
                  value: null,
                  resetValue: null,
                  textValue: '',
                  emptyText: 'All documents',
                  options: {
                     source: new sourceLib.Memory({
                        idProperty: 'id',
                        data: [
                           {id: 1, title: 'My'},
                           {id: 2, title: 'My department'}
                        ]
                     }),
                     displayProperty: 'title',
                     keyProperty: 'id'
                  }
               }, {
                  id: 'category',
                  value: [1],
                  resetValue: [null],
                  textValue: '',
                  emptyText: 'all categories',
                  options: {
                     source: new sourceLib.Memory({
                        idProperty: 'id',
                        data: [{ id: 1, title: 'Banking and financial services, credit' },
                           { id: 2, title: 'Gasoline, diesel fuel, light oil products' },
                           { id: 3, title: 'Transportation, logistics, customs' },
                           { id: 4, title: 'Oil and oil products' },
                           { id: 5, title: 'Pipeline transportation services' },
                           { id: 6, title: 'Services in tailoring and repair of clothes, textiles' },
                           { id: 7, title: 'Computers and components, computing, office equipment' },
                           { id: 8, title: 'Accounting, audit' },
                           { id: 9, title: 'Marketing and social research' },
                           { id: 10, title: 'Locking and sealing products' }]
                     }),
                     displayProperty: 'title',
                     keyProperty: 'id',
                     multiSelect: true
                  }
               }, {
                  id: 'state',
                  value: [1],
                  resetValue: [null],
                  textValue: '',
                  emptyText: 'all state',
                  options: {
                     source: new sourceLib.Memory({
                        idProperty: 'id',
                        data: [
                           {id: 1, text: 'In any state'},
                           {id: 2, text: 'In progress'},
                           {id: 3, text: 'Completed'},
                           {
                              id: 4,
                              text: 'Completed positive'
                           },
                           {
                              id: 5,
                              text: 'Completed negative'
                           },
                           {id: 6, text: 'Deleted'},
                           {id: 7, text: 'Drafts'}
                        ]
                     }),
                     displayProperty: 'text',
                     keyProperty: 'id',
                     multiSelect: true
                  }
               }
            ];
         }

      });

      return FilterView;
   });
