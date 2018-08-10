define('Controls/Container/PendingRegistrator', [
   'Core/Control',
   'tmpl!Controls/Container/PendingRegistrator/PendingRegistrator',
   'Core/Deferred',
   'Core/ParallelDeferred',
   'Core/IoC'
], function(Control, tmpl, Deferred, ParallelDeferred, IoC) {
   'use strict';

   // счетчик-идентификатор пендинга
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
            // сам деферред, который сигнализирует о завершении пендинга
            def: def,
            // функция, которая помогает пендингу завершиться, когда идет запрос на завершение из finishPendingOperations
            onPendingFail: config.onPendingFail,
            // показывать ли индикатор во время навешенного пендинга
            showLoadingIndicator: config.showLoadingIndicator
         };
         if (config.showLoadingIndicator && !def.isReady()) {
            // покажем индикатор, если деферред на момент регистрации не завершился
            this._children.loadingIndicator.toggleIndicator(true);
         }

         def.addBoth(function(cnt, res) {
            this._unregisterPending(cnt);
            return res;
         }.bind(this, cnt));

         cnt++;
      },
      _unregisterPending: function(id) {
         delete this._pendings[id];

         // если больше нет пендингов с отображением индикатора, убираем индикатор
         if (!this._hasPendingsWithIndicator()) {
            this._children.loadingIndicator.toggleIndicator(false);
         }

         // если больше нет никаких пендингов, уведомляем
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
                  // сохраним результат завершения пендинга
                  pendingResults.push(res);
               }
            } else {
               // пендинг завершился без результата
               pendingResults.push(undefined);
            }
         });

         // отменим предыдущий запрос на завершение пендингов и создадим новый
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
            // чтобы отменить результирующий деферред параллельного деферреда, нужно сбросить состояние этого деферреда
            this._parallelDef._fired = -1;
            this._parallelDef.cancel();
         }
      }
   });

   return module;
});
