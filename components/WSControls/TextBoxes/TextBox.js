define('js!WSControls/TextBoxes/TextBox',
[
   'js!WSControls/TextBoxes/TextBoxBase',
   'tmpl!WSControls/TextBoxes/TextBox',
   'tmpl!WSControls/TextBoxes/resources/textFieldWrapper',
   'css!WSControls/TextBoxes/TextBox'
], function(TextBoxBase, template, textFieldWrapper) {
   var TextBox = TextBoxBase.extend({
      _controlName: 'WSControls/TextBoxes/TextBox',
      _template: template,
      _textFieldWrapper: textFieldWrapper,
      _beforeFieldWrapper: null,
      _afterFieldWrapper: null
   });

   return TextBox;
});