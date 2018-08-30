define('Controls-demo/Example/Input/PositionLabels',
   [
      'Core/Control',
      'wml!Controls-demo/Example/Input/PositionLabels/PositionLabels',

      'Controls/Label',
      'Controls/Input/Text',
      'css!Controls-demo/Example/resource/Base',
      'css!Controls-demo/Example/resource/BaseDemoInput/BaseDemoInput'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _labelClickHandler: function(event, labelName) {
            this._children[labelName].activate();
         }
      });
   }
);
