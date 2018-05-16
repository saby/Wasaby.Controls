define('Controls/MiniCard/OpenerTemplate',
   [
      'Core/Control',
      'tmpl!Controls/MiniCard/OpenerTemplate'
   ],
   function(Control, template) {

      'use strict';

      var OpenerTemplate = Control.extend({
         _template: template,

         _sendResult: function(event) {
            this._notify('sendResult', [event]);
         }
      });

      return OpenerTemplate;
   }
);
