/**
 * Created by rn.kondakov on 06.12.2018.
 */
define('Controls/Decorator/Markup/resolvers/innerText', function() {
   'use strict';

   /**
    *
    * Module with a function to get inner text from json.
    * Tag resolver for jsonToHtml in {@link Controls/Decorator/Markup/Converter}.
    *
    * @class Controls/Decorator/Markup/resolvers/innerText
    * @public
    * @author Кондаков Р.Н.
    */
   return function innerText(value, parent) {
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
         if (value[0] === 'p') {
            newValue += '\n';
         }
         return parent ? newValue : [[], newValue];
      }
      return '';
   };
});
