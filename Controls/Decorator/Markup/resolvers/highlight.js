/**
 * Created by rn.kondakov on 30.10.2018.
 */
define('Controls/Decorator/Markup/resolvers/highlight', function() {
   'use strict';

   // Find all indexes if search value in string.
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

   /**
    *
    * Module with a function to highlight searched string.
    * Takes textToHighlight from resolverParams {@link Controls/Decorator/Markup#resolverParams}.
    * Tag resolver for {@link Controls/Decorator/Markup}.
    *
    * @class Controls/Decorator/Markup/resolvers/highlight
    * @public
    * @author Кондаков Р.Н.
    */
   return function linkDecorate(value, parent, resolverParams) {
      // Resolve only strings and only if text to highlight exists and not empty.
      if ((typeof value !== 'string' && !(value instanceof String)) || !resolverParams.textToHighlight) {
         return value;
      }

      var textToHighlight = resolverParams.textToHighlight,
         allIndexesOfTextToHighlight = allIndexesOf(value.toLowerCase(), textToHighlight.toLowerCase());

      // Text to highlight not found.
      if (!allIndexesOfTextToHighlight.length) {
         return value;
      }

      var newValue = [[]],
         j = 0,
         substringNotToHighlight,
         substringToHighlight;

      for (var i = 0; i < allIndexesOfTextToHighlight.length; ++i) {
         substringNotToHighlight = value.substring(j, allIndexesOfTextToHighlight[i]);
         j = allIndexesOfTextToHighlight[i] + textToHighlight.length;
         substringToHighlight = value.substr(allIndexesOfTextToHighlight[i], textToHighlight.length);
         if (substringNotToHighlight) {
            newValue.push(substringNotToHighlight);
         }
         newValue.push(['span', { 'class': 'controls-Highlight_found' }, substringToHighlight]);
      }
      substringNotToHighlight = value.substring(j);
      if (substringNotToHighlight) {
         newValue.push(substringNotToHighlight);
      }

      return newValue;
   };
});
