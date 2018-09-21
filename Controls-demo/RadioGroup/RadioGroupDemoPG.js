define('Controls-demo/RadioGroup/RadioGroupDemoPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'tmpl!Controls-demo/PropertyGrid/PropertyGridTemplate',
      'json!Controls-demo/PropertyGrid/pgtext',
      'WS.Data/Source/Memory',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, template, myTmpl, config, MemorySource) {
      'use strict';
      var SwitchDemoPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Toggle/RadioGroup',
         _my: myTmpl,
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
                     caption: 'Additional caption1'
                  },
                  {
                     id: 2,
                     title: 'Title2',
                     caption: 'Additional caption2'
                  },
                  {
                     id: 3,
                     title: 'Title3',
                     templateTwo: 'wml!Controls-demo/RadioGroup/resources/SingleItemTemplate',
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
               source: {
                  type: 'enum',
                  emptyText: false,
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0,
                  enum: {
                     source1: this._source,
                     source2: this._source2
                  }
               },
               direction: {
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               selectedKey: {
                  precision: 0,
                  onlyPositive: true
               },
               keyProperty: {
                  readOnly: true
               },
               itemTemplate: {
                  readOnly: true,
                  value: 'default item template'
               },
               itemTemplateProperty: {
                  readOnly: true,
                  value: 'default item template property'
               }
            };
            this._componentOptions = {
               selectedKey: 1,
               readOnly: false,
               direction: 'horizontal',
               source: this._source,
               keyProperty: 'id',
               placeholder: 'select',
               displayProperty: 'title',
               name: 'RadioGroup'
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return SwitchDemoPG;
   });
