define('Controls-demo/Tabs/ButtonsDemoPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/PropertyGrid/pgtext',
      'WS.Data/Source/Memory',
      'wml!Controls-demo/Tabs/Buttons/resources/mainTemplate',
      'wml!Controls-demo/Tabs/Buttons/resources/tabSpaceTemplateButton',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, template, config, MemorySource) {
      'use strict';
      var SwitchDemoPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Tabs/Buttons',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._source2 = new MemorySource({
               title: 'source1',
               idProperty: 'id',
               data: [
                  {
                     id: 1,
                     title: 'Header1',
                     caption: 'Caption1'
                  },
                  {
                     id: 2,
                     title: 'Header2',
                     caption: 'Caption2'
                  },
                  {
                     id: 3,
                     title: 'Header3',
                     caption: 'Caption3'
                  },
                  {
                     id: 4,
                     title: 'Header4',
                     caption: 'Caption4'
                  }
               ]
            });
            this._source = new MemorySource({
               title: 'source2',
               idProperty: 'id',
               displayProperty: 'caption',
               data: [
                  {
                     id: 1,
                     title: 'Title1',
                     caption: 'Additional caption1',
                     align: 'left'
                  },
                  {
                     id: 2,
                     title: 'Title2',
                     caption: 'Additional caption2',
                     align: 'left'
                  },
                  {
                     id: 3,
                     title: 'Title3',
                     templateTwo: 'wml!Controls-demo/Tabs/Buttons/resources/mainTemplate',
                     caption: 'Additional caption3'
                  },
                  {
                     id: 4,
                     title: 'Title4',
                     caption: 'Additional caption4'
                  }
               ]
            });
            this._dataObject = {
               readOnly: {
                  readOnly: true
               },
               source: {
                  type: 'enum',
                  emptyText: false,
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0,
                  displayType: 'source',
                  enum: {
                     source1: this._source,
                     source2: this._source2
                  }
               },
               selectedKey: {
                  precision: 0,
                  onlyPositive: true
               },
               keyProperty: {
                  readOnly: true
               },
               itemTemplate: {
                  readOnly: false,
                  value: 'Default template',
                  items: [
                     {
                        id: '1',
                        title: 'Custom template',
                        template: 'wml!Controls-demo/Tabs/Buttons/resources/mainTemplate'
                     },
                     {
                        id: '2',
                        title: 'Default template',
                        template: 'wml!Controls/Tabs/Buttons/ItemTemplate'
                     }
                  ]
               },
               tabSpaceTemplate: {
                  readOnly: false,
                  value: 'Not specified',
                  items: [
                     {
                        id: '1',
                        title: 'With three button',
                        template: 'wml!Controls-demo/Tabs/Buttons/resources/tabSpaceTemplateButton'
                     },
                     {
                        id: '2',
                        title: 'Not specified',
                        template: null
                     }
                  ]
               },
               itemTemplateProperty: {
                  readOnly: false,
                  value: 'Not specified',
                  items: [
                     {
                        id: '1',
                        title: 'templateTwo',
                        value: 'templateTwo'
                     },
                     {
                        id: '2',
                        title: 'Not specified',
                        value: null
                     }
                  ]
               }

            };
            this._componentOptions = {
               selectedKey: 1,
               readOnly: false,
               source: this._source,
               keyProperty: 'id',
               displayProperty: 'title',
               name: 'TabsButtons',
               itemTemplateProperty: null,
               tabSpaceTemplate: null
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return SwitchDemoPG;
   });
