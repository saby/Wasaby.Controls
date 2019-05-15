define('Controls-demo/Example/Input/Tag',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Input/Tag/Tag',

      'Controls/input',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {
      'use strict';

      return Control.extend({
         _template: template,

         _currentActiveTag: null,

         _value1: '10 500.00',

         _value2: '10 500.00',

         _value3: '10 500.00',

         _value4: '10 500.00',

         _value5: '10 500.00',

         _value6: '10 500.00',

         _showInfoBox: function(event, target) {
            var cfg = {
               target: target,
               message: 'Tooltip text',
               position: 'tl'
            };

            this._notify('openInfoBox', [cfg], {
               bubbling: true
            });
         }
      });
   });
