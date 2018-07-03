define('Controls-demo/SwitchableArea/DemoSwitchableArea', [
   'Core/Control',
   'tmpl!Controls-demo/SwitchableArea/DemoSwitchableArea',
   'WS.Data/Collection/RecordSet',
   'tmpl!Controls-demo/SwitchableArea/resources/content',
   'tmpl!Controls-demo/SwitchableArea/resources/content2',
   'tmpl!Controls-demo/SwitchableArea/resources/content3',
   'css!Controls-demo/SwitchableArea/DemoSwitchableArea'
], function(Control,
            template,
            RecordSet
) {
   'use strict';
   var items = new RecordSet({
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

   var demoSwitchableArea = Control.extend({
      _template: template,
      _demoSelectedKey: '1',
      _items: items,

      clickHandler: function(event, idButton) {
         this._demoSelectedKey = idButton;
      }
   });
   return demoSwitchableArea;
});
