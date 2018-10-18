define('Controls/Input/RichArea/plugins/handlers/key', [
   'Controls/Input/RichArea/plugins/text',
   'Controls/Input/RichArea/plugins/editor'
], function(textPlugin, editorPlugin) {
   /**
    * Модуль содержащий обработчики ввода в БТР
    */

   var KeyHandlersPlugin = {
      inputHandler: function() {
         var newValue = textPlugin.trimText(editorPlugin.getEditorValue(this));

         if (this._value !== newValue) {
            this._value = newValue;
            this._notify('valueChanged', [this._value]);
         }
      },
   };

   return KeyHandlersPlugin;
});
