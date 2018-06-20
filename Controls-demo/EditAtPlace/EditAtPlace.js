define('Controls-demo/EditAtPlace/EditAtPlace', [
   'Core/Control',
   'tmpl!Controls-demo/EditAtPlace/EditAtPlace',
   'Core/core-clone',
   'WS.Data/Entity/Record',
   'WS.Data/Source/Memory',
   'tmpl!Controls-demo/EditAtPlace/resources/tabTemplate',
   'css!Controls-demo/EditAtPlace/EditAtPlace'
], function(Control, template, cClone, Record, MemorySource, tabTemplate) {
   'use strict';
   var tabsData = [
      {
         id: '0',
         title: 'Go go go',
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
   ];

   var EditAtPlace = Control.extend({
      _template: template,
      _record: null,
      _record2: null,
      _record3: null,
      _selectedTab: '1',
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
         this._updateTabSource();
      },

      _cancelHandler: function() {
         this._record = this._record.clone();
      },

      _cancelHandler2: function() {
         this._record2 = this._record2.clone();
      },

      _cancelHandler3: function() {
         this._updateTabSource();
      },
      _beforeEndEdit: function(event, item) {
         this.updateItem(item);
         this._updateTabSource();
      },
      //save BL emulate
      updateItem: function(item) {
         for (var i = 0; i < tabsData.length; i++) {
            if (tabsData[i].id === item.get('id')) {
               tabsData[i] = item.getRawData();
            }
         }
      },
      _updateTabSource: function() {
         this._tabSource = new MemorySource({
            idProperty: 'id',
            data: tabsData
         });
      }
   });
   return EditAtPlace;
});
