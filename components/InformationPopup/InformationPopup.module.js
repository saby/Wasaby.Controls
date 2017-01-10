define('js!SBIS3.CONTROLS.InformationPopup',
   [
      'js!SBIS3.CORE.CompoundControl',
      'js!SBIS3.CONTROLS.PopupMixin',
      'js!SBIS3.CORE.LikeWindowMixin',
      'html!SBIS3.CONTROLS.InformationPopup',
      'css!SBIS3.CONTROLS.InformationPopup'
   ],

   /**
    * Класс контрола "Всплывающее информационное окно". Содержимое окна строится по шаблону, установленному в опции {@link template}. Цвет линии в шапке окна зависит от установленного состояния {@link status}.
    *
    * @class SBIS3.CONTROLS.InformationPopup
    * @extends SBIS3.CORE.CompoundControl
    *
    * @mixes SBIS3.CONTROLS.PopupMixin
    * @mixes SBIS3.CORE.LikeWindowMixin
    *
    *
    * @control
    * @public
    * @author Степин Павел Владимирович
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
                * @cfg {InformationPopupStatus} Устанавливает состояние окна. От состояния зависит цвет линии в шапке и иконка.
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
          * Устанавливает новое состояние окна.
          * @param {InformationPopupStatus} status Состояние.
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