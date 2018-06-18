

define('Controls-demo/BrowserTabs/BrowserTabs', [
   'Core/Control',
   'tmpl!Controls-demo/BrowserTabs/BrowserTabs',
   'WS.Data/Source/Memory'
], function(Control,
            template,
            MemorySource
) {
   'use strict';
   var
      demoTabsSource = new MemorySource({
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
      });

   var demoBrowserTabs = Control.extend({
      _template: template,
      _demoTabsSelectedKey: '1',
      _demoTabsSource: demoTabsSource
   });
   return demoBrowserTabs;
});
