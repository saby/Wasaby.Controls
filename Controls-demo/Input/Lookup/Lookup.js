define('Controls-demo/Input/Lookup/Lookup',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Lookup/Lookup',
      'WS.Data/Source/Memory',
      'Controls/Input/Lookup',
      'css!Controls-demo/Input/Lookup/Collection'
   ],
   function(Control, template, Memory) {
      
      'use strict';
   
      var sourceData = [
         { id: 1, title: 'Sasha', text: 'test'},
         { id: 2, title: 'Dmitry', text: 'test'},
         { id: 3, title: 'Andrey', text: 'test'},
         { id: 4, title: 'Aleksey', text: 'test'},
         { id: 5, title: 'Sasha', text: 'test'},
         { id: 6, title: 'Ivan', text: 'test'},
         { id: 7, title: 'Petr', text: 'test'},
         { id: 8, title: 'Roman', text: 'test'},
         { id: 9, title: 'Maxim', text: 'test'}
      ];
      
      var Lookup = Control.extend({
         _template: template,
         _value: '',
         _value1: '',
         _value2: '',
         _value3: '',
         _value4: '',
         _value5: '',
         _selectedKeys: [1],
         _selectedKeys1: [1],
         _selectedKeys2: [1],
         _selectedKeys3: [1],
         _selectedKeys4: [1],
         _selectedKeys5: [1],
         _source: new Memory({
            data: sourceData,
            idProperty: 'id'
         })
      });
      
      return Lookup;
   });
