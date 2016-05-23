/**
 * Created by ps.borisov on 03.12.2015.
 */
define('js!SBIS3.CONTROLS.Utils.RichTextAreaUtil',[], function () {
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
         //На ipad`e нет аозможности задать clipboardData, форматное копирование с меткой не поддерживаем
         if (!$ws._const.browser.isMobileIOS) {
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
         if (!$ws._const.browser.isMobileIOS) {
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
            selectionRange, selectionContent, textRange, bodyElement, tempElement, textData,
            selectionNode = document.createElement('div'),
            clipboardData = event.clipboardData ? event.clipboardData : window.clipboardData,
            currentWindow = window,
            label = document.createComment('content=SBIS.FRE'), // по этой метке будем определять что контент вставляется из FieldRichEditor
            i = 0,
            target = $(e.currentTarget),
            canCut = event.type == 'cut' && target.is('[contenteditable="true"]'),
            _isDescendant = function(parent, child) {
               var node = child;
               while (node != null) {
                  if (node == parent) {
                     return true;
                  }
                  node = node.parentNode;
               }
               return false;
            };
         e.preventDefault();
         //рассчет родительского window элемента
         while (window.frames[i]){
            if (_isDescendant(window.frames[i].document.body, event.target)) {
               currentWindow = window.frames[i];
            }
            i++;
         }
         // webkit && ie>9
         if (currentWindow.getSelection) {
            textData = currentWindow.getSelection().toString().replace(/\r\n|\n/gi,'\r\n');;
            selectionRange = currentWindow.getSelection().getRangeAt(0);
            selectionContent = canCut ? selectionRange.extractContents() : selectionRange.cloneContents();
         }
         // ie8
         else {
            selectionRange = currentWindow.document.selection.createRange();
            selectionContent = selectionRange.duplicate().htmlText;
            if (canCut) {
               //вырезать выделенное если событие cut
               selectionRange.pasteHTML('');
            }
            tempElement = currentWindow.document.createElement('div');
            tempElement.innerHTML = selectionContent;
            selectionContent = tempElement;
         }
         // webkit позволяет оперировать буфером
         if (event.clipboardData) {
            selectionNode.appendChild(selectionContent);
            clipboardData.setData('text/html', '<!--' + label.data + '-->' + selectionNode.innerHTML);
            clipboardData.setData('text', textData);
         }
         // для ie
         else {
            textRange = document.body.createTextRange();
            bodyElement = document.getElementsByTagName('body')[0];
            selectionNode.style.position = 'absolute';
            selectionNode.style.left = '-99999px';
            bodyElement.appendChild(selectionNode);
            selectionNode.appendChild(label);
            selectionNode.appendChild(selectionContent);
            textRange.moveToElementText(selectionNode);
            textRange.execCommand('copy');
            window.setTimeout(function() {
               bodyElement.removeChild(selectionNode);
            },0);
         }
         target.focus();
      }
   };

   return RichTextAreaUtil;
});