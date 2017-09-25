define('js!SBIS3.CONTROLS.Label.compatibility', [],
   function() {
      return {
         /**
          * Вернуть текст метки
          * @returns {String}
          */
         getCaption: function() {
            return this.caption;
         },

         /**
          * Изменить текст метки
          * @param caption новый текст метки
          */
         setCaption: function(caption) {
            this.caption = caption;
            this._forceUpdate();
         },

         /**
          * Вернуть текст подсказки
          * @returns {String}
          */
         getTooltip: function() {
            return this.tooltip;
         },
         /**
          * Изменить текст подсказки
          * @param tooltip новый текст метки
          */
         setTooltip: function(tooltip) {
            this.tooltip = tooltip;
            this._forceUpdate();
         },
         /**
          * Вернуть видимость контрола
          * @returns {Boolean}
          */
         getVisible: function() {
            return this.visible;
         },
         /**
          * Изменить видимость контрола
          * @param visible видимость
          */
         setVisible: function(visible) {
            this.visible = visible !== false;
            this._forceUpdate();
         }
      }
   }
);