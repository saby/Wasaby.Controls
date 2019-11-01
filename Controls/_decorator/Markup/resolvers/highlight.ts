/**
 * Created by rn.kondakov on 30.10.2018.
 */

   // Find all indexes if search value in string.
   function allIndexesOf(str, searchValue) {
      let i = str.indexOf(searchValue),
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
    * Модуль с функцией выделения искомой строки.
    * Берет textToHighlight из resolverParams {@link Controls/decorator:Markup#resolverParams}.
    * Распознаватель тегов для {@link Controls/decorator:Markup}.
    *
    * @class Controls/_decorator/Markup/resolvers/highlight
    * @public
    * @author Кондаков Р.Н.
    */

   /*
    *
    * Module with a function to highlight searched string.
    * Takes textToHighlight from resolverParams {@link Controls/decorator:Markup#resolverParams}.
    * Tag resolver for {@link Controls/decorator:Markup}.
    *
    * @class Controls/_decorator/Markup/resolvers/highlight
    * @public
    * @author Кондаков Р.Н.
    */    
   export default function highlight(value, parent, resolverParams) {
      // Resolve only strings and only if text to highlight exists and not empty.
      if ((typeof value !== 'string' && !(value instanceof String)) || !resolverParams.textToHighlight) {
         return value;
      }

      const textToHighlight = resolverParams.textToHighlight;
      const allIndexesOfTextToHighlight = allIndexesOf(value.toLowerCase(), textToHighlight.toLowerCase());

      // Text to highlight not found.
      if (!allIndexesOfTextToHighlight.length) {
         return value;
      }

      let newValue = [[]];
      let j = 0;
      let substringNotToHighlight;
      let substringToHighlight;

      for (let i = 0; i < allIndexesOfTextToHighlight.length; ++i) {
         substringNotToHighlight = value.substring(j, allIndexesOfTextToHighlight[i]);
         j = allIndexesOfTextToHighlight[i] + textToHighlight.length;
         substringToHighlight = value.substr(allIndexesOfTextToHighlight[i], textToHighlight.length);
         if (substringNotToHighlight) {
            newValue.push(substringNotToHighlight);
         }
         newValue.push(['span', { 'class': 'controls-MarkupDecorator_highlight' }, substringToHighlight]);
      }
      substringNotToHighlight = value.substring(j);
      if (substringNotToHighlight) {
         newValue.push(substringNotToHighlight);
      }

      return newValue;
   };

