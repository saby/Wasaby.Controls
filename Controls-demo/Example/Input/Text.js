define('Controls-demo/Example/Input/Text',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Input/Text/Text',

      'Controls/Input/Text',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _labelClickHandler: function(event, nameText) {
            this._children[nameText].activate();
         }
      });
   }
);
