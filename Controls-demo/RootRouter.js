/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls-demo/RootRouter', [
   'Core/Control',
   'wml!Controls-demo/RootRouter'
], function (BaseControl,
             template
) {
   'use strict';

   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         backClickHdl: function(){
            window.history.back();
         },
         changeTheme: function(event, theme) {
            this._notify('themeChanged', [theme], { bubbling: true });
         }
      });

   return ModuleClass;
});