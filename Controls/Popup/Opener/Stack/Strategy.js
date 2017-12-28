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
      var Strategy = BaseStrategy.extend({
         constructor: function (cfg) {
            Strategy.superclass.constructor.call(this, cfg);
            this._stack = new List();
         },

         addElement: function (element, width) {
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
               previous = null;
            this._stack.each(function (item, index) {
               item.position = self._calcPosition(index, item, previous);
               previous = item;
            });
         },

         // когда разделим понятие контроллера и стратегии, эта функция уйдет в стратегию
         _calcPosition: function (index, item, previous) {
            if (index > 2) {
               return {
                  right: -10000,
                  top: -10000
               };
            }
            else {
               return {
                  right: index * 100,
                  top: 0,
                  bottom: 0
               };
            }
         }
      });

      return new Strategy();
   }
);