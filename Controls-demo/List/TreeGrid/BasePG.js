define('Controls-demo/List/TreeGrid/BasePG',
   [
      'Core/Control',
      'Types/source',
      'Controls-demo/List/TreeGrid/resources/DataDemoPG',

      'tmpl!Controls-demo/List/TreeGrid/resources/BasePG/DemoPG',
      'json!Controls-demo/List/TreeGrid/resources/BasePG/cfg'

   ],
   function(Control, TSource, data, template, config) {
      'use strict';
      var Component = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/_treeGrid/View',
         _dataObject: null,
         _componentOptions: null,

         _beforeMount: function() {

            this._dataObject = {

            };
            this._componentOptions = {
               name: 'BasePG',
               source: new TSource.Memory({
                  idProperty: 'id',
                  data: data.catalog
               }),
               markedKey: '2',
               keyProperty: 'id',
               columns: data.catalogColumns,
               displayProperty: 'title',
               parentProperty: 'parent',
               nodeProperty: 'type',
               expandedItems: [],
               collapsedItems: [],
               singleExpand: false,
               header: data.headerColumns
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });

      return Component;
   });

