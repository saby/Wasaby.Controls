define('Controls-demo/HtmlJsonAttributes/HtmlJsonAttributes',
   [
      'Core/Control',
      'wml!Controls-demo/HtmlJsonAttributes/HtmlJsonAttributes'
   ],
   function(Control, template) {
      return Control.extend({
         _template: template,
         json: [
            ['div', 'Привет, мир!']
         ]
      });
   });
