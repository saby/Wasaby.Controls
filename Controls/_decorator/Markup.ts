/**
 * Created by rn.kondakov on 18.10.2018.
 */
import Control = require('Core/Control');
import template = require('Controls/_decorator/Markup/resources/template');
   

   /**
    * Builds a control by data in Json array.
    *
    * @class Controls/_decorator/Markup
    * @extends Core/Control
    * @category Decorator
    * @author Кондаков Р.Н.
    * @public
    */

   /**
    * @name Controls/_decorator/Markup#value
    * @cfg {Array} Json array, based on JsonML.
    */

   /**
    * @name Controls/_decorator/Markup#tagResolver
    * @cfg {Function} Tool to change Json before build, if it need. Applies to every node.
    * @remark
    * Function Arguments:
    * <ol>
    *    <li>value - Json node to resolve.</li>
    *    <li>parent - Json node, a parent of "value" argument.</li>
    *    <li>resolverParams - Object, outer data for tagResolver from resolverParams option.</li>
    * </ol>
    * The function should return valid JsonML. If the return value is not equals (!==) to the origin node,
    * function will not apply to children of the new value.
    * Note: Function should not change origin value.
    *
    * @example
    * {@link Controls/_decorator/Markup/resolvers/highlight}
    * {@link Controls/_decorator/Markup/resolvers/linkDecorate}
    */

   /**
    * @name Controls/_decorator/Markup#resolverParams
    * @cfg {Object} Outer data for tagResolver.
    */

   var MarkupDecorator = Control.extend({
      _template: template
   });

   export = MarkupDecorator;

