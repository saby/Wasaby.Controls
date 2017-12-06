define('js!DemoComponents/Validation/Form1/Form1',
   [
      'Core/Control',
      'tmpl!DemoComponents/Validation/Form1/Form1',
      "Components/Validators/IsEmail"
   ],
   function(
      Base,
      template
   ){
      'use strict';

      var Form1 = Base.extend({
         _template: template,

         setText: function (text) {
            this._children.Form.getContainer()[0].controlNodes[0].control.setText(text);
         },
         validate: function() {
            return this._children.Form.submit();
         },
         onclick: function(e) {
            this.validate().addCallback(function(res) {
               console.log(res);
            }).addErrback(function(res) {
               console.error('err:', res);
            });
         }
      });
      return Form1;
   }
);