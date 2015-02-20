define(function () {

   'use strict';

   return {
      /**
       * Функция, возвращающая массив с адресами изображений, используемых в переданном HTML
       * @param html {JQuery|HTMLElement|String} Параметр, по которому будет произведен поиск изображений (jQuery-объект, DOM-элемент или строка)
       * @returns {Array} Массив адресов найденных изображений
       */
      findImagesInHtml: function(html) {
         if (!html) { //Если не указан параметр - возвращаем пустой массив
            return [];
         }
         var result = [];
         if (html instanceof $) { //Если передан jQuery-элемент
            var src;
            html.find('img').each(function(idx, obj) {
               src = obj.getAttribute('src');
               if (src && src.length) {
                  result.push(src);
               }
            });
         } else if (typeof html === 'string') { //Если передана строка
            var
               imgRegExp = new RegExp('</?img*[^<>]*>', 'gi'), //Регулярка для поиска всех <img>
               srcRegExp = /src\s*=\s*["']/gi, //Регулярка для поиска в <img> параметра src
               founded = html.match(imgRegExp);
            for (var i = 0, len = founded.length; i < len; i++) {
               founded[i].replace(srcRegExp, function(fnd, idx, str) {
                  var startIdx = idx + fnd.length,
                     lastIdx = str.indexOf('"', startIdx); //Ищем закрывающую двойную кавычку в параметре src
                  if (lastIdx === -1) {
                     lastIdx = str.indexOf("'", startIdx); //Если не нашли - то пробуем найти одинарную кавычку
                  }
                  if (lastIdx !== -1) { //Если нашли закрывающую кавычку - добавляем в результирующий массив путь к изображению
                     result.push(str.substring(startIdx, lastIdx));
                  }
               });
            }
         } else if (html.nodeType === 1) { //Если передан DOM-элемент
            var imgArray = html.getElementsByTagName('img');
            $ws.helpers.forEach(imgArray, function(obj) {
               src = obj.getAttribute('src');
               if (src && src.length) {
                  result.push(obj.getAttribute('src'));
               }
            });
         }
         return result;
      },

      /**
       * Метод удаляет переданные в параметре изображения из хранилища изображений
       * @param imgArray {Array} Массив строк, содержащий пути к удаляемым изображениям
       */
      removeImagesFromStorage: function(imgArray) {
         if (imgArray instanceof Array) {
            $ws.helpers.forEach(imgArray, function(element) {
               if (typeof element === 'string' && element.length) {
                  $.ajax({
                     url: element,
                     async: true,
                     type: 'DELETE'
                  });
               }
            });
         }
      }
   };
});