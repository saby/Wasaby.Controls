/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls-demo/RootRouter', [
   'Core/Control',
   'wml!Controls-demo/RootRouter',
   'css!Controls-demo/RootRouter'
], function(BaseControl,
   template) {
   'use strict';

   var ModuleClass = BaseControl.extend(
      {
          isReloading: false,
          reload: function() {
              this.isReloading = true;
          },

          _afterMount: function() {
              window.reloadDemo = this.reload.bind(this);
          },

          _afterUpdate: function() {
              this.isReloading = false;
          },

          _template: template,
         backClickHdl: function() {
            window.history.back();
         },

         goHomeHandler: function() {
             window.location = "/Controls-demo/app/Controls-demo%2FIndexOld";
         }
      }
   );

   return ModuleClass;
});
