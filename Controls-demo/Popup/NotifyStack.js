define('Controls-demo/Popup/NotifyStack',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/NotifyStack',
   ],
   function(Control, template) {
      'use strict';

      var NotifyStack = Control.extend({
         _template: template,
         _textValue: '',

         _sendResult: function() {
            this._notify('sendResult', [this._textValue], { bubbling: true });
         }
      });

      return NotifyStack;
   });
