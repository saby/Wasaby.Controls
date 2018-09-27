define('Controls-demo/Popup/TestExecutingStack',
   [
      'Core/Control',
      'wml!Controls-demo/Popup/TestExecutingStack',
      'Core/Deferred'
   ],
   function (Control, template, Deferred) {
      'use strict';

      var TestDialog = Control.extend({
         _template: template,
         _text: 'not updated',

         _beforeMount: function(options) {
            var def = new Deferred();
            this._text = this._options.text;
            this._textFotTest = 'not updated';
            setTimeout(def.callback.bind(def), 500);
            return def;
         },

         _beforeUpdate: function(newOptions) {
            if (newOptions.text !== this._options.text) {
               this._textFotTest = 'updated after hook';
            }
         }
      });

      return TestDialog;
   }
);