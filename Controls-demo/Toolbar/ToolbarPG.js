define('Controls-demo/Toolbar/ToolbarPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/PropertyGrid/pgtext',
      'WS.Data/Source/Memory',
      'wml!Controls-demo/Toolbar/resources/itemTemplate',
      'wml!Controls-demo/Toolbar/resources/itemTemplateContent',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, template, config, MemorySource, itemTmpl) {
      'use strict';
      var ToolbarPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/Toolbar',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._source2 = new MemorySource({
               title: 'source1',
               idProperty: 'id',
               data: [
                  {
                     id: '1',
                     showType: 2,
                     icon: 'icon-Time',
                     '@parent': false,
                     parent: null
                  },
                  {
                     id: '3',
                     icon: 'icon-Print',
                     title: 'Распечатать',
                     '@parent': false,
                     parent: null
                  },
                  {
                     id: '4',
                     buttonIcon: 'icon-24 icon-Linked',
                     buttonStyle: 'secondary',
                     buttonViewMode: 'toolButton',
                     buttonIconStyle: 'secondary',
                     buttonTransparent: false,
                     title: 'Связанные документы',
                     '@parent': true,
                     parent: null
                  },
                  {
                     id: '5',
                     buttonViewMode: 'icon',
                     icon: 'icon-Link',
                     title: 'Скопировать в буфер',
                     '@parent': false,
                     parent: null
                  },
                  {
                     id: '6',
                     showType: 0,
                     title: 'Прикрепить к',
                     '@parent': false,
                     parent: null
                  },
                  {
                     id: '7',
                     showType: 0,
                     title: 'Проекту',
                     '@parent': false,
                     parent: '4'
                  },
                  {
                     id: '8',
                     showType: 0,
                     title: 'Этапу',
                     '@parent': false,
                     parent: '4'
                  }
               ]
            });
            this._source = new MemorySource({
               title: 'source2',
               idProperty: 'id',
               displayProperty: 'caption',
               data: [
                  {
                     id: '1',
                     showType: 2,
                     icon: 'icon-Time'
                  },
                  {
                     id: '2',
                     showType: 2,
                     icon: 'icon-Linked',
                     title: 'Связанные документы',
                     myTemplate: itemTmpl
                  },
                  {
                     id: '3',
                     showType: 2,
                     title: 'Скопировать в буфер'
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
                  displayType: 'source',
                  enum: {
                     source1: this._source,
                     source2: this._source2
                  }
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
                        template: 'wml!Controls-demo/Toolbar/resources/itemTemplate'
                     },
                     {
                        id: '2',
                        title: 'Default template',
                        template: 'wml!Controls/Toolbar/ToolbarItemTemplate'
                     }
                  ]
               },
               nodeProperty: {
                  readOnly: false,
                  value: '@parent',
                  items: [
                     {
                        id: '1',
                        title: '@noParent',
                        value: '@noParent'
                     },
                     {
                        id: '2',
                        title: '@parent',
                        value: '@parent'
                     }
                  ]
               },
               parentProperty: {
                  readOnly: false,
                  value: 'parent',
                  items: [
                     {
                        id: '1',
                        title: 'noParent',
                        value: 'noParent'
                     },
                     {
                        id: '2',
                        title: 'parent',
                        value: 'parent'
                     }
                  ]
               },
               itemTemplateProperty: {
                  readOnly: false,
                  value: 'default',
                  items: [
                     {
                        id: '1',
                        title: 'default',
                        value: null
                     },
                     {
                        id: '2',
                        title: 'myTemplate',
                        value: 'myTemplate'
                     }
                  ]
               }
            };
            this._componentOptions = {
               selectedKey: 1,
               readOnly: false,
               parentProperty: 'parent',
               nodeProperty: '@parent',
               source: this._source,
               keyProperty: 'id',
               displayProperty: 'title',
               name: 'Toolbar',
               itemTemplate: null,
               itemTemplateProperty: null
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return ToolbarPG;
   });
