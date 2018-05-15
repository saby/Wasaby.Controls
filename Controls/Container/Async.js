define('Controls/Container/Async',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls/Container/Async/Async'
   ],

   function(Base, Deferred, template) {
      'use strict';

      var Page = Base.extend({
         _template: template,
         _beforeMount: function(options, context) {
            if (typeof window !== 'undefined') {
               var def = new Deferred();
               require([options.templateName], function() {
                  def.callback();
               });
               return def;
            }
            context.headData.pushDepComponent(options.templateName);
            require(options.templateName);
         }
      });
      return Page;
   }
);
