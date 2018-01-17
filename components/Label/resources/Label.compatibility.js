define('SBIS3.CONTROLS/Label/resources/Label.compatibility',
   [
      'Core/Sanitize'
   ],
   function(Sanitize) {
       /**
        * @class SBIS3.CONTROLS/Label/resources/Label.compatibility
        * @public
        */
      return /** @lends SBIS3.CONTROLS/Label/resources/Label.compatibility.prototype */{
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
            this._container.html(Sanitize(caption));
         }
      }
   }
);