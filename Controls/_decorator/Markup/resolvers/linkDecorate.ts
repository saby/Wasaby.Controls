/**
 * Created by rn.kondakov on 23.10.2018.
 */
import { wrapLinksInString, needDecorate, getDecoratedLink } from '../resources/linkDecorateUtils';

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
  var result;
  if (typeof value === 'string') {
      // How to find out we are inside tag a?? .
      result = wrapLinksInString(value, parent);
  } else if (needDecorate(value, parent)) {
     result = getDecoratedLink(value);
  } else {
     result = value;
  }
  return result;
};
