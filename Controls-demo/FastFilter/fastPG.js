define('Controls-demo/FastFilter/fastPG',
   [
      'Core/Control',
      'wml!Controls-demo/FastFilter/fastPG',
      'json!Controls-demo/PropertyGrid/pgtext',
      'WS.Data/Source/Memory'
   ],

   function(Control, template, config, Memory) {
      'use strict';
      var fastPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Filter/Fast',
         _dataObject: null,
         _itemsProjects: null,
         _itemsMeeting: null,
         _sourceDialog: null,
         _sourceContacts: null,
         _eventType: 'filterChanged',
         _nameOption: 'filter',
         _componentOptions: null,
         _beforeMount: function() {
            this._itemsProjects = [
               {
                  id: 'own',
                  resetValue: 'All projects',
                  value: 'All projects',
                  properties: {
                     keyProperty: 'title',
                     displayProperty: 'title',
                     source: new Memory({
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
                  id: 'type',
                  resetValue: 0,
                  value: 0,
                  properties: {
                     keyProperty: 'key',
                     displayProperty: 'title',
                     source: new Memory({
                        data: [
                           { key: 0, title: 'All status' },
                           { key: 1, title: 'Planning' },
                           { key: 2, title: 'In progress' },
                           { key: 3, title: 'Done' },
                           { key: 4, title: 'Not done' }
                        ]
                     })
                  }
               }
            ];
            this._itemsMeeting = [
               {
                  id: 'type',
                  resetValue: 'All types',
                  value: 'All types',
                  properties: {
                     keyProperty: 'title',
                     displayProperty: 'title',
                     source: new Memory({
                        data: [
                           { key: 0, title: 'All types' },
                           { key: 1, title: 'Meeting' },
                           { key: 2, title: 'Videoconference' }
                        ]
                     })
                  }
               },
               {
                  id: 'type',
                  resetValue: 0,
                  value: 0,
                  properties: {
                     keyProperty: 'key',
                     displayProperty: 'title',
                     source: new Memory({
                        data: [
                           { key: 0, title: 'Participating' },
                           { key: 1, title: 'Accepted' },
                           { key: 2, title: 'Declined' },
                           { key: 3, title: 'Haven\'t replied' },
                           { key: 4, title: 'Organizing' }
                        ]
                     })
                  }
               }
            ];
            this._sourceDialog = new Memory({
               idProperty: 'id',
               data: [
                  {
                     id: 'type',
                     resetValue: '0',
                     value: '0',
                     properties: {
                        keyProperty: 'id',
                        displayProperty: 'title',
                        source: new Memory({
                           idProperty: 'id',
                           data: [
                              { id: '0', title: 'By dialog' },
                              { id: '1', title: 'As list' }
                           ]
                        })
                     }
                  }
               ]
            });
            this._sourceContacts = new Memory({
               idProperty: 'id',
               data: [
                  {
                     id: 'type',
                     resetValue: '0',
                     value: '0',
                     properties: {
                        keyProperty: 'id',
                        displayProperty: 'title',
                        source: new Memory({
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
            this._dataObject = {
               items: {
                  items: [
                     { id: '0', title: 'Not specified', items: null },
                     { id: '1', title: 'Fast filter for projects', items: this._itemsProjects },
                     { id: '2', title: 'Filter in 2', items: this._itemsMeeting }
                  ],
                  value: 'Fast filter for projects'
               },
               source: {
                  items: [
                     { id: '0', title: 'Not specified', items: null },
                     { id: '1', title: 'Fast filter for dialogs', items: this._sourceDialog },
                     { id: '2', title: 'Fast filter for contacts', items: this._sourceContacts }
                  ],
                  value: ''
               }
            };
            this._componentOptions = {
               name: 'FastFilter',
               filter: null,
               items: this._itemsProjects,
               source: this._source
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return fastPG;
   });
