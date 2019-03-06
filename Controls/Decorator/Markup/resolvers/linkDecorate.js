/**
 * Created by rn.kondakov on 23.10.2018.
 */
define('Controls/Decorator/Markup/resolvers/linkDecorate', [
   'Controls/Decorator/Markup/resources/linkDecorateUtils'
], function(utils) {
   'use strict';

   /**
    *
    * Module with a function to replace common link on decorated link, if it needs.
    * Tag resolver for {@link Controls/Decorator/Markup}.
    *
    * @class Controls/Decorator/Markup/resolvers/linkDecorate
    * @public
    * @author Кондаков Р.Н.
    */
   return function linkDecorate(value, parent) {
      var result;
      if (utils.needDecorate(value, parent)) {
         result = utils.getDecoratedLink(value);
      } else {
         result = value;
      }
      return result;
   };
});
