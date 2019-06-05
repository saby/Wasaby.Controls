define('Controls-demo/FastFilter/fastPG',
   [
      'Core/Control',
      'wml!Controls-demo/FastFilter/fastPG',
      'json!Controls-demo/PropertyGrid/pgtext',
      'Types/source'
   ],

   function(Control, template, config, sourceLib) {
      'use strict';
      var fastPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/filter:Fast',
         _dataObject: null,
         _sourceProjects: null,
         _sourceContacts: null,
         _sourceMulti: null,
         _eventType: 'filterChanged',
         _nameOption: 'filter',
         _componentOptions: null,
         _beforeMount: function() {
            this._sourceProjects = new sourceLib.Memory({
               idProperty: 'id',
               data: [
                  {
                     id: 'type',
                     resetValue: 'All projects',
                     value: 'All projects',
                     properties: {
                        keyProperty: 'title',
                        displayProperty: 'title',
                        source: new sourceLib.Memory({
                           data: [
                              { key: 0, title: 'All projects' },
                              { key: 1, title: 'My projects' },
                              { key: 2, title: 'Department project' },
                              { key: 3, title: 'Me as owner' }
                           ]
                        })
                     }
                  },
                  {
                     id: 'status',
                     resetValue: 0,
                     value: 0,
                     properties: {
                        keyProperty: 'key',
                        displayProperty: 'text',
                        source: new sourceLib.Memory({
                           data: [
                              { key: 0, text: 'All status' },
                              { key: 1, text: 'Planning' },
                              { key: 2, text: 'In progress' },
                              { key: 3, text: 'Done' },
                              { key: 4, text: 'Not done' }
                           ]
                        })
                     }
                  }
               ]
            });
            this._sourceContacts = new sourceLib.Memory({
               idProperty: 'id',
               data: [
                  {
                     id: 'type',
                     resetValue: '0',
                     value: '0',
                     properties: {
                        keyProperty: 'id',
                        displayProperty: 'title',
                        source: new sourceLib.Memory({
                           idProperty: 'id',
                           data: [
                              { id: '0', title: 'In my circle' },
                              { id: '1', title: 'All contacts' }
                           ]
                        })
                     }
                  }
               ]
            });
            this._sourceMulti = new sourceLib.Memory({
               idProperty: 'id',
               data: [
                  {
                     id: 'type',
                     resetValue: [1],
                     value: [1],
                     properties: {
                        keyProperty: 'id',
                        displayProperty: 'title',
                        multiSelect: true,
                        source: new sourceLib.Memory({
                           idProperty: 'id',
                           data: [
                              { id: 1, title: 'Banking and financial services, credit' },
                              { id: 2, title: 'Gasoline, diesel fuel, light oil products' },
                              { id: 3, title: 'Transportation, logistics, customs' },
                              { id: 4, title: 'Oil and oil products' },
                              { id: 5, title: 'Pipeline transportation services' },
                              { id: 6, title: 'Services in tailoring and repair of clothes, textiles' },
                              { id: 7, title: 'Computers and components, computing, office equipment' }
                           ]
                        })
                     }
                  }
               ]
            });
            this._dataObject = {
               source: {
                  items: [
                     { id: '1', title: 'Fast filter for projects', items: this._sourceProjects },
                     { id: '2', title: 'Fast filter for contacts', items: this._sourceContacts },
                     { id: '3', title: 'Fast filter with multiSelect', items: this._sourceMulti }
                  ],
                  value: 'Fast filter for contacts'
               }
            };
            this._componentOptions = {
               name: 'FastFilter',
               filter: null,
               source: this._sourceContacts
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return fastPG;
   });
