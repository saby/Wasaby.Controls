define('Controls/Input/RichTextArea', [
   'Core/Control',
   'tmpl!Controls/Input/RichTextArea/RichTextArea'
], function (Control, template) {
   'use strict';

   var RichEdtior = Control.extend({
         _template: template,

         _beforeMount: function (opts) {
            this.value = opts.value;
         },

         _beforeUpdate: function(opts) {
           if (this.value !== opts.value) {
              this.value = opts.value;
           }
         },

         _afterUpdate: function (opts) {
            if (!this.isEnabled()) {
               this._children.textContainer.innerHTML = this.value;
            }
         },

         setText: function(e, value) {
            this.value = value;
            this._notify('valueChanged', [value]);
         },

         setCursorToTheEnd: function () {
           this._children.tinyMCE.setCursorToTheEnd();
         }
      });
   return RichEdtior;
});
