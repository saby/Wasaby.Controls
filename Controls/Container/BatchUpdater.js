define('Controls/Container/BatchUpdater',
   [
      'Core/Control',
      'Core/ParallelDeferred',
      'Controls/Container/BatchUpdater'
   ],

   function(Base, ParallelDeferred, template) {
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
            var self = this;
            if (def._fired === 0 && (!self.callbackArray || self.callbackArray.length === 0)) {
               callback();
               return;
            }
            if (!self.pDef) {
               self.callbackArray = [];
               self.pDef = new ParallelDeferred();

               self.pDef.addCallback(function() {
                  for (var i = 0; i < self.callbackArray.length; i++) {
                     self.callbackArray[i].call();
                  }
               });
               setTimeout(function() {
                  self.callbackArray = [];
                  self.pDef = new ParallelDeferred();
               }, 0);
            }
            self.pDef.push(def);
            self.callbackArray.push(callback);
         }
      });
      return Async;
   }
);
