define('Controls-demo/EngineBrowser/Browser', [
   'Core/Control',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/EngineBrowser/Browser',
   'Controls-demo/Utils/MemorySourceFilter',
   'css!Controls-demo/EngineBrowser/Browser',
   'Controls/EngineBrowser',
   'tmpl!Controls-demo/EngineBrowser/resources/filterPanelAddItemsTemplate',
   'tmpl!Controls-demo/EngineBrowser/resources/filterPanelItemsTemplate',
   'tmpl!Controls-demo/EngineBrowser/resources/filterButtonEngineTemplate',
   'Controls/Container/List',
   'Controls/Search/Input/Container',
   'Controls/Filter/Button/Container',
   'Controls/Filter/Fast/Container'
], function(Control, Memory, template, MemorySourceFilter) {
   'use strict';

   var countries = [
      {key: 1, title: 'Все страны'},
      {key: 2, title: 'USA'},
      {key: 3, title: 'Russia'},
      {key: 4, title: 'UK'},
      {key: 5, title: 'Japan'},
      {key: 6, title: 'China'},
      {key: 7, title: 'Australia'}
   ];

   var sourceData = [
      {id: 1, title: 'Sasha', country: 'USA'},
      {id: 2, title: 'Dmitry', country: 'Russia'},
      {id: 3, title: 'Andrey', country: 'UK'},
      {id: 4, title: 'Aleksey', country: 'China'},
      {id: 5, title: 'Sasha', country: 'UK'},
      {id: 6, title: 'Ivan', country: 'USA'},
      {id: 7, title: 'Petr', country: 'Japan'},
      {id: 8, title: 'Roman', country: 'China'},
      {id: 9, title: 'Maxim', country: 'Japan'},
      {id: 10, title: 'Andrey', country: 'UK'},
      {id: 12, title: 'Sasha', country: 'Russia'},
      {id: 13, title: 'Sasha', country: 'Japan'},
      {id: 14, title: 'Sasha', country: 'USA'},
      {id: 15, title: 'Sasha', country: 'Japan'},
      {id: 16, title: 'Sasha', country: 'Japan'},
      {id: 17, title: 'Sasha', country: 'Russia'},
      {id: 18, title: 'Dmitry', country: 'UK'},
      {id: 19, title: 'Andrey', country: 'USA'},
      {id: 20, title: 'Aleksey', country: 'China'},
      {id: 21, title: 'Sasha', country: 'Russia'},
      {id: 22, title: 'Ivan', country: 'USA'},
      {id: 23, title: 'Petr', country: 'USA'}
   ];

   var fastFilterData = [
      {
         id: 'title',
         resetValue: 'По имени',
         value: 'По имени',
         properties: {
            keyProperty: 'title',
            displayProperty: 'title',
            source: {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {id: 0, title: 'По имени'},
                     {id: 1, title: 'Sasha'},
                     {id: 2, title: 'Petr'},
                     {id: 4, title: 'Ivan'},
                     {id: 5, title: 'Andrey'}
                  ]
               }
            }
         }
      },
      {
         id: 'id',
         resetValue: 0,
         value: 0,
         properties: {
            keyProperty: 'id',
            displayProperty: 'title',
            source: {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: [
                     {id: 0, title: 'По id'},
                     {id: 1, title: '1'},
                     {id: 2, title: '2'},
                     {id: 3, title: '3'},
                     {id: 4, title: '4'}
                  ]
               }
            }
         }
      },
      {
         id: 'country',
         resetValue: 'Все страны',
         value: 'Все страны',
         properties: {
            keyProperty: 'title',
            displayProperty: 'title',
            source: {
               module: 'WS.Data/Source/Memory',
               options: {
                  data: countries
               }
            }
         }
      }
   ];

   var items = [
      {
         id: 'title',
         value: '',
         resetValue: '',
         textValue: 'Name',
         source: new Memory({
            idProperty: 'id',
            data: sourceData
         }),
         visibility: true
      },
      {
         id: 'FIO',
         value: '',
         resetValue: '',
         textValue: 'Ser name',
         visibility: true
      },
      {
         id: 'country',
         value: 'Все страны',
         resetValue: 'Все страны',
         textValue: 'country',
         visibility: false,
         source: new Memory({
            idProperty: 'title',
            data: countries
         })
      }
   ];

   var ModuleClass = Control.extend(
      {
         _template: template,

         _source: new Memory({
            idProperty: 'id',
            data: sourceData,
            filter: MemorySourceFilter('title')
         }),
         _fastFilterSource: fastFilterData,
         _items: items
      });
   return ModuleClass;
});
