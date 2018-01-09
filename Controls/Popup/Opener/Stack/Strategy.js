define('js!Controls/Popup/Opener/Stack/Strategy',
   [
      'js!Controls/Popup/Opener/BaseStrategy',
      'Controls/Popup/Opener/PositioningHelpers',
      'WS.Data/Collection/List'
   ],
   function (BaseStrategy, PositioningHelpers, List) {

      /**
       * Контроллер стековых панелей.
       * @class Controls/Popup/Opener/Stack/Strategy
       * @control
       * @private
       * @category Popup
       */

      var Strategy = BaseStrategy.extend({
         constructor: function (cfg) {
            Strategy.superclass.constructor.call(this, cfg);
            this._stack = new List();
         },

         addElement: function (element) {
            this._stack.add(element, 0);
            this._update();
         },

         removeElement: function (element) {
            this._stack.remove(element);
            this._update();
         },

         _update: function () {
            var
               self = this,
               previous;
            this._stack.each(function (item, index) {
               var
                  minWidth = item.popupOptions.minWidth,
                  maxWidth = item.popupOptions.maxWidth,
                  prevWidth = previous ? previous.width : null,
                  prevRight = previous ? previous.right : null;
               item.position = PositioningHelpers.stack(index, minWidth, maxWidth, window.outerWidth, prevWidth, prevRight);
               previous = item.position;
               if( !previous ){
                  item.position = self.getDefaultPosition();
               }
            });
         }
      });

      return new Strategy();
   }
);