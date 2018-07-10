define('SBIS3.CONTROLS/Utils/TitleUtil', ['SBIS3.CONTROLS/Utils/GetTextWidth', 'Core/helpers/String/escapeHtml'], function (getTextWidth, escapeHtml) {
   /**
    * @class SBIS3.CONTROLS/Utils/TitleUtil
    * @author Крайнов Дмитрий Олегович
    * @public
    */
   return /** @lends SBIS3.CONTROLS/Utils/TitleUtil.prototype */ {
      /**
       * @param container - контейнер с текстом.
       * @param ellipsisContainer - контейнер, ограничивающий ширину.
       */
      setTitle: function(container, ellipsisContainer) {
         var innerText;
         var style;
         var width;
         container = container && container.get ? container.get(0) : container;
         ellipsisContainer = ellipsisContainer && ellipsisContainer.get ? ellipsisContainer.get(0) : ellipsisContainer;
         if (container) {
            style = window.getComputedStyle(ellipsisContainer || container);
            width = parseInt(style.width, 10);
            innerText = container.innerText;

            if (!container.getAttribute('title') && getTextWidth(escapeHtml(innerText), style.fontSize) > width) {
               container.setAttribute('title', innerText);
            }
         }
      }
   };
});