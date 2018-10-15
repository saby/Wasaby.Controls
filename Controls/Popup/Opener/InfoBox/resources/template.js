define('Controls/Popup/Opener/InfoBox/resources/template',
   [
      'Core/Control',
      'wml!Controls/Popup/Opener/InfoBox/resources/template'
   ],
   function(Control, template) {

      'use strict';

      return Control.extend({
         _template: template,

         _close: function() {
            this._notify('close');
         },

         _sendResult: function(event) {
            this._notify('sendResult', [event], {bubbling: true});
         }
      });
   }
);
