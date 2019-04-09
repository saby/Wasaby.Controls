/**
 * Created by rn.kondakov on 06.12.2018.
 */

   

   /**
    *
    * Module with a function to get html without outer tag.
    * Tag resolver for jsonToHtml in {@link Controls/Decorator/Markup/Converter}.
    *
    * @class Controls/Decorator/Markup/resolvers/noOuterTag
    * @public
    * @author Кондаков Р.Н.
    */
   export = function noOuterTag(value, parent) {
      if (!parent && value[0] === 'div') {
         value[0] = [];
      }
      return value;
   };

