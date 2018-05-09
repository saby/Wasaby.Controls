define('Controls-demo/RichTextArea/RichTextArea', [
   'Core/Control',
   'tmpl!Controls-demo/RichTextArea/RichTextArea',
   'css!Controls-demo/RichTextArea/RichTextArea'
], function (Control, template) {
   'use strict';

   var RichEdtior = Control.extend({
         _template: template,
         value123: 'example123',

         readOnly: false,

         buttonCaption: 'Заблокировать',
         _updateState: function() {
            if (this.readOnly) {
               this.buttonCaption = 'Разблокировать';
            } else {
               this.buttonCaption = 'Заблокировать';
            }
            this.readOnly = !this.readOnly;
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
