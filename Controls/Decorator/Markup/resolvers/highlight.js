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

   return function linkDecorate(json, parent, resolverParams) {
      if (typeof json !== 'string' && !(json instanceof String)) {
         return json;
      }
      var allIndexesOfTextToHighlight = allIndexesOf(json.toLowerCase(), resolverParams.textToHighlight.toLowerCase());
      if (!allIndexesOfTextToHighlight.length) {
         return json;
      }
      var newJson = [[]],
         textToHighlightLength = resolverParams.textToHighlight.length,
         j = 0,
         s1,
         s2;
      for (var i = 0; i < allIndexesOfTextToHighlight.length; ++i) {
         s1 = json.substring(j, allIndexesOfTextToHighlight[i]);
         j = allIndexesOfTextToHighlight[i] + textToHighlightLength;
         s2 = json.substr(allIndexesOfTextToHighlight[i], textToHighlightLength);
         if (s1) {
            newJson.push(s1);
         }
         newJson.push(['span', { 'class': 'controls-Highlight_found' }, s2]);
      }
      s1 = json.substr(j);
      if (s1) {
         newJson.push(s1);
      }
      return newJson;
   };
});
