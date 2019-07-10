define('Controls-demo/Example/Input/Text',
   [
      'Core/Control',
      'Controls-demo/Example/Input/SetValueMixin',
      'wml!Controls-demo/Example/Input/Text/Text',

      'Controls/input',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, SetValueMixin, template) {
      'use strict';

      return Control.extend([SetValueMixin], {
         _template: template,

         _labelClickHandler: function(event, nameText) {
            this._children[nameText].activate();
         }
      });
   });
