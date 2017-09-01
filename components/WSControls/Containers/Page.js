define('js!WSControls/Containers/Page',
   [
      'Core/Control',
      'tmpl!WSControls/Containers/Page',
      'Core/helpers/URLHelpers',
      //TODO: убрать EventBus
      'Core/EventBus',
      'Core/moduleStubs',
      //TODO: убрать
      'js!WSDemo/Configs/OnlineConfig',
      //TODO: убрать, хак для препроцессора, без этого на сервере не строится
      'js!WSControls/Templates/OnlineTemplate',
      'css!WSControls/Containers/Page'
   ],

   function (Base, template, URLHelpers, EventBus, moduleStubs, routes) {
      'use strict';

      var Page = Base.extend({
         _controlName: 'WSControls/Containers/Page',
         _template: template,
         wsRoot: '/ws/',
         resourceRoot: '/resources/',

         constructor: function(cfg) {
            var
               self = this,
               navigation = EventBus.channel('navigation');
            Page.superclass.constructor.apply(this, arguments);
            navigation.subscribe('onNavigate', function(e, location) {
               self._setLocation.apply(self, arguments);
            });
         },

         _beforeMount: function(cfg, receivedState) {
            var self = this;
            /*return moduleStubs.require([cfg.routes]).addCallback(function(result) {
               self._routes = result[0];
               self._tplConfig = self._routes[location.pathname];
            });*/
            this._routes = routes;
            this._tplConfig = this._routes[location.pathname];
         },

         _setLocation: function(e, path) {
            this._tplConfig = this._routes[path];
            history.pushState(history.state, '', path + '?' + URLHelpers.getQuery());
         }
      });

      return Page;
   }
);