/**
 * Created by dv.zuev on 25.12.2017.
 */
define('Controls/Application',
   [
      'Core/Control',
      'tmpl!Controls/Application/Page',
      'Core/helpers/URLHelpers',
      'Core/moduleStubs'
   ],

   function (Base,
             template,
             URLHelpers,
             moduleStubs) {
      'use strict';

      var DEFAULT_DEBUG_CATALOG = 'debug/';

      var Page = Base.extend({
         _template: template,
         wsRoot: '',
         resourceRoot: '',
         fixBaseCompatible: true,

         getDataId: function(){
            return 'cfg-pagedata';
         },

         _beforeMount: function(cfg, context, receivedState) {
            var self = this;
            if (receivedState) {
               return moduleStubs.require([receivedState.routesConfig, receivedState.content]).addCallback(function(result) {
                  self._initState(receivedState, result[0]);
               });
            } else {
               return moduleStubs.require([cfg.routesConfig, typeof cfg.content==="string"?cfg.content:undefined]).addCallback(function(result) {
                  self._initState(cfg, result[0]);
                  return cfg;
               });
            }
         },

         _initState: function(cfg, routesConfig) {
            this._routes = routesConfig || {};
            var url = URLHelpers.getPath();
            this._tplConfig = this._routes[url.replace(DEFAULT_DEBUG_CATALOG, '')] || cfg.templateConfig;
         },

         _afterMount: function() {
            /*var
               navigation = EventBus.channel('navigation'),
               self = this;
            navigation.subscribe('onNavigate', function(e, location) {
               self._setLocation.apply(self, arguments);
            });*/
         },

         _setLocation: function(e, path) {
            this._tplConfig = this._routes[path];
            history.pushState(history.state, '', path + '?' + URLHelpers.getQuery());
         }
      });

      return Page;
   }
);