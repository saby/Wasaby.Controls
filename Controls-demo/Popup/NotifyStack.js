define('Controls-demo/Popup/NotifyStack',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/NotifyStack',
   ],
   function(Control, template) {
      'use strict';

      var NotifyStack = Control.extend({
         _template: template,
         _textValue1: '',
         _textValue2: '',

         _sendResult: function() {
            this._notify('sendResult', [this._textValue1, this._textValue2], { bubbling: true });
         }
      });

      return NotifyStack;
   });
