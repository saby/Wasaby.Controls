define('js!SBIS3.CONTROLS.InformationPopup',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.PopupMixin',
      'js!SBIS3.CORE.LikeWindowMixin',
      'html!SBIS3.CONTROLS.InformationPopup'
   ],

   /**
    * Всплывающий контрол с линией в шапке, зависящей от состояния, и содержимым.
    * @class SBIS3.CONTROLS.InformationPopup
    * @extends SBIS3.CORE.CompoundControl
    * @control
    * @public
    * @author Степин П.В.
    */
   function(CompoundControl, PopupMixin, LikeWindowMixin, dotTpl){
      'use strict';
      var InformationPopup = CompoundControl.extend([PopupMixin, LikeWindowMixin], /** @lends SBIS3.CONTROLS.InformationPopup.prototype */ {
         /**
          * @typedef {String} InformationPopupStatus
          * @variant default  Окно без состояния. Цвет линии в шапке - синий, иконка по умолчанию не задана.
          * @variant success  Состояние "Успешно". Цвет линии в шапке - зеленый, иконка - зелёная галка.
          * @variant error    Состояние "Ошибка". Цвет линии в шапке - красный, иконка - треугольник с восклицательным знаком.
          */
         _dotTplFn : dotTpl,
         $protected: {
            _options: {

               /**
                * @cfg {InformationPopupStatus} Устанавливает состояние диалога. От состояния заивисит цвет линии в шапке и иконка по умолчани.
                */
               status: 'default',
               /**
                * @cfg {Function} Устанавливает шаблон содержимого диалога.
                */
               template: null
            }
         },
         $constructor : function(){
         },

         init : function() {
            InformationPopup.superclass.init.call(this);
         },

         /**
          * Установить новое состояние
          * @param {InformationPopupStatus} status
          */
         setStatus: function(status){
            this.getContainer().removeClass('controls-InformationPopup__status-' + this._options.status).addClass('controls-InformationPopup__status-' + status);
            this._options.status = status;
         }
      });

      InformationPopup.resizable = false;
      return InformationPopup;
   }
);