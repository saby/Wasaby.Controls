/* global define */
define('js!WS.Data/Format/Format', [
   'js!WS.Data/Collection/List',
   'Core/core-instance'
], function (
   List,
   CoreInstance
) {
   'use strict';

   /**
    * Формат полей.
    * Представляет собой список полей записи: WS.Data/Collection/List.<WS.Data/Format/Field>
    * @class WS.Data/Format/Format
    * @extends WS.Data/Collection/List
    * @public
    * @author Мальцев Алексей
    */

   var Format = List.extend(/** @lends WS.Data/Format/Format.prototype */{
      _moduleName: 'WS.Data/Format/Format',

      /**
       * @cfg {Array.<WS.Data/Format/Field>} Элементы списка
       * @name WS.Data/Format/Format#items
       */

      constructor: function $Format(options) {
         Format.superclass.constructor.call(this, options);
         for (var i = 0, len = this._$items.length; i < len; i++) {
            this._checkItem(this._$items[i]);
            this._checkName(this._$items[i], i);
         }
      },

      //region WS.Data/Collection/List

      add: function (item, at) {
         this._checkItem(item);
         this._checkName(item);
         Format.superclass.add.call(this, item, at);
      },

      remove: function (item) {
         this._checkItem(item);
         return Format.superclass.remove.call(this, item);
      },

      replace: function (item, at) {
         this._checkItem(item);
         this._checkName(item, at);
         Format.superclass.replace.call(this, item, at);
      },

      assign: function (items) {
         var i, len;
         items = this._itemsToArray(items);
         for (i = 0, len = items.length; i < len; i++) {
            this._checkItem(items[i]);
         }
         Format.superclass.assign.call(this, items);
         for (i = 0, len = this._$items.length; i < len; i++) {
            this._checkName(this._$items[i], i);
         }
      },

      append: function (items) {
         items = this._itemsToArray(items);
         for (var i = 0, len = items.length; i < len; i++) {
            this._checkItem(items[i]);
            this._checkName(items[i]);
         }
         Format.superclass.append.call(this, items);
      },

      prepend: function (items) {
         items = this._itemsToArray(items);
         for (var i = 0, len = items.length; i < len; i++) {
            this._checkItem(items[i]);
            this._checkName(items[i]);
         }
         Format.superclass.prepend.call(this, items);
      },

      //endregion WS.Data/Collection/List

      //region WS.Data/Entity/IEquatable

      isEqual: function (format) {
         if (format === this) {
            return true;
         }
         if (!format) {
            return false;
         }
         if (!(format instanceof Format)) {
            return false;
         }
         if (this.getCount() !== format.getCount()) {
            return false;
         }
         for (var i = 0, count = this.getCount(); i < count; i++) {
            if (!this.at(i).isEqual(format.at(i))) {
               return false;
            }
         }
         return true;
      },

      //endregion WS.Data/Entity/IEquatable

      //region Public methods

      /**
       * Удаляет поле из формата по имени.
       * Если поля с таким именем нет, генерирует исключение.
       * @param {String} name Имя поля
       */
      removeField: function (name) {
         var index = this.getIndexByValue('name', name);
         if (index === -1) {
            throw new ReferenceError(this._moduleName + '::removeField(): field "' + name + '" is not found');
         }
         this.removeAt(index);
      },

      /**
       * Возвращает индекс поля по его имени.
       * Если поля с таким именем нет, возвращает -1.
       * @param {String} name Имя поля
       * @return {Number}
       */
      getFieldIndex: function (name) {
         return this.getIndexByValue('name', name);
      },

      /**
       * Возвращает имя поля по его индексу.
       * Если индекс выходит за допустимый диапазон, генерирует исключение.
       * @param {Number} at Имя поля
       * @return {String}
       */
      getFieldName: function (at) {
         return this.at(at).getName();
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Проверяет, что переданный элемент - формат поля
       * @protected
       */
      _checkItem: function (item) {
         if(!item || !CoreInstance.instanceOfModule(item, 'WS.Data/Format/Field')) {
            throw new TypeError('Item should be an instance of WS.Data/Format/Field');
         }
      },

      /**
       * Проверяет, что формат поля не дублирует уже существующее имя поля
       * @protected
       */
      _checkName: function (item, at) {
         var exists = this.getFieldIndex(item.getName());
         if(exists > -1 && exists !== at) {
            throw new ReferenceError(this._moduleName + ': field with name "' + item.getName() + '" already exists');
         }
      }

      //endregion Protected methods

   });

   return Format;
});
