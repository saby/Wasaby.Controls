define('Controls-demo/Input/Lookup/LookupPropertyGrid', [
   'Core/Control',
   'tmpl!Controls-demo/PropertyGrid/DemoPG',
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
            }
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
            source: {
               items: [
                  {id: '1', title: 'Names', items: this._sourceNames},
                  {id: '2', title: 'Cars', items: this._sourceCars}
               ],
               value: 'Names'
            }
         };

         this._metaData = config[this._content].properties['ws-config'].options;
      }
   });

   return Lookup;
});