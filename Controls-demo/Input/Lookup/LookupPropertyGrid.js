define('Controls-demo/Input/Lookup/LookupPropertyGrid',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Lookup/LookupPropertyGrid',
      'WS.Data/Source/Memory',
      'Controls-demo/Utils/MemorySourceFilter',
      'Controls-demo/Input/Lookup/LookupData',
      'json!Controls-demo/PropertyGrid/pgtext',
      'Controls/Input/Lookup',
      'css!Controls-demo/Input/Lookup/Collection',
      'css!Controls-demo/Input/Lookup/LookupPropertyGrid'
   ],
   function(Control, template, Memory, memorySourceFilter, sourceData, config) {
      'use strict';

      var Lookup = Control.extend({
         _template: template,
         _content: 'Controls/Input/Lookup',
         _dataObject: null,
         _componentOptions: null,
         _metaData: null,
         _currentSource: 'names',
         _suggestTemplate: 'Controls-demo/Input/Lookup/Suggest/SuggestTemplate',
         _lookupTemplate: 'Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector',

         _beforeMount: function() {
            this._componentOptions = {
               name: 'LookUp',
               readOnly: false,
               searchParam: 'title',
               placeholder: 'Input text',
               source: new Memory({
                  data: sourceData[this._currentSource],
                  idProperty: 'id',
                  filter: memorySourceFilter()
               }),
               keyProperty: 'id',
               displayProperty: 'title',
               suggestTemplate: {
                  templateName: this._suggestTemplate
               },
               lookupTemplate: {
                  templateName: this._lookupTemplate
               }
            };
            this._dataObject = {
               displayProperty: {
                  selectedKey: 1,
                  displayProperty: 'title',
                  keyProperty: 'id'
               },
               keyProperty: {
                  selectedKey: 2,
                  displayProperty: 'title',
                  keyProperty: 'id'
               },
               source: {
                  items: [
                     {id: '1', title: 'Names'},
                     {id: '2', title: 'Cars'}
                  ],
                  value: 'Names'
               }
            };
            this._metaData = config[this._content].properties['ws-config'].options;
         },

         _optionsChanged: function(event, options) {
            var sourceName = options.description.source.value.toLowerCase();

            if (sourceData[sourceName] && sourceName !== this._currentSource) {
               this._currentSource = sourceName;
               this._componentOptions.source = new Memory({
                  data: sourceData[sourceName],
                  idProperty: 'id',
                  filter: memorySourceFilter()
               });
            }
         }
      });
      
      return Lookup;
   });
