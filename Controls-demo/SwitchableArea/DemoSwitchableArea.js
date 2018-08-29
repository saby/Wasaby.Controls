define('Controls-demo/SwitchableArea/DemoSwitchableArea', [
   'Core/Control',
   'tmpl!Controls-demo/SwitchableArea/DemoSwitchableArea',
   'WS.Data/Collection/RecordSet',
   'Controls/Application/HeadDataContext',
   'tmpl!Controls-demo/SwitchableArea/resources/content',
   'tmpl!Controls-demo/SwitchableArea/resources/content2',
   'tmpl!Controls-demo/SwitchableArea/resources/content3',
   'css!Controls-demo/SwitchableArea/DemoSwitchableArea'
], function(Control,
            template,
            RecordSet,
            HeadDataContext
) {
   'use strict';
   var demoSwitchableArea = Control.extend({
      _template: template,
      _demoSelectedKey: '1',
      _items: null,
      constructor: function() {
         demoSwitchableArea.superclass.constructor.apply(this, arguments);
         this.headDataCtxField = new HeadDataContext();
         this._items = new RecordSet({
            rawData: [
               {
                  id: '1',
                  title: 'content1',
                  itemTemplate: 'tmpl!Controls-demo/SwitchableArea/resources/content'
               },
               {
                  id: '2',
                  title: 'content2',
                  itemTemplate: 'tmpl!Controls-demo/SwitchableArea/resources/content2'
               },
               {
                  id: '3',
                  title: 'content3',
                  itemTemplate: 'tmpl!Controls-demo/SwitchableArea/resources/content3'
               }
            ],
            idProperty: 'id'
         });
      },
      _getChildContext: function() {
         return {
            headData: this.headDataCtxField
         };
      },
      clickHandler: function(event, idButton) {
         this._demoSelectedKey = idButton;
      }
   });
   return demoSwitchableArea;
});
