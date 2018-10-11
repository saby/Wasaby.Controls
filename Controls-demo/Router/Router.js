define('Controls-demo/Router/Router',
   [
      'Core/Control',
      'wml!Controls-demo/Router/Router'
   ],
   function(Control, template) {
      'use strict';

      var module = Control.extend({
         _template: template,
         routerCreatedHandler: function(e, router) {
            console.log('routerCreated event', router._options.name);
         },
         routerUpdatedHandler: function(e, regexp, urlOptions, isRoot) {
            console.log('routerUpdated event', regexp, urlOptions, isRoot);
         },
         routerDestroyedHandler: function(e, router) {
            console.log('routerDestroyed event', router._options.name);
         }
      });

      return module;
   });
