/* global define, require */
define('js!WS.Data/Display/Display', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Entity/OptionsMixin',
   'js!WS.Data/Entity/ObservableMixin',
   'js!WS.Data/Di',
   'Core/core-instance'
], function (
   Abstract,
   OptionsMixin,
   ObservableMixin,
   Di,
   CoreInstance
) {
   'use strict';

   /**
    * Абстрактная проекция данных.
    * Это абстрактный класс, не предназначенный для создания самостоятельных экземпляров.
    * @class WS.Data/Display/Display
    * @extends WS.Data/Entity/Abstract
    * @mixes WS.Data/Entity/OptionsMixin
    * @mixes WS.Data/Entity/ObservableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Display = Abstract.extend([OptionsMixin, ObservableMixin], /** @lends WS.Data/Display/Display.prototype */{
      _moduleName: 'WS.Data/Display/Display',

      constructor: function $Display(options) {
         Display.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
         ObservableMixin.constructor.call(this, options);
      },

      destroy: function() {
         ObservableMixin.destroy.call(this);
         Display.superclass.destroy.call(this);
      }
   });

   /**
    * Статические свойства
    */
   var _static = {
      /**
       * @member {Array.<WS.Data/Collection/IEnumerable>} Массив соответствия индексов проекций и коллекций
       * @static
       */
      displaysToCollections: [],

      /**
       * @member {Array.<WS.Data/Display/Display>} Массив соответствия индексов проекций и их инстансов
       * @static
       */
      displaysToInstances: [],

      /**
       * @member {Array.<Number>} Счетчик ссылок на singlton-ы
       * @static
       */
      displaysCounter: []
   };

   /**
    * Возвращает проекцию по умолчанию
    * @param {WS.Data/Collection/IEnumerable} collection Объект, для которого требуется получить проекцию
    * @param {Object} [options] Опции конструктора проекции
    * @param {Boolean} [single=false] Возвращать singleton для каждой collection
    * @return {WS.Data/Display/Display}
    * @static
    */
   Display.getDefaultDisplay = function (collection, options, single) {
      if (arguments.length == 2 && (typeof options !== 'object')) {
         single = options;
         options = {};
      }

      var index = single ? _static.displaysToCollections.indexOf(collection) : -1;
      if (index === -1) {
         options = options || {};
         options.collection = collection;
         var instance;
         if (CoreInstance.instanceOfMixin(collection, 'WS.Data/Types/IEnum')) {
            instance = Di.create('display.enum', options);
         } else if (CoreInstance.instanceOfMixin(collection, 'WS.Data/Types/IFlags')) {
            instance = Di.create('display.flags', options);
         } else if (CoreInstance.instanceOfMixin(collection, 'WS.Data/Collection/IEnumerable')) {
            instance = Di.create('display.collection', options);
         } else if (collection instanceof Array) {
            instance = Di.create('display.collection', {
               collection: collection
            });
         } else {
            throw new Error('Argument "collection" should implement WS.Data/Collection/IEnumerable or be an instance of Array, but "' + collection + '" given.');
         }

         if (single) {
            _static.displaysToCollections.push(collection);
            _static.displaysToInstances.push(instance);
            _static.displaysCounter.push(1);
         }

         return instance;
      } else {
         _static.displaysCounter[index]++;
         return _static.displaysToInstances[index];
      }
   };

   /**
    * Освобождает проекцию, которую запрашивали через getDefaultDisplay как singleton
    * @param {WS.Data/Display/Display} display Проекция, полученная через getDefaultDisplay с single=true
    * @return {Boolean} Ссылка на проекцию была освобождена
    * @static
    */
   Display.releaseDefaultDisplay = function (display) {
      var index = _static.displaysToInstances.indexOf(display);
      if (index === -1) {
         return false;
      }

      _static.displaysCounter[index]--;

      if (_static.displaysCounter[index] === 0) {
         _static.displaysToInstances[index].destroy();

         _static.displaysCounter.splice(index, 1);
         _static.displaysToInstances.splice(index, 1);
         _static.displaysToCollections.splice(index, 1);
      }

      return true;
   };

   return Display;
});
