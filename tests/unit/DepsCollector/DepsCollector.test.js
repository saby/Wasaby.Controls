define([
   'Controls/Application/DepsCollector/DepsCollector'
], function(DepsCollector) {
   var modDeps = {
      "ACS/AddressForm/AddressForm": ["tmpl", "tmpl!ACS/AddressForm/AddressForm"],
      "AccountCertificates/Obrabotchiki/ReestrHandlers": [],
      "css!AccountCertificates/components/CarrierSigns/CarrierSigns": [],
      "tmpl!ActiveSales/Controls/ClientsBlock": [],
      "css!AuthFramework/OAuth/Abstract": [],
      "Controls/Button": ["Core/Control", "css"],
      "Core/Control": ["View/Runner/markupGenerator"],
      "css": [],
      "Controls/Input": [],
      "NotificationsCenter/VDOM/Util/Refresher": [],
      "tmpl!NotificationsCenter/VDOM/Util/Refresher": []
   };
   var modInfo = {
      "css!AuthFramework/OAuth/Abstract": {path: "resources/AuthFramework/OAuth/Abstract.min.css"},
      "NotificationsCenter/VDOM/Util/Refresher": {path: "resources/NotificationsCenter/VDOM/Util/Refresher.min.js"},
      "tmpl!NotificationsCenter/VDOM/Util/Refresher": {path: "resources/NotificationsCenter/VDOM/Util/Refresher.min.tmpl"}
   };
   var bundlesRoute = {
      "AccountCertificates/Obrabotchiki/ReestrHandlers": "resources/AccountCertificates/packages/signs_registry.package.min.js",
      "css!AccountCertificates/components/CarrierSigns/CarrierSigns": "resources/AccountCertificates/packages/signs_registry.package.min.css",
      "tmpl!ActiveSales/Controls/ClientsBlock": "resources/ActiveSales/crm_sales.package.min.js",
      "Global_Catalog/Prices/Dialog/NomenclatureSelector": "resources/Global_Catalog/package/Prices.package.min.js",
      "Global_Catalog/Prices/Dialog/PriceMiniCard": "resources/Global_Catalog/package/Prices.package.min.js",
      "Controls/Button": "resources/Controls/controls-button.package.min.js",
      "Core/Control": "resources/WS.Core/core-min.package.min.js",
      "css": "resources/WS.Core/requirejs-plugins.package.min.js",
      "View/Runner/markupGenerator": "resources/View/runner.package.min.js",
      "NotificationsCenter/VDOM/Util/Refresher": "resources/NotificationsCenter/VDOM/VDOMNotificationCenter.package.min.js"
   }
   var depsCollector = new DepsCollector(modDeps, modInfo, bundlesRoute);
   describe('DepsCollector', function() {
      it('single in bundle', function() {
         var deps = depsCollector.collectDependencies(["AccountCertificates/Obrabotchiki/ReestrHandlers"]);
         assert.deepEqual(deps, {
            "js": ["/resources/AccountCertificates/packages/signs_registry.package.min.js"],
            "css": []
         });
      });
      it('several in bundle', function() {
         var deps = depsCollector.collectDependencies(["Global_Catalog/Prices/Dialog/NomenclatureSelector", "Global_Catalog/Prices/Dialog/PriceMiniCard"]);
         assert.deepEqual(deps, {"js": ["/resources/Global_Catalog/package/Prices.package.min.js"], "css": []});
      });
      it('css-bundle hook js', function() {
         var deps = depsCollector.collectDependencies(["css!AccountCertificates/components/CarrierSigns/CarrierSigns"]);
         assert.deepEqual(deps, {
            "js": ["/resources/AccountCertificates/packages/signs_registry.package.min.js"],
            "css": ["/resources/AccountCertificates/packages/signs_registry.package.min.css"]
         });
      });
      it('single css not hook js', function() {
         var deps = depsCollector.collectDependencies(["css!AuthFramework/OAuth/Abstract"]);
         assert.deepEqual(deps, {"js": [], "css": ["/resources/AuthFramework/OAuth/Abstract.min.css"]});
      });
      it('recursive', function() {
         var deps = depsCollector.collectDependencies(["Controls/Button"]);
         assert.deepEqual(deps, {
            "js": ["/resources/Controls/controls-button.package.min.js",
               "/resources/WS.Core/core-min.package.min.js",
               "/resources/View/runner.package.min.js",
               "/resources/WS.Core/requirejs-plugins.package.min.js"],
            "css": []
         });
      });
      it('optional pre-load', function() {
         var deps = depsCollector.collectDependencies(["optional!NotificationsCenter/VDOM/Util/Refresher"]);
         assert.deepEqual(deps, {
            "js": ["/resources/NotificationsCenter/VDOM/VDOMNotificationCenter.package.min.js"],
            "css": []
         });
      });
      it('optional no pre-load', function() {
         var deps = depsCollector.collectDependencies(["optional!Controls/Input"]);
         assert.deepEqual(deps, {
            "js": [],
            "css": []
         });
      });
      it('tmpl', function() {
         var deps = depsCollector.collectDependencies(["tmpl!NotificationsCenter/VDOM/Util/Refresher"]);
         assert.deepEqual(deps, {
            "js": ["/resources/NotificationsCenter/VDOM/Util/Refresher.min.tmpl"],
            "css": []
         });
      })
   });
});
