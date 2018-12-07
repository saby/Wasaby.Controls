/**
 * Created by dv.zuev on 01.02.2018.
 */
define('Controls/Application/Core',
   [
      'Core/Control',
      'wml!Controls/Application/Core',
      'View/Request',
      'View/_Request/createDefault',
      'Controls/Application/StateReceiver',
      'Controls/Application/AppData',
      'Controls/Application/HeadData',
      'Core/Themes/ThemesController',
      'native-css',
      'Core/css-resolve'
   ],
   function(Control,
      template,
      Request,
      createDefault,
      StateReceiver,
      AppData,
      HeadData,
      ThemesController) {
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

            var req = new Request(createDefault.default(Request));
            req.setStateReceiver(new StateReceiver());
            if (typeof window !== 'undefined' && window.receivedStates) {
               req.stateReceiver.deserialize(window.receivedStates);
            }
            Request.setCurrent(req);

            AppCore.superclass.constructor.apply(this, arguments);
            this.ctxData = new AppData(cfg);
            var headData = new HeadData(cfg.theme || '', cfg.cssLinks, true);
            Request.getCurrent().setStorage('HeadData', headData);
         },
         _getChildContext: function() {
            return {
               AppData: this.ctxData
            };
         },
         coreTheme: '',
         setTheme: function(ev, theme) {
            this.coreTheme = theme;
            if(ThemesController.getInstance().setTheme) {
               ThemesController.getInstance().setTheme(theme);
            }
         },
         changeApplicationHandler: function(e, app) {
            var result;
            if (this._application !== app) {
               this._applicationForChange = app;
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
