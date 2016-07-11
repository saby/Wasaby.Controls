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
          * @typedef {String} State
          * @variant default  Окно без состояния. Цвет линии в шапке - синий, иконка по умолчанию не задана.
          * @variant success  "Успешно". Цвет линии в шапке - зеленый, иконка - зелёная галка.
          * @variant error    "Ошибка". Цвет линии в шапке - красный, иконка - треугольник с воскл.знаком.
          * @variant warning  "Предупреждение". Цвет линии в шапке - оранжевый, иконка по умолчанию не задана.
          */

         _dotTplFn : dotTpl,
         $protected: {
            _options: {

               /**
                * @cfg {State} Состояние окна. От состояния заивисит цвет линии в шапке и иконка по умолчани.
                */
               state: 'default',

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

         /**
          * Установить новое состояние
          * @param {State} state
          */
         setState: function(state){
            if(state === 'default' || state === 'success' || state === 'error' || state === 'warning'){
               this.getContainer().removeClass('controls-InformationPopup__state-' + this._options.state).addClass('controls-InformationPopup__state-' + state);
               this._options.state = state;
            }
         }
      });

      InformationPopup.resizable = false;
      return InformationPopup;
   }
);