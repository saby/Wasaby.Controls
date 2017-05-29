/* global define */
define('js!WS.Data/Types/Dictionary', [
   'js!WS.Data/Collection/IEnumerable',
   'js!WS.Data/Collection/ArrayEnumerator',
   'js!WS.Data/Collection/ObjectEnumerator',
   'js!WS.Data/Entity/IEquatable',
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Entity/OptionsMixin',
   'js!WS.Data/Entity/ObservableMixin',
   'js!WS.Data/Di',
   'Core/core-extend'
], function (
   IEnumerable,
   ArrayEnumerator,
   ObjectEnumerator,
   IEquatable,
   Abstract,
   OptionsMixin,
   ObservableMixin,
   Di,
   CoreExtend
) {
   'use strict';

   /**
    * Тип данных словарь.
    * Это абстрактный класс, не предусмотрено создание самостоятельных экземпляров.
    * @class WS.Data/Types/Dictionary
    * @implements WS.Data/Collection/IEnumerable
    * @implements WS.Data/Entity/IEquatable
    * @mixes WS.Data/Entity/OptionsMixin
    * @mixes WS.Data/Entity/ObservableMixin
    * @public
    * @author Мальцев Алексей
    */

   var Dictionary = Abstract.extend([IEnumerable, IEquatable, OptionsMixin, ObservableMixin],/** @lends WS.Data/Types/Dictionary.prototype */ {
      _moduleName: 'WS.Data/Types/Dictionary',

      /**
      * @cfg {Array.<String>|Object} Словарь возможных значений
      * @name WS.Data/Types/Dictionary#dictionary
      */
      _$dictionary: undefined,

      /**
       * @member {String} Название типа данных для сериализации в сырой вид
        */
      _type: undefined,

      constructor: function $Dictionary(options) {
         Dictionary.superclass.constructor.call(this, options);
         OptionsMixin.constructor.call(this, options);
         ObservableMixin.constructor.call(this, options);
         this._$dictionary = this._$dictionary || [];
      },

      destroy: function() {
         ObservableMixin.destroy.call(this);
         Dictionary.superclass.destroy.call(this);
      },

      //region WS.Data/Collection/IEnumerable

      each: function (callback, context) {
         context = context || this;
         var enumerator = this.getEnumerator();
         while (enumerator.moveNext()) {
            callback.call(
               context,
               enumerator.getCurrent(),
               enumerator.getCurrentIndex()
            );
         }
      },

      getEnumerator: function () {
         var enumerator = this._$dictionary instanceof Array ? new ArrayEnumerator(this._$dictionary) : new ObjectEnumerator(this._$dictionary);
         enumerator.setFilter(function(item, index) {
            return index !== 'null';
         });
         return enumerator;
      },

      //endregion WS.Data/Collection/IEnumerable

      //region WS.Data/Entity/IEquatable

      isEqual: function(to) {
         if (!(to instanceof Dictionary)) {
            return false;
         }

         var enumerator = this.getEnumerator(),
            toEnumerator = to.getEnumerator(),
            item,
            hasItem,
            toItem,
            hasToItem;

         do {
            hasItem = enumerator.moveNext();
            hasToItem = toEnumerator.moveNext();
            item = hasItem ? enumerator.getCurrent() : undefined;
            toItem = hasToItem ? toEnumerator.getCurrent() : undefined;
            if (item !== toItem) {
               return false;
            }
            if (enumerator.getCurrentIndex() !== toEnumerator.getCurrentIndex()) {
               return false;
            }
         } while(hasItem || hasToItem);

         return true;
      },

      //endregion WS.Data/Entity/IEquatable

      //region Protected methods

      /**
       * Возвращает индекс значения в словаре
       * @param {String} name Значение в словаре
       * @return {Number|String|undefined}
       * @protected
       */
      _getIndex: function (name) {
         var enumerator = this.getEnumerator(),
            index = 0;
         while (enumerator.moveNext()) {
            if (enumerator.getCurrent() === name) {
               return index;
            }
            index++;
         }
         return undefined;
      },

      /**
       * Возвращает значение в словаре по индексу
       * @param {Number|String} index Индекс в словаре
       * @return {String}
       * @protected
       */
      _getValue: function (index) {
         return this._$dictionary[index];
      },

      /**
       * Возвращает словарь из формата
       * @param {WS.Data/Format/Field|WS.Data/Format/UniversalField|String} format Формат поля
       * @return {Array}
       * @protected
       */
      _getDictionaryByFormat: function (format) {
         return (format.getDictionary ? format.getDictionary() : format.meta && format.meta.dictionary) || [];
      }

      //endregion Protected methods
   });

   return Dictionary;
});
