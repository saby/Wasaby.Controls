/*
 Created by Belotelov on 08.08.2018.
 */
define('Controls/Container/BatchUpdater',
   [
      'Core/Control',
      'Core/Deferred',
      'Core/ParallelDeferred',
      'Core/IoC',
      'wml!Controls/Container/BatchUpdater/BatchUpdater'
   ],

   function(Base, Deferred, ParallelDeferred, IoC, template) {
      'use strict';

      /**
       * Container for batch updates.
       *
       * @class Controls/Container/BatchUpdater
       * @extends Core/Control
       * @control
       * @public
       * @category Container
       *
       * @name Controls/Container/BatchUpdater#content
       * @cfg {Content} Container contents.
       *
       */
      var BatchUpdater;
      BatchUpdater = Base.extend({
         _template: template,
         constructor: function() {
            BatchUpdater.superclass.constructor.apply(this, arguments);
            this._forceUpdate = function() {
               // Do nothing
               // This method will be called because of handling event.
               // But BatchUpdater controls updates of inner controls independently
            };
         },
         requestHandler: function(evt, def, callback) {
            if (!(def instanceof Deferred)) {
               IoC.resolve('ILogger').error('Event batchUpdate should pass deferred in parameters');
               return;
            }
            if (typeof callback !== 'function') {
               IoC.resolve('ILogger').error('Event batchUpdate should pass callback in parameters');
               return;
            }
            var self = this;
            if (!self.pDef) {
               self.callbackArray = [];
               self.pDef = new ParallelDeferred();

               setTimeout(function() {
                  var updated = false;
                  var cbarr = self.callbackArray;

                  function update() {
                     if (!updated) {
                        updated = true;
                        for (var i = 0; i < cbarr.length; i++) {
                           cbarr[i].call();
                        }
                     }
                  }

                  setTimeout(function batchUpdateTimeout() {
                     update();
                  }, 2000);
                  self.pDef.done().getResult().addCallback(function() {
                     update();
                  });
                  self.pDef = null;
               }, 0);
            }
            self.pDef.push(def);
            self.callbackArray.push(callback);
         },
         _forceUpdate: function() {
            // Do nothing
            // This method will be called because of handling event.
            // But BatchUpdater controls updates of inner controls independently
         }
      });
      return BatchUpdater;
   }
);
