define('js!WSControls/TextBoxes/TextBoxBase',
[
   'Core/Control'
], function(Control) {
   var TextBoxBase = Control.extend({
      _controlName: 'WSControls/TextBoxes/TextBoxBase',
      iWantVDOM: true,

      constructor: function(cfg) {
         TextBoxBase.superclass.constructor.apply(this, arguments);
         this._publish('onChangeText');
      },

      _onChangeText: function(e) {
         var
            text = e.target.value,
            newTextIsEmpty = this._isEmptyValue(text),
            newText = newTextIsEmpty ? text : this._formatText(text);
         if (this._options.text !== newText) {
            this._notify('onChangeText', newText);
         }
      },

      //Проверка на пустое значение, их нужно хранить в неизменном виде, но отображать как пустую строку
      _isEmptyValue: function(text){
         return text === null || text === "" || typeof text === "undefined";
      },

      _formatText: function(text) {
         return text || '';
      }
   });

   return TextBoxBase;
});