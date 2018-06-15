define('Controls-demo/Browser/Browser', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/Browser/Browser',
   'Controls/Browser',
   'Controls-demo/Browser/resources/listTemplate'
], function(Control, Memory, template) {
   'use strict';

   var sourceData = [
      { id: 1, title: 'Sasha'},
      { id: 2, title: 'Dmitry'},
      { id: 3, title: 'Andrey'},
      { id: 4, title: 'Aleksey'},
      { id: 5, title: 'Sasha'},
      { id: 6, title: 'Ivan'},
      { id: 7, title: 'Petr'},
      { id: 8, title: 'Roman'},
      { id: 9, title: 'Maxim'},
      { id: 10, title: 'Andrey'},
      { id: 12, title: 'Sasha'},
      { id: 13, title: 'Sasha'},
      { id: 14, title: 'Sasha'},
      { id: 15, title: 'Sasha'},
      { id: 16, title: 'Sasha'},
      { id: 17, title: 'Sasha'},
      { id: 18, title: 'Dmitry'},
      { id: 19, title: 'Andrey'},
      { id: 20, title: 'Aleksey'},
      { id: 21, title: 'Sasha'},
      { id: 22, title: 'Ivan'},
      { id: 23, title: 'Petr'}
   ];

   var searchConfig = {
      value: ''
   };

   var ModuleClass = Control.extend(
      {
         _template: template,

         _searchConfig: searchConfig,

         _source: new Memory({
            idProperty: 'id',
            data: sourceData
         })
      });
   return ModuleClass;
});
