define('Controls/Input/RichTextArea', [
   'Core/Control',
   'tmpl!Controls/Input/RichTextArea/RichTextArea',
   'Controls/Input/RichTextArea/RichAreaModel',
   'css!Controls/Input/RichTextArea/RichTextArea'
], function(Control, template, RichModel) {
   'use strict';

   /**
    * Component RichTextArea
    * @class Controls/Input/RichTextArea
    * @extends Core/Control
    * @control
    * @authors Volotskoy V.D., Sukhoruchkin A.S., Avramenko A.S.
    */

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

      _afterUpdate: function(opts) {
         if (this._options.readOnly) {
            this._children.textContainer.innerHTML = this._simpleViewModel.getValue();
         }
      },

      _onTextChanged: function(e, value) {
         this._notify('valueChanged', [value]);
      }
   });
   return RichEdtior;
});
