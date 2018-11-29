/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls-demo/Index', [
   'Core/Control',
   'Core/LinkResolver/LinkResolver',
   'Core/cookie',
   'Core/constants',
   'wml!Controls-demo/Index',
   'css!Controls-demo/Demo/Page'
], function (BaseControl,
             LinkResolver,
             cookie,
             constants,
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
            this._notify('themeChanged', [theme], {bubbling:true});
         },
         _beforeMount: function() {
            this.linkResolver = new LinkResolver(cookie.get('s3debug') === 'true',
               constants.buildnumber,
               constants.wsRoot,
               constants.appRoot,
               constants.resourceRoot
               );
         }
      });

   return ModuleClass;
});