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
      var module = CompoundControl.extend([PopupMixin], {
         _dotTplFn : dotTpl,
         $protected: {
            _options: {

               /**
                * @cfg {String} Состояние окна. От состояния зависит цвет линии в шапке.
                * @variant default  Цвет линии будет синим
                * @variant success  Цвет линии будет зеленым
                * @variant error    Цвет линии будет красным
                * @variant warning  Цвет линии будет оранжевым
                */
               state: 'default',

               /**
                * @cfg {Function} Шаблон содержимого
                */
               contentTemplate: null
            }
         },
         $constructor : function(){
         },

         init : function() {
            module.superclass.init.call(this);
         },

         /**
          * Установить новое состояние
          * @param state
          */
         setState: function(state){
            if(state === 'default' || state === 'success' || state === 'error' || state === 'warning'){
               this.getContainer().removeClass('controls-InformationPopup__state-' + this._options.state).addClass('controls-InformationPopup__state-' + state);
               this._options.state = state;
            }
         }
      });

      module.resizable = false;
      return module;
   }
);