/**
 * Created by rn.kondakov on 23.10.2018.
 */
import utils = require('Controls/_decorator/Markup/resources/linkDecorateUtils');
   

   /**
    *
    * Module with a function to replace common link on decorated link, if it needs.
    * Tag resolver for {@link Controls/_decorator/Markup}.
    *
    * @class Controls/_decorator/Markup/resolvers/linkDecorate
    * @public
    * @author Кондаков Р.Н.
    */
   export = function linkDecorate(value, parent) {
      var result;
      if (utils.needDecorate(value, parent)) {
         result = utils.getDecoratedLink(value);
      } else {
         result = value;
      }
      return result;
   };

