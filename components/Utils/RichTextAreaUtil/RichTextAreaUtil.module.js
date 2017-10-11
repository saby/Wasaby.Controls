/**
 * Created by ps.borisov on 03.12.2015.
 */
define('js!SBIS3.CONTROLS.Utils.RichTextAreaUtil',[
   'Core/constants',
   'Core/markup/ParserUtilities'
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
      /*Блок приватных методов*/
      _markingRichContent: function (e) {
         var event =  e.originalEvent ? e.originalEvent : e;
         //согласно документации https://developer.mozilla.org/ru/docs/Web/API/Selection/focusNode
         //focusNode является узлом на котором закончилось выделение
         //$.contains(node,node) вернет false, необходимо дополнительно проверить равеноство узлов
         var sel = document.getSelection();
         if (sel && (event.currentTarget === sel.focusNode || $.contains(event.currentTarget, sel.focusNode))) {
            //orphans = '31415' - метка показывающая что содержимое было скопировано из богатого редактора
            // Обработчик, проставляющий или убирающий метку указщанному узлу если он элемент
            var handleNode = function (isForward, node) {
               if (node.nodeType === 1) {
                  var MARK = '31415';//Pi
                  if (isForward) {
                     node.setAttribute('data-orphans', node.style.orphans);
                     node.style.orphans = MARK;
                  }
                  else {
                     node.style.orphans = node.getAttribute('data-orphans');
                     node.removeAttribute('data-orphans');
                  }
               }
            };
            // Может быть выделена только часть текста внутри элемента event.target, поэтому маркировать нужно не только его самого, но и его дочерние элементы
            var handleAll = function (isForward, target) {
               handleNode(isForward, target);
               [].slice.call(target.childNodes).forEach(handleNode.bind(null, isForward));
            };
            handleAll(true, event.target);
            // И вернуть всё взад
            setTimeout(handleAll.bind(null, false, event.target), 1);
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
                     //3 if-блока для поддержки разных версий декорированных ссылок
                     //LinkDecorator - версия января 2017
                     //LinkDecorator__simpleLink - тег <a> с ссылкой
                     //LinkDecorator__linkWrap - если выделили только одну декорированную ссылку и пытаются её вставить данный класс висит на <a>
                     //LinkDecorator__decoratedLink - версия февраля 2017
                     //LinkDecorator__wrap - актуальная версия
                     if (className === 'LinkDecorator__link' || className == 'LinkDecorator' || className == 'LinkDecorator__simpleLink'|| className == 'LinkDecorator__linkWrap') {
                        replaceToHref(content, i);
                     } else if (className == 'LinkDecorator__decoratedLink'){
                        content.childNodes.splice(i, 1);
                     } else if (className == 'LinkDecorator__wrap'){
                        replaceWrapToHref(content, i);
                     } else {
                        replaceDecoratedLinks(content.childNodes[i]);
                     }
                     i++;
                  }
               }
            },

            getAttribute = function(node, atrrName){
               if (node && node.attributes && node.attributes[atrrName]) {
                  return node.attributes[atrrName].value;
               }
               return false;
            },

            replaceToHref = function(content, index){
               var
                  href = getAttribute(content.childNodes[index], 'href'),
                  node = new Parser.Node({childNodes: [], parentNode: content, text : href , nodeType: 3});
               content.childNodes[index] = node;
            },

            //Поиск тега a с классом LinkDecorator__linkWrap внутри блока блока с номером index,
            //замена блока с номером index на href найденной ссылки
            replaceWrapToHref = function(content, index){
               var
                  href,
                  node,
                  linkNode,
                  imageNode,
                  i = 0;
               while (i < content.childNodes[index].childNodes.length) {
                  var
                     className = getAttribute(content.childNodes[index].childNodes[i], 'class');
                  if (className == 'LinkDecorator__linkWrap'){
                     var
                        linkChild = content.childNodes[index].childNodes[i].childNodes[0];
                     linkNode = content.childNodes[index].childNodes[i];
                     if (linkChild && linkChild.nodeName === 'img' ) {
                        imageNode = linkChild;
                     }
                     break;
                  }
                  i++;
               }
               href = (linkChild ? getAttribute(linkChild, 'alt') : getAttribute(linkNode, 'href')) || '';
               node = new Parser.Node({childNodes: [], parentNode: content, text : href , nodeType: 3 , nodeValue: href});
               content.childNodes[index] = node;
            };

         replaceDecoratedLinks(parsed);

         return parsed.innerHTML();
      }
   };

   return RichTextAreaUtil;
});