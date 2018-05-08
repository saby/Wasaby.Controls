define('Controls/Input/RichArea', [
   'Core/Control',
   'tmpl!Controls/Input/RichArea/RichArea',
   'Controls/Input/RichArea/RichAreaModel',
   'css!Controls/Input/RichArea/RichArea'
], function(Control, template, RichModel) {
   'use strict';

   /**
    * Component RichTextArea
    * @class Controls/Input/RichTextArea
    * @extends Core/Control
    * @control
    * @authors Volotskoy V.D., Sukhoruchkin A.S., Avramenko A.S.
    */

   var RichTextArea = Control.extend({
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
            this._children.reviewContainer.innerHTML = this._simpleViewModel.getValue();
         }
      },

      _onTextChanged: function(e, value) {
         this._notify('valueChanged', [value]);
      }
   });
   return RichTextArea;
});
