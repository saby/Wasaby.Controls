define('Controls-demo/RootTemplateWrapper', [
   'Core/Control',
   'Controls/Container/Async/ModuleLoader',
   'Core/PromiseLib/PromiseLib',
   'wml!Controls-demo/RootTemplateWrapper'
], function(BaseControl,
            ModuleLoader,
            PromiseLib,
            template
) {
   'use strict';

   var moduleLoader = new ModuleLoader();
   /**
    * This control if the templated passed to props actually exists
    */
   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         _beforeMount: function(opts, _, receivedState) {
            if (receivedState !== undefined) {
               this.templateLoaded = receivedState;
            } else {
               if(moduleLoader.isLoaded(opts.app)) {
                  this.templateLoaded = true;
               } else {
                  return PromiseLib.reflect(moduleLoader.loadAsync(opts.app)).then(function(res) {
                     if (res.result) {
                        this.templateLoaded = true;
                        return true;
                     }
                     this.templateLoaded = false;
                     return false;
                  }.bind(this));
               }
            }
         }
      });

   return ModuleClass;
});