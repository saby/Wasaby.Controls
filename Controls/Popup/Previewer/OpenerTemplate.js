define('Controls/Popup/Previewer/OpenerTemplate',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls/Popup/Previewer/OpenerTemplate'
   ],
   function(Control, Deferred, template) {

      'use strict';

      var OpenerTemplate = Control.extend({
         _template: template,

         _beforeMount: function(options) {
            var _this = this;
            var def = new Deferred();

            if (typeof options.content === 'string') {
               require([options.content], function(content) {
                  _this._content = content;

                  def.callback();
               });
            } else {
               _this._content = options.content;
            }

            return def;
         },

         _sendResult: function(event) {
            this._notify('sendResult', [event], {bubbling: true});
         }
      });

      return OpenerTemplate;
   }
);
