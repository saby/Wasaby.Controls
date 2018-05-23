define('Controls/Popup/Opener/Confirmation',
   [
      'Core/Control',
      'Core/Deferred',
      'tmpl!Controls/Popup/Opener/Confirmation/Confirmation',
      'css!Controls/Popup/Opener/Confirmation/Confirmation',
      'Controls/Popup/Opener/Confirmation/Dialog'
   ],
   function(Control, Deferred, template) {
      'use strict';

      /**
       * Хелпер открытия окна подтверждения
       * @class Controls/Popup/Opener/Confirmation
       * @extends Core/Control
       * @control
       * @public
       * @category Popup
       * @author Степин Павел Владимирович
       */

      /**
       * @function Controls/Popup/Opener/Confirmation#open
       * Открыть диалоговое окно
       * @param {Object} Объект конфигурации открываемого диалога - {@link Controls/Popup/Opener/Confirmation/Dialog}.
       */

      var Confirmation = Control.extend({
         _template: template,
         _resultDef: null,
         _openerResultHandler: null,

         constructor: function(options) {
            Confirmation.superclass.constructor.apply(this, options);
            this._openerResultHandler = this._resultHandler.bind(this);
         },

         _resultHandler: function(res) {
            if (this._resultDef) {
               this._resultDef.callback(res);
               this._resultDef = null;
            }
         },

         open: function(cfg) {
            this._resultDef = new Deferred();
            this._children.opener.open({
               templateOptions: cfg
            });
            return this._resultDef;
         }

      });

      return Confirmation;
   }
);
