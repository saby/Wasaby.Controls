define('Controls-demo/Input/Lookup/LookupPropertyGrid', [
   'Core/Control',
   'wml!Controls-demo/Input/Lookup/LookupPropertyGrid',
   'WS.Data/Source/Memory',
   'Controls-demo/Utils/MemorySourceFilter',
   'Controls-demo/Input/Lookup/LookupData',
   'json!Controls-demo/PropertyGrid/pgtext',
   'css!Controls-demo/Input/Lookup/LookupPropertyGrid'
], function (Control, template, Memory, memorySourceFilter, sourceData, config) {
   'use strict';

   var Lookup = Control.extend({
      _selectedKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      _template: template,
      _content: 'Controls/Selector/Lookup',
      _dataObject: null,
      _sourceNames: null,
      _sourceCars: null,
      _componentOptions: null,
      _metaData: null,
      _suggestTemplate: 'Controls-demo/Input/Lookup/Suggest/SuggestTemplate',
      _lookupTemplate: 'Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector',

      _beforeMount: function () {
         this._sourceNames = new Memory({
            data: sourceData.names,
            idProperty: 'id',
            filter: memorySourceFilter()
         });

         this._sourceCars = new Memory({
            data: sourceData.cars,
            idProperty: 'id',
            filter: memorySourceFilter()
         });

         this._componentOptions = {
            name: 'Lookup',
            autoDropDown: false,
            multiSelect: true,
            multiline: false,
            readOnly: false,
            searchParam: 'title',
            placeholder: 'Input text',
            minSearchLength: '3',
            maxVisibleItems: '7',
            source: this._sourceNames,
            selectedKeys: this._selectedKeys,
            keyProperty: 'id',
            displayProperty: 'title',
            suggestTemplate: {
               templateName: this._suggestTemplate
            },
            lookupTemplate: {
               templateName: this._lookupTemplate
            },
            'itemTemplate.style': 'none',
            'itemTemplate.size': 'm'
         };

         this._dataObject = {
            value: {
               readOnly: true
            },
            displayProperty: {
               keyProperty: 'id',
               displayProperty: 'title',
               placeholder: 'select',
               selectedKey: 1
            },
            'itemTemplate.style': {
               keyProperty: 'id',
               displayProperty: 'title',
               selectedKey: 0
            },
            'itemTemplate.size': {
               keyProperty: 'id',
               displayProperty: 'title',
               selectedKey: 0
            },
            source: {
               items: [
                  {id: '1', title: 'Names', items: this._sourceNames},
                  {id: '2', title: 'Cars', items: this._sourceCars}
               ],
               value: 'Names'
            },
            lookupTemplate: {items: [
               {id: '1', title: 'Template with names', items: {
                  templateName: this._lookupTemplate,
                  templateOptions: {
                     source: this._sourceNames
                  }
               }},
               {id: '2', title: 'Template with cars', items: {
                  templateName: this._lookupTemplate,
                  templateOptions: {
                     source: this._sourceCars
                  }
               }}
            ], value: 'Template with names'}
         };

         this._metaData = config[this._content].properties['ws-config'].options;
      },

      _optionsChanged: function(event, config) {
         var
            options = config.componentOpt,
            pgWrapper = this._children.pgWrapper,
            propertyGrid = pgWrapper._children.PropertyGrid,
            newItemTemplate = 'wml!Controls-demo/Input/Lookup/resources/ItemTemplate_' + options['itemTemplate.style'] + '_' + options['itemTemplate.size'];

         if (options.itemTemplate !== newItemTemplate) {
            require([newItemTemplate], function() {
               propertyGrid._notify('itemsChanged', ['itemTemplate', newItemTemplate]);
            });
         }
      }
   });

   return Lookup;
});