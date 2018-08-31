define('Controls-demo/PageLayout/PageLayoutDemo', [
   'Core/Control',
   'tmpl!Controls-demo/PageLayout/PageLayoutDemo',
   'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate',
   'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate2',
   'WS.Data/Source/Memory',
   'Controls/Application/HeadDataContext',
   'css!Controls-demo/PageLayout/PageLayoutDemo'
], function(Control,
            template,
            controlAreaTemplate,
            controlAreaTemplate2,
            MemorySource,
            HeadDataContext
) {
   'use strict';
   var demoBrowserTabs = Control.extend({
      _template: template,
      _demoTabsSelectedKey: '1',
      _demoTabsSource: null,
      _demoTabsSource2: null,
      constructor: function() {
         demoBrowserTabs.superclass.constructor.apply(this, arguments);
         this.headDataCtxField = new HeadDataContext();
         this._demoTabsSource = new MemorySource({
            idProperty: 'id',
            data: [
               {
                  id: '1',
                  title: 'very',
                  itemTemplate: 'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate'
               },
               {
                  id: '2',
                  title: 'hard',
                  itemTemplate: 'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate2'
               },
               {
                  id: '3',
                  title: 'invent',
                  itemTemplate: 'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate'
               },
               {
                  id: '4',
                  title: 'tabs',
                  itemTemplate: 'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate2'
               },
               {
                  id: '5',
                  title: 'titles',
                  itemTemplate: 'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate'
               }
            ]
         });
         this._demoTabsSource2 = new MemorySource({
            idProperty: 'id',
            data: [
               {
                  id: '1',
                  title: 'very',
                  itemTemplate: 'tmpl!Controls-demo/PageLayout/resources/controlAreaTemplate2'
               }
            ]
         });
      },
      _getChildContext: function() {
         return {
            headData: this.headDataCtxField
         };
      }
   });
   return demoBrowserTabs;
});
