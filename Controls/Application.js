/**
 * Created by dv.zuev on 25.12.2017.
 */
define('Controls/Application',
   [
      'Core/Control',
      'tmpl!Controls/Application/Page',
      'Core/helpers/URLHelpers',
      'Core/Deferred',
      'Core/BodyClasses',
      'Core/compatibility',
      'Controls/Application/AppData',
      'Controls/Application/HeadDataContext',
      'Core/ConsoleLogger'
   ],

   /**
    * Root component for WS applications. Creates basic html page.
    *
    * @class Controls/Application
    * @extends Core/Control
    * @control
    * @public
    */

   function(Base,
      template,
      URLHelpers,
      Deferred,
      BodyClasses,
      compatibility,
      AppData,
      HeadDataContext) {
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

         boomCfg: '',

         _scrollPage: function(ev) {
            this._children.scrollDetect.start(ev);
         },

         _resizePage: function(ev) {
            this._children.resizeDetect.start(ev);
         },
         _mousedownPage: function(ev) {
            this._children.mousedownDetect.start(ev);
         },
         _mousemovePage: function(ev) {
            this._children.mousemoveDetect.start(ev);
         },
         _mouseupPage: function(ev) {
            this._children.mouseupDetect.start(ev);
         },
         _getChildContext: function() {
            return {headData: this._headData};
         },
         _touchmovePage: function(ev) {
            this._children.touchmoveDetect.start(ev);
         },
         _touchendPage: function(ev) {
            this._children.touchendDetect.start(ev);
         },
         _touchclass: function() {
            //Данный метод вызывается из вёрстки, и при первой отрисовке еще нет _children (это нормально)
            //поэтому сами детектим touch с помощью compatibility
            return  this._children.touchDetector
               ? this._children.touchDetector.getClass()
               : compatibility.touch
                  ? 'ws-is-touch'
                  : 'ws-is-no-touch';
         },

         _beforeMount: function(cfg, context, receivedState) {
            var self = this,
               def = new Deferred();

            self._headData = new HeadDataContext(cfg.theme);
            _private.initState(self, receivedState || cfg);
            self.needArea = cfg.compat || self.compat;
            if (!receivedState) {
               receivedState = {};
            }
            self.application = (context.AppData ? context.AppData.application : cfg.application);
            self.appRoot = cfg.appRoot ? cfg.appRoot : (context.AppData ? context.AppData.appRoot : '/');
            self.wsRoot = receivedState.wsRoot || (context.AppData ? context.AppData.wsRoot : cfg.wsRoot);
            self.resourceRoot = receivedState.resourceRoot || (context.AppData ? context.AppData.resourceRoot : cfg.resourceRoot);
            self.BodyClasses = BodyClasses;

            self._headData.pushDepComponent(self.application);

            if (receivedState && context.AppData) {
               context.AppData.wsRoot = self.wsRoot;
               context.AppData.appRoot = self.appRoot;
               context.AppData.resourceRoot = self.resourceRoot;
               context.AppData.application = self.application;
            }

            self.boomCfg = URLHelpers.getQueryParam('boomCfg');
            
            /**
             * Этот перфоманс нужен, для сохранения состояния с сервера, то есть, cfg - это конфиг, который нам прийдет из файла
             * роутинга и с ним же надо восстанавливаться на клиенте.
             */
            def.callback({
               application: self.application,
               title: self.title,
               appRoot: self.appRoot,
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
