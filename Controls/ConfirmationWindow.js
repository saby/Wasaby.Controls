define('Controls/ConfirmationWindow',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls/ConfirmationWindow/ConfirmationWindow',
      'css!Controls/ConfirmationWindow/ConfirmationWindow',
      'Controls/ConfirmationWindow/Dialog'
   ],
   function (Control, Deferred, template) {
      'use strict';

      /**
       * Хелпер открытия окна подтверждения
       * @class Controls/ConfirmationWindow
       * @extends Core/Control
       * @control
       * @public
       * @category Popup
       * @author Степин Павел Владимирович
       */

      /**
       * @function Controls/ConfirmationWindow#open
       * Открыть диалоговое окно
       * @param {Object} Объект конфигурации открываемого диалога - {@link Controls/ConfirmationWindow/Dialog}.
       */

      var ConfirmationWindow = Control.extend({
         _template: template,
         _resultDef: null,
         _openerResultHandler: null,

         constructor: function (options) {
            ConfirmationWindow.superclass.constructor.apply(this, options);
            this._openerResultHandler = this._resultHandler.bind(this);
         },

         _resultHandler: function(res){
            if(this._resultDef){
               this._resultDef.callback(res);
               this._resultDef = null;
            }
         },

         open: function(cfg){
            this._resultDef = new Deferred();
            this._children.opener.open({
               componentOptions: cfg
            });
            return this._resultDef;
         }

      });

      return ConfirmationWindow;
   }
);