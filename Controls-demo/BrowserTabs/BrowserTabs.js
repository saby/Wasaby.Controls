

define('Controls-demo/BrowserTabs/BrowserTabs', [
   'Core/Control',
   'tmpl!Controls-demo/BrowserTabs/BrowserTabs',
   'tmpl!Controls-demo/BrowserTabs/resources/tabsContent',
   'WS.Data/Source/Memory'
], function(Control,
            template,
            tabsContent,
            MemorySource
) {
   'use strict';
   var
      demoTabsSource = new MemorySource({
         idProperty: 'id',
         data: [
            {
               id: '1',
               title: 'very',
               content: tabsContent
            },
            {
               id: '2',
               title: 'hard',
               content: tabsContent
            },
            {
               id: '3',
               title: 'invent',
               content: tabsContent
            },
            {
               id: '4',
               title: 'tabs',
               content: tabsContent
            },
            {
               id: '5',
               title: 'titles',
               content: tabsContent
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
