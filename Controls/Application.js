/**
 * Created by dv.zuev on 25.12.2017.
 */
define('Controls/Application',
   [
      'Core/Control',
      'tmpl!Controls/Application/Page',
      'Core/Deferred',
      'Core/BodyClasses',
      'Core/compatibility',
      'Controls/Application/AppData',
      'Controls/Application/HeadDataContext',
      'Core/ConsoleLogger',
      'css!Controls/Application/Application'
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
         },
         calculateBodyClasses: function() {
            //Эти классы вешаются в двух местах. Разница в том, что BodyClasses всегда возвращает один и тот же класс,
            //а TouchDetector реагирует на изменение состояния. Поэтому в Application оставим только класс от TouchDetector
            return BodyClasses().replace('ws-is-touch', '').replace('ws-is-no-touch', '');
         }
      };
      var Page = Base.extend({
         _template: template,

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

            self.onServer = typeof window === 'undefined';
            _private.initState(self, receivedState || cfg);
            self.isCompatible = cfg.compat || self.compat;
            if (!receivedState) {
               receivedState = {};
            }
            self.application = (context.AppData ? context.AppData.application : cfg.application);
            self.buildnumber = (context.AppData ? context.AppData.buildnumber : '');
            self.appRoot = cfg.appRoot ? cfg.appRoot : (context.AppData ? context.AppData.appRoot : '/');
            self.wsRoot = receivedState.wsRoot || (context.AppData ? context.AppData.wsRoot : cfg.wsRoot);
            self.resourceRoot = receivedState.resourceRoot || (context.AppData ? context.AppData.resourceRoot : cfg.resourceRoot);
            self.product = receivedState.product || (context.AppData ? context.AppData.product : cfg.product);
            self.servicesPath = receivedState.servicesPath || (context.AppData ? context.AppData.servicesPath : cfg.servicesPath) || '/service/';
            self.BodyClasses = _private.calculateBodyClasses;

            context.headData.pushDepComponent(self.application);


            if (receivedState && context.AppData) {
               context.AppData.buildnumber = self.buildnumber;
               context.AppData.wsRoot = self.wsRoot;
               context.AppData.appRoot = self.appRoot;
               context.AppData.resourceRoot = self.resourceRoot;
               context.AppData.application = self.application;
               context.AppData.servicesPath = self.servicesPath;
            }
            
            /**
             * Этот перфоманс нужен, для сохранения состояния с сервера, то есть, cfg - это конфиг, который нам прийдет из файла
             * роутинга и с ним же надо восстанавливаться на клиенте.
             */
            def.callback({
               application: self.application,
               buildnumber: self.buildnumber,
               title: self.title,
               appRoot: self.appRoot,
               wsRoot: self.wsRoot,
               resourceRoot: self.resourceRoot,
               templateConfig: self.templateConfig,
               servicesPath: self.servicesPath,
               compat: self.compat
            });
            return def;
         },

         _openInfoBoxHandler: function(event, config) {
            this._children.infoBoxOpener.open(config);
         },

         _closeInfoBoxHandler: function() {
            this._children.infoBoxOpener.close();
         }
      });

      Page.contextTypes = function contextTypes() {
         return {
            AppData: AppData,
            headData: HeadDataContext
         };
      };

      return Page;
   }
);
