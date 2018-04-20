define('Controls/Container/TinyMCE', [
   'Core/Control',
   'Core/constants',
   'tmpl!Controls/Container/TinyMCE/TinyMCE',
   'Core/moduleStubs'
], function(Control, cConstants, template, moduleStabs) {
   'use strict';

   var _private = {
         prepareReviewContent: function(text) {
            if (text && text[0] !== '<') {
               text = '<p>' + text.replace(/\n/gi, '<br/>') + '</p>';
            }
            return text;
         }
      },
      tinyMCEController = Control.extend({
         _template: template,
         editorConfiguration: {
            className: null,
            plugins: 'media,paste,lists,noneditable,codesample',
            codesample_content_css: false,
            inline: true,
            relative_urls: false,
            convert_urls: false,
            formats: cConstants.styles,
            paste_webkit_styles: 'color font-size text-align text-decoration width height max-width padding padding-left padding-right padding-top padding-bottom',
            paste_retain_style_properties: 'color font-size text-align text-decoration width height max-width padding padding-left padding-right padding-top padding-bottom',
            paste_as_text: true,
            extended_valid_elements: 'div[class|onclick|style|id],img[unselectable|class|src|alt|title|width|height|align|name|style]',
            body_class: 'ws-basic-style',
            invalid_elements: 'script',
            paste_data_images: false,
            paste_convert_word_fake_lists: false, //TODO: убрать когда починят https://github.com/tinymce/tinymce/issues/2933
            statusbar: false,
            toolbar: false,
            menubar: false,
            browser_spellcheck: true,
            smart_paste: true,
            noneditable_noneditable_class: 'controls-RichEditor__noneditable',
            object_resizing: false,
            inline_boundaries: false
         },

         _shouldUpate: function() {
            return false;
         },

         _beforeMount: function() {
            if (cConstants.isBrowserPlatform) {
               return moduleStabs.require([cConstants.browser.isIE10 ? 'SBIS3.CONTROLS/RichEditor/third-party/tinymce46-ie10' : 'SBIS3.CONTROLS/RichEditor/third-party/tinymce/tinymce.min']);
            }
         },


         _afterMount: function(opts) {
            this.tinyInit();
            this._children.mceContainer.innerHTML = _private.prepareReviewContent(opts.value);
         },

         setCursorToTheEnd: function() {
            var editor = this._tinyEditor;
            if (editor && this._active) {
               var nodeForSelect = editor.getBody();
               editor.selection.select(nodeForSelect, true);
               editor.selection.collapse(false);
            }
         },

         _bindEvents: function() {
            console.log('success');
         },

         _beforeUpdate: function(opts) {
            this._children.mceContainer.innerHTML = _private.prepareReviewContent(opts.value);
         },


         tinyInit: function() {
            var self = this;
            self.editorConfiguration.target = self._children.mceContainer;
            self.editorConfiguration.setup = function(editor) {
               self._tinyEditor = editor;
               self._bindEvents();
            };
            tinyMCE.init(this.editorConfiguration);
         },

         textChanged: function() {
            this._notify('textChanged', [this._children.mceContainer.innerHTML]);
         }
      });

   return tinyMCEController;
});
