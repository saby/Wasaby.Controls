define('Controls-demo/Tabs/Buttons', [
   'Core/Control',
   'wml!Controls-demo/Tabs/Buttons/Buttons',
   'wml!Controls-demo/Tabs/Buttons/resources/spaceTemplate',
   'wml!Controls-demo/Tabs/Buttons/resources/itemTemplate',
   'wml!Controls-demo/Tabs/Buttons/resources/mainTemplate',
   'wml!Controls-demo/Tabs/Buttons/resources/photoContent',
   'WS.Data/Source/Memory',
   'css!Controls-demo/Tabs/Buttons/Buttons'
], function(
   Control,
   template,
   spaceTemplate,
   itemTemplate,
   mainTemplate,
   photoContent,
   MemorySource
) {
   'use strict';
    var TabButtonsDemo = Control.extend({
      _template: template,
      SelectedKey1: '1',
      SelectedKey2: '2',
      SelectedKey3: '4',
      SelectedKey4: '2',
      SelectedKey5: '2',
      SelectedKey6: '1',
      SelectedKey7: '3',
      _source1: null,
      _source2: null,
      _source3: null,
      _source4: null,
      _source5: null,
      _source6: null,
      _source7: null,
      _spaceTemplate: spaceTemplate,
      _beforeMount: function() {
         this._source1 = new MemorySource({
            idProperty: 'id',
            data: [
               {
                  id: '1',
                  title: 'Document',
                  align: 'left',
                  isMainTab: true
               },
               {
                  id: '2',
                  title: 'Files',
                  align: 'left'
               },
               {
                  id: '3',
                  title: 'Orders',
                  align: 'left'
               },
               {
                  id: '4',
                  title: 'Productions'
               },
               {
                  id: '5',
                  title: 'Employees'
               },
               {
                  id: '6',
                  title: 'Groups'
               },
               {
                  id: '7',
                  title: 'Photos'
               },
               {
                  id: '8',
                  title: 'Videos'
               }
            ]
         });
         this._source2 = new MemorySource({
            idProperty: 'id',
            data: [
               {
                  id: '1',
                  title: 'Person card',
                  align: 'left',
                  itemTemplate: mainTemplate
               },
               {
                  id: '2',
                  title: 'Photos'
               },
               {
                  id: '3',
                  title: 'Videos'
               },
               {
                  id: '4',
                  title: 'Groups'
               },
               {
                  id: '5',
                  title: 'Documents'
               },
               {
                  id: '6',
                  title: 'Meetings'
               }
            ]
         });
         this._source3 = new MemorySource({
            idProperty: 'id',
            data: [
               {
                  id: '1',
                  carambola: 'Person card',
                  align: 'left'
               },
               {
                  id: '2',
                  carambola: 'Photos'
               },
               {
                  id: '3',
                  carambola: 'Videos'
               },
               {
                  id: '4',
                  carambola: 'Groups'
               },
               {
                  id: '5',
                  carambola: 'Documents'
               },
               {
                  id: '6',
                  carambola: 'Meetings'
               }
            ]
         });
         this._source4 = new MemorySource({
            idProperty: 'id',
            data: [
               {
                  id: '1',
                  title: 'Meetings',
                  align: 'left'
               },
               {
                  id: '2',
                  title: 'Groups'
               },
               {
                  id: '3',
                  title: 'Documents'
               }
            ]
         });
         this._source5 = new MemorySource({
            idProperty: 'id',
            data: [
               {
                  id: '1',
                  title: 'Documents',
                  align: 'left',
                  itemTemplate: itemTemplate
               },
               {
                  id: '2',
                  title: 'Meetings'
               }
            ]
         });
         this._source6 = new MemorySource({
            idProperty: 'id',
            data: [
               {
                  id: '1',
                  title:
                     'Task number 12345678901234567890'
               },
               {
                  id: '2',
                  title: 'News',
                  align: 'left'
               },
               {
                  id: '3',
                  title: 'Meetings'
               }
            ]
         });
         this._source7 = new MemorySource({
            idProperty: 'id',
            data: [
               {
                  id: '1',
                  title: 'Person card',
                  align: 'left',
                  carambola: photoContent,
                  type: 'photo'
               },
               {
                  id: '2',
                  title: 'Documents',
                  align: 'left'
               },
               {
                  id: '3',
                  title: 'Photos',
                  align: 'left'
               },
               {
                  id: '4',
                  title: 'Groups',
                  align: 'left'
               },
               {
                  id: '5',
                  title: 'Meetings'
               },
               {
                  id: '6',
                  title: 'Videos'
               },
               {
                  id: '7',
                  title: '',
                  carambola: photoContent,
                  type: 'photo'
               }
            ]
         });
      },
      _setSource: function() {
         this._source6 = new MemorySource({
            idProperty: 'id',
            data: [
               {
                  id: '1',
                  title: 'Videos'
               },
               {
                  id: '2',
                  title: 'Groups'
               },
               {
                  id: '3',
                  title: 'Photos'
               }
            ]
         });
         this._source6.destroy();
      }
   });
   return TabButtonsDemo;
});
