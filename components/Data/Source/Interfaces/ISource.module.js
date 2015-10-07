/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.ISource', [
], function () {
   'use strict';

   /**
    * Интерфейс источника данных
    * @mixin SBIS3.CONTROLS.Data.Source.ISource
    * @public
    * @author Мальцев Алексей
    */

   return /** @lends SBIS3.CONTROLS.Data.Source.ISource.prototype */{
      $protected: {
         _options: {
            /**
             * @cfg {String} Ресурс, с которым работает источник (имя таблицы, объекта, файла, URL, path и т.п.)
             */
            resource: '',

            /**
             * @cfg {SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными
             */
            adapter: undefined,

            /**
             * @cfg {Function} Конструктор модели
             */
            model: undefined,

            /**
             * @cfg {String} Поле модели, содержащее первичный ключ
             */
            modelIdField: ''
         }
      },

      /**
       * Возвращает адаптер для работы с данными
       * @returns {SBIS3.CONTROLS.Data.Adapter.IAdapter}
       */
      getAdapter: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает адаптер для работы с данными
       * @param {SBIS3.CONTROLS.Data.Adapter.IAdapter} adapter
       */
      setAdapter: function (adapter) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает конструктор модели
       * @returns {Function}
       */
      getModel: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает конструктор модели
       * @param {Function} model
       */
      setModel: function (model) {
         throw new Error('Method must be implemented');
      },

      /**
       * Возвращает поле модели, содержащее первичный ключ
       * @returns {String}
       */
      getModelIdField: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Устанавливает поле модели, содержащее первичный ключ
       * @param {String} name
       */
      setModelIdField: function (name) {
         throw new Error('Method must be implemented');
      },

      /**
       * Создает пустую модель через источник данных
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет инстанс модели.
       * @example
       * <pre>
       *     var dataSource = new SbisService({
       *         resource: 'Сотрудник'
       *     });
       *     dataSource.create().addCallback(function(model) {
       *         var name = model.get('Имя');
       *     });
       * </pre>
       */
      create: function () {
         throw new Error('Method must be implemented');
      },

      /**
       * Читает модель из источника данных
       * @param {String} key Первичный ключ модели
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет инстанс модели.
       */
      read: function (key) {
         throw new Error('Method must be implemented');
      },

      /**
       * Обновляет модель в источнике данных
       * @param {*} model Обновляемая модель
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения
       */
      update: function (model) {
         throw new Error('Method must be implemented');
      },

      /**
       * Удаляет модель из источника данных
       * @param {String} key Первичный ключ модели
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения
       */
      destroy: function (key) {
         throw new Error('Method must be implemented');
      },

      /**
       * Выполняет запрос на выборку
       * @param {SBIS3.CONTROLS.Data.Query.Query} query Запрос
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет SBIS3.CONTROLS.Data.Source.DataSet.
       */
      query: function (query) {
         throw new Error('Method must be implemented');
      },

      /**
       * Выполняет команду
       * @param {String} command Команда
       * @param {Object} data Данные
       * @param {Object} condition Условие
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет SBIS3.CONTROLS.Data.Source.DataSet.
       */
      call: function (command, data, condition) {
         throw new Error('Method must be implemented');
      }
   };
});
