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
             * @cfg {String} Адрес удаленного сервиса, с которым работает источник (хост, путь, название)
             * @name {SBIS3.CONTROLS.Data.Source.SbisService#service}
             * @see getService
             * <pre>
             *    var dataSource = new SbisService({
             *       service: '/service/url/',
             *       resource: 'Сотрудник',
             *    });
             * </pre>
             */

            /**
             * @cfg {String} Имя объекта бизнес-логики
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
            $ws.single.ioc.resolve('ILogger').info('SBIS3.CONTROLS.Data.Source.SbisService', 'option "strategy" is deprecated and will be removed in 3.7.4. Use "adapter" instead.');
         }
         if ('keyField' in cfg && !('idProperty' in cfg)) {
            this._options.idProperty = cfg.keyField;
            $ws.single.ioc.resolve('ILogger').info('SBIS3.CONTROLS.Data.Source.SbisService', 'option "keyField" is deprecated and will be removed in 3.7.4. Use "idProperty" instead.');
         }
         //FIXME: сейчас опция service от Remote пересекается со старыми source-ами, но т.к. Костя все равно хочет по другому назвать, то пока оставляем режим совместимости
         if ('service' in cfg && !('resource' in cfg)) {
            this._options.resource = cfg.service;
            this._options.service = '';
         }
         if (this._options.service && typeof this._options.service === 'object') {
            this._options.resource = this._options.service.name || '';
            this._options.service = this._options.service.serviceUrl || '';
         }
         if (this._options.resource && typeof this._options.resource === 'object') {
            this._options.service = this._options.resource.serviceUrl || '';
            this._options.resource = this._options.resource.name || '';
         }
      },

      //region SBIS3.CONTROLS.Data.Source.ISource

      /**
       * Возвращает название объекта бизнес логики, с которым работает источник данных
       * @returns {String}
       * @see resource
       */
      getResource: function () {
         return this._options.resource;
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
         var adapter = this.getAdapter(),
            args = {
               'Фильтр': meta || this._buildRecord({
                  'ВызовИзБраузера': true
               }),
               'ИмяМетода': this._options.formatMethodName || null
            };

         return this.getProvider().call(
            this._options.createMethodName,
            adapter.serialize(args)
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
         var adapter = this.getAdapter(),
            args = {
               'ИдО': key,
               'ИмяМетода': this._options.formatMethodName || null
            };
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = meta;
         }

         return this.getProvider().call(
            this._options.readMethodName,
            adapter.serialize(args)
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
         var adapter = this.getAdapter(),
            args = {
               'Запись': model
            };
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = meta;
         }

         return this.getProvider().call(
            this._options.updateMethodName,
            adapter.serialize(args)
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
       * @param {String|Array} keys Первичный ключ, или массив первичных ключей модели
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
         var adapter = this.getAdapter();

         return this.getProvider().call(
            this._options.mergeMethodName,
            adapter.serialize({
               'ИдО' : first,
               'ИдОУд': second
            })
         ).addCallbacks(function (res) {
               return res;
            }, function (error) {
               $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::merge()', error);
               return error;
            });
      },

      copy: function(key, meta) {
         var adapter = this.getAdapter(),
            args = {
               'ИдО': key,
               'ИмяМетода': this._options.formatMethodName
            };
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = meta;
         }

         return this.getProvider().call(
            this._options.copyMethodName,
            adapter.serialize(args)
         ).addCallbacks(function (res) {
               return res;
            }, function (error) {
               $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::copy()', error);
               return error;
            });
      },

      query: function(query) {
         var adapter = this.getAdapter(),
            args = {
               'Фильтр': this._buildRecord(query ? query.getWhere() : null),
               'Сортировка': this._buildRecordSet(this._getSortingParams(query)),
               'Навигация': this._buildRecord(this._getPagingParams(query)),
               'ДопПоля': this._getMetaParams(query) || []
            };

         return this.getProvider().call(
            this._options.queryMethodName,
            adapter.serialize(args)
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
         var adapter = this.getAdapter();

         return this.getProvider().call(
            command,
            adapter.serialize(data)
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
       * Возвращает тип значения
       * @param {*} val Значение
       * @returns {String|Object}
       * @protected
       */
      _getValueType: function (val) {
         switch (typeof val) {
            case 'boolean':
               return 'boolean';
            case 'number':
               if (val % 1 === 0) {
                  return 'integer';
               }
               return 'real';
            case 'object':
               if (val === null) {
                  return 'string';
               } else if ($ws.helpers.instanceOfModule(val, 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
                  return 'recordset';
               } else if (val instanceof Date) {
                  return 'datetime';
               } else if (val instanceof Array) {
                  return {
                     type: 'array',
                     kind: getValueType(val[0])
                  };
               } else {
                  return 'record';
               }
               break;
            default:
               return 'string';
         }
      },

      /**
       * Строит запись из объекта
       * @param {Object.<String, *>|SBIS3.CONTROLS.Data.Record} data Данные полей записи
       * @returns {SBIS3.CONTROL.Data.Record|null}
       * @protected
       */
      _buildRecord: function (data) {
         if (data === null) {
            return data;
         }
         if (data && $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Record')) {
            return data;
         }

         var record = this._getModelInstance(null),
            name,
            value,
            field;

         for (name in data) {
            if (data.hasOwnProperty(name)) {
               value = data[name];
               field = this._getValueType(value);
               if (!(field instanceof Object)) {
                  field = {type: field};
               }
               field.name = name;
               record.addField(field, undefined, value);
            }
         }

         return record;
      },

      /**
       * Строит рекодсет из массива
       * @param {Array.<Object.<String, *>>|SBIS3.CONTROLS.Data.Collection.RecordSet} data Данные рекордсета
       * @returns {SBIS3.CONTROLS.Data.Collection.RecordSet|null}
       * @protected
       */
      _buildRecordSet: function (data) {
         if (data === null) {
            return data;
         }
         if (data && $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
            return data;
         }

         var recordset = this._getListInstance(null),
            count = data.length || 0,
            i;

         recordset.setAdapter(this._options.adapter);
         for (i = 0; i < count; i++) {
            recordset.add(this._buildRecord(data[i]));
         }

         return recordset;
      },

      /**
       * Возвращает параметры сортировки
       * @param {SBIS3.CONTROLS.Data.Query.Query} query Запрос
       * @returns {Array|null}
       * @protected
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
       * @protected
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
       * Возвращает мета данные
       * @param {SBIS3.CONTROLS.Data.Query.Query} query Запрос
       * @returns {Object|null}
       * @protected
       */
      _getMetaParams: function (query) {
         return query && !Object.isEmpty(query.getMeta()) ? query.getMeta() : null;
      },

      /**
       * Возвращает имя объекта бл из сложного идентификатора или имя объекта из источника, для простых идентификаторов
       * @param id - Идентификатор записи
       * @returns {String}
       * @protected
       */
      _getProviderNameById: function (id) {
         if (String(id).indexOf(',') !== -1) {
            var ido = String(id).split(',');
            return ido[1];
         }
         return this._options.resource;
      },

      /**
       * вызвает метод удаления
       * @param {String|Array} id Идентификатор объекта
       * @param {String} BLObjName  Название объекта бл у которго будет вызвано удаление
       * @param {Object} meta  Дополнительные мета данные
       * @returns {$ws.proto.Deferred}
       * @protected
       */
      _destroy: function(id, BLObjName, meta) {
         var adapter = this.getAdapter(),
            args = {
               'ИдО': id
            };
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = meta;
         }
         var provider = this.getProvider();
         if (BLObjName && this._options.resource !== BLObjName) {
            provider = Di.resolve('source.provider.sbis-business-logic', {resource: BLObjName});
         }
         return provider.call(
            this._options.destroyMethodName,
            adapter.serialize(args)
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
