/**
 * Created by rn.kondakov on 23.10.2018.
 */
import * as utils from './../resources/linkDecorateUtils';


   /**
    *
    * Module with a function to replace common link on decorated link, if it needs.
    * Tag resolver for {@link Controls/_decorator/Markup}.
    *
    * @class Controls/_decorator/Markup/resolvers/linkDecorate
    * @public
    * @author Кондаков Р.Н.
    */
   export default function linkDecorate(value, parent) {
      let result;
      if (utils.needDecorate(value, parent)) {
         result = utils.getDecoratedLink(value);
      } else {
         result = value;
      }
      return result;
   };

