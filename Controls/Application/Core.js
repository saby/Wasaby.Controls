/**
 * Created by dv.zuev on 01.02.2018.
 */
define('Controls/Application/Core',
   [
      'Core/Control',
      'tmpl!Controls/Application/Core',
      'Controls/Application/AppData',
      'Controls/Application/HeadDataContext'
   ],
   function(Control, template, AppData, HeadDataContext) {

      'use strict';

      var AppCore = Control.extend({
         _template: template,
         ctxData: null,
         constructor: function(cfg) {
            try {
               /*TODO: set to presentation service*/
               process.domain.req.compatible = false;
            } catch (e) {
            }

            AppCore.superclass.constructor.apply(this, arguments);
            this.ctxData = new AppData(cfg);
            this.headDataCtx = new HeadDataContext(cfg.theme || '', cfg.buildnumber);
         },
         _getChildContext: function() {
            return {
               AppData: this.ctxData,
               headData: this.headDataCtx
            };
         }
      });

      return AppCore;
   }
);
