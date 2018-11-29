/**
 * Created by dv.zuev on 25.12.2017.
 */
define('Controls/Application',
   [
      'Core/Control',
      'Core/detection',
      'wml!Controls/Application/Page',
      'Core/Deferred',
      'Core/BodyClasses',
      'Core/constants',
      'Core/compatibility',
      'Controls/Application/AppData',
      'Controls/Container/Scroll/Context',
      'Controls/Application/HeadDataContext',
      'Core/LinkResolver/LinkResolver',
      'Core/Themes/ThemesController',
      'Core/ConsoleLogger',
      'css!theme?Controls/Application/Application'
   ],

   /**
    * Root component for WS applications. Creates basic html page.
    *
    * @class Controls/Application
    * @extends Core/Control
    * @control
    * @public
    * @author Зуев Д.В.
    */

   /**
    * @name Controls/Application#staticDomains
    * @cfg {Number} The list of domains for distributing static resources. These domains will be used to create paths
    * for static resources and distribute downloading for several static domains.
    * There will be another way to propagate this data after this problem:
    * https://online.sbis.ru/opendoc.html?guid=d4b76528-b3a0-4b9d-bbe8-72996d4272b2
    */

   function(Base,
      detection,
      template,
      Deferred,
      BodyClasses,
      constants,
      compatibility,
      AppData,
      ScrollContext,
      HeadDataContext,
      LinkResolver,
      ThemesController) {
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
            // Эти классы вешаются в двух местах. Разница в том, что BodyClasses всегда возвращает один и тот же класс,
            // а TouchDetector реагирует на изменение состояния.
            // Поэтому в Application оставим только класс от TouchDetector

            var bodyClasses = BodyClasses().replace('ws-is-touch', '').replace('ws-is-no-touch', '');

            if (detection.isMobileIOS) {
               bodyClasses += ' ' + this._scrollingClass;
            }

            return bodyClasses;
         },

         getPopupConfig: function(config) {
            var def = new Deferred();

            // Find opener for Infobox
            if (!config.opener) {
               requirejs(['Vdom/Utils/DefaultOpenerFinder'], function(DefaultOpenerFinder) {
                  config.opener = DefaultOpenerFinder.find(config.target);
                  def.callback(config);
               });
               return def;
            }

            return def.callback(config);
         }
      };
      var Page = Base.extend({
         _template: template,

         /**
          * @type {String} Property controls whether or not touch devices use momentum-based scrolling for inner scrollable areas.
          * @private
          */
         _scrollingClass: 'controls-Scroll_webkitOverflowScrollingTouch',

         _getChildContext: function() {
            return {
               ScrollData: this._scrollData
            };
         },

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
            // Данный метод вызывается из вёрстки, и при первой отрисовке еще нет _children (это нормально)
            // поэтому сами детектим touch с помощью compatibility
            return this._children.touchDetector
               ? this._children.touchDetector.getClass()
               : compatibility.touch
                  ? 'ws-is-touch'
                  : 'ws-is-no-touch';
         },

         /**
          * Код должен быть вынесен в отдельных контроллер в виде хока в 610.
          * https://online.sbis.ru/opendoc.html?guid=2dbbc7f1-2e81-4a76-89ef-4a30af713fec
          */
         _popupCreatedHandler: function() {
            this._isPopupShow = true;

            this._changeOverflowClass();
         },

         _popupDestroyedHandler: function(event, element, popupItems) {
            if (popupItems.getCount() === 0) {
               this._isPopupShow = false;
            }

            this._changeOverflowClass();
         },

         _suggestStateChangedHandler: function(event, state) {
            this._isSuggestShow = state;

            this._changeOverflowClass();
         },

         /** ************************************************** */

         _changeOverflowClass: function() {
            if (this._isPopupShow || this._isSuggestShow) {
               this._scrollingClass = 'controls-Scroll_webkitOverflowScrollingAuto';
            } else {
               this._scrollingClass = 'controls-Scroll_webkitOverflowScrollingTouch';
            }
         },

         _beforeMount: function(cfg, context, receivedState) {
            var self = this,
               def = new Deferred();

            self._scrollData = new ScrollContext({ pagingVisible: false });

            self.onServer = typeof window === 'undefined';
            self.isCompatible = cfg.compat || self.compat;
            _private.initState(self, receivedState || cfg);
            if (!receivedState) {
               receivedState = {};
            }

            self.buildnumber = cfg.buildnumber || constants.buildnumber;

            // TODO Ждем https://online.sbis.ru/opendoc.html?guid=c3d5e330-e4d6-44cd-9025-21c1594a9877
            self.appRoot = cfg.appRoot || context.AppData.appRoot || (cfg.builder ? '/' : constants.appRoot);
            self.staticDomains = cfg.staticDomains || constants.staticDomains || '[]';
            if (typeof self.staticDomains !== 'string') {
               self.staticDomains = '[]';
            }

            self.wsRoot = cfg.wsRoot || constants.wsRoot;
            self.resourceRoot = cfg.resourceRoot || constants.resourceRoot;

            // TODO сейчас нельзя удалить, ждем реквеста https://online.sbis.ru/opendoc.html?guid=c3d5e330-e4d6-44cd-9025-21c1594a9877
            // Т.к. это должно храниться в отдельном сторе
            self.RUMEnabled = cfg.RUMEnabled ? cfg.RUMEnabled : (context.AppData ? context.AppData.RUMEnabled : '');
            self.product = cfg.product || constants.product;
            self.lite = cfg.lite || false;
            self.servicesPath = cfg.servicesPath || constants.servicesPath || '/service/';
            self.BodyClasses = _private.calculateBodyClasses;
            self.application = context.AppData.application;

            self.linkResolver = new LinkResolver(context.headData.isDebug,
               self.buildnumber,
               self.wsRoot,
               self.appRoot,
               self.resourceRoot);

            // LinkResolver.getInstance().init(context.headData.isDebug, self.buildnumber, self.appRoot, self.resourceRoot);

            context.headData.pushDepComponent(self.application, false);

            if (receivedState.csses && !context.headData.isDebug) {
               ThemesController.getInstance().initCss({
                  themedCss: receivedState.csses.themedCss,
                  simpleCss: receivedState.csses.simpleCss
               });
            }

            /**
             * Этот перфоманс нужен, для сохранения состояния с сервера, то есть, cfg - это конфиг, который нам прийдет из файла
             * роутинга и с ним же надо восстанавливаться на клиенте.
             */
            def.callback({
               buildnumber: self.buildnumber,
               lite: self.lite,
               csses: ThemesController.getInstance().getCss(),
               title: self.title,
               appRoot: self.appRoot,
               staticDomains: self.staticDomains,
               wsRoot: self.wsRoot,
               resourceRoot: self.resourceRoot,
               templateConfig: self.templateConfig,
               servicesPath: self.servicesPath,
               compat: self.compat,
               product: self.product
            });
            return def;
         },

         _openInfoBoxHandler: function(event, config) {
            var self = this;
            this._activeInfobox = event.target;
            _private.getPopupConfig(config).addCallback(function(popupConfig) {
               self._children.infoBoxOpener.open(popupConfig);
            });
         },

         _closeInfoBoxHandler: function(event) {
            if (this._activeInfobox === event.target) {
               this._activeInfobox = null;
               this._children.infoBoxOpener.close();
            }
         },

         // Needed to immediately hide the infobox after its target or one
         // of their parent components are hidden
         // Will be removed:
         // https://online.sbis.ru/opendoc.html?guid=1b793c4f-848a-4735-b96a-f0c1cf479fab
         _forceCloseInfoBoxHandler: function() {
            if (this._activeInfobox) {
               this._activeInfobox = null;
               this._children.infoBoxOpener.close(0);
            }
         },

         _openPreviewerHandler: function(event, config, type) {
            this._children.previewerOpener.open(config, type);
         },

         _closePreviewerHandler: function(event, type) {
            this._children.previewerOpener.close(type);
         },

         _keyPressHandler: function(event) {
            if (this._isPopupShow) {
               if (constants.browser.safari) {
                  // Need to prevent default behaviour if popup is opened
                  // because safari escapes fullscreen mode on 'ESC' pressed
                  // TODO https://online.sbis.ru/opendoc.html?guid=5d3fdab0-6a25-41a1-8018-a68a034e14d9
                  if (event.nativeEvent && event.nativeEvent.keyCode === 27) {
                     event.preventDefault();
                  }
               }
            }
         },

         _cancelPreviewerHandler: function(event, action) {
            this._children.previewerOpener.cancel(action);
         }
      });


      Page.contextTypes = function contextTypes() {
         return {
            AppData: AppData,
            headData: HeadDataContext
         };
      };

      return Page;
   });
