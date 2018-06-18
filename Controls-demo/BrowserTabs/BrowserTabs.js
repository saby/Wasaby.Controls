

define('Controls-demo/BrowserTabs/BrowserTabs', [
   'Core/Control',
   'tmpl!Controls-demo/BrowserTabs/BrowserTabs',
   'tmpl!Controls-demo/BrowserTabs/resources/tabsContent',
   'tmpl!Controls-demo/BrowserTabs/resources/tabsContent2',
   'WS.Data/Source/Memory'
], function(Control,
            template,
            tabsContent,
            tabsContent2,
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
               content: 'tmpl!Controls-demo/BrowserTabs/resources/tabsContent'
            },
            {
               id: '2',
               title: 'hard',
               content: 'tmpl!Controls-demo/BrowserTabs/resources/tabsContent2'
            },
            {
               id: '3',
               title: 'invent',
               content: 'tmpl!Controls-demo/BrowserTabs/resources/tabsContent'
            },
            {
               id: '4',
               title: 'tabs',
               content: 'tmpl!Controls-demo/BrowserTabs/resources/tabsContent2'
            },
            {
               id: '5',
               title: 'titles',
               content: 'tmpl!Controls-demo/BrowserTabs/resources/tabsContent'
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
