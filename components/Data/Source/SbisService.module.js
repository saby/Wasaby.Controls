/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.SbisService', [
   'js!SBIS3.CONTROLS.Data.Source.Rpc',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Query.Query',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic'
], function (Rpc, DataSet, Query, Di) {
   'use strict';

   /**
    * Источник данных на сервисах БЛ СБиС
    * @class SBIS3.CONTROLS.Data.Source.SbisService
    * @extends SBIS3.CONTROLS.Data.Source.Rpc
    * @public
    * @author Мальцев Алексей
    * @example
    * <pre>
    *    var dataSource = new SbisService({
    *       resource: 'СообщениеОтКлиента',
    *    });
    * </pre>
    * <pre>
    *    var dataSource = new SbisService({
    *       resource: 'СообщениеОтКлиента',
    *       idProperty: '@СообщениеОтКлиента',
    *       queryMethodName: 'СписокОбщий',
    *       formatMethodName: 'Список'
    *       readMethodName: 'Прочитать'
    *    });
    * </pre>
    */

   var SbisService = Rpc.extend(/** @lends SBIS3.CONTROLS.Data.Source.SbisService.prototype */{
      _moduleName: 'SBIS3.CONTROLS.Data.Source.SbisService',
      $protected: {
         _options: {
            /**
             * @typedef {Object} ResourceConfig
             * @property {String} name Имя объекта бизнес-логики
             * @property {Object} [serviceUrl] Точка входа
             */

            /**
             * @cfg {String|ResourceConfig} Имя объекта бизнес-логики или его параметры
             * @name {SBIS3.CONTROLS.Data.Source.SbisService#resource}
             * @see getResource
             * <pre>
             *    var dataSource = new SbisService({
             *       resource: 'СообщениеОтКлиента',
             *    });
             * </pre>
             */

            /**
             * @cfg {String|SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными, по умолчанию {@link SBIS3.CONTROLS.Data.Adapter.Sbis}
             * @see SBIS3.CONTROLS.Data.Source.ISource#adapter
             * @see getAdapter
             * @see setAdapter
             * @see SBIS3.CONTROLS.Data.Adapter.Sbis
             * @see SBIS3.CONTROLS.Data.Di
             */
            adapter: 'adapter.sbis',

            /**
             * @cfg {String|SBIS3.CONTROLS.Data.Source.Provider.IRpc} Объект, реализующий сетевой протокол для обмена в режиме клиент-сервер, по умолчанию {@link SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic}
             * @see SBIS3.CONTROLS.Data.Source.Rpc#provider
             * @see getProvider
             * @see SBIS3.CONTROLS.Data.Di
             * @example
             * <pre>
             *    var dataSource = new SbisService({
             *       resource: 'Сотрудник',
             *       provider: 'source.provider.sbis-plugin'
             *    });
             * </pre>
             * @example
             * <pre>
             *    var dataSource = new SbisService({
             *       resource: 'Сотрудник',
             *       provider: new SbisPluginProvider()
             *    });
             * </pre>
             */
            provider: 'source.provider.sbis-business-logic',

            /**
             * @cfg {String} Имя метода, который используется для получения выборки. По умолчанию 'Список'.
             * @see SBIS3.CONTROLS.Data.Source.Rpc#queryMethodName
             */
            queryMethodName: 'Список',

            /**
             * @cfg {String} Имя метода, который используется для создания записи. По умолчанию 'Создать'.
             * @see SBIS3.CONTROLS.Data.Source.Rpc#createMethodName
             */
            createMethodName: 'Создать',

            /**
             * @cfg {String} Имя метода, который используется для чтения записи. По умолчанию 'Прочитать'.
             * @see SBIS3.CONTROLS.Data.Source.Rpc#readMethodName
             */
            readMethodName: 'Прочитать',

            /**
             * @cfg {String} Имя метода, который используется для обновления записи. По умолчанию 'Записать'.
             * @see SBIS3.CONTROLS.Data.Source.Rpc#updateMethodName
             */
            updateMethodName: 'Записать',

            /**
             * @cfg {String} Имя метода, который используется для удаления записи . По умолчанию 'Удалить'.
             * @see SBIS3.CONTROLS.Data.Source.Rpc#destroyMethodName
             */
            destroyMethodName: 'Удалить',

            /**
             * @cfg {String} Имя метода, который будет вызываться для копирования записей. По умолчанию 'Копировать'.
             * @see SBIS3.CONTROLS.Data.Source.Rpc#copyMethodName
             */
            copyMethodName: 'Копировать',

            /**
             * @cfg {String} Имя метода, который будет вызываться для объединения записей. По умолчанию 'Объединить'.
             * @see SBIS3.CONTROLS.Data.Source.Rpc#mergeMethodName
             */
            mergeMethodName: 'Объединить',

            /**
             * @cfg {String} Имя метода, который будет использоваться для получения формата записи в методах {@link create}, {@link read} и {@link copy}. Метод должен быть декларативным.
             * @example
             * <pre>
             *    <option name="formatMethodName">СписокДляПрочитать</option>
             * </pre>
             * @see getFormatMethodName
             * @see setFormatMethodName
             * @see create
             * @see read
             * @see copy
             */
            formatMethodName: undefined
         },

         /**
          * @var {SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic} Объект, который умеет ходить на бизнес-логику, для смены порядковых номеров
          */
         _orderProvider: undefined
      },

      $constructor: function(cfg) {
         cfg = cfg || {};
         if ('strategy' in cfg && !('adapter' in cfg)) {
            this._options.adapter = cfg.strategy;
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Collection.RecordSet', 'option "strategy" is deprecated and will be removed in 3.7.4. Use "adapter" instead.');
         }
         if ('keyField' in cfg && !('idProperty' in cfg)) {
            this._options.idProperty = cfg.keyField;
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Collection.RecordSet', 'option "keyField" is deprecated and will be removed in 3.7.4. Use "idProperty" instead.');
         }
         if ('service' in cfg && !cfg.resource) {
            this._options.resource = cfg.resource = cfg.service;
         }

         if (this._options.resource && typeof this._options.resource !== 'object') {
            this._options.resource = {
               name: this._options.resource
            };
         }

      },

      //region SBIS3.CONTROLS.Data.Source.ISource

      /**
       * Возвращает название объекта бизнес логики, с которым работает источник данных
       * @returns {String}
       * @see resource
       */
      getResource: function () {
         return this._options.resource.name;
      },

      /**
       * Создает пустую модель через источник данных
       * @param {Object|SBIS3.CONTROLS.Data.Model} [meta] Дополнительные мета данные
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет {@link SBIS3.CONTROLS.Data.Model}.
       * @see SBIS3.CONTROLS.Data.Source.ISource#create
       * @example
       * <pre>
       *     var dataSource = new SbisService({
       *         resource: 'Сотрудник'
       *         formatMethodName: 'СписокДляПрочитать'
       *     });
       *     dataSource.create().addCallback(function(model) {
       *         var name = model.get('Имя');
       *     });
       * </pre>
       */
      create: function(meta) {
         //TODO: вместо 'ИмяМетода' может передаваться 'Расширение'
         var args = {
            'Фильтр': this.getAdapter().serialize(meta || {
               'ВызовИзБраузера': true
            }),
            'ИмяМетода': this._options.formatMethodName || null
         };

         return this.getProvider().call(
            this._options.createMethodName,
            args
         ).addCallbacks((function (data) {
            return this._getModelInstance(data);
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::create()', error);
            return new Error('Cannot invoke create method');
         });
      },

      /**
       * Читает модель из источника данных
       * @param {String} key Первичный ключ модели
       * @param {Object|SBIS3.CONTROLS.Data.Model} [meta] Дополнительные мета данные
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет {@link SBIS3.CONTROLS.Data.Model}.
       * @see SBIS3.CONTROLS.Data.Source.ISource#read
       */
      read: function(key, meta) {
         var args = {
            'ИдО': key,
            'ИмяМетода': this._options.formatMethodName || null
         };
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = this.getAdapter().serialize(meta);
         }

         return this.getProvider().call(
            this._options.readMethodName,
            args
         ).addCallbacks((function (data) {
            var model = this._getModelInstance(data, true);
            model.setStored(true);
            return model;
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::read()', error);
            return error;
         });
      },

      /**
       * Обновляет модель в источнике данных
       * @param {SBIS3.CONTROLS.Data.Model} model Обновляемая модель
       * @param {Object|SBIS3.CONTROLS.Data.Model} [meta] Дополнительные мета данные
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения
       * @see SBIS3.CONTROLS.Data.Source.ISource#update
       */
      update: function(model, meta) {
         var args = {
            'Запись': this.getAdapter().serialize(model)
         };
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = this.getAdapter().serialize(meta);
         }

         return this.getProvider().call(
            this._options.updateMethodName,
            args
         ).addCallbacks((function (key) {
            if (key && !model.isStored() && this.getIdProperty()) {
               model.set(this.getIdProperty(), key);
            }
            model.setStored(true);
            model.applyChanges();
            return key;
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::update()', error);
            return error;
         });
      },

      /**
       * Удаляет модель из источника данных
       * @param {String} keys Первичный ключ модели
       * @param {Object|SBIS3.CONTROLS.Data.Model} [meta] Дополнительные мета данные
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения
       * @see SBIS3.CONTROLS.Data.Source.ISource#destroy
       */
      destroy: function(keys, meta) {
         if ($ws.helpers.type(keys) !== 'array') {
            keys = [keys];
         }
         /*В ключе может содержаться ссылка на объект бл
          сгруппируем ключи по соответсвующим им объектам*/
         var groups = {},
            providerName;
         for (var i = 0, len = keys.length; i < len; i++) {
            providerName = this._getProviderNameById(keys[i]);
            groups[providerName] = groups[providerName] || [];
            groups[providerName].push(String.prototype.split.call(keys[i],',')[0]);
         }
         var pd = new $ws.proto.ParallelDeferred();
         for (providerName in groups) {
            if (groups.hasOwnProperty(providerName)) {
               pd.push(this._destroy(
                  groups[providerName],
                  providerName,
                  meta
               ));
            }
         }
         return pd.done().getResult();
      },

      merge: function(first, second) {
         return this.getProvider().call(
            this._options.mergeMethodName, {
               'ИдО' : first,
               'ИдОУд': second
            }
         ).addCallbacks(function (res) {
               return res;
            }, function (error) {
               $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::merge()', error);
               return error;
            });
      },

      copy: function(key, meta) {
         var args = {
            'ИдО': key,
            'ИмяМетода': this._options.formatMethodName
         };
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = this.getAdapter().serialize(meta);
         }

         return this.getProvider().call(
            this._options.copyMethodName,
            args
         ).addCallbacks(function (res) {
               return res;
            }, function (error) {
               $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::copy()', error);
               return error;
            });
      },

      query: function(query) {
         return this.getProvider().call(
            this._options.queryMethodName, {
               'Фильтр': !query || Object.isEmpty(query.getWhere()) ? null : this.getAdapter().serialize(query.getWhere()),
               'Сортировка': this.getAdapter().serialize(this._getSortingParams(query)),
               'Навигация': this.getAdapter().serialize(this._getPagingParams(query)),
               'ДопПоля': !query || Object.isEmpty(query.getMeta()) ? [] : this.getAdapter().serialize(query.getMeta())
            }
         ).addCallbacks((function (res) {
            return this._getDataSetInstance({
               rawData: res,
               totalProperty: 'n'
            });
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::query()', error);
            return error;
         });
      },

      call: function (command, data) {
         return this.getProvider().call(
            command,
            this._serializeArguments(data)
         ).addCallbacks((function (res) {
            return this._getDataSetInstance({
               rawData: res,
               totalProperty: 'n'
            });
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::call()', error);
            return error;
         });
      },

      //endregion SBIS3.CONTROLS.Data.Source.ISource

      //region Protected methods

      /**
       * Сериализует все аргументы запроса
       * @param {*} args Аргументы запроса
       * @returns {*}
       * @private
       */
      _serializeArguments: function (args) {
         var result;
         if (args instanceof Object) {
            if (
               $ws.helpers.instanceOfModule(args, 'SBIS3.CONTROLS.Data.Model') ||
               $ws.helpers.instanceOfModule(args, 'SBIS3.CONTROLS.Record') ||
               $ws.helpers.instanceOfModule(args, 'SBIS3.CONTROLS.Data.Source.DataSet') ||
               $ws.helpers.instanceOfModule(args, 'SBIS3.CONTROLS.DataSet')
            ) {
               result = this.getAdapter().serialize(args);
            } else {
               result = {};
               for (var key in args) {
                  if (args.hasOwnProperty(key)) {
                     result[key] = this.getAdapter().serialize(args[key]);
                  }
               }
            }
         } else {
            result = this.getAdapter().serialize(args);
         }
         return result;
      },

      /**
       * Возвращает параметры сортировки
       * @param {SBIS3.CONTROLS.Data.Query.Query} query Запрос
       * @returns {Array|null}
       * @private
       */
      _getSortingParams: function (query) {
         if (!query) {
            return null;
         }
         var orders = query.getOrderBy();
         if (orders.length === 0) {
            return null;
         }
         var sort = [],
             order;
         sort._type = 'recordset';
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
         if (!query) {
            return null;
         }
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
      },


      /**
       * Возвращает имя объекта бл из сложного идентификатора или имя объекта из источника, для простых идентификаторов
       * @private
       * @param id - Идентификатор записи
       * @returns {String}
       */
      _getProviderNameById: function (id) {
         if (String(id).indexOf(',') !== -1) {
            var ido = String(id).split(',');
            return ido[1];
         }
         return this._options.resource.name;
      },
      /**
       * вызвает метод удаления
       * @param {String|Array} id Идентификатор объекта
       * @param {String} BLObjName  Название объекта бл у которго будет вызвано удаление
       * @param {Object} meta  Дополнительные мета данные
       * @returns {$ws.proto.Deferred}
       * @private
       */
      _destroy: function(id, BLObjName, meta) {
         var args = {
            'ИдО': id
         };
         if (!Object.isEmpty(meta)) {
            args['ДопПоля'] = this.getAdapter().serialize(meta);
         }
         var provider = this.getProvider();
         if (BLObjName && this._options.resource.name !== BLObjName) {
            provider = Di.resolve('source.provider.sbis-business-logic', {name: BLObjName});
         }
         return provider.call(
            this._options.destroyMethodName,
            args
         ).addCallbacks(function (res) {
            return res;
         }, function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::destroy()', error);
            return error;
         });
      },

      //endregion Protected methods

      //TODO: совместимость с SBIS3.CONTROLS.SbisServiceSource - выплить после перехода на ISource
      //region SBIS3.CONTROLS.SbisServiceSource
      prepareQueryParams : function(filter, sorting, offset, limit, hasMore){
         var preparePagingParam = function (offset, limit, hasMore) {
            var pagingParam = null;
            if (typeof(offset) !== 'undefined' && offset !== null && typeof(limit) !== 'undefined' && limit !== null) {
               var numPage = Math.floor(offset / limit);
               pagingParam = {
                  'd': [
                     numPage,
                     limit,
                     hasMore !== undefined ? hasMore : offset >= 0 //Если offset отрицательный, то грузится последняя страница
                  ],
                  's': [
                     {'n': 'Страница', 't': 'Число целое'},
                     {'n': 'РазмерСтраницы', 't': 'Число целое'},
                     {'n': 'ЕстьЕще', 't': 'Логическое'}
                  ]
               };
            }
            return pagingParam;
         };

         var query = new Query();
         query.where(filter)
            .offset(hasMore === undefined ? offset : hasMore)
            .limit(limit)
            .orderBy(sorting);
         return {
            'Фильтр': !query || Object.isEmpty(query.getWhere()) ? null : this.getAdapter().serialize(query.getWhere()),
            'Сортировка': this.getAdapter().serialize(this._getSortingParams(query)),
            'Навигация': preparePagingParam(offset, limit, hasMore),
            'ДопПоля': !query || Object.isEmpty(query.getMeta()) ? [] : this.getAdapter().serialize(query.getMeta())
         };
      }
      //endregion SBIS3.CONTROLS.SbisServiceSource
   });

   Di.register('source.sbis-service', SbisService);

   return SbisService;
});
