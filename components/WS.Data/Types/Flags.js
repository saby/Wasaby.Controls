/* global define */
define('js!WS.Data/Types/Flags', [
   'js!WS.Data/Types/IFlags',
   'js!WS.Data/Types/Dictionary',
   'js!WS.Data/Entity/IProducible',
   'js!WS.Data/Entity/OneToManyMixin',
   'js!WS.Data/ContextField/Flags',
   'js!WS.Data/Entity/SerializableMixin',
   'js!WS.Data/Entity/CloneableMixin',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'Core/Context',
   'Core/helpers/collection-helpers'
], function (
   IFlags,
   Dictionary,
   IProducible,
   OneToManyMixin,
   ContextFieldFlags,
   SerializableMixin,
   CloneableMixin,
   Di,
   Utils,
   CoreContext,
   CollectionHelpers
) {
   'use strict';

   /**
    * Тип данных набор флагов
    * @class WS.Data/Types/Flags
    * @extends WS.Data/Types/Dictionary
    * @implements WS.Data/Types/IFlags
    * @implements WS.Data/Entity/IProducible
    * @mixes WS.Data/Entity/OneToManyMixin
    * @public
    * @author Ганшин Ярослав
    */

   var Flags = Dictionary.extend([IFlags, IProducible, OneToManyMixin, SerializableMixin, CloneableMixin],/** @lends WS.Data/Types/Flags.prototype */ {
      _moduleName: 'WS.Data/Types/Flags',
      /**
       * @cfg {Array.<Boolean|Null>} Выбранные значения согласно словарю
       * @name WS.Data/Types/Flags#values
       */
      _$values: undefined,

      /**
       * @member Название типа данных для сериализации в сырой вид
       */
      _type: 'flags',

      constructor: function $Flags(cfg) {
         Flags.superclass.constructor.call(this, cfg);

         this._$values = this._$values || [];
      },

      destroy: function() {
         OneToManyMixin.destroy.call(this);
         Flags.superclass.destroy.call(this);
      },

      //region WS.Data/Types/IFlags

      get: function (name) {
         var index = this._getIndex(name);
         if (index !== undefined) {
            return this._prepareValue(this._$values[index]);
         }
         return undefined;
      },

      set: function (name, value) {
         var index = this._getIndex(name);
         if (index === undefined) {
            throw new ReferenceError(this._moduleName + '::set(): the value "' + name + '" doesn\'t found in dictionary');
         }

         value = this._prepareValue(value);
         if (this._$values[index] === value) {
            return;
         }
         this._$values[index] = value;
         this._notifyChange(name, index, value);
      },

      getByIndex: function (index) {
         var name = this._getValue(index),
             valuesIndex = this._getIndex(name);

         return this._$values[valuesIndex];
      },

      setByIndex: function (index, value) {
         var name = this._getValue(index);
         if (name === undefined) {
            throw new ReferenceError(this._moduleName + '::setByIndex(): the index ' + index + ' doesn\'t found in dictionary');
         }

         var valuesIndex = this._getIndex(name);
         value = this._prepareValue(value);
         if (this._$values[valuesIndex] === value) {
            return;
         }

         this._$values[valuesIndex] = value;
         this._notifyChange(name, index, value);
      },

      setFalseAll: function () {
         this._setAll(false);
      },

      setTrueAll: function () {
         this._setAll(true);
      },

      setNullAll: function () {
         this._setAll(null);
      },

      //endregion WS.Data/Types/IFlags

      //region WS.Data/Entity/IProducible

      produceInstance: function(data, options) {
         return new this.constructor({
            dictionary:  this._getDictionaryByFormat(options.format),
            values: data
         });
      },

      //endregion WS.Data/Entity/IProducible

      //region WS.Data/Entity/IEquatable

      isEqual: function(to) {
         if (!(to instanceof Flags)) {
            return false;
         }

         if (!Dictionary.prototype.isEqual.call(this, to)) {
            return false;
         }

         var enumerator = this.getEnumerator(),
            key;
         while (enumerator.moveNext()) {
            key = enumerator.getCurrent();
            if (this.get(key) !== to.get(key)) {
               return false;
            }
         }

         return true;
      },

      //endregion WS.Data/Entity/IEquatable

      //region Public methods

      toString: function() {
         return '[' + CollectionHelpers.map(this._$values, function(value) {
            return value === null ? 'null' : value;
         }).join(',') + ']';
      },

      //endregion Public methods

      //region Protected methods

      _prepareValue: function (value) {
         return value === null || value === undefined ? null : !!value;
      },

      _setAll: function (value) {
         var dictionary = this._$dictionary,
            values = this._$values,
            enumerator = this.getEnumerator(),
            realIndex = 0;
         while (enumerator.moveNext()) {
            var dictionaryIndex = enumerator.getCurrentIndex();
            if (values[realIndex] !== value) {
               values[realIndex] = value;
               this._notifyChange(dictionary[dictionaryIndex], dictionaryIndex, value);
            }
            realIndex++;
         }
      },

      /**
       * Уведомляет об изменении
       * @param {String} name Имя флага
       * @param {Number} index Изменившийся индекс
       * @param {String} value Значение в индексе
       * @protected
       */
      _notifyChange: function(name, index, value) {
         this._childChanged({
            name: name,
            index: index,
            value: value
         });
         this._notify('onChange', name, index, value);
      }

      //endregion Protected methods
   });

   Di.register('types.$flags', Flags, {instantiate: false});
   Di.register('types.flags', Flags);
   Di.register('data.types.flags', Flags);//deprecated

   CoreContext.registerFieldType(new ContextFieldFlags(Flags));

   return Flags;
});
