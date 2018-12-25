define('Controls/Utils/applyHighlighter', [], function() {

   'use strict';

   return function(highlighters) {
      var
         result = '',
         args = arguments;

      highlighters.forEach(function(highlighter) {
         result += highlighter.apply(undefined, Array.prototype.slice.call(args, 1));
      });

      return result;
   };
});
