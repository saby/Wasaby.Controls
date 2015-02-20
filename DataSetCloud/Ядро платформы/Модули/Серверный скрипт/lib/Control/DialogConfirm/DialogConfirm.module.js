/**
 * Модуль "Компонент DialogConfirm".
 *
 * @description
 */
define("js!SBIS3.CORE.DialogConfirm", ["js!SBIS3.CORE.SimpleDialogAbstract", "i18n!SBIS3.CORE.DialogConfirm"], function( SimpleDialogAbstract, rk ) {

   "use strict";

   /**
    * Конфирм диалог
    *
    * @class $ws.proto.DialogConfirm
    * @extends $ws.proto.SimpleDialogAbstract
    * @control
    */
   $ws.proto.DialogConfirm = SimpleDialogAbstract.extend(/** @lends $ws.proto.DialogConfirm.prototype */{
      /**
       * @event onConfirm Событие, происходящее в момент выбора действия для продолжения
       * @param {Object} eventObject описание в классе $ws.proto.Abstract
       * @param {Boolean} result Результат конфирма
       */
      $protected: {
         _options: {
            invertDefaultButton: false
         },
         _defaultButtonsConfig: [
            {
               tabindex : 2,
               width : "100%",
               height : "100%",
               name : "Yes",
               renderStyle: "classic",
               /**
                * @translatable
                */
               caption : rk("Да"),
               handlers: {
                  onActivated  : function(){
                     this.getParent().close(true);
                  }
               }
            },
            {
               tabindex : 1,
               width : "100%",
               height : "100%",
               name : "No",
               renderStyle: "classic",
               /**
                * @translatable
                */
               caption : rk("Нет"),
               defaultButton: true,
               handlers: {
                  onActivated  : function(){
                     this.getParent().close(false);
                  }
               }
            }
         ]
      },
      $constructor : function(cfg){
         this._options.buttons = $ws.core.merge(this._defaultButtonsConfig, cfg.buttons && cfg.buttons.length ? cfg.buttons : {});
         this._window.addClass('ws-smp-dlg-confirm');
         this._publish('onConfirm');
      },
      close: function(arg) {
         this._notify('onConfirm', arg || false);
         return $ws.proto.DialogConfirm.superclass.close.apply(this, arguments);
      },
      _addButtons : function(){
         if(this._options.invertDefaultButton) {
            $ws.core.merge(this._options.buttons, [{
               tabindex:1,
               defaultButton:true
            }, {
               tabindex:2,
               defaultButton:false
            }]);
         }
         return $ws.proto.DialogConfirm.superclass._addButtons.apply(this, arguments);
      }
   });

   return $ws.proto.DialogConfirm;

});
