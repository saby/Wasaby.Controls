define('js!SBIS3.CONTROLS.Utils.Sanitize', ['Core/markup/ParserUtilitiesNew'], function(Parser) {
   'use strict';
   /**
    * Очищает контент от вредоносных скриптов
    * @class SBIS3.CONTROLS.Utils.Sanitize
    * @author Авраменко А.С.
    * @public
    */

   var
      validNodes = { // Допустимые типы нод
         html: true, head: true, body: true, // Основные элементы
         p: true, div: true, span: true, img: true, br: true, a: true, pre: true, label: true, iframe: true, // Основные элементы
         b: true, strong: true, i: true, em: true, u: true, s: true, strike: true, q: true, blockquote: true, // Стили
         h1: true, h2: true, h3: true, h4: true, h5: true, h6: true, // Заголовки
         dd: true, dir: true, dl: true, dt: true, li: true, menu: true, ol: true, ul: true, // Списки
         table: true, thead: true, tbody: true, caption: true, col: true, colgroup: true, td: true, tfoot: true, th: true, tr: true // Таблицы
      },

      validAttributes = { // Допустимые атрибуты
         style: true,
         src: true,
         height: true,
         width: true,
         colspan: true,
         rowspan: true,
         'class': true,
         id: true,
         tabindex: true,
         title: true
      };

   function validateAttributes(content) {
      var
         idx = 0;
      if (content.attributes.length) {
         while (content.attributes.length && idx < content.attributes.length) {
            if (validAttributes[content.attributes[idx].name]) {
               content.attributes[idx].value.replace('javascript:', '');
               idx++;
            } else {
               content.attributes.splice(idx, 1);
            }
         }
      }
   }

   function validateContent(content) {
      var
         idx = 0;
      if (content.childNodes) {
         while (content.childNodes.length && idx < content.childNodes.length) {
            if (content.childNodes[idx].nodeType !== 1 || validNodes[content.childNodes[idx].nodeName]) {
               validateContent(content.childNodes[idx]);
               idx++;
            } else {
               content.childNodes.splice(idx, 1);
            }
         }
      }
      validateAttributes(content);
   }

   return function(content, settings) {
      var
         parsed = Parser.parse(content);
      validateContent(parsed);
      return parsed.innerHTML();
   };

});
