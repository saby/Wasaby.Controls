define('Controls/Application/startApplicationScript',
   [
      'Core/Control',
      'Core/Deferred',
      'View/Request',
      'wml!Controls/Application/startApplicationScript'
   ],

   function(Base, Deferred, Request, template) {
      'use strict';

      var Page = Base.extend({
         _template: template,
         _beforeMountLimited: function() {
            // This component awaits completion of building content of _Wait component
            // So we don't need timeout of async building in this component
            // Because we need to build depends list in any case
            // before returning html to client
            return this._beforeMount.apply(this, arguments);
         },
         _beforeMount: function(opts) {
            if (typeof window !== 'undefined') {
               return;
            }
            var def = Request.getCurrent().getStorage('HeadData').waitAppContent();
            var self = this;
            var innerDef = new Deferred();
            def.addCallback(function onLoad(res) {
               self.additionalDeps = res.additionalDeps;
               innerDef.callback(true);
               return res;
            });
            return innerDef;
         },
         getDeps: function() {
            if (!this.additionalDeps || !this.additionalDeps.length) {
               return '[]';
            }
            var result = '[ ';
            for (var i = 0; i < this.additionalDeps.length; i++) {
               result += (i === 0 ? '' : ', ') + '"' + this.additionalDeps[i] + '"';
            }
            result += ' ]';
            return result;
         }

      });
      return Page;
   }
);
