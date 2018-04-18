define('Controls/RichAreaController', [
   'Core/constants'
], function (cConstants) {
   'use strict';

   return {
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
         noneditable_noneditable_class: "controls-RichEditor__noneditable",
         object_resizing: false,
         inline_boundaries: false
      },
      _bindEvents: function(self) {
         var editor = self._tinyEditor;


      }
   };
});
