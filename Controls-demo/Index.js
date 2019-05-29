/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls-demo/Index', [
   'Core/Control',
   'Core/LinkResolver/LinkResolver',
   'Env/Env',
   'wml!Controls-demo/Index',
   'Application/Initializer',
   'Application/Env',
   'css!Controls-demo/Demo/Page',
   'css!Controls-theme/themes/default/helpers/AreaBlocks'
], function (BaseControl,
             LinkResolver,
             Env,
             template,
             AppInit,
             AppEnv
) {
   'use strict';

   var ModuleClass = BaseControl.extend(
      {
         _template: template,
         backClickHdl: function() {
            window.history.back();
         },
         changeTheme: function(event, theme) {
            this._notify('themeChanged', [theme], { bubbling: true });
         },
         _beforeMount: function() {
            this._title = this._getTitle();
            this.linkResolver = new LinkResolver(Env.cookie.get('s3debug') === 'true',
               Env.constants.buildnumber,
               Env.constants.wsRoot,
               Env.constants.appRoot,
               Env.constants.resourceRoot);
         },
         _getTitle: function() {
            var location = this._getLocation();
            if (location) {
               var splitter = '%2F';
               var index = location.pathname.lastIndexOf(splitter);
               if (index > -1) {
                  return location.pathname.slice(index + splitter.length);
               }
            }
            return 'Wasaby';
         },
         _getLocation: function() {
            if (AppInit.isInit()) {
               return AppEnv.location;
            } if (typeof window !== 'undefined') {
               return window.location;
            }
            return null;
         }
      }
   );

   return ModuleClass;
});