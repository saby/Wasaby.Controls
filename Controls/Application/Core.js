/**
 * Created by dv.zuev on 01.02.2018.
 */
define('Controls/Application/Core',
   [
      'Core/Control',
      'tmpl!Controls/Application/Core',
      'Controls/Application/AppData',
      'Controls/Application/HeadDataContext',
      'native-css'
   ],
   function(Control, template, AppData, HeadDataContext, nativeCss) {

      'use strict';

      /*COPYPASTE FROM Core/css-resolver
      * заливаю так
      * когда WS соберется и попадет в SDK - этот кусок будет удален
      * */

      var global = (function () {
         return this || (0, eval)('this');
      }());

      var buildMode = global.contents ? global.contents.buildMode : 'debug',
         isDebugMode = function () {
            return global.document && global.document.cookie && global.document.cookie.indexOf('s3debug=true') > -1;
         };

      var suffix = '';
      if (buildMode === 'release' && !isDebugMode()) {
         suffix = '.min';
      }
      if (global.buildnumber && !isDebugMode()) {
         suffix += '.v' + global.buildnumber;
      }
      function getCssP(path) {
         return (window.wsConfig.resourceRoot + '/' + path + suffix + '.css').replace('//', '/');
      };

      var AppCore = Control.extend({
         _template: template,
         ctxData: null,
         constructor: function(cfg) {
            var self = this;
            nativeCss.load = function(path, require, load, conf) {
               load(null);
               self.headDataCtx.pushCssLink(getCssP(path));
               self.headDataCtx.updateConsumers();
            };

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
