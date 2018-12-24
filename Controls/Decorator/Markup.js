/**
 * Created by rn.kondakov on 18.10.2018.
 */
define('Controls/Decorator/Markup', [
   'Core/Control',
   'Controls/Decorator/Markup/resources/template'
], function(Control,
   template) {
   'use strict';

   /**
    * Builds a control by data in Json array.
    *
    * @class Controls/Decorator/Markup
    * @extends Core/Control
    * @category Decorator
    * @author Кондаков Р.Н.
    * @public
    */

   /**
    * @name Controls/Decorator/Markup#value
    * @cfg {Array} Json array, based on JsonML.
    */

   /**
    * @name Controls/Decorator/Markup#tagResolver
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
    * {@link Controls/Decorator/Markup/resolvers/highlight}
    * {@link Controls/Decorator/Markup/resolvers/linkDecorate}
    */

   /**
    * @name Controls/Decorator/Markup#resolverParams
    * @cfg {Object} Outer data for tagResolver.
    */

   var MarkupDecorator = Control.extend({
      constructor: function() {
         MarkupDecorator.superclass.constructor.apply(this, arguments);

         /**
          * когда контрол вставляют в старое окружение,
          * которое вставлено в новое окружение
          * decoptions не инициализируется и корневые атрибуты не сохраняются
          * здесь нужно создавать контролы руками, но тгда они будут моргать
          * в 19.100 нас спасет этот реквест:
          * https://online.sbis.ru/opendoc.html?guid=39adaa74-8996-4f44-8ba9-60f2c4f93256
          * слой совместимости будет подмешиваться динамически и этот конструктор можно будет удалить
          * */

         if (!this._decOptions) {
            this._decOptions = {};
         }
      },
      _template: template
   });

   return MarkupDecorator;
});
