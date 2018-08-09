/*
 Created by Belotelov on 08.08.2018.
 */
define('Controls/Container/BatchUpdater',
   [
      'Core/Control',
      'Core/Deferred',
      'Core/ParallelDeferred',
      'Core/IoC',
      'Controls/Container/BatchUpdater'
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
      var Async = Base.extend({
         _template: template,
         requestHandler: function(evt, def, callback) {
            if(!callback instanceof Deferred) {
               IoC.resolve('ILogger').error('Event batchUpdate should pass deferred in parameters')
               return;
            }
            if(typeof callback !== 'function') {
               IoC.resolve('ILogger').error('Event batchUpdate should pass callback in parameters')
               return;
            }
            var self = this;
            if (!self.pDef) {
               self.callbackArray = [];
               self.pDef = new ParallelDeferred();

               setTimeout(function() {
                  var cbarr = self.callbackArray;
                  self.pDef.done().getResult().addCallback(function() {
                     for (var i = 0; i < cbarr.length; i++) {
                        cbarr[i].call();
                     }
                  });
                  self.pDef = null;
               }, 0);
            }
            self.pDef.push(def);
            self.callbackArray.push(callback);
         }
      });
      return Async;
   }
);
