/**
 * Created by dv.zuev on 01.02.2018.
 */
define('Controls/Application/AppData', [
   'Core/DataContext'
], function(DataContext) {

   return DataContext.extend({
      jsLinks: [],
      constructor: function(cfg) {
         this.appRoot = cfg.appRoot;
         this.lite = cfg.lite;
         this.application = cfg.application;
         this.wsRoot = cfg.wsRoot;
         this.resourceRoot = cfg.resourceRoot;
         this.RUMEnabled = cfg.RUMEnabled;
         this.pageName = cfg.pageName;
         this.product = cfg.product;
         this.cssBundles = cfg.cssBundles;
         this.buildnumber = cfg.buildnumber;
         this.servicesPath = cfg.servicesPath;
         this.staticDomains = cfg.staticDomains;
      }
   });
});
