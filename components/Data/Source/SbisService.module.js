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
    *     });
    * </pre>
    * <pre>
    *     var dataSource = new SbisService({
    *         resource: 'СообщениеОтКлиента',
    *         idProperty: '@СообщениеОтКлиента',
    *         queryMethodName: 'СписокОбщий',
    *         formatMethodName: 'Список'
    *         readMethodName: 'Прочитать'
    *     });
    * </pre>
    */

   var SbisService = Base.extend(/** @lends SBIS3.CONTROLS.Data.Source.SbisService.prototype */{
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
             */
            resource: '',

            /**
             * @cfg {String} Поле модели, содержащее первичный ключ
             */
            idProperty: '',

            /**
             * @cfg {SBIS3.CONTROLS.Data.Adapter.IAdapter} Адаптер для работы с данными, по умолчанию SBIS3.CONTROLS.Data.Adapter.Sbis
             */
            adapter: undefined,

            /**
             * @cfg {String} Имя метода, который используется для получения выборки. По умолчанию 'Список'.
             * @see getQueryMethodName
             * @see setQueryMethodName
             * @see query
             */
            queryMethodName: 'Список',

            /**
             * @cfg {String} Имя метода, который используется для создания записи. По умолчанию 'Создать'.
             * @see getCreateMethodName
             * @see setCreateMethodName
             * @see create
             */
            createMethodName: 'Создать',

            /**
             * @cfg {String} Имя метода, который используется для чтения записи. По умолчанию 'Прочитать'.
             * @see getReadMethodName
             * @see setReadMethodName
             * @see read
             */
            readMethodName: 'Прочитать',

            /**
             * @cfg {String} Имя метода, который используется для обновления записи. По умолчанию 'Записать'.
             * @see getUpdateMethodName
             * @see setUpdateMethodName
             * @see update
             */
            updateMethodName: 'Записать',

            /**
             * @cfg {String} Имя метода, который используется для удаления записи . По умолчанию 'Удалить'.
             * @see getDestroyMethodName
             * @see setDestroyMethodName
             * @see destroy
             */
            destroyMethodName: 'Удалить',

            /**
             * @cfg {String} Имя метода, который будет вызываться для копирования записей. По умолчанию 'Копировать'.
             * @see getCopyMethodName
             * @see setCopyMethodName
             * @see copy
             */
            copyMethodName: 'Копировать',

            /**
             * @cfg {String} Имя метода, который будет вызываться для объединения записей. По умолчанию 'Объединить'.
             * @see getMergeMethodName
             * @see setMergeMethodName
             * @see merge
             */
            mergeMethodName: 'Объединить',

            /**
             * @cfg {String|ResourceConfig} Имя объекта бизнес-логики, реализующего перемещение записей. По умолчанию 'ПорядковыйНомер'.
             * @example
             * <pre>
             *    <option name="moveResource">ПорядковыйНомер</option>
             * </pre>
             * @see getMoveResource
             * @see setMoveResource
             * @see move
             */
            moveResource: 'ПорядковыйНомер',

            /**
             * @cfg {String} Префикс имени метода, который используется для перемещения записи. По умолчанию 'Вставить'.
             * @see getMoveMethodPrefix
             * @see setMoveMethodPrefix
             * @see move
             */
            moveMethodPrefix: 'Вставить',

            /**
             * @cfg {String} Имя поля, по которому по умолчанию сортируются записи выборки. По умолчанию 'ПорНомер'.
             * @see getMoveDefaultColumn
             * @see setMoveDefaultColumn
             * @see move
             */
            moveDefaultColumn: 'ПорНомер',

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
          * @var {SBIS3.CONTROLS.SbisServiceSource/resources/SbisServiceBLO} Объект, который умеет ходить на бизнес-логику
          */
         _provider: undefined,

         /**
          * @var {SBIS3.CONTROLS.SbisServiceSource/resources/SbisServiceBLO} Объект, который умеет ходить на бизнес-логику, для смены порядковых номеров
          */
         _orderProvider: undefined
      },

      $constructor: function(cfg) {
         cfg = cfg || {};
         
         this._options.adapter = cfg.adapter || new SbisAdapter();
         
         if ('service' in cfg && !cfg.resource) {
            this._options.resource = cfg.resource = cfg.service;
         }

         if (this._options.resource && typeof this._options.resource !== 'object') {
            this._options.resource = {
               name: this._options.resource
            };
         }
         this._provider = new SbisServiceBLO(this._options.resource);

         this.setMoveResource(this._options.moveResource);
      },

      //region SBIS3.CONTROLS.Data.Source.ISource

      /**
       * Создает пустую модель через источник данных
       * @param {Object|SBIS3.CONTROLS.Data.Model} [meta] Дополнительные мета данные
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет {@link SBIS3.CONTROLS.Data.Model}.
       * @example
       * <pre>
       *     var dataSource = new SbisService({
       *         resource: 'Сотрудник'
       *         formatMethodName: 'СписокДляСоздать'
       *     });
       *     dataSource.create().addCallback(function(model) {
       *         var name = model.get('Имя');
       *     });
       * </pre>
       */
      create: function(meta) {
         var args = {
            'Фильтр': this._buildRequestField(meta, {
               'ВызовИзБраузера': true
            }),
            'ИмяМетода': this._options.formatMethodName
         };

         return this._provider.callMethod(
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
       */
      read: function(key, meta) {
         var args = {
            'ИдО': key,
            'ИмяМетода': this._options.formatMethodName
         };
         if (!Object.isEmpty(meta)) {
            args['ДопПоля'] = this._buildRequestField(meta);
         }

         return this._provider.callMethod(
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
       */
      update: function(model, meta) {
         var args = {
            'Запись': this._buildRequestField(model)
         };
         if (!Object.isEmpty(meta)) {
            args['ДопПоля'] = this._buildRequestField(meta);
         }
         this._detectIdProperty(model.getRawData());

         return this._provider.callMethod(
            this._options.updateMethodName,
            args
         ).addCallbacks((function (key) {
            if (!model.isStored()) {
               model.set(this._options.idProperty, key);
            }
            model.setStored(true);
            return key;
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::update()', error);
            return error;
         });
      },

      /**
       * Удаляет модель из источника данных
       * @param {String} key Первичный ключ модели
       * @param {Object|SBIS3.CONTROLS.Data.Model} [meta] Дополнительные мета данные
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения
       */
      destroy: function(key, meta) {
         var self = this;
         if ($ws.helpers.type(keys) == 'array') {
            var providers = [],
               ids = [];
            $ws.helpers.forEach(keys, function(key) {
               //группируем идентификаторы по объекту
               var obj = self._getProviderNameById(key),
                  index = Array.indexOf(providers, obj);
               if (index !== -1) {
                  ids[index].push(parseInt(key, 10));
               } else {
                  providers.push(obj);
                  ids.push([parseInt(key, 10)]);
               }
            });
            var pd = new $ws.proto.ParallelDeferred();
            $ws.helpers.forEach(providers, function(provider, index) {
               pd.push(self._destroy(ids[index], provider));
            });
            return pd.done().getResult();
         } else {
            var provider = self._getProviderNameById(keys);
            return self._destroy(parsetInt(keys, 10), provider);

         }
      },

      merge: function(first, second) {
         return this._provider.callMethod(
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
         if (!Object.isEmpty(meta)) {
            args['ДопПоля'] = this._buildRequestField(meta);
         }

         return this._provider.callMethod(
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
         return this._provider.callMethod(
            this._options.queryMethodName, {
               'Фильтр': !query || Object.isEmpty(query.getWhere()) ? null : this._options.adapter.serialize(query.getWhere()),
               'Сортировка': this._options.adapter.serialize(this._getSortingParams(query)),
               'Навигация': this._options.adapter.serialize(this._getPagingParams(query)),
               'ДопПоля': !query || Object.isEmpty(query.getMeta()) ? [] : this._options.adapter.serialize(query.getMeta())
            }
         ).addCallbacks((function (res) {
            return new DataSet({
               source: this,
               data: res,
               totalProperty: 'n'
            });
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::query()', error);
            return error;
         });
      },

      move: function (model, to, details) {
         details = details || {};
         this._detectIdProperty(model.getRawData());

         var self = this,
            def = new $ws.proto.Deferred(),
            params = this._getMoveParams(model, to, details),
            suffix = details.after ? 'До' : 'После';
         if (this._options.moveResource) {
            if (!this._orderProvider) {
               this._orderProvider = new SbisServiceBLO(this._options.moveResource);
            }
         } else {
            this._orderProvider = this._provider;
         }

         self._orderProvider.callMethod(this._options.moveMethodPrefix + suffix, params, $ws.proto.BLObject.RETURN_TYPE_ASIS).addCallbacks(function (res) {
            def.callback(res);
         }, function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::move()', error);
            def.errback(error);
         });
         return def;
      },

      /**
       * Выполняет команду
       * @param {String} command Команда
       * @param {Object|SBIS3.CONTROLS.Data.Model|SBIS3.CONTROLS.Data.Source.DataSet} [data] Данные
       * @returns {$ws.proto.Deferred} Асинхронный результат выполнения. В колбэке придет {@link SBIS3.CONTROLS.Data.Source.DataSet}.
       */
      call: function (command, data) {
         return this._provider.callMethod(
            command,
            this._buildRequestField(data)
         ).addCallbacks((function (res) {
            return new DataSet({
               source: this,
               data: res
            });
         }).bind(this), function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::call()', error);
            return error;
         });
      },

      //endregion SBIS3.CONTROLS.Data.Source.ISource

      //region Public methods

      /**
       * Возвращает имя метода, который используется для получения выборки
       * @returns {String}
       * @see setQueryMethodName
       * @see queryMethodName
       */
      getQueryMethodName: function () {
         return this._options.queryMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для получения выборки
       * @param {String} method
       * @see getQueryMethodName
       * @see queryMethodName
       */
      setQueryMethodName: function (method) {
         this._options.queryMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для создания записи
       * @returns {String}
       * @see setCreateMethodName
       * @see createMethodName
       */
      getCreateMethodName: function () {
         return this._options.createMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для создания записи
       * @param {String} method
       * @see getCreateMethodName
       * @see createMethodName
       */
      setCreateMethodName: function (method) {
         this._options.createMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для получения записи
       * @returns {String}
       * @see setReadMethodName
       * @see readMethodName
       */
      getReadMethodName: function () {
         return this._options.readMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для получения записи
       * @param {String} method
       * @see getReadMethodName
       * @see readMethodName
       */
      setReadMethodName: function (method) {
         this._options.readMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для обновления записи
       * @returns {String}
       * @see setUpdateMethodName
       * @see updateMethodName
       */
      getUpdateMethodName: function () {
         return this._options.updateMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для обновления записи
       * @param {String} method
       * @see getUpdateMethodName
       * @see updateMethodName
       */
      setUpdateMethodName: function (method) {
         this._options.updateMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для удаления записи
       * @returns {String}
       * @see setDestroyMethodName
       * @see destroyMethodName
       */
      getDestroyMethodName: function () {
         return this._options.destroyMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для удаления записи
       * @param {String} method
       * @see getDestroyMethodName
       * @see destroyMethodName
       */
      setDestroyMethodName: function (method) {
         this._options.destroyMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для копирования записи
       * @returns {String}
       * @see setCopyMethodName
       * @see copyMethodName
       */
      getCopyMethodName: function () {
         return this._options.copyMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для копирования записи
       * @param {String} method
       * @see getCopyMethodName
       * @see copyMethodName
       */
      setCopyMethodName: function (method) {
         this._options.copyMethodName = method;
      },

      /**
       * Возвращает имя метода, который используется для объединения записей
       * @returns {String}
       * @see setMergeMethodName
       * @see mergeMethodName
       */
      getMergeMethodName: function () {
         return this._options.mergeMethodName;
      },

      /**
       * Устанавливает имя метода, который используется для объединения записей
       * @param {String} method
       * @see getMergeMethodName
       * @see mergeMethodName
       */
      setMergeMethodName: function (method) {
         this._options.mergeMethodName = method;
      },

      /**
       * Возвращает имя объекта бизнес-логики, реализующего перемещение записей
       * @returns {String}
       * @see setMoveResource
       * @see moveResource
       */
      getMoveResource: function () {
         return this._options.moveResource;
      },

      /**
       * Устанавливает имя объекта бизнес-логики, реализующего перемещение записей
       * @param {String} name
       * @see getMoveResource
       * @see moveResource
       */
      setMoveResource: function (name) {
         if (name && typeof name !== 'object') {
            name = {
               name: name
            };
         }
         this._options.moveResource = name;
      },

      /**
       * Возвращает префикс имени метода, который используется для перемещения записи
       * @returns {String}
       * @see setMoveMethodPrefix
       * @see moveMethodPrefix
       */
      getMoveMethodPrefix: function () {
         return this._options.moveMethodPrefix;
      },

      /**
       * Устанавливает префикс имени метода, который используется для перемещения записи
       * @param {String} name
       * @see getMoveMethodPrefix
       * @see moveMethodPrefix
       */
      setMoveMethodPrefix: function (name) {
         this._options.moveMethodPrefix = name;
      },

      /**
       * Возвращает имя поля, по которому по умолчанию сортируются записи выборки
       * @returns {String}
       * @see setMoveDefaultColumn
       * @see moveDefaultColumn
       */
      getMoveDefaultColumn: function () {
         return this._options.moveDefaultColumn;
      },

      /**
       * Устанавливает имя поля, по которому по умолчанию сортируются записи выборки
       * @param {String} name
       * @see getMoveDefaultColumn
       * @see moveDefaultColumn
       */
      setMoveDefaultColumn: function (name) {
         this._options.moveDefaultColumn = name;
      },

      /**
       * Возвращает имя метода, который будет использоваться для получения формата записи
       * @returns {String}
       * @see setFormatMethodName
       * @see formatMethodName
       */
      getFormatMethodName: function () {
         return this._options.formatMethodName;
      },

      /**
       * Устанавливает имя метода, который будет использоваться для получения формата записи
       * @param {String} method
       * @see getFormatMethodName
       * @see formatMethodName
       */
      setFormatMethodName: function (method) {
         this._options.formatMethodName = method;
      },

      //endregion Public methods

      //region Protected methods

      /**
       * Возвращает сериализованные данные для установки в поле запроса
       * @param {Object|SBIS3.CONTROLS.Data.Model|SBIS3.CONTROLS.Data.Source.DataSet} data Данные для установки
       * @param {Object} defaults Значения по умолчанию
       * @returns {Object}
       * @private
       */
      _buildRequestField: function(data, defaults) {
         data = data || {};
         defaults = defaults || {};
         var result = {};
         if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Model')) {
            result = $ws.core.merge({
               _type: 'record'
            }, data.getRawData());
         } else if ($ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Data.Source.DataSet')) {
            result = $ws.core.merge({
               _type: 'recordset'
            }, data.getRawData());
         } else if (data && $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.Record')) {
            result = $ws.core.merge({
               _type: 'record'
            }, data.getRaw());
         } else if (data && $ws.helpers.instanceOfModule(data, 'SBIS3.CONTROLS.DataSet')) {
            result = $ws.core.merge({
               _type: 'recordset'
            }, data.getRawData());
         } else {
            $ws.core.merge(result, defaults);
            $ws.core.merge(result, data);
            result = this._options.adapter.serialize(result);
         }
         return result;
      },

      /**
       * Возвращает параметры сортировки
       * @param {SBIS3.CONTROLS.Data.Query.Query} query Запрос
       * @returns {Object|null}
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
       * Возвращает параметры перемещения записей
       * @param {SBIS3.CONTROLS.Data.Model} model Перемещаемая запись
       * @param {String} to Значение поля, в позицию которого перемещаем (по умолчанию - значение первичного ключа)
       * @param {SBIS3.CONTROLS.Data.Source.ISource#OrderDetails} [details] Дополнительная информация о перемещении
       * @returns {Object}
       * @private
       */
      _getMoveParams: function(model, to, details) {
         details = details || {};
         var objectName = this._options.resource.name,
            params = {
            'ИдО': [model.get(this._options.idProperty), objectName],
            'ПорядковыйНомер': details.column || this._options.moveDefaultColumn
         };
         if (details.hierColumn) {
            params['Иерархия'] = details.hierColumn;
         } else {
            params['Иерархия'] = null;
         }
         if (this._options.moveResource.name && this._options.moveResource.name !== objectName) {
            params['Объект'] = objectName;
         }

         if(details.after){
            params['ИдОПосле'] = [parseInt(to,10), objectName];
         } else {
            params['ИдОДо'] = [parseInt(to,10), objectName];
         }
         return params;
      },
      /**
       * Возвращает имя источника или имя объекта из сложного идентификатора
       * @private
       * @ret
       */
      _getProviderNameById: function (id) {
         if (String(id).indexOf(',')) {
            var ido = String(id).split(',');
            return ido[1];
         }
         return this._options.resource;
      },
      /**
       * вызвает метод удаления
       * @param {String|Array} id идентификатор объекта
       * @param {String} resource  название объекта бл у которго будет вызвано удаление
       * @returns {$ws.proto.Deferred}
       * @private
       */
      _destroy: function(id, resource) {
         var args = {
            'ИдО': id
         };
         if (!Object.isEmpty(meta)) {
            args['ДопПоля'] = meta;
         }
         var provider = this._provider;
         if (resource && this._options.resource !== resource) {
            provider = new SbisServiceBLO(resource);
         }
         return provider.callMethod(
            this._options.destroyMethodName,
            args
         ).addCallbacks(function(res) {
            return res;
         }, function (error) {
            $ws.single.ioc.resolve('ILogger').log('SBIS3.CONTROLS.Data.Source.SbisService::destroy()', error);
            return error;
         });
      }

      //endregion Protected methods
   });

   $ws.single.ioc.bind('SBIS3.CONTROLS.Data.Source.SbisService', function(config) {
      return new SbisService(config);
   });

   return SbisService;
});
