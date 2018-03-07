/**
 * Created by ad.chistyakova on 12.11.2015.
 */
define('SBIS3.CONTROLS/Utils/ScrollUtil', ['Core/Abstract'], function(cAbstract) {
   'use strict';
    /**
     * @class SBIS3.CONTROLS/Utils/ScrollUtil
     * @author Крайнов Дмитрий Олегович
     * @public
     */
   var ScrollUtil = cAbstract.extend(/** @lends SSBIS3.CONTROLS.ScrollUtil.prototype */{
      /**
       * Находится ли скролл внизу
       * @return {Boolean} Находится ли скролл внизу
       */
      isScrollOnBottom: function(element, offset){
         offset = offset || 0;
         var element = this.getScrollContainer();
         return element.scrollTop() + element.outerHeight() >= this.getScrollHeight(element[0]) - offset;
      },
      
      scrollTo: function() {

      },

      /**
       * Находится ли скролл вверху
       * @return {Boolean} Находится ли скролл внизу
       */
      isScrollOnTop: function(element){
         return element.scrollTop() === 0;
      },

      /**
       * Получить текущую высоту скролла элемента
       * @returns {Number} высота скролла
       */
      getScrollHeight: function(element) {
         if (element.scrollHeight){
            return element.scrollHeight;
         } else {
            // Get document height (cross-browser)
            if (element == window){
               var body = document.body,
                  html = document.documentElement;
               return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
            }
         }
      },

      /**
       * Есть ли у элемента скролл
       * @param  {String|DOMElement|jQuery}  element [description]
       * @param  {Number} offset если высота скролла меньше offset вернет false
       * @return {Boolean} есть ли у элемента скролл высотой меньше offset
       */
      hasScroll: function(element, offset){
         offset = offset || 0;
         var scrollHeight = this.getScrollHeight();
         return scrollHeight > this.getContainerHeight() + offset || scrollHeight > $(window).height() + offset;
      }

   });

   return ScrollUtil;
});