/**
 * Created by rn.kondakov on 30.10.2018.
 */
define('Controls/Decorator/Markup/resolvers/highlight', function() {
   'use strict';

   function allIndexesOf(str, searchValue) {
      var i = str.indexOf(searchValue),
         result = [];
      while (i !== -1) {
         result.push(i);
         i += searchValue.length;
         i = str.indexOf(searchValue, i);
      }
      return result;
   }

   return function linkDecorate(value, parent, resolverParams) {
      if (typeof value !== 'string' && !(value instanceof String)) {
         return value;
      }
      var allIndexesOfTextToHighlight = allIndexesOf(value.toLowerCase(), resolverParams.textToHighlight.toLowerCase());
      if (!allIndexesOfTextToHighlight.length) {
         return value;
      }
      var newValue = [[]],
         textToHighlightLength = resolverParams.textToHighlight.length,
         j = 0,
         s1,
         s2;
      for (var i = 0; i < allIndexesOfTextToHighlight.length; ++i) {
         s1 = value.substring(j, allIndexesOfTextToHighlight[i]);
         j = allIndexesOfTextToHighlight[i] + textToHighlightLength;
         s2 = value.substr(allIndexesOfTextToHighlight[i], textToHighlightLength);
         if (s1) {
            newValue.push(s1);
         }
         newValue.push(['span', { 'class': 'controls-Highlight_found' }, s2]);
      }
      s1 = value.substring(j);
      if (s1) {
         newValue.push(s1);
      }
      return newValue;
   };
});
