define('js!SBIS3.CONTROLS.InformationPopup',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.PopupMixin',
      'html!SBIS3.CONTROLS.InformationPopup'
   ],

   /**
    * Всплывающий контрол с линией в шапке, зависящей от состояния, и содержимым.
    * @class SBIS3.CONTROLS.InformationPopup
    * @extends SBIS3.CORE.CompoundControl
    * @control
    * @author Степин П.В.
    */
   function(CompoundControl, PopupMixin, dotTpl){
      'use strict';
      var InformationPopup = CompoundControl.extend([PopupMixin], /** @lends SBIS3.CONTROLS.InformationPopup.prototype */ {
         /**
          * @typedef {String} InformationPopupStatus
          * @variant default  Окно без состояния. Цвет линии в шапке - синий, иконка по умолчанию не задана.
          * @variant success  "Успешно". Цвет линии в шапке - зеленый, иконка - зелёная галка.
          * @variant error    "Ошибка". Цвет линии в шапке - красный, иконка - треугольник с воскл.знаком.
          * @variant warning  "Предупреждение". Цвет линии в шапке - оранжевый, иконка по умолчанию не задана.
          */

         _dotTplFn : dotTpl,
         $protected: {
            _options: {

               /**
                * @cfg {InformationPopupStatus} Состояние окна. От состояния заивисит цвет линии в шапке и иконка по умолчани.
                */
               status: 'default',

               /**
                * @cfg {Function} Шаблон содержимого
                */
               template: null
            }
         },
         $constructor : function(){
         },

         init : function() {
            InformationPopup.superclass.init.call(this);
         },

         _isLegalStatus: function(){
            return status === 'default' || status === 'success' || status === 'error' || status === 'warning';
         },

         /**
          * Установить новое состояние
          * @param {InformationPopupStatus} status
          */
         setStatus: function(status){
            if(this._isLegalStatus(status)){
               this.getContainer().removeClass('controls-InformationPopup__status-' + this._options.status).addClass('controls-InformationPopup__status-' + status);
               this._options.status = status;
            }
         }
      });

      InformationPopup.resizable = false;
      return InformationPopup;
   }
);