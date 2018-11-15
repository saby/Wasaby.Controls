define('Controls-demo/Buttons/SelectorButtonPG', [
   'Core/Control',
   'tmpl!Controls-demo/PropertyGrid/DemoPG',
   'WS.Data/Source/Memory',
   'Controls-demo/Utils/MemorySourceFilter',
   'Controls-demo/Input/Lookup/LookupData',
   'json!Controls-demo/PropertyGrid/pgtext'
], function (Control, template, Memory, memorySourceFilter, sourceData, config) {
   'use strict';

   return Control.extend({
      _selectedKeys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      _template: template,
      _content: 'Controls/Selector/Button',
      _dataObject: null,
      _sourceNames: null,
      _sourceCars: null,
      _componentOptions: null,
      _metaData: null,
      _templateName: 'Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector',

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
            name: 'SelectorButton',
            caption: 'Selected',
            multiSelect: true,
            readOnly: false,
            maxVisibleItems: '7',
            source: this._sourceNames,
            selectedKeys: this._selectedKeys,
            keyProperty: 'id',
            displayProperty: 'title',
            templateName: this._templateName
         };

         this._dataObject = {
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
});