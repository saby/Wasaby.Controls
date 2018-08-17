/**
 * Created by dv.zuev on 01.02.2018.
 */
define('Controls/Application/Core',
   [
      'Core/Control',
      'tmpl!Controls/Application/Core',
      'Controls/Application/AppData',
      'Controls/Application/HeadDataContext',
      'native-css',
      'Core/css-resolve'
   ],
   function(Control,
      template,
      AppData,
      HeadDataContext,
      nativeCss,
      cssResolve) {

      'use strict';

      var AppCore = Control.extend({
         _template: template,
         ctxData: null,
         constructor: function(cfg) {

            if (cfg.lite) {
               var self = this,
                  myLoadCssFn = function(path, require, load, conf) {
                     load(null);
                     self.headDataCtx.pushCssLink(cssResolve(path));
                     self.headDataCtx.updateConsumers();
                     if (typeof window === 'undefined') {
                        requirejs.undef('css!' + path);
                     }
                  };

               if (typeof process !== 'undefined' && process.domain && process.domain.req && process.domain.req.loadCss) {
                  process.domain.req.loadCss = myLoadCssFn;
               } else {
                  nativeCss.load = myLoadCssFn;
               }
            }

            try {
               /*TODO: set to presentation service*/
               process.domain.req.compatible = false;
            } catch (e) {
            }

            AppCore.superclass.constructor.apply(this, arguments);
            this.ctxData = new AppData(cfg);
            this.headDataCtx = new HeadDataContext(cfg.theme || '', cfg.buildnumber, cfg.cssLinks);
         },
         _getChildContext: function() {
            return {
               AppData: this.ctxData,
               headData: this.headDataCtx
            };
         },
         coreTheme: '',
         setTheme: function(ev, theme) {
            this.coreTheme = theme;
         }
      });

      return AppCore;
   }
);
