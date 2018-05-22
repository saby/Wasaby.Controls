/**
 * Created by dv.zuev on 01.02.2018.
 */
define('Controls/Application/AppData', [
   'Core/DataContext'
], function(DataContext) {
   return DataContext.extend({
      jsLinks: [],
      constructor: function(cfg) {
         this.jsLinks = cfg.jsLinks;
         this.cssLinks = cfg.cssLinks;
         this.wsRoot = cfg.wsRoot;
         this.resourceRoot = cfg.resourceRoot;
         this.cssBundles = cfg.cssBundles;
      }
   });
});
