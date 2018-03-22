/**
 * Created by as.krasilnikov on 26.02.2018.
 */
define('Controls-demo/Demo/Page',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls-demo/Demo/Page',
      'css!Controls-demo/Demo/Page',
      'Controls/Application'
   ],
   function (Control, Deferred, template) {

      'use strict';
      var UrlParams = (function () {
         var data = {};
         if (document.location.search) {
            var pair = (document.location.search.substr(1)).split('&');
            for (var i = 0; i < pair.length; i++) {
               var param = pair[i].split('=');
               data[param[0]] = param[1];
            }
         }
         return data;
      })();

      var DemoPage = Control.extend({
         _template: template,
         componentName: 'Controls-demo/Index',
         _beforeMount: function () {
            var deferred = new Deferred();
            this._themeSwitcher = !!UrlParams['theme'];

            if (UrlParams.cname) {
               this.componentName = 'Controls-demo/' + UrlParams.cname;
            }
            requirejs([this.componentName], deferred.callback.bind(deferred));
            return deferred;
         },
         loadThemeSwitcher: function () {
            window.setBodyModifiers(UrlParams['theme'], '');
         },
         backClickHdl: function () {
            window.location.href = window.location.origin + '/Controls-demo/demo.html'
         }
      });

      return DemoPage;
   }
);