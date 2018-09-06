define('Controls/Popup/Previewer/OpenerTemplate',
   [
      'Core/Control',
      'Core/Deferred',
      'wml!Controls/Popup/Previewer/OpenerTemplate',

      'Controls/Container/Async'
   ],
   function(Control, Deferred, template) {

      'use strict';

      var OpenerTemplate = Control.extend({
         _template: template,

         _beforeMount: function(options) {
            if (typeof window !== 'undefined' && options.contentTemplateName) {
               var def = new Deferred();
               require([options.contentTemplateName], function() {
                  def.callback();
               });
               return def;
            }
         },

         _sendResult: function(event) {
            this._notify('sendResult', [event], {bubbling: true});
         }
      });

      return OpenerTemplate;
   }
);
