/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection', [
], function () {
   'use strict';

   /**
    * Абстрактная проекция данных
    * @class SBIS3.CONTROLS.Data.Projection
    * @extends $ws.proto.Abstract
    * @public
    * @author Мальцев Алексей
    */

   var Projection = $ws.proto.Abstract.extend(/** @lends SBIS3.CONTROLS.Data.Projection */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection'
   });

   /**
    * Статические свойства
    */
   var _static = {
      /**
       * @var {Object[]} Массив соответствия индексов проекций и коллекций
       * @static
       */
      projectionsToCollections: [],

      /**
       * @var {Object[]} Массив соответствия индексов проекций и их инстансов
       * @static
       */
      projectionsToInstances: []
   };

   /**
    * Возвращает проекцию по умолчанию
    * @param {Object} object Объект, для которого требуется получить проекцию
    * @returns {SBIS3.CONTROLS.Data.Projection}
    * @static
    */
   Projection.getDefaultProjection = function (object) {
      var index = Array.indexOf(_static.projectionsToCollections, object);
      if (index === -1) {
         var instance;
         if ($ws.helpers.instanceOfMixin(object, 'SBIS3.CONTROLS.Data.Tree.ITreeItem')) {
            instance = $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Projection.Tree', {
               tree: object
            });
         } else if($ws.helpers.instanceOfMixin(object, 'SBIS3.CONTROLS.Data.Types.IEnum')) {
            instance = $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Projection.Enum', {
               collection: object
            });
         } else if ($ws.helpers.instanceOfMixin(object, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            instance = $ws.single.ioc.resolve('SBIS3.CONTROLS.Data.Projection.Collection', {
               collection: object
            });
         } else {
            throw new Error('Can\'t match a default projection');
         }
         _static.projectionsToCollections.push(object);
         _static.projectionsToInstances.push(instance);

         return instance;
      } else {
         return _static.projectionsToInstances[index];
      }
   };

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Projection', function(config) {
      return new Projection(config);
   });
   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.ProjectionConstructor', function() {
      return Projection;
   });

   return Projection;
});
