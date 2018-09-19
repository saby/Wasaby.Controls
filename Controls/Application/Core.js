/**
 * Created by dv.zuev on 01.02.2018.
 */
define('Controls/Application/Core',
   [
      'Core/Control',
      'wml!Controls/Application/Core',
      'Controls/Application/AppData',
      'Controls/Application/HeadDataContext',
      'Core/Themes/ThemesController',
      'native-css',
      'Core/css-resolve'
   ],
   function(Control,
      template,
      AppData,
      HeadDataContext,
      ThemesController,
      nativeCss,
      cssResolve) {
      'use strict';

      function parseTheme(path) {
         var splitted = path.split('theme?');
         var res;
         if (splitted.length > 1) {
            res = {
               name: splitted[1],
               hasTheme: true
            };
         } else {
            res = {
               name: path,
               hasTheme: false
            };
         }
         return res;
      }


      var AppCore = Control.extend({
         _template: template,
         ctxData: null,
         constructor: function(cfg) {
            try {
               /* TODO: set to presentation service */
               process.domain.req.compatible = false;
            } catch (e) {
            }

            AppCore.superclass.constructor.apply(this, arguments);
            this.ctxData = new AppData(cfg);
            this.headDataCtx = new HeadDataContext(cfg.theme || '', cfg.buildnumber, cfg.cssLinks, cfg.appRoot, cfg.resourceRoot);
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
   });
