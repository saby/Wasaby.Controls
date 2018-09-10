define('Controls-demo/EditAtPlace/EditAtPlace', [
   'Core/Control',
   'wml!Controls-demo/EditAtPlace/EditAtPlace',
   'Core/core-clone',
   'WS.Data/Entity/Record',
   'WS.Data/Source/Memory',
   'wml!Controls-demo/EditAtPlace/resources/tabTemplate',
   'wml!Controls-demo/EditAtPlace/resources/tabTemplate2',

   'css!Controls-demo/EditAtPlace/EditAtPlace'
], function(
   Control,
   template,
   cClone,
   Record,
   MemorySource,
   tabTemplate,
   tabTemplate2
) {
   'use strict';
   var tabsData = [
         {
            id: '0',
            title: 'Ошибка в разработку',
            align: 'left',
            number: '1175501898',
            date: '26.06.18',
            itemTemplate: tabTemplate
         },
         {
            id: '1',
            title: 'Kochnev',
            align: 'left'
         },
         {
            id: '2',
            title: 'Cheremushkin',
            align: 'left'
         },
         {
            id: '3',
            title: 'Izigin'
         },
         {
            id: '4',
            align: 'left',
            title: 'Stepin'
         },
         {
            id: '5',
            align: 'left',
            title: 'Romanov'
         },
         {
            id: '6',
            align: 'left',
            title: 'Borisov'
         },
         {
            id: '7',
            title: ' Zaitsev'
         },
         {
            id: '8',
            title: ' Sukhoruchkin'
         }
      ],
      tabsData2 = [
         {
            id: '0',
            align: 'left',
            name: 'Имя',
            surname: 'Фамилия',
            patronymic: 'Отчество',
            itemTemplate: tabTemplate2
         },
         {
            id: '1',
            title: 'Kochnev',
            align: 'left'
         },
         {
            id: '2',
            title: 'Cheremushkin',
            align: 'left'
         },
         {
            id: '3',
            title: 'Izigin'
         },
         {
            id: '4',
            align: 'left',
            title: 'Stepin'
         },
         {
            id: '5',
            align: 'left',
            title: 'Romanov'
         },
         {
            id: '6',
            align: 'left',
            title: 'Borisov'
         },
         {
            id: '7',
            title: ' Zaitsev'
         },
         {
            id: '8',
            title: ' Sukhoruchkin'
         }
      ];

   var EditAtPlace = Control.extend({
      _template: template,
      _record: null,
      _record2: null,
      _record3: null,
      _selectedTab: '1',
      _selectedTab2: '2',
      _tabSource: null,

      _beforeMount: function() {
         this._record = new Record({
            rawData: {
               id: 1,
               text1: '1037739877295',
               text2: '00083262',
               text3: '80209801001'
            }
         });
         this._record2 = new Record({
            rawData: {
               id: 1,
               text1: 'Smirnov'
            }
         });
         this._tabSource = new MemorySource({
            idProperty: 'id',
            data: tabsData
         });
         this._tabSource2 = new MemorySource({
            idProperty: 'id',
            data: tabsData2
         });
      }
   });
   return EditAtPlace;
});
