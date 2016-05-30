/* global define, require, $ws */
define('js!SBIS3.CONTROLS.Data.Projection.Projection', [
   'js!SBIS3.CONTROLS.Data.Entity.Abstract',
   'js!SBIS3.CONTROLS.Data.Entity.OptionsMixin',
   'js!SBIS3.CONTROLS.Data.Entity.ObservableMixin',
   'js!SBIS3.CONTROLS.Data.Di'
], function (Abstract, OptionsMixin, ObservableMixin, Di) {
   'use strict';

   /**
    * Абстрактная проекция данных
    * @class SBIS3.CONTROLS.Data.Projection.Projection
    * @extends SBIS3.CONTROLS.Data.Entity.Abstract
    * @mixes SBIS3.CONTROLS.Data.Entity.OptionsMixin
    * @mixes SBIS3.CONTROLS.Data.Entity.ObservableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Projection = Abstract.extend([OptionsMixin, ObservableMixin], /** @lends SBIS3.CONTROLS.Data.Projection.Projection.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Projection.Projection',

      constructor: function $Projection(options) {
         Projection.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
      }
   });

   /**
    * Статические свойства
    */
   var _static = {
      /**
       * @member {Object[]} Массив соответствия индексов проекций и коллекций
       * @static
       */
      projectionsToCollections: [],

      /**
       * @member {Object[]} Массив соответствия индексов проекций и их инстансов
       * @static
       */
      projectionsToInstances: []
   };

   /**
    * Возвращает проекцию по умолчанию
    * @param {Object} object Объект, для которого требуется получить проекцию
    * @returns {SBIS3.CONTROLS.Data.Projection.Projection}
    * @static
    */
   Projection.getDefaultProjection = function (object) {
      var index = Array.indexOf(_static.projectionsToCollections, object);
      if (index === -1) {
         var instance;
         if ($ws.helpers.instanceOfMixin(object, 'SBIS3.CONTROLS.Data.Types.IEnum')) {
            instance = Di.resolve('projection.enum', {
               collection: object
            });
         } else if ($ws.helpers.instanceOfMixin(object, 'SBIS3.CONTROLS.Data.Collection.IEnumerable')) {
            instance = Di.resolve('projection.collection', {
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

   return Projection;
});
