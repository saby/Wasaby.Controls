/**
 * Created by dv.zuev on 25.12.2017.
 */
define('Controls/Application',
   [
      'Core/Control',
      'tmpl!Controls/Application/Page',
      'Core/helpers/URLHelpers',
      'Core/Deferred'
   ],

   function (Base,
             template,
             URLHelpers,
             Deferred) {
      'use strict';

      var _private,
         DEFAULT_DEBUG_CATALOG = 'debug/';

      _private = {
         /**
          * _tplConfig - внутренний объект, который передается в функцию построения контента
          * @param self
          * @param cfg
          * @param routesConfig
          */
         initState: function(self, cfg, routesConfig) {
            self._routes = routesConfig || {};
            var url = URLHelpers.getPath();
            self._tplConfig = self._routes[url.replace(DEFAULT_DEBUG_CATALOG, '')] || cfg.templateConfig;
         },

         /**
          * На вход могут передать как строку, так и готовый зарекваереный модуль, или
          * инлайново сверстаный шаблон
          * Функция подготавливает массив того, что надо рекваирить
          * @param config
          * @param content
          */
         prepareModulesList: function(config, content){
            var modules = [];
            if (typeof config === "string") {
               modules.push(config);
            }
            if (typeof content === "string") {
               modules.push(content);
            }
            return modules;
         }
      };
      var Page = Base.extend({
         _template: template,

         /*Небольшой фикс, для блокировки слоя совместимости*/
         fixBaseCompatible: true,

         getDataId: function(){
            return 'cfg-pagedata';
         },

         _beforeMount: function(cfg, context, receivedState) {
            var self = this,
               def = new Deferred(),
               deps,
               configIsString = false;

            if (!receivedState) {
               receivedState = cfg;
            }
            
            deps = _private.prepareModulesList(receivedState.templateConfig, receivedState.content);
            configIsString = typeof receivedState.templateConfig === "string";

            require(deps, function(templateConfig) {
               _private.initState(self, receivedState, configIsString?templateConfig:undefined);
               def.callback();
            });

            return def;
         }


         /*TODO:: это будет нужно для роутинга, но пока роутинг не нужен, просто оставим
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
         }*/
      });

      return Page;
   }
);