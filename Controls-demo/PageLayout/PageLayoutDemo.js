define('Controls-demo/PageLayout/PageLayoutDemo', [
   'Core/Control',
   'wml!Controls-demo/PageLayout/PageLayoutDemo',
   'wml!Controls-demo/PageLayout/resources/controlAreaTemplate',
   'wml!Controls-demo/PageLayout/resources/controlAreaTemplate2',
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
                  itemTemplate: 'wml!Controls-demo/PageLayout/resources/controlAreaTemplate'
               },
               {
                  id: '2',
                  title: 'hard',
                  itemTemplate: 'wml!Controls-demo/PageLayout/resources/controlAreaTemplate2'
               },
               {
                  id: '3',
                  title: 'invent',
                  itemTemplate: 'wml!Controls-demo/PageLayout/resources/controlAreaTemplate'
               },
               {
                  id: '4',
                  title: 'tabs',
                  itemTemplate: 'wml!Controls-demo/PageLayout/resources/controlAreaTemplate2'
               },
               {
                  id: '5',
                  title: 'titles',
                  itemTemplate: 'wml!Controls-demo/PageLayout/resources/controlAreaTemplate'
               }
            ]
         });
         this._demoTabsSource2 = new MemorySource({
            idProperty: 'id',
            data: [
               {
                  id: '1',
                  title: 'very',
                  itemTemplate: 'wml!Controls-demo/PageLayout/resources/controlAreaTemplate2'
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
