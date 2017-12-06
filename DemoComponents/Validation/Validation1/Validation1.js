define('js!DemoComponents/Validation/Validation1/Validation1',
   [
      'Core/Control',
      'tmpl!DemoComponents/Validation/Validation1/Validation1',
      "Components/Validators/IsEmail"
   ],
   function(
      Base,
      template
   ){
      'use strict';

      var Validation1 = Base.extend({
         _template: template
      });
      return Validation1;
   }
);