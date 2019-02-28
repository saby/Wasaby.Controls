/**
 * Created by dv.zuev on 01.02.2018.
 */
define('Controls/Application/AppData', [
   'Core/core-extend',
   'View/Request'
], function(extend, Request) {

   var AppData = extend.extend({
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
      },
      registerConsumer: function() {

         // Need this to pass AppData as context field
      },
      updateConsumers: function() {

         // Need this to pass AppData as context field
      }
   });
   AppData.initAppData = function(cfg) {
      Request.getCurrent().setStorage('AppData', new AppData(cfg));
   };
   AppData.getAppData = function() {
      return Request.getCurrent().getStorage('AppData');
   };
   return AppData;
});
