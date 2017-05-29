/* global define */
define('js!WS.Data/Adapter/CowTable', [
   'js!WS.Data/Entity/Abstract',
   'js!WS.Data/Adapter/ITable',
   'js!WS.Data/Adapter/IDecorator',
   'js!WS.Data/Utils'
], function (
   Abstract,
   ITable,
   IDecorator,
   Utils
) {
   'use strict';

   /**
    * Адаптер таблицы для работы в режиме Copy-on-write.
    * @class WS.Data/Adapter/CowTable
    * @extends WS.Data/Entity/Abstract
    * @implements WS.Data/Adapter/ITable
    * @implements WS.Data/Adapter/IDecorator
    * @author Мальцев Алексей
    */

   var CowTable = Abstract.extend([ITable, IDecorator], /** @lends WS.Data/Adapter/CowTable.prototype */{
      _moduleName: 'WS.Data/Adapter/CowTable',

      /**
       * @member {WS.Data/Adapter/IAdapter} Оригинальный адаптер
       */
      _original: null,

      /**
       * @member {WS.Data/Adapter/ITable} Оригинальный адаптер таблицы
       */
      _originalTable: null,

      /**
       * @member {Boolean} Сырые данные были скопированы
       */
      _copied: false,

      /**
       * Конструктор
       * @param {*} data Сырые данные
       * @param {WS.Data/Adapter/IAdapter} original Оригинальный адаптер
       */
      constructor: function $CowTable(data, original) {
         CowTable.superclass.constructor.call(this);
         this._original = original;
         this._originalTable = original.forTable(data);
      },

      //region WS.Data/Adapter/ITable

      getFields: function () {
         return this._originalTable.getFields();
      },

      getCount: function () {
         return this._originalTable.getCount();
      },

      getData: function () {
         return this._originalTable.getData();
      },

      add: function (record, at) {
         this._copy();
         return this._originalTable.add(record, at);
      },

      at: function (index) {
         return this._originalTable.at(index);
      },

      remove: function (at) {
         this._copy();
         return this._originalTable.remove(at);
      },

      replace: function (record, at) {
         this._copy();
         return this._originalTable.replace(record, at);
      },

      move: function(source, target) {
         this._copy();
         return this._originalTable.move(source, target);
      },

      merge: function(acceptor, donor, idProperty) {
         this._copy();
         return this._originalTable.merge(acceptor, donor, idProperty);
      },

      copy: function(index) {
         this._copy();
         return this._originalTable.copy(index);
      },

      clear: function () {
         this._copy();
         return this._originalTable.clear();
      },

      getFormat: function (name) {
         return this._originalTable.getFormat(name);
      },

      getSharedFormat: function (name) {
         return this._originalTable.getSharedFormat(name);
      },

      addField: function(format, at) {
         this._copy();
         return this._originalTable.addField(format, at);
      },

      removeField: function(name) {
         this._copy();
         return this._originalTable.removeField(name);
      },

      removeFieldAt: function(index) {
         this._copy();
         return this._originalTable.removeFieldAt(index);
      },

      //endregion WS.Data/Adapter/ITable

      //region WS.Data/Adapter/IDecorator

      getOriginal: function () {
         return this._originalTable;
      },

      //endregion WS.Data/Adapter/IDecorator

      //region Protected methods

      _copy: function () {
         if (!this._copied) {
            var data = this._originalTable.getData();
            this._originalTable = this._original.forTable(
               Utils.clone(
                  data
               )
            );
            //todo Костыль проюрасываем ссылку на s в скопрированные данные что бы сохранилась связь с рекордсетом
            if (data && data.s) {
               this._originalTable.getData().s = data.s
            }
            this._copied = true;
         }
      }

      //endregion Protected methods
   });

   return CowTable;
});
