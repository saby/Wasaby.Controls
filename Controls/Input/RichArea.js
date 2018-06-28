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
         if (this._simpleViewModel.getValue() !== opts.value) {
            this.setValue(opts.value);
         }
      },

      _afterUpdate: function() {
         if (this._options.readOnly) {
            this._children.previewContainer.innerHTML = this._simpleViewModel.getValue();
         }
      },

      _onTextChanged: function(e, value) {
         this._notify('valueChanged', [value]);
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
