define('Controls-demo/Input/Lookup/LookupPropertyGrid',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Lookup/LookupPropertyGrid',
      'WS.Data/Source/Memory',
      'Controls-demo/Utils/MemorySourceFilter',
      'Controls/Input/Lookup',
      'css!Controls-demo/Input/Lookup/Collection',
      'css!Controls-demo/Input/Lookup/LookupPropertyGrid'
   ],
   function(Control, template, Memory, memorySourceFilter) {
      
      'use strict';
      
      var sourceData = [
         { id: 1, title: 'Sasha', text: 'test'},
         { id: 2, title: 'Dmitry', text: 'test'},
         { id: 3, title: 'Andrey', text: 'test'},
         { id: 4, title: 'Sasha длинный очень текст, Sasha длинный очень текст, Sasha длинный очень текст, Sasha длинный очень текст, Sasha длинный очень текст,', text: 'test'},
         { id: 5, title: 'Aleksey', text: 'test'},
         { id: 6, title: 'Sasha', text: 'test'},
         { id: 7, title: 'Ivan', text: 'test'},
         { id: 8, title: 'Petr', text: 'test'},
         { id: 9, title: 'Roman', text: 'test'},
         { id: 10, title: 'Maxim', text: 'test'},
      ];
      
      var sizes = [
         {size: 'default'},
         {size: 'm'},
         {size: 'l'},
         {size: 'h'},
      ];
      
      var styles = [
         {style: 'default'},
         {style: 'bold'},
         {style: 'accent'},
         {style: 'primary'},
      ];
      
      var Lookup = Control.extend({
         _template: template,
         _value: '',
         _selectedKeys: [4],
         _source: new Memory({
            data: sourceData,
            idProperty: 'id',
            filter: memorySourceFilter()
         }),
         _readOnly: false,
         
         _styleSource: new Memory({
            data: styles,
            idProperty: 'style'
         }),
         _sizeSource: new Memory({
            data: sizes,
            idProperty: 'size'
         }),
         
         _style: 'default',
         _size: 'default'
      });
      
      return Lookup;
   });
