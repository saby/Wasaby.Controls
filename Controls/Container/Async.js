define('Controls/Container/Async',
   [
      'Core/Control',
      'Core/Deferred',
      'Core/IoC',
      'Controls/Application/HeadDataContext',
      'wml!Controls/Container/Async/Async',
      'View/Runner/requireHelper'
   ],

   function(Base, Deferred, IoC, HeadDataContext, template, requireHelper) {
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
         optionsForComponent: {},
         _beforeMount: function(options, context) {
            var self = this;
            self.optionsForComponent = options.templateOptions || {};
            if (typeof window !== 'undefined') {
               if (!requireHelper.defined(options.templateName)) {
                  var def = new Deferred();
                  require([options.templateName], function(tpl) {
                     self.optionsForComponent.resolvedTemplate = tpl;
                     def.callback();
                  }, function() {
                     self.error = 'Error loading ' + options.templateName;
                     IoC.resolve('ILogger').error('Async render error', self.error);
                     def.callback();
                  });
                  return def;
               }
               self.optionsForComponent.resolvedTemplate = requireHelper.require(options.templateName);
               return;
            }
            
            /*It can work without Controls.Application */
            if (context.headData && context.headData.pushDepComponent) {
               context.headData.pushDepComponent(options.templateName, true);
            }
            self.optionsForComponent.resolvedTemplate = requireHelper.require(options.templateName);

         },

         _beforeUpdate: function(options) {
            var self = this;
            if (!requireHelper.defined(options.templateName)) {
               var def = new Deferred();
               require([options.templateName], function(tpl) {
                  self.optionsForComponent = options.templateOptions || {};
                  self.optionsForComponent.resolvedTemplate = tpl;
                  def.callback();
               }, function() {
                  def.errback('Error loading ' + options.templateName);
               });

               return;
            }
            self.optionsForComponent = options.templateOptions || {};
            self.optionsForComponent.resolvedTemplate = requireHelper.require(options.templateName);
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
