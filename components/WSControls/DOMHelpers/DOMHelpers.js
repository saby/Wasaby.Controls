/**
 * Created by am.gerasimov on 13.07.2017.
 */
define('js!WSControls/DOMHelpers/DOMHelpers', function () {
   return {
      closest: function(node, css, context) {
         while (node && (!context || node !== context)) {
            if (node.matches(css)) {
               return node;
            } else {
               node = node.parentElement;
            }
         }
         return null;
      }
   }
});