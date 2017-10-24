define('js!SBIS3.CONTROLS.Label.compatibility', [],
   function() {
       /**
        * @class SBIS3.CONTROLS.Label.compatibility
        * @public
        */
      return /** @lends SBIS3.CONTROLS.Label.compatibility.prototype */{
         /**
          * Возвращает текст метки.
          * @returns {String}
          * @see caption
          * @see setCaption
          */
         getCaption: function() {
            return this._options.caption;
         },

         /**
          * Изменяет текст метки.
          * @param {String}
          * @see caption
          * @see getCaption
          */
         setCaption: function(caption) {
            this._options.caption = caption;
            this._forceUpdate();
         },

         /**
          * Возвращает текст всплывающей подсказки.
          * @returns {String}
          * @see tooltip
          * @see getTooltip
          */
         getTooltip: function() {
            return this._options.tooltip;
         },
         /**
          * Изменяет текст всплывающей подсказки.
          * @param {String} tooltip
          * @see tooltip
          * @see getTooltip
          */
         setTooltip: function(tooltip) {
            this._options.tooltip = tooltip;
            this._forceUpdate();
         },
         /**
          * Возвращает признак: отображается ли метка или нет.
          * @see setVisible
          * @see visible
          * @returns {Boolean} Значение true является признаком, что метка отображается.
          */
         getVisible: function() {
            return this._options.visible;
         },
         /**
          * Изменяет видимость метки.
          * @param {Boolean} visible В значении true метка отображается.
          * @see getVisible
          * @see visible
          */
         setVisible: function(visible) {
            this._options.visible = visible !== false;
            this._forceUpdate();
         }
      }
   }
);