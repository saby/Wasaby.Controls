define('Controls-demo/PendingRegistrator/Content', [
   'Core/Control',
   'wml!Controls-demo/PendingRegistrator/Content',
   'Core/IoC',
   'Core/Deferred',
   'css!Controls-demo/PendingRegistrator/Content'
], function(Control, tmpl, IoC, Deferred) {
   'use strict';

   var timeout = 3000;

   var module = Control.extend({
      _template: tmpl,
      _register: function() {
         var self = this;
         if (!this._def) {
            var def = new Deferred();
            this._notify('registerPending', [def, {
               onPendingFail: function() {
                  self._notify('finishingPendingProcess', [timeout], { bubbling: true });
                  setTimeout(function() {
                     if (!def.isReady()) {
                        self._notify('finishedPendingProcess', [timeout], { bubbling: true });
                        def.callback(true);
                     }
                     self._def = null;
                  }, timeout);
               }
            }], { bubbling: true });
            this._def = def;
         } else {
            IoC.resolve('ILogger').error('Controls-demo/PendingRegistrator/Content', 'Pending registered already.');
         }
      }
   });

   return module;
});
