define('Controls/Container/PendingRegistrator', [
   'Core/Control',
   'wml!Controls/Container/PendingRegistrator/PendingRegistrator',
   'Core/Deferred',
   'Core/ParallelDeferred'
], function(Control, tmpl, Deferred, ParallelDeferred) {
   'use strict';

   /**
    * PendingRegistrator is control (HOC) that helps to distribute order of action executions in the system.
    * Or, more specifically, it's controlling execution of necessary actions that must be complete before starting current action.
    * Current action requests Deferred instance that will be resolved when all necessary actions ends.
    * For example, panel must be closed only after resolving the question about saving of changed data containing this panel.
    *
    * Pending is registered necessary action that must ends before current action starts.
    * It would be some pendings registered in current PendingRegistrator instance. Therefore, all of pendings must be ends
    * for unlock next action.
    * @remark
    * PendingRegistrator is able to ask a confirmation question before closing of tab/browser if pending(s) is registered.
    * PendingRegistrator has it's own LoadingIndicator that can shows while pending is resolving. This LoadingIndicator has default options.
    * In moment when first pending with option showLoadingIndicator = true will be registered LoadingIndicator shows indicator.
    * In moment when last pending with option showLoadingIndicator = true will be unregistered LoadingIndicator hides indicator.
    *
    * PendingRegistrator is waiting 2 events: registerPending and cancelFinishingPending.
    *
    * registerPending - registrate the pending
    * registerPending has 2 arguments: [deferred, config].
    * dererred - pending will be unregistered when this deferred resolves
    * config is object having properties:
    *    - showLoadingIndicator - show loading indicator or not (during time while pending is registered)
    *    - onPendingFail - helps to resolve deferred of pending. It will be called when finishPendingOperations calls.
    *
    * onPendingFail has 1 argument - forceFinishValue. forceFinishValue give additional information how to resolve deferred.
    * For example, if pending registered by changed record and we need to save changes, by default we can ask a question about it.
    * But forceFinishValue can means forced answer and we can save (or not) record without asking a question.
    *
    * cancelFinishingPending - cancels deferred returned by finishPendingOperations. This deferred never resolve. It's need
    * to request new deferred by finishPendingOperations for setting callback on pendings finish.
    * It can be useful when pending can't be resolved now but will be resolve later another way.
    * For example, panel waiting finish of pendings before close, but record can not be saved because of validation errors.
    * In this case, if we don't cancel deferred by finishPendingOperations, panel will be closed later when validation errors
    * will be corrected. It will be unexpected closing of panel for user who maybe don't want to close panel anymore
    * in the light of developments.
    *
    * @class Controls/Container/LoadingIndicator
    * @extends Core/Control
    * @control
    * @author Krasilnikov A.
    * @public
    * @category Container
    * @demo Controls-demo/Container/LoadingIndicator
    */

   /**
    * @event pendingsFinished Event will be notified in moment when no more pendings in PendingRegistrator
    * (after moment of last pending is resolving).
    * @param {SyntheticEvent} eventObject.
    */

   // pending identificator counter
   var cnt = 0;

   var module = Control.extend({
      _template: tmpl,
      _pendings: null,
      _parallelDef: null,
      _beforeMount: function() {
         var self = this;
         if (typeof window !== 'undefined') {
            self._beforeUnloadHandler = function(event) {
               // We shouldn't close the tab if there are any pendings
               if (self._hasRegisteredPendings()) {
                  event.preventDefault();
                  event.returnValue = '';
               }
            };
            window.addEventListener('beforeunload', self._beforeUnloadHandler);
         }
         this._pendings = {};
      },
      _registerPendingHandler: function(e, def, config) {
         config = config || {};
         this._pendings[cnt] = {

            // its deferred what signalling about pending finish
            def: def,

            // its function what helps pending to finish when query goes from finishPendingOperations
            onPendingFail: config.onPendingFail,

            // show indicator when pending is registered
            showLoadingIndicator: config.showLoadingIndicator
         };
         if (config.showLoadingIndicator && !def.isReady()) {
            // show indicator if deferred still not finished on moment of registration
            this._children.loadingIndicator.show();
         }

         def.addBoth(function(cnt, res) {
            this._unregisterPending(cnt);
            return res;
         }.bind(this, cnt));

         cnt++;
      },
      _unregisterPending: function(id) {
         delete this._pendings[id];

         // hide indicator if no more pendings with indicator showing
         if (!this._hasPendingsWithIndicator()) {
            this._children.loadingIndicator.hide();
         }

         // notify if no more pendings
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

      /**
       * Method returns deferred resolving when all pendings will be resolved.
       * deferred callbacks with array of results of pendings.
       * If one of pending's deferred will be rejected (call errback), deferred of finishPendingOperations will be rejected too.
       * If finishPendingOperations will be called some times, only last call will be actual, but another returned deffereds
       * will be cancelled.
       * When finishPendingOperations calling, every pending trying to finish by calling it's onPendingFail method.
       * If onPendingFail is not setted, pending registration notified control is responsible for pending's deffered resolving.
       * @param forceFinishValue this argument use as argument of onPendingFail.
       * @returns {Deferred} deferred resolving when all pendings will be resolved
       */
      finishPendingOperations: function(forceFinishValue) {
         var resultDeferred = new Deferred(),
            parallelDef = new ParallelDeferred(),
            pendingResults = [];

         var self = this;
         Object.keys(this._pendings).forEach(function(key) {
            var pending = self._pendings[key];
            if (pending.onPendingFail) {
               pending.onPendingFail(forceFinishValue);
            }

            // pending is waiting its def finish
            parallelDef.push(pending.def);
         });

         // cancel previous query of pending finish. create new query.
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
               resultDeferred.errback(e);
            }
            return e;
         });

         return resultDeferred;
      },
      _cancelFinishingPending: function() {
         if (this._parallelDef) {
            // its need to cancel result deferred of parallel defered. reset state of deferred to achieve it.
            this._parallelDef._fired = -1;
            this._parallelDef.cancel();
         }
      },
      _beforeUnmount: function() {
         window.removeEventListener('beforeunload', this._beforeUnloadHandler);
      }
   });

   return module;
});
