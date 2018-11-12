define('Controls/Input/RichArea/helpers/format', [
   'Controls/Input/RichArea/helpers/constants',
   'Controls/Input/RichArea/helpers/editor',
   'Core/core-clone'
], function(constantsHelper, editorHelper, cClone) {
   /**
    * Module which provides work with editor's formats
    */

   var _private = {
      getFormat: function(self, formatName) {
         var editor = self._editor,
            selection = editorHelper.getSelection(self),
            currentNode = selection.getNode();

         switch (formatName) {
            case 'forecolor':
               return {
                  formatName: 'forecolor',
                  state: editor.dom.getStyle(currentNode, 'color', true)
               };
            case 'fontsize':
               return {
                  formatName: 'fontsize',
                  state: editor.dom.getStyle(currentNode, 'font-size', true)
               };
            default:
               return {
                  formatName: formatName,
                  state: editor.formatter.match(formatName)
               };
         }
      }
   };

   var FormatHelper = {

      /**
       * Function returns array with current formats
       * @param self
       * @returns {Array}
       */
      getCurrentFormats: function(self) {
         var formats = [];

         self._formats.forEach(function(formatName) {
            formats.push(_private.getFormat(self, formatName));
         });

         return formats;
      },

      /**
       * Function init formats in TinyMCE
       * @param self
       * @param additionalFormats
       */
      initFormats: function(self, additionalFormats) {
         self._formats = cClone(constantsHelper.defaultFormats);
         for (var formatName in additionalFormats) {
            self._formats.push(formatName);
         }
      }
   };

   return FormatHelper;
});
