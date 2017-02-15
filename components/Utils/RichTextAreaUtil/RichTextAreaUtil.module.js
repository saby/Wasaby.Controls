/**
 * Created by ps.borisov on 03.12.2015.
 */
define('js!SBIS3.CONTROLS.Utils.RichTextAreaUtil',[
   'Core/constants',
   'Core/markup/ParserUtilitiesNew'
], function (constants, Parser) {
   'use strict';
   /**
    * Утилиты для работы с контентом полученным из Богатого текстового редактора
    * @class SBIS3.CONTROLS.Utils.RichTextAreaUtil
    * @author Авраменко А.С.
    * @public
    */
   var RichTextAreaUtil = /** @lends SBIS3.CONTROLS.Utils.RichTextAreaUtil.prototype */{
      /**
       * Метод для добавления определяющей метки в контент при копировании/вырезки из БТРа
       * @param {$object}$object - jquery элемент при копировании/вырезке из которого в буффер необходимо добавлять метку БТРа
       */
      markRichContentOnCopy: function(target){
         target = target.get(0);
         //поддерживаем форматное копирование только в chrome
         if (constants.browser.chrome) {
            if (target.addEventListener) {
               target.addEventListener('copy', this._markingRichContent, true);
               target.addEventListener('cut', this._markingRichContent, true);
            } else {
               //on в отличие от attachEvent в приходящем событии позволяет получить таргет
               $(target).on('cut copy', this._markingRichContent);
            }
         }
      },
      unmarkRichContentOnCopy: function(target){
         target = target.get(0);
         if (constants.browser.chrome) {
            //в webkit в бтре идёт подписка на cut и удаляется лишний символ, поэтому нужно подписываться на capture фазе
            if (target.removeEventListener) {
               target.removeEventListener('copy', this._markingRichContent, true);
               target.removeEventListener('cut', this._markingRichContent, true);
            } else {
               $(target).off('cut copy', this._markingRichContent);
            }
         }
      },
      /**
       * Оборачивает контент в div с событием открывающим изображение в диалоговом окне
       * @param {html} контент который необходимо обернуть
       * @returns {html}
       * */
      wrapRichContent: function(html) {
         var contentClass = 'content-wrap';
         return html && html.search(contentClass) === -1 && html.search('img') !== -1 ?
         '<div class="' + contentClass + '" onclick="$ws.helpers.openImageViewer.apply(this, arguments)">\n' + html + '\n</div>'
            : html;
      },
      /*Блок приватных методов*/
      _markingRichContent: function(e) {
         var
            event =  e.originalEvent ? e.originalEvent : e,
            oldOrphans = event.target.style.orphans;
         //согласно документации https://developer.mozilla.org/ru/docs/Web/API/Selection/focusNode
         //focusNode является узлом на котором закончилось выделение
         if (document.getSelection() && $.contains(event.currentTarget , document.getSelection().focusNode)) {
            //orphans = '31415' - метка показывающая что содержимое было скопировано из богатого редактора
            event.target.style.orphans = '31415'; //Pi
            setTimeout(function() {
               event.target.style.orphans = oldOrphans;
            });
         }
      },

      //TODO: временное решение для 230. удалить в 240 когда сделают ошибку https://inside.tensor.ru/opendoc.html?guid=dbaac53f-1608-42fa-9714-d8c3a1959f17
      unDecorateLinks: function(text) {
         var
            parsed = Parser.parse(text),

            replaceDecoratedLinks = function(content) {
               var
                  i = 0;
               if (content.childNodes) {
                  while (i < content.childNodes.length) {
                     var
                        className = getAttribute(content.childNodes[i], 'class');
                     if (className === 'LinkDecorator__link' || className == 'LinkDecorator') {
                        replaceToHref(content, i);
                     } else if (className == 'LinkDecorator__object'){
                        content.childNodes.splice(i, 1);
                     } else {
                        replaceDecoratedLinks(content.childNodes[i]);
                     }
                     i++;
                  }
               }
            },

            getAttribute = function(node, atrrName){
               var
                  j = 0;
               if (node && node.attributes) {
                  while (j < node.attributes.length) {
                     if (node.attributes[j].name === atrrName ) {
                        return node.attributes[j].value;
                     }
                     j++;
                  }
               }
               return false;
            },

            replaceToHref = function(content, index){
               var
                  href = getAttribute(content.childNodes[index], 'href'),
                  node = new Parser.Node({childNodes: [], parentNode: content, text : href , nodeType: 3});
               content.childNodes[index] = node;
            };

         replaceDecoratedLinks(parsed);

         return parsed.innerHTML();
      }
   };

   return RichTextAreaUtil;
});