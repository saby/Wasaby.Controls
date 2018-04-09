/**
 * Created by dv.zuev on 01.02.2018.
 */
define('Controls/Application/Core',
   [
      'Core/Control',
      'tmpl!Controls/Application/Core',
      'Controls/Application/AppData'
   ],
   function(Control, template, AppData) {

      'use strict';

      var AppCore = Control.extend({
         _template: template,
         ctxData: null,
         constructor: function(cfg) {
            AppCore.superclass.constructor.apply(this, arguments);
            this.ctxData = new AppData(cfg);
         },
         _getChildContext: function() {
            return {
               AppData: this.ctxData
            };
         }
      });

      return AppCore;
   }
);
