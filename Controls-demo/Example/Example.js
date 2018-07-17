define('Controls-demo/Example/Example',
   [
      'Core/Control',
      'tmpl!Controls-demo/Example/Example'
   ],
   function(Control, template) {

      'use strict';

      var data = [
         {name: 'Input/Password', title: 'Password'}
      ];

      var Example = Control.extend({
         _template: template,

         _href: null,

         _data: null,

         _beforeMount: function() {
            this._data = data;
            this._href = location.origin + location.pathname;
         }
      });

      return Example;
   }
);
