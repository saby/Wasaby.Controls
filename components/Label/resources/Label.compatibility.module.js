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
          this._setDirty();
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
        * @param caption новый текст метки
        */
       setTooltip: function(tooltip) {
          this.tooltip = tooltip;
          this._setDirty();
       }
    }
   }
);