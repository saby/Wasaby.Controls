define('js!Controls/Popup/Opener/Stack',
   [
      'js!Controls/Popup/Opener/Base',
      'js!Controls/Popup/Opener/Stack/Strategy'

   ],
   function (Base, Strategy) {
      /**
       * Действие открытия стековой панели
       * @class Controls/Popup/Opener/Stack
       * @control
       * @public
       * @category Popup
       * @extends Controls/Control
       */
      var Stack = Base.extend({
         getStrategy: function(){
            return Strategy;
         }
      });

      return Stack;
   }
);