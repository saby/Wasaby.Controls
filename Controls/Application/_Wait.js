define('Controls/Application/_Wait',
   [
      'Core/Control',
      'Core/Deferred',
      'View/Request',
      'wml!Controls/Application/_Wait'
   ],

   function(Base, Deferred, Request, template) {
      'use strict';

      var asyncTemplate = function() {
         var res = template.apply(this, arguments);
         var self = this;
         if (res.then) {
            res.then(function(result) {
               self._resolvePromiseFn();
               return result;
            });
         } else {
            self._resolvePromiseFn();
         }
         return res;
      };

      // Template functions should have true "stable" flag to send error on using, for example, some control instead it.
      asyncTemplate.stable = template.stable;

      var Page = Base.extend({
         _template: asyncTemplate,
         _resolvePromise: null,
         _resolvePromiseFn: function() {
            if (this._resolvePromise) {
               this._resolvePromise();
               this._resolvePromise = null;
            }
         },
         _createPromise: function() {
            this.waitDef = new Promise(function(resolve) {
               this._resolvePromise = resolve;
            }.bind(this));
         },
         _beforeMount: function() {
            this._createPromise();
            Request.getCurrent().getStorage('HeadData').pushWaiterDeferred(this.waitDef);
            if (typeof window !== 'undefined') {
               this._resolvePromiseFn();
               this._createPromise();
            }
         }
      });

      return Page;
   }
);
