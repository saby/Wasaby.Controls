define('js!SBIS3.CONTROLS.InformationPopup',
   [
      'js!SBIS3.CONTROLS.FloatArea',
      'html!SBIS3.CONTROLS.InformationPopup'
   ],
   function(FloatArea, dotTpl){
      'use strict';
      var module = FloatArea.extend({
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