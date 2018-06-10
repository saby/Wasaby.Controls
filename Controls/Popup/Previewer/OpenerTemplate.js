define('Controls/Popup/Previewer/OpenerTemplate',
   [
      'Core/Control',
      'tmpl!Controls/Popup/Previewer/OpenerTemplate'
   ],
   function(Control, template) {

      'use strict';

      var OpenerTemplate = Control.extend({
         _template: template,

         _sendResult: function(event) {
            this._notify('sendResult', [event], {bubbling: true});
         }
      });

      return OpenerTemplate;
   }
);
