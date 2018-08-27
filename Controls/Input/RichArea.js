define('Controls/Input/RichArea', [
   'Core/Control',
   'tmpl!Controls/Input/RichArea/RichArea',
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
    * @authors Зайцев А.С.
    */

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
            this.setValue(this._value);
         }
      },

      _afterUpdate: function() {
         if (this._options.readOnly) {
            this._children.previewContainer.innerHTML = this._simpleViewModel.getValue();
         }
      },

      _onTextChanged: function(e, value) {
         if (this._options.json) {
            this._notify('jsonChanged', [typeof this._options.json === 'string'
               ? JSON.stringify(this._valueToJson(value))
               : this._valueToJson(value)]);
         } else {
            this._notify('valueChanged', [value]);
         }
         this.setValue(value);
      },
      insertHtml: function(html) {
         this._children.tinyMCE.insertHtml(html);
      },
      insertSmile: function(smile) {
         this._children.tinyMCE.insertSmile(smile);
      },
      canUploadMultiSelect: function() {
         return this._children.tinyMCE.canUploadMultiSelect();
      },
      selectAndUploadImage: function() {
         this._children.tinyMCE.selectAndUploadImage();
      },
      pasteFromBufferWithStyles: function(onAfterCloseHandler, target, saveStyles) {
         this._children.tinyMCE.pasteFromBufferWithStyles(onAfterCloseHandler, target, saveStyles);
      },
      insertLink: function(onAfterCloseHandler, target) {
         this._children.tinyMCE.insertLink(onAfterCloseHandler, target);
      },
      setFontColor: function(color) {
         this._children.tinyMCE.setFontColor(color);
      },
      setTextAlign: function(align) {
         this._children.tinyMCE.setTextAlign(align);
      },
      setFontStyle: function(style) {
         this._children.tinyMCE.setFontStyle(style);
      },
      execCommand: function(command) {
         this._children.tinyMCE.execCommand(command);
      },
      getHistory: function() {
         return this._children.tinyMCE.getHistory();
      },
      setValue: function(newValue) {
         this._simpleViewModel.updateOptions({
            value: newValue
         });
         if (!this._options.readOnly) {
            this._children.tinyMCE.setText(newValue);
         } else {
            this._children.previewContainer.innerHTML = this._simpleViewModel.getValue();
         }
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
      },
      showCodeSample: function() {
         this._children.tinyMCE.showCodeSample();
      },
      _updateScrollContainerHeightHandler: function(event, height) {
         this._children.areaScrollContainer.style.height = height;
      },
      _updateScrollContainerScrollTopHandler: function(event, value) {
         this._children.areaScrollContainer.scrollTop = value;
      },
      _updateScrollContainerMaxHeightHandler: function(event, height) {
         this._children.areaScrollContainer.style['max-height'] = height;
      },
      getCurrentFormats: function() {
         return this._children.tinyMCE.getCurrentFormats();
      },
      applyFormats: function(formats) {
         this._children.tinyMCE.applyFormats(formats);
      }
   });
   return RichTextArea;
});
