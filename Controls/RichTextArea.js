define('Controls/RichTextArea', [
   'Core/Control',
   'tmpl!Controls/RichTextArea/RichTextArea',
   'Core/constants',
   'Controls/RichAreaController',
   'Core/moduleStubs',
   'Core/Deferred',
   'View/decorators'
], function(Control, template, constants, editController, moduleStubs, Deferred) {
   'use strict';

   var RichEdtior = Control.extend({
         _template: template,
         value: '',
         text: '',
         enabled: null,
         _tinyMCErequied: false,
         editorConfig: editController.editorConfiguration,

         _beforeMount: function(opts) {
            var self = this;
            this.value = opts.value;
            if (opts.enabled) {
               var result = new Deferred();
               result.dependOn(self.loadTinyMCE());
               return result;
            }
         },

         loadTinyMCE: function() {
            return this._tinyMCEdeferred || (this._tinyMCEdeferred = moduleStubs.require(['SBIS3.CONTROLS/RichEditor/third-party/tinymce/tinymce.min']));
         },

         _afterMount: function(opts) {
            var text = this._prepareReviewContent(opts.value);
            if (opts.enabled) {
               this.tinyInit();
               this._children.mceEditor.innerHTML = text;
            } else {
               this._children.textContainer.innerHTML = text;
            }
         },

         _beforeUpdate: function(opts) {
            var text = this._prepareReviewContent(opts.value);
            if (this._children.mceEditor) {
               this._children.mceEditor.innerHTML = text;
            } else {
               this._children.textContainer.innerHTML = text;
            }
            if (this._options.enabled != opts.enabled) {
               this._toggleEditorEnabled(opts.enabled);
            }
         },

         _toggleEditorEnabled: function(newState) {
            var self = this;
            if (newState) {
               return this.loadTinyMCE().addCallback(function() {
                  self.tinyInit();
               });
            } else {
               self._tinyEditor.destroy() && (self._tinyEditor.destroyed = true) && (self._tinyEditor = null);
            }
         },

         tinyInit: function() {
            var self = this;
            self._inputControl = self._children.mceEditor;
            self.editorConfig.setup = function(editor) {
               self._tinyEditor = editor;
               editController._bindEvents(self);
            };
            self.editorConfig.target = self._children.mceEditor;
            tinyMCE.init(self.editorConfig);
         },

         _prepareReviewContent: function(text) {
            if (text && text[0] !== '<') {
               text = '<p>' + text.replace(/\n/gi, '<br/>') + '</p>';
            }
            return text;
         },

         _textChanged: function() {
            this._notify('textChanged', [this._children.mceEditor.innerHTML]);
         }
      }
   );


   return RichEdtior;
});
