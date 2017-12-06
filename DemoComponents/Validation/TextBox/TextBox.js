define('js!DemoComponents/Validation/TextBox/TextBox',
   [
      'Core/Control',
      'tmpl!DemoComponents/Validation/TextBox/TextBox'
   ],
   function(
      Base,
      template
   ){
      'use strict';

      var Textbox = Base.extend({
         _template: template,

         text: '',

         onTextChange: function(e) {
            this.setText(e.target.value);
         },
         setText: function(text) {
            this.text = text;
            this._notify('textchanged', this.text);
         }
      });
      return Textbox;
   }
);