define('js!Controls/Popup/Opener/Sticky',
   [
      'js!Controls/Popup/Opener/Base',
      'js!Controls/Popup/Opener/Sticky/Strategy'

   ],
   function (Base, Strategy) {
      /**
       * Действие открытия окна
       * @class Controls/Popup/Opener/Sticky
       * @control
       * @public
       * @category Popup
       * @extends Controls/Control
       */
      var Sticky = Base.extend({
         getStrategy: function(){
            return Strategy;
         }
      });

      return Sticky;
   }
);