/* global define */
define('js!WS.Data/Source/SbisService', [
   'js!WS.Data/Source/Rpc',
   'js!WS.Data/Query/Query',
   'js!WS.Data/Entity/Record',
   'js!WS.Data/Entity/Model',
   'js!WS.Data/Di',
   'js!WS.Data/Utils',
   'js!WS.Data/Adapter/Sbis',
   'js!WS.Data/Source/Provider/SbisBusinessLogic',
   'js!WS.Data/Source/SbisDataSet',
   'Core/core-instance',
   'Core/core-merge',
   'Core/ParallelDeferred',
   'Core/IoC'
], function (
   Rpc,
   Query,
   Record,
   Model,
   Di,
   Utils,
   AdapterSbis,
   ProviderSbisBusinessLogic,
   SourceSbisDataSet,
   CoreInstance,
   coreMerge,
   ParallelDeferred,
   IoC
) {
   'use strict';

   var NAVIGATION_TYPE = coreMerge({
         POSITION: 'Position'
      }, Rpc.prototype.NAVIGATION_TYPE),
      SbisService;

   /**
    * Класс источника данных на сервисах бизнес-логики СБИС.
    * <br/>
    * <b>Пример 1</b>. Создадим источник данных для объекта БЛ:
    * <pre>
    *    var dataSource = new SbisService({
    *       endpoint: 'СообщениеОтКлиента'
    *    });
    * </pre>
    * <b>Пример 2</b>. Создадим источник данных для объекта БЛ, используя отельную точку входа:
    * <pre>
    *    var dataSource = new SbisService({
    *       endpoint: {
    *          address: '/my-service/entry/point/',
    *          contract: 'СообщениеОтКлиента'
    *       }
    *    });
    * </pre>
    * <b>Пример 3</b>. Создадим источник данных для объекта БЛ с указанием своих методов для чтения записи и списка записей, а также свой формат записи:
    * <pre>
    *    var dataSource = new SbisService({
    *       endpoint: 'СообщениеОтКлиента',
    *       binding: {
    *          read: 'Прочитать',
    *          query: 'СписокОбщий',
    *          format: 'Список'
    *       },
    *       idProperty: '@СообщениеОтКлиента'
    *    });
    * </pre>
    * <b>Пример 4</b>. Создадим новую статью:
    * <pre>
    *    var dataSource = new SbisService({
    *       endpoint: 'Статья',
    *       idProperty: 'id'
    *    });
    *
    *    dataSource.create().addCallback(function(article) {
    *       var id = article.getId();
    *    });
    * </pre>
    * <b>Пример 5</b>. Прочитаем статью:
    * <pre>
    *    var dataSource = new SbisService({
    *       endpoint: 'Статья',
    *       idProperty: 'id'
    *    });
    *
    *    dataSource.read('article-1').addCallback(function(article) {
    *       var title = article.get('title');
    *    });
    * </pre>
    * <b>Пример 6</b>. Сохраним статью:
    * <pre>
    *    var dataSource = new SbisService({
    *          endpoint: 'Статья',
    *          idProperty: 'id'
    *       }),
    *       article = new Model({
    *          adapter: 'adapter.sbis',
    *          format: [
    *             {name: 'id', type: 'integer'},
    *             {name: 'title', type: 'string'}
    *          ],
    *          idProperty: 'id'
    *       });
    *    article.set({
    *       id: 'article-1',
    *       title: 'Article 1'
    *    });
    *
    *    dataSource.update(article).addCallback(function() {
    *       alert('Article updated!');
    *    });
    * </pre>
    * <b>Пример 7</b>. Удалим статью:
    * <pre>
    *    var dataSource = new SbisService({
    *       endpoint: 'Статья',
    *       idProperty: 'id'
    *    });
    *
    *    dataSource.destroy('article-1').addCallback(function() {
    *       alert('Article deleted!');
    *    });
    * </pre>
    * <b>Пример 8</b>. Прочитаем первые сто статей:
    * <pre>
    *    var dataSource = new SbisService({
    *          endpoint: 'Статья'
    *       }),
    *       query = new Query();
    *
    *    query.limit(100);
    *    dataSource.query(query).addCallback(function(dataSet) {
    *       var articles = dataSet.getAll();
    *       alert('Articles count: ' + articles.getCount());
    *    });
    * </pre>
    * @class WS.Data/Source/SbisService
    * @extends WS.Data/Source/Rpc
    * @public
    * @ignoreMethods prepareQueryParams
    * @author Мальцев Алексей
    */

   SbisService = Rpc.extend(/** @lends WS.Data/Source/SbisService.prototype */{
      /**
       * @typedef {Object} Endpoint
       * @property {String} contract Контракт - определяет доступные операции
       * @property {String} [address] Адрес - указывает место расположения сервиса, к которому будет осуществлено подключение
       * @property {String} [moveContract=ПорядковыйНомер] Название объекта бл в которому принадлежат методы перемещения
       */
      /**
       * @typedef {Object} MetaConfig
       * @property {String} [hasMore=hasMore] Свойство мета-данных, отвечающий за поле 'ЕстьЕще' параметра 'Навигация' списочного метода
       */

      /** @typedef {Object} MoveMetaConfig
       * @property {Boolean} [before=false] Если true, то перемещаемая модель добавляется перед целевой моделью.
       */

      /**
       * @typedef {String} NavigationType
       * @variant Page По номеру страницы: передается номер страницы выборки и количество записей на странице.
       * @variant Offset По смещению: передается смещение от начала выборки и количество записей на странице.
       */
      //* @variant Position По курсору: передается набор значений ключевых полей начальной записи выборки, количество записей на странице и направление сортировки.

      _moduleName: 'WS.Data/Source/SbisService',

      /**
       * @cfg {Endpoint|String} Конечная точка, обеспечивающая доступ клиента к функциональным возможностям источника данных.
       * @name WS.Data/Source/SbisService#endpoint
       * @remark
       * Можно успользовать сокращенную запись, передав значение в виде строки - в этом случае оно будет
       * интерпретироваться как контракт (endpoint.contract).
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
       *          address: '/my-service/entry/point/',
       *          contract: 'Сотрудник'
       *       }
       *    });
       * </pre>
       */

      /**
       * @cfg {Object} Соответствие методов CRUD+ методам БЛ. Определяет, какой метод объекта БЛ соответствует каждому методу CRUD+.
       * @name WS.Data/Source/SbisService#binding
       * @remark
       * По умолчанию используются стандартные методы.
       * Можно переопределить имя объекта БЛ, указанное в endpont.contract, прописав его имя через точку.
       * @see getBinding
       * @see setBinding
       * @see create
       * @see read
       * @see destroy
       * @see query
       * @see copy
       * @see merge
       * @example
       * Зададим свои реализации для методов create, read и update:
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
       * Зададим реализацию для метода create на другом объекте БЛ:
       * <pre>
       *    var dataSource = new SbisService({
       *       endpoint: 'Сотрудник',
       *       binding: {
       *          create: 'Персонал.Создать'
       *       }
       *    });
       * </pre>
       */
      _$binding: {
         /**
          * @cfg {String} Имя метода для создания записи через {@link create}.
          * @name WS.Data/Source/SbisService#binding.create
          * @example
          * Зададим свою реализацию для метода create:
          * <pre>
          *    var dataSource = new SbisService({
          *       endpoint: 'Сотрудник',
          *       binding: {
          *          create: 'МойМетодСоздать'
          *       }
          *    });
          * </pre>
          * Зададим реализацию для метода create на другом объекте БЛ:
          * <pre>
          *    var dataSource = new SbisService({
          *       endpoint: 'Сотрудник',
          *       binding: {
          *          create: 'Персонал.Создать'
          *       }
          *    });
          * </pre>
          */
         create: 'Создать',

         /**
          * @cfg {String} Имя метода для чтения записи через {@link read}.
          * @name WS.Data/Source/SbisService#binding.read
          * @example
          * Зададим свою реализацию для метода read:
          * <pre>
          *    var dataSource = new SbisService({
          *       endpoint: 'Сотрудник',
          *       binding: {
          *          read: 'МойМетодПрочитать'
          *       }
          *    });
          * </pre>
          * Зададим реализацию для метода create на другом объекте БЛ:
          * <pre>
          *    var dataSource = new SbisService({
          *       endpoint: 'Сотрудник',
          *       binding: {
          *          read: 'Персонал.Прочитать'
          *       }
          *    });
          * </pre>
          */
         read: 'Прочитать',

         /**
          * @cfg {String} Имя метода для обновления записи через {@link update}.
          * @name WS.Data/Source/SbisService#binding.update
          * @example
          * Зададим свою реализацию для метода update:
          * <pre>
          *    var dataSource = new SbisService({
          *       endpoint: 'Сотрудник',
          *       binding: {
          *          update: 'МойМетодЗаписать'
          *       }
          *    });
          * </pre>
          * Зададим реализацию для метода update на другом объекте БЛ:
          * <pre>
          *    var dataSource = new SbisService({
          *       endpoint: 'Сотрудник',
          *       binding: {
          *          update: 'Персонал.Записать'
          *       }
          *    });
          * </pre>
          */
         update: 'Записать',

         /**
          * @cfg {String} Имя метода для обновления рекордсета через метод {@link update}. Если не указать, каждая запись будет обновлена отдельно.
          * @name WS.Data/Source/SbisService#binding.updateBatch
          */
         updateBatch: '',

         /**
          * @cfg {String} Имя метода для удаления записи через {@link destroy}.
          * @name WS.Data/Source/SbisService#binding.destroy
          * @example
          * Зададим свою реализацию для метода destroy:
          * <pre>
          *    var dataSource = new SbisService({
          *       endpoint: 'Сотрудник',
          *       binding: {
          *          destroy: 'МойМетодУдалить'
          *       }
          *    });
          * </pre>
          * Зададим реализацию для метода destroy на другом объекте БЛ:
          * <pre>
          *    var dataSource = new SbisService({
          *       endpoint: 'Сотрудник',
          *       binding: {
          *          destroy: 'Персонал.Удалить'
          *       }
          *    });
          * </pre>
          */
         destroy: 'Удалить',

         /**
          * @cfg {String} Имя метода для получения списка записей через {@link query}.
          * @name WS.Data/Source/SbisService#binding.query
          * @example
          * Зададим свою реализацию для метода query:
          * <pre>
          *    var dataSource = new SbisService({
          *       endpoint: 'Сотрудник',
          *       binding: {
          *          query: 'МойСписок'
          *       }
          *    });
          * </pre>
          * Зададим реализацию для метода query на другом объекте БЛ:
          * <pre>
          *    var dataSource = new SbisService({
          *       endpoint: 'Сотрудник',
          *       binding: {
          *          query: 'Персонал.Список'
          *       }
          *    });
          * </pre>
          */
         query: 'Список',

         /**
          * @cfg {String} Имя метода для копирования записей через {@link copy}.
          * @name WS.Data/Source/SbisService#binding.copy
          */
         copy: 'Копировать',

         /**
          * @cfg {String} Имя метода для объединения записей через {@link merge}.
          * @name WS.Data/Source/SbisService#binding.merge
          */
         merge: 'Объединить',

         /**
          * @cfg {String} Имя метода перемещения записи перед указанной через метод {@link move}.
          * @name WS.Data/Source/SbisService#binding.move
          */
         move: 'Move',
         /**
          * @cfg {String} Имя метода для получения формата записи через {@link create}, {@link read} и {@link copy}. Метод должен быть декларативным.
          * @name WS.Data/Source/SbisService#binding.format
          */
         format: ''
      },

      /**
       * @cfg {String|Function|WS.Data/Adapter/IAdapter} Адаптер для работы с данными. Для работы с БЛ всегда используется адаптер {@link WS.Data/Adapter/Sbis}.
       * @name WS.Data/Source/SbisService#adapter
       * @see WS.Data/Source/ISource#adapter
       * @see getAdapter
       * @see setAdapter
       * @see WS.Data/Adapter/Sbis
       * @see WS.Data/Di
       */
      _$adapter: 'adapter.sbis',

      /**
       * @cfg {String|Function|WS.Data/Source/Provider/IRpc} Объект, реализующий сетевой протокол для обмена в режиме клиент-сервер, по умолчанию {@link WS.Data/Source/Provider/SbisBusinessLogic}.
       * @name WS.Data/Source/SbisService#provider
       * @see WS.Data/Source/Rpc#provider
       * @see getProvider
       * @see WS.Data/Di
       * @example
       * Используем провайдер нотификатора:
       * <pre>
       *    define(['js!Plugin.Data.Source.Provider.SbisPlugin'], function (SbisPluginProvider) {
       *       var dataSource = new SbisService({
       *          endpoint: 'Сотрудник',
       *          provider: new SbisPluginProvider()
       *       });
       *    });
       * </pre>
       */
      _$provider: 'source.provider.sbis-business-logic',

      /**
       * @cfg {MetaConfig} Объект, хранящий названия свойств мета-данных, в которых хранится служебная информация, необходимая для формирования некоторых аргументов методов БЛ.
       * @name WS.Data/Source/SbisService#metaConfig
       */
      _$metaConfig: {
         hasMore: 'hasMore'
      },

      /**
       * @cfg {String} Имя поля, по которому по умолчанию сортируются записи выборки. По умолчанию 'ПорНомер'.
       * @name WS.Data/Source/SbisService#orderProperty
       * @see move
       */
      _$orderProperty: 'ПорНомер',

      _dataSetModule: 'source.sbis-dataset',
      _dataSetItemsProperty: '',
      _dataSetTotalProperty: 'n',

      /**
       /**
       * @member {WS.Data/Source/Provider/SbisBusinessLogic} Объект, который умеет ходить на бизнес-логику, для смены порядковых номеров
       */
      _moveProvider: 'source.provider.sbis-business-logic',

      constructor: function $SbisService(options) {
         options = options || {};

         if (options.binding instanceof Object) {
            this._$binding = coreMerge(options.binding, this._$binding || {}, {preferSource: true, clone: true});
         }

         if (options.metaConfig instanceof Object) {
            this._$metaConfig = coreMerge(options.metaConfig, this._$metaConfig || {}, {preferSource: true, clone: true});
         }

         SbisService.superclass.constructor.call(this, options);

         if (!this._$endpoint.moveContract ) {
            this._$endpoint.moveContract = 'IndexNumber';
         }
      },

      //region WS.Data/Source/ISource

      /**
       * Создает пустую модель через источник данных
       * @param {Object|WS.Data/Entity/Record} [meta] Дополнительные мета данные, которые могут понадобиться для создания модели
       * @return {Core/Deferred} Асинхронный результат выполнения. В колбэке придет {@link WS.Data/Entity/Model}.
       * @see WS.Data/Source/ISource#create
       * @example
       * Создадим нового сотрудника:
       * <pre>
       *     var dataSource = new SbisService({
       *        endpoint: 'Сотрудник',
       *        idProperty: '@Сотрудник'
       *     });
       *     dataSource.create().addCallback(function(employee) {
       *         var name = employee.get('Имя');
       *     });
       * </pre>
       * Создадим нового сотрудника по формату:
       * <pre>
       *     var dataSource = new SbisService({
       *        endpoint: 'Сотрудник',
       *        idProperty: '@Сотрудник',
       *        binding: {
       *           format: 'СписокДляПрочитать'
       *        }
       *     });
       *     dataSource.create().addCallback(function(employee) {
       *         var name = employee.get('Имя');
       *     });
       * </pre>
       */
      create: function(meta) {
         return SbisService.superclass.create.call(this, meta);
      },

      update: function(data, meta) {
         if (!CoreInstance.instanceOfModule(data, 'WS.Data/Collection/RecordSet')) {
            return SbisService.superclass.update.call(this, data, meta);
         }

         if (this._$binding.updateBatch) {
            return this._makeCall(
               this._$binding.updateBatch,
               this._prepareUpdateArguments(data, meta)
            ).addCallback((function (key) {
               return this._prepareUpdateResult(data, key);
            }).bind(this));
         }

         var def = new ParallelDeferred();
         data.each(function(record) {
            def.push(SbisService.superclass.update.call(this, record, meta));
         }.bind(this));

         return def.done().getResult();
      },

      destroy: function(keys, meta) {
         //Вызывает метод удаления для группы
         var destroyGroup = function(id, BLObjName, meta) {
            var provider = this.getProvider();
            if (BLObjName && this._$endpoint.contract !== BLObjName) {
               provider = Di.create('source.provider.sbis-business-logic', {
                  endpoint: {
                     contract: BLObjName
                  }
               });
            }
            return this._makeCall(
               this._$binding.destroy,
               this._prepareDestroyArguments(id, meta),
               provider
            );
         };

         if (!(keys instanceof Array)) {
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
         var pd = new ParallelDeferred();
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

      move: function (items, target, meta) {
         meta = meta || {};
         if (this._$binding.moveBefore) {
            //todo поддерживаем старый способ с двумя методами
            return this._oldMove(items, target, meta);
         }
         var groups = {};
         //на бл не могут принять массив сложных идентификаторов,
         //поэтому надо сгуппировать идентификаторы по объекту и для каждой группы позвать метод
         items.forEach(function(id) {
            var id = String.prototype.split.call(id, ',', 2),
               name = (id.length > 1) ? id[1] : this._$endpoint.contract;
            if (!groups.hasOwnProperty(name)) {
               groups[name] = [id[0]];
            } else {
               groups[name].push(id[0]);
            }
         }.bind(this));
         var pd = new ParallelDeferred();
         for (var name in groups) {
            if (groups.hasOwnProperty(name)) {
               meta.objectName = name;
               pd.push(this._makeCall(
                  this._$binding.move,
                  this._prepareMoveArguments(groups[name], target, meta),
                  this._getMoveProvider()
               ));
            }
         }
         return pd.done().getResult();
      },
      //поддержкиваем для старого
      _oldMove: function(from, to, meta) {
         var moveMethod = meta.before ? this._$binding.moveBefore: this._$binding.moveAfter;
         var params = {
            'ПорядковыйНомер': this._$orderProperty,
            'Иерархия': meta.hierField || null,
            'Объект': this._$endpoint.moveContract,
            'ИдО': this._prepareComplexId(from)
         };
         Utils.logger.info(this._moduleName, 'Move elements through moveAfter and moveBefore methods have been deprecated, please use just move instead.');
         params[meta.before ? 'ИдОДо' : 'ИдОПосле'] = this._prepareComplexId(to);

         return this._makeCall(
            moveMethod,
            params,
            this._getMoveProvider()
         );
      },
      //endregion WS.Data/Source/ISource

      //region WS.Data/Source/Base

      _prepareCallResult: function(data) {
         return SbisService.superclass._prepareCallResult.call(this, data);
      },

      //endregion WS.Data/Source/Base

      //region WS.Data/Source/Rpc

      //endregion WS.Data/Source/Rpc

      //region WS.Data/Source/Remote

      _prepareCreateArguments: function(meta) {
         //TODO: вместо 'ИмяМетода' может передаваться 'Расширение'
         if (!(meta instanceof Record)) {
            meta = coreMerge({}, meta || {}, {clone: true});
            if (!('ВызовИзБраузера' in meta)) {
               meta['ВызовИзБраузера'] = true;
            }
         }

         return {
            'Фильтр': this._buildRecord(meta),
            'ИмяМетода': this._$binding.format || null
         };
      },

      _prepareReadArguments: function(key, meta) {
         var args = {
            'ИдО': key,
            'ИмяМетода': this._$binding.format || null
         };
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = meta;
         }
         return args;
      },

      _prepareUpdateArguments: function(data, meta) {
         var superArgs = SbisService.superclass._prepareUpdateArguments.call(this, data, meta),
            args = {},
            recordArg = CoreInstance.instanceOfModule(superArgs[0], 'WS.Data/Collection/RecordSet') ? 'Записи' : 'Запись';

         args[recordArg] = superArgs[0];

         if (superArgs[1] && !Object.isEmpty(superArgs[1])) {
            args['ДопПоля'] = superArgs[1];
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
            'ИмяМетода': this._$binding.format
         };
         if (meta && !Object.isEmpty(meta)) {
            args['ДопПоля'] = meta;
         }
         return args;
      },

      _prepareQueryArguments: function(query) {
         var nav = this._getPagingParams(query),
            filter = query ? query.getWhere() : null,
            sort = this._getSortingParams(query),
            add = this._getAdditionalParams(query);

         return {
            'Фильтр': this._buildRecord(filter),
            'Сортировка': this._buildRecordSet(sort),
            'Навигация': this._buildRecord(nav),
            'ДопПоля': add
         };
      },

      /**
       * Возвращает параметры перемещения записей
       * @param {String} items Значение поля, в позицию которого перемещаем (по умолчанию - значение первичного ключа)
       * @param {String} target Значение поля, в позицию которого перемещаем (по умолчанию - значение первичного ключа)
       * @param {Boolean} meta Дополнительная информация о перемещении
       * @return {Object}
       * @protected
       */
      _prepareMoveArguments: function(items, target, meta) {
         var params = {
            IndexNumber: this._$orderProperty,
            HierarchyName: meta.parentProperty || null,
            ObjectName: meta.objectName,
            ObjectId: items,
            DestinationId: target,
            Order: meta.position
         };
         return params;
      },


      //endregion WS.Data/Source/Remote

      //region Protected methods


      /**
       * Строит запись из объекта
       * @param {Object.<String, *>|WS.Data/Entity/Record} data Данные полей записи
       * @return {SBIS3.CONTROL.Data.Record|null}
       * @protected
       */
      _buildRecord: function (data) {
         return Model.fromObject(data, this._$adapter);
      },

      /**
       * Строит рекодсет из массива
       * @param {Array.<Object.<String, *>>|WS.Data/Collection/RecordSet} data Данные рекордсета
       * @return {WS.Data/Collection/RecordSet|null}
       * @protected
       */
      _buildRecordSet: function (data) {
         if (data === null) {
            return data;
         }
         if (data && CoreInstance.instanceOfModule(data, 'WS.Data/Collection/RecordSet')) {
            return data;
         }

         var recordset = this._getListInstance(null),
            count = data.length || 0,
            i;

         recordset.setAdapter(this._$adapter);
         for (i = 0; i < count; i++) {
            recordset.add(this._buildRecord(data[i]));
         }

         return recordset;
      },

      /**
       * Возвращает параметры сортировки
       * @param {WS.Data/Query/Query} query Запрос
       * @return {Array|null}
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
       * @param {WS.Data/Query/Query} query Запрос
       * @return {Object|null}
       * @protected
       */
      _getPagingParams: function (query) {
         if (!query) {
            return null;
         }
         var offset = query.getOffset(),
            limit = query.getLimit(),
            meta = query.getMeta(),
            moreProp = this._$metaConfig.hasMore,
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

         switch (this._$options.navigationType) {
            case this.NAVIGATION_TYPE.PAGE:
               return {
                  'Страница': limit > 0 ? Math.floor(offset / limit) : 0,
                  'РазмерСтраницы': limit,
                  'ЕстьЕще': more
               };

            case this.NAVIGATION_TYPE.POSITION:
               var where = query.getWhere(),
                  pattern = /(.+)([<>]=)$/,
                  fields = null,
                  order = '',
                  parts;

               Object.keys(where).forEach(function(expr) {
                  parts = expr.match(pattern);
                  if (parts) {
                     if (!fields) {
                        fields = {};
                     }
                     fields[parts[1]] = where[expr];
                     if (!order) {
                        switch (parts[2]) {
                           case '<=':
                              order = 'desc';
                              break;
                           default:
                              order = 'asc';
                        }
                     }
                     delete where[expr];//delete in query by link
                  }
               });
               order = order || 'asc';

               return {
                  HaveMore: more,
                  Limit: limit,
                  Order: order,
                  Position: this._buildRecord(fields)
               };

            default:
               return {
                  Offset: offset || 0,
                  Limit: limit,
                  'ЕстьЕще': more
               };
         }
      },

      /**
       * Возвращает дополнительные параметры
       * @param {WS.Data/Query/Query} query Запрос
       * @return {Array}
       * @protected
       */
      _getAdditionalParams: function (query) {
         var meta = [];
         if (query) {
            meta = query.getMeta();
            if (meta && CoreInstance.instanceOfModule(meta, 'WS.Data/Entity/Record')) {
               var obj = {};
               meta.each(function(key, value) {
                  obj[key] = value;
               });
               meta = obj;
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
               throw new TypeError(this._moduleName + '::_getAdditionalParams(): unsupported metadata type: only Array, WS.Data/Entity/Record or Object allowed');
            }
         }

         return meta;
      },

      /**
       * Возвращает имя объекта бл из сложного идентификатора или имя объекта из источника, для простых идентификаторов
       * @param id - Идентификатор записи
       * @return {String}
       * @protected
       */
      _getProviderNameById: function (id) {
         if (String(id).indexOf(',') !== -1) {
            var ido = String(id).split(',');
            return ido[1];
         }
         return this._$endpoint.contract;
      },

      /**
       * Подготавливает сложный идентификатор
       * @param id
       * @protected
       */
      _prepareComplexId: function (id){
         var preparedId = String.prototype.split.call(id, ',', 2);
         if (preparedId.length < 2) {
            preparedId.push( this._$endpoint.contract);
         }
         return preparedId;
      },

      /**
       * Возвращает объект, реализующий сетевой протокол для обмена в режиме клиент-сервер
       * @return {WS.Data/Source/Provider/IAbstract}
       * @protected
       * @see provider
       */
      _getMoveProvider: function() {
         return this._moveProvider = this._getProvider(this._moveProvider, {
            endpoint: {
               address: this._$endpoint.address,
               contract: this._$endpoint.moveContract
            },
            options: this._$options
         });
      },

      //endregion Protected methods

      //region Deprecated methods

      /**
       * Возвращает аргументы списочного метода
       * @deprecated Метод будет удален в версии платформы СБИС 3.7.6, используйте query()
       */
      prepareQueryParams: function(filter, sorting, offset, limit, hasMore) {
         Utils.logger.stack(this._moduleName + '::prepareQueryParams(): method is deprecated and will be removed in 3.7.6. Use query() instead.', 0, 'error');
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
      }

      //endregion Deprecated methods
   });

   SbisService.prototype.NAVIGATION_TYPE = SbisService.NAVIGATION_TYPE = NAVIGATION_TYPE;

   Di.register('source.sbis-service', SbisService);
   IoC.bindSingle('source.sbis-service', SbisService);
   return SbisService;
});
