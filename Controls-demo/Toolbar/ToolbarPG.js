define('Controls-demo/Toolbar/ToolbarPG',
   [
      'Core/Control',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/PropertyGrid/pgtext',
      'Types/source',
      'wml!Controls-demo/Toolbar/resources/itemTemplate',
      'wml!Controls-demo/Toolbar/resources/itemTemplateCustom',
      'wml!Controls-demo/Toolbar/resources/itemTemplateContent',

      'css!Controls-demo/Filter/Button/PanelVDom',
      'css!Controls-demo/Input/resources/VdomInputs',
      'css!Controls-demo/Wrapper/Wrapper'
   ],

   function(Control, template, config, sourceLib, itemTmpl) {
      'use strict';
      var ToolbarPG = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/toolbars:View',
         _dataObject: null,
         _componentOptions: null,
         _beforeMount: function() {
            this._source2 = new sourceLib.Memory({
               title: 'source1',
               idProperty: 'id',
               data: [
                  {
                     id: '1',
                     showType: 2,
                     icon: 'icon-Time icon-medium',
                     '@parent': false,
                     parent: null
                  },
                  {
                     id: '3',
                     icon: 'icon-Print icon-medium',
                     title: 'Распечатать',
                     '@parent': false,
                     parent: null
                  },
                  {
                     id: '4',
                     buttonIcon: 'icon-medium icon-Linked',
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
                     icon: 'icon-Link icon-medium',
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
                     parent: '4',
                     itemTemplateProperty: 'customTemplate',
                     customTemplate: 'wml!Controls-demo/Toolbar/resources/itemTemplateCustom'
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
            this._source = new sourceLib.Memory({
               title: 'source2',
               idProperty: 'id',
               displayProperty: 'caption',
               data: [
                  {
                     id: '1',
                     showType: 2,
                     icon: 'icon-Time icon-medium'
                  },
                  {
                     id: '2',
                     showType: 2,
                     icon: 'icon-Linked icon-medium',
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
                        template: 'Controls/toolbars:ItemTemplate'
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
                  value: 'customTemplate',
                  keyProperty: 'id',
                  displayProperty: 'title',
                  selectedKey: 0
               },
               itemsSpacing: {
                  readOnly: false,
                  value: 'medium',
                  items: [
                     {
                        id: '1',
                        title: 'big',
                        value: 'big'
                     },
                     {
                        id: '2',
                        title: 'medium',
                        value: 'medium'
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
               itemTemplateProperty: 'customTemplate',
               itemsSpacing: 'big'
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return ToolbarPG;
   });
