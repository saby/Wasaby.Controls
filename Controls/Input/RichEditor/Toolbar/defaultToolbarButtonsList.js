define('Controls/Input/RichEditor/Toolbar/defaultToolbarButtonsList', [
   'Controls/Input/RichEditor/Toolbar/buttonConstants'
], function(buttonConstants) {
   /**
    * Module with default toolbar buttons
    */

   return [
      buttonConstants.UNDO,
      buttonConstants.REDO,
      buttonConstants.CUSTOM_FORMAT,
      buttonConstants.BOLD,
      buttonConstants.ITALIC,
      buttonConstants.UNDERLINE,
      buttonConstants.STROKED,
      buttonConstants.COLOR,
      buttonConstants.BLOCKQUOTE,
      buttonConstants.ALIGN,
      buttonConstants.LIST,
      buttonConstants.LINK,
      buttonConstants.UNLINK,
      buttonConstants.PASTE
   ];
});
