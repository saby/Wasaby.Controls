define('js!WSControls/Containers/Page',
   [
      'Core/Control',
      'tmpl!WSControls/Containers/Page',
      'Core/helpers/URLHelpers',
      //TODO: убрать EventBus
      'Core/EventBus',
      'Core/moduleStubs',
      'css!WSControls/Containers/Page'
   ],

   function (Base,
             template,
             URLHelpers,
             EventBus,
             moduleStubs) {
      'use strict';

      var Page = Base.extend({
         _controlName: 'WSControls/Containers/Page',
         _template: template,
         wsRoot: '/ws/',
         resourceRoot: '/resources/',

         getDataId: function(){
            return 'cfg-pagedata';
         },

         _beforeMount: function(cfg, receivedState) {
            var self = this;
            if (receivedState) {
               return moduleStubs.require([receivedState.routesConfig, receivedState.template]).addCallback(function(result) {
                  self._initState(receivedState, result[0]);
               });
            } else {
               return moduleStubs.require([cfg.routesConfig, cfg.template]).addCallback(function(result) {
                  self._initState(cfg, result[0]);
                  return cfg;
               });
            }
         },

         _initState: function(cfg, routesConfig) {
            this._routes = routesConfig;
            this._tplConfig = this._routes[URLHelpers.getPath()];
            this.title = cfg.title;
            this.cssLinks = cfg.cssLinks;
            this.jsLinks = cfg.jsLinks;
            this.template = cfg.template;
         },

         _afterMount: function() {
            var
               navigation = EventBus.channel('navigation'),
               self = this;
            navigation.subscribe('onNavigate', function(e, location) {
               self._setLocation.apply(self, arguments);
            });
         },

         _setLocation: function(e, path) {
            this._tplConfig = this._routes[path];
            history.pushState(history.state, '', path + '?' + URLHelpers.getQuery());
         }
      });

      return Page;
   }
);