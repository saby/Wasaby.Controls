/* global define, $ws */
define('js!SBIS3.CONTROLS.Data.Source.SbisService', [
   'js!SBIS3.CONTROLS.Data.Source.Rpc',
   'js!SBIS3.CONTROLS.Data.Source.DataSet',
   'js!SBIS3.CONTROLS.Data.Query.Query',
   'js!SBIS3.CONTROLS.Data.Di',
   'js!SBIS3.CONTROLS.Data.Utils',
   'js!SBIS3.CONTROLS.Data.Adapter.Sbis',
   'js!SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic'
], function (Rpc, DataSet, Query, Di, Utils) {
   'use strict';

   /**
    * Источник данных на сервисах БЛ СБиС
    * @class SBIS3.CONTROLS.Data.Source.SbisService
    * @extends SBIS3.CONTROLS.Data.Source.Rpc
    * @public
    * @ignoreMethods prepareQueryParams
    * @author Мальцев Алексей
    * @example
    * Создаем источник данных для объекта БЛ:
    * <pre>
    *    var dataSource = new SbisService({
    *       endpoint: 'СообщениеОтКлиента',
    *    });
    * </pre>
    * Создаем источник данных для объекта БЛ с указанием своих методов для чтения записи и списка записей, а также свой формат записи:
    * <pre>
    *    var dataSource = new SbisService({
    *       endpoint: 'СообщениеОтКлиента',
    *       binding: {
    *          read: 'Прочитать',
    *          query: 'СписокОбщий',
    *          format: 'Список'
    *       }
    *       idProperty: '@СообщениеОтКлиента'
    *    });
    * </pre>
    */

   var SbisService = Rpc.extend(/** @lends SBIS3.CONTROLS.Data.Source.SbisService.prototype */{
      /**
       * @typedef {Object} Binding
       * @property {String} [create=Создать] Имя метода для создания записи через {@link create}
       * @property {String} [read=Прочитать] Имя метода для чтения записи через {@link read}
       * @property {String} [update=Записать] Имя метода для обновления записи через {@link update}
       * @property {String} [destroy=Удалить] Имя метода для удаления записи через {@link destroy}
       * @property {String} [query=Список] Имя метода для получения списка записей через {@link query}
       * @property {String} [copy=Копировать] Имя метода для копирования записей через {@link copy}
       * @property {String} [merge=Объединить] Имя метода для объединения записей через {@link merge}
       * @property {String} [format] Имя метода для получения формата записи через {@link create}, {@link read} и {@link copy}. Метод должен быть декларативным.
       */

      /**
       * @typedef {Object} MetaConfig
       * @property {String} [hasMore=hasMore] Свойство мета-данных, отвечающий за поле 'ЕстьЕще' параметра 'Навигация' списочного метода
       */

      _moduleName: 'SBIS3.CONTROLS.Data.Source.SbisService',
      $protected: {
         _options: {
            /**
             * @cfg {Endpoint|String} Конечная точка, обеспечивающая доступ клиента к функциональным возможностям источника данных
             * @remark
             * Можно успользовать сокращенную запись, передав значение в виде строки - в этом случае оно будет
             * интерпретироваться как контракт (endpoint.contract)
             * @see getEndPoint
             * @example
             * Подключаем объект БЛ 'Сотрудник', используя сокращенную запись:
             * <pre>
             *    var dataSource = new SbisService({
             *       endpoint: 'Сотрудник'
             *    });
             * </pre>
             * Подключаем объект БЛ 'Сотрудник', используя отдельную точку входа:
             * <pre>
             *    var dataSource = new SbisService({
             *       endpoint: {
             *          address: '/service/',
             *          contract: 'Сотрудник'
             *       }
             *    });
             * </pre>
             */
            endpoint: {},

            /**
             * @cfg {Binding} Соответствие методов CRUD+ методам БЛ.
             * @see getBinding
             * @see setBinding
             * @see create
             * @see read
             * @see destroy
             * @see query
             * @see copy
             * @see merge
             * @example
             * Переопределяем значения по умолчанию для методов create, read и update
             * <pre>
             *    var dataSource = new SbisService({
             *       endpoint: 'Сотрудник',
             *       binding: {
             *          create: 'МойМетодСоздать',
             *          read: 'МойМетодПрочитать',
             *          update: 'МойМетодЗаписать'
             *       }
             *    });
             * </pre>
             */
            binding: {
               create: 'Создать',
               read: 'Прочитать',
               update: 'Записать',
               destroy: 'Удалить',
               query: 'Список',
               copy: 'Копировать',
               merge: 'Объединить'
            },

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
             * Провайдер нотификатора, внедренный через модуль DI:
             * <pre>
             *    var dataSource = new SbisService({
             *       endpoint: 'Сотрудник',
             *       provider: 'source.provider.sbis-plugin'
             *    });
             * </pre>
             * Провайдер нотификатора, внедренный в виде готового экземпляра:
             * <pre>
             *    var dataSource = new SbisService({
             *       endpoint: 'Сотрудник',
             *       provider: new SbisPluginProvider()
             *    });
             * </pre>
             */
            provider: 'source.provider.sbis-business-logic',

            /**
             * @cfg {MetaConfig} Объект, хранящий названия свойств мета-данных, в которых хранится служебная информация, необходимая для формирования некоторых аргументов методов БЛ
             */
            metaConfig: {
               hasMore: 'hasMore'
            }
         },

         /**
          * @member {SBIS3.CONTROLS.Data.Source.Provider.SbisBusinessLogic} Объект, который умеет ходить на бизнес-логику, для смены порядковых номеров
          */
         _orderProvider: undefined
      },

      $constructor: function(cfg) {
         cfg = cfg || {};
         //Deprecated
         if ('strategy' in cfg && !('adapter' in cfg)) {
            this._options.adapter = cfg.strategy;
            Utils.logger.stack(this._moduleName + '::$constructor(): option "strategy" is deprecated and will be removed in 3.7.4. Use "adapter" instead.', 1);
         }
         if ('keyField' in cfg && !('idProperty' in cfg)) {
            this._options.idProperty = cfg.keyField;
            Utils.logger.stack(this._moduleName + '::$constructor(): option "keyField" is deprecated and will be removed in 3.7.4. Use "idProperty" instead.', 1);
         }
         if (!('endpoint' in cfg)) {
            if ('service' in cfg && typeof cfg.service === 'string' && !('resource' in cfg)) {
               Utils.logger.stack(this._moduleName + '::$constructor(): option "service" is deprecated and will be removed in 3.7.4. Use "endpoint.contract" instead.', 1);
               this._options.endpoint.contract = cfg.service;
            }
            if ('service' in cfg && typeof cfg.service === 'object') {
               Utils.logger.stack(this._moduleName + '::$constructor(): option "service" is deprecated and will be removed in 3.7.4. Use "endpoint.contract" and "endpoint.address" instead.', 1);
               this._options.endpoint.contract = cfg.service.name || '';
               this._options.endpoint.address = cfg.service.serviceUrl || undefined;
            }
            if ('resource' in cfg && typeof cfg.resource === 'object') {
               Utils.logger.stack(this._moduleName + '::$constructor(): option "resource" is deprecated and will be removed in 3.7.4. Use "endpoint.contract" and "endpoint.address" instead.', 1);
               this._options.endpoint.address = cfg.resource.serviceUrl || '';
               this._options.endpoint.contract = cfg.resource.name || '';
            }
         }
         if (!('binding' in cfg)) {
            if ('formatMethodName' in cfg) {
               Utils.logger.stack(this._moduleName + '::$constructor(): option "formatMethodName" is deprecated and will be removed in 3.7.4. Use "binding.format" instead.', 1);
               this._options.binding.format = cfg.formatMethodName;
            }
         }
      },

      //region SBIS3.CONTROLS.Data.Source.ISource

      /**
       * Создает пустую модель через источник данных
       * @param {Object|SBIS3.CONTROLS.Data.Model} [meta] Дополнительные мета данные
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет {@link SBIS3.CONTROLS.Data.Model}.
       * @see SBIS3.CONTROLS.Data.Source.ISource#create
       * @example
       * Получаем новую запись объекта 'Сотрудник':
       * <pre>
       *     var dataSource = new SbisService({
       *        endpoint: 'Сотрудник'
       *     });
       *     dataSource.create().addCallback(function(model) {
       *         var name = model.get('Имя');
       *     });
       * </pre>
       * Получаем новую запись объекта 'Сотрудник' с указанием формата:
       * <pre>
       *     var dataSource = new SbisService({
       *        endpoint: 'Сотрудник',
       *        binding: {
       *           format: 'СписокДляПрочитать'
       *        }
       *     });
       *     dataSource.create().addCallback(function(model) {
       *         var name = model.get('Имя');
       *     });
       * </pre>
       */
      create: function(meta) {
         return SbisService.superclass.create.call(this, meta);
      },

      destroy: function(keys, meta) {
         //Вызывает метод удаления для группы
         var destroyGroup = function(id, BLObjName, meta) {
            var provider = this.getProvider();
            if (BLObjName && this._options.endpoint.contract !== BLObjName) {
               provider = Di.resolve('source.provider.sbis-business-logic', {
                  endpoint: {
                     contract: BLObjName
                  }
               });
            }
            return this._makeCall(
               this._options.binding.destroy,
               this._prepareDestroyArguments(id, meta),
               provider
            );
         };

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
               pd.push(destroyGroup.call(
                  this,
                  groups[providerName],
                  providerName,
                  meta
               ));
            }
         }
         return pd.done().getResult();
      },

      //endregion SBIS3.CONTROLS.Data.Source.ISource

      //region SBIS3.CONTROLS.Data.Source.Base

      _prepareCallResult: function(data) {
         return SbisService.superclass._prepareCallResult.call(this, data, undefined, 'n');
      },

      //endregion SBIS3.CONTROLS.Data.Source.Base

      //region SBIS3.CONTROLS.Data.Source.Rpc

      //endregion SBIS3.CONTROLS.Data.Source.Rpc

      //region SBIS3.CONTROLS.Data.Source.Remote

      _prepareCreateArguments: function(meta) {
         //TODO: вместо 'ИмяМетода' может передаваться 'Расширение'
         if (meta === undefined) {
            meta = {
               'ВызовИзБраузера': true
            };
         }
         return {
            'Фильтр': this._buildRecord(meta),
            'ИмяМетода': this._options.binding.format || null
         };
      },

      _prepareReadArguments: function(key, meta) {
         var args = {
            'ИдО': key,
            'ИмяМетода': this._options.binding.format || null
         };
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = meta;
         }
         return args;
      },

      _prepareUpdateArguments: function(data, meta) {
         var args = {},
            argName = $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Collection.RecordSet') ? 'Записи' : 'Запись';
         args[argName] = data;
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = meta;
         }
         return args;
      },

      _prepareDestroyArguments: function(keys, meta) {
         var args = {
            'ИдО': keys
         };
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = meta;
         }
         return args;
      },

      _prepareMergeArguments: function(from, to) {
         return {
            'ИдО' : from,
            'ИдОУд': to
         };
      },

      _prepareCopyArguments: function(key, meta) {
         var args = {
            'ИдО': key,
            'ИмяМетода': this._options.binding.format
         };
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = meta;
         }
         return args;
      },

      _prepareQueryArguments: function(query) {
         return {
            'Фильтр': this._buildRecord(query ? query.getWhere() : null),
            'Сортировка': this._buildRecordSet(this._getSortingParams(query)),
            'Навигация': this._buildRecord(this._getPagingParams(query)),
            'ДопПоля': this._getAdditionalParams(query)
         };
      },

      //endregion SBIS3.CONTROLS.Data.Source.Remote

      //region Protected methods

      /**
       * Возвращает тип значения
       * @param {*} val Значение
       * @param {String} name Название
       * @param {Object} original Оригинальный объект
       * @returns {String|Object}
       * @protected
       */
      _getValueType: function (val, name, original) {
         if (this._isHierarhyField(name, original)) {
            if (name.slice(-1) in {'@': false, '$': false}) {
               return {
                  type: 'hierarchy',
                  kind: 'boolean'
               };
            } else {
               return {
                  type: 'hierarchy',
                  kind: 'identity'
               };
            }
         }

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
               } else if ($ws.helpers.instanceOfModule(val, 'SBIS3.CONTROLS.Data.Record')) {
                  return 'record';
               } else if (val instanceof $ws.proto.Record) {
                  return 'record';
               } else if ($ws.helpers.instanceOfModule(val, 'SBIS3.CONTROLS.Data.Collection.RecordSet')) {
                  return 'recordset';
               } else if (val instanceof Date) {
                  return 'datetime';
               } else if (val instanceof Array) {
                  return {
                     type: 'array',
                     kind: this._getValueType(val[0])
                  };
               }
               return 'object';
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
            field,
            hierarhyFields = {},
            sortNames = [];

         for (name in data) {
            if (data.hasOwnProperty(name)) {
               sortNames.push(name);
            }
         }
         sortNames = sortNames.sort();

         for (var i = 0, len = sortNames.length; i < len; i++) {
            name = sortNames[i];
            value = data[name];
            field = this._getValueType(value, name, data);
            if (!(field instanceof Object)) {
               field = {type: field};
            }
            field.name = name;
            record.addField(field, undefined, value);
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
            limit = query.getLimit(),
            meta = query.getMeta(),
            moreProp = this._options.metaConfig.hasMore,
            hasMoreProp = meta.hasOwnProperty(moreProp),
            more = hasMoreProp ? meta[moreProp] : offset >= 0;

         if (hasMoreProp) {
            delete meta[moreProp];
            query.meta(meta);
         }

         if (
            offset === 0 &&
            (limit === undefined || limit === null)
         ) {
            return null;
         }
         return {
            'Страница': limit > 0 ? Math.floor(offset / limit) : 0,
            'РазмерСтраницы': limit,
            'ЕстьЕще': more
         };
      },

      /**
       * Возвращает дополнительные параметры
       * @param {SBIS3.CONTROLS.Data.Query.Query} query Запрос
       * @returns {Array}
       * @protected
       */
      _getAdditionalParams: function (query) {
         var meta = [];
         if (query) {
            meta = query.getMeta();
            if (meta && $ws.helpers.instanceOfModule(meta, 'SBIS3.CONTROLS.Data.Record')) {
               meta = meta.toObject();
            }
            if (meta instanceof Object) {
               var arr = [];
               for (var key in meta) {
                  if (meta.hasOwnProperty(key)) {
                     arr.push(meta[key]);
                  }
               }
               meta = arr;
            }
            if (!(meta instanceof Array)) {
               throw new TypeError(this._moduleName + '::_getAdditionalParams(): unsupported metadata type: only Array, SBIS3.CONTROLS.Data.Record or Object allowed');
            }
         }

         return meta;
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
         return this._options.endpoint.contract;
      },

      //endregion Protected methods

      //region Deprecated

      /**
       * Возвращает аргументы списочного метода
       * @deprecated Метод будет удален в 3.7.4, используйте query()
       */
      prepareQueryParams : function(filter, sorting, offset, limit, hasMore){
         var query = new Query(),
            args;

         query.where(filter)
            .offset(hasMore === undefined ? offset : hasMore)
            .limit(limit)
            .orderBy(sorting)
            .meta(hasMore === undefined ? {} : {hasMore: hasMore});

         args = {
            'Фильтр': this._buildRecord(query ? query.getWhere() : null),
            'Сортировка': this._buildRecordSet(this._getSortingParams(query)),
            'Навигация': this._buildRecord(this._getPagingParams(query)),
            'ДопПоля': this._getAdditionalParams(query)
         };

         return this.getAdapter().serialize(args);
      },

      _isHierarhyField: function(name, original){
         if(name && original) {
            if (name.slice(-1) in {'@': false, '$': false}) {
               name = name.slice(0, -1);
            }
            if (original.hasOwnProperty(name) && original.hasOwnProperty(name + '@') && original.hasOwnProperty(name + '$')) {
               return true;
            }
         }
         return false;
      }
      //endregion Deprecated
   });

   Di.register('source.sbis-service', SbisService);

   return SbisService;
});
