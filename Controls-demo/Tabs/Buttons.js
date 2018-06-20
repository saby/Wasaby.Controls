define('Controls-demo/Tabs/Buttons', [
   'Core/Control',
   'tmpl!Controls-demo/Tabs/Buttons/Buttons',
   'tmpl!Controls-demo/Tabs/Buttons/resources/spaceTemplate',
   'tmpl!Controls-demo/Tabs/Buttons/resources/itemTemplate',
   'tmpl!Controls-demo/Tabs/Buttons/resources/mainTemplate',
   'tmpl!Controls-demo/Tabs/Buttons/resources/photoContent',
   'WS.Data/Source/Memory',
   'css!Controls-demo/Tabs/Buttons/Buttons'
], function(
   Control,
   template,
   spaceTemplate,
   itemTemplate,
   mainTemplate,
   photoContent,
   MemorySource,
   cssButtons
) {
   'use strict';
   var source1 = new MemorySource({
         idProperty: 'id',
         data: [
            {
               id: '1',
               title: 'Done',
               align: 'left'
            },
            {
               id: '2',
               title: 'From Me',
               align: 'left'
            },
            {
               id: '3',
               title: 'Controlled',
               align: 'left'
            },
            {
               id: '4',
               title: 'very'
            },
            {
               id: '5',
               title: 'hard'
            },
            {
               id: '6',
               title: 'invent'
            },
            {
               id: '7',
               title: 'tabs'
            },
            {
               id: '8',
               title: 'titles'
            }
         ]
      }),
      source2 = new MemorySource({
         idProperty: 'id',
         data: [
            {
               id: '1',
               title: 'Main',
               align: 'left',
               itemTemplate: mainTemplate
            },
            {
               id: '2',
               title: 'very'
            },
            {
               id: '3',
               title: 'hard'
            },
            {
               id: '4',
               title: 'invent'
            },
            {
               id: '5',
               title: 'tabs'
            },
            {
               id: '6',
               title: 'titles'
            }
         ]
      }),
      source3 = new MemorySource({
         idProperty: 'id',
         data: [
            {
               id: '1',
               carambola: 'First',
               align: 'left'
            },
            {
               id: '2',
               carambola: 'very'
            },
            {
               id: '3',
               carambola: 'hard'
            },
            {
               id: '4',
               carambola: 'invent'
            },
            {
               id: '5',
               carambola: 'tabs'
            },
            {
               id: '6',
               carambola: 'titles'
            }
         ]
      }),
      source4 = new MemorySource({
         idProperty: 'id',
         data: [
            {
               id: '1',
               title: 'First',
               align: 'left'
            },
            {
               id: '2',
               title: 'tabs'
            },
            {
               id: '3',
               title: 'titles'
            }
         ]
      }),
      source5 = new MemorySource({
         idProperty: 'id',
         data: [
            {
               id: '1',
               title: 'First',
               align: 'left',
               itemTemplate: itemTemplate
            },
            {
               id: '2',
               title: 'titles'
            }
         ]
      }),
      source6 = new MemorySource({
         idProperty: 'id',
         data: [
            {
               id: '1',
               title:
                  'So long folder name that it will not fit into the maximum size So long folder name that it will not fit into the maximum size'
            },
            {
               id: '2',
               title: 'Second',
               align: 'left'
            },
            {
               id: '3',
               title: 'third'
            }
         ]
      }),
      newSource6 = new MemorySource({
         idProperty: 'id',
         data: [
            {
               id: '1',
               title: 'after'
            },
            {
               id: '2',
               title: 'change'
            },
            {
               id: '3',
               title: 'Source'
            }
         ]
      }),
      source7 = new MemorySource({
         idProperty: 'id',
         data: [
            {
               id: '1',
               title: 'First',
               align: 'left',
               carambola: photoContent,
               type: 'photo'
            },
            {
               id: '2',
               title: 'very',
               align: 'left'
            },
            {
               id: '3',
               title: 'hard',
               align: 'left'
            },
            {
               id: '4',
               title: 'invent',
               align: 'left'
            },
            {
               id: '5',
               title: 'tabs'
            },
            {
               id: '6',
               title: 'titles'
            },
            {
               id: '7',
               title: '',
               carambola: photoContent,
               type: 'photo'
            }
         ]
      });

   var TabButtonsDemo = Control.extend({
      _template: template,
      SelectedKey1: '1',
      SelectedKey2: '2',
      SelectedKey3: '4',
      SelectedKey4: '2',
      SelectedKey5: '2',
      SelectedKey6: '1',
      SelectedKey7: '3',
      _source1: source1,
      _source2: source2,
      _source3: source3,
      _source4: source4,
      _source5: source5,
      _source6: source6,
      _source7: source7,
      _spaceTemplate: spaceTemplate,
      _setSource: function() {
         this._source6 = newSource6;
         source6.destroy();
      }
   });
   return TabButtonsDemo;
});
