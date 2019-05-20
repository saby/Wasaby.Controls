/**
 * Created by rn.kondakov on 06.12.2018.
 */

/**
 *
 * Module with a function to get inner text from json.
 * Tag resolver for jsonToHtml in {@link Controls/_decorator/Markup/Converter}.
 *
 * @class Controls/_decorator/Markup/resolvers/innerText
 * @public
 * @author Кондаков Р.Н.
 */
const innerText = function innerText(value, parent) {
   if (typeof value === 'string') {
      return parent ? value : [[], value];
   }
   if (Array.isArray(value)) {
      var newValue = '';
      if (Array.isArray(value[0])) {
         newValue = innerText(value[0], value);
      }
      for (var i = 1; i < value.length; ++i) {
         newValue += innerText(value[i], value);
      }
      if (value[0] === 'p' || value[0] === 'br') {
         newValue += '\n';
      }
      return parent ? newValue : [[], newValue];
   }
   return '';
};
// @ts-ignore
innerText.__noNeedEscapeString = true;

export = innerText;
