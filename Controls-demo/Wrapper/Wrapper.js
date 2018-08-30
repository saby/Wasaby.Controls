define('Controls-demo/Wrapper/Wrapper',
   [
      'Core/Control',
      'wml!Controls-demo/Wrapper/Wrapper'

   ],
   function(Control, template) {


      var Wrapper = Control.extend({

         _template: template

      });

      return Wrapper;

   });
