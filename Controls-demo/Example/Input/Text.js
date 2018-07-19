define('Controls-demo/Example/Input/Text',
   [
      'Core/Control',
      'tmpl!Controls-demo/Example/Input/Text/Text',

      'Controls/Label',
      'Controls/Input/Text',
      'Controls-demo/Example/resource/BaseDemoInput'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _tagStyles: null,

         _valueDisabled2: 'Simple text input field',

         _beforeMount: function() {
            this._tagStyles = ['primary', 'done', 'attention', 'error', 'info'];
         },

         _labelClickHandler: function(event, nameText) {
            this._children[nameText].activate();
         },
         
         _showInfoBox: function(event) {
            this._children.infoBox.open({
               target: event.target,
               message: 'Tooltip'
            });
         }
      });
   }
);
