define('Controls-demo/SwitchableArea/DemoSwitchableArea', [
   'Core/Control',
   'wml!Controls-demo/SwitchableArea/DemoSwitchableArea',
   'Types/collection',
   'wml!Controls-demo/SwitchableArea/resources/content',
   'wml!Controls-demo/SwitchableArea/resources/content2',
   'wml!Controls-demo/SwitchableArea/resources/contentAsync',
   'wml!Controls-demo/SwitchableArea/resources/contentDop'
], function(Control,
            template,
            collection
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
               itemTemplate: 'wml!Controls-demo/SwitchableArea/resources/content',
               templateOptions: {
                  additionalOptions: true
               }
            },
            {
               id: '1',
               title: 'content2',
               itemTemplate: 'wml!Controls-demo/SwitchableArea/resources/content2'
            },
            {
               id: '2',
               title: 'content3',
               itemTemplate: 'wml!Controls-demo/SwitchableArea/resources/contentAsync',
               templateOptions: {
                  additionalOptions: true
               }
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
         if (idButton === '2') {
            this._items = [
               {
                  id: '0',
                  title: 'dop',
                  itemTemplate: 'wml!Controls-demo/SwitchableArea/resources/contentDop'
               },
               {
                  id: '1',
                  title: 'dop2',
                  itemTemplate: 'wml!Controls-demo/SwitchableArea/resources/contentDop'
               },
               {
                  id: '2',
                  title: 'dop3',
                  itemTemplate: 'wml!Controls-demo/SwitchableArea/resources/contentDop'
               }
            ];
         }
      }
   });
   return demoSwitchableArea;
});
