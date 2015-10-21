define(['js!SBIS3.CONTROLS.Utils.HtmlDecorators/AbstractDecorator'], function (AbstractDecorator) {
   'use strict';

   var BOLD = 0x8000000,
      ITALIC = 0x4000000,
      UNDERLINE = 0x2000000,
      STRIKE = 0x1000000;

   /**
    * Декоратор текста, обеспечивающий отметку цветом
    * @class SBIS3.CONTROLS.Utils.HtmlDecorators/ColorMarkDecorator
    * @public
    * @author Мальцев Алексей Александрович
    */
   var ColorMarkDecorator = AbstractDecorator.extend(/** @lends SBIS3.CONTROLS.Utils.HtmlDecorators/ColorMarkDecorator.prototype */{
      $protected: {
         _options: {
         }
      },

      $constructor: function () {
      },

      /**
       * Применяет декоратор
       * @param {*} value Текст для декорирования
       * @returns {*}
       */
      apply: function (value) {
         return value ? this.specToStyle(value) : value;
      },

      /**
       * Превращает спецификацию расцветки в CSS-правило
       *
       * @param spec
       * @returns {String}
       */
      specToStyle: function (spec) {
         var specObject = this.specToObject(spec),
             rules;

         rules = [
            'color: ' + specObject.color
         ];
         if (specObject.isBold) {
            rules.push('font-weight: bold');
         }
         if (specObject.isItalic) {
            rules.push('font-style: italic');
         }
         if (specObject.isUnderline || specObject.isStrike) {
            rules.push('text-decoration: ' + [specObject.isUnderline ? 'underline' : '', specObject.isStrike ? 'line-through' : ''].join(' '));
         }

         return rules.join(';');
      },

      /**
       * Превращает спецификацию в объект
       * @param {String|Number|Object} spec
       * @returns {{color: string, isBold: boolean, isItalic: boolean, isUnderline: boolean, isStrike: boolean}}
       */
      specToObject: function (spec) {
         spec = this.specToNumber(spec);
         return {
            color: '#' + this.lPad3b((spec & 0xFFFFFF).toString(16)).toLowerCase(),
            isBold: !!(spec & BOLD),
            isItalic: !!(spec & ITALIC),
            isUnderline: !!(spec & UNDERLINE),
            isStrike: !!(spec & STRIKE)
         };
      },

      /**
       * Нормализует спецификацию расцветки. Если передано в виде строки - разбирает в число
       *
       * @param {String|Number|Object} spec
       * @returns {Number}
       */
      specToNumber: function (spec) {
         if(!spec) {
            return 0;
         } else if(typeof spec === 'string') {
            spec = Number(spec);
            if(isNaN(spec)) {
               spec = 0;
            }
         } else if(typeof spec === 'object') {
            var rSpec = Number((spec.color || '0').replace('#', '0x'));
            rSpec |= spec.isBold ? BOLD : 0;
            rSpec |= spec.isItalic ? ITALIC : 0;
            rSpec |= spec.isUnderline ? UNDERLINE : 0;
            rSpec |= spec.isStrike ? STRIKE : 0;

            return rSpec;
         }
         return spec;
      },

      /**
       * Добавляет слева нулей до 3 байт в хексе
       * @param {String} s
       * @returns {string}
       */
      lPad3b : function (s) {
         var pad = '000000';
         return pad.substr(0, 6 - s.length) + s;
      }
   });

   return ColorMarkDecorator;
});
