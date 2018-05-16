define('Controls-demo/MiniCard/MiniCard',
   [
      'Core/Control',
      'tmpl!Controls-demo/MiniCard/MiniCard'
   ],
   function(Control, template) {

      'use strcit';

      var MiniCard = Control.extend({
         _template: template
      });

      return MiniCard;
   }
);