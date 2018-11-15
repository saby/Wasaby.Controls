define('Controls/Input/RichArea/helpers/config', [
   'Controls/Input/RichArea/helpers/constants'
], function(constantsHelper) {
   /**
    * Module with default tinymce's configuration
    */

   var ConfigPlugin = {
      editorConfig: {
         theme: false,
         className: null,
         helpers: 'media,paste,lists,noneditable,codesample',
         codesample_content_css: false,
         inline: true,
         relative_urls: false,
         convert_urls: false,
         formats: constantsHelper.tinyConstants.styles,
         paste_webkit_styles: 'color font-size font-weight font-style font-family text-align text-decoration width height max-width line-height padding padding-left padding-right padding-top padding-bottom background',
         paste_retain_style_properties: 'color font-size font-weight font-style font-family text-align text-decoration width height max-width line-height padding padding-left padding-right padding-top padding-bottom background',
         paste_as_text: true,
         extended_valid_elements: 'div[class|onclick|style|id],img[unselectable|class|src|alt|title|width|height|align|name|style]',
         body_class: 'ws-basic-style',
         invalid_elements: 'script',
         paste_data_images: false,
         paste_convert_word_fake_lists: false, // TODO: убрать когда починят https://github.com/tinymce/tinymce/issues/2933
         statusbar: false,
         toolbar: false,
         menubar: false,
         browser_spellcheck: true,
         smart_paste: true,
         noneditable_noneditable_class: 'controls-RichEditor__noneditable',
         object_resizing: false,
         inline_boundaries: false
      }
   };

   return ConfigPlugin;
});
