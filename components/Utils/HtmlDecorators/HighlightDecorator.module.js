define('js!SBIS3.CONTROLS.Utils.HtmlDecorators.HighlightDecorator', [
   'js!SBIS3.CONTROLS.Utils.HtmlDecorators.AbstractDecorator',
   'Core/markup/ParserUtilities',
   'Core/core-instance',
   'Core/helpers/String/escapeHtml'
], function (AbstractDecorator,
            Parser,
            cInst,
            escapeHtml) {
   'use strict';

   /**
    * Декоратор текста, обеспечивающий подсветку фразы
    * @class SBIS3.CONTROLS.Utils.HtmlDecorators.HighlightDecorator
    * @public
    * @author Крайнов Дмитрий Олегович
    */
   var HighlightDecorator = AbstractDecorator.extend(/** @lends SBIS3.CONTROLS.Utils.HtmlDecorators.HighlightDecorator.prototype */{
      $protected: {
         _name: 'highlight',
         _options: {
            /**
             * @cfg {String} CSS класс для подсветки
             */
            cssClass: 'controls-HtmlDecorators-highlight',

            /**
             * @cfg {String} Метод контрола, позволяющий получить текст для подсветки
             */
            textGetter: ''
         },
         /**
          * @var {String} Подсвечиваемая фраза
          */
         _text: ''
      },

      $constructor: function () {
      },

      /**
       * Обновляет настройки декоратора
       * @param {Object} control Экземпляр контрола
       */
      update: function (control) {
         HighlightDecorator.superclass.update.apply(this, arguments);

         if (this._options.textGetter) {
            this._text = control[this._options.textGetter]();
         }
      },

      checkCondition: function(obj) {
         return obj ? !!obj['highlight'] : false;
      },

      /**
       * Применяет декоратор
       * @param {*} value Текст для декорирования
       * @returns {*}
       */
      apply: function (value) {
         if (!this._options.enabled) {
            return value;
         }

         return this.getHighlighted(
            value,
            this._text,
            this._options.cssClass
         );
      },

      /**
       * Вставляет в текст разметку, отображающую фразу подсвеченной
       * @param {*} text Текст
       * @param {String} highlight Фраза для подсветки
       * @param {String} cssClass CSS класс, обеспечивающий подсветку
       * @returns {String}
       */
      getHighlighted: function (text, highlight, cssClass) {
         if (!text || !highlight) {
            return text;
         }

         /**
          * Если enum - нужно взять toString
          */
         if (cInst.instanceOfModule(text, 'WS.Data/Types/Enum')) {
            text = text.toString();
         }
         text = Parser.parse(text);
         highlight = escapeHtml('' + highlight)
            .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');

         highlighted(text, new RegExp(highlight, 'gi'), cssClass);
         return text.innerHTML();
      }
   });

   function highlighted(content, highlight, cssClass) {
      var
         idx = 0;
      if (content.childNodes) {
         for (var i = content.childNodes.length-1; i >= 0; i--) {
             highlighted(content.childNodes[i], highlight, cssClass );
         }
      }
      if (content.text) {
         content.text = content.text.replace(
            highlight,
            '<span class="' + cssClass + '">$&</span>'
         );
      }
   }

   return HighlightDecorator;
});
