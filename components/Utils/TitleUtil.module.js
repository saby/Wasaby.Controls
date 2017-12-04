define('js!SBIS3.CONTROLS.Utils.TitleUtil', ['js!SBIS3.CONTROLS.Utils.GetTextWidth', 'Core/helpers/String/escapeHtml'], function (getTextWidth, escapeHtml) {
   /**
    * @class SBIS3.CONTROLS.Utils.TitleUtil
    * @public
    */
   return /** @lends SBIS3.CONTROLS.Utils.TitleUtil.prototype */ {
      /**
       *
       * @param container
       */
      setTitle: function(container) {
         var innerText;
         container = container && container.get ? container.get(0) : container;
         if (container) {
            innerText = container.innerText;
            if (!container.getAttribute('title') && getTextWidth(escapeHtml(innerText)) > container.clientWidth) {
               container.setAttribute('title', innerText);
            }
         }
      }
   };
});