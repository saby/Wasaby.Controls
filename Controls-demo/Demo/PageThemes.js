/**
 * Created by as.krasilnikov on 26.02.2018.
 */
define('Controls-demo/Demo/PageThemes',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls-demo/Demo/PageThemes',
      'Controls/Application/AppData',
      'Controls/Container/Scroll/Context',
      'css!Controls-demo/Demo/Page',
      'Controls/Application',
      'Vdom/Vdom'
   ],
   function(Control, Deferred, template, AppData, ScrollData) {
      'use strict';

      var UrlParams = function (){
            var data = {};
            if (typeof document !== 'undefined') {
               if (document.location.search) {
                  var pair = (document.location.search.substr(1)).split('&');
                  for (var i = 0; i < pair.length; i++) {
                     var param = pair[i].split('=');
                     data[param[0]] = param[1];
                  }
               }
            } else {
               var req = typeof process !== 'undefined' && process.domain && process.domain.req;
               data = req && req.query || {};
            }
            return data;
         };

      var DemoPage = Control.extend({
         _template: template,
         _theme: null,
         componentName: 'Controls-demo/Index',
         _beforeMount: function(opts) {
            var deferred = new Deferred();
            if (UrlParams().cname) {
               this.componentName = 'Controls-demo/' + UrlParams().cname;
            }
            this._theme = UrlParams()['theme'] || opts.theme;
         },

         _beforeUpdate: function(opts){
            this._theme = opts.theme || UrlParams()['theme'];
         },

         changeTheme: function(event, theme) {
            this._notify('themeChanged', [theme], {bubbling:true});
         },

         backClickHdl: function() {
            window.history.back();
         },

         constructor: function(cfg) {
            DemoPage.superclass.constructor.apply(this, arguments);
            this.ctxData = new AppData(cfg);
            this.scrollData = new ScrollData({
               pagingVisible: false
            });
         },

         _getChildContext: function() {
            return {
               AppData: this.ctxData,
               ScrollData: this.scrollData
            };
         }
      });

      return DemoPage;
   }
);
