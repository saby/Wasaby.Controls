define('Controls/Container/PendingRegistrator', [
   'Core/Control',
   'tmpl!Controls/Container/PendingRegistrator/PendingRegistrator',
   'Core/Deferred',
   'Core/ParallelDeferred',
   'Core/IoC'
], function(Control, tmpl, Deferred, ParallelDeferred, IoC) {
   'use strict';

   var cnt = 0;

   var module = Control.extend({
      _template: tmpl,
      _pendings: null,
      _parallelDef: null,
      _beforeMount: function() {
         this._pendings = {};
      },
      _registerPendingHandler: function(e, def, config) {
         this._pendings[cnt] = {
            def: def,
            onPendingFail: config.onPendingFail,
            showLoadingIndicator: config.showLoadingIndicator
         };
         if (config.showLoadingIndicator && !def.isReady()) {
            this._children.loadingIndicator.toggleIndicator(true);
         }

         def.addCallback(function(cnt, res) {
            this._unregisterPending(cnt);
            return res;
         }.bind(this, cnt));
         def.addErrback(function(cnt, e) {
            this._unregisterPending(cnt);
            return e;
         }.bind(this, cnt));

         cnt++;
      },
      _unregisterPending: function(id) {
         delete this._pendings[id];

         if (!this._hasPendingsWithIndicator()) {
            this._children.loadingIndicator.toggleIndicator(false);
         }

         if (!this._hasRegisteredPendings()) {
            this._notify('pendingsFinished', [], { bubbling: true });
         }
      },
      _hasRegisteredPendings: function() {
         return !!Object.keys(this._pendings).length;
      },
      _hasPendingsWithIndicator: function() {
         var self = this;
         var res = false;
         Object.keys(this._pendings).forEach(function(key) {
            var pending = self._pendings[key];
            if (pending.showLoadingIndicator) {
               res = true;
            }
         });
         return res;
      },
      finishPendingOperations: function() {
         var resultDeferred = new Deferred(),
            parallelDef = new ParallelDeferred(),
            pendingResults = [];

         var self = this;
         Object.keys(this._pendings).forEach(function(key) {
            var pending = self._pendings[key];
            if (pending.onPendingFail) {
               var res = pending.onPendingFail();
               if (res instanceof Deferred) {
                  parallelDef.push(res);
               } else {
                  pendingResults.push(res);
               }
            } else {
               pendingResults.push(false);
            }
         });

         this._cancelFinishingPending();
         this._parallelDef = parallelDef.done().getResult();

         this._parallelDef.addCallback(function(results) {
            if (typeof results === 'object') {
               for (var resultIndex in results) {
                  if (results.hasOwnProperty(resultIndex)) {
                     var result = results[resultIndex];
                     pendingResults.push(result);
                  }
               }
            }

            self._parallelDef = null;

            resultDeferred.callback(pendingResults);
         }).addErrback(function(e) {
            if (!e.canceled) {
               IoC.resolve('ILogger').error('PendingRegistrator', 'PendingRegistrator error', e);
            }
            return e;
         });

         return resultDeferred;
      },
      _cancelFinishingPending: function() {
         if (this._parallelDef) {
            this._parallelDef._fired = -1;
            this._parallelDef.cancel();
         }
      }
   });

   return module;
});
