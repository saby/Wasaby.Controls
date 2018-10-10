define('Controls-demo/Router/RouterController',
   [
      'Core/Control',
      'wml!Controls-demo/Router/RouterController'
   ],
   function(Control, template) {
      'use strict';

      var module = Control.extend({
         _template: template
      });

      return module;
   });
