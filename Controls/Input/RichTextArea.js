define('Controls/Input/RichTextArea', [
   'Core/Control',
   'tmpl!Controls/Input/RichTextArea/RichTextArea',
   'Controls/Input/RichTextArea/RichAreaModel'
], function(Control, template, RichModel) {
   'use strict';

   var RichEdtior = Control.extend({
      _template: template,

      _beforeMount: function(opts) {
         this._simpleViewModel = new RichModel({
            value: opts.value
         });
      },

      _beforeUpdate: function(opts) {
         this._simpleViewModel.updateOptions({
            value: opts.value
         });
      },

      _afterUpdate: function() {
         if (!this.isEnabled()) {
            this._children.textContainer.innerHTML = this.value;
         }
      },

      setText: function(e, value) {
         this._notify('valueChanged', [value]);
      }
   });
   return RichEdtior;
});
