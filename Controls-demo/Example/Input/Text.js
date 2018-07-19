define('Controls-demo/Example/Input/Text',
   [
      'Core/Control',
      'tmpl!Controls-demo/Example/Input/Text/Text',

      'Controls/Input/Text',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _currentActiveTag: null,

         _value9: '10 500.00',

         _value10: '10 500.00',

         _value11: '10 500.00',

         _value12: '10 500.00',

         _value13: '10 500.00',

         _labelClickHandler: function(event, nameText) {
            this._children[nameText].activate();
         },
         
         _showInfoBox: function(event, target) {
            var infoBox = this._children.infoBox;

            if (this._currentActiveTag !== target) {
               infoBox.open({
                  target: target,
                  message: 'Tooltip text',
                  position: 'tl'
               });
               this._currentActiveTag = target;
            }
         }
      });
   }
);
