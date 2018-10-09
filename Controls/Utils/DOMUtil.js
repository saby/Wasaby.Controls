/**
 * Created by ia.kapustin on 19.09.2018.
 */
define('Controls/Utils/DOMUtil', function() {
   'use strict';

   /**
    * Returns the internal width of the element (that is, after deduction the borders, padding and scroll bars)
    * @param {window.Node} container
    * @return {window.Number}
    **/
   return {
      width: function(container) {
         var
            computedStyle,
            containerWidth = container.clientWidth;

         if (window.getComputedStyle) {
            computedStyle = window.getComputedStyle(container);
            containerWidth -= parseInt(computedStyle.paddingLeft, 10) + parseInt(computedStyle.paddingRight, 10);
         }

         return containerWidth;
      }
   };
});
