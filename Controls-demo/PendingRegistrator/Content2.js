define('Controls-demo/PendingRegistrator/Content2', [
   'Core/Control',
   'wml!Controls-demo/PendingRegistrator/Content2',
   'Core/IoC',
   'Core/Deferred',
   'css!Controls-demo/PendingRegistrator/Content2'
], function(Control, tmpl, IoC, Deferred) {
   'use strict';

   var timeout = 3000;

   var module = Control.extend({
      _template: tmpl,
      _register: function() {
         if (!this._def) {
            var def = new Deferred();
            this._notify('registerPending', [def], { bubbling: true });
            this._def = def;
         } else {
            IoC.resolve('ILogger').error('Controls-demo/PendingRegistrator/Content2', 'Pending registered already.');
         }
      },
      _finish: function() {
         var self = this;
         self._notify('finishingPendingProcess', [timeout], { bubbling: true });
         setTimeout(function() {
            if (!self._def.isReady()) {
               self._notify('finishedPendingProcess', [timeout], { bubbling: true });
               self._def.callback(true);
            }
            self._def = null;
         }, timeout);
      },
      _cancel: function() {
         this._notify('cancelFinishingPending', [], { bubbling: true });
      }
   });

   return module;
});
