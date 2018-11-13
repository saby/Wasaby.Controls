define('SBIS3.CONTROLS/Utils/TitleUtil', ['Controls/Utils/hasHorizontalScroll'], function (hasHorizontalScroll) {
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
         container = container && container.get ? container.get(0) : container;
         ellipsisContainer = ellipsisContainer && ellipsisContainer.get ? ellipsisContainer.get(0) : ellipsisContainer;
         if (container) {
            innerText = container.innerText;

            if (!container.getAttribute('title') && hasHorizontalScroll(container || ellipsisContainer)) {
               container.setAttribute('title', innerText);
            }
         }
      }
   };
});