/* global define */
define('js!WS.Data/Types/Enum', [
   'js!WS.Data/Types/IEnum',
   'js!WS.Data/Types/Dictionary',
   'js!WS.Data/Entity/IProducible',
   'js!WS.Data/Entity/OneToManyMixin',
   'js!WS.Data/ContextField/Enum',
   'js!WS.Data/Entity/SerializableMixin',
   'js!WS.Data/Entity/CloneableMixin',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'Core/Context'
], function (
   IEnum,
   Dictionary,
   IProducible,
   OneToManyMixin,
   ContextFieldEnum,
   SerializableMixin,
   CloneableMixin,
   Di,
   Utils,
   CoreContext
) {
   'use strict';

   /**
    * Тип данных перечисляемое.
    * @class WS.Data/Types/Enum
    * @extends WS.Data/Types/Dictionary
    * @implements WS.Data/Types/IEnum
    * @implements WS.Data/Entity/IProducible
    * @mixes WS.Data/Entity/OneToManyMixin
    * @public
    * @author Ганшнин Ярослав
    */

   var Enum = Dictionary.extend([IEnum, IProducible, OneToManyMixin, SerializableMixin, CloneableMixin],/** @lends WS.Data/Types/Enum.prototype */ {
      _moduleName: 'WS.Data/Types/Enum',
      /**
       * @cfg {Number|Null} Текущее значение
       * @name WS.Data/Types/Enum#index
       */
      _$index: null,

      /**
       * @member Название типа данных для сериализации в сырой вид
       */
      _type: 'enum',

      constructor: function $Enum() {
         Enum.superclass.constructor.apply(this, arguments);
      },

      destroy: function() {
         OneToManyMixin.destroy.call(this);
         Enum.superclass.destroy.call(this);
      },

      //region WS.Data/Types/IEnum

      get: function () {
         return this._$index;
      },

      set: function (index) {
         var value = this._$dictionary[index],
            defined = value !== undefined,
            changed = this._$index !== index;

         if (index === null || defined) {
            this._$index = index;
         } else {
            throw new ReferenceError(this._moduleName + '::set(): the index "' + index + '" is out of range');
         }

         if (changed) {
            this._notifyChange(index, this.getAsValue());
         }

      },

      getAsValue: function() {
         return this._getValue(this._$index);
      },

      setByValue: function (value) {
         var index = this._getIndex(value),
            changed = index !== this._$index;

         if (value === null) {
            this._$index = value;
         } else if (index === undefined) {
            throw new ReferenceError(this._moduleName + '::setByValue(): the value "' + value + '" doesn\'t found in dictionary');
         } else {
            this._$index = index;
         }

         if (changed) {
            this._notifyChange(index, value);
         }
      },

      //endregion WS.Data/Types/IEnum

      //region WS.Data/Entity/IProducible

      produceInstance: function(data, options) {
         return new this.constructor({
            dictionary:  this._getDictionaryByFormat(options.format),
            index: data
         });
      },

      //endregion WS.Data/Entity/IProducible

      //region WS.Data/Entity/IEquatable

      isEqual: function(to) {
         if (!(to instanceof Enum)) {
            return false;
         }

         if (!Dictionary.prototype.isEqual.call(this, to)) {
            return false;
         }

         return this.get() === to.get();
      },

      //endregion WS.Data/Entity/IEquatable

      //region Public methods

      valueOf: function() {
         return this.get();
      },

      toString: function() {
         var value = this.getAsValue();
         return value === undefined || value === null ? '' : value;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Уведомляет об изменении
       * @param {Number} index Изменившийся индекс
       * @param {String} value Значение в индексе
       * @protected
       */
      _notifyChange: function(index, value) {
         this._childChanged({
            index: index,
            value: value
         });
         this._notify('onChange', index, value);
      }

      //endregion Protected methods
   });

   Di.register('types.$enum', Enum, {instantiate: false});
   Di.register('types.enum', Enum);
   Di.register('data.types.enum', Enum);//deprecated

   CoreContext.registerFieldType(new ContextFieldEnum(Enum));

   return Enum;
});
