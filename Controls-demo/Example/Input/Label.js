define('Controls-demo/Example/Input/Label',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Input/Label/Label',

      'Controls/input',
      'css!Controls-demo/Example/resource/Base',
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
   });
