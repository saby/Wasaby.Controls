define('js!Controls/Popup/Opener/Dialog',
   [
      'js!Controls/Popup/Opener/Base',
      'js!Controls/Popup/Opener/Dialog/Strategy'

   ],
   function (Base, Strategy) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Dialog
       * @control
       * @public
       * @category Popup
       * @extends Controls/Control
       */
      var Dialog = Base.extend({
         getStrategy: function(){
            return Strategy;
         }
      });

      return Dialog;
   }
);