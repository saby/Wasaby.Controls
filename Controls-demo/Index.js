/**
 * Created by kraynovdo on 25.01.2018.
 */
define('Controls-demo/Index', [
   'Core/Control',
   'Core/LinkResolver/LinkResolver',
   'Env/Env',
   'wml!Controls-demo/Index',
   'css!Controls-demo/Demo/Page',
   'css!Controls-theme/themes/default/helpers/AreaBlocks'
], function (BaseControl,
             LinkResolver,
             Env,
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
            this._title = 'Wasaby';
            this.linkResolver = new LinkResolver(Env.cookie.get('s3debug') === 'true',
               Env.constants.buildnumber,
               Env.constants.wsRoot,
               Env.constants.appRoot,
               Env.constants.resourceRoot
               );
         },
         _afterMount: function() {
            var reg = /\%2F([^%2F]+)$/;
            var matchResult = window.location.pathname.match(reg);
            if (matchResult && matchResult[1] !== 'IndexOld') {
               this._title = matchResult[1];
               this._forceUpdate();
            }
         }
      });

   return ModuleClass;
});