define('Controls-demo/Input/Lookup/Collection',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Lookup/Collection',
      'WS.Data/Source/Memory',
      'WS.Data/Source/DataSet',
      'WS.Data/Entity/Model',
      'WS.Data/Collection/RecordSet',
      'css!Controls-demo/Input/Lookup/Collection'
   ],
   function(Control, template, Memory) {
      
      'use strict';
      
      var Collection = Control.extend({
         _template: template,
         
         _sourceMulti: new Memory({
            idProperty: 'id',
            data: [
               {
                  id: 0,
                  title: 'Sasha'
               },
               {
                  id: 1,
                  title: 'Andrey'
               },
               {
                  id: 2,
                  title: 'Dmitry'
               },
               {
                  id: 3,
                  title: 'Aleksey'
               },
               {
                  id: 4,
                  title: 'Maxim'
               }
            ]
         }),
         _sourceSingle: new Memory({
            idProperty: 'id',
            data: [
               {
                  id: 0,
                  title: 'Sasha'
               }
            ]
         })
      });
      
      return Collection;
   });
