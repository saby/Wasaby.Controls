define('Controls-demo/Router/Panel',
   [
      'Core/Control',
      'wml!Controls-demo/Router/Panel'
   ],
   function(Control, template) {
      'use strict';

      var module = Control.extend({
         _template: template,
         innChanged: function(e, value) {
            this._notify('innChanged', [value], { bubbling: true });
         },
         kppChanged: function(e, value) {
            this._notify('kppChanged', [value], { bubbling: true });
         }
      });

      return module;
   });
