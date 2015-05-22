/**
 * Created by as.manuylov on 10.11.14.
 */
define('js!SBIS3.CONTROLS.Record', [], function () {
   'use strict';

   /**
    * Обертка для данных
    * @author Мануйлов Андрей
    * @public
    */

   return $ws.core.extend({}, {
      $protected: {
         _cid: null, //клиентский идентификатор
         _isDeleted: false,
         _isChanged: false,
         _keyField: null,
         _raw: null,
         _strategy: null,
         _onChangeHandler: null
      },

      $constructor: function (cfg) {
         this._strategy = cfg.strategy;
         this._raw = cfg.raw;
         this._onChangeHandler = cfg.onChangeHandler;
         this._keyField = cfg.keyField || null;
         this._cid = $ws.helpers.randomId('c');
      },

      /**
       * Объединяет запись с данными и состоянием другой записи
       * @param {SBIS3.CONTROLS.Record} record Запись, с которой следует объединиться
       * @returns {SBIS3.CONTROLS.Record}
       */
      merge: function (record) {
         //FIXME: сейчас стратегии должны быть одинаковы. Сделать объединение _raw через стратегии.
         $ws.core.merge(this._raw, record.getRaw());
         this._isDeleted = record.getMarkDeleted();
         this._isChanged = record.getMarkChanged();
         //this._keyField = record._keyField;

         return this;
      },

      /**
       * Обновляет запись в источнике данных.
       * @param (SBIS3.CONTROLS.IDataSource) dataSource Источник данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения.
       * @see {SBIS3.CONTROLS.IDataSource#update}
       */
      update: function (dataSource) {
         return dataSource.update(this);
      },

      /**
       * Получить значение по наименованию поля
       * @param {String} field
       * @returns {*}
       */
      get: function (field) {
         // с данными можем работать только через стратегию
         return this._strategy.value(this._raw, field);
      },

      /**
       * Установить значение поля записи
       * @param {String} field название поля
       * @param value новое значение
       */
      set: function (field, value) {
         // с данными можем работать только через стратегию
         this._raw = this._strategy.setValue(this._raw, field, value);
         this._isChanged = true;
         if (this._isChanged && this._onChangeHandler) {
            this._onChangeHandler(this);
         }
      },

      /**
       * Получить тип поля по наименованию
       * @param {String} field
       * @returns {*}
       */
      getType: function(field){
         return field ? this._strategy.type(this._raw, field)  : '';
      },

      toggleStateDeleted: function () {
         if (arguments[0] === undefined) {
            this._isDeleted = !this._isDeleted;
         }
         else if (typeof arguments[0] == 'boolean') {
            this._isDeleted = arguments[0];
         }
      },

      getMarkDeleted: function () {
         return this._isDeleted;
      },

      getMarkChanged: function () {
         return this._isChanged;
      },

      getMarkStatus: function () {
         if (this._isDeleted) {
            return 'deleted';
         }
         if (this._isChanged) {
            return 'changed';
         }
         return 'normal';
      },

      getKey: function () {
         var key = this.get(this._keyField);
         // потому что БЛ возвращает массив для идентификатора
         if (key instanceof Array) {
            return key[0];
         }
         return key;
      },

      /**
       * Получить исходные "сырые" данные для записи
       * @returns {Object}
       */
      getRaw: function () {
         return this._raw;
      }

   });
});