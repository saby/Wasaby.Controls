define('Controls/Input/RichArea/helpers/handlers/key', [
   'Controls/Input/RichArea/helpers/text',
   'Controls/Input/RichArea/helpers/editor',
   'Controls/Input/RichArea/helpers/placeholder'
], function(textHelper, editorHelper, placeholderHelper) {
   /**
    * Module with key handlers
    */

   var KeyHandlersHelper = {
      inputHandler: function() {
         var newValue = textHelper.trimText(editorHelper.getEditorValue(this));

         if (this._value !== newValue) {
            this._value = newValue;
            this._notify('valueChanged', [this._value]);
         }

         this._placeHolderActive = placeholderHelper.isPlaceholderActive(newValue);
      }
   };

   return KeyHandlersHelper;
});
