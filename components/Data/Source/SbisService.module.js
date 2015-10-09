/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.SbisService', [
   'js!SBIS3.CONTROLS.Data.Source.Base',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'js!SBIS3.CONTROLS.Data.Source.SbisService/resources/SbisServiceBLO'
], function (Base, DataSet, SbisAdapter, SbisServiceBLO) {
   'use strict';

   /**
    * Хранилище данных на сервисах БЛ СБиС
    * @class SBIS3.CONTROLS.Data.Source.SbisService
    * @extends SBIS3.CONTROLS.Data.Source.Base
    * @public
    * @author Мальцев Алексей
    * @example
    * <pre>
    *     var dataSource = new SbisService({
    *         resource: 'СообщениеОтКлиента',
    *         modelIdField: '@СообщениеОтКлиента',
    *         queryMethodName: 'СписокОбщий',
    *         formatForRead: 'СообщениеОтКлиента.Список'
    *         readMethodName: 'Прочитать'
    *     });
    * </pre>
    */

   return Base.extend(/** @lends SBIS3.CONTROLS.Data.Source.SbisService.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Source.SbisService',
      $protected: {
         _options: {
            /**
             * @cfg {String|Object} Название|параметры объекта бизнес-логики
             */
            resource: '',

            /**
             * @cfg {String} Поле модели, содержащее первичный ключ
             */
            modelIdField: 'Ид',

            /**
             * @cfg {SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными, по умолчанию SBIS3.CONTROLS.Data.Adapter.Sbis
             */
            adapter: undefined,

            /**
             * @cfg {String} Имя метода, который используется для получения выборки. По умолчанию 'Список'.
             * @see query
             */
            queryMethodName: 'Список',

            /**
             * @cfg {String} Имя метода, который используется для создания записи. По умолчанию 'Создать'.
             * @see create
             */
            createMethodName: 'Создать',

            /**
             * @cfg {String} Имя метода, который используется для чтения записи. По умолчанию 'Прочитать'.
             * @see read
             */
            readMethodName: 'Прочитать',

            /**
             * @cfg {String} Имя метода, который используется для обновления записи. По умолчанию 'Записать'.
             * @see update
             */
            updateMethodName: 'Записать',

            /**
             * @cfg {String} Имя метода, который используется для удаления записи . По умолчанию 'Удалить'.
             * @see destroy
             */
            destroyMethodName: 'Удалить',
            /**
             * @cfg {String} Имя метода, который будет использоваться для получения формата записи в методе прочитать. Метод должен быть декларативным.
             * @example
             * <pre>
             *    <option name="formatForRead">МойОбъект.СписокДляПрочитать</option>
             * </pre>
             * @see destroy
             */
            formatForRead: undefined
         },

         /**
          * @cfg {SBIS3.CONTROLS.SbisServiceSource/resources/SbisServiceBLO} Объект, который умеет ходить на бизнес-логику
          */
         _provider: undefined
      },

      $constructor: function (cfg) {
         this._options.adapter = cfg.adapter || new SbisAdapter();
         this._provider = new SbisServiceBLO(typeof this._options.resource === 'string' ? {
            name: this._options.resource
         } : this._options.resource);
      },

      //region SBIS3.CONTROLS.Data.Source.ISource

      create: function () {
         return this._provider.callMethod(
            this._options.createMethodName,
            SbisAdapter.serialize({
               'Фильтр': {
                  'ВызовИзБраузера': true
               },
               'ИмяМетода': null
            })
         ).addCallbacks((function (data) {
            return this._getModelInstance(data);
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::create()', error);
            return new Error('Cannot invoke create method');
         });
      },

      read: function (key) {
         return this._provider.callMethod(
            this._options.readMethodName, {
               'ИдО': key,
               'ИмяМетода': this._options.formatForRead
            }
         ).addCallbacks((function (data) {
            var model = this._getModelInstance(data, true);
            model.setStored(true);
            return model;
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::read()', error);
            return new Error('Cannot invoke read method');
         });
      },

      update: function (model) {
         return this._provider.callMethod(
            this._options.updateMethodName, {
               'Запись': $ws.core.merge({
                  _type: 'record'
               }, model.getData())
            }
         ).addCallbacks((function (key) {
            if (!model.isStored()) {
               model.set(this._options.modelIdField, key);
            }
            model.setStored(true);
            return key;
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::update()', error);
            return new Error('Cannot invoke update method');
         });
      },

      destroy: function (key) {
         return this._provider.callMethod(
            this._options.destroyMethodName, {
               'ИдО': key
            }
         ).addCallbacks(function (res) {
            return res;
         }, function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::destroy()', error);
            return new Error('Cannot invoke destroy method');
         });
      },

      query: function (query) {
         var args = SbisAdapter.serialize({
            'Фильтр': query.getWhere(),
            'Сортировка': this._getSortingParams(query),
            'Навигация': this._getPagingParams(query)
         });
         args['ДопПоля'] = [];
         return this._provider.callMethod(
            this._options.queryMethodName,
            args
         ).addCallbacks((function (res) {
            return new DataSet({
               source: this,
               data: res,
               totalProperty: 'n'
            });
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::query()', error);
            return new Error('Cannot invoke query method');
         });
      },

      call: function (command, data, condition) {
         return this._provider.callMethod(
            command,
            SbisAdapter.serialize(data)
         ).addCallbacks((function (res) {
            return new DataSet({
               source: this,
               data: res
            });
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::call()', error);
            return new Error('Cannot invoke call method');
         });
      },

      //endregion SBIS3.CONTROLS.Data.Source.ISource

      //region Public methods

      /**
       * Возвращает имя метода, который используется для получения выборки
       * @returns {String}
       */
      getQueryMethodName: function () {
         return this._options.queryMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для получения выборки
       * @param {String} method
       */
      setQueryMethodName: function (method) {
         this._options.queryMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для создания записи
       * @returns {String}
       */
      getCreateMethodName: function () {
         return this._options.createMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для создания записи
       * @param {String} method
       */
      setCreateMethodName: function (method) {
         this._options.createMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для получения записи
       * @returns {String}
       */
      getReadMethodName: function () {
         return this._options.readMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для получения записи
       * @param {String} method
       */
      setReadMethodName: function (method) {
         this._options.readMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для обновления записи
       * @returns {String}
       */
      getUpdateMethodName: function () {
         return this._options.updateMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для обновления записи
       * @param {String} method
       */
      setUpdateMethodName: function (method) {
         this._options.updateMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для удаления записи
       * @returns {String}
       */
      getDestroyMethodName: function () {
         return this._options.destroyMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для удаления записи
       * @param {String} method
       */
      setDestroyMethodName: function (method) {
         this._options.destroyMethodName = method;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает параметры сортировки
       * @param {SBIS3.CONTROLS.Data.Query.Query} query Запрос
       * @returns {Object|null}
       * @private
       */
      _getSortingParams: function (query) {
         var orders = query.getOrderBy();
         if (orders.length === 0) {
            return null;
         }
         var sort = [],
             order;
         for (var i = 0; i < orders.length; i++) {
            order = orders[i];
            sort.push({
               n: order.getSelector(),
               o: order.getOrder(),
               l: !order.getOrder()
            });
         }
         return sort;
      },

      /**
       * Возвращает параметры навигации
       * @param {SBIS3.CONTROLS.Data.Query.Query} query Запрос
       * @returns {Object|null}
       * @private
       */
      _getPagingParams: function (query) {
         var offset = query.getOffset(),
            limit = query.getLimit();

         if (offset === 0 && limit === undefined) {
            return null;
         }
         return {
            'Страница': limit > 0 ? Math.floor(offset / limit) : 0,
            'РазмерСтраницы': limit,
            'ЕстьЕще': offset >= 0
         };
      }

      //endregion Protected methods
   });
});
