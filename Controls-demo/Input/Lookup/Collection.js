define('Controls-demo/Input/Lookup/Collection',
   [
      'Core/Control',
      'tmpl!Controls-demo/Input/Lookup/Collection',
      'WS.Data/Collection/RecordSet',
      'WS.Data/Source/Memory',
      'WS.Data/Source/DataSet',
      'WS.Data/Entity/Model',

      'css!Controls-demo/Input/Lookup/Collection'
   ],
   function(Control, template, RecordSet) {
      
      'use strict';
      var items = [
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
      ];
      var Collection = Control.extend({
         _template: template,
         _sourceMulti: null,
         _sourceSingle: null,
         _beforeMount: function() {
            this._sourceMulti = new RecordSet({
               idProperty: 'id',
               rawData: items
            });
            this._sourceSingle = new RecordSet({
               idProperty: 'id',
               rawData: [
                  {
                     id: 0,
                     title: 'Sasha'
                  }
               ]
            });

         },
      });
      
      return Collection;
   });
