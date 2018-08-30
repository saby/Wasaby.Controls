define('Controls-demo/Input/Lookup/Lookup',
   [
      'Core/Control',
      'wml!Controls-demo/Input/Lookup/Lookup',
      'WS.Data/Source/Memory',
      'Controls-demo/Utils/MemorySourceFilter',
      'Controls/Input/Lookup',
      'css!Controls-demo/Input/Lookup/Collection',
      'css!Controls-demo/Input/Lookup/Lookup'
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
      
      var Lookup = Control.extend({
         _template: template,
         _value: '',
         _value1: '',
         _value2: '',
         _value3: '',
         _value4: '',
         _value5: '',
         _selectedKeys: [4],
         _selectedKeys1: [4],
         _selectedKeys2: [4],
         _selectedKeys3: [4],
         _selectedKeys4: [4],
         _selectedKeys5: [4],
         _source: new Memory({
            data: sourceData,
            idProperty: 'id',
            filter: memorySourceFilter()
         })
      });
      
      return Lookup;
   });
