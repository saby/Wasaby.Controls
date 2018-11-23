define('Controls-demo/SwitchableArea/DemoSwitchableArea', [
   'Core/Control',
   'wml!Controls-demo/SwitchableArea/DemoSwitchableArea',
   'WS.Data/Collection/RecordSet',
   'wml!Controls-demo/SwitchableArea/resources/content',
   'wml!Controls-demo/SwitchableArea/resources/content2',
   'wml!Controls-demo/SwitchableArea/resources/contentAsync',
   'css!Controls-demo/SwitchableArea/DemoSwitchableArea'
], function(Control,
            template,
            RecordSet
) {
   'use strict';
   var demoSwitchableArea = Control.extend({
      _template: template,
      _demoSelectedKey: '0',
      _items: null,
      constructor: function() {
         demoSwitchableArea.superclass.constructor.apply(this, arguments);
         this._items = [
            {
               id: '0',
               title: 'content1',
               itemTemplate: 'wml!Controls-demo/SwitchableArea/resources/content'
            },
            {
               id: '1',
               title: 'content2',
               itemTemplate: 'wml!Controls-demo/SwitchableArea/resources/content2'
            },
            {
               id: '2',
               title: 'content3',
               itemTemplate: 'wml!Controls-demo/SwitchableArea/resources/contentAsync'
            }
         ];
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
