/**
 * Created by dv.zuev on 01.02.2018.
 */
define('Controls/Application/Core',
   [
      'Core/Control',
      'wml!Controls/Application/Core',
      'Application/Initializer',
      'SbisEnv/PresentationService',
      'Application/Env',
      'Controls/Application/StateReceiver',
      'Core/Themes/ThemesController',
      'Controls/Application/AppData',
      'Controls/Application/HeadData',
      'native-css',
      'Core/css-resolve'
   ],
   function(Control,
      template,
      AppInit,
      PresentationService,
      AppEnv,
      StateReceiver,
      ThemesController,
      AppData,
      HeadData) {
      'use strict';

      var AppCore = Control.extend({
         _template: template,
         ctxData: null,
         _beforeMount: function(cfg) {
            this._application = cfg.application;
         },
         _beforeUpdate: function(cfg) {
            if (this._applicationForChange) {
               this._application = this._applicationForChange;
               this._applicationForChange = null;
            } else {
               this._application = cfg.application;
            }
         },
         constructor: function(cfg) {
            try {
               /* TODO: set to presentation service */
               process.domain.req.compatible = false;
            } catch (e) {
            }

            //__hasRequest - для совместимости, пока не смержено WS. Нужно чтобы работало
            //и так и сяк
            if (!AppInit.isInit()) {
               var stateReceiverInst = new StateReceiver();
               var environmentFactory = undefined;
               if (typeof window === 'undefined') {
                  environmentFactory = PresentationService.default;
               }
               AppInit.default(cfg, environmentFactory, stateReceiverInst);

               if (typeof window === 'undefined' || window.__hasRequest === undefined) {
                  //need create request for SSR
                  //on client request will create in app-init.js
                  if (typeof window !== 'undefined' && window.receivedStates) {
                     stateReceiverInst.deserialize(window.receivedStates);
                  }
               }
            }

            var headData = new HeadData([], true);
            AppEnv.setStore('HeadData', headData);

            AppCore.superclass.constructor.apply(this, arguments);

            AppData.initAppData(cfg);
            this.ctxData = new AppData.getAppData();

            // Put Application/Core instance into the current request where
            // other modules can get it from
            AppEnv.setStore('CoreInstance', { instance: this });
         },
         coreTheme: '',
         setTheme: function(ev, theme) {
            this.coreTheme = theme;
            if (ThemesController.getInstance().setTheme) {
               ThemesController.getInstance().setTheme(theme);
            }
         },
         changeApplicationHandler: function(e, app) {
            var result;
            if (this._application !== app) {
               this._applicationForChange = app;
               var headData = AppEnv.getStore('HeadData');
               headData && headData.resetRenderDeferred();
               this._forceUpdate();
               result = true;
            } else {
               result = false;
            }
            return result;
         }

      });

      return AppCore;
   });
