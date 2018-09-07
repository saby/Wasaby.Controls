define('Controls-demo/RichTextArea/RichTextArea', [
   'Core/Control',
   'wml!Controls-demo/RichTextArea/RichTextArea',
   'css!Controls-demo/RichTextArea/RichTextArea'
], function (Control, template) {
   'use strict';

   var RichEdtior = Control.extend({
         _template: template,
         value123: 'example123',
         codeMode: false,
         readOnly: false,

         buttonCaption: 'Заблокировать',
         buttonCaption2: 'Режим кода',
         _updateState: function() {
            if (!this.readOnly) {
               this.buttonCaption = 'Разблокировать';
            } else {
               this.buttonCaption = 'Заблокировать';
            }
            this.readOnly = !this.readOnly;
         },
         _updateMode: function() {
            if (!this.codeMode) {
               this.buttonCaption2 = 'Режим редактора';
            } else {
               this.buttonCaption2 = 'Режим кода';
            }
            this.codeMode = !this.codeMode;
         },
         changeText: function(event, value) {
            this.value123 = value;
         },

         _changeText: function(event) {
            this.value123 = event.target.value;
         }
      }
   );

   return RichEdtior;
});
