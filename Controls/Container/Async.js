define('Controls/Container/Async',
   [
      'Core/Control',
      'Core/Deferred',
      'Controls/Application/HeadDataContext',
      'tmpl!Controls/Container/Async/Async'
   ],

   function(Base, Deferred, HeadDataContext, template) {
      'use strict';


      /**
       * Container for asynchronously loading components.
       *
       * @class Controls/Container/Async
       * @extends Core/Control
       * @control
       * @public
       * @category Container
       *
       * @name Controls/Container/Async#content
       * @cfg {Content} Container contents.
       *
       * @name Controls/Container/Async#templateName
       * @cfg {String} Name of asynchronously loading component
       */
      var Async = Base.extend({
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
      Async.contextTypes = function() {
         return {
            headData: HeadDataContext
         };
      };
      return Async;
   }
);
