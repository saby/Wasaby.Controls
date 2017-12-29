define('js!Controls/Popup/Opener/Stack/Strategy',
   [
      'js!Controls/Popup/Opener/BaseStrategy',
      'WS.Data/Collection/List'
   ],
   function (BaseStrategy, List) {

      /**
       * Контроллер стековых панелей.
       * @class Controls/Popup/Opener/Stack/Strategy
       * @control
       * @private
       * @category Popup
       */
      var
         // минимальная ширина стековой панели
         MINIMAL_PANEL_WIDTH = 50,
         // минимальный отступ стековой панели от правого края
         MINIMAL_PANEL_DISTANCE = 50;

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
               item.position = self._calcPosition(index, item, previous);
               previous = item.position;
               if( !previous ){
                  item.position = self.getDefaultPosition();
               }
            });
         },

         // когда разделим понятие контроллера и стратегии, эта функция уйдет в стратегию
         _calcPosition: function (index, item, previous) {
            var
               width = this._calcWidth(item.popupOptions.minWidth || MINIMAL_PANEL_WIDTH, item.popupOptions.maxWidth),
               right = 0;
            if (index !== 0) {
               if( previous ){
                  right = Math.max(100, 100 - ( width - previous.width - previous.right ));
                  if (( width + right ) > this._getMaxPanelWidth()) {
                     return null;
                  }
               }
               else{
                  return null;
               }
            }
            return {
               width: width,
               right: right,
               top: 0,
               bottom: 0
            };
         },

         _calcWidth: function (minWidth, maxWidth) {
            if (!maxWidth) {
               maxWidth = this._getMaxPanelWidth();
            }
            var
               newWidth = Math.min(this._getMaxPanelWidth(), maxWidth);
            if (newWidth < minWidth) {
               return Math.max(minWidth, MINIMAL_PANEL_WIDTH);
            }
            else if (newWidth < MINIMAL_PANEL_WIDTH) {
               return MINIMAL_PANEL_WIDTH;
            }
            return newWidth;
         },

         _getMaxPanelWidth: function () {
            return window.outerWidth - MINIMAL_PANEL_DISTANCE;
         }
      });

      return new Strategy();
   }
);