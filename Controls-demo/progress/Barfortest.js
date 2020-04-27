define('Controls-demo/progress/Barfortest', [
   'Core/Control',
   'wml!Controls-demo/progress/Barfortest',
   'css!Controls-demo/progress/Barfortest'
], function(Control, template) {

   var Index = Control.extend(
      {
         _template: template

      });




   return Index;
});
