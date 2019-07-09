define('Controls-demo/Example/Input/PositionLabels',
   [
      'Core/Control',
      'Controls-demo/Example/Input/SetValueMixin',
      'wml!Controls-demo/Example/Input/PositionLabels/PositionLabels',

      'Controls/input',
      'css!Controls-demo/Example/resource/Base',
      'css!Controls-demo/Example/Input/PositionLabels/PositionLabels',
      'css!Controls-demo/Example/resource/BaseDemoInput/BaseDemoInput'
   ],
   function(Control, SetValueMixin, template) {
      'use strict';


      return Control.extend([SetValueMixin], {
         _template: template,

         _labelClickHandler: function(event, labelName) {
            this._children[labelName].activate();
         }
      });
   });
