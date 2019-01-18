define('Controls-demo/List/List/MultiselectPG',
   [
      'Core/Control',
      'WS.Data/Source/Memory',
      'Controls-demo/List/List/resources/DataDemoPG',
      'tmpl!Controls-demo/PropertyGrid/DemoPG',
      'json!Controls-demo/List/List/resources/MultiselectPG/cfg'
   ],
   function(Control, MemorySource, data, template, config) {
      'use strict';
      var Component = Control.extend({
         _template: template,
         _metaData: null,
         _content: 'Controls/List',
         _dataObject: null,
         _componentOptions: null,

         _beforeMount: function() {
            this._dataObject = {};
            this._componentOptions = {
               keyProperty: 'id',
               name: 'MultiSelectPG',
               source: new MemorySource({
                  idProperty: 'id',
                  data: data.gadgets
               }),
               selectedKeys: [],
               excludedKeys: [],
               multiSelectVisibility: 'visible'
            };

            this._metaData = config[this._content].properties['ws-config'].options;
         }
      });
      return Component;
   });
