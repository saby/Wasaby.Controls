define('Controls/Application/startApplicationScript',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls/Application/startApplicationScript',
      'Controls/Application/HeadDataContext'
   ],

   function(Base, Deferred, template, HeadDataContext) {
      'use strict';

      var Page = Base.extend({
         _template: template,
         _beforeMount: function(opts, ctx) {
            if (typeof window !== 'undefined') {
               return;
            }
            var def = ctx.headData.waitAppContent();
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
      Page.contextTypes = function() {
         return {
            headData: HeadDataContext
         };
      };
      return Page;
   }
);
