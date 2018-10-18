define('Controls/Input/RichArea', [
   'Core/Control',
   'wml!Controls/Input/RichArea/RichArea',
   'Controls/Input/RichArea/RichAreaModel',
   'Core/helpers/domToJsonML',
   'Core/HtmlJson',
   'css!Controls/Input/RichArea/RichArea'
], function(Control, template, RichModel, domToJson, HtmlJson) {
   'use strict';

   /**
    * Component RichTextArea
    * @class Controls/Input/RichTextArea
    * @extends Core/Control
    * @control
    * @author Волоцкой В.Д.
    */

   var _private = {
      updateValue: function(self) {
         if (self._options.readOnly) {

            //Insert text with inner html because value contains html string
            self._children.previewContainer.innerHTML = self._value;
         }
      }
   };

   var RichTextArea = Control.extend({
      _template: template,
      _htmlJson: undefined,

      _beforeMount: function(opts) {
         if (opts.json) {
            this._htmlJson = new HtmlJson();
            this._value = this._jsonToHtml(typeof opts.json === 'string' ? JSON.parse(opts.json) : opts.json);
         } else {
            this._value = opts.value;
         }
         this._simpleViewModel = new RichModel({
            value: this._value
         });
      },

      _afterMount: function() {
         _private.updateValue(this);
      },

      _beforeUpdate: function(opts) {
         if (opts.json) {
            var isOldJson = opts.json === (
               typeof opts.json === 'string'
                  ? JSON.stringify(this._htmlJson._options.json || this._htmlJson.json)
                  : this._htmlJson._options.json || this._htmlJson.json
            );
            if (!isOldJson) {
               this._value = this._jsonToHtml(typeof opts.json === 'string' ? JSON.parse(opts.json) : opts.json);
            }
         } else {
            this._value = opts.value;
         }
         if (!isOldJson && this._simpleViewModel.getValue() !== this._value) {
            this._simpleViewModel.updateOptions({
               value: this._value
            });
         }
      },

      _afterUpdate: function() {
         _private.updateValue(this);
      },

      _onTextChanged: function(e, value) {
         if (this._options.json) {
            this._notify('jsonChanged', [typeof this._options.json === 'string'
               ? JSON.stringify(this._valueToJson(value))
               : this._valueToJson(value)]);
         } else {
            this._notify('valueChanged', [value]);
         }
         this._simpleViewModel.updateOptions({
            value: value
         });
      },
      _valueToJson: function(newValue) {
         if (newValue[0] !== '<') {
            newValue = '<p>' + newValue + '</p>';
         }
         var span = document.createElement('span');
         span.innerHTML = newValue;
         var json = domToJson(span).slice(1);
         this._htmlJson.setJson(json);
         return json;
      },
      _jsonToHtml: function(json) {
         this._htmlJson.setJson(json);
         return this._htmlJson.render();
      }
   });
   return RichTextArea;
});
