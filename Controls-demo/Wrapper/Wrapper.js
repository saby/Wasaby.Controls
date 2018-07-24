define('Controls-demo/Wrapper/Wrapper',
   [
      'Core/Control',
      'tmpl!Controls-demo/Wrapper/Wrapper'

   ],
   function(Control, template) {


      var Wrapper = Control.extend({

         _template: template

      });

      return Wrapper;

   });
