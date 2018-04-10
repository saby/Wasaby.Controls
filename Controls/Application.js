/**
 * Created by dv.zuev on 25.12.2017.
 */
define('Controls/Application',
   [
      'Core/Control',
      'tmpl!Controls/Application/Page',
      'Core/Deferred',
      'Core/BodyClasses',
      'Controls/Application/TouchDetector',
      'Controls/Application/AppData'
   ],

   /**
    * Компонент приложение. не делает НИЧЕГО. На вход принимает конфиг - на выходе шаблон.
    * Никакой логики внутри нет.
    */
   function(Base,
      template,
      Deferred,
      BodyClasses,
      TouchDetector,
      AppData) {
      'use strict';

      var _private,
         DEFAULT_DEBUG_CATALOG = 'debug/';

      _private = {

         /**
          * Перекладываем опции или recivedState на инстанс
          * @param self
          * @param cfg
          * @param routesConfig
          */
         initState: function(self, cfg) {
            self.title = cfg.title;
            self.templateConfig = cfg.templateConfig;
            self.compat = cfg.compat || false;
         }
      };
      var Page = Base.extend({
         _template: template,

         getDataId: function() {
            return 'cfg-pagedata';
         },

         _scrollPage: function(ev) {
            this._children.scrollDetect.start(ev);
         },

         _resizePage: function(ev) {
            this._children.resizeDetect.start(ev);
         },

         _touchstartPage: function() {
            TouchDetector.touchHandler();
         },
         _mousemovePage: function(ev) {
            TouchDetector.moveHandler();

            this._children.mousemoveDetect.start(ev);
         },
         _mouseupPage: function(ev) {
            this._children.mouseupDetect.start(ev);
         },
         _touchclass: function() {
            return TouchDetector.getClass();
         },

         _beforeMount: function(cfg, context, receivedState) {
            var self = this,
               def = new Deferred();

            _private.initState(self, receivedState || cfg);
            self.content = cfg.content;
            self.needArea = cfg.compat || self.compat;
            if (!receivedState) {
               receivedState = {};
            }
            self.cssLinks = receivedState.cssLinks || (context.AppData ? context.AppData.cssLinks : cfg.cssLinks);
            self.wsRoot = receivedState.wsRoot || (context.AppData ? context.AppData.wsRoot : cfg.wsRoot);
            self.resourceRoot = receivedState.resourceRoot || (context.AppData ? context.AppData.resourceRoot : cfg.resourceRoot);
            self.jsLinks = receivedState.jsLinks || (context.AppData ? context.AppData.jsLinks : cfg.jsLinks);
            self.BodyClasses = BodyClasses;

            /**
             * Этот перфоманс нужен, для сохранения состояния с сервера, то есть, cfg - это конфиг, который нам прийдет из файла
             * роутинга и с ним же надо восстанавливаться на клиенте.
             */
            def.callback({
               jsLinks: self.jsLinks,
               cssLinks: self.cssLinks,
               title: self.title,
               wsRoot: self.wsRoot,
               resourceRoot: self.resourceRoot,
               templateConfig: self.templateConfig,
               compat: self.compat
            });
            return def;
         }
      });

      Page.contextTypes = function contextTypes() {
         return {
            AppData: AppData
         };
      };

      return Page;
   }
);
