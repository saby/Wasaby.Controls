define('Controls-demo/List/TreeGrid/ItemTemplatePG',
   [
      'Core/Control',
      'Types/source',
      'Controls-demo/List/TreeGrid/resources/DataDemoPG',

      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/List/TreeGrid/resources/ItemTemplatePG/cfg',

      'wml!Controls-demo/List/TreeGrid/resources/ItemTemplatePG/ExpanderIconSizeSmall',
      'wml!Controls-demo/List/TreeGrid/resources/ItemTemplatePG/ExpanderIconSizeLarge',
      'wml!Controls-demo/List/TreeGrid/resources/ItemTemplatePG/expanderIconNone',
      'wml!Controls-demo/List/TreeGrid/resources/ItemTemplatePG/expanderIconNode',
      'wml!Controls-demo/List/TreeGrid/resources/ItemTemplatePG/expanderIconHiddenNode'

   ],
   function(Control, TSource, data, template, config) {
      'use strict';
      var Component = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/_treeGrid/TreeGrid',
         _dataObject: null,
         _componentOptions: null,

         _beforeMount: function() {

            this._dataObject = {
               itemTemplate: {
                  readOnly: false,
                  value: 'default',
                  items: [
                     {
                        id: '1',
                        title: 'default',
                        value: 'Controls/treeGrid:ItemTemplate'
                     },
                     {
                        id: '2',
                        title: 'small expander icon',
                        value: 'wml!Controls-demo/List/TreeGrid/resources/ItemTemplatePG/ExpanderIconSizeSmall'
                     },
                     {
                        id: '3',
                        title: 'large expander icon',
                        value: 'wml!Controls-demo/List/TreeGrid/resources/ItemTemplatePG/ExpanderIconSizeLarge'
                     },
                     {
                        id: '4',
                        title: 'without expander icon',
                        value: 'wml!Controls-demo/List/TreeGrid/resources/ItemTemplatePG/expanderIconNone'
                     },
                     {
                        id: '5',
                        title: 'expander icon \'node\'',
                        value: 'wml!Controls-demo/List/TreeGrid/resources/ItemTemplatePG/expanderIconNode'
                     },
                     {
                        id: '6',
                        title: 'expander icon \'hidden node\'',
                        value: 'wml!Controls-demo/List/TreeGrid/resources/ItemTemplatePG/expanderIconHiddenNode'
                     }
                  ]
               }
            };
            this._componentOptions = {
               name: 'BasePG',
               source: new TSource.Memory({
                  idProperty: 'id',
                  data: data.smallCatalog
               }),
               markedKey: '2',
               keyProperty: 'id',
               columns: data.catalogColumns,
               displayProperty: 'title',
               parentProperty: 'parent',
               nodeProperty: 'type',
               itemTemplate: 'Controls/treeGrid:ItemTemplate'
            };

            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });

      return Component;
   });

