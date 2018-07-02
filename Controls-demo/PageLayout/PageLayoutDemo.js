define('Controls-demo/PageLayout/PageLayoutDemo', [
   'Core/Control',
   'tmpl!Controls-demo/PageLayout/PageLayoutDemo',
   'tmpl!Controls-demo/PageLayout/resources/tabsContent',
   'tmpl!Controls-demo/PageLayout/resources/tabsContent2',
   'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate',
   'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate2',
   'WS.Data/Source/Memory',
   'css!Controls-demo/PageLayout/PageLayoutDemo'
], function(Control,
            template,
            tabsContent,
            tabsContent2,
            controlAreaTemplate,
            controlAreaTemplate2,
            MemorySource
) {
   'use strict';
   var demoTabsSource = new MemorySource({
         idProperty: 'id',
         data: [
            {
               id: '1',
               title: 'very',
               mainArea: 'tmpl!Controls-demo/PageLayout/resources/tabsContent',
               tabsArea: 'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate'
            },
            {
               id: '2',
               title: 'hard',
               mainArea: 'tmpl!Controls-demo/PageLayout/resources/tabsContent2',
               tabsArea: 'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate2'
            },
            {
               id: '3',
               title: 'invent',
               mainArea: 'tmpl!Controls-demo/PageLayout/resources/tabsContent',
               tabsArea: 'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate'
            },
            {
               id: '4',
               title: 'tabs',
               mainArea: 'tmpl!Controls-demo/PageLayout/resources/tabsContent2',
               tabsArea: 'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate2'
            },
            {
               id: '5',
               title: 'titles',
               mainArea: 'tmpl!Controls-demo/PageLayout/resources/tabsContent',
               tabsArea: 'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate'
            }
         ]
      });

   var demoTabsSource2 = new MemorySource({
      idProperty: 'id',
      data: [
         {
            id: '1',
            title: 'very',
            mainArea: 'tmpl!Controls-demo/PageLayout/resources/tabsContent2',
            tabsArea: 'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate2'
         }
      ]
   });

   var demoBrowserTabs = Control.extend({
      _template: template,
      _demoTabsSelectedKey: '1',
      _demoTabsSource: demoTabsSource,
      _demoTabsSource2: demoTabsSource2
   });
   return demoBrowserTabs;
});
