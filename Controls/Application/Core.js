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
      'native-css',
      'Core/css-resolve'
   ],
   function(Control,
      template,
      Request,
      createDefault,
      StateReceiver,
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

            if (typeof window === 'undefined' || window.__hasRequest === undefined) {

               //need create request for SSR
               //on client request will create in app-init.js
               var req = new Request(createDefault.default(Request));
               req.setStateReceiver(new StateReceiver());
               if (typeof window !== 'undefined' && window.receivedStates) {
                  req.stateReceiver.deserialize(window.receivedStates);
               }
               Request.setCurrent(req);
            }

            var headData = new HeadData([], true);
            Request.getCurrent().setStorage('HeadData', headData);

            AppCore.superclass.constructor.apply(this, arguments);
            this.ctxData = new AppData(cfg);
         },
         _getChildContext: function() {
            return {
               AppData: this.ctxData
            };
         },
         coreTheme: '',
         setTheme: function(ev, theme) {
            this.coreTheme = theme;
         },
         changeApplicationHandler: function(e, app) {
            var result;
            if (this._application !== app) {
               this._applicationForChange = app;
               var headData = Request.getCurrent().getStorage('HeadData');
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
